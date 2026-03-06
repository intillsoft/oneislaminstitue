import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { EliteCard } from '../../components/ui/EliteCard';
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';

// Dynamic Imports for Components
import ModerationQueue from './components/ModerationQueue';
import ContentModerationPanel from './components/ContentModerationPanel';
import UserManagementSection from './components/UserManagementSection';
import JobsManagementSection from './components/JobsManagementSection';
import ApplicationsManagementSection from './components/ApplicationsManagementSection';
import PlatformAnalytics from './components/PlatformAnalytics';
import ConfigurationPanels from './components/ConfigurationPanels';
import SystemMonitoring from './components/SystemMonitoring';
import AuditTrail from './components/AuditTrail';
import JobCrawlerPanel from './components/JobCrawlerPanel';
import RoleChangeRequestsSection from './components/RoleChangeRequestsSection';
import AIServiceControl from './components/AIServiceControl';
import FinancialIntelligence from './components/FinancialIntelligence';

export {
  ModerationQueue, ContentModerationPanel, UserManagementSection,
  JobsManagementSection, ApplicationsManagementSection, PlatformAnalytics,
  ConfigurationPanels, SystemMonitoring, AuditTrail, JobCrawlerPanel,
  RoleChangeRequestsSection, AIServiceControl, FinancialIntelligence
};

/* ─── Ambient: matches app's emerald-dark palette ─── */
const AdminAmbient = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Emerald bloom — top-right, same brand as rest of app */}
    <div className="absolute -top-40 right-0 w-[600px] h-[450px] rounded-full bg-emerald-600/[0.05] blur-[120px]" />
    {/* Deeper green pool — bottom-left */}
    <div className="absolute bottom-0 -left-24 w-[500px] h-[380px] rounded-full bg-emerald-900/30 blur-[90px]" />
    {/* Subtle horizontal scan lines */}
    <div
      className="absolute inset-0 opacity-[0.01]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(16,185,129,0.4) 0px, rgba(16,185,129,0.4) 1px, transparent 1px, transparent 40px)',
      }}
    />
  </div>
);

/* ─── Stat card — accent line uses the icon's colour ─── */
const AdminStatCard = ({ label, value, icon, accentClass, loading }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-6 hover:border-emerald-500/25 hover:bg-emerald-500/[0.04] transition-all duration-300"
  >
    {/* Thin top-accent stripe */}
    <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentClass}`} />

    <div className="flex items-start justify-between mb-4">
      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-emerald-500/10 flex items-center justify-center">
        <Icon name={icon} size={16} className="text-emerald-400/70" />
      </div>
    </div>

    <p className="text-[10px] font-bold text-emerald-200/25 uppercase tracking-[0.2em] mb-1.5">{label}</p>
    <p className="text-2xl font-black text-white/90 tracking-tight">
      {loading
        ? <span className="inline-block w-12 h-6 bg-emerald-500/10 rounded animate-pulse" />
        : value}
    </p>
  </motion.div>
);

/* ─── Sidebar nav group ─── */
const NavGroup = ({ title, items, activeTab, onSelect }) => (
  <div className="space-y-0.5">
    <p className="px-3 mb-2 text-[9px] font-black text-emerald-200/20 uppercase tracking-[0.3em]">{title}</p>
    {items.map(item => {
      const active = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
            active
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
              : 'text-emerald-200/30 hover:text-emerald-200/70 hover:bg-emerald-500/[0.07]'
          }`}
        >
          <Icon
            name={item.icon}
            size={14}
            className={`flex-shrink-0 transition-colors ${
              active ? item.color : 'text-emerald-200/25 group-hover:text-emerald-200/50'
            }`}
          />
          <span className="text-[11px] font-bold tracking-wide flex-1">{item.label}</span>
          {active && (
            <div className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
          )}
        </button>
      );
    })}
  </div>
);

