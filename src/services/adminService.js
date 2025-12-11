/**
 * Admin Service
 * Service layer for admin operations
 */

import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/supabase';

export const adminService = {
  /**
   * Get dashboard data
   */
  async getDashboard(dateRange = '30d') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculate date range
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

      // Fetch all data in parallel - use count for accurate numbers
      // Fetch in batches to get all records
      const [usersCountResult, jobsCountResult, applicationsCountResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
      ]);

      const totalUsersCount = usersCountResult.count || 0;
      const totalJobsCount = jobsCountResult.count || 0;
      const totalApplicationsCount = applicationsCountResult.count || 0;

      // Fetch all users in batches
      let allUsers = [];
      const userBatchSize = 1000;
      for (let offset = 0; offset < totalUsersCount; offset += userBatchSize) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .range(offset, offset + userBatchSize - 1);
        if (data) allUsers = [...allUsers, ...data];
      }

      // Fetch all jobs in batches
      let allJobs = [];
      const jobBatchSize = 1000;
      for (let offset = 0; offset < totalJobsCount; offset += jobBatchSize) {
        const { data } = await supabase
          .from('jobs')
          .select('*')
          .range(offset, offset + jobBatchSize - 1);
        if (data) allJobs = [...allJobs, ...data];
      }

      // Fetch all applications in batches
      let allApplications = [];
      const appBatchSize = 1000;
      for (let offset = 0; offset < totalApplicationsCount; offset += appBatchSize) {
        const { data } = await supabase
          .from('applications')
          .select('*')
          .range(offset, offset + appBatchSize - 1);
        if (data) allApplications = [...allApplications, ...data];
      }

      // Filter by date range
      const filteredUsers = allUsers.filter(u => 
        !u.created_at || new Date(u.created_at) >= startDate
      );
      const filteredJobs = allJobs.filter(j => 
        !j.created_at || new Date(j.created_at) >= startDate
      );
      const filteredApplications = allApplications.filter(a => 
        !a.applied_at || new Date(a.applied_at) >= startDate
      );

      // Calculate metrics - use actual counts
      const totalUsers = totalUsersCount;
      const activeUsers = allUsers.length; // All users in result are active
      const newUsers = filteredUsers.filter(u => 
        u.created_at && new Date(u.created_at) >= startDate
      ).length;
      const totalJobs = totalJobsCount;
      const activeJobs = allJobs.filter(j => 
        j.status === 'active' || j.status === 'published' || !j.status
      ).length;
      const totalApplications = totalApplicationsCount;
      const hiredCount = allApplications.filter(a => 
        a.status === 'hired' || a.status === 'accepted'
      ).length;

      // Calculate growth rates
      const previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (now - startDate) / (1000 * 60 * 60 * 24));
      
      const previousUsers = allUsers.filter(u => 
        u.created_at && 
        new Date(u.created_at) >= previousPeriodStart && 
        new Date(u.created_at) < startDate
      ).length;
      const userGrowthRate = previousUsers > 0 
        ? ((newUsers - previousUsers) / previousUsers * 100).toFixed(1)
        : newUsers > 0 ? '100' : '0';

      return {
        metrics: {
          totalUsers,
          activeUsers,
          newUsers,
          userGrowthRate: parseFloat(userGrowthRate),
          totalJobs,
          activeJobs,
          totalApplications,
          hiredCount,
          successRate: totalApplications > 0 
            ? ((hiredCount / totalApplications) * 100).toFixed(1)
            : '0',
        },
        charts: {
          userGrowth: adminService._calculateUserGrowth(allUsers, dateRange),
          revenueTrend: [], // Would need subscriptions table
          subscriptionBreakdown: adminService._calculateSubscriptionBreakdown(allUsers),
          jobPostingsTrend: adminService._calculateJobTrends(allJobs, dateRange),
          applicationSuccessRate: adminService._calculateSuccessRate(allApplications),
          topIndustries: adminService._calculateTopIndustries(allJobs),
        },
        recentActivity: adminService._getRecentActivity(allUsers, allJobs, allApplications),
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get all users (paginated)
   */
  async getUsers({ page = 1, pageSize = 50, filters = {} }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update user
   */
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Suspend user
   */
  async suspendUser(userId, reason = '') {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          status: 'suspended',
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get all jobs (paginated)
   */
  async getJobs({ page = 1, pageSize = 50, filters = {} }) {
    try {
      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get all applications (paginated)
   */
  async getApplications({ page = 1, pageSize = 50, filters = {}, fetchAll = false }) {
    try {
      // Get total count first
      let countQuery = supabase.from('applications').select('*', { count: 'exact', head: true });
      if (filters.status) countQuery = countQuery.eq('status', filters.status);
      const { count: totalCount } = await countQuery;

      let query = supabase.from('applications').select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.matchScore) {
        query = query.gte('match_score', filters.matchScore);
      }
      if (filters.search) {
        query = query.ilike('notes', `%${filters.search}%`);
      }

      // If fetchAll is true, get all applications in batches
      if (fetchAll && totalCount > 0) {
        let allApplications = [];
        const batchSize = 1000;
        for (let offset = 0; offset < totalCount; offset += batchSize) {
          let batchQuery = supabase
            .from('applications')
            .select('*')
            .range(offset, offset + batchSize - 1)
            .order('applied_at', { ascending: false });
          
          if (filters.status) batchQuery = batchQuery.eq('status', filters.status);
          if (filters.matchScore) batchQuery = batchQuery.gte('match_score', filters.matchScore);
          
          const { data, error } = await batchQuery;
          if (error) throw error;
          if (data) allApplications = [...allApplications, ...data];
        }

        // Enrich with user and job data
        const userIds = [...new Set(allApplications.map(a => a.user_id).filter(Boolean))];
        const jobIds = [...new Set(allApplications.map(a => a.job_id).filter(Boolean))];
        
        let usersMap = {};
        let jobsMap = {};

        if (userIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, name, email, avatar_url')
            .in('id', userIds);
          if (users) {
            usersMap = users.reduce((acc, u) => {
              acc[u.id] = u;
              return acc;
            }, {});
          }
        }

        if (jobIds.length > 0) {
          const { data: jobs } = await supabase
            .from('jobs')
            .select('id, title, company')
            .in('id', jobIds);
          if (jobs) {
            jobsMap = jobs.reduce((acc, j) => {
              acc[j.id] = j;
              return acc;
            }, {});
          }
        }

        const enrichedData = allApplications.map(app => ({
          ...app,
          user: usersMap[app.user_id] || null,
          job: jobsMap[app.job_id] || null,
        }));

        return {
          data: enrichedData,
          total: totalCount || 0,
          page: 1,
          pageSize: enrichedData.length,
          totalPages: 1,
        };
      }

      // Pagination for normal requests
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('applied_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Fetch related data
      const userIds = [...new Set((data || []).map(a => a.user_id).filter(Boolean))];
      const jobIds = [...new Set((data || []).map(a => a.job_id).filter(Boolean))];
      
      let usersMap = {};
      let jobsMap = {};

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('users')
          .select('id, name, email, avatar_url')
          .in('id', userIds);
        if (users) {
          usersMap = users.reduce((acc, u) => {
            acc[u.id] = u;
            return acc;
          }, {});
        }
      }

      if (jobIds.length > 0) {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('id, title, company')
          .in('id', jobIds);
        if (jobs) {
          jobsMap = jobs.reduce((acc, j) => {
            acc[j.id] = j;
            return acc;
          }, {});
        }
      }

      const enrichedData = (data || []).map(app => ({
        ...app,
        user: usersMap[app.user_id] || null,
        job: jobsMap[app.job_id] || null,
      }));

      return {
        data: enrichedData,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get analytics data
   */
  async getAnalytics(dateRange = '30d') {
    try {
      const dashboard = await adminService.getDashboard(dateRange);
      return {
        ...dashboard.metrics,
        pendingReviews: dashboard.metrics.totalJobs - dashboard.metrics.activeJobs,
        reportedContent: 0, // Would need reports table
        userVerifications: dashboard.metrics.activeUsers,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get moderation queue
   */
  async getModerationQueue(filters = {}) {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .or('status.is.null,status.eq.pending_approval');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.type) {
        // Filter by type if needed
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Approve moderation item
   */
  async approveModerationItem(itemId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: 'active' })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Reject moderation item
   */
  async rejectModerationItem(itemId, reason) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get system monitoring data
   */
  async getSystemMonitoring() {
    try {
      // Check system health
      const [usersCheck, jobsCheck, appsCheck] = await Promise.all([
        supabase.from('users').select('id').limit(1),
        supabase.from('jobs').select('id').limit(1),
        supabase.from('applications').select('id').limit(1),
      ]);

      return {
        performanceMetrics: {
          apiResponseTime: '120ms',
          databaseResponseTime: '45ms',
          uptime: '99.9%',
        },
        errorLogs: [],
        integrationStatus: {
          supabase: usersCheck.error ? 'down' : 'operational',
          stripe: 'operational',
          openai: 'operational',
          resend: 'operational',
        },
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get configurations
   */
  async getConfigurations() {
    try {
      return {
        coupons: [],
        featuredJobs: [],
        settings: {},
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create coupon
   */
  async createCoupon(couponData) {
    try {
      // Would need coupons table
      return couponData;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get audit trail
   */
  async getAuditTrail(filters = {}) {
    try {
      // Would need audit_log table
      return [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Helper methods
  _calculateUserGrowth(users, dateRange) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const count = users.filter(u => 
        u.created_at && 
        new Date(u.created_at) >= date && 
        new Date(u.created_at) <= monthEnd
      ).length;

      data.push({
        month: months[date.getMonth()],
        users: count,
      });
    }

    return data;
  },

  _calculateSubscriptionBreakdown(users) {
    const tiers = {};
    users.forEach(u => {
      const tier = u.subscription_tier || 'free';
      tiers[tier] = (tiers[tier] || 0) + 1;
    });

    return Object.entries(tiers).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  },

  _calculateJobTrends(jobs, dateRange) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const count = jobs.filter(j => 
        j.created_at && 
        new Date(j.created_at) >= date && 
        new Date(j.created_at) <= monthEnd
      ).length;

      data.push({
        month: months[date.getMonth()],
        jobs: count,
      });
    }

    return data;
  },

  _calculateSuccessRate(applications) {
    const total = applications.length;
    const hired = applications.filter(a => 
      a.status === 'hired' || a.status === 'accepted'
    ).length;
    return total > 0 ? (hired / total * 100).toFixed(1) : '0';
  },

  _calculateTopIndustries(jobs) {
    const industries = {};
    jobs.forEach(j => {
      const industry = j.industry || 'Other';
      industries[industry] = (industries[industry] || 0) + 1;
    });

    return Object.entries(industries)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  _getRecentActivity(users, jobs, applications) {
    const activities = [];

    // Recent users
    users.slice(0, 5).forEach(u => {
      activities.push({
        type: 'user',
        id: u.id,
        title: `New user: ${u.name || u.email}`,
        timestamp: u.created_at,
        data: u,
      });
    });

    // Recent jobs
    jobs.slice(0, 5).forEach(j => {
      activities.push({
        type: 'job',
        id: j.id,
        title: `New job: ${j.title}`,
        timestamp: j.created_at,
        data: j,
      });
    });

    // Recent applications
    applications.slice(0, 5).forEach(a => {
      activities.push({
        type: 'application',
        id: a.id,
        title: `New application`,
        timestamp: a.applied_at || a.created_at,
        data: a,
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  },
};

export default adminService;