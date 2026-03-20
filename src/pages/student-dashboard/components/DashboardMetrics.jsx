import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

/* ─── Beautiful stat card with gradient top-border accent ─── */
const StatCard = ({ icon: IconComp, label, value, color, loading, delay = 0 }) => {
  const configs = {
    blue:    { dot: 'bg-sky-400',     line: 'from-sky-500/80 to-sky-500/0',     icon: 'text-sky-400',     bg: 'bg-sky-500/[0.07]',     border: 'border-sky-500/15'    },
    green:   { dot: 'bg-emerald-400', line: 'from-emerald-500/80 to-emerald-500/0', icon: 'text-emerald-400', bg: 'bg-emerald-500/[0.07]', border: 'border-emerald-500/15'},
    amber:   { dot: 'bg-amber-400',   line: 'from-amber-500/80 to-amber-500/0',   icon: 'text-amber-400',   bg: 'bg-amber-500/[0.07]',   border: 'border-amber-500/15'  },
    emerald: { dot: 'bg-teal-400',    line: 'from-teal-500/80 to-teal-500/0',     icon: 'text-teal-400',    bg: 'bg-teal-500/[0.07]',    border: 'border-teal-500/15'   },
  };
  const cfg = configs[color] || configs.blue;

  if (loading) {
    return (
      <div className="animate-pulse h-28 bg-white/[0.03] border border-white/[0.06] rounded-2xl" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02, rotate: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.04] bg-[#0C1236]/40 backdrop-blur-xl p-6 group hover:border-white/[0.08] transition-all duration-300 overflow-visible shadow-2xl`}
    >
      {/* Immersive glow mesh backdrop */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${cfg.line} -z-10 blur-2xl filter`} />

      {/* Top-left gradient accent line */}
      <div className={`absolute top-0 left-0 w-24 h-[1.5px] bg-gradient-to-r ${cfg.line}`} />

      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">{label}</p>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
            {value}
          </p>
        </div>

        <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0 border border-white/[0.03] group-hover:scale-110 group-hover:bg-white/5 transition-all duration-300 shadow-lg`}>
          {IconComp && <IconComp size={18} className={cfg.icon} />}
        </div>
      </div>
    </motion.div>
  );
};

const DashboardMetrics = ({ metrics, loading }) => {
  const metricCards = [
    { id: 'enrollments', label: 'Active Courses',   value: metrics?.enrollmentsActive || 0,   icon: 'BookOpen', color: 'blue'    },
    { id: 'schedule',    label: 'Assessments',       value: metrics?.assessmentsScheduled || 0, icon: 'Calendar', color: 'green'   },
    { id: 'saved',       label: 'Saved Courses',     value: metrics?.savedCourses || 0,         icon: 'Bookmark', color: 'amber'   },
    { id: 'progress',    label: 'Certificates',      value: metrics?.certificatesEarned || 0,   icon: 'Award',    color: 'emerald' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metricCards.map((card, i) => {
        const IconComponent = LucideIcons[card.icon];
        return (
          <StatCard
            key={card.id}
            icon={IconComponent}
            label={card.label}
            value={card.value}
            color={card.color}
            loading={loading}
            delay={i * 0.06}
          />
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
