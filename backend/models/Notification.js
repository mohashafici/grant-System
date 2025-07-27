const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      // Admin notifications
      'PROPOSAL_SUBMITTED',
      'REVIEW_COMPLETED',
      'GRANT_DEADLINE',
      'SYSTEM_ALERT',
      
      // Researcher notifications
      'NEW_GRANT',
      'PROPOSAL_STATUS_UPDATE',
      'GRANT_DEADLINE_REMINDER',
      'APPLICATION_DEADLINE',
      
      // Reviewer notifications
      'REVIEW_ASSIGNED',
      'REVIEW_DEADLINE_REMINDER',
      'PROPOSAL_STATUS_CHANGE'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Auto-expire notifications after 30 days if not set
NotificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

module.exports = mongoose.model('Notification', NotificationSchema); 