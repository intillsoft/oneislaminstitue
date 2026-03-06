/**
 * Feature Gating Middleware
 * Restricts API endpoints based on subscription tier
 */

import { getTierConfig, hasFeatureAccess, checkLimit, getLimit } from '../config/subscription-tiers.js';
import { getUsageCount } from '../services/usageTracking.js';
import logger from '../utils/logger.js';

/**
 * Middleware to check if user has access to a feature
 */
export function requireFeature(feature) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user's subscription tier
      const { data: user, error: userError } = await req.supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const tier = user.subscription_tier || 'free';
      const isAdmin = user.role === 'admin';

      // Admin bypass
      if (isAdmin) {
        req.userTier = 'pro'; // Treat as pro for feature access
        req.isAdmin = true;
        return next();
      }

      // Check feature access
      if (!hasFeatureAccess(tier, feature)) {
        return res.status(403).json({
          error: 'Feature not available',
          message: `This feature requires a ${getTierConfig(tier).name} subscription or higher.`,
          requiredTier: getRequiredTierForFeature(feature),
          currentTier: tier,
        });
      }

      req.userTier = tier;
      next();
    } catch (error) {
      logger.error('Feature gate error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check usage limits
 */
export function checkUsageLimit(feature) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user's subscription tier
      const { data: user } = await req.supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      const tier = user?.subscription_tier || 'free';
      const isAdmin = user?.role === 'admin';

      // Admin bypass
      if (isAdmin) {
        req.userTier = 'pro';
        req.isAdmin = true;
        return next();
      }

      // Get current usage
      const currentUsage = await getUsageCount(req.supabase, userId, feature);

      // Check limit
      if (!checkLimit(tier, feature, currentUsage)) {
        const limit = getLimit(tier, feature);
        return res.status(429).json({
          error: 'Usage limit exceeded',
          message: `You have reached your monthly limit of ${limit} ${feature}.`,
          currentUsage,
          limit,
          upgradeUrl: '/billing/upgrade',
        });
      }

      req.currentUsage = currentUsage;
      next();
    } catch (error) {
      logger.error('Usage limit check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Combined middleware for feature + usage check
 */
export function requireFeatureWithLimit(feature) {
  return [requireFeature(feature), checkUsageLimit(feature)];
}

/**
 * Get required tier for a feature
 */
function getRequiredTierForFeature(feature) {
  const tiers = ['free', 'basic', 'premium', 'pro'];

  for (const tier of tiers) {
    if (hasFeatureAccess(tier, feature)) {
      return tier;
    }
  }

  return 'pro';
}

/**
 * Middleware to require minimum subscription tier
 */
export function requireTier(minTier) {
  const tierOrder = { free: 0, basic: 1, premium: 2, pro: 3 };

  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data: user } = await req.supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      const currentTier = user?.subscription_tier || 'free';
      const isAdmin = user?.role === 'admin';

      // Admin bypass
      if (isAdmin) {
        req.userTier = 'pro';
        req.isAdmin = true;
        return next();
      }

      const currentTierLevel = tierOrder[currentTier] || 0;
      const requiredTierLevel = tierOrder[minTier] || 0;

      if (currentTierLevel < requiredTierLevel) {
        return res.status(403).json({
          error: 'Subscription tier required',
          message: `This endpoint requires a ${minTier} subscription or higher.`,
          currentTier,
          requiredTier: minTier,
        });
      }

      req.userTier = currentTier;
      next();
    } catch (error) {
      logger.error('Tier check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

