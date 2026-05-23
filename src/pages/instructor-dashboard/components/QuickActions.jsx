import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import ScheduleInterviewsModal from './ScheduleInterviewsModal';
import BulkMessagesModal from './BulkMessagesModal';
import { useToast } from '../../../components/ui/Toast';
import { motion } from 'framer-motion';

import { EliteCard } from '../../../components/ui/EliteCard';

const QuickActions = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBulkMessagesModal, setShowBulkMessagesModal] = useState(false);

  const handleGenerateReport = async () => {
    try {
      success('Generating academic intelligence report...');
      const reportData = { generatedAt: new Date().toISOString() };
      const csvContent = `Instructor Report\n\nGenerated At,${reportData.generatedAt}\n`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instructor-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      success('Academic report generated successfully!');
    } catch (error) {
      console.error('Report generation error:', error);
    }
  };

  const actions = [
    {
      id: 1,
      title: 'Initiate Course',
      description: 'Create high-impact academic modules with AI assistance',
      icon: 'Plus',
      color: 'blue',
      link: '/course-creation-management',
      isLink: true,
      badge: 'Priority'
    },
    {
      id: 2,
      title: 'Sync Assessments',
      description: 'Coordinate schedules with top-tier student clusters',
      icon: 'Calendar',
      color: 'amber',
      onClick: () => setShowScheduleModal(true),
      isLink: false,
    },
    {
      id: 3,
      title: 'Group Comms',
      description: 'Execute high-throughput messaging to the student flow',
      icon: 'Mail',
      color: 'blue',
      onClick: () => setShowBulkMessagesModal(true),
      isLink: false,
    },
    {
      id: 4,
      title: 'Academic Synthesis',
      description: 'Generate deep reports for institutional reviews',
      icon: 'BarChart2',
      color: 'emerald',
      onClick: handleGenerateReport,
      isLink: false,
    },
  ];

  const getColorConfig = (color) => {
    const configs = {
      blue: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400 border-amber-500/20' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    };
    return configs[color] || configs.blue;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {actions?.map((action) => {
          const config = getColorConfig(action.color);
          const ActionComponent = action.isLink ? Link : 'button';
          const actionProps = action.isLink
            ? { to: action.link }
            : { onClick: action.onClick, type: 'button' };

          return (
            <ActionComponent
              key={action?.id}
              {...actionProps}
              className="text-left group outline-none h-full flex flex-col"
            >
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="p-8 h-full flex flex-col justify-between border border-border/40 bg-card/70 backdrop-blur-xl hover:bg-card hover:border-border/60 transition-all rounded-3xl relative overflow-hidden shadow-soft hover:shadow-glow group cursor-pointer"
              >
                {action.badge && (
                  <div className="absolute top-4 right-4 translate-x-12 translate-y-[-12px] rotate-45 bg-primary px-10 py-1 text-[8px] font-black uppercase tracking-widest text-primary-foreground shadow-lg">
                    {action.badge}
                  </div>
                )}

                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${config.bg} border border-border/30 shadow-sm`}>
                    <Icon
                      name={action?.icon}
                      size={20}
                      className={config.text}
                    />
                  </div>

                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                    {action?.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mb-6 leading-relaxed">
                    {action?.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-all">
                  <span>Execute</span>
                  <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </ActionComponent>
          );
        })}
      </div>

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