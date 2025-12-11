import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const MetricsCards = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [metrics, setMetrics] = useState([
    { id: 1, title: 'Active Jobs', value: 0, change: 0, changeType: 'increase', icon: 'Briefcase', color: 'primary' },
    { id: 2, title: 'Total Applications', value: 0, change: 0, changeType: 'increase', icon: 'FileText', color: 'secondary' },
    { id: 3, title: 'Interview Conversions', value: '0%', change: 0, changeType: 'increase', icon: 'Users', color: 'accent' },
    { id: 4, title: 'Hiring Success Rate', value: '0%', change: 0, changeType: 'increase', icon: 'CheckCircle', color: 'warning' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadMetrics();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch only recruiter's jobs (not all jobs)
      const jobsResult = profile?.role === 'admin' 
        ? await jobService.getAll({ pageSize: 1000 }) // Admins see all
        : await jobService.getByRecruiter(user.id, { pageSize: 1000 }); // Recruiters see only their own
      const allJobs = jobsResult.data || [];
      const activeJobs = allJobs.filter(job => job.status === 'active' || job.status === 'published' || !job.status);
      
      // Fetch applications
      const applications = await applicationService.getAllForRecruiter();
      const allApplications = applications || [];
      
      // Calculate metrics
      const totalApplications = allApplications.length;
      const interviewApplications = allApplications.filter(app => 
        app.status === 'interview' || app.status === 'interview_scheduled'
      ).length;
      const hiredApplications = allApplications.filter(app => 
        app.status === 'hired' || app.status === 'accepted'
      ).length;
      
      const interviewConversion = totalApplications > 0 
        ? ((interviewApplications / totalApplications) * 100).toFixed(1)
        : 0;
      
      const hiringSuccessRate = totalApplications > 0
        ? ((hiredApplications / totalApplications) * 100).toFixed(1)
        : 0;

      setMetrics([
        {
          id: 1,
          title: 'Active Jobs',
          value: activeJobs.length,
          change: 0, // Would need historical data to calculate
          changeType: 'increase',
          icon: 'Briefcase',
          color: 'primary',
        },
        {
          id: 2,
          title: 'Total Applications',
          value: totalApplications,
          change: 0,
          changeType: 'increase',
          icon: 'FileText',
          color: 'secondary',
        },
        {
          id: 3,
          title: 'Interview Conversions',
          value: `${interviewConversion}%`,
          change: 0,
          changeType: 'increase',
          icon: 'Users',
          color: 'accent',
        },
        {
          id: 4,
          title: 'Hiring Success Rate',
          value: `${hiringSuccessRate}%`,
          change: 0,
          changeType: 'increase',
          icon: 'CheckCircle',
          color: 'warning',
        },
      ]);
    } catch (error) {
      console.error('Error loading metrics:', error);
      showError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-surface-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-surface-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="card p-5 flex flex-col bg-background dark:bg-[#13182E] border border-border hover:shadow-lg transition-all duration-300 relative">
          <div className="absolute top-2 right-2 z-10">
            <ComponentAIAssistant
              componentName={`${metric.title} Metric`}
              componentData={{
                title: metric.title,
                value: metric.value,
                change: metric.change,
                changeType: metric.changeType
              }}
              position="top-right"
            />
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-text-secondary mb-1 dark:text-gray-400">{metric.title}</p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white">{metric.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${metric.color}-50 dark:bg-${metric.color}-900/20`}>
              <Icon 
                name={metric.icon} 
                size={20} 
                className={`text-${metric.color} dark:text-${metric.color}-400`} 
              />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`flex items-center ${
              metric.changeType === 'increase' ? 'text-success dark:text-green-400' : 'text-error dark:text-red-400'
            }`}>
              <Icon 
                name={metric.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className="mr-1" 
              />
              <span className="text-sm font-medium">{metric.change}%</span>
            </div>
            <span className="text-xs text-text-secondary dark:text-gray-400 ml-2">vs. last period</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
