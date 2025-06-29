const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const User = require('../models/User');
const Grant = require('../models/Grant');

// GET /api/reports/evaluation - Evaluation reports summary
exports.getEvaluationReports = async (req, res, next) => {
  // TODO: Replace with real aggregation
  res.json([
    {
      id: 1,
      title: "Q1 2024 Grant Evaluation Report",
      period: "January - March 2024",
      totalProposals: 45,
      approved: 12,
      rejected: 28,
      pending: 5,
      totalFunding: "$1,250,000",
      averageScore: 6.8,
      generatedDate: "2024-04-01",
      status: "Final",
    },
    {
      id: 2,
      title: "Technology Grants Analysis 2024",
      period: "January - December 2024",
      totalProposals: 78,
      approved: 23,
      rejected: 45,
      pending: 10,
      totalFunding: "$2,100,000",
      averageScore: 7.2,
      generatedDate: "2024-01-15",
      status: "Draft",
    },
    {
      id: 3,
      title: "Healthcare Research Funding Report",
      period: "2023 Annual",
      totalProposals: 32,
      approved: 18,
      rejected: 14,
      pending: 0,
      totalFunding: "$1,800,000",
      averageScore: 7.9,
      generatedDate: "2024-01-05",
      status: "Final",
    },
  ]);
};

// GET /api/reports/analytics - Monthly and category analytics
exports.getAnalytics = async (req, res, next) => {
  // TODO: Replace with real aggregation
  res.json({
    monthlyData: [
      { month: "Jan", proposals: 15, approved: 4, funding: 420000 },
      { month: "Feb", proposals: 18, approved: 5, funding: 380000 },
      { month: "Mar", proposals: 12, approved: 3, funding: 450000 },
      { month: "Apr", proposals: 22, approved: 7, funding: 620000 },
      { month: "May", proposals: 19, approved: 6, funding: 540000 },
      { month: "Jun", proposals: 16, approved: 4, funding: 480000 },
    ],
    categoryData: [
      { name: "Technology", value: 35, funding: 1200000, color: "#3B82F6" },
      { name: "Healthcare", value: 28, funding: 980000, color: "#10B981" },
      { name: "Environment", value: 22, funding: 750000, color: "#F59E0B" },
      { name: "Social Sciences", value: 15, funding: 420000, color: "#EF4444" },
    ],
  });
};

// GET /api/reports/reviewer-performance - Reviewer performance
exports.getReviewerPerformance = async (req, res, next) => {
  // TODO: Replace with real aggregation
  res.json([
    {
      id: 1,
      name: "Prof. David Martinez",
      reviewsCompleted: 12,
      averageScore: 7.8,
      onTimeRate: 95,
      expertise: "AI & Machine Learning",
    },
    {
      id: 2,
      name: "Dr. Lisa Zhang",
      reviewsCompleted: 18,
      averageScore: 7.2,
      onTimeRate: 88,
      expertise: "Computer Science",
    },
    {
      id: 3,
      name: "Prof. Robert Kim",
      reviewsCompleted: 8,
      averageScore: 8.1,
      onTimeRate: 100,
      expertise: "Environmental Science",
    },
    {
      id: 4,
      name: "Dr. Maria Santos",
      reviewsCompleted: 15,
      averageScore: 7.5,
      onTimeRate: 92,
      expertise: "Healthcare Technology",
    },
  ]);
}; 