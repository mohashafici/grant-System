const User = require('../models/User');
const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// POST /api/users - Create new user (admin only)
exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, institution, department, status } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role || !institution) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Get the full admin user information for audit trail
    const adminUser = await User.findById(req.user.id);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found.' });
    }

    // Create a new user instance. The pre-save hook in User.js will hash the password.
    const user = new User({
      firstName,
      lastName,
      email,
      password, // Pass plain-text password
      role,
      institution,
      department,
      status: status || 'active', // Default to active if not provided
      // Add audit trail for user creation
      lastModifiedBy: {
        adminId: adminUser._id,
        adminName: `${adminUser.firstName} ${adminUser.lastName}`,
        adminEmail: adminUser.email,
        modifiedAt: new Date(),
        changes: [{
          field: 'user_created',
          oldValue: 'N/A',
          newValue: `${firstName} ${lastName} (${email})`
        }]
      }
    });

    // Save the user to the database, which will trigger the pre-save hook
    await user.save();

    // Return user data without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      institution: user.institution,
      department: user.department,
      status: user.status || 'active',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isEmailVerified: user.isEmailVerified,
      lastModifiedBy: user.lastModifiedBy
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
    // For each user, add activity fields and ensure status exists
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
        status: user.status || 'active', // Ensure status exists
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
    
    // Ensure status exists
    const userData = {
      ...user.toObject(),
      status: user.status || 'active',
    };
    
    res.json(userData);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id - Update user (admin only, no password change)
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, institution, department, status } = req.body;
    
    // Get the current user data to track changes
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) return res.status(404).json({ message: 'User not found.' });

    // Prepare update data
    const updateData = { firstName, lastName, email, role, institution, department, status };
    
    // Track changes for audit trail
    const changes = [];
    
    // Get the full admin user information for audit trail
    const adminUser = await User.findById(req.user.id);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found.' });
    }
    
    // Compare each field and track changes
    if (firstName !== currentUser.firstName) {
      changes.push({
        field: 'firstName',
        oldValue: currentUser.firstName,
        newValue: firstName
      });
    }
    if (lastName !== currentUser.lastName) {
      changes.push({
        field: 'lastName',
        oldValue: currentUser.lastName,
        newValue: lastName
      });
    }
    if (email !== currentUser.email) {
      changes.push({
        field: 'email',
        oldValue: currentUser.email,
        newValue: email
      });
    }
    if (role !== currentUser.role) {
      changes.push({
        field: 'role',
        oldValue: currentUser.role,
        newValue: role
      });
    }
    if (institution !== currentUser.institution) {
      changes.push({
        field: 'institution',
        oldValue: currentUser.institution,
        newValue: institution
      });
    }
    if (department !== currentUser.department) {
      changes.push({
        field: 'department',
        oldValue: currentUser.department || '',
        newValue: department || ''
      });
    }
    if (status !== currentUser.status) {
      changes.push({
        field: 'status',
        oldValue: currentUser.status,
        newValue: status
      });
    }

    // Add audit trail if there are changes
    if (changes.length > 0) {
      updateData.lastModifiedBy = {
        adminId: adminUser.id,
        adminName: `${adminUser.firstName} ${adminUser.lastName}`,
        adminEmail: adminUser.email,
        modifiedAt: new Date(),
        changes: changes
      };
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true, select: '-password' }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    res.json({
      message: 'User updated successfully',
      user: user,
      changes: changes.length > 0 ? changes : null
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id - Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    // Check if user has any associated data (proposals, reviews, etc.)
    const hasProposals = await Proposal.exists({ researcher: userId });
    const hasReviews = await Review.exists({ reviewer: userId });
    
    if (hasProposals || hasReviews) {
      return res.status(400).json({ 
        message: 'Cannot delete user. User has associated proposals or reviews. Consider deactivating the account instead.',
        hasProposals,
        hasReviews
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });
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

    // Remove password field if it's empty to avoid hashing empty string
    if (updateFields.password === '') {
      delete updateFields.password;
    }

    // If password is being updated, hash it
    if (updateFields.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateFields.password, salt);
    }

    // Handle profile image upload (only if files are present)
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

    // Check if email is being updated and if it's already taken by another user
    if (updateFields.email) {
      const existingUser = await User.findOne({ email: updateFields.email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered by another user.' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    next(err);
  }
}; 