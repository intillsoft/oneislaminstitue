import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * Notification Service
 * Handles user notifications
 */
export const notificationService = {
    async getNotifications(userId, options = {}) {
        const { page = 1, limit = 20, read, type, search } = options;

        let query = supabase
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (read !== undefined) {
            query = query.eq('is_read', read);
        }

        if (type) {
            query = query.eq('type', type);
        }

        if (search) {
            query = query.ilike('message', `%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            notifications: data || [],
            total: count || 0,
            page,
            limit
        };
    },

    async getUnreadCount(userId) {
        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) {
                logger.error('Supabase error getting unread count:', error);
                // Return 0 on error to prevent 500 response
                return 0;
            }
            return count || 0;
        } catch (error) {
            logger.error('Error getting unread count:', error);
            return 0;
        }
    },

    async markAsRead(userId, notificationId) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', notificationId)
            .eq('user_id', userId);

        if (error) throw error;
    },

    async delete(userId, notificationId) {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', userId);

        if (error) throw error;
    },

    async getPreferences(userId) {
        const { data, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return data || {
            email_notifications: true,
            push_notifications: true,
            sms_notifications: false
        };
    },

    async updatePreferences(userId, preferences) {
        // Check if preferences exist
        const { data: existing } = await supabase
            .from('notification_preferences')
            .select('id')
            .eq('user_id', userId)
            .single();

        let query;
        if (existing) {
            query = supabase
                .from('notification_preferences')
                .update({
                    ...preferences,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
        } else {
            query = supabase
                .from('notification_preferences')
                .insert({
                    user_id: userId,
                    ...preferences,
                    updated_at: new Date().toISOString()
                });
        }

        const { data, error } = await query.select().single();

        if (error) throw error;
        return data;
    },

    async create(userId, notification) {
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                ...notification
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async sendAutoAppliedNotification(userId, job, preferences = {}) {
        try {
            // Create in-app notification
            await this.create(userId, {
                type: 'job_application',
                title: 'Auto-Applied to Job',
                message: `Application submitted to ${job.company} for ${job.title}`,
                data: { jobId: job.id, company: job.company },
                is_read: false
            });

            // TODO: Implement Email/SMS notifications based on preferences
            logger.info(`Notification sent for auto-apply job ${job.id}`);
        } catch (error) {
            logger.error('Error sending auto-apply notification:', error);
            // Don't throw, just log
        }
    }
};

export default notificationService;
