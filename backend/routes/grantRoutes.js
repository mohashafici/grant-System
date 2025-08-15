const express = require('express');
const router = express.Router();
const { getAllGrants, createGrant, getGrantById, updateGrant, deleteGrant } = require('../controllers/grantController');
const { requireAdmin } = require('../middleware/authMiddleware');

// GET /api/grants - Get all grants
router.get('/', getAllGrants);

// POST /api/grants - Create a new grant (admin only)
router.post('/', requireAdmin, createGrant);

// GET /api/grants/:id - Get grant details by ID
router.get('/:id', getGrantById);

// PUT /api/grants/:id - Update a grant (admin only)
router.put('/:id', requireAdmin, updateGrant);

// DELETE /api/grants/:id - Delete a grant (admin only)
router.delete('/:id', requireAdmin, deleteGrant);

module.exports = router;
