import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../lib/api';
import { SUBSCRIPTION_TIERS } from '../config/subscription-tiers';
// Note: We're importing config from backend for shared constants. 
// In a real repo, this might be a shared package. For now, we assume access.
// If direct import fails due to build setup, we'll hardcode or fetch from API.

export const useSubscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscription = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.subscriptions.getCurrent();
            const data = response.data;
            setSubscription(data);
            // If usage data isn't separate, we might need a separate endpoint or derive from subscription
            setUsage(data.usage || {});
            setError(null);
        } catch (err) {
            console.error('Failed to fetch subscription:', err);
            // Fallback to free tier if error? Or set error.
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    /**
     * Check if user has access to a feature or is within limits
     * @param {string} feature - e.g., 'careerToolsUsage', 'resumesPerMonth'
     * @param {number} currentCount - Optional: pass current local count if known
     * @returns {boolean}
     */
    const checkLimit = (feature, currentCount = null) => {
        if (!subscription) return false; // Assume no access if loading/error? Or Free?

        const planName = subscription.plan_id.name || 'free'; // This depends on how Supabase returns it.
        // Simplified: We really need the plan tier name ('free', 'professional', etc)
        // Adjust based on actual API response structure.

        // Mock logic for now if API structure is unknown:
        const tier = subscription?.plan?.name || 'free';
        const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;

        const limit = tierConfig.limits[feature];

        if (limit === -1) return true; // Unlimited

        const used = currentCount !== null ? currentCount : (usage?.[feature] || 0);

        return used < limit;
    };

    const createCheckoutSession = async (tier) => {
        try {
            const { data } = await apiService.subscriptions.createCheckout(tier);
            if (data.url) {
                window.location.href = data.url;
            } else if (data.sessionId) {
                // Initialize Stripe redirect here if needed, or backend returns URL
            }
        } catch (err) {
            console.error('Checkout error:', err);
            throw err;
        }
    };

    return {
        subscription,
        usage,
        loading,
        error,
        checkLimit,
        createCheckoutSession,
        refresh: fetchSubscription
    };
};
