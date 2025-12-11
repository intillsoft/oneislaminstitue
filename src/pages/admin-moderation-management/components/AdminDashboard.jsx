// src/pages/admin-moderation-management/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { adminService } from '../../../services/adminService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard = ({ dateRange }) => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [user, profile, dateRange]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // Force fresh data by clearing any potential cache
      const data = await adminService.getDashboard(dateRange);
      console.log('Dashboard data loaded:', {
        totalUsers: data?.metrics?.totalUsers,
        totalApplications: data?.metrics?.totalApplications,
        totalJobs: data?.metrics?.totalJobs,
      });
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="card p-12 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-secondary-300 dark:text-gray-600" />
        <p className="text-text-secondary dark:text-gray-400">No dashboard data available</p>
      </div>
    );
  }

  const { metrics, charts, recentActivity } = dashboardData;
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#64748B'];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
        <p className="text-primary-100 dark:text-primary-200">
          Here's what's happening on your platform today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-text-primary dark:text-white">{metrics.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
                {metrics.newUsers} new this period
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-text-primary dark:text-white">{metrics.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
                {metrics.userGrowthRate > 0 ? '+' : ''}{metrics.userGrowthRate}% growth
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">Total Jobs</p>
              <p className="text-3xl font-bold text-text-primary dark:text-white">{metrics.totalJobs.toLocaleString()}</p>
              <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
                {metrics.activeJobs} active
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Briefcase" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-text-primary dark:text-white">{metrics.totalApplications.toLocaleString()}</p>
              <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
                {metrics.hiredCount} hires ({metrics.successRate}% success)
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-background)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Breakdown */}
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Subscription Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.subscriptionBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {charts.subscriptionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Job Postings Trend */}
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Job Postings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.jobPostingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-background)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="jobs" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Industries */}
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Top Industries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.topIndustries} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fill: 'var(--color-text-secondary)' }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--color-text-secondary)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-background)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-text-secondary dark:text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <Icon 
                    name={activity.type === 'user' ? 'User' : activity.type === 'job' ? 'Briefcase' : 'FileText'} 
                    size={20} 
                    className="text-primary dark:text-primary-400" 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary dark:text-white">{activity.title}</p>
                  <p className="text-xs text-text-secondary dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6 hover:shadow-lg transition-all text-left">
          <Icon name="Users" size={24} className="text-primary dark:text-primary-400 mb-3" />
          <h4 className="font-medium text-text-primary dark:text-white mb-1">Manage Users</h4>
          <p className="text-sm text-text-secondary dark:text-gray-400">View and manage all users</p>
        </button>
        <button className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6 hover:shadow-lg transition-all text-left">
          <Icon name="Briefcase" size={24} className="text-primary dark:text-primary-400 mb-3" />
          <h4 className="font-medium text-text-primary dark:text-white mb-1">Manage Jobs</h4>
          <p className="text-sm text-text-secondary dark:text-gray-400">Review and moderate jobs</p>
        </button>
        <button className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6 hover:shadow-lg transition-all text-left">
          <Icon name="BarChart2" size={24} className="text-primary dark:text-primary-400 mb-3" />
          <h4 className="font-medium text-text-primary dark:text-white mb-1">View Analytics</h4>
          <p className="text-sm text-text-secondary dark:text-gray-400">Platform insights and metrics</p>
        </button>
        <button className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6 hover:shadow-lg transition-all text-left">
          <Icon name="Settings" size={24} className="text-primary dark:text-primary-400 mb-3" />
          <h4 className="font-medium text-text-primary dark:text-white mb-1">Settings</h4>
          <p className="text-sm text-text-secondary dark:text-gray-400">Configure platform settings</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
