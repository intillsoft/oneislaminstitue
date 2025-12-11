import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import ScheduleInterviewsModal from './ScheduleInterviewsModal';
import BulkMessagesModal from './BulkMessagesModal';
import { useToast } from '../../../components/ui/Toast';

const QuickActions = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBulkMessagesModal, setShowBulkMessagesModal] = useState(false);

  const handleGenerateReport = async () => {
    try {
      // Generate a comprehensive report
      const reportData = {
        generatedAt: new Date().toISOString(),
        metrics: 'Hiring metrics report',
        // In production, fetch real data
      };
      
      const csvContent = `Recruiter Report\n\nGenerated At,${reportData.generatedAt}\n`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recruiter-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      success('Report generated successfully!');
    } catch (error) {
      console.error('Report generation error:', error);
    }
  };

  const actions = [
    {
      id: 1,
      title: 'Post a New Job',
      description: 'Create a new job listing to attract candidates',
      icon: 'Plus',
      color: 'primary',
      link: '/job-posting-creation-management',
      isLink: true,
    },
    {
      id: 2,
      title: 'Schedule Interviews',
      description: 'Set up interviews with shortlisted candidates',
      icon: 'Calendar',
      color: 'warning',
      onClick: () => setShowScheduleModal(true),
      isLink: false,
    },
    {
      id: 3,
      title: 'Send Bulk Messages',
      description: 'Communicate with multiple candidates at once',
      icon: 'Mail',
      color: 'accent',
      onClick: () => setShowBulkMessagesModal(true),
      isLink: false,
    },
    {
      id: 4,
      title: 'Generate Reports',
      description: 'Create custom reports for hiring metrics',
      icon: 'BarChart2',
      color: 'secondary',
      onClick: handleGenerateReport,
      isLink: false,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400',
      warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning dark:text-warning-400',
      accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent dark:text-accent-400',
      secondary: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400',
    };
    return colors[color] || colors.primary;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions?.map((action) => {
          const ActionComponent = action.isLink ? Link : 'button';
          const actionProps = action.isLink 
            ? { to: action.link }
            : { onClick: action.onClick, type: 'button' };
          
          return (
            <ActionComponent
              key={action?.id}
              {...actionProps}
              className="card p-5 flex flex-col hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/40 bg-background dark:bg-[#13182E] border-border dark:border-gray-700 cursor-pointer text-left"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(action?.color)}`}>
                <Icon 
                  name={action?.icon} 
                  size={24} 
                />
              </div>
              <h3 className="text-lg font-medium text-text-primary dark:text-white mb-2">{action?.title}</h3>
              <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">{action?.description}</p>
              <div className="mt-auto flex items-center text-primary dark:text-primary-400 font-medium group">
                <span>Get Started</span>
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </ActionComponent>
          );
        })}
      </div>

      {/* Modals */}
      <ScheduleInterviewsModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
      <BulkMessagesModal
        isOpen={showBulkMessagesModal}
        onClose={() => setShowBulkMessagesModal(false)}
      />
    </>
  );
};

export default QuickActions;