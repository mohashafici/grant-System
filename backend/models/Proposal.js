const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  objectives: {
    type: String,
    required: true,
  },
  methodology: {
    type: String,
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  expectedOutcomes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Approved', 'Rejected', 'Needs Revision'],
    default: 'Draft',
  },
  dateSubmitted: {
    type: Date,
  },
  deadline: {
    type: Date,
    required: true,
  },
  funding: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  // Budget breakdown fields
  personnelCosts: {
    type: Number,
    default: 0,
  },
  equipmentCosts: {
    type: Number,
    default: 0,
  },
  materialsCosts: {
    type: Number,
    default: 0,
  },
  travelCosts: {
    type: Number,
    default: 0,
  },
  otherCosts: {
    type: Number,
    default: 0,
  },
  // File fields
  proposalDocument: {
    type: String, // File path
  },
  cvResume: {
    type: String, // File path
  },
  additionalDocuments: [{
    type: String, // Array of file paths
  }],
  reviewer: {
    type: String,
  },
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  grant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grant',
    required: true,
  },
  // Recommendation fields
  recommendedScore: {
    type: Number,
  },
  recommendation: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', ProposalSchema);

