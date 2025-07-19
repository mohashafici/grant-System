const mongoose = require('mongoose');
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: String, // e.g., 'guide', 'video', 'tool'
  link: String,
  category: String,
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema); 