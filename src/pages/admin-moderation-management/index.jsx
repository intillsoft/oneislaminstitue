// src/pages/admin-moderation-management/index.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import { supabase } from '../../lib/supabase';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
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
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';

const AdminModerationManagement = () => {
  const { user, profile, loadingProfile } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'moderation';
  const [dateRange, setDateRange] = useState('30d');
  const [stats, setStats] = useState({
    pendingReviews: 0,
    reportedContent: 0,
    userVerifications: 0,
    activeUsers: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadStats();
    }
  }, [user, profile, dateRange]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      
      // Fetch real data directly from Supabase for accurate counts
      // Use head: true to get count without fetching all data
      const [usersCountResult, jobsResult, applicationsCountResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact' }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
      ]);

      // Get accurate counts
      const totalUsers = usersCountResult.count || 0;
      const totalApplications = applicationsCountResult.count || 0;
      const allJobs = jobsResult.data || [];
      const pendingJobs = allJobs.filter(j => !j.status || j.status === 'draft').length;
      const activeJobs = allJobs.filter(j => j.status === 'active' || j.status === 'published').length;

      const analytics = await adminService.getAnalytics(dateRange).catch(() => ({}));
      
      setStats({
        pendingReviews: pendingJobs,
        reportedContent: analytics.reportedContent || 0,
        userVerifications: totalUsers, // All users are verified by default
        activeUsers: totalUsers, // Show total users count
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Try to get basic counts even if analytics fails
      try {
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        setStats({
          pendingReviews: 0,
          reportedContent: 0,
          userVerifications: userCount || 0,
          activeUsers: userCount || 0,
        });
      } catch {
        setStats({
          pendingReviews: 0,
          reportedContent: 0,
          userVerifications: 0,
          activeUsers: 0,
        });
      }
    } finally {
      setLoadingStats(false);
    }
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const dateRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'This year', value: 'year' },
    { label: 'All time', value: 'all' },
  ];

  const setActiveTab = useCallback((tab) => {
    // Use replace: true to prevent page refresh/navigation
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'moderation':
        return <ModerationQueue />;
      case 'content':
        return <ContentModerationPanel />;
      case 'users':
        return <UserManagementSection />;
      case 'jobs':
        return <JobsManagementSection />;
      case 'applications':
        return <ApplicationsManagementSection />;
      case 'analytics':
        return <PlatformAnalytics dateRange={dateRange} />;
      case 'config':
        return <ConfigurationPanels />;
      case 'crawler':
        return <JobCrawlerPanel />;
      case 'system':
        return <SystemMonitoring />;
      case 'audit':
        return <AuditTrail />;
      case 'role-requests':
        return <RoleChangeRequestsSection />;
      default:
        return <ModerationQueue />;
    }
  }, [activeTab, dateRange]);

  return (
    <div className="bg-surface dark:bg-[#0A0E27] min-h-screen overflow-x-hidden">
      <DashboardAIAssistant 
        dashboardType="admin"
        contextData={{
          stats,
          activeTab,
          dateRange
        }}
      />
      {/* Unified Sidebar */}
      <UnifiedSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
          <Breadcrumb />
          
          <div className="flex-1">
            <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-gray-700 p-4 sm:p-6 mb-6 overflow-x-hidden">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary dark:text-white">Admin Management</h1>
                  <p className="mt-1 text-sm text-text-secondary dark:text-gray-400">
                    Monitor platform activity, manage users, and configure system settings
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {['analytics', 'audit']?.includes(activeTab) && (
                    <div className="relative">
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e?.target?.value)}
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
                  )}
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Icon name="Download" size={16} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Desktop Navigation Tabs */}
              <div className="hidden lg:block mb-6">
                <div className="border-b border-border dark:border-gray-700">
                  <nav className="flex space-x-8 overflow-x-auto">
                    {[
                      { icon: 'Shield', label: 'Moderation', value: 'moderation' },
                      { icon: 'FileText', label: 'Content', value: 'content' },
                      { icon: 'Users', label: 'Users', value: 'users' },
                      { icon: 'Briefcase', label: 'Jobs', value: 'jobs' },
                      { icon: 'FileCheck', label: 'Applications', value: 'applications' },
                      { icon: 'UserPlus', label: 'Role Requests', value: 'role-requests' },
                      { icon: 'BarChart2', label: 'Analytics', value: 'analytics' },
                      { icon: 'Settings', label: 'Config', value: 'config' },
                      { icon: 'Search', label: 'Crawler', value: 'crawler' },
                      { icon: 'Activity', label: 'System', value: 'system' },
                      { icon: 'History', label: 'Audit', value: 'audit' },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setActiveTab(item.value)}
                        className={`flex items-center gap-2 py-4 px-1 font-medium text-sm border-b-2 transition-smooth whitespace-nowrap ${
                          activeTab === item.value
                            ? 'border-primary text-primary dark:text-primary-400' 
                            : 'border-transparent text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white hover:border-secondary-300'
                        }`}
                      >
                        <Icon 
                          name={item.icon} 
                          size={18} 
                          className={activeTab === item.value ? 'text-primary dark:text-primary-400' : 'text-text-secondary dark:text-gray-400'} 
                        />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Quick Stats - Responsive Cards */}
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface dark:bg-[#13182E] rounded-lg p-4 sm:p-6 border border-border dark:border-gray-700 hover:shadow-md transition-shadow dark:hover:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-gray-400 mb-1 truncate">Pending Reviews</p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {loadingStats ? '...' : stats.pendingReviews}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-gray-500 truncate">Jobs awaiting approval</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Clock" size={20} className="sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface dark:bg-[#13182E] rounded-lg p-4 sm:p-6 border border-border dark:border-gray-700 hover:shadow-md transition-shadow dark:hover:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-gray-400 mb-1 truncate">Reported Content</p>
                        <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                          {loadingStats ? '...' : stats.reportedContent}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-gray-500 truncate">Content reports</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Flag" size={20} className="sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface dark:bg-[#13182E] rounded-lg p-4 sm:p-6 border border-border dark:border-gray-700 hover:shadow-md transition-shadow dark:hover:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-gray-400 mb-1 truncate">User Verifications</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {loadingStats ? '...' : stats.userVerifications}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-gray-500 truncate">Verified users</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="UserCheck" size={20} className="sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface dark:bg-[#13182E] rounded-lg p-4 sm:p-6 border border-border dark:border-gray-700 hover:shadow-md transition-shadow dark:hover:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-text-secondary dark:text-gray-400 mb-1 truncate">Active Users</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                          {loadingStats ? '...' : stats.activeUsers.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-gray-500 truncate">Total users</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="TrendingUp" size={20} className="sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div className="bg-surface dark:bg-[#13182E] rounded-lg border border-border dark:border-gray-700 p-4 overflow-x-hidden">
                {renderTabContent}
              </div>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-gray-700 p-4 overflow-x-auto mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-max">
                {[
                  { icon: 'Shield', label: 'Moderation', value: 'moderation' },
                  { icon: 'FileText', label: 'Content', value: 'content' },
                  { icon: 'Users', label: 'Users', value: 'users' },
                  { icon: 'UserPlus', label: 'Role Requests', value: 'role-requests' },
                  { icon: 'BarChart2', label: 'Analytics', value: 'analytics' },
                  { icon: 'Settings', label: 'Config', value: 'config' },
                  { icon: 'Search', label: 'Crawler', value: 'crawler' },
                  { icon: 'Activity', label: 'System', value: 'system' },
                  { icon: 'History', label: 'Audit', value: 'audit' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={`flex flex-col items-center p-3 rounded-md transition-smooth whitespace-nowrap min-h-[44px] ${
                      activeTab === item.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400' 
                        : 'text-text-secondary dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-text-primary dark:hover:text-white'
                    }`}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className={`mb-1 ${activeTab === item.value ? 'text-primary dark:text-primary-400' : 'text-text-secondary dark:text-gray-400'}`} 
                    />
                    <span className="text-xs font-medium text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminModerationManagement;
