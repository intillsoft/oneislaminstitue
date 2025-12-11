/**
 * Subscription Service
 */
import logger from '../utils/logger.js';
import { supabase } from '../lib/supabase.js';

const subscriptionService = {
    async cancelSubscription(userId) {
        logger.info(`Canceling subscription for ${userId}`);
        return { status: 'canceled' };
    },

    async checkAutoApplyLimit(userId) {
        try {
            // Get user's subscription
            const subscription = await this.getSubscription(userId);

            // For now, allow all users (free plan has limits but we'll implement later)
            // TODO: Implement actual subscription limits based on plan
            return {
                allowed: true,
                reason: null,
                remaining: 100, // Placeholder
            };
        } catch (error) {
            logger.error('Error checking auto-apply limit:', error);
            // Allow on error to not block users
            return {
                allowed: true,
                reason: null,
            };
        }
    },

    // Mock getSubscription for now since it is referenced but not defined
    async getSubscription(userId) {
        if (!userId) return null;

        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('*, plans(*)')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            logger.error(`Error fetching subscription for ${userId}:`, error);
        }

        return subscription || { plan: 'free', limits: { job_applications: 5 } }; // Default to free if no sub
    }
};

export default subscriptionService;
