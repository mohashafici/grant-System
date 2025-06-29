const mongoose = require('mongoose');

const GrantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  funding: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active',
  },
  applicants: {
    type: Number,
    default: 0,
  },
  approved: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Grant', GrantSchema);


