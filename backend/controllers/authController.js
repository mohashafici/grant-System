const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, institution, department } = req.body;
    if (!firstName || !lastName || !email || !password || !institution) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'researcher', // Default role for all new registrations
      institution,
      department,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken, firstName);
    
    if (!emailSent) {
      // If email fails, still create user but notify about email issue
      return res.status(201).json({
        message: 'Account created successfully! Please check your email for verification link. If you don\'t receive it, contact support.',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          institution: user.institution,
          department: user.department,
          isEmailVerified: false,
        },
        requiresVerification: true,
      });
    }

    res.status(201).json({
      message: 'Account created successfully! Please check your email for verification link.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        isEmailVerified: false,
      },
      requiresVerification: true,
    });
  } catch (err) {
    next(err);
  }
};

// Verify email endpoint
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
      isEmailVerified: false,
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token. Please request a new verification email.' 
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate JWT token for automatic login
    const jwtToken = generateToken(user);

    res.json({
      message: 'Email verified successfully! You can now log in to your account.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        isEmailVerified: true,
      },
      token: jwtToken,
    });
  } catch (err) {
    next(err);
  }
};

// Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email, isEmailVerified: false });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'No unverified account found with this email address.' 
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken, user.firstName);
    
    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again later.' 
      });
    }

    res.json({ 
      message: 'Verification email sent successfully! Please check your inbox.' 
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'No account found with that email address.' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    // Check if email is verified (only for new users who have verification fields)
    // Allow existing users (created before email verification) to login
    if (user.emailVerificationToken && !user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        requiresVerification: true,
        email: user.email,
      });
    }

    // Mark existing users as verified if they don't have verification fields
    // This handles users created before email verification was implemented
    if (!user.isEmailVerified && !user.emailVerificationToken) {
      user.isEmailVerified = true;
      await user.save();
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        isEmailVerified: user.isEmailVerified || true, // Default to true for existing users
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};


