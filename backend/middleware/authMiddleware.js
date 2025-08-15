const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = null;
  
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  // If no token in header, check query parameters (for file downloads)
  if (!token && req.query.token) {
    token = req.query.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required.',
      error: 'AUTHENTICATION_REQUIRED'
    });
  }
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Access denied. Your role '${req.user.role}' is not authorized for this resource. Required roles: ${roles.join(', ')}.`,
      error: 'INSUFFICIENT_PRIVILEGES',
      userRole: req.user.role,
      requiredRoles: roles
    });
  }
  next();
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  // First, check authentication
  let token = null;
  
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  // If no token in header, check query parameters (for file downloads)
  if (!token && req.query.token) {
    token = req.query.token;
  }
  
  if (!token) {
    return res.status(401).json({ 
      message: 'No token provided.',
      error: 'AUTHENTICATION_REQUIRED'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: `Access denied. Your role '${req.user.role}' is not authorized for this resource. Admin access required.`,
        error: 'INSUFFICIENT_PRIVILEGES',
        userRole: req.user.role,
        requiredRole: 'admin'
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: 'Invalid or expired token.',
      error: 'INVALID_TOKEN'
    });
  }
};

module.exports = { auth, authorizeRoles, requireAdmin };


