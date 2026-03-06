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

            // Check if user is admin
            const { data: user } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (user?.role === 'admin') {
                return {
                    allowed: true,
                    reason: null,
                    remaining: -1, // Unlimited
                };
            }

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
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            logger.error(`Error fetching subscription for ${userId}:`, error);
        }

        return subscription || { plan: 'free', limits: { job_applications: 5 } }; // Default to free if no sub
    },

    async incrementAutoApplyCount(userId) {
        try {
            // For now just log it, we'll implement usage tracking tables later
            // or update a usage counter in a subscriptions_usage table
            logger.info(`Incrementing auto-apply count for user ${userId}`);
            return true;
        } catch (error) {
            logger.error(`Error incrementing auto-apply count for ${userId}:`, error);
            return false;
        }
    }
};

export default subscriptionService;
