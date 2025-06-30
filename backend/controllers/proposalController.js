const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');
const Grant = require('../models/Grant');

// POST /api/proposals - Submit new proposal
exports.submitProposal = async (req, res, next) => {
  try {
    const { 
      title, 
      abstract, 
      deadline, 
      funding, 
      category, 
      grant,
      objectives,
      methodology,
      timeline,
      expectedOutcomes,
      personnelCosts,
      equipmentCosts,
      materialsCosts,
      travelCosts,
      otherCosts
    } = req.body;

    if (!title || !abstract || !deadline || !funding || !category || !grant || !objectives || !methodology || !timeline) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Handle file uploads
    const filePaths = {};
    
    if (req.files) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Handle proposal document
      if (req.files.proposalDocument) {
        const file = req.files.proposalDocument;
        const fileName = `proposal_${Date.now()}_${file.name}`;
        const filePath = path.join(uploadsDir, fileName);
        await file.mv(filePath);
        filePaths.proposalDocument = fileName;
      }

      // Handle CV/Resume
      if (req.files.cvResume) {
        const file = req.files.cvResume;
        const fileName = `cv_${Date.now()}_${file.name}`;
        const filePath = path.join(uploadsDir, fileName);
        await file.mv(filePath);
        filePaths.cvResume = fileName;
      }

      // Handle additional documents
      if (req.files.additionalDocuments) {
        const additionalDocs = Array.isArray(req.files.additionalDocuments) 
          ? req.files.additionalDocuments 
          : [req.files.additionalDocuments];
        
        filePaths.additionalDocuments = [];
        for (const file of additionalDocs) {
          const fileName = `additional_${Date.now()}_${file.name}`;
          const filePath = path.join(uploadsDir, fileName);
          await file.mv(filePath);
          filePaths.additionalDocuments.push(fileName);
        }
      }
    }

    const proposal = await Proposal.create({
      title,
      abstract,
      objectives,
      methodology,
      timeline,
      expectedOutcomes,
      deadline,
      funding: parseInt(funding),
      category,
      grant,
      researcher: req.user.id,
      status: 'Under Review',
      dateSubmitted: new Date(),
      progress: 0,
      // Budget breakdown
      personnelCosts: parseInt(personnelCosts) || 0,
      equipmentCosts: parseInt(equipmentCosts) || 0,
      materialsCosts: parseInt(materialsCosts) || 0,
      travelCosts: parseInt(travelCosts) || 0,
      otherCosts: parseInt(otherCosts) || 0,
      // File paths
      ...filePaths
    });

    // --- Advanced Recommendation Algorithm ---
    let score = 0;
    const abstractLower = abstract.toLowerCase();

    // 1. Keywords (innovation, impact, feasibility): +10 each if present (max 30)
    const keywords = ["innovation", "impact", "feasibility"];
    for (const keyword of keywords) {
      if (abstractLower.includes(keyword)) score += 10;
    }

    // 2. Budget feasibility: +20 if proposal.budget <= grantFundingAmount
    let grantDoc;
    try {
      grantDoc = await Grant.findById(grant);
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching grant for recommendation.' });
    }
    if (grantDoc && parseInt(funding) <= grantDoc.funding) {
      score += 20;
    }

    // 3. Word count: +10 if abstract has at least 200 words
    const wordCount = abstract.trim().split(/\s+/).length;
    if (wordCount >= 200) score += 10;

    // 4. Clarity / Readability: +10 if average sentence length < 20 words
    const sentences = abstract.split(/[.!?]/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : wordCount;
    if (avgSentenceLength < 20) score += 10;

    // 5. Structure detection: +2 for each section found (max 10)
    const structureSections = ["introduction", "methodology", "outcomes", "impact", "budget"];
    let structureScore = 0;
    for (const section of structureSections) {
      if (abstractLower.includes(section)) structureScore += 2;
    }
    score += Math.min(structureScore, 10);

    // 6. Domain relevance: +10 if domain-specific keywords found
    const domainKeywords = ["renewable", "solar", "energy"];
    if (domainKeywords.some(k => abstractLower.includes(k))) score += 10;

    // 7. Grammar/spelling: +10 if ≤5 spelling errors (dummy function)
    function dummySpellCheck(text) {
      // Placeholder: always return 3 errors for demo
      return 3;
    }
    const spellingErrors = dummySpellCheck(abstract);
    if (spellingErrors <= 5) score += 10;

    // Cap score at 100
    score = Math.min(score, 100);

    // Recommendation
    let recommendation = "Not Recommended for Acceptance";
    if (score >= 60) recommendation = "Recommended for Acceptance";
    else if (score < 50) recommendation = "Not Recommended for Acceptance";
    else recommendation = "Borderline/Needs Revision";

    // Save to proposal
    proposal.recommendedScore = score;
    proposal.recommendation = recommendation;
    await proposal.save();

    res.status(201).json(proposal);
  } catch (err) {
    next(err);
  }
};

// GET /api/proposals/mine - Get proposals by researcher
exports.getMyProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ researcher: req.user.id }).sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) {
    next(err);
  }
};

// GET /api/proposals/grant/:grantId - Admin view proposals by grant
exports.getProposalsByGrant = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ grant: req.params.grantId })
      .populate('researcher', 'firstName lastName email institution')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) {
    next(err);
  }
};

// PUT /api/proposals/:proposalId/assign-reviewer - Assign a reviewer to a proposal
exports.assignReviewer = async (req, res, next) => {
  try {
    const { reviewerId } = req.body;
    
    // Update the proposal with reviewer assignment (don't change status - it's already 'Under Review')
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.proposalId,
      { 
        reviewer: reviewerId
        // Status remains 'Under Review' - no need to change it
      },
      { new: true }
    );
    
    if (!proposal) return res.status(404).json({ message: 'Proposal not found.' });
    
    // Create a Review document for this assignment
    const existingReview = await Review.findOne({ 
      proposal: req.params.proposalId, 
      reviewer: reviewerId 
    });
    
    if (!existingReview) {
      await Review.create({
        proposal: req.params.proposalId,
        reviewer: reviewerId,
        status: 'Pending' // Review is pending until reviewer submits
        // reviewDate will be set when review is submitted
      });
    }
    
    res.json(proposal);
  } catch (err) {
    next(err);
  }
};

