import express from 'express';
import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/applications
 * Get user applications
 */
router.get('/', async (req, res) => {
    try {
        res.json({ success: true, data: [] });
    } catch (error) {
        logger.error('Error fetching applications:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/applications
 * Submit new application
 */
router.post('/', async (req, res) => {
    try {
        res.json({ success: true, data: { id: 'mock-id' } });
    } catch (error) {
        logger.error('Error creating application:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
