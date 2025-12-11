/**
 * Subscription Tiers Configuration
 * Defines features and limits for each subscription tier
 */

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null, // No Stripe price ID for free tier
    features: {
      maxResumes: 1,
      maxApplications: 10,
      maxSavedJobs: 20,
      aiJobMatching: false,
      advancedSearch: false,
      applicationTracking: true,
      emailAlerts: false,
      prioritySupport: false,
      apiAccess: false,
    },
    limits: {
      applicationsPerMonth: 10,
      savedJobsPerMonth: 20,
      resumesPerMonth: 1,
      apiCallsPerMonth: 0,
    },
  },
  basic: {
    name: 'Basic',
    price: 4.99,
    priceId: process.env.STRIPE_PRICE_ID_BASIC || 'price_basic',
    features: {
      maxResumes: 3,
      maxApplications: 50,
      maxSavedJobs: 100,
      aiJobMatching: true,
      advancedSearch: true,
      applicationTracking: true,
      emailAlerts: true,
      prioritySupport: false,
      apiAccess: false,
    },
    limits: {
      applicationsPerMonth: 50,
      savedJobsPerMonth: 100,
      resumesPerMonth: 3,
      apiCallsPerMonth: 0,
    },
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM || 'price_premium',
    features: {
      maxResumes: 10,
      maxApplications: 200,
      maxSavedJobs: 500,
      aiJobMatching: true,
      advancedSearch: true,
      applicationTracking: true,
      emailAlerts: true,
      prioritySupport: true,
      apiAccess: false,
    },
    limits: {
      applicationsPerMonth: 200,
      savedJobsPerMonth: 500,
      resumesPerMonth: 10,
      apiCallsPerMonth: 0,
    },
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    priceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro',
    features: {
      maxResumes: -1, // Unlimited
      maxApplications: -1, // Unlimited
      maxSavedJobs: -1, // Unlimited
      aiJobMatching: true,
      advancedSearch: true,
      applicationTracking: true,
      emailAlerts: true,
      prioritySupport: true,
      apiAccess: true,
    },
    limits: {
      applicationsPerMonth: -1, // Unlimited
      savedJobsPerMonth: -1, // Unlimited
      resumesPerMonth: -1, // Unlimited
      apiCallsPerMonth: 10000,
    },
  },
};

/**
 * Get tier configuration
 */
export function getTierConfig(tier) {
  return SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;
}

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(userTier, feature) {
  const tierConfig = getTierConfig(userTier);
  return tierConfig.features[feature] === true;
}

/**
 * Check if user is within limit
 */
export function checkLimit(userTier, feature, currentUsage) {
  const tierConfig = getTierConfig(userTier);
  const limit = tierConfig.limits[feature];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  return currentUsage < limit;
}

/**
 * Get limit for a feature
 */
export function getLimit(userTier, feature) {
  const tierConfig = getTierConfig(userTier);
  return tierConfig.limits[feature];
}

export default SUBSCRIPTION_TIERS;

