const rateLimit = require('express-rate-limit');

// Development-friendly rate limiter for all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs (increased for development)
  message: {
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 uploads per windowMs (increased for development)
  message: {
    message: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Development mode - disable rate limiting entirely
const devLimiter = (req, res, next) => next();

module.exports = {
  generalLimiter: process.env.NODE_ENV === 'production' ? generalLimiter : devLimiter,
  authLimiter: process.env.NODE_ENV === 'production' ? authLimiter : devLimiter,
  uploadLimiter: process.env.NODE_ENV === 'production' ? uploadLimiter : devLimiter
}; 
