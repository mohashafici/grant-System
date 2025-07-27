const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create a notification
  static async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create multiple notifications
  static async createMultipleNotifications(notificationsData) {
    try {
      const notifications = await Notification.insertMany(notificationsData);
      return notifications;
    } catch (error) {
      console.error('Error creating multiple notifications:', error);
      throw error;
    }
  }

  // Admin: Notify when new proposal is submitted
  static async notifyProposalSubmitted(proposal) {
    try {
      // Get all admin users
      const admins = await User.find({ role: 'admin' });
      
      const notifications = admins.map(admin => ({
        recipient: admin._id,
        type: 'PROPOSAL_SUBMITTED',
        title: 'New Proposal Submitted',
        message: `A new proposal "${proposal.title}" has been submitted and requires review assignment.`,
        data: {
          proposalId: proposal._id,
          proposalTitle: proposal.title,
          researcherId: proposal.researcher,
          category: proposal.category
        },
        priority: 'high'
      }));

      await this.createMultipleNotifications(notifications);
    } catch (error) {
      console.error('Error notifying proposal submission:', error);
    }
  }

  // Admin: Notify when review is completed
  static async notifyReviewCompleted(review, proposal) {
    try {
      const admins = await User.find({ role: 'admin' });
      
      const notifications = admins.map(admin => ({
        recipient: admin._id,
        type: 'REVIEW_COMPLETED',
        title: 'Review Completed',
        message: `Review for proposal "${proposal.title}" has been completed by ${review.reviewer.firstName} ${review.reviewer.lastName}.`,
        data: {
          reviewId: review._id,
          proposalId: proposal._id,
          proposalTitle: proposal.title,
          reviewerId: review.reviewer._id,
          decision: review.decision,
          score: review.score
        },
        priority: 'medium'
      }));

      await this.createMultipleNotifications(notifications);
    } catch (error) {
      console.error('Error notifying review completion:', error);
    }
  }

  // Researcher: Notify when proposal status changes
  static async notifyProposalStatusUpdate(proposal, oldStatus, newStatus) {
    try {
      const notification = {
        recipient: proposal.researcher,
        type: 'PROPOSAL_STATUS_UPDATE',
        title: 'Proposal Status Updated',
        message: `Your proposal "${proposal.title}" status has changed from ${oldStatus} to ${newStatus}.`,
        data: {
          proposalId: proposal._id,
          proposalTitle: proposal.title,
          oldStatus,
          newStatus
        },
        priority: newStatus === 'Approved' ? 'high' : 'medium'
      };

      await this.createNotification(notification);
    } catch (error) {
      console.error('Error notifying proposal status update:', error);
    }
  }

  // Researcher: Notify about new grants
  static async notifyNewGrant(grant, researchers) {
    try {
      const notifications = researchers.map(researcher => ({
        recipient: researcher._id,
        type: 'NEW_GRANT',
        title: 'New Grant Opportunity',
        message: `A new grant "${grant.title}" in ${grant.category} category is now available.`,
        data: {
          grantId: grant._id,
          grantTitle: grant.title,
          category: grant.category,
          funding: grant.funding,
          deadline: grant.deadline
        },
        priority: 'medium'
      }));

      await this.createMultipleNotifications(notifications);
    } catch (error) {
      console.error('Error notifying new grant:', error);
    }
  }

  // Reviewer: Notify when assigned to review
  static async notifyReviewAssigned(review, proposal) {
    try {
      const notification = {
        recipient: review.reviewer,
        type: 'REVIEW_ASSIGNED',
        title: 'New Review Assignment',
        message: `You have been assigned to review proposal "${proposal.title}".`,
        data: {
          reviewId: review._id,
          proposalId: proposal._id,
          proposalTitle: proposal.title,
          deadline: review.deadline,
          category: proposal.category
        },
        priority: 'high'
      };

      await this.createNotification(notification);
    } catch (error) {
      console.error('Error notifying review assignment:', error);
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, limit = 20, unreadOnly = false) {
    try {
      const query = { recipient: userId };
      if (unreadOnly) {
        query.read = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('sender', 'firstName lastName email');

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { read: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        read: false
      });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete old notifications
  static async deleteOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        read: true
      });
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 