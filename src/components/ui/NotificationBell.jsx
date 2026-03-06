import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Zap, ChevronDown } from 'lucide-react';
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
        className="relative p-2.5 text-slate-500 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            className="absolute right-0 mt-4 w-[calc(100vw-2rem)] md:w-96 bg-[#0c0c0e]/95 backdrop-blur-3xl border border-white/10 rounded-3xl z-50 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-7 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Notifications</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                  {unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                  {unreadCount > 0 ? `${unreadCount} New Messages` : 'All Caught Up'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[9px] font-black text-slate-600 hover:text-white px-4 py-2 bg-white/5 rounded-xl border border-white/5 transition-all uppercase tracking-[0.2em]"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[440px] custom-scrollbar">
              {loading && !notifications.length ? (
                <div className="p-24 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-center mx-auto mb-8 text-slate-900 shadow-2xl">
                    <Zap className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.6em]">No Messages</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-8 transition-all duration-500 hover:bg-white/[0.03] group relative overflow-hidden ${
                        !notification.is_read ? 'bg-emerald-500/[0.01]' : 'opacity-40'
                      }`}
                    >
                      <div className="flex items-start gap-6 relative z-10">
                        <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                          !notification.is_read ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-slate-800'
                        }`} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h4 className={`text-xs font-black uppercase tracking-tight truncate transition-all ${!notification.is_read ? 'text-white group-hover:text-emerald-400' : 'text-slate-500'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest whitespace-nowrap mt-0.5 opacity-60">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className={`text-[11px] leading-relaxed line-clamp-2 mb-5 font-medium transition-all ${
                            !notification.is_read ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-700'
                          }`}>
                            {notification.message || notification.description}
                          </p>

                          <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            {(notification.action_url || notification.data?.jobId) && (
                              <Link
                                to={notification.action_url ? notification.action_url.replace('/jobs', '/courses') : `/course/${notification.data.jobId}`}
                                onClick={() => setIsOpen(false)}
                                className="text-[9px] font-black text-emerald-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5"
                              >
                                View <ChevronDown className="-rotate-90 w-3 h-3" />
                              </Link>
                            )}
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] transition-colors"
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
            <div className="p-7 border-t border-white/5 bg-white/[0.01]">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 hover:text-white hover:bg-white/5 border border-white/5 transition-all duration-500 shadow-2xl shadow-black/40"
              >
                View all settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;