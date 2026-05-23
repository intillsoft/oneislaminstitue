import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';
import { EliteCard } from '../../components/ui/EliteCard';
import MetricsCards from './components/MetricsCards';
import ApplicationsChart from './components/ApplicationsChart';
import CandidatePipeline from './components/CandidatePipeline';
import JobPerformanceTable from './components/JobPerformanceTable';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import SourceAttribution from './components/SourceAttribution';
import DemographicInsights from './components/DemographicInsights';
import PaymentHistory from './components/PaymentHistory';
import CompanyManagementSection from './components/CompanyManagementSection';
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';
import { courseService } from '../../services/jobService';
/* ─── No ambient overlay on white bg ─── */
const InstructorAmbient = () => null;

/* ─── Tab button ─── */
const InstructorTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap ${
      active
        ? 'bg-[#0078D4] text-white shadow-sm'
        : 'text-[var(--muted-foreground)] hover:text-[#0078D4] hover:bg-[var(--secondary)]'
    }`}
  >
    <Icon name={icon} size={13} />
    {label}
  </button>
);

/* ─── Quick-info banner at the top of the page ─── */
const InfoPill = ({ icon, label, value, color }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--border)]`} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
    <Icon name={icon} size={12} className="text-[#0078D4]" />
    <span className="text-[10px] font-bold text-[var(--muted-foreground)]">{label}</span>
    <span className="text-xs font-bold text-[var(--foreground)]">{value}</span>
  </div>
);

const TABS = [
  { id: 'overview',    label: 'Overview',          icon: 'LayoutDashboard' },
  { id: 'jobs',        label: 'Curriculum',         icon: 'BookOpen'        },
  { id: 'candidates',  label: 'Scholars',           icon: 'Users'           },
  { id: 'analytics',   label: 'Analytics',          icon: 'BarChart2'       },
  { id: 'billing',     label: 'Financials',         icon: 'CreditCard'      },
  { id: 'company',     label: 'Institution',        icon: 'Building2'       },
  { id: 'settings',    label: 'Management',         icon: 'Settings'        },
];

