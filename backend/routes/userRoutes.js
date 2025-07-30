const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorizeRoles, requireAdmin } = require('../middleware/authMiddleware');

// Get all users (admin only)
router.get('/', requireAdmin, userController.getAllUsers);

// GET /api/users/reviewers - Get all reviewers (admin only)
router.get('/reviewers', requireAdmin, userController.getAllReviewers);

// POST /api/users - Create new user (admin only)
router.post('/', requireAdmin, userController.createUser);

// Add profile routes for current user
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);

// GET /api/users/:id - Get user by id (admin only)
router.get('/:id', requireAdmin, userController.getUserById);

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', requireAdmin, userController.updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router; 