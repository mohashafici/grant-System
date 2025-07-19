const Review = require('../models/Review');
const Proposal = require('../models/Proposal');

// POST /api/reviews/:proposalId - Submit review
exports.submitReview = async (req, res, next) => {
  try {
    const { decision, score, comments } = req.body;
    if (!decision || !comments) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }
    
    // Find and update the existing review
    const review = await Review.findOneAndUpdate(
      { 
        proposal: req.params.proposalId, 
        reviewer: req.user.id 
      },
      {
        decision,
        score: score !== undefined ? parseFloat(score) : undefined,
        comments,
        reviewDate: new Date(),
        status: 'Completed'
      },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review assignment not found.' });
    }
    
    // Update proposal status based on review decision
    let proposalStatus = 'Under Review';
    if (decision === 'Approved') {
      proposalStatus = 'Approved';
    } else if (decision === 'Rejected') {
      proposalStatus = 'Rejected';
    } else if (decision === 'Revisions Requested') {
      proposalStatus = 'Needs Revision';
    }
    
    await Proposal.findByIdAndUpdate(req.params.proposalId, { status: proposalStatus });
    
    res.json(review);
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/assigned - Reviewer's assigned reviews
exports.getAssignedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate({
        path: 'proposal',
        populate: {
          path: 'researcher',
          select: 'firstName lastName email institution'
        }
      })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/proposal/:proposalId - Get review for a specific proposal
exports.getReviewByProposal = async (req, res, next) => {
  try {
    const review = await Review.findOne({ 
      proposal: req.params.proposalId, 
      reviewer: req.user.id 
    }).populate('proposal');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    
    res.json(review);
  } catch (err) {
    next(err);
  }
};

