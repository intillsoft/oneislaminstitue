import React from 'react';
import * as LucideIcons from 'lucide-react';
import { EliteStatCard } from '../../../components/ui/EliteCard';

const DashboardMetrics = ({ metrics, loading }) => {
  const metricCards = [
    { id: 'enrollments', label: 'Active Courses',   value: metrics?.enrollmentsActive || 0,   icon: 'BookOpen', color: 'blue' },
    { id: 'schedule',    label: 'Assessments',       value: metrics?.assessmentsScheduled || 0, icon: 'Calendar', color: 'green' },
    { id: 'saved',       label: 'Saved Courses',     value: metrics?.savedCourses || 0,         icon: 'Bookmark', color: 'amber' },
    { id: 'progress',    label: 'Certificates',      value: metrics?.certificatesEarned || 0,   icon: 'Award',    color: 'red' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="animate-pulse h-28 bg-[var(--card)] border border-[var(--border)] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => {
        const IconComponent = LucideIcons[card.icon];
        return (
          <EliteStatCard
            key={card.id}
            icon={IconComponent}
            label={card.label}
            value={card.value}
            color={card.color}
          />
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
