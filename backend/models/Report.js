const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  period: { type: String, required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  totalProposals: { type: Number, required: true },
  approved: { type: Number, required: true },
  rejected: { type: Number, required: true },
  pending: { type: Number, required: true },
  totalFunding: { type: String, required: true },
  averageScore: { type: Number, required: true },
  activeGrants: { type: Number, required: true },
  closedGrants: { type: Number, required: true },
  generatedDate: { type: String, required: true },
  status: { type: String, enum: ['Final', 'Draft'], default: 'Draft' },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as needed
});

module.exports = mongoose.model('Report', ReportSchema); 