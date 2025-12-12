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

// Sub-component for Forecasting
const EarningsForecaster = ({ earningsHistory, activeGigsValue, pipelineCount }) => {
  const { forecastEarnings, loading } = useTalentAI();
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    // Auto-load forecast on mount
    handleForecast();
  }, []);

  const handleForecast = async () => {
    const result = await forecastEarnings(earningsHistory, activeGigsValue, pipelineCount);
    if (result) setForecast(result);
  };

  if (loading) return <div className="text-sm opacity-80 animate-pulse">Running financial models...</div>;

  if (!forecast) return (
    <button onClick={handleForecast} className="text-sm underline opacity-80 hover:opacity-100">
      Retry Forecast
    </button>
  );

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm opacity-80 mb-1">Projected Next Month</p>
        <p className="text-4xl font-bold">${forecast.predictedAmount?.toLocaleString()}</p>
        <div className="flex items-center gap-2 text-xs mt-1 bg-white/10 w-fit px-2 py-1 rounded">
          <span>Range: ${forecast.range?.min} - ${forecast.range?.max}</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold opacity-90">Key Factors:</p>
        <ul className="text-xs space-y-1 opacity-80">
          {forecast.factors?.slice(0, 3).map((factor, i) => (
            <li key={i} className="flex items-start gap-1">
              <span>•</span> {factor}
            </li>
          ))}
        </ul>
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0E27]">
        <div className="text-center">
          <Icon name="Lock" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Sign in required</h2>
          <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Please sign in to access your talent dashboard</p>
          <Link to="/login" className="btn-primary inline-flex items-center">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0E27]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
          <p className="text-[#64748B] dark:text-[#8B92A3]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData?.hasProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            <div className="text-center py-12">
              <Icon name="User" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">Create Your Talent Profile</h2>
              <p className="text-[#64748B] dark:text-[#8B92A3] mb-6">
                Set up your freelancer profile to start offering services and earning
              </p>
              <Link
                to="/talent/profile"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Icon name="Plus" size={18} />
                Create Talent Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <DashboardAIAssistant
        dashboardType="talent"
        contextData={{
          stats,
          dashboardData,
          dateRange
        }}
      />
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                Talent Dashboard
              </h1>
              <p className="text-[#64748B] dark:text-[#8B92A3] mt-1">
                Manage your freelance business and track your performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="year">This year</option>
              </select>
              <Link
                to="/talent/gigs/create"
                className="btn-primary flex items-center gap-2"
              >
                <Icon name="Plus" size={18} />
                Create Gig
              </Link>
            </div>
          </div>

          {/* Stats Cards - Enhanced Beautiful Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Earnings</p>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center">
                  <Icon name="DollarSign" className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                ${stats.totalEarnings?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                All time earnings
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">This Month</p>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
                  <Icon name="TrendingUp" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                ${stats.earningsThisMonth?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {dateRange === '30d' ? 'Last 30 days' : 'This month'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Active Gigs</p>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center">
                  <Icon name="Briefcase" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                {stats.activeGigs || 0}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Currently active
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Average Rating</p>
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 dark:bg-yellow-500/30 flex items-center justify-center">
                  <Icon name="Star" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                {stats.averageRating?.toFixed(1) || '0.0'}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                {stats.totalReviews || 0} reviews
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">Recent Orders</h2>
                <Link
                  to="/talent/orders"
                  className="text-sm text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400"
                >
                  View All
                </Link>
              </div>
              {dashboardData?.recentOrders?.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Inbox" className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-3" />
                  <p className="text-[#64748B] dark:text-[#8B92A3]">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData?.recentOrders?.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1A2139] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640]"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-workflow-primary/10 flex items-center justify-center">
                          <Icon name="Briefcase" className="w-6 h-6 text-workflow-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">{order.title}</h3>
                          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                            {order.buyer?.name || 'Unknown Buyer'}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-1">
                            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0F172A] dark:text-[#E8EAED]">${order.price}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                          order.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                            order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}>
                          {order.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Earnings Forecaster (New AI Feature) */}
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon name="TrendingUp" className="w-5 h-5" />
                  AI Forecast
                </h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Beta</span>
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Pending Orders</span>
                    <span className="font-bold text-[#0F172A] dark:text-[#E8EAED]">{stats.pendingOrders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">In Progress</span>
                    <span className="font-bold text-[#0F172A] dark:text-[#E8EAED]">{stats.inProgressOrders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Completed</span>
                    <span className="font-bold text-[#0F172A] dark:text-[#E8EAED]">{stats.completedOrders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Response Rate</span>
                    <span className="font-bold text-[#0F172A] dark:text-[#E8EAED]">{stats.responseRate || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Profile Complete</span>
                    <span className="font-bold text-[#0F172A] dark:text-[#E8EAED]">{stats.profileCompletion || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Top Performing Gigs */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Top Performing Gigs</h3>
                {dashboardData?.topGigs?.length === 0 ? (
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">No gigs yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData?.topGigs?.map((gig) => (
                      <div key={gig.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A2139] rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-[#0F172A] dark:text-[#E8EAED]">{gig.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">
                              {gig.total_orders} orders
                            </span>
                            <span className="text-xs text-yellow-500">★ {gig.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                        <Link
                          to={`/talent/gigs/${gig.id}/edit`}
                          className="text-workflow-primary hover:text-workflow-primary-600"
                        >
                          <Icon name="Edit" size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Reviews */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Recent Reviews</h3>
                {dashboardData?.recentReviews?.length === 0 ? (
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">No reviews yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData?.recentReviews?.map((review) => (
                      <div key={review.id} className="p-3 bg-gray-50 dark:bg-[#1A2139] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={12}
                                className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">
                            {review.reviewer?.name || 'Anonymous'}
                          </span>
                        </div>
                        {review.review && (
                          <p className="text-sm text-[#0F172A] dark:text-[#E8EAED]">{review.review}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;

