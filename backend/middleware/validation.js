const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Registration validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('institution')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Institution must be between 2 and 100 characters'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  
  validate
];

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Grant creation validation
const grantValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('funder')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Funder must be between 2 and 100 characters'),
  
  body('funding')
    .isNumeric()
    .withMessage('Funding must be a valid number'),
  
  body('deadline')
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  
  body('category')
    .isIn(['Technology', 'Environment', 'Health', 'Education', 'Agriculture'])
    .withMessage('Category must be one of the allowed values'),
  
  validate
];

// Proposal submission validation
const proposalValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('abstract')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Abstract must be between 50 and 1000 characters'),
  
  body('budget')
    .isNumeric()
    .withMessage('Budget must be a valid number'),
  
  body('duration')
    .isInt({ min: 1, max: 60 })
    .withMessage('Duration must be between 1 and 60 months'),
  
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  grantValidation,
  proposalValidation
}; 