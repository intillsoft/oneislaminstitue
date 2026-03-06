/**
 * useNotifications Hook
 * Handle notification fetching, real-time subscriptions, and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  sender_id: string;
  title: string;
  message: string;
  type: string;
  data: Record<string, any> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async (limit = 20, offset = 0) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const session = await supabase.auth.getSession();
      const response = await fetch(`/api/notifications?limit=${limit}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .from('notifications')
      .on('INSERT', (payload) => {
        if (payload.new.user_id === user.id) {
          setNotifications((prev) => [payload.new, ...prev]);
          if (!payload.new.is_read) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      })
      .on('UPDATE', (payload) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === payload.new.id ? payload.new : n))
        );
        if (payload.old.is_read === false && payload.new.is_read === true) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      })
      .on('DELETE', (payload) => {
        setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
        if (!payload.old.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const session = await supabase.auth.getSession();
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
          body: JSON.stringify({ action: 'mark-as-read' }),
        });

        return response.ok;
      } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const session = await supabase.auth.getSession();
      const response = await fetch('/api/notifications/all', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({ action: 'mark-all-as-read' }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const session = await supabase.auth.getSession();
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
        });

        return response.ok;
      } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
      }
    },
    []
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
