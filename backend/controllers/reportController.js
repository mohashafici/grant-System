const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const User = require('../models/User');
const Grant = require('../models/Grant');
const Report = require('../models/Report');

// GET /api/reports/evaluation - Evaluation reports summary
exports.getEvaluationReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// POST /api/reports/generate - Generate a new evaluation report
toISOStringWithLocal = (date) => {
  // Helper to format date as YYYY-MM-DD
  return date.toISOString().split('T')[0];
};

exports.generateReport = async (req, res, next) => {
  try {
    // Aggregate proposals
    const proposals = await Proposal.find();
    const totalProposals = proposals.length;
    const approved = proposals.filter(p => p.status === 'Approved').length;
    const rejected = proposals.filter(p => p.status === 'Rejected').length;
    const pending = proposals.filter(p => p.status === 'Pending' || p.status === 'Under Review' || p.status === 'Needs Revision').length;
    const totalFunding = proposals
      .filter(p => p.status === 'Approved')
      .reduce((sum, p) => sum + (p.funding || 0), 0);

    // Aggregate reviews for average score
    const reviews = await Review.find({ status: 'Completed', score: { $ne: null } });
    const averageScore = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length) : 0;

    // Period: current year
    const now = new Date();
    const year = now.getFullYear();
    const period = `${year} Annual`;
    const title = `Grant Evaluation Report - ${year}`;
    const generatedDate = toISOStringWithLocal(now);
    const status = 'Final';

    // Save report
    const report = new Report({
      title,
      period,
      totalProposals,
      approved,
      rejected,
      pending,
      totalFunding: `$${totalFunding.toLocaleString()}`,
      averageScore: Number(averageScore.toFixed(2)),
      generatedDate,
      status,
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/analytics - Monthly and category analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    // Monthly data for the current year
    const now = new Date();
    const year = now.getFullYear();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthlyData = await Promise.all(months.map(async (month, idx) => {
      const start = new Date(year, idx, 1);
      const end = new Date(year, idx + 1, 1);
      const proposals = await Proposal.find({ dateSubmitted: { $gte: start, $lt: end } });
      const approved = proposals.filter(p => p.status === 'Approved').length;
      const funding = proposals.filter(p => p.status === 'Approved').reduce((sum, p) => sum + (p.funding || 0), 0);
      return {
        month,
        proposals: proposals.length,
        approved,
        funding
      };
    }));

    // Funding by category (all time)
    const allProposals = await Proposal.find();
    const categoryMap = {};
    allProposals.forEach(p => {
      if (!categoryMap[p.category]) {
        categoryMap[p.category] = { name: p.category, value: 0, funding: 0 };
      }
      categoryMap[p.category].value += 1;
      if (p.status === 'Approved') {
        categoryMap[p.category].funding += p.funding || 0;
      }
    });
    // Assign colors for up to 10 categories
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6", "#F472B6", "#FBBF24", "#34D399", "#60A5FA"];
    const categoryData = Object.values(categoryMap).map((cat, i) => ({ ...cat, color: colors[i % colors.length] }));

    res.json({ monthlyData, categoryData });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/reviewer-performance - Reviewer performance
exports.getReviewerPerformance = async (req, res, next) => {
  try {
    // Find all reviewers
    const reviewers = await User.find({ role: 'reviewer' });
    // For each reviewer, aggregate their reviews
    const data = await Promise.all(reviewers.map(async (reviewer) => {
      const reviews = await Review.find({ reviewer: reviewer._id, status: 'Completed' });
      const reviewsCompleted = reviews.length;
      const averageScore = reviewsCompleted > 0 ? (reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviewsCompleted) : 0;
      // On-time rate: reviews with reviewDate <= proposal deadline
      let onTime = 0;
      for (const review of reviews) {
        const proposal = await Proposal.findById(review.proposal);
        if (proposal && review.reviewDate && proposal.deadline && review.reviewDate <= proposal.deadline) {
          onTime++;
        }
      }
      const onTimeRate = reviewsCompleted > 0 ? Math.round((onTime / reviewsCompleted) * 100) : 0;
      return {
        id: reviewer._id,
        name: reviewer.firstName + ' ' + reviewer.lastName,
        reviewsCompleted,
        averageScore: Number(averageScore.toFixed(2)),
        onTimeRate,
      };
    }));
    res.json(data);
  } catch (err) {
    next(err);
  }
}; 