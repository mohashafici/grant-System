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
// GET /api/reports/export
router.get('/export', auth, authorizeRoles('admin'), reportController.exportReport);
// POST /api/reports/generate
router.post('/generate', auth, authorizeRoles('admin'), reportController.generateReport);
// GET /api/reports/user-stats
router.get('/user-stats', auth, authorizeRoles('admin'), reportController.getUserStats);
// GET /api/reports/grant-stats
router.get('/grant-stats', auth, authorizeRoles('admin'), reportController.getGrantStats);

module.exports = router; 