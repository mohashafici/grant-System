const User = require('../models/User');
const Proposal = require('../models/Proposal');
const Review = require('../models/Review');

// GET /api/users - Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    // For each user, add activity fields
    const userStats = await Promise.all(users.map(async (user) => {
      let activity = {};
      if (user.role === 'researcher') {
        const proposals = await Proposal.countDocuments({ researcher: user._id });
        const approved = await Proposal.countDocuments({ researcher: user._id, status: 'Approved' });
        activity = { proposals, approved };
      } else if (user.role === 'reviewer') {
        const reviews = await Review.countDocuments({ reviewer: user._id, status: 'Completed' });
        activity = { reviews };
      }
      // For admin, activity can be left empty or static
      return {
        ...user.toObject(),
        activity,
      };
    }));
    res.json(userStats);
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

// GET /api/users/me - Get current user's profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me - Update current user's profile (with optional image upload)
exports.updateProfile = async (req, res, next) => {
  try {
    const updateFields = { ...req.body };
    // Handle profile image upload
    if (req.files && req.files.profileImage) {
      const path = require('path');
      const fs = require('fs');
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const file = req.files.profileImage;
      const fileName = `profile_${req.user.id}_${Date.now()}_${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      await file.mv(filePath);
      updateFields.profileImage = fileName;
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}; 