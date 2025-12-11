import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { applicationService } from '../../../services/applicationService';
import { jobService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllActivity, setShowAllActivity] = useState(false);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadActivities();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      
      const [applications, jobsResult] = await Promise.all([
        applicationService.getAllForRecruiter(),
        profile?.role === 'admin'
          ? jobService.getAll({ pageSize: 50 }) // Admins see all
          : jobService.getByRecruiter(user.id, { pageSize: 50 }) // Recruiters see only their own
      ]);

      const allJobs = jobsResult.data || [];
      const activityList = [];

      // Add application activities
      applications.slice(0, 10).forEach(app => {
        const user = app.user || {};
        const job = app.job || {};
        const avatarUrl = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=random`;
        
        let icon = 'FileText';
        let iconColor = 'primary';
        let content = '';

        if (app.status === 'interview' || app.status === 'interview_scheduled') {
          icon = 'Calendar';
          iconColor = 'warning';
          content = `Interview scheduled with ${user.name || 'Candidate'} for ${job.title || 'position'}`;
        } else if (app.status === 'hired' || app.status === 'accepted') {
          icon = 'CheckCircle';
          iconColor = 'success';
          content = `${user.name || 'Candidate'} accepted offer for ${job.title || 'position'}`;
        } else if (app.status === 'offer' || app.status === 'offer_sent') {
          icon = 'Send';
          iconColor = 'success';
          content = `Offer sent to ${user.name || 'Candidate'} for ${job.title || 'position'}`;
        } else if (app.status === 'assessment' || app.status === 'testing') {
          icon = 'ArrowRight';
          iconColor = 'accent';
          content = `${user.name || 'Candidate'} moved to Assessment stage for ${job.title || 'position'}`;
        } else {
          content = `New application from ${user.name || 'Candidate'} for ${job.title || 'position'}`;
        }

        activityList.push({
          id: `app-${app.id}`,
          type: 'application',
          content,
          timestamp: app.applied_at || app.updated_at || new Date(),
          user: {
            name: user.name || user.email || 'Unknown',
            avatar: avatarUrl,
          },
          icon,
          iconColor,
        });
      });

      // Add job posting activities
      allJobs.slice(0, 5).forEach(job => {
        activityList.push({
          id: `job-${job.id}`,
          type: 'job',
          content: `New job posted: ${job.title}`,
          timestamp: job.created_at || new Date(),
          icon: 'Briefcase',
          iconColor: 'secondary',
        });
      });

      // Sort by timestamp and take most recent
      activityList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAllActivities(activityList);
      setActivities(activityList.slice(0, 5));
    } catch (error) {
      console.error('Error loading activities:', error);
      showError('Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Recently';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getIconBackground = (color) => {
    const backgrounds = {
      primary: 'bg-primary-50 dark:bg-primary-900/20',
      secondary: 'bg-secondary-100 dark:bg-secondary-800',
      accent: 'bg-accent-50 dark:bg-accent-900/20',
      warning: 'bg-warning-50 dark:bg-warning-900/20',
      success: 'bg-success-50 dark:bg-success-900/20',
      error: 'bg-error-50 dark:bg-error-900/20',
    };
    return backgrounds[color] || 'bg-secondary-100 dark:bg-secondary-800';
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary dark:text-primary-400',
      secondary: 'text-secondary-600 dark:text-secondary-400',
      accent: 'text-accent dark:text-accent-400',
      warning: 'text-warning dark:text-warning-400',
      success: 'text-success dark:text-success-400',
      error: 'text-error dark:text-error-400',
    };
    return colors[color] || 'text-secondary-600 dark:text-secondary-400';
  };

  if (loading) {
    return (
      <div className="card h-full bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white">Recent Activity</h3>
          <button className="text-text-secondary hover:text-text-primary dark:hover:text-white transition-smooth">
            <Icon name="MoreHorizontal" size={20} />
          </button>
        </div>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-text-secondary dark:text-gray-400">
            <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getIconBackground(activity.iconColor)} flex items-center justify-center mr-3`}>
                  <Icon name={activity.icon} size={18} className={getIconColor(activity.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-primary dark:text-white">{activity.content}</div>
                  <div className="mt-1 flex items-center flex-wrap gap-2">
                    {activity.user && (
                      <div className="flex items-center">
                        <Image 
                          src={activity.user.avatar} 
                          alt={activity.user.name} 
                          className="h-4 w-4 rounded-full mr-1"
                        />
                        <span className="text-xs text-text-secondary dark:text-gray-400 truncate">{activity.user.name}</span>
                      </div>
                    )}
                    <span className="text-xs text-text-secondary dark:text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border dark:border-gray-700">
            <button 
              onClick={() => setShowAllActivity(true)}
              className="w-full text-center text-sm text-primary hover:text-primary-700 dark:hover:text-primary-400 transition-smooth font-medium"
            >
              View All Activity ({allActivities.length})
            </button>
          </div>
        )}

        {/* View All Activity Modal */}
        {showAllActivity && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#13182E] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary dark:text-white">All Activity</h2>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                    Complete activity log for your account
                  </p>
                </div>
                <button
                  onClick={() => setShowAllActivity(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              {/* Activity List */}
              <div className="flex-1 overflow-y-auto p-6">
                {allActivities.length === 0 ? (
                  <div className="text-center py-12 text-text-secondary dark:text-gray-400">
                    <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No activity found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-full ${getIconBackground(activity.iconColor)} flex items-center justify-center`}>
                          <Icon name={activity.icon} size={20} className={getIconColor(activity.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-text-primary dark:text-white mb-1">{activity.content}</div>
                          <div className="flex items-center flex-wrap gap-3">
                            {activity.user && (
                              <div className="flex items-center gap-2">
                                <Image 
                                  src={activity.user.avatar} 
                                  alt={activity.user.name} 
                                  className="h-5 w-5 rounded-full"
                                />
                                <span className="text-sm text-text-secondary dark:text-gray-400">{activity.user.name}</span>
                              </div>
                            )}
                            <span className="text-sm text-text-secondary dark:text-gray-400">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowAllActivity(false)}
                  className="px-6 py-2 rounded-lg bg-workflow-primary text-white hover:bg-workflow-primary-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
