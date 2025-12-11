import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, FileText, MessageSquare, Target, Bell, Filter, Download } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../components/ui/Toast';
import ApplicationPipeline from './components/ApplicationPipeline';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CalendarView from './components/CalendarView';
import DocumentManager from './components/DocumentManager';
import CommunicationTracker from './components/CommunicationTracker';
import AIInsights from './components/AIInsights';
import GoalTracker from './components/GoalTracker';
import MobileQuickActions from './components/MobileQuickActions';
import Icon from '../../components/AppIcon';

const WorkflowApplicationTrackingAnalytics = () => {
  const { user } = useAuthContext();
  const { error: showError } = useToast();
  const [activeView, setActiveView] = useState('pipeline');
  const [filterStatus, setFilterStatus] = useState('all');
  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user, filterStatus]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await applicationService.getAll();
      
      // Count by status
      const counts = {
        all: allApplications.length,
        applied: allApplications.filter(a => a.status === 'applied').length,
        screening: allApplications.filter(a => a.status === 'screening').length,
        interview: allApplications.filter(a => a.status === 'interview').length,
        offer: allApplications.filter(a => a.status === 'accepted').length,
        rejected: allApplications.filter(a => a.status === 'rejected').length
      };
      
      setStatusCounts(counts);
      setApplications(allApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const views = [
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'insights', label: 'AI Insights', icon: Target },
    { id: 'goals', label: 'Goals', icon: Target }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Applications', count: statusCounts.all },
    { value: 'applied', label: 'Applied', count: statusCounts.applied },
    { value: 'screening', label: 'Screening', count: statusCounts.screening },
    { value: 'interview', label: 'Interview', count: statusCounts.interview },
    { value: 'offer', label: 'Offer', count: statusCounts.offer },
    { value: 'rejected', label: 'Rejected', count: statusCounts.rejected }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27] transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-[#0046FF] text-white py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Application Tracking & Analytics</h1>
              <p className="text-blue-100 text-sm md:text-base">
                Comprehensive workflow management for your job search journey
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#13182E] text-[#0046FF] dark:text-[#6693FF] rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-[#1A2139] transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export Report</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="hidden md:inline">Notifications</span>
                {statusCounts.interview > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {statusCounts.interview}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-[#13182E] border-b border-gray-200 dark:border-[#1E2640] sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
            {views?.map((view) => {
              const Icon = view?.icon;
              return (
                <button
                  key={view?.id}
                  onClick={() => setActiveView(view?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeView === view?.id
                      ? 'bg-[#0046FF] text-white'
                      : 'bg-gray-100 dark:bg-[#1A2139] text-gray-700 dark:text-[#B4B9C4] hover:bg-gray-200 dark:hover:bg-[#0A0E27]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {view?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Status Filter Section */}
      <div className="bg-gray-50 dark:bg-[#13182E] py-4 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <Filter className="w-5 h-5 text-gray-600 dark:text-[#8B92A3] flex-shrink-0" />
            <div className="flex gap-2">
              {statusFilters?.map((filter) => (
                <button
                  key={filter?.value}
                  onClick={() => setFilterStatus(filter?.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    filterStatus === filter?.value
                      ? 'bg-[#0046FF] text-white'
                      : 'bg-white dark:bg-[#1A2139] text-gray-700 dark:text-[#B4B9C4] hover:bg-gray-100 dark:hover:bg-[#0A0E27] border border-gray-200 dark:border-[#1E2640]'
                  }`}
                >
                  {filter?.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filterStatus === filter?.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-[#1E2640]'
                  }`}>
                    {filter?.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0046FF]"></div>
          </div>
        ) : !user ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#E8EAED] mb-2">Sign in required</h3>
            <p className="text-gray-600 dark:text-[#8B92A3]">Please sign in to track your applications</p>
          </div>
        ) : (
          <>
            {activeView === 'pipeline' && <ApplicationPipeline filterStatus={filterStatus} applications={applications} />}
            {activeView === 'analytics' && <AnalyticsDashboard applications={applications} />}
            {activeView === 'calendar' && <CalendarView applications={applications} />}
            {activeView === 'documents' && <DocumentManager />}
            {activeView === 'communications' && <CommunicationTracker applications={applications} />}
            {activeView === 'insights' && <AIInsights applications={applications} />}
            {activeView === 'goals' && <GoalTracker />}
          </>
        )}
      </div>
      {/* Mobile Quick Actions */}
      <MobileQuickActions />
    </div>
  );
};

export default WorkflowApplicationTrackingAnalytics;