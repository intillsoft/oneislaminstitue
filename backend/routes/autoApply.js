/**
 * Auto-Apply Routes
 * API endpoints for job auto-apply automation
 */

import express from 'express';
import { autoApplyService } from '../services/autoApplyService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/auto-apply/settings
 * Get user's auto-apply settings
 * Note: authenticate middleware is already applied in server.js
 */
router.get('/settings', async (req, res) => {
  try {
    const settings = await autoApplyService.getSettings(req.user.id);
    res.json({ success: true, data: settings });
  } catch (error) {
    logger.error('Error getting auto-apply settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auto-apply/settings
 * Create or update auto-apply settings
 * Note: authenticate middleware is already applied in server.js
 */
router.post('/settings', async (req, res) => {
  try {
    const settings = await autoApplyService.saveSettings(req.user.id, req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    logger.error('Error saving auto-apply settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auto-apply/stats
 * Get auto-apply statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const { timeRange } = req.query;
    const stats = await autoApplyService.getStats(req.user.id, timeRange);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error getting auto-apply stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auto-apply/logs
 * Get user's auto-apply logs
 * Note: authenticate middleware is already applied in server.js
 */
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const logs = await autoApplyService.getLogs(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      startDate,
      endDate,
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    logger.error('Error getting auto-apply logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auto-apply/process
 * Manually trigger auto-apply (for testing or admin use)
 * Note: authenticate middleware is already applied in server.js
 */
router.post('/process', async (req, res) => {
  try {
    const result = await autoApplyService.processAutoApply(req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error processing auto-apply:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;