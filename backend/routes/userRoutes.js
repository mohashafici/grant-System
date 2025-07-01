const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/users - Get all users (admin only)
router.get('/', auth, authorizeRoles('admin'), userController.getAllUsers);
// GET /api/users/reviewers - Get all reviewers (admin only)
router.get('/reviewers', auth, authorizeRoles('admin'), userController.getAllReviewers);
// Add profile routes for current user
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);
// GET /api/users/:id - Get user by id (admin only)
router.get('/:id', auth, authorizeRoles('admin'), userController.getUserById);

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', auth, authorizeRoles('admin'), userController.updateUser);



module.exports = router; 