import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { EliteCard } from '../../../components/ui/EliteCard';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const RecentActivity = () => {
  const { user } = useAuthContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActivities();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const applications = await enrollmentService.getAll();

      const recentApps = applications
        .slice(0, 5)
        .map(app => ({
          id: app.id,
          type: 'enrollment_status',
          title: 'Enrollment Status Update',
          company: app.job?.company || app.job?.companies?.name,
          companyLogo: app.job?.companies?.logo || app.job?.logo,
          position: app.job?.title,
          status: app.status,
          message: getStatusMessage(app.status),
          timestamp: app.applied_at || app.updated_at,
          jobId: app.job_id,
        }));

      setActivities(recentApps);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (status) => {
    const messages = {
      applied: 'You have enrolled in this course',
      enrolled: 'You have enrolled in this course',
      reviewed: 'Your study module is now ready',
      interview: 'An assessment is ready for your review',
      offer: 'Congratulations! You have earned a certificate',
      completed: 'Congratulations! You have earned a certificate',
      rejected: 'Enrollment notification',
    };
    return messages[status] || 'Enrollment status update';
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'text-workflow-primary',
      reviewed: 'text-text-muted',
      interview: 'text-emerald-500',
      offer: 'text-emerald-500',
      rejected: 'text-red-500',
    };
    return colors[status] || 'text-text-muted';
  };

  const getStatusBadge = (status) => {
    const badges = {
      applied: 'bg-workflow-primary/10 text-workflow-primary border-workflow-primary/20',
      reviewed: 'bg-surface-elevated text-text-muted border-border',
      interview: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      offer: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return badges[status] || 'bg-surface-elevated text-text-muted border-emerald-500/20';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-24 bg-surface dark:bg-bg border border-emerald-500/20 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <EliteCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-surface-elevated dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" className="w-8 h-8 text-text-muted dark:text-slate-600 transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">No recent activity</h3>
          <p className="text-sm text-text-secondary dark:text-slate-400">Your recent course updates will appear here</p>
        </div>
      </EliteCard>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="p-4 rounded-lg bg-surface-elevated dark:bg-white/5 hover:bg-surface dark:hover:bg-white/10 transition-all border border-emerald-500/20"
        >
          <div className="flex items-start gap-3">
            {activity.companyLogo && (
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-emerald-500/20">
                <Image
                  src={activity.companyLogo}
                  alt={activity.company}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1 gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-text-primary dark:text-white truncate">
                    {activity.position}
                  </h4>
                  <p className="text-xs font-medium text-text-muted dark:text-slate-400">{activity.company}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-lg border ${getStatusBadge(activity.status)} uppercase tracking-wide`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-xs md:text-sm text-text-secondary dark:text-slate-300 mb-2">
                {activity.message}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted dark:text-slate-500">
                  {activity.timestamp && formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
                {activity.jobId && (
                  <Link
                    to={`/courses/detail/${activity.jobId}`}
                    className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <span className="hidden sm:inline">Details</span>
                    <Icon name="ArrowRight" size={12} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
