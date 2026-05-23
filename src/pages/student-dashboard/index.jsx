import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, TrendingUp, Award, Bookmark, Search, User,
  ArrowUpRight, Flame, Star, Zap, Target, ChevronRight, Sparkles
} from 'lucide-react';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { enrollmentService } from '../../services/applicationService';
import DashboardMetrics from './components/DashboardMetrics';
import RecentActivity from './components/RecentActivity';
import ApplicationTracker from './components/ApplicationTracker';
import SavedCourses from './components/SavedCourses';
import ProfileCompletion from './components/ProfileCompletion';
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';
import { courseService } from '../../services/jobService';
import AILoader from '../../components/ui/AILoader';

/* ─── Tab button ─── */
const TabBtn = ({ active, onClick, icon: TabIcon, label }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-bold transition-all duration-150 whitespace-nowrap ${
      active
        ? 'text-white bg-[var(--primary)] shadow-sm'
        : 'text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)]'
    }`}
  >
    <TabIcon size={14} />
    {label}
  </button>
);

const TABS = [
  { id: 'overview',    label: 'Overview',      icon: TrendingUp },
  { id: 'enrollments', label: 'My Courses',    icon: BookOpen   },
  { id: 'saved',       label: 'Saved',         icon: Bookmark   },
];

const StudentDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { user, profile, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const path = window.location.pathname;

  let activeTab = 'overview';
  if (path.includes('/dashboard/saved')) activeTab = 'saved';
  else if (path.includes('/dashboard/learning-path')) activeTab = 'enrollments';
  else if (path.includes('/dashboard/enrollments')) activeTab = 'enrollments';

  const setActiveTab = (tab) => {
    if (tab === 'overview') navigate('/dashboard/student');
    else navigate(`/dashboard/${tab}`);
  };

  const [metrics, setMetrics] = useState({
    enrollmentsActive: 0,
    assessmentsScheduled: 0,
    savedCourses: 0,
    certificatesEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && !authLoading) loadMetrics();
    else setLoading(false);
  }, [user?.id, authLoading]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const [analytics, saved] = await Promise.all([
        enrollmentService.getAnalytics().catch(() => ({ total: 0, interview: 0, offer: 0 })),
        courseService.getSavedCourses().catch(() => [])
      ]);
      setMetrics({
        enrollmentsActive: analytics.total || 0,
        assessmentsScheduled: analytics.interview || 0,
        savedCourses: saved.length || 0,
        certificatesEarned: analytics.offer || 0
      });
    } catch { /* quiet */ }
    finally { setLoading(false); }
  };

  const userData = {
    name: profile?.name || user?.email?.split('@')[0] || 'Scholar',
    email: user?.email || '',
    profileImage: profile?.avatar_url,
    profileCompletion: calcCompletion(profile),
    metrics
  };

  function calcCompletion(p) {
    if (!p) return 0;
    const fields = ['name', 'email', 'avatar_url'];
    return Math.round((fields.filter(f => p[f]).length / fields.length) * 100);
  }

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  /* ─── Tab content renderer ─── */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardMetrics metrics={userData?.metrics} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="lg:col-span-1">
                <ProfileCompletion completion={userData?.profileCompletion} />
              </div>
            </div>
          </div>
        );
      case 'enrollments':
        return <ApplicationTracker />;
      case 'saved':
        return <SavedCourses />;
      default:
        return (
          <div className="text-center py-20 bg-[var(--card)] rounded-xl border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
            <Icon name="Search" size={48} className="mx-auto text-[var(--color-border-secondary)] mb-4" />
            <p className="text-[var(--color-text-tertiary)] font-medium text-sm">Content for this module is being curated.</p>
          </div>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AILoader variant="pulse" text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-20 h-20 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
            <Icon name="Lock" className="w-10 h-10 text-[var(--color-text-tertiary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Sign in required</h2>
          <p className="text-[var(--color-text-tertiary)] mb-8 font-medium">Please sign in to access your dashboard</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all font-bold text-sm"
          >
            <Icon name="LogIn" size={18} />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const mobileActions = [
    { label: 'My Courses', icon: BookOpen, path: '/dashboard/enrollments', color: 'text-[var(--color-primary)]' },
    { label: 'Saved', icon: Bookmark, path: '/dashboard/saved', color: 'text-[var(--color-stat-border-3)]' },
    { label: 'Certificates', icon: Award, path: '/dashboard/certificates', color: 'text-[var(--color-stat-border-4)]' },
    { label: 'Browse', icon: Search, path: '/courses', color: 'text-[var(--color-primary)]' },
    { label: 'Profile', icon: User, path: '/profile', color: 'text-[var(--color-stat-border-4)]' },
    { label: 'AI Help', icon: Sparkles, path: '/ai-chat', color: 'text-[var(--color-primary)]' },
  ];

  if (isMobile) {
    return (
      <div className="relative pb-24 pt-6 px-4 min-h-screen bg-[var(--color-bg-secondary)]">
        <DashboardAIAssistant
          dashboardType="student"
          contextData={{ metrics, profileCompletion: userData?.profileCompletion, activeTab }}
        />

        {/* 📱 Header App Bar */}
        <header className="flex items-center justify-between mb-8 px-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest leading-none">Scholar Account</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{getGreeting()}</h1>
          </div>
          <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--color-text-tertiary)]">
            <Icon name="Bell" size={18} />
          </button>
        </header>

        {/* 📊 Compact Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="relative overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] p-4" style={{ borderTopWidth: '3px', borderTopColor: 'var(--color-stat-border-1)' }}>
            <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Enrolled</p>
            <p className="text-lg font-bold text-[var(--color-text-primary)]">{metrics.enrollmentsActive}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] p-4" style={{ borderTopWidth: '3px', borderTopColor: 'var(--color-stat-border-4)' }}>
            <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Certificates</p>
            <p className="text-lg font-bold text-[var(--color-text-primary)]">{metrics.certificatesEarned}</p>
          </div>
        </div>

        {/* 📱 Quick Utilities */}
        <p className="px-2 mb-3 text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Quick Utilities</p>
        <div className="grid grid-cols-2 gap-4">
          {mobileActions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl aspect-square hover:bg-[var(--color-primary-light)] active:scale-95 transition-all duration-150"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-border-secondary)] flex items-center justify-center mb-4">
                <item.icon size={24} className={item.color} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-16 min-h-screen">
      <DashboardAIAssistant
        dashboardType="student"
        contextData={{ metrics, profileCompletion: userData?.profileCompletion, activeTab }}
      />

      <div className="relative z-10 max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-6">

          {/* 🌟 HEADER CARD — Bold blue gradient */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0078D4 0%, #003D6B 100%)', boxShadow: '0 4px 20px rgba(0,61,107,0.25)' }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded-full border border-white/30">Scholar Space</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {getGreeting()}, <span className="text-white">{userData?.name}</span>
              </h1>
              <p className="text-[#A8CAEC] text-sm font-medium mt-2">Manage your academic courses and progress tracker.</p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/courses" className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-[var(--secondary)] text-[var(--primary)] rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02]">
                <Search size={13} /> Find Courses
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold text-xs uppercase tracking-wider border border-white/40 transition-all">
                <User size={13} /> Profile
              </Link>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 p-1.5 bg-[var(--card)] border border-[var(--border)] rounded-full self-start" style={{ boxShadow: 'var(--shadow-card)' }}>
            {TABS.map(tab => (
              <TabBtn key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} label={tab.label} />
            ))}
          </div>

          {/* MAIN CONTENT */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            {renderTabContent()}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