const InstructorPortal = () => {
  // ─── Smartphone Detection ───
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { user, profile } = useAuthContext();
  const { tab: activeTab = 'overview' } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  const { success, error: showError } = useToast();

  const [companyInfo, setCompanyInfo] = useState({
    name: profile?.name || 'Academic Institution',
    logo: profile?.avatar_url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    subscription: 'Scholarly Registry',
    expiresOn: '2025-12-31'
  });

  useEffect(() => {
    if (user?.id && profile) loadCompanyInfo();
  }, [user?.id, profile?.id]);

  const loadCompanyInfo = async () => {
    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Academic institution data not accessible or table missing.');
      }

      if (companies) {
        setCompanyInfo({
          name: companies.name || profile.name || 'Academic Institution',
          logo: companies.logo || profile.avatar_url || companyInfo.logo,
          subscription: companies.subscription_tier || 'Scholarly Registry',
          expiresOn: companies.subscription_expires || '2025-12-31'
        });
      } else {
        setCompanyInfo({
          name: profile.name || 'Academic Institution',
          logo: profile.avatar_url || companyInfo.logo,
          subscription: 'Scholarly Registry',
          expiresOn: '2025-12-31'
        });
      }
    } catch {
      setCompanyInfo({
        name: profile?.name || 'Academic Institution',
        logo: profile?.avatar_url || companyInfo.logo,
        subscription: 'Scholarly Registry',
        expiresOn: '2025-12-31'
      });
    }
  };

  const handleExport = async () => {
    try {
      success('Generating academic report...');
      const { jobService } = await import('../../services/jobService');
      const jobs = await jobService.getByRecruiter(user.id);
      const csvContent = 'data:text/csv;charset=utf-8,'
        + 'Course Title,Status,Enrollments,Views,Avg. Depth,Match Rate\n'
        + jobs.data.map(e =>
            `${e.title},${e.status},${e.applications_count},${e.views_count},${e.avg_experience},${e.match_rate}%`
          ).join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `Instructor_Intelligence_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      success('Report exported successfully');
    } catch (err) {
      console.error(err);
      showError('Export failed. Please try again.');
    }
  };

  /* ─── Content renderer ─── */
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <MetricsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApplicationsChart />
              <SourceAttribution />
            </div>
            <JobPerformanceTable />
            <QuickActions />
          </div>
        );
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Teaching</h2>
                <p className="text-white/30 text-xs mt-1">Your live curriculum modules</p>
              </div>
              <Link
                to="/instructor/courses/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[var(--primary)]/20 transition-all"
              >
                <Icon name="Plus" size={14} />
                New Course
              </Link>
            </div>
            <JobPerformanceTable />
          </div>
        );
      case 'candidates':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Student Success Pipeline</h2>
            <CandidatePipeline />
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Advanced Analytics</h2>
            <DemographicInsights />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { icon: 'Timer',     title: 'Time to Selection', value: '12.4', unit: 'Days', sub: 'Avg. Review Duration' },
                { icon: 'TrendingUp', title: 'Success Metrics',  value: '94%', unit: '',     sub: 'Content Engagement'   },
              ].map(card => (
                <div key={card.title} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon name={card.icon} size={15} className="text-[var(--primary)]" />
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">{card.title}</h3>
                  </div>
                  <div className="h-48 bg-white/[0.02] rounded-xl border border-white/[0.04] flex flex-col items-start justify-end p-5 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <Icon name={card.icon} size={20} className="text-[var(--primary)] opacity-20" />
                    </div>
                    <p className="text-3xl font-black text-white/90 mb-1">
                      {card.value}
                      {card.unit && <span className="text-[var(--primary)] text-lg ml-1">{card.unit}</span>}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Billing & Payments</h2>
            <PaymentHistory />
          </div>
        );
      case 'company':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Institution Architecture</h2>
            <CompanyManagementSection />
          </div>
        );
      default: {
        const currentTab = TABS.find(t => t.value === activeTab) || TABS.find(t => t.id === activeTab);
        return (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-6 border border-white/[0.06]">
              <Icon name={currentTab?.icon || 'FileText'} size={28} className="text-white/20" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              {currentTab?.label || 'Module'} Engine
            </h2>
            <p className="text-white/30 text-sm max-w-xs">
              This module is currently being calibrated for the faculty portal.
            </p>
          </div>
        );
      }
    }
  };

  if (isMobile) {
    return (
      <div className="relative pb-24 pt-6 px-4 min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200">
        <InstructorAmbient />
        <DashboardAIAssistant dashboardType="instructor" contextData={{ companyInfo, activeTab }} />

        {/* 📱 Header App Bar */}
        <header className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[var(--primary)]/20 shadow-lg">
              <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">Instructor Panel</h1>
              <p className="text-[9px] font-bold text-[var(--primary)]/60 uppercase tracking-widest mt-0.5">{companyInfo.name}</p>
            </div>
          </div>
          <button onClick={() => navigate('/notifications/instructor')} className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
            <Icon name="Bell" size={18} />
          </button>
        </header>

        {/* 📊 Quick Stat Pill Bubbles */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[var(--primary)] to-transparent" />
            <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] mb-1">Status</p>
            <p className="text-sm font-black text-[var(--color-text-primary)]">{companyInfo.subscription}</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-fuchsia-500 to-transparent" />
            <p className="text-[8px] font-black text-fuchsia-200/40 uppercase tracking-[0.2em] mb-1">Renew Target</p>
            <p className="text-sm font-black text-[var(--color-text-primary)]">Annual</p>
          </div>
        </div>

        {/* 📱 2x2 Dashboard App Navigation */}
        <p className="px-2 mb-3 text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.3em]">Instructor Modules</p>
        <div className="grid grid-cols-2 gap-4">
          {TABS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/instructor/dashboard/${item.id}`)}
              className="flex flex-col items-center justify-center p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl aspect-square hover:bg-[var(--color-primary-light)] active:scale-95 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border-secondary)] flex items-center justify-center mb-4 text-[var(--primary)] shadow-md">
                <Icon name={item.icon} size={24} className="text-[var(--primary)]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-16 min-h-screen text-[var(--foreground)]">
      <InstructorAmbient />
      <DashboardAIAssistant
        dashboardType="instructor"
        contextData={{ academyInfo: companyInfo, dateRange, activeTab }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8">

          {/* 🌟 PREMIUM HEADER BENTO CAP */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0078D4 0%, #003D6B 100%)', boxShadow: '0 4px 20px rgba(0,61,107,0.25)' }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.15em] bg-white/15 px-2 py-0.5 rounded-full border border-white/30">Instructor Central</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Faculty Portal
              </h1>
              <p className="text-[#A8CAEC] text-sm font-medium mt-2">Monitor course performance and student engagement.</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <InfoPill icon="Building2" label="Institution" value={companyInfo.name} />
                <InfoPill icon="Award"     label="Tier"        value={companyInfo.subscription} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold text-xs uppercase tracking-wider border border-white/30 transition-all">
                <Icon name="Download" size={13} /> Export
              </button>
              <Link to="/instructor/courses/new" className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#EFF6FF] text-[#0078D4] rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02]">
                <Icon name="Plus" size={13} /> New Course
              </Link>
            </div>
          </div>

          {/* 🍱 TAB NAVIGATION BENTO BRIDGE */}
          <div className="flex items-center gap-2 p-1.5 bg-[var(--card)] border border-[var(--border)] rounded-full self-start overflow-x-auto max-w-full scrollbar-hide" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {TABS.map(tab => (
              <InstructorTab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => navigate(`/instructor/dashboard/${tab.id}`)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </div>

          {/* 🍱 MAIN CONTENT BENTO WORKSPACE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default InstructorPortal;