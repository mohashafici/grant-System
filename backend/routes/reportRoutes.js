const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/reports/evaluation
router.get('/evaluation', auth, authorizeRoles('admin'), reportController.getEvaluationReports);
// GET /api/reports/analytics
router.get('/analytics', auth, authorizeRoles('admin'), reportController.getAnalytics);
// GET /api/reports/reviewer-performance
router.get('/reviewer-performance', auth, authorizeRoles('admin'), reportController.getReviewerPerformance);

module.exports = router; 