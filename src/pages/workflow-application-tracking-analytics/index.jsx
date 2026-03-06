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
import { EliteCard, ElitePageHeader, EliteStatCard } from '../../components/ui/EliteCard';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import DashboardHeader from '../../components/ui/DashboardHeader';

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
    <div className="min-h-screen bg-private">
      <div className="max-w-[1600px] mx-auto transition-all duration-300">
        <ElitePageHeader
          title="Application Pipeline"
          description="High-governance workflow management for your job search journey"
          badge="Tracking Command"
        >
          <div className="flex flex-wrap gap-3 mt-4">
            {views?.map((view) => {
              const Icon = view?.icon;
              return (
                <button
                  key={view?.id}
                  onClick={() => setActiveView(view?.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeView === view?.id
                    ? 'bg-workflow-primary text-white shadow-[0_0_25px_rgba(0,70,255,0.4)] scale-105'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {view?.label}
                </button>
              );
            })}
          </div>
        </ElitePageHeader>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <EliteStatCard
            label="Total Applications"
            value={statusCounts.all}
            icon="Briefcase"
            trend={+12}
          />
          <EliteStatCard
            label="Active Interviews"
            value={statusCounts.interview}
            icon="MessageSquare"
            trend={+2}
            color="emerald"
          />
          <EliteStatCard
            label="Screening Phase"
            value={statusCounts.screening}
            icon="Search"
            color="amber"
          />
          <EliteStatCard
            label="Offers Received"
            value={statusCounts.offer}
            icon="Award"
            color="purple"
          />
        </div>

        {/* Main Content Modules */}
        <div className="grid grid-cols-1 gap-8">
          <EliteCard variant="glass" className="overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar scroll-smooth">
                {statusFilters?.map((filter) => (
                  <button
                    key={filter?.value}
                    onClick={() => setFilterStatus(filter?.value)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${filterStatus === filter?.value
                      ? 'bg-workflow-primary/20 text-workflow-primary border border-workflow-primary/30'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                      }`}
                  >
                    {filter?.label}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${filterStatus === filter?.value ? 'bg-workflow-primary text-white' : 'bg-white/10 text-slate-400'
                      }`}>
                      {filter?.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-8">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-workflow-primary/20 border-t-workflow-primary rounded-full animate-spin"></div>
                </div>
              ) : !user ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">Sign in required</h3>
                  <p className="text-slate-500">Please sign in to access your tracking command center</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {activeView === 'pipeline' && <ApplicationPipeline filterStatus={filterStatus} applications={applications} />}
                  {activeView === 'analytics' && <AnalyticsDashboard applications={applications} />}
                  {activeView === 'calendar' && <CalendarView applications={applications} />}
                  {activeView === 'documents' && <DocumentManager />}
                  {activeView === 'communications' && <CommunicationTracker applications={applications} />}
                  {activeView === 'insights' && <AIInsights applications={applications} />}
                  {activeView === 'goals' && <GoalTracker />}
                </div>
              )}
            </div>
          </EliteCard>
        </div>
      </div>
      <MobileQuickActions />
    </div>
  );
};

export default WorkflowApplicationTrackingAnalytics;