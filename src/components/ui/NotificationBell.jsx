import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Zap, ChevronDown } from 'lucide-react';
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
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadNotifications();
          }
        }}
        className={`relative p-2.5 transition-all duration-300 rounded-xl border ${
          isOpen
            ? 'bg-slate-100 border-slate-200 text-slate-900 shadow-inner dark:bg-white/[0.08] dark:border-white/10 dark:text-white'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/5'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/30 dark:bg-black/40 backdrop-blur-sm z-[9998]"
            />

            <motion.div
              initial={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
              animate={{ y: 0, x: 0, opacity: 1 }}
              exit={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              drag={isMobile ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (isMobile && (offset.y > 120 || velocity.y > 400)) {
                  setIsOpen(false);
                }
              }}
              style={{ 
                width: isMobile ? '100%' : '380px',
                height: isMobile ? '85dvh' : '100dvh' 
              }}
              className={`fixed ${isMobile ? 'bottom-0 left-0 right-0' : 'top-0 bottom-0 right-0'} bg-white dark:bg-[#0A0E27] backdrop-blur-3xl z-[9999] shadow-[-1px_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[-5px_-20px_60px_rgba(0,0,0,0.4)] flex flex-col border-gray-100 dark:border-white/5 ${isMobile ? 'border-t rounded-t-[2.5rem]' : 'border-l rounded-l-[2.5rem]'} overflow-hidden transition-all duration-300`}
            >
              {/* Pull Handle for Mobile */}
              {isMobile && (
                <div className="flex justify-center p-3 cursor-grab flex-shrink-0 border-b border-gray-50 dark:border-white/[0.02]">
                  <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700/80" />
                </div>
              )}
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex-shrink-0">
              <div>
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">Notifications</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                  {unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                  {unreadCount > 0 ? `${unreadCount} New` : 'All Caught Up'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[9px] font-black text-slate-500 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 transition-all uppercase tracking-[0.1em]"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[60vh] md:max-h-[440px] custom-scrollbar">
              {loading && !notifications.length ? (
                <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <div className="w-6 h-6 border-2 border-slate-200 dark:border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600 shadow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No Messages</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={(e) => handleNotificationClick(e, notification)}
                      className={`block p-4 transition-all duration-500 hover:bg-slate-100/50 dark:hover:bg-white/[0.03] cursor-pointer group relative overflow-hidden ${
                        !notification.is_read ? 'bg-emerald-50/50 dark:bg-emerald-500/[0.02]' : 'opacity-70 dark:opacity-40'
                      }`}
                    >
                      <div className="flex items-start gap-6 relative z-10">
                        <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                          !notification.is_read ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-slate-300 dark:bg-slate-800'
                        }`} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4 mb-1">
                            <h4 className={`text-xs font-bold uppercase tracking-tight truncate transition-all ${!notification.is_read ? 'text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400' : 'text-slate-700 dark:text-slate-500'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap mt-0.5 opacity-60">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className={`text-[11px] leading-relaxed line-clamp-2 mb-2 font-medium transition-all ${
                            !notification.is_read ? 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200' : 'text-slate-400 dark:text-slate-600'
                          }`}>
                            {notification.message || notification.description}
                          </p>

                          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest transition-colors flex items-center gap-1.5">
                                View <ChevronDown className="-rotate-90 w-3 h-3" />
                              </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-[9px] font-black text-slate-400 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white uppercase tracking-[0.2em] transition-colors"
                            >
                              Mark Read
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Elegant hover background accent */}
                      {!notification.is_read && (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-[60px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex-shrink-0">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-white border border-slate-200 shadow-sm dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 dark:border-white/5 transition-all duration-500"
              >
                Settings
              </Link>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;