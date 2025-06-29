const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// POST /api/reviews/:proposalId - Submit review (reviewer only)
router.post('/:proposalId', auth, authorizeRoles('reviewer'), reviewController.submitReview);

// GET /api/reviews/assigned - Get assigned reviews (reviewer only)
router.get('/assigned', auth, authorizeRoles('reviewer'), reviewController.getAssignedReviews);

// GET /api/reviews/proposal/:proposalId - Get review for a specific proposal (reviewer only)
router.get('/proposal/:proposalId', auth, authorizeRoles('reviewer'), reviewController.getReviewByProposal);

module.exports = router;

