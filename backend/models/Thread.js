const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replies: [ReplySchema]
});

module.exports = mongoose.model('Thread', ThreadSchema); 