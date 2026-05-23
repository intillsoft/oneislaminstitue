import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

/* ─── Clean stat card with colored top-border accent ─── */
const StatCard = ({ icon: IconComp, label, value, borderColor, iconColor, loading, delay = 0 }) => {
  if (loading) {
    return (
      <div className="animate-pulse h-28 bg-[var(--card)] border border-[var(--border)] rounded-xl" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 4px 16px rgba(0, 120, 212, 0.12)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-150"
      style={{ borderTopWidth: '4px', borderTopColor: borderColor, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-[1px] mb-2">{label}</p>
          <p className="text-[32px] font-bold text-[var(--color-text-primary)] tracking-tight tabular-nums leading-none">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${borderColor}10` }}>
          {IconComp && <IconComp size={20} style={{ color: borderColor }} />}
        </div>
      </div>
    </motion.div>
  );
};

const DashboardMetrics = ({ metrics, loading }) => {
  const metricCards = [
    { id: 'enrollments', label: 'Active Courses',   value: metrics?.enrollmentsActive || 0,   icon: 'BookOpen', borderColor: 'var(--color-stat-border-1)', iconColor: 'var(--color-stat-border-1)' },
    { id: 'schedule',    label: 'Assessments',       value: metrics?.assessmentsScheduled || 0, icon: 'Calendar', borderColor: 'var(--color-stat-border-2)', iconColor: 'var(--color-stat-border-2)' },
    { id: 'saved',       label: 'Saved Courses',     value: metrics?.savedCourses || 0,         icon: 'Bookmark', borderColor: 'var(--color-stat-border-3)', iconColor: 'var(--color-stat-border-3)' },
    { id: 'progress',    label: 'Certificates',      value: metrics?.certificatesEarned || 0,   icon: 'Award',    borderColor: 'var(--color-stat-border-4)', iconColor: 'var(--color-stat-border-4)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card, i) => {
        const IconComponent = LucideIcons[card.icon];
        return (
          <StatCard
            key={card.id}
            icon={IconComponent}
            label={card.label}
            value={card.value}
            borderColor={card.borderColor}
            iconColor={card.iconColor}
            loading={loading}
            delay={i * 0.06}
          />
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
