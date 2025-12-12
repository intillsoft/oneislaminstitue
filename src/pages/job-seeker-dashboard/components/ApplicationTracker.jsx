import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const ApplicationTracker = () => {
  const { user } = useAuthContext();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user, filter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await applicationService.getAll({ status: filter === 'all' ? null : filter });
      setApplications(apps || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Icon name="FileText" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
        <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Sign in to track your applications</p>
        <Link to="/login" className="btn-primary inline-flex items-center">
          Sign In
        </Link>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      applied: { icon: 'Send', color: 'text-workflow-primary', bgColor: 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20' },
      reviewed: { icon: 'CheckCircle', color: 'text-[#64748B]', bgColor: 'bg-[#F8FAFC] dark:bg-[#1A2139]' },
      interview: { icon: 'Calendar', color: 'text-success', bgColor: 'bg-success-50 dark:bg-success-900/20' },
      offer: { icon: 'Award', color: 'text-success', bgColor: 'bg-success-50 dark:bg-success-900/20' },
      rejected: { icon: 'XCircle', color: 'text-error', bgColor: 'bg-error-50 dark:bg-error-900/20' },
    };
    return statusMap[status] || statusMap.applied;
  };

  const getStatusText = (status) => {
    const statusTextMap = {
      applied: 'Application Submitted',
      reviewed: 'Application Reviewed',
      interview: 'Interview Scheduled',
      offer: 'Offer Received',
      rejected: 'Not Selected',
    };
    return statusTextMap[status] || status;
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications?.filter(app => app?.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-32 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="FileText" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">No applications yet</h3>
        <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Start applying to jobs to track your progress</p>
        <Link to="/jobs" className="btn-primary inline-flex items-center">
          <Icon name="Search" size={16} className="mr-2" />
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-visible">
      <div className="absolute -top-2 -right-2 z-50">
        <ComponentAIAssistant
          componentName="Application Tracker"
          componentData={{
            totalApplications: applications.length,
            filteredApplications: filteredApplications.length,
            filter,
            statusBreakdown: {
              applied: applications.filter(a => a.status === 'applied').length,
              reviewed: applications.filter(a => a.status === 'reviewed').length,
              interview: applications.filter(a => a.status === 'interview').length,
              offer: applications.filter(a => a.status === 'offer').length,
              rejected: applications.filter(a => a.status === 'rejected').length
            }
          }}
          position="top-right"
        />
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'applied', 'reviewed', 'interview', 'offer', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                ? 'bg-workflow-primary text-white'
                : 'bg-[#F8FAFC] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] hover:bg-[#E2E8F0] dark:hover:bg-[#1E2640]'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => {
          const job = application.job || {};
          const statusInfo = getStatusInfo(application.status);
          const StatusIcon = Icon;

          return (
            <div
              key={application.id}
              className="bg-background rounded-lg border border-border shadow-soft p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {job.logo && (
                      <Image
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <Link
                        to={`/jobs/detail?id=${job.id}`}
                        className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] hover:text-workflow-primary transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[#64748B] dark:text-[#8B92A3] mt-1">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
                        <span className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {job.location}
                        </span>
                        {application.applied_at && (
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            Applied {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`ml-4 px-3 py-1.5 rounded-full flex items-center gap-2 ${statusInfo.bgColor}`}>
                  <StatusIcon name={statusInfo.icon} size={16} className={statusInfo.color} />
                  <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>
              </div>
              {application.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">{application.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTracker;