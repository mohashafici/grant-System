const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const NotificationService = require('../services/notificationService');

// GET /api/notifications - Get user notifications
router.get('/', auth, async (req, res, next) => {
  try {
    const { limit = 20, unreadOnly = false } = req.query;
    const notifications = await NotificationService.getUserNotifications(
      req.user.id,
      parseInt(limit),
      unreadOnly === 'true'
    );
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', auth, async (req, res, next) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', auth, async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res, next) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 