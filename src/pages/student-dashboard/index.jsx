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

/* ─── Ambient background pattern for student dashboard ─── */
const StudentAmbient = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Soft teal gradient pool - top left */}
    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[100px]" />
    {/* Cyan pool - bottom right */}
    <div className="absolute -bottom-24 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[90px]" />
    {/* Very subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.018]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px'
      }}
    />
  </div>
);

/* ─── Quick-stat pill shown in greeting header ─── */
const StatPill = ({ icon: Icon, value, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border bg-white/[0.03] ${color} backdrop-blur-sm`}
  >
    <Icon size={12} />
    <span className="text-xs font-bold tracking-wide">{value}</span>
    <span className="text-[10px] text-white/40 hidden sm:block">{label}</span>
  </motion.div>
);

/* ─── Tab button ─── */
const TabBtn = ({ active, onClick, icon: TabIcon, label }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap ${
      active
        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
        : 'text-white/30 hover:text-white/70 hover:bg-white/[0.04]'
    }`}
  >
    <TabIcon size={13} />
    {label}
  </button>
);

const TABS = [
  { id: 'overview',    label: 'Overview',      icon: TrendingUp },
  { id: 'enrollments', label: 'My Courses',    icon: BookOpen   },
  { id: 'saved',       label: 'Saved',         icon: Bookmark   },
];

const StudentDashboard = () => {
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
          <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-emerald-500/10">
            <Icon name="Search" size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 font-bold text-sm">Content for this module is being curated.</p>
          </div>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AILoader variant="pulse" text="Syncing Academic Profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Icon name="Lock" className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Sign in required</h2>
          <p className="text-slate-500 dark:text-white/40 mb-8 font-medium">Please sign in to access your dashboard</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all font-bold text-sm shadow-lg shadow-emerald-500/20"
          >
            <Icon name="LogIn" size={18} />
            Secure Entry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-16 min-h-screen bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white">
      <DashboardAIAssistant
        dashboardType="student"
        contextData={{ metrics, profileCompletion: userData?.profileCompletion, activeTab }}
      />

      {/* ── Page Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* ────────────────── GREETING HERO SECTION ────────────────── */}
        <div className="mb-8">
          {/* Greeting row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              {/* Subtle meta label */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400/70 uppercase tracking-[0.25em]">
                  Scholar Dashboard
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-1">
                {getGreeting()},<br />
                <span className="text-emerald-400">{userData?.name}</span>
              </h1>
              <p className="text-slate-500 dark:text-white/35 text-sm font-medium mt-2">
                Your current progress and upcoming lessons.
              </p>
            </div>

            {/* Quick CTA buttons */}
            <div className="flex flex-row sm:flex-col gap-2">
              <Link
                to="/courses"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all hover:shadow-emerald-500/30 group"
              >
                <Search size={13} />
                Find Courses
                <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.09] text-white/70 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
              >
                <User size={13} />
                Profile
              </Link>
            </div>
          </div>

          {/* Stat pills row */}
          <div className="flex flex-wrap gap-2">
            <StatPill icon={Flame} value={metrics.enrollmentsActive} label="Active Courses" color="border-orange-500/20 text-orange-400" />
            <StatPill icon={Award} value={metrics.certificatesEarned} label="Certificates" color="border-amber-500/20 text-amber-400" />
            <StatPill icon={Bookmark} value={metrics.savedCourses} label="Saved" color="border-cyan-500/20 text-cyan-400" />
            <StatPill icon={Target} value={`${userData.profileCompletion}%`} label="Profile" color="border-violet-500/20 text-violet-400" />
          </div>
        </div>

        {/* ────────────────── TAB NAVIGATION ────────────────── */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => (
            <TabBtn
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>

        {/* ────────────────── MAIN CONTENT ────────────────── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
