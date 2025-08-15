const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');
const Grant = require('../models/Grant');
const { supabase } = require('../supabase');
const NotificationService = require('../services/notificationService');
const PDFDocument = require('pdfkit');


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

// GET /api/proposals/:id/award-letter - Generate award letter PDF
exports.generateAwardLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find the proposal and populate researcher data
    const proposal = await Proposal.findById(id).populate('researcher', 'firstName lastName email institution department');
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    // Check if proposal is approved
    if (proposal.status !== 'Approved') {
      return res.status(400).json({ message: 'Award letter can only be generated for approved proposals' });
    }
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Award_Letter_${proposal.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add header with blue background
    doc.rect(0, 0, 595, 100).fill('#3B82F6');
    
    // Institution name
    doc.fillColor('white')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('Grant Award System', 0, 30, { align: 'center', width: 595 });
    
    doc.fontSize(16)
       .text('Official Award Letter', 0, 60, { align: 'center', width: 595 });
    
    // Reset to black text
    doc.fillColor('black');
    
    // Date
    doc.fontSize(12)
       .font('Helvetica')
       .text(`Date: ${new Date().toLocaleDateString()}`, 0, 120);
    
    // Recipient
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('To:', 0, 150);
    
    doc.font('Helvetica')
       .text(`${proposal.researcher.firstName} ${proposal.researcher.lastName}`, 0, 170);
    doc.text(proposal.researcher.institution || 'Research Institution', 0, 185);
    if (proposal.researcher.department) {
      doc.text(proposal.researcher.department, 0, 200);
    }
    
    // Subject
    doc.font('Helvetica-Bold')
       .text('Subject: Grant Award Notification', 0, 230);
    
    // Congratulations message
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text('CONGRATULATIONS!', 0, 260, { align: 'center', width: 495 });
    
    doc.fontSize(12)
       .font('Helvetica');
    
    const congratulationsText = [
      'We are pleased to inform you that your research proposal has been approved for funding.',
      '',
      `Your proposal titled "${proposal.title}" submitted under the ${proposal.grantTitle || 'Research Grant'} has been selected for an award of $${proposal.funding.toLocaleString()}.`,
      '',
      'This recognition reflects the exceptional quality and innovation of your research work. Your proposal demonstrated outstanding merit and aligns perfectly with our mission to advance knowledge and create positive impact.'
    ];
    
    let yPosition = 290;
    congratulationsText.forEach(line => {
      if (line === '') {
        yPosition += 10;
      } else {
        doc.text(line, 0, yPosition, { width: 495, align: 'justify' });
        yPosition += 20;
      }
    });
    
    // Check if we need a new page
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    // Project Details
    yPosition += 20;
    doc.font('Helvetica-Bold')
       .text('Project Details:', 0, yPosition);
    yPosition += 20;
    doc.font('Helvetica');
    
    const details = [
      `Proposal Title: ${proposal.title}`,
      `Grant Program: ${proposal.grantTitle || 'Research Grant'}`,
      `Award Amount: $${proposal.funding.toLocaleString()}`,
      `Submission Date: ${proposal.dateSubmitted ? new Date(proposal.dateSubmitted).toLocaleDateString() : 'N/A'}`,
      `Approval Date: ${new Date().toLocaleDateString()}`
    ];
    
    details.forEach(detail => {
      doc.text(detail, 0, yPosition);
      yPosition += 20;
    });
    
    // Check if we need a new page for next steps
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    // Next Steps
    yPosition += 20;
    doc.font('Helvetica-Bold')
       .text('Next Steps:', 0, yPosition);
    yPosition += 20;
    doc.font('Helvetica');
    
    const nextSteps = [
      '1. You will receive detailed instructions for fund disbursement within 5-7 business days.',
      '2. Please ensure all required documentation is submitted promptly.',
      '3. Regular progress reports will be required as outlined in the grant terms.',
      '4. Contact our support team if you have any questions about the award process.'
    ];
    
    nextSteps.forEach(step => {
      doc.text(step, 0, yPosition, { width: 495, align: 'justify' });
      yPosition += 25;
    });
    
    // Check if we need a new page for signature
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    // Footer with signature
    yPosition += 30;
    doc.font('Helvetica-Bold')
       .text('Best regards,', 0, yPosition);
    yPosition += 30;
    
    // Add signature line
    doc.moveTo(0, yPosition)
       .lineTo(150, yPosition)
       .stroke();
    yPosition += 10;
    
    doc.text('Grant Award Committee', 0, yPosition);
    yPosition += 20;
    doc.font('Helvetica')
       .text('Grant Award System', 0, yPosition);
    
    // Finalize the PDF
    doc.end();
    
  } catch (err) {
    next(err);
  }
};