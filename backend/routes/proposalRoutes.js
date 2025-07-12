const express = require('express');
const router = express.Router();
const { submitProposal, getMyProposals, getProposalsByGrant, assignReviewer, getMyProposalById } = require('../controllers/proposalController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// POST /api/proposals - Submit new proposal
router.post('/', auth, submitProposal);

// GET /api/proposals/mine - Get proposals by researcher
router.get('/mine', auth, getMyProposals);
// GET /api/proposals/mine/:id - Get a single proposal by ID for the logged-in researcher
router.get('/mine/:id', auth, getMyProposalById);

// GET /api/proposals/grant/:grantId - Admin view proposals by grant
router.get('/grant/:grantId', auth, authorizeRoles('admin'), getProposalsByGrant);

// PUT /api/proposals/:proposalId/assign-reviewer - Assign reviewer to proposal
router.put('/:proposalId/assign-reviewer', auth, authorizeRoles('admin'), assignReviewer);

module.exports = router;

