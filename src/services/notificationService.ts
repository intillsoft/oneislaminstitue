/**
 * Notification Service
 * Handles sending notifications via multiple channels (in-app, email, real-time)
 */

import { supabase } from '../lib/supabase';

type NotificationType = 'general' | 'course_update' | 'enrollment' | 'welcome' | 'deadline' | 'system' | 'achievement' | 'announcement';

interface NotificationPayload {
  userId: string;
  senderId?: string;
  title: string;
  message: string;
  type: string; // Changed to string for more flexibility across disparate modules
  data?: Record<string, any>;
  sendEmail?: boolean;
  sendSMS?: boolean;
  sendWhatsApp?: boolean;
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
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication required to send remote notifications');
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          // Forward these directly so the backend handles email processing
          sendEmail: payload.sendEmail || false,
          sendSMS: payload.sendSMS || false,
          sendWhatsApp: payload.sendWhatsApp || false
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
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
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        throw new Error('Authentication required to send remote broadcast');
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userIds: payload.userIds,
          title: payload.title,
          message: payload.message,
          type: payload.type,
          data: payload.data,
          sendEmail: payload.sendEmail || false,
          sendSMS: payload.sendSMS || false,
          sendWhatsApp: payload.sendWhatsApp || false
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send bulk notification: ${response.statusText}`);
      }

      return await response.json();
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
