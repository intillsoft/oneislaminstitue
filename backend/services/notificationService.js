import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';
import { emailService } from './emailService.js';
import { smsService } from './smsService.js';

/**
 * Notification Service
 * Handles user notifications
 */
export const notificationService = {
    async getNotifications(userId, options = {}) {
        const { page = 1, limit = 20, read, type, search } = options;

        // Guard: return empty result if supabase is not initialized
        if (!supabase) {
            logger.warn('notificationService.getNotifications: supabase client is null');
            return { notifications: [], total: 0, page, limit };
        }

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
            if (!supabase) {
                logger.warn('notificationService.getUnreadCount: supabase client is null');
                return 0;
            }
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) {
                logger.error('Supabase error getting unread count:', error);
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
            sms_notifications: false,
            whatsapp_notifications: false
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
        const { sender_id, sendInApp = true, sendEmail = false, sendSMS = false, sendWhatsApp = false, ...rest } = notification;
        let data = null;
        
        if (sendInApp) {
            const { data: created, error } = await supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    sender_id: sender_id || null,
                    is_read: false,
                    ...rest
                })
                .select()
                .single();

            if (error) throw error;
            data = created;
        }
        
        // Channel delivery
        if (sendEmail || sendSMS || sendWhatsApp) {
            try {
                const { data: publicUser, error: publicUserError } = await supabase
                    .from('users')
                    .select('email, name, first_name, phone, phone_number')
                    .eq('id', userId)
                    .single();

                if (publicUserError && publicUserError.code !== 'PGRST116') {
                    logger.error(`Error fetching public user ${userId}:`, publicUserError);
                }

                let userEmail = publicUser?.email;
                let userName = publicUser?.name || publicUser?.first_name;
                let userPhone = publicUser?.phone || publicUser?.phone_number;

                // Best-effort: fall back to auth.users if public record is incomplete
                // requires SERVICE_ROLE_KEY to be used in supabase client
                if ((!userEmail || !userPhone) && supabase.auth?.admin) {
                    try {
                        logger.info(`Attempting to resolve identity for ${userId} from auth service...`);
                        const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
                        
                        if (!authError && authData?.user) {
                            userEmail = userEmail || authData.user.email;
                            userName = userName || authData.user.user_metadata?.name || authData.user.user_metadata?.full_name;
                            userPhone = userPhone || authData.user.phone || authData.user.user_metadata?.phone;
                        } else if (authError) {
                            logger.warn(`Auth admin resolution failed for ${userId}:`, authError.message);
                        }
                    } catch (err) { 
                        logger.warn(`Service role operations unavailable for notification delivery to ${userId}`);
                    }
                }

                const resolvedUser = { ...(publicUser || {}), email: userEmail, name: userName, phone: userPhone };

                if (sendEmail) {
                    if (userEmail) {
                        await this.sendEmailNotification(resolvedUser, rest);
                    } else {
                        logger.warn(`Cannot send email: No email address resolved for user ${userId}`);
                    }
                }

                const recipientPhone = userPhone;
                if (sendSMS) {
                    if (recipientPhone) {
                        await this.sendSMSNotification(recipientPhone, rest);
                    } else {
                        logger.warn(`Cannot send SMS: No phone number resolved for user ${userId}`);
                    }
                }
                
                if (sendWhatsApp) {
                    if (recipientPhone) {
                        await this.sendWhatsAppNotification(recipientPhone, rest);
                    } else {
                        logger.warn(`Cannot send WhatsApp: No phone number resolved for user ${userId}`);
                    }
                }
            } catch (err) {
                logger.error(`Critical failure in channel delivery for user ${userId}:`, err.message);
            }
        }

        return data;
    },

    /**
     * Broadcast a notification to multiple users
     */
    async createMany(userIds, notification, senderId) {
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return { success: false, error: 'No user IDs provided' };
        }

        const { title, message, type, sendInApp = true, sendEmail = false, sendSMS = false, sendWhatsApp = false, ...rest } = notification;
        let data = null;

        if (sendInApp) {
            const broadcastData = userIds.map(id => ({
                user_id: id,
                sender_id: senderId || null,
                title,
                message,
                type: type || 'info',
                is_read: false,
                data: rest || {}
            }));

            const { data: created, error } = await supabase
                .from('notifications')
                .insert(broadcastData)
                .select();

            if (error) throw error;
            data = created;
        }

        // Channel delivery for all users
        if (sendEmail || sendSMS || sendWhatsApp) {
            // We pass the full notification object (including the custom messages in 'rest')
            // but we need to make sure the individual send handlers can access them.
            // Since we pass 'notification' directly below, and I updated the send handlers
            // to look at individual fields like notification.emailMessage, it should work.
            
            userIds.forEach(async (id) => {
                try {
                    const { data: publicUser } = await supabase
                        .from('users')
                        .select('email, name, first_name, phone, phone_number')
                        .eq('id', id)
                        .single();

                    let userEmail = publicUser?.email;
                    let userName = publicUser?.name || publicUser?.first_name;
                    let userPhone = publicUser?.phone || publicUser?.phone_number;

                    if (!userEmail && supabase.auth?.admin) {
                        try {
                            const { data: authData } = await supabase.auth.admin.getUserById(id);
                            userEmail = authData?.user?.email || userEmail;
                            userName = userName || authData?.user?.user_metadata?.name || authData?.user?.user_metadata?.full_name;
                            userPhone = userPhone || authData?.user?.phone || authData?.user?.user_metadata?.phone;
                        } catch (_) { /* no service role, skip */ }
                    }

                    const resolvedUser = { ...(publicUser || {}), email: userEmail, name: userName, phone: userPhone };

                    if (sendEmail && userEmail) {
                        await this.sendEmailNotification(resolvedUser, notification);
                    }

                    if (sendSMS && userPhone) {
                        await this.sendSMSNotification(userPhone, notification);
                    }

                    if (sendWhatsApp && userPhone) {
                        await this.sendWhatsAppNotification(userPhone, notification);
                    }
                } catch (err) {
                    logger.error(`Channel delivery failed for user ${id}:`, err.message);
                }
            });
        }

        return data;
    },

    async sendSMSNotification(phone, notification) {
        const { title, message, smsMessage } = notification;
        try {
            // Prefer channel-specific message
            const content = smsMessage || `${title}: ${message}`;
            const smsBody = `[One Islam] ${content}`;
            await smsService.sendSMS(phone, smsBody);
        } catch (error) {
            logger.error('Error sending SMS notification:', error);
        }
    },

    async sendWhatsAppNotification(phone, notification) {
        const { title, message, whatsappMessage } = notification;
        try {
            // Prefer channel-specific message
            const content = whatsappMessage || `${title}\n${message}`;
            const waBody = `*One Islam Institute*\n\n${content}`;
            await smsService.sendWhatsApp(phone, waBody);
        } catch (error) {
            logger.error('Error sending WhatsApp notification:', error);
        }
    },

    async sendEmailNotification(user, notification) {
        let { title, message, emailTitle, emailMessage } = notification;
        try {
            const userName = user.name || user.first_name || 'Student';
            
            // Prefer channel-specific content
            const finalSubject = emailTitle || title;
            const finalMessage = emailMessage || message;
            
            const personalizedMessage = finalMessage.replace(/\{\{name\}\}/g, userName);
            
            await emailService.send({
                to: user.email,
                subject: finalSubject,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #efefef; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="color: #10b981; margin: 0; font-size: 28px; letter-spacing: -0.025em; font-weight: 800;">ONE ISLAM</h1>
                            <p style="color: #64748b; margin-top: 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Elite Scholarly Curriculum</p>
                        </div>
                        
                        <div style="color: #1e293b; font-size: 16px; line-height: 1.7; font-weight: 500;">
                            <p style="margin-bottom: 24px; font-size: 18px; font-weight: 700;">Salam ${userName},</p>
                            <p style="margin-bottom: 32px; white-space: pre-wrap;">${personalizedMessage}</p>
                            
                            <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #f1f5f9; text-align: center;">
                                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">You're receiving this as a member of our global knowledge network.</p>
                                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; 2026 One Islam Institute. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            logger.error('Error sending email notification:', error);
        }
    },

    async sendAutoAppliedNotification(userId, job, preferences = {}) {
        try {
            const isManual = preferences.isManual || false;

            // Create in-app notification
            await this.create(userId, {
                type: 'job_application',
                title: isManual ? 'New Match Found' : 'Auto-Applied to Job',
                message: isManual
                    ? `We found a strong match at ${job.company}. Review and apply now!`
                    : `Application submitted to ${job.company} for ${job.title}`,
                data: {
                    jobId: job.id,
                    company: job.company,
                    isManual
                },
                is_read: false
            });

            logger.info(`Notification sent for auto-apply job ${job.id} (${isManual ? 'Manual Match' : 'Auto-Applied'})`);
        } catch (error) {
            logger.error('Error sending auto-apply notification:', error);
        }
    }
};

export default notificationService;
