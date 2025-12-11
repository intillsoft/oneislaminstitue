import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/talent-crawler/search
 * Search for talent
 */
router.post('/search', async (req, res) => {
    try {
        res.json({ success: true, data: [] });
    } catch (error) {
        logger.error('Error searching talent:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
