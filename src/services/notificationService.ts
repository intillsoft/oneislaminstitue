/**
 * Notification Service
 * Handles sending notifications via multiple channels (in-app, email, real-time)
 */

import { supabase } from '../lib/supabase';
import { sendEmail } from '../lib/resend';
import { Database } from '../types/supabase';

type NotificationType = 'general' | 'course_update' | 'enrollment' | 'welcome' | 'deadline' | 'system' | 'achievement' | 'announcement';

interface NotificationPayload {
  userId: string;
  senderId?: string;
  title: string;
  message: string;
  type: string; // Changed to string for more flexibility across disparate modules
  data?: Record<string, any>;
  sendEmail?: boolean;
}

/**
 * Send a notification to a user
 * Creates in-app notification and optionally sends email
 */
export const notificationService = {
  /**
   * Send notification to a single user
   */
  async sendNotification(payload: NotificationPayload) {
    try {
      const { userId, senderId, title, message, type, data, sendEmail: shouldSendEmail } = payload;

      // 1. Create in-app notification in Supabase
      const { data: notification, error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          sender_id: senderId || null,
          title,
          message,
          type,
          data: data || null,
        })
        .select()
        .single();

      if (notifError) {
        console.error('Error creating notification:', notifError);
        throw notifError;
      }

      // 2. Send email if requested
      if (shouldSendEmail) {
        try {
          // Get user email
          const { data: userData } = await supabase
            .from('users')
            .select('email, name')
            .eq('id', userId)
            .single();

          if (userData?.email) {
            await sendEmail({
              to: userData.email,
              subject: title,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333; margin-bottom: 16px;">${title}</h2>
                  <p style="color: #666; line-height: 1.6; margin-bottom: 24px;">${message}</p>
                  <p style="color: #999; font-size: 12px; margin-top: 32px;">
                    Log in to your account to view more details.
                  </p>
                </div>
              `,
            });
          }
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't throw - in-app notification was created successfully
        }
      }

      return {
        success: true,
        notification,
      };
    } catch (error) {
      console.error('Notification service error:', error);
      throw error;
    }
  },

  /**
   * Send notifications to multiple users
   */
  async sendBulkNotifications(payload: Omit<NotificationPayload, 'userId'> & { userIds: string[] }) {
    try {
      const { userIds, senderId, title, message, type, data, sendEmail } = payload;

      const notifications = userIds.map(userId => ({
        user_id: userId,
        sender_id: senderId || null,
        title,
        message,
        type,
        data: data || null,
      }));

      // 1. Batch insert notifications
      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifError) {
        console.error('Error creating bulk notifications:', notifError);
        throw notifError;
      }

      // 2. Send emails if requested
      if (sendEmail) {
        try {
          const { data: users } = await supabase
            .from('users')
            .select('id, email, name')
            .in('id', userIds);

          if (users && users.length > 0) {
            const emailPromises = users.map(user =>
              sendEmail({
                to: user.email,
                subject: title,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; margin-bottom: 16px;">${title}</h2>
                    <p style="color: #666; line-height: 1.6; margin-bottom: 24px;">${message}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 32px;">
                      Log in to your account to view more details.
                    </p>
                  </div>
                `,
              }).catch(err => console.error(`Email send failed for ${user.email}:`, err))
            );

            await Promise.allSettled(emailPromises);
          }
        } catch (emailError) {
          console.error('Error sending bulk emails:', emailError);
        }
      }

      return {
        success: true,
        count: userIds.length,
      };
    } catch (error) {
      console.error('Bulk notification service error:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Get notifications for a user with pagination
   */
  async getNotifications(userId: string, limit = 20, offset = 0) {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      notifications: data || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0),
    };
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
