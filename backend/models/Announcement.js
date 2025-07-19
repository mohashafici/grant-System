const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  date: { type: Date, default: Date.now },
  tags: [String],
  author: { type: String },
  readTime: { type: String },
  views: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema); 