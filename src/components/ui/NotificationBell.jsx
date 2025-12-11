import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { useToast } from './Toast';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
        if (isOpen) {
          loadNotifications();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.notifications.getAll({ limit: 5 });
      if (response.data?.success) {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.notifications.getUnreadCount();
      if (response.data?.success) {
        setUnreadCount(response.data.data.count || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiService.notifications.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showError('Failed to mark notification as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await apiService.notifications.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (!notifications.find(n => n.id === notificationId)?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => apiService.notifications.markAsRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showError('Failed to mark all as read');
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadNotifications();
          }
        }}
        className="relative p-2 text-text-secondary dark:text-[#8B92A3] hover:text-workflow-primary dark:hover:text-workflow-primary-400 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#13182E] rounded-xl shadow-2xl border-2 border-[#E2E8F0] dark:border-[#1E2640] z-50 max-h-[500px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] dark:border-[#1E2640]">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#E8EAED]">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-workflow-primary hover:text-workflow-primary-600"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-workflow-primary mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-2" />
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E2640]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-surface-50 dark:hover:bg-[#1A2139] transition-colors ${
                        !notification.read ? 'bg-workflow-primary/5 dark:bg-workflow-primary/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {notification.icon || '🔔'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#0F172A] dark:text-[#E8EAED] mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mb-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {notification.action_url && (
                              <Link
                                to={notification.action_url}
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-workflow-primary hover:text-workflow-primary-600"
                              >
                                {notification.action_label || 'View'}
                              </Link>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-[#64748B] dark:text-[#8B92A3] hover:text-workflow-primary"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-xs text-[#64748B] dark:text-[#8B92A3] hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm text-workflow-primary hover:text-workflow-primary-600 font-medium"
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;