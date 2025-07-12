const User = require('../models/User');
const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// POST /api/users - Create new user (admin only)
exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, institution, department } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role || !institution) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      institution,
      department,
    });

    // Return user data without password, but include the temporary password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      institution: user.institution,
      department: user.department,
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
};

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

    // If password is being updated, hash it
    if (updateFields.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateFields.password, salt);
    }

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