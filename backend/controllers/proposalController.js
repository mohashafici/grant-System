const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');
const Grant = require('../models/Grant');
const { supabase } = require('../supabase');
const NotificationService = require('../services/notificationService');


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
    // Extract data from FormData (express-fileupload puts form fields in req.body)
    const title = req.body.title;
    const abstract = req.body.abstract;
    const grant = req.body.grant;
    const objectives = req.body.objectives;
    const methodology = req.body.methodology;
    const timeline = req.body.timeline;
    const expectedOutcomes = req.body.expectedOutcomes;
    const personnelCosts = req.body.personnelCosts;
    const equipmentCosts = req.body.equipmentCosts;
    const materialsCosts = req.body.materialsCosts;
    const travelCosts = req.body.travelCosts;
    const otherCosts = req.body.otherCosts;

    // Detailed validation with specific field messages
    const missingFields = [];
    if (!title || !title.trim()) missingFields.push('title');
    if (!abstract || !abstract.trim()) missingFields.push('abstract');
    if (!grant) missingFields.push('grant');
    if (!objectives || !objectives.trim()) missingFields.push('objectives');
    if (!methodology || !methodology.trim()) missingFields.push('methodology');
    if (!timeline || !timeline.trim()) missingFields.push('timeline');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Please fill all required fields. Missing: ${missingFields.join(', ')}` 
      });
    }

    // Get grant details to auto-fill category, funding, and deadline
    const grantDetails = await Grant.findById(grant);
    if (!grantDetails) {
      return res.status(400).json({ message: 'Selected grant not found.' });
    }

    // Validate budget breakdown - at least one category must be filled
    const totalBudget = (parseInt(personnelCosts) || 0) + (parseInt(equipmentCosts) || 0) + 
                       (parseInt(materialsCosts) || 0) + (parseInt(travelCosts) || 0) + 
                       (parseInt(otherCosts) || 0);
    
    if (totalBudget === 0) {
      return res.status(400).json({ message: 'Please fill at least one budget breakdown category.' });
    }

    // Validate that total budget equals grant funding
    if (totalBudget !== parseInt(grantDetails.funding)) {
      return res.status(400).json({ 
        message: `Total budget ($${totalBudget.toLocaleString()}) must equal grant funding ($${grantDetails.funding.toLocaleString()}).` 
      });
    }

    // Validate proposal document is uploaded
    if (!req.files || !req.files.proposalDocument) {
      return res.status(400).json({ message: 'Proposal document is required.' });
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
      deadline: grantDetails.deadline, // Use grant deadline
      funding: grantDetails.funding, // Use grant funding
      category: grantDetails.category, // Use grant category
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

    // Send notification to admins about new proposal
    try {
      await NotificationService.notifyProposalSubmitted(proposal);
    } catch (error) {
      console.error('Error sending proposal notification:', error);
    }

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
      const review = await Review.create({
        proposal: req.params.proposalId,
        reviewer: reviewerId,
        status: 'Pending' // Review is pending until reviewer submits
        // reviewDate will be set when review is submitted
      });

      // Send notification to reviewer about new assignment
      try {
        await NotificationService.notifyReviewAssigned(review, proposal);
      } catch (error) {
        console.error('Error sending review assignment notification:', error);
      }
    }
    
    res.json(proposal);
  } catch (err) {
    next(err);
  }
};