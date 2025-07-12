import express from 'express';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username avatarUrl')
      .populate('relatedQuestion', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({
      success: true,
      notifications: notifications.map(notification => ({
        id: notification._id,
        type: notification.type,
        message: notification.message,
        timestamp: notification.createdAt,
        isRead: notification.isRead,
        sender: notification.sender ? {
          username: notification.sender.username,
          avatarUrl: notification.sender.avatarUrl,
        } : null,
        relatedQuestion: notification.relatedQuestion ? {
          _id: notification.relatedQuestion._id,
          title: notification.relatedQuestion.title,
        } : null,
      })),
      pagination: {
        page,
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications',
    });
  }
});

// @route   POST /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.post('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    if (!notification.isRead) {
      await notification.markAsRead();
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking notification as read',
    });
  }
});

// @route   POST /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.post('/mark-all-read', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking all notifications as read',
    });
  }
});

export default router;
