import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';
import DashboardAIAssistant from '../../components/ui/DashboardAIAssistant';
import { useTalentAI } from '../../hooks/useTalentAI';
import { EliteCard, EliteStatCard, EliteProgressBar, ElitePageHeader } from '../../components/ui/EliteCard';

// Sub-component for Forecasting
const EarningsForecaster = ({ earningsHistory, activeGigsValue, pipelineCount }) => {
  const { forecastEarnings, loading } = useTalentAI();
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    handleForecast();
  }, []);

  const handleForecast = async () => {
    const result = await forecastEarnings(earningsHistory, activeGigsValue, pipelineCount);
    if (result) setForecast(result);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-8 space-y-3">
      <div className="w-8 h-8 border-2 border-workflow-primary/30 border-t-workflow-primary rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Synthesizing Alpha...</p>
    </div>
  );

  if (!forecast) return (
    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
      <p className="text-[10px] text-text-muted mb-4 font-black uppercase tracking-widest">Forecasting model offline</p>
      <button
        onClick={handleForecast}
        className="px-6 py-3 bg-surface-elevated hover:bg-surface rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-text-primary transition-all border border-border"
      >
        Retry Forecast
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500 mb-2">Projected Alpha Stream</p>
        <div className="flex items-baseline gap-2">
          <p className="text-5xl font-black text-text-primary leading-none tracking-tighter">${forecast.predictedAmount?.toLocaleString()}</p>
          <span className="text-xs font-black text-emerald-500 tracking-widest uppercase">Target</span>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit">
          Range: ${forecast.range?.min} - ${forecast.range?.max}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Market Intelligence</p>
          <div className="h-px flex-1 bg-border/50"></div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {forecast.factors?.slice(0, 3).map((factor, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-elevated border border-border/50 hover:border-workflow-primary/20 transition-all">
              <div className="w-2 h-2 rounded-full bg-workflow-primary mt-1.5 shadow-primary-glow"></div>
              <p className="text-[11px] text-text-secondary font-black uppercase tracking-widest leading-relaxed">{factor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const TalentDashboard = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user, dateRange]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await talentService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Icon name="Lock" className="w-10 h-10 text-text-muted" />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-2 tracking-tight uppercase">Security Protocol</h2>
          <p className="text-text-muted mb-8 font-black uppercase tracking-widest text-[10px]">Authentication required to access the Talent Network.</p>
          <Link to="/login" className="block w-full py-4 bg-workflow-primary text-white rounded-2xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-workflow-primary/20">
            Secure Entry
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-workflow-primary opacity-20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-workflow-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Hub...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData?.hasProfile) {
    return (
      <div className="min-h-screen bg-bg flex flex-col transition-all duration-300">
        <UnifiedSidebar
          isCollapsed={isSidebarCollapsed}
          onCollapseChange={setIsSidebarCollapsed}
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <EliteCard className="text-center p-12">
              <div className="w-20 h-20 rounded-3xl bg-workflow-primary/10 flex items-center justify-center mx-auto mb-8 border border-workflow-primary/20">
                <Icon name="User" className="w-10 h-10 text-workflow-primary" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Profile Not Established</h1>
              <p className="text-slate-400 mb-10 font-medium text-lg leading-relaxed">
                Your freelancer identity hasn't been established. Create your profile to start offering services and unlock revenue streams.
              </p>
              <Link
                to="/talent/profile"
                className="inline-flex items-center gap-3 px-10 py-4 bg-workflow-primary text-white rounded-2xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-workflow-primary/20"
              >
                <Icon name="Plus" size={20} />
                Activate Global Profile
              </Link>
            </EliteCard>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-bg transition-all duration-300 overflow-x-hidden relative">
      <DashboardAIAssistant
        dashboardType="talent"
        contextData={{
          stats,
          dashboardData,
          dateRange
        }}
      />

      <UnifiedSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />

          <ElitePageHeader
            title="Talent Hub"
            description="Premium Service Nodes & Performance Matrix"
            className="mb-12"
          >
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none px-6 py-3 border border-border rounded-xl bg-surface-elevated text-text-primary text-[10px] font-black uppercase tracking-widest outline-none hover:bg-surface transition-all cursor-pointer shadow-sm"
              >
                <option value="7d">Last 7d</option>
                <option value="30d">Last 30d</option>
                <option value="90d">Last 90d</option>
                <option value="year">FY 2026</option>
              </select>
              <Link
                to="/talent/gigs/create"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-workflow-primary text-white hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-workflow-primary/20"
              >
                <Icon name="Plus" size={16} />
                Initialize Gig
              </Link>
            </div>
          </ElitePageHeader>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <EliteStatCard
              title="Revenue Stream"
              value={`$${stats.totalEarnings?.toLocaleString() || '0'}`}
              subtitle="Cumulative Inflow"
              icon="DollarSign"
              variant="green"
            />
            <EliteStatCard
              title="Current Velocity"
              value={`$${stats.earningsThisMonth?.toLocaleString() || '0'}`}
              subtitle={`${dateRange === '30d' ? '30-Day' : 'Active'} Window`}
              icon="TrendingUp"
              variant="blue"
            />
            <EliteStatCard
              title="Active Clusters"
              value={stats.activeGigs || 0}
              subtitle="Service Nodes"
              icon="Briefcase"
              variant="indigo"
            />
            <EliteStatCard
              title="Trust Ranking"
              value={stats.averageRating?.toFixed(1) || '0.0'}
              subtitle={`${stats.totalReviews || 0} Peer Valuations`}
              icon="Star"
              variant="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Content: Order Pipeline */}
            <div className="lg:col-span-2">
              <EliteCard hover={false} className="h-full">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-text-primary tracking-tight uppercase">Order Pipeline</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mt-1">Real-time Transaction Stream</p>
                  </div>
                  <Link
                    to="/talent/orders"
                    className="text-[10px] font-black uppercase tracking-widest text-workflow-primary hover:text-workflow-primary/80 flex items-center gap-1.5 transition-colors"
                  >
                    All Commands
                    <Icon name="ArrowRight" size={14} />
                  </Link>
                </div>

                {dashboardData?.recentOrders?.length === 0 ? (
                  <div className="text-center py-20 bg-surface rounded-[2.5rem] border border-dashed border-border">
                    <Icon name="Inbox" className="w-16 h-16 text-text-muted/20 mx-auto mb-6" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-[10px]">No active sequences detected</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.recentOrders?.map((order) => (
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-surface-elevated border border-border/50 hover:border-workflow-primary/30 hover:bg-surface transition-all group shadow-sm"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-bg flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                            <Icon name="Briefcase" className="w-6 h-6 text-text-muted group-hover:text-workflow-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-text-primary truncate leading-none mb-1.5 group-hover:text-workflow-primary transition-colors uppercase tracking-tight">{order.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                              <span>{order.buyer?.name || 'External'}</span>
                              <span className="opacity-20">•</span>
                              <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-2xl font-black text-text-primary tracking-tighter mb-1">${order.price}</p>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              order.status === 'in_progress' ? 'bg-workflow-primary/10 text-workflow-primary border border-workflow-primary/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                            {order.status?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </EliteCard>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* AI Forecast */}
              <div className="bg-gradient-to-br from-workflow-primary to-workflow-accent rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/10">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                        <Icon name="Zap" className="w-5 h-5 text-blue-300" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest">AI Forecast</h3>
                    </div>
                    <span className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">Alpha v2.1</span>
                  </div>

                  <EarningsForecaster
                    earningsHistory={[
                      stats.earningsLastMonth || 0,
                      stats.earningsTwoMonthsAgo || 0,
                      stats.earningsThreeMonthsAgo || 0
                    ]}
                    activeGigsValue={stats.activeGigsValue || 0}
                    pipelineCount={stats.pendingOrders || 0}
                  />
                </div>
              </div>

              {/* Matrix Stats */}
              <EliteCard hover={false} className="p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-8 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-workflow-primary shadow-primary-glow"></div>
                  System Integrity Matrix
                </h3>
                <div className="space-y-6">
                  <MetricRow label="Pending Auth" value={stats.pendingOrders || 0} icon="Clock" />
                  <MetricRow label="Active Nodes" value={stats.inProgressOrders || 0} icon="Zap" />
                  <MetricRow label="Success Rate" value={`${stats.responseRate || 0}%`} icon="Check" />

                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                      <span className="text-text-muted">Neural Sync Integrity</span>
                      <span className="text-workflow-primary">{stats.profileCompletion || 0}%</span>
                    </div>
                    <EliteProgressBar
                      value={stats.profileCompletion || 0}
                      variant="blue"
                      height="h-2"
                      animate={true}
                    />
                  </div>
                </div>
              </EliteCard>

              {/* Service Units */}
              <EliteCard hover={false} className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Service Nodes</h3>
                  <Icon name="Layers" className="w-4 h-4 text-text-muted" />
                </div>
                {dashboardData?.topGigs?.length === 0 ? (
                  <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] text-center py-6 italic">Zero Clusters</p>
                ) : (
                  <div className="space-y-5">
                    {dashboardData?.topGigs?.map((gig) => (
                      <div key={gig.id} className="flex items-center justify-between group">
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="font-black text-sm text-text-primary truncate group-hover:text-workflow-primary transition-colors leading-none mb-1.5 uppercase tracking-tight">{gig.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">{gig.total_orders} Cycles</span>
                            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">★ {gig.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                        <Link
                          to={`/talent/gigs/${gig.id}/edit`}
                          className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-text-muted hover:text-workflow-primary hover:bg-surface transition-all border border-border shadow-sm"
                        >
                          <Icon name="Settings" size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </EliteCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helper Components */
const MetricRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-surface-elevated flex items-center justify-center text-text-muted group-hover:text-workflow-primary transition-colors border border-border">
        <Icon name={icon} size={14} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</span>
    </div>
    <span className="text-sm font-black text-text-primary group-hover:scale-110 transition-transform">{value}</span>
  </div>
);

export default TalentDashboard;
