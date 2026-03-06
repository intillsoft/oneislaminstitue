/**
 * Notification Routes
 * API endpoints for notifications
 */

import express from 'express';
import { notificationService } from '../services/notificationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/notifications
 * Create a new notification
 * Note: authenticate middleware is already applied in server.js
 */
router.post('/', async (req, res) => {
  try {
    const { userIds, ...notificationData } = req.body;
    
    if (userIds && Array.isArray(userIds)) {
      // Handle bulk transmission
      const results = await notificationService.createMany(userIds, notificationData, req.user.id);
      return res.status(201).json({ success: true, data: results });
    }

    // Handle single notification
    const notification = await notificationService.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    logger.error('Error creating notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/notifications
 * Get user's notifications
 * Note: authenticate middleware is already applied in server.js
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, read, type, search } = req.query;
    const notifications = await notificationService.getNotifications(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      read: read === 'true' ? true : read === 'false' ? false : undefined,
      type,
      search,
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 * Note: authenticate middleware is already applied in server.js
 */
router.get('/unread-count', async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (error) {
    logger.error('Error getting unread count:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 * Note: authenticate middleware is already applied in server.js
 */
router.put('/:id/read', async (req, res) => {
  try {
    await notificationService.markAsRead(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete notification
 * Note: authenticate middleware is already applied in server.js
 */
router.delete('/:id', async (req, res) => {
  try {
    await notificationService.delete(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/notifications/preferences
 * Get notification preferences
 * Note: authenticate middleware is already applied in server.js
 */
router.get('/preferences', async (req, res) => {
  try {
    const preferences = await notificationService.getPreferences(req.user.id);
    res.json({ success: true, data: preferences });
  } catch (error) {
    logger.error('Error getting notification preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/notifications/preferences
 * Update notification preferences
 * Note: authenticate middleware is already applied in server.js
 */
router.put('/preferences', async (req, res) => {
  try {
    const preferences = await notificationService.updatePreferences(req.user.id, req.body);
    res.json({ success: true, data: preferences });
  } catch (error) {
    logger.error('Error updating notification preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;