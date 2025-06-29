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

    // --- Recommendation Algorithm ---
    let recommendedScore = 0;
    const keywords = ["innovation", "impact", "feasibility"];
    const abstractLower = abstract.toLowerCase();
    for (const keyword of keywords) {
      if (abstractLower.includes(keyword)) {
        recommendedScore += 10;
      }
    }
    // Get the grant's funding amount
    let grantDoc;
    try {
      grantDoc = await Grant.findById(grant);
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching grant for recommendation.' });
    }
    if (grantDoc && parseInt(funding) <= grantDoc.funding) {
      recommendedScore += 20;
    }
    // Count words in abstract
    const wordCount = abstract.trim().split(/\s+/).length;
    if (wordCount >= 200) {
      recommendedScore += 10;
    }
    // Recommendation text
    const recommendation = recommendedScore >= 40 ? "Recommended for Acceptance" : "Not Recommended for Acceptance";
    // Update proposal with recommendation fields
    proposal.recommendedScore = recommendedScore;
    proposal.recommendation = recommendation;
    await proposal.save();
    // Return proposal with recommendation fields
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

