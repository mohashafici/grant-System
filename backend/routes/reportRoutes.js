const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAdmin } = require('../middleware/authMiddleware');

// GET /api/reports/evaluation
router.get('/evaluation', requireAdmin, reportController.getEvaluationReports);
// GET /api/reports/analytics
router.get('/analytics', requireAdmin, reportController.getAnalytics);
// GET /api/reports/reviewer-performance
router.get('/reviewer-performance', requireAdmin, reportController.getReviewerPerformance);
// GET /api/reports/export
router.get('/export', requireAdmin, reportController.exportReport);
// GET /api/reports/export-excel
router.get('/export-excel', requireAdmin, (req, res, next) => {
  req.query.format = 'excel';
  reportController.exportReport(req, res, next);
});
// POST /api/reports/generate
router.post('/generate', requireAdmin, reportController.generateReport);
// GET /api/reports/user-stats
router.get('/user-stats', requireAdmin, reportController.getUserStats);
// GET /api/reports/grant-stats
router.get('/grant-stats', requireAdmin, reportController.getGrantStats);

module.exports = router; 