const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendVerification } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

// Register new user
router.post('/register', registerValidation, register);

// Login
router.post('/login', loginValidation, login);

// Verify email
router.get('/verify-email/:token', verifyEmail);

// Resend verification email
router.post('/resend-verification', resendVerification);

module.exports = router;
