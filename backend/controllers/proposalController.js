const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');
const Grant = require('../models/Grant');
const { supabase } = require('../supabase');

// Simple spell check function using a dictionary approach
function spellCheckWithDictionary(text) {
  // Common English words dictionary (simplified)
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'research', 'innovation', 'technology', 'development', 'analysis', 'study', 'project',
    'methodology', 'approach', 'implementation', 'evaluation', 'assessment', 'review',
    'funding', 'grant', 'proposal', 'application', 'submission', 'deadline', 'timeline',
    'objectives', 'goals', 'outcomes', 'results', 'impact', 'benefits', 'advantages',
    'challenges', 'solutions', 'strategies', 'techniques', 'methods', 'processes',
    'data', 'information', 'knowledge', 'expertise', 'experience', 'background',
    'education', 'training', 'qualifications', 'certifications', 'publications',
    'conferences', 'workshops', 'seminars', 'collaborations', 'partnerships',
    'industry', 'academic', 'scientific', 'technical', 'professional', 'expert',
    'specialist', 'consultant', 'advisor', 'mentor', 'supervisor', 'director',
    'manager', 'coordinator', 'facilitator', 'researcher', 'scientist', 'engineer',
    'developer', 'designer', 'analyst', 'evaluator', 'reviewer', 'assessor',
    'innovative', 'creative', 'original', 'novel', 'unique', 'advanced', 'modern',
    'cutting-edge', 'state-of-the-art', 'breakthrough', 'revolutionary', 'transformative',
    'sustainable', 'environmental', 'ecological', 'green', 'renewable', 'energy',
    'efficient', 'effective', 'productive', 'successful', 'profitable', 'valuable',
    'important', 'significant', 'crucial', 'essential', 'vital', 'necessary',
    'required', 'mandatory', 'compulsory', 'obligatory', 'standard', 'normal',
    'typical', 'conventional', 'traditional', 'established', 'proven', 'tested',
    'verified', 'validated', 'confirmed', 'approved', 'accepted', 'endorsed',
    'recommended', 'suggested', 'proposed', 'planned', 'scheduled', 'organized',
    'structured', 'systematic', 'methodical', 'logical', 'rational', 'reasonable',
    'practical', 'feasible', 'achievable', 'attainable', 'realistic', 'viable',
    'workable', 'manageable', 'controllable', 'measurable', 'quantifiable',
    'observable', 'detectable', 'identifiable', 'recognizable', 'distinguishable',
    'comparable', 'similar', 'related', 'connected', 'linked', 'associated',
    'correlated', 'dependent', 'independent', 'autonomous', 'self-contained',
    'integrated', 'unified', 'coordinated', 'synchronized', 'harmonized',
    'optimized', 'maximized', 'minimized', 'reduced', 'increased', 'enhanced',
    'improved', 'upgraded', 'updated', 'modified', 'adjusted', 'adapted',
    'customized', 'personalized', 'tailored', 'designed', 'developed', 'created',
    'built', 'constructed', 'assembled', 'produced', 'manufactured', 'generated',
    'created', 'established', 'founded', 'launched', 'initiated', 'started',
    'begun', 'commenced', 'undertaken', 'pursued', 'conducted', 'performed',
    'executed', 'implemented', 'carried', 'completed', 'finished', 'accomplished',
    'achieved', 'attained', 'reached', 'obtained', 'gained', 'acquired',
    'secured', 'obtained', 'received', 'accepted', 'approved', 'granted',
    'awarded', 'allocated', 'assigned', 'distributed', 'provided', 'supplied',
    'delivered', 'transferred', 'conveyed', 'transmitted', 'communicated',
    'shared', 'exchanged', 'traded', 'bought', 'sold', 'purchased', 'acquired',
    'invested', 'funded', 'financed', 'sponsored', 'supported', 'backed',
    'endorsed', 'recommended', 'suggested', 'proposed', 'advocated', 'promoted',
    'marketed', 'advertised', 'publicized', 'announced', 'declared', 'stated',
    'expressed', 'conveyed', 'communicated', 'transmitted', 'delivered', 'presented',
    'demonstrated', 'illustrated', 'exemplified', 'showcased', 'highlighted',
    'emphasized', 'stressed', 'underscored', 'reinforced', 'strengthened',
    'enhanced', 'improved', 'upgraded', 'refined', 'polished', 'perfected',
    'optimized', 'maximized', 'minimized', 'reduced', 'increased', 'enhanced',
    'improved', 'upgraded', 'updated', 'modified', 'adjusted', 'adapted',
    'customized', 'personalized', 'tailored', 'designed', 'developed', 'created',
    'built', 'constructed', 'assembled', 'produced', 'manufactured', 'generated'
  ]);

  const words = text.toLowerCase().split(/\s+/);
  let errors = 0;
  
  for (const word of words) {
    // Clean the word (remove punctuation)
    const cleanWord = word.replace(/[^\w]/g, '');
    
    // Skip empty words, numbers, and very short words
    if (cleanWord.length === 0 || /^\d+$/.test(cleanWord) || cleanWord.length <= 2) {
      continue;
    }
    
    // Check if word is in dictionary
    if (!commonWords.has(cleanWord)) {
      errors++;
    }
  }
  
  return errors;
}

// Helper to upload a file buffer to Supabase Storage
async function uploadToSupabase(file, folder) {
  const fileName = `${folder}_${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('uploads') // your bucket name
    .upload(fileName, file.data, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;
  // Get public URL
  const { publicUrl } = supabase.storage.from('uploads').getPublicUrl(fileName).data;
  return publicUrl;
}

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
      // Proposal Document
      if (req.files.proposalDocument) {
        filePaths.proposalDocument = await uploadToSupabase(req.files.proposalDocument, 'proposal');
      }
      // CV/Resume
      if (req.files.cvResume) {
        filePaths.cvResume = await uploadToSupabase(req.files.cvResume, 'cv');
      }
      // Additional Documents
      if (req.files.additionalDocuments) {
        const additionalDocs = Array.isArray(req.files.additionalDocuments) 
          ? req.files.additionalDocuments 
          : [req.files.additionalDocuments];
        filePaths.additionalDocuments = [];
        for (const file of additionalDocs) {
          const url = await uploadToSupabase(file, 'additional');
          filePaths.additionalDocuments.push(url);
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

    // 7. Grammar/spelling: +10 if ≤5 spelling errors
    const spellingErrors = spellCheckWithDictionary(abstract);
    if (spellingErrors <= 5) score += 10;

    // Cap score at 100
    score = Math.min(score, 100);

    // Recommendation
    let recommendation = "Not Recommended for Acceptance";
    if (score >= 60) recommendation = "Recommended for Acceptance";
    else   recommendation = "Not Recommended for Acceptance";


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

// GET /api/proposals/mine/:id - Get a single proposal by ID for the logged-in researcher
exports.getMyProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, researcher: req.user.id });
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or access denied.' });
    }
    res.json(proposal);
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