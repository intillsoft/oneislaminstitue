// src/pages/admin-moderation-management/components/PlatformAnalytics.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { applicationService } from '../../../services/applicationService';
import { adminService } from '../../../services/adminService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const PlatformAnalytics = ({ dateRange }) => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [platformHealth, setPlatformHealth] = useState({
    systemUptime: '99.9%',
    avgResponseTime: '245ms',
    errorRate: '0.02%',
    satisfactionScore: '4.8/5'
  });

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [user, profile, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // First, get counts for accurate totals
      const [usersCountResult, jobsCountResult, applicationsCountResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
      ]);

      const totalUsersCount = usersCountResult.count || 0;
      const totalJobsCount = jobsCountResult.count || 0;
      const totalApplicationsCount = applicationsCountResult.count || 0;

      // Fetch all data in batches to avoid RLS issues
      let allUsers = [];
      let allJobs = [];
      let allApplications = [];

      // Fetch users in batches
      if (totalUsersCount > 0) {
        const userBatchSize = 1000;
        for (let offset = 0; offset < totalUsersCount; offset += userBatchSize) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .range(offset, offset + userBatchSize - 1);
          if (error) {
            console.error('Error fetching users batch:', error);
            // Continue with what we have
            break;
          }
          if (data) allUsers = [...allUsers, ...data];
        }
      }

      // Fetch jobs in batches
      if (totalJobsCount > 0) {
        const jobBatchSize = 1000;
        for (let offset = 0; offset < totalJobsCount; offset += jobBatchSize) {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .range(offset, offset + jobBatchSize - 1);
          if (error) {
            console.error('Error fetching jobs batch:', error);
            break;
          }
          if (data) allJobs = [...allJobs, ...data];
        }
      }

      // Fetch applications - try adminService first, then fallback
      try {
        const applicationsResult = await adminService.getApplications({ fetchAll: true });
        allApplications = applicationsResult.data || [];
      } catch (adminError) {
        console.warn('adminService.getApplications failed, trying applicationService:', adminError);
        try {
          allApplications = await applicationService.getAllForRecruiter();
        } catch (appError) {
          console.error('applicationService.getAllForRecruiter also failed:', appError);
          // Try direct query as last resort
          if (totalApplicationsCount > 0) {
            const appBatchSize = 1000;
            for (let offset = 0; offset < totalApplicationsCount; offset += appBatchSize) {
              const { data, error } = await supabase
                .from('applications')
                .select('*')
                .range(offset, offset + appBatchSize - 1)
                .order('applied_at', { ascending: false });
              if (error) {
                console.error('Error fetching applications batch:', error);
                break;
              }
              if (data) allApplications = [...allApplications, ...data];
            }
          }
        }
      }

      // Calculate date range filter
      const now = new Date();
      let startDate = new Date();
      switch (dateRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(0);
      }

      // Filter data by date range
      const filteredJobs = allJobs.filter(job => 
        !job.created_at || new Date(job.created_at) >= startDate
      );
      const filteredApplications = allApplications.filter(app => 
        !app.applied_at || new Date(app.applied_at) >= startDate
      );
      const filteredUsers = allUsers.filter(user => 
        !user.created_at || new Date(user.created_at) >= startDate
      );

      // Calculate metrics - use actual counts for accuracy
      const activeUsers = filteredUsers.filter(u => u.role === 'job-seeker').length;
      const totalUsers = totalUsersCount; // Use count from query, not array length
      const engagementRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;

      const hiredCount = filteredApplications.filter(app => 
        app.status === 'hired' || app.status === 'accepted'
      ).length;

      const communityHealthMetrics = [
        {
          id: 1,
          title: 'User Engagement Rate',
          value: `${engagementRate}%`,
          change: 0, // Would need historical data
          changeType: 'increase',
          icon: 'Users',
          color: 'primary',
          description: 'Active job seekers'
        },
        {
          id: 2,
          title: 'Job Posting Volume',
          value: filteredJobs.length.toLocaleString(),
          change: 0,
          changeType: 'increase',
          icon: 'Briefcase',
          color: 'secondary',
          description: 'Jobs posted this period'
        },
        {
          id: 3,
          title: 'Successful Placements',
          value: hiredCount.toLocaleString(),
          change: 0,
          changeType: 'increase',
          icon: 'CheckCircle',
          color: 'accent',
          description: 'Confirmed job placements'
        },
        {
          id: 4,
          title: 'Total Applications',
          value: filteredApplications.length.toLocaleString(),
          change: 0,
          changeType: 'increase',
          icon: 'FileText',
          color: 'warning',
          description: 'Applications received'
        }
      ];

      // Calculate top performing categories
      const categoryStats = {};
      filteredJobs.forEach(job => {
        const category = job.industry || job.department || 'Other';
        if (!categoryStats[category]) {
          categoryStats[category] = { jobs: 0, applications: 0 };
        }
        categoryStats[category].jobs++;
      });

      filteredApplications.forEach(app => {
        if (app.job) {
          const category = app.job.industry || app.job.department || 'Other';
          if (categoryStats[category]) {
            categoryStats[category].applications++;
          }
        }
      });

      const topPerformingCategories = Object.entries(categoryStats)
        .map(([name, stats]) => {
          const fillRate = stats.jobs > 0 
            ? ((stats.applications / stats.jobs) * 100).toFixed(0)
            : 0;
          return {
            name,
            jobs: stats.jobs,
            applications: stats.applications,
            fillRate: `${fillRate}%`
          };
        })
        .sort((a, b) => b.jobs - a.jobs)
        .slice(0, 5);

      // Calculate user growth (simplified - by month)
      const userGrowthData = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = now.getMonth();
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const monthName = months[monthIndex];
        const monthStart = new Date(now.getFullYear(), monthIndex, 1);
        const monthEnd = new Date(now.getFullYear(), monthIndex + 1, 0);
        
        const jobSeekers = allUsers.filter(u => 
          u.role === 'job-seeker' && 
          u.created_at && 
          new Date(u.created_at) >= monthStart && 
          new Date(u.created_at) <= monthEnd
        ).length;
        
        const recruiters = allUsers.filter(u => 
          u.role === 'recruiter' && 
          u.created_at && 
          new Date(u.created_at) >= monthStart && 
          new Date(u.created_at) <= monthEnd
        ).length;
        
        const companies = allUsers.filter(u => 
          (u.role === 'recruiter' || u.role === 'admin') && 
          u.created_at && 
          new Date(u.created_at) >= monthStart && 
          new Date(u.created_at) <= monthEnd
        ).length;

        userGrowthData.push({
          month: monthName,
          jobSeekers,
          recruiters,
          companies
        });
      }

      setMetrics(communityHealthMetrics);
      setTopCategories(topPerformingCategories);
      setUserGrowth(userGrowthData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      showError(`Failed to load analytics: ${error.message || 'Unknown error'}`);
      // Set empty data on error to prevent crashes
      setMetrics([]);
      setTopCategories([]);
      setUserGrowth([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 z-10">
        <ComponentAIAssistant
          componentName="Platform Analytics"
          componentData={{
            metrics,
            topCategories,
            userGrowth,
            platformHealth,
            dateRange
          }}
          position="top-right"
        />
      </div>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">Platform Analytics</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Community health metrics, user engagement, and revenue tracking with exportable reporting
        </p>
      </div>
      
      {/* Community Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="card p-6 bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-1">{metric.title}</p>
                <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-1">{metric.value}</h3>
                <p className="text-xs text-text-secondary dark:text-gray-500">{metric.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                metric.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20' :
                metric.color === 'secondary' ? 'bg-secondary-100 dark:bg-secondary-800' :
                metric.color === 'accent' ? 'bg-accent-50 dark:bg-accent-900/20' :
                'bg-warning-50 dark:bg-warning-900/20'
              }`}>
                <Icon 
                  name={metric.icon} 
                  size={24} 
                  className={
                    metric.color === 'primary' ? 'text-primary dark:text-primary-400' :
                    metric.color === 'secondary' ? 'text-secondary-600 dark:text-secondary-400' :
                    metric.color === 'accent' ? 'text-accent dark:text-accent-400' :
                    'text-warning dark:text-warning-400'
                  } 
                />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center ${
                metric.changeType === 'increase' ? 'text-success dark:text-green-400' : 'text-error dark:text-red-400'
              }`}>
                <Icon 
                  name={metric.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  className="mr-1" 
                />
                <span className="text-sm font-medium">{metric.change}%</span>
              </div>
              <span className="text-xs text-text-secondary dark:text-gray-400 ml-2">vs. last period</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Platform Health Overview */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Platform Health Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Zap" size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{platformHealth.systemUptime}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{platformHealth.avgResponseTime}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{platformHealth.errorRate}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Error Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Star" size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{platformHealth.satisfactionScore}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">User Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Growth Chart */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4 sm:mb-0">User Growth Trends</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-text-secondary dark:text-gray-400">Job Seekers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-text-secondary dark:text-gray-400">Recruiters</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-text-secondary dark:text-gray-400">Companies</span>
              </div>
            </div>
          </div>
          
          {/* Chart Representation */}
          <div className="h-64 bg-surface-100 dark:bg-surface-800 rounded-lg flex items-center justify-center overflow-x-auto px-4">
            <div className="w-full min-w-max">
              <div className="flex items-end justify-between h-48 gap-2">
                {userGrowth.map((data, index) => {
                  const maxJobSeekers = Math.max(...userGrowth.map(d => d.jobSeekers || 0), 1);
                  const maxRecruiters = Math.max(...userGrowth.map(d => d.recruiters || 0), 1);
                  const maxCompanies = Math.max(...userGrowth.map(d => d.companies || 0), 1);
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center min-w-[60px]">
                      <div className="w-full flex flex-col items-center justify-end h-full gap-1">
                        <div 
                          className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-all" 
                          style={{ height: `${((data.jobSeekers || 0) / maxJobSeekers) * 100}%`, minHeight: maxJobSeekers > 0 ? '2px' : '0' }}
                          title={`Job Seekers: ${data.jobSeekers || 0}`}
                        ></div>
                        <div 
                          className="w-full bg-green-500 dark:bg-green-600 rounded-t transition-all" 
                          style={{ height: `${((data.recruiters || 0) / maxRecruiters) * 100}%`, minHeight: maxRecruiters > 0 ? '2px' : '0' }}
                          title={`Recruiters: ${data.recruiters || 0}`}
                        ></div>
                        <div 
                          className="w-full bg-purple-500 dark:bg-purple-600 rounded-t transition-all" 
                          style={{ height: `${((data.companies || 0) / maxCompanies) * 100}%`, minHeight: maxCompanies > 0 ? '2px' : '0' }}
                          title={`Companies: ${data.companies || 0}`}
                        ></div>
                      </div>
                      <span className="text-xs text-text-secondary dark:text-gray-400 mt-2 whitespace-nowrap">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Performing Categories */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Top Performing Job Categories</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border dark:border-gray-700">
                  <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-text-secondary dark:text-gray-400">Category</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-text-secondary dark:text-gray-400">Jobs Posted</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-text-secondary dark:text-gray-400">Applications</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-text-secondary dark:text-gray-400">Fill Rate</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-text-secondary dark:text-gray-400 hidden md:table-cell">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-text-secondary dark:text-gray-400">
                      <Icon name="BarChart2" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No category data available</p>
                    </td>
                  </tr>
                ) : (
                  topCategories.map((category, index) => (
                    <tr key={category.name} className="border-b border-border dark:border-gray-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-smooth">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-sm font-medium text-primary dark:text-primary-400">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-text-primary dark:text-white truncate">{category.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-sm text-text-primary dark:text-white whitespace-nowrap">{category.jobs.toLocaleString()}</td>
                      <td className="py-4 px-4 sm:px-6 text-sm text-text-primary dark:text-white whitespace-nowrap">{category.applications.toLocaleString()}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className="text-sm font-medium text-success dark:text-green-400">{category.fillRate}</span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
                        <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 max-w-24">
                          <div 
                            className="bg-primary dark:bg-primary-500 h-2 rounded-full transition-all" 
                            style={{ width: category.fillRate }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Export Options */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Export Analytics Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={async () => {
                try {
                  const { data: users } = await supabase.from('users').select('*');
                  const csvContent = 'Name,Email,Role,Created At\n' +
                    (users || []).map(u => `${u.name || ''},${u.email || ''},${u.role || ''},${u.created_at || ''}`).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `user-report-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Export error:', error);
                }
              }}
              className="btn-secondary flex items-center justify-center space-x-2 h-12"
            >
              <Icon name="FileText" size={16} />
              <span>User Report</span>
            </button>
            <button 
              onClick={async () => {
                try {
                  const csvContent = `Analytics Report - ${dateRange}\n\n` +
                    metrics.map(m => `${m.title},${m.value}`).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `analytics-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Export error:', error);
                }
              }}
              className="btn-secondary flex items-center justify-center space-x-2 h-12"
            >
              <Icon name="BarChart2" size={16} />
              <span>Analytics Report</span>
            </button>
            <button 
              onClick={async () => {
                try {
                  const { data: jobs } = await supabase.from('jobs').select('*');
                  const csvContent = 'Title,Company,Status,Created At\n' +
                    (jobs || []).map(j => `${j.title || ''},${j.company || ''},${j.status || ''},${j.created_at || ''}`).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `jobs-report-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Export error:', error);
                }
              }}
              className="btn-secondary flex items-center justify-center space-x-2 h-12"
            >
              <Icon name="DollarSign" size={16} />
              <span>Revenue Report</span>
            </button>
            <button className="btn-secondary flex items-center justify-center space-x-2 h-12">
              <Icon name="Download" size={16} />
              <span>Full Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
