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
      <div className="native-app-canvas px-4">
        <AdminAmbient />
        <DashboardAIAssistant dashboardType="admin" contextData={{ stats, activeTab }} />

        {/* 📱 Native Admin Welcome Cap */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-lg font-black border border-[var(--color-border-secondary)] flex-shrink-0">
            <Icon name="Shield" size={24} />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest leading-none block mb-1">Governance Portal</span>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Academic Command</h1>
          </div>
        </div>

        {/* 📊 Compact Native Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.slice(0, 2).map(s => (
            <div key={s.label} className="native-metric-card" style={{ borderTopColor: 'var(--color-stat-border-1)' }}>
              <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">{s.label.split(' ')[0]} Tasks</p>
              <p className="text-xl font-black text-[var(--color-text-primary)] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* 📱 iOS-Style Management Modules Menu */}
        <p className="px-2 mb-3 text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">Governance Modules</p>
        <div className="native-list-group mb-6">
          {flatItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/admin/dashboard/${item.id}`)}
              className="native-list-row"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--primary)] border border-[var(--color-border-secondary)]">
                  <Icon name={item.icon} size={18} className={item.color} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{item.label}</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Access platform {item.label.toLowerCase()}</p>
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-[var(--color-text-tertiary)]" />
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