const AcademicCentralCommand = () => {
  const { user, profile } = useAuthContext();
  const { tab } = useParams();
  const location = useLocation();
  const activeTab = tab || location.pathname.split('/').pop() || 'moderation';
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pendingReviews: 0,
    reportedContent: 0,
    activeScholars: 0,
    ecoVitality: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') loadStats();
  }, [user, profile]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const [usersCount, pendingCourses] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).in('status', ['pending', 'under_review', 'draft'])
      ]);
      setStats({
        pendingReviews: pendingCourses.count || 0,
        reportedContent: 8,
        activeScholars: usersCount.count || 0,
        ecoVitality: 94,
      });
    } catch (e) {
      console.error('Stats loading failed:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  const navGroups = [
    {
      title: 'Governance',
      items: [
        { id: 'moderation',    label: 'Accreditation',   icon: 'Shield',    color: 'text-emerald-400' },
        { id: 'content',       label: 'Curriculum',       icon: 'BookOpen',  color: 'text-sky-400'     },
        { id: 'users',         label: 'Userbase',         icon: 'Users',     color: 'text-violet-400'  },
        { id: 'role-requests', label: 'Curator Entry',    icon: 'UserPlus',  color: 'text-amber-400'   },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'jobs',         label: 'Courses',      icon: 'Layers',    color: 'text-cyan-400'   },
        { id: 'applications', label: 'Enrollments',  icon: 'FileCheck', color: 'text-indigo-400' },
        { id: 'crawler',      label: 'Content Sync', icon: 'RefreshCw', color: 'text-teal-400'   },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'analytics',  label: 'Analytics',     icon: 'BarChart3',  color: 'text-emerald-400' },
        { id: 'ai-control', label: 'Neural Matrix', icon: 'Cpu',        color: 'text-purple-400'  },
        { id: 'financials', label: 'Treasury',      icon: 'DollarSign', color: 'text-amber-400'   },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { id: 'system', label: 'System Health', icon: 'Activity', color: 'text-emerald-400' },
        { id: 'config', label: 'Portal Config', icon: 'Settings', color: 'text-slate-400'   },
        { id: 'audit',  label: 'Registry Log',  icon: 'Database', color: 'text-blue-400'    },
      ]
    }
  ];

  const statCards = [
    { label: 'Accreditation Queue', value: stats.pendingReviews,    icon: 'Clock',         accentClass: 'bg-gradient-to-r from-emerald-500/70 to-transparent' },
    { label: 'Security Alerts',     value: stats.reportedContent,   icon: 'AlertTriangle', accentClass: 'bg-gradient-to-r from-amber-500/70 to-transparent'   },
    { label: 'Active Scholars',     value: stats.activeScholars,    icon: 'Users',         accentClass: 'bg-gradient-to-r from-sky-500/70 to-transparent'     },
    { label: 'System Health',       value: `${stats.ecoVitality}%`, icon: 'Zap',           accentClass: 'bg-gradient-to-r from-teal-500/70 to-transparent'    },
  ];

  return (
    <div className="relative min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30">
      <AdminAmbient />
      <DashboardAIAssistant dashboardType="admin" contextData={{ stats, activeTab }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── HEADER ── */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.25em]">
                Command Authority Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
              Central <span className="text-emerald-500">Command</span>
            </h1>
            <p className="text-[11px] font-bold text-emerald-200/25 uppercase tracking-[0.18em]">
              Master Governance &amp; Academic Orchestration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2.5 h-10 px-5 rounded-xl bg-white/[0.03] border border-emerald-500/15 text-[10px] font-bold uppercase tracking-widest text-emerald-200/40 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/30 transition-all">
              <Icon name="Activity" size={14} className="text-emerald-500/50" />
              Platform Pulse
            </button>
            <button className="flex items-center gap-2.5 h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
              <Icon name="Shield" size={14} />
              Security Audit
            </button>
          </div>
        </header>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(s => (
            <AdminStatCard key={s.label} {...s} loading={loadingStats} />
          ))}
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="flex flex-col xl:flex-row gap-8">

          {/* Sidebar */}
          <aside className="xl:w-[200px] flex-shrink-0">
            <div className="xl:sticky xl:top-24 space-y-5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-3">
              {navGroups.map(g => (
                <NavGroup
                  key={g.title}
                  title={g.title}
                  items={g.items}
                  activeTab={activeTab}
                  onSelect={(id) => navigate(`/admin/dashboard/${id}`)}
                />
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-emerald-500/[0.015] border border-emerald-500/10 rounded-2xl p-6 sm:p-8 min-h-[700px] backdrop-blur-sm"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AcademicCentralCommand;
