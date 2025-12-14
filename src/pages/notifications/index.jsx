import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Info, X, Filter } from 'lucide-react';
import Breadcrumb from 'components/ui/Breadcrumb';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { applicationService } from '../../services/applicationService';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import Button from 'components/ui/Button';

const NotificationCenter = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, interview, status, info

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const applications = await applicationService.getAll();
      
      // Generate notifications from applications
      const notifs = [];
      
      // Interview reminders (upcoming interviews)
      applications
        .filter(app => app.status === 'interview' && app.applied_at)
        .forEach(app => {
          const interviewDate = new Date(app.applied_at);
          interviewDate.setDate(interviewDate.getDate() + 7); // Assume interview 7 days after application
          
          if (isToday(interviewDate) || isTomorrow(interviewDate)) {
            notifs.push({
              id: `interview-${app.id}`,
              type: 'interview',
              title: 'Interview Reminder',
              message: `You have an interview${isToday(interviewDate) ? ' today' : ' tomorrow'}`,
              timestamp: interviewDate.toISOString(),
              applicationId: app.id,
              read: false
            });
          }
        });
      
      // Status updates
      applications
        .filter(app => app.updated_at && app.status !== 'applied')
        .forEach(app => {
          const updatedDate = parseISO(app.updated_at);
          const daysSinceUpdate = Math.floor((new Date() - updatedDate) / (1000 * 60 * 60 * 24));
          
          if (daysSinceUpdate <= 7) {
            notifs.push({
              id: `status-${app.id}`,
              type: 'status',
              title: 'Application Status Updated',
              message: `Your application for "${app.job_title || 'a position'}" status changed to ${app.status}`,
              timestamp: app.updated_at,
              applicationId: app.id,
              read: false
            });
          }
        });
      
      // Sort by timestamp (newest first)
      notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
      showError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'interview':
        return <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'status':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = parseISO(timestamp);
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.applicationId) {
      navigate(`/application-detail?id=${notification.applicationId}`);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'read' && !notif.read) return false;
    if (typeFilter !== 'all' && notif.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Helmet>
        <title>Notifications | Workflow</title>
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Notifications' }
            ]}
          />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                </div>
                <div className="flex gap-2">
                  {['all', 'unread', 'read'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 ml-auto">
                  {['all', 'interview', 'status', 'info'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        typeFilter === t
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {notifications.length === 0
                      ? "You don't have any notifications yet."
                      : "No notifications match your current filters."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {notif.title}
                                </h4>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatTimestamp(notif.timestamp)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                              aria-label="Delete notification"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;










