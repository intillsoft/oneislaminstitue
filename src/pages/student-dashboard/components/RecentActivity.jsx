import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

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

  const getStatusBadge = (status) => {
    const badges = {
      applied: 'bg-[var(--color-info-bg)] text-[var(--color-primary)] border-[var(--border)]',
      reviewed: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] border-[var(--border)]',
      interview: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-green-200',
      offer: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-green-200',
      rejected: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-red-200',
    };
    return badges[status] || 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] border-[var(--border)]';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-24 bg-[var(--card)] border border-[var(--border)] rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" className="w-8 h-8 text-[var(--color-text-tertiary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">No recent activity</h3>
          <p className="text-sm text-[var(--color-text-tertiary)]">Your recent course updates will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--color-border-secondary)] transition-all"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-start gap-3">
            {activity.companyLogo && (
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[var(--border)]">
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
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                    {activity.position}
                  </h4>
                  <p className="text-xs font-medium text-[var(--color-text-tertiary)]">{activity.company}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-md border ${getStatusBadge(activity.status)} uppercase tracking-wide`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mb-2">
                {activity.message}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-tertiary)]">
                  {activity.timestamp && formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
                {activity.jobId && (
                  <Link
                    to={`/courses/detail/${activity.jobId}`}
                    className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] flex items-center gap-1 transition-colors"
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
