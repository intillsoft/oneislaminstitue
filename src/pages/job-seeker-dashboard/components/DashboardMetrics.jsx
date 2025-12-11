import React from 'react';
import Icon from 'components/AppIcon';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const DashboardMetrics = ({ metrics, loading }) => {
  const metricCards = [
    {
      id: 'applications',
      label: 'Applications Submitted',
      value: metrics?.applicationsSubmitted || 0,
      icon: 'FileText',
      color: 'workflow-primary',
      trend: null,
      trendUp: null
    },
    {
      id: 'interviews',
      label: 'Interviews Scheduled',
      value: metrics?.interviewsScheduled || 0,
      icon: 'Calendar',
      color: 'success',
      trend: null,
      trendUp: null
    },
    {
      id: 'saved',
      label: 'Saved Jobs',
      value: metrics?.savedJobs || 0,
      icon: 'Bookmark',
      color: 'warning',
      trend: null,
      trendUp: null
    },
    {
      id: 'matches',
      label: 'New Matches',
      value: metrics?.newMatches || 0,
      icon: 'Zap',
      color: 'secondary',
      trend: 'Based on your profile',
      trendUp: null
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse h-24 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards?.map((card) => {
        const colorClasses = {
          'workflow-primary': 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary',
          'success': 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400',
          'warning': 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
          'secondary': 'bg-[#F8FAFC] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3]',
        };

        return (
          <div 
            key={card?.id}
            className="bg-background rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] p-4 shadow-soft hover:shadow-modal transition-smooth relative overflow-visible"
          >
            <div className="absolute -top-2 -right-2 z-50">
              <ComponentAIAssistant
                componentName={`${card.label} Metric`}
                componentData={{
                  label: card.label,
                  value: card.value,
                  trend: card.trend,
                  color: card.color
                }}
                position="top-right"
              />
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">{card?.label}</p>
                <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">{card?.value}</p>
                {card?.trend && (
                  <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-1">{card.trend}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[card.color] || colorClasses['secondary']}`}>
                <Icon name={card?.icon} size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;