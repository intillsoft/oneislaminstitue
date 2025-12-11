import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import MetricsCards from './components/MetricsCards';
import ApplicationsChart from './components/ApplicationsChart';
import CandidatePipeline from './components/CandidatePipeline';
import JobPerformanceTable from './components/JobPerformanceTable';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import SourceAttribution from './components/SourceAttribution';
import DemographicInsights from './components/DemographicInsights';
import PaymentHistory from './components/PaymentHistory';
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';

const RecruiterDashboardAnalytics = () => {
  const { user, profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({
    name: profile?.name || "Company",
    logo: profile?.avatar_url || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    subscription: "Premium Plan",
    expiresOn: "2024-12-31"
  });

  useEffect(() => {
    if (user && profile) {
      loadCompanyInfo();
    }
  }, [user, profile]);

  const loadCompanyInfo = async () => {
    try {
      // Try to fetch company data from companies table
      const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (companies) {
        setCompanyInfo({
          name: companies.name || profile.name || "Company",
          logo: companies.logo || profile.avatar_url || companyInfo.logo,
          subscription: companies.subscription_tier || "Premium Plan",
          expiresOn: companies.subscription_expires || "2024-12-31"
        });
      } else {
        setCompanyInfo({
          name: profile.name || "Company",
          logo: profile.avatar_url || companyInfo.logo,
          subscription: "Premium Plan",
          expiresOn: "2024-12-31"
        });
      }
    } catch (error) {
      console.error('Error loading company info:', error);
      // Use profile data as fallback
      setCompanyInfo({
        name: profile.name || "Company",
        logo: profile.avatar_url || companyInfo.logo,
        subscription: "Premium Plan",
        expiresOn: "2024-12-31"
      });
    }
  };

  const sidebarItems = [
    { icon: 'LayoutDashboard', label: 'Overview', value: 'overview' },
    { icon: 'Briefcase', label: 'Jobs', value: 'jobs' },
    { icon: 'Users', label: 'Candidates', value: 'candidates' },
    { icon: 'BarChart2', label: 'Analytics', value: 'analytics' },
    { icon: 'CreditCard', label: 'Billing', value: 'billing' },
    { icon: 'Building2', label: 'Company', value: 'company' },
    { icon: 'Settings', label: 'Settings', value: 'settings' },
  ];

  const dateRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'This year', value: 'year' },
    { label: 'All time', value: 'all' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  return (
    <div className="bg-surface dark:bg-[#0A0E27] min-h-screen overflow-x-hidden">
      <DashboardAIAssistant 
        dashboardType="recruiter"
        contextData={{
          companyInfo,
          dateRange,
          activeTab
        }}
      />
      {/* Unified Sidebar */}
      <UnifiedSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <main className="pt-16 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb />
            </div>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary dark:text-white">Recruiter Dashboard</h1>
                  <p className="mt-1 text-sm text-text-secondary dark:text-gray-400">
                    Monitor job performance, track applications, and analyze hiring metrics
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="input-field py-2 pl-3 pr-10 text-sm bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
                    >
                      {dateRangeOptions?.map((option) => (
                        <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                    </div>
                  </div>
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Icon name="Download" size={16} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metrics Cards */}
                <MetricsCards />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ApplicationsChart />
                  <SourceAttribution />
                </div>

                {/* Job Performance Table */}
                <JobPerformanceTable />

                {/* Candidate Pipeline and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <CandidatePipeline />
                  </div>
                  <div>
                    <RecentActivity />
                  </div>
                </div>

                {/* Quick Actions */}
                <QuickActions />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-4">Advanced Analytics</h2>
                
                {/* Demographic Insights */}
                <DemographicInsights />
                
                {/* Time to Hire & ROI Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
                    <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Time to Hire Metrics</h3>
                    <div className="h-64">
                      <div className="w-full h-full flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-lg">
                        <p className="text-text-secondary dark:text-gray-400">Time to Hire Chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
                    <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">ROI Calculations</h3>
                    <div className="h-64">
                      <div className="w-full h-full flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-lg">
                        <p className="text-text-secondary dark:text-gray-400">ROI Chart</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-4">Billing & Payments</h2>
                
                {/* Payment History */}
                <PaymentHistory />
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'jobs' || activeTab === 'candidates' || activeTab === 'company' || activeTab === 'settings') && (
              <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 flex items-center justify-center py-16">
                <div className="text-center">
                  <Icon name={sidebarItems?.find(item => item?.value === activeTab)?.icon || 'FileText'} size={48} className="mx-auto mb-4 text-secondary-400 dark:text-gray-600" />
                  <h2 className="text-xl font-medium text-text-primary dark:text-white mb-2">{sidebarItems?.find(item => item?.value === activeTab)?.label || 'Content'}</h2>
                  <p className="text-text-secondary dark:text-gray-400 max-w-md">
                    This section is under development. Please check back later for updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboardAnalytics;