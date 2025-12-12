import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import DashboardMetrics from './components/DashboardMetrics';
import RecentActivity from './components/RecentActivity';
import SavedJobs from './components/SavedJobs';
import ApplicationTracker from './components/ApplicationTracker';
import JobAlerts from './components/JobAlerts';
import ProfileCompletion from './components/ProfileCompletion';
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';

const JobSeekerDashboard = () => {
  const { user, profile, loading: authLoading } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const setActiveTab = (tab) => {
    // Use replace: true to prevent page refresh/navigation
    setSearchParams({ tab }, { replace: true });
  };
  const [metrics, setMetrics] = useState({
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
    newMatches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      loadMetrics();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const [analytics, saved] = await Promise.all([
        applicationService.getAnalytics().catch(() => ({ total: 0, interview: 0 })),
        jobService.getSavedJobs().catch(() => [])
      ]);

      setMetrics({
        applicationsSubmitted: analytics.total || 0,
        interviewsScheduled: analytics.interview || 0,
        savedJobs: saved.length || 0,
        newMatches: 0 // TODO: Implement AI matching
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const userData = {
    name: profile?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    profileImage: profile?.avatar_url,
    profileCompletion: calculateProfileCompletion(profile),
    metrics
  };

  function calculateProfileCompletion(profile) {
    if (!profile) return 0;
    let completed = 0;
    const fields = ['name', 'email', 'avatar_url'];
    fields.forEach(field => {
      if (profile[field]) completed++;
    });
    return Math.round((completed / fields.length) * 100);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <DashboardMetrics metrics={userData?.metrics} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="lg:col-span-1">
                <ProfileCompletion completion={userData?.profileCompletion} />
              </div>
            </div>
            <div className="mt-6">
              <SavedJobs limit={4} showViewAll={true} setActiveTab={setActiveTab} />
            </div>
          </>
        );
      case 'applications':
        return <ApplicationTracker />;
      case 'saved':
        return <SavedJobs setActiveTab={setActiveTab} />;
      case 'alerts':
        return <JobAlerts />;
      default:
        return <div>Content not available</div>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white dark:bg-[#0A0E27] min-h-screen flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#0A0E27] min-h-screen flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Icon name="Lock" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Sign in required</h2>
          <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Please sign in to access your dashboard</p>
          <Link to="/job-seeker-registration-login" className="btn-primary inline-flex items-center">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0E27] min-h-screen pb-16 transition-colors duration-300 overflow-x-hidden">
      <DashboardAIAssistant
        dashboardType="job-seeker"
        contextData={{
          metrics,
          profileCompletion: userData?.profileCompletion,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb />

          <div className="flex-1">
            <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-sm border border-[#E2E8F0] dark:border-[#1E2640] p-6 mb-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                    {activeTab === 'overview' ? 'Dashboard' :
                      activeTab === 'applications' ? 'Applications' :
                        activeTab === 'saved' ? 'Saved Jobs' :
                          activeTab === 'alerts' ? 'Job Alerts' : 'Dashboard'}
                  </h1>
                  <p className="text-[#475569] dark:text-[#B4B9C4] mt-1">
                    {activeTab === 'overview' ? `Welcome back, ${userData?.name}` :
                      activeTab === 'applications' ? 'Track your job applications' :
                        activeTab === 'saved' ? 'Jobs you\'ve saved for later' :
                          activeTab === 'alerts' ? 'Manage your job alert preferences' : ''}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to="/dashboard/resume-builder"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Icon name="Upload" size={16} />
                    <span className="hidden sm:inline">Update Resume</span>
                  </Link>
                  <Link to="/jobs" className="btn-primary flex items-center space-x-2">
                    <Icon name="Search" size={16} />
                    <span className="hidden sm:inline">Find Jobs</span>
                  </Link>
                </div>
              </div>

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
