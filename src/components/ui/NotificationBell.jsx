import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, ChevronDown, X } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { useToast } from './Toast';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();

      const interval = setInterval(() => {
        loadUnreadCount();
        if (isOpen) {
          loadNotifications();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await apiService.supabase.auth.getSession();
      if (!session) return;

      const response = await apiService.notifications.getAll({ limit: 5 });
      if (response.data?.success) {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (error) {
      if (error.status !== 401) {
        console.error('Error loading notifications:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { data: { session } } = await apiService.supabase.auth.getSession();
      if (!session) return;

      const response = await apiService.notifications.getUnreadCount();
      if (response.data?.success) {
        setUnreadCount(response.data.data.count || 0);
      }
    } catch (error) {
      if (error.status !== 401) {
        console.error('Error loading unread count:', error);
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiService.notifications.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.is_read)
          .map(n => apiService.notifications.markAsRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      success('Queue cleared');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (e, notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    
    let parsedData = {};
    if (typeof notification.data === 'string') {
      try { parsedData = JSON.parse(notification.data); } catch (err) {}
    } else if (notification.data) {
      parsedData = notification.data;
    }

    const actionUrl = notification.action_url || parsedData.action_url;
    const jobId = parsedData.jobId || parsedData.courseId;

    if (actionUrl) {
      navigate(actionUrl.replace('/jobs', '/courses').replace('/job/', '/courses/detail/'));
    } else if (jobId) {
      navigate(`/courses/detail/${jobId}`);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadNotifications();
          }
        }}
        className={`relative p-2.5 transition-all duration-300 rounded-lg border border-transparent ${
          isOpen
            ? 'bg-white text-[var(--color-primary)] shadow-md dark:bg-white/10 dark:border-white/10 dark:text-white scale-95'
            : 'bg-white/10 text-white shadow-sm hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/80 dark:hover:text-white'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary)] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-12 mt-2 w-[320px] bg-card dark:bg-[#0A111F] border border-border/40 dark:border-white/10 rounded-xl shadow-modal z-[100] flex flex-col overflow-hidden backdrop-blur-xl"
          >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20 dark:bg-white/[0.02] flex-shrink-0">
                <div>
                  <h3 className="text-[10px] font-black text-foreground dark:text-white uppercase tracking-[0.25em]">Notifications</h3>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    {unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />}
                    {unreadCount > 0 ? `${unreadCount} New` : 'All Caught Up'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[9px] font-black text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors uppercase tracking-[0.1em] px-2.5 py-1 bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 rounded-lg"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-[300px] custom-scrollbar">
                {loading && !notifications.length ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-4">
                    <div className="w-5 h-5 border-2 border-slate-200 dark:border-white/10 border-t-[var(--color-primary)] rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm">
                      <Zap className="w-5 h-5" />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">No New Alerts</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={(e) => handleNotificationClick(e, notification)}
                        className={`block p-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer group relative overflow-hidden ${
                          !notification.is_read ? 'bg-[var(--color-primary-light)]/30 dark:bg-[var(--color-primary)]/[0.01]' : 'opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3 relative z-10">
                          <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
                            !notification.is_read ? 'bg-[var(--color-primary)] shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-300 dark:bg-slate-700'
                          }`} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4 mb-0.5">
                              <h4 className={`text-xs font-bold truncate transition-all ${!notification.is_read ? 'text-foreground dark:text-white' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap mt-0.5 opacity-80">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            
                            <p className={`text-[10px] leading-relaxed line-clamp-2 mb-1.5 font-light ${
                              !notification.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {notification.message || notification.description}
                            </p>

                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                              <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest flex items-center gap-1">
                                View
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 uppercase tracking-widest transition-colors"
                              >
                                Dismiss
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
              <div className="p-3 border-t border-border/40 bg-muted/20 dark:bg-white/[0.01] flex-shrink-0">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white bg-card dark:bg-white/5 hover:bg-muted border border-border/40 transition-all duration-300"
                >
                  All Notifications
                </Link>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;