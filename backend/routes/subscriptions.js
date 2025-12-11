import express from 'express';
import subscriptionService from '../services/subscriptionService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/subscriptions
 * Get current subscription
 */
router.get('/', async (req, res) => {
    try {
        const sub = await subscriptionService.getSubscription(req.user?.id);
        res.json({ success: true, data: sub });
    } catch (error) {
        logger.error('Error fetching subscription:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
