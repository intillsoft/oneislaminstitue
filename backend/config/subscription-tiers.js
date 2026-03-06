/**
 * Subscription Tiers Configuration
 * Defines features and limits for each subscription tier
 */

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    level: 0,
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
      careerToolsUsage: 3, // New: Limit for Training Tools
    },
  },
  professional: {
    name: 'Professional',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_ID_PROFESSIONAL || 'price_professional',
    level: 1,
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
      careerToolsUsage: 20,
    },
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM || 'price_premium',
    level: 2,
    features: {
      maxResumes: -1,
      maxApplications: -1,
      maxSavedJobs: 500,
      aiJobMatching: true,
      advancedSearch: true,
      applicationTracking: true,
      emailAlerts: true,
      prioritySupport: true,
      apiAccess: false,
    },
    limits: {
      applicationsPerMonth: -1, // Unlimited
      savedJobsPerMonth: 500,
      resumesPerMonth: -1, // Unlimited
      apiCallsPerMonth: 0,
      careerToolsUsage: -1, // Unlimited
    },
  },
  recruiter: {
    name: 'Recruiter',
    price: 49.99,
    priceId: process.env.STRIPE_PRICE_ID_RECRUITER || 'price_recruiter',
    level: 3,
    features: {
      maxResumes: 0,
      maxApplications: 0,
      maxSavedJobs: 0,
      aiJobMatching: true,
      advancedSearch: true,
      applicationTracking: true,
      emailAlerts: true,
      prioritySupport: true,
      apiAccess: true,
    },
    limits: {
      applicationsPerMonth: 0,
      savedJobsPerMonth: 0,
      resumesPerMonth: 0,
      apiCallsPerMonth: 5000,
      careerToolsUsage: 0,
    },
  },
  admin: {
    name: 'Admin',
    price: 0,
    priceId: null,
    level: 4,
    features: {
      maxResumes: -1,
      maxApplications: -1,
      maxSavedJobs: -1,
      aiJobMatching: true,
      advancedSearch: true,
      applicationTracking: true,
      emailAlerts: true,
      prioritySupport: true,
      apiAccess: true,
    },
    limits: {
      applicationsPerMonth: -1,
      savedJobsPerMonth: -1,
      resumesPerMonth: -1,
      apiCallsPerMonth: -1,
      careerToolsUsage: -1,
    },
  }
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

