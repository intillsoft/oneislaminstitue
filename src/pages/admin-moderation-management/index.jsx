import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
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

/* ─── No ambient overlay needed on white bg ─── */
const AdminAmbient = () => null;

/* ─── Stat card — white bg, colored top accent, visible text ─── */
const AdminStatCard = ({ label, value, icon, accentClass, loading }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(0,120,212,0.15)' }}
    transition={{ duration: 0.2 }}
    className="group relative overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 transition-all duration-300"
    style={{ boxShadow: 'var(--shadow-card)' }}
  >
    {/* Thin top-accent stripe */}
    <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentClass}`} />

    <div className="flex items-start justify-between mb-4">
      <div className="w-9 h-9 rounded-lg bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center">
        <Icon name={icon} size={16} className="text-[#0078D4]" />
      </div>
    </div>

    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.15em] mb-1.5">{label}</p>
    <p className="text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
      {loading
        ? <span className="inline-block w-12 h-6 bg-[var(--secondary)] rounded animate-pulse" />
        : value}
    </p>
  </motion.div>
);

/* ─── Sidebar nav group — clean white ─── */
const NavGroup = ({ title, items, activeTab, onSelect }) => (
  <div className="space-y-0.5">
    <p className="px-3 mb-2 text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.2em]">{title}</p>
    {items.map(item => {
      const active = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
            active
              ? 'bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)]'
          }`}
        >
          <Icon
            name={item.icon}
            size={14}
            className={`flex-shrink-0 transition-colors ${
              active ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'
            }`}
          />
          <span className="text-[11px] font-bold tracking-wide flex-1">{item.label}</span>
          {active && (
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0" />
          )}
        </button>
      );
    })}
  </div>
);

const AcademicCentralCommand = () => {
  // ─── Smartphone Detection ───
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        { id: 'moderation',    label: 'Accreditation',   icon: 'Shield',    color: 'text-[var(--color-primary)]' },
        { id: 'content',       label: 'Curriculum',       icon: 'BookOpen',  color: 'text-sky-400'     },
        { id: 'users',         label: 'Userbase',         icon: 'Users',     color: 'text-[var(--primary)]'  },
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
        { id: 'analytics',  label: 'Analytics',     icon: 'BarChart3',  color: 'text-[var(--color-primary)]' },
        { id: 'ai-control', label: 'Neural Matrix', icon: 'Cpu',        color: 'text-purple-400'  },
        { id: 'financials', label: 'Treasury',      icon: 'DollarSign', color: 'text-amber-400'   },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { id: 'system', label: 'System Health', icon: 'Activity', color: 'text-[var(--color-primary)]' },
        { id: 'config', label: 'Portal Config', icon: 'Settings', color: 'text-slate-400'   },
        { id: 'audit',  label: 'Registry Log',  icon: 'Database', color: 'text-blue-400'    },
      ]
    }
  ];

  const statCards = [
    { label: 'Accreditation Queue', value: stats.pendingReviews,    icon: 'Clock',         accentClass: 'bg-gradient-to-r from-[var(--color-primary)]/70 to-transparent' },
    { label: 'Security Alerts',     value: stats.reportedContent,   icon: 'AlertTriangle', accentClass: 'bg-gradient-to-r from-amber-500/70 to-transparent'   },
    { label: 'Active Scholars',     value: stats.activeScholars,    icon: 'Users',         accentClass: 'bg-gradient-to-r from-sky-500/70 to-transparent'     },
    { label: 'System Health',       value: `${stats.ecoVitality}%`, icon: 'Zap',           accentClass: 'bg-gradient-to-r from-teal-500/70 to-transparent'    },
  ];

  const flatItems = navGroups.flatMap(g => g.items);

  // ─── Cinematic Mobile-Native Display ───
  if (isMobile) {
    return (
      <div className="relative min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200 pb-28 pt-6 px-4">
        <AdminAmbient />
        <DashboardAIAssistant dashboardType="admin" contextData={{ stats, activeTab }} />

        {/* Header App Bar */}
        <header className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Command Panel</h1>
            <p className="text-[10px] font-bold text-[var(--color-primary)]/60 uppercase tracking-widest mt-0.5">Admin authority</p>
          </div>
          <button onClick={loadStats} className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--color-primary)]">
            <Icon name="RefreshCw" size={16} className={loadingStats ? 'animate-spin' : ''} />
          </button>
        </header>

        {/* Compact Stat Bubbles */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {statCards.map(s => (
            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4">
              <div className={`absolute top-0 left-0 right-0 h-[1.5px] ${s.accentClass}`} />
              <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] mb-1">{s.label}</p>
              <p className="text-lg font-black text-[var(--color-text-primary)]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* 2x2 Action Tiles (App format) */}
        <p className="px-2 mb-3 text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.3em]">Management Modules</p>
        <div className="grid grid-cols-2 gap-4">
          {flatItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(`/admin/dashboard/${item.id}`)}
              className="flex flex-col items-center justify-center p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl aspect-square hover:bg-[var(--color-primary-light)] active:scale-95 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border-secondary)] flex items-center justify-center mb-4 text-[var(--color-primary)]">
                <Icon name={item.icon} size={24} className={item.color} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Global Modal Sheet Wrapper hook triggers (e.g. if viewing active module overlay) */}
        <Outlet />
      </div>
    );
  }

  // ─── Standard Desktop View ───
  return (
    <div className="relative min-h-screen text-[var(--foreground)]">
      <DashboardAIAssistant dashboardType="admin" contextData={{ stats, activeTab }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── HEADER ── */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-[10px] font-black text-[var(--color-primary)]/60 uppercase tracking-[0.25em]">
                Command Authority Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight leading-none mb-2">
              Central <span className="text-[var(--primary)]">Command</span>
            </h1>
            <p className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.18em]">
              Master Governance &amp; Academic Orchestration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2.5 h-10 px-5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] hover:border-[var(--border)] transition-all" style={{ boxShadow: 'var(--shadow-card)' }}>
              <Icon name="Activity" size={14} className="text-[var(--primary)]" />
              Platform Pulse
            </button>
            <button className="flex items-center gap-2.5 h-10 px-5 rounded-lg bg-[#0078D4] hover:bg-[#005A9E] text-white text-[10px] font-bold uppercase tracking-widest transition-all" style={{ boxShadow: '0 2px 8px rgba(0,120,212,0.3)' }}>
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
            <div className="xl:sticky xl:top-24 space-y-5 bg-[var(--card)] border border-[var(--border)] rounded-xl p-3" style={{ boxShadow: 'var(--shadow-card)' }}>
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
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 min-h-[700px]"
                style={{ boxShadow: 'var(--shadow-card)' }}
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
