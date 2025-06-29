const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  decision: {
    type: String,
    enum: ['Approved', 'Rejected', 'Revisions Requested'],
  },
  score: {
    type: Number,
  },
  innovationScore: {
    type: Number,
  },
  impactScore: {
    type: Number,
  },
  feasibilityScore: {
    type: Number,
  },
  comments: {
    type: String,
  },
  reviewDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);


