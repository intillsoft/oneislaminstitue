import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { applicationService } from '../../../services/applicationService';
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
      const applications = await applicationService.getAll();
      
      // Transform applications into activities
      const recentApps = applications
        .slice(0, 5)
        .map(app => ({
          id: app.id,
          type: 'application_status',
          title: 'Application Status Update',
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
      applied: 'Your application has been submitted',
      reviewed: 'Your application has been reviewed by the hiring team',
      interview: 'Your application has moved to the interview stage',
      offer: 'Congratulations! You received an offer',
      rejected: 'Application status update',
    };
    return messages[status] || 'Application status update';
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'text-workflow-primary',
      reviewed: 'text-[#64748B] dark:text-[#8B92A3]',
      interview: 'text-success',
      offer: 'text-success',
      rejected: 'text-error',
    };
    return colors[status] || 'text-[#64748B] dark:text-[#8B92A3]';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-24 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-background rounded-lg border border-border shadow-soft p-6 text-center">
        <Icon name="Activity" className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">No recent activity</h3>
        <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">Your recent job application updates will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-soft relative">
      <div className="absolute top-4 right-4 z-10">
        <ComponentAIAssistant
          componentName="Recent Activity"
          componentData={{
            totalActivities: activities.length,
            activities: activities.map(a => ({
              type: a.type,
              status: a.status,
              position: a.position,
              company: a.company
            }))
          }}
          position="top-right"
        />
      </div>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors">
            <div className="flex items-start gap-4">
              {activity.companyLogo && (
                <Image
                  src={activity.companyLogo}
                  alt={activity.company}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                      {activity.position}
                    </h4>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">{activity.company}</p>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-2">
                  {activity.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">
                    {activity.timestamp && formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  {activity.jobId && (
                    <Link
                      to={`/jobs/detail?id=${activity.jobId}`}
                      className="text-xs text-workflow-primary hover:text-workflow-primary-600 flex items-center gap-1"
                    >
                      View Details
                      <Icon name="ArrowRight" size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;