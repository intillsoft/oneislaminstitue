/**
 * Subscription Tiers Configuration
 * Defines features and limits for each subscription tier
 * Shared frontend/backend config (Copied from backend)
 */

export const SUBSCRIPTION_TIERS = {
    free: {
        name: 'Free',
        price: 0,
        priceId: null,
        level: 0,
        features: {
            maxAcademicProfiles: 1,
            maxEnrollments: 10,
            maxSavedCourses: 20,
            aiCourseMatching: false,
            advancedSearch: false,
            enrollmentTracking: true,
            emailAlerts: false,
            prioritySupport: false,
            apiAccess: false,
        },
        limits: {
            enrollmentsPerMonth: 10,
            savedCoursesPerMonth: 20,
            academicProfilesPerMonth: 1,
            apiCallsPerMonth: 0,
            academicToolsUsage: 3, 
        },
    },
    professional: {
        name: 'Professional',
        price: 9.99,
        priceId: import.meta.env?.VITE_STRIPE_PRICE_ID_PROFESSIONAL || 'price_professional',
        level: 1,
        features: {
            maxAcademicProfiles: 3,
            maxEnrollments: 50,
            maxSavedCourses: 100,
            aiCourseMatching: true,
            advancedSearch: true,
            enrollmentTracking: true,
            emailAlerts: true,
            prioritySupport: false,
            apiAccess: false,
        },
        limits: {
            enrollmentsPerMonth: 50,
            savedCoursesPerMonth: 100,
            academicProfilesPerMonth: 3,
            apiCallsPerMonth: 0,
            academicToolsUsage: 20,
        },
    },
    premium: {
        name: 'Premium',
        price: 19.99,
        priceId: import.meta.env?.VITE_STRIPE_PRICE_ID_PREMIUM || 'price_premium',
        level: 2,
        features: {
            maxAcademicProfiles: -1,
            maxEnrollments: -1,
            maxSavedCourses: 500,
            aiCourseMatching: true,
            advancedSearch: true,
            enrollmentTracking: true,
            emailAlerts: true,
            prioritySupport: true,
            apiAccess: false,
        },
        limits: {
            enrollmentsPerMonth: -1, // Unlimited
            savedCoursesPerMonth: 500,
            academicProfilesPerMonth: -1, // Unlimited
            apiCallsPerMonth: 0,
            academicToolsUsage: -1, // Unlimited
        },
    },
    recruiter: {
        name: 'Recruiter',
        price: 49.99,
        priceId: import.meta.env?.VITE_STRIPE_PRICE_ID_RECRUITER || 'price_recruiter',
        level: 3,
        features: {
            maxAcademicProfiles: 0,
            maxEnrollments: 0,
            maxSavedCourses: 0,
            aiCourseMatching: true,
            advancedSearch: true,
            enrollmentTracking: true,
            emailAlerts: true,
            prioritySupport: true,
            apiAccess: true,
        },
        limits: {
            enrollmentsPerMonth: 0,
            savedCoursesPerMonth: 0,
            academicProfilesPerMonth: 0,
            apiCallsPerMonth: 5000,
            academicToolsUsage: 0,
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
