/**
 * Billing API Routes
 * Handles subscription and payment operations
 */

import express from 'express';
import stripeService from '../services/stripeService.js';
import { requireTier } from '../middleware/featureGate.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Get current subscription
 */
router.get('/subscription', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await stripeService.getSubscriptionDetails(userId);
    
    if (!subscription) {
      return res.json({
        tier: 'free',
        status: 'active',
      });
    }

    res.json(subscription);
  } catch (error) {
    logger.error('Error getting subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create checkout session for subscription
 */
router.post('/checkout', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { tier } = req.body;

    if (!userId || !tier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (tier === 'free') {
      return res.status(400).json({ error: 'Cannot checkout for free tier' });
    }

    const session = await stripeService.createCheckoutSession(userId, tier);
    res.json({ url: session.url });
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create customer portal session
 */
router.post('/portal', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = await stripeService.createPortalSession(userId);
    res.json({ url: session.url });
  } catch (error) {
    logger.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Update subscription (upgrade/downgrade)
 */
router.post('/subscription/update', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { tier } = req.body;

    if (!userId || !tier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (tier === 'free') {
      // Cancel subscription instead
      await stripeService.cancelSubscription(userId, false);
      return res.json({ success: true, message: 'Subscription canceled' });
    }

    const result = await stripeService.updateSubscription(userId, tier);
    res.json({ success: true, subscription: result });
  } catch (error) {
    logger.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Cancel subscription
 */
router.post('/subscription/cancel', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { immediately } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await stripeService.cancelSubscription(userId, immediately === true);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Resume canceled subscription
 */
router.post('/subscription/resume', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await stripeService.resumeSubscription(userId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error resuming subscription:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Retry failed payment
 */
router.post('/payment/retry', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await stripeService.retryPayment(userId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error retrying payment:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;

