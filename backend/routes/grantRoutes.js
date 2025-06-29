const express = require('express');
const router = express.Router();
const { getAllGrants, createGrant, getGrantById, updateGrant, deleteGrant } = require('../controllers/grantController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/grants - Get all grants
router.get('/', getAllGrants);

// POST /api/grants - Create a new grant (admin only)
router.post('/', auth, authorizeRoles('admin'), createGrant);

// GET /api/grants/:id - Get grant details by ID
router.get('/:id', getGrantById);

// PUT /api/grants/:id - Update a grant (admin only)
router.put('/:id', auth, authorizeRoles('admin'), updateGrant);

// DELETE /api/grants/:id - Delete a grant (admin only)
router.delete('/:id', auth, authorizeRoles('admin'), deleteGrant);

module.exports = router;
