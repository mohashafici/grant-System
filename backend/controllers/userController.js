const User = require('../models/User');

// GET /api/users - Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id - Get user by ID (admin only)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id - Update user (admin only, no password change)
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, institution, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, role, institution, department },
      { new: true, runValidators: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/reviewers - Get all reviewers (admin only)
exports.getAllReviewers = async (req, res, next) => {
  try {
    const reviewers = await User.find({ role: 'reviewer' }, '-password').sort({ createdAt: -1 });
    res.json(reviewers);
  } catch (err) {
    next(err);
  }
}; 