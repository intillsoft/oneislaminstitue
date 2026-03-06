/**
 * Recruiter Service
 * Service layer for recruiter operations
 */

import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/supabase';

export const recruiterService = {
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
        default:
          startDate = new Date(0);
      }

      // Get recruiter's jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', user.id)
        .limit(1000);

      const jobIds = (jobs || []).map(j => j.id);

      // Get applications for recruiter's jobs
      let applications = [];
      if (jobIds.length > 0) {
        const { data: apps } = await supabase
          .from('applications')
          .select('*')
          .in('course_id', jobIds)
          .limit(10000);
        applications = apps || [];
      }

      // Calculate metrics
      const totalJobs = jobs?.length || 0;
      const activeJobs = jobs?.filter(j => 
        j.status === 'active' || j.status === 'published'
      ).length || 0;
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(a => 
        a.status === 'applied' || a.status === 'pending'
      ).length;
      const interviewsScheduled = applications.filter(a => 
        a.status === 'interview' || a.status === 'interview_scheduled'
      ).length;
      const offersSent = applications.filter(a => 
        a.status === 'offer' || a.status === 'offer_sent'
      ).length;
      const hiresMade = applications.filter(a => 
        a.status === 'hired' || a.status === 'accepted'
      ).length;

      return {
        metrics: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          interviewsScheduled,
          offersSent,
          hiresMade,
        },
        charts: {
          applicationsByStatus: recruiterService._calculateApplicationsByStatus(applications),
          applicationsOverTime: recruiterService._calculateApplicationsOverTime(applications, dateRange),
          topPerformingJobs: recruiterService._calculateTopPerformingJobs(jobs, applications),
          applicationSource: recruiterService._calculateApplicationSource(applications),
          timeToHire: recruiterService._calculateTimeToHire(applications),
        },
        recentActivity: recruiterService._getRecentActivity(jobs, applications),
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get recruiter's jobs (paginated)
   */
  async getJobs({ page = 1, pageSize = 50, filters = {} }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('created_by', user.id);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Get application counts for each job
      const jobIds = (data || []).map(j => j.id);
      let applicationCounts = {};

      if (jobIds.length > 0) {
        const { data: apps } = await supabase
          .from('applications')
          .select('course_id')
          .in('course_id', jobIds);

        if (apps) {
          apps.forEach(app => {
            const id = app.course_id || app.job_id;
            applicationCounts[id] = (applicationCounts[id] || 0) + 1;
          });
        }
      }

      const enrichedData = (data || []).map(job => ({
        ...job,
        applicationCount: applicationCounts[job.id] || 0,
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
   * Create job
   */
  async createJob(jobData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          created_by: user.id,
          status: jobData.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update job
   */
  async updateJob(jobId, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .eq('created_by', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete job
   */
  async deleteJob(jobId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('created_by', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Publish job
   */
  async publishJob(jobId) {
    try {
      return await this.updateJob(jobId, { status: 'active' });
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Deactivate job
   */
  async deactivateJob(jobId) {
    try {
      return await this.updateJob(jobId, { status: 'inactive' });
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get job applicants
   */
  async getJobApplicants(jobId, { page = 1, pageSize = 50, filters = {} }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Verify job belongs to recruiter
      const { data: job } = await supabase
        .from('jobs')
        .select('id')
        .eq('id', jobId)
        .eq('created_by', user.id)
        .single();

      if (!job) throw new Error('Job not found or access denied');

      let query = supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('course_id', jobId);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.matchScore) {
        query = query.gte('match_score', filters.matchScore);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('applied_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Fetch user data
      const userIds = [...new Set((data || []).map(a => a.user_id).filter(Boolean))];
      let usersMap = {};

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('users')
          .select('id, name, email, phone, avatar_url, location')
          .in('id', userIds);
        
        if (users) {
          usersMap = users.reduce((acc, u) => {
            acc[u.id] = u;
            return acc;
          }, {});
        }
      }

      const enrichedData = (data || []).map(app => ({
        ...app,
        user: usersMap[app.user_id] || null,
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
   * Update applicant status
   */
  async updateApplicantStatus(jobId, applicantId, status, notes = '') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Verify job belongs to recruiter
      const { data: job } = await supabase
        .from('jobs')
        .select('id')
        .eq('id', jobId)
        .eq('created_by', user.id)
        .single();

      if (!job) throw new Error('Job not found or access denied');

      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status,
          notes: notes || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicantId)
        .eq('course_id', jobId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get all candidates
   */
  async getCandidates({ page = 1, pageSize = 50, filters = {} }) {
    try {
      // Get all users who are job seekers
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('role', 'job-seeker');

      // Apply filters
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
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
   * Get analytics
   */
  async getAnalytics(dateRange = '30d') {
    try {
      return await recruiterService.getDashboard(dateRange);
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Helper methods
  _calculateApplicationsByStatus(applications) {
    const statusCounts = {};
    applications.forEach(app => {
      const status = app.status || 'applied';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value,
    }));
  },

  _calculateApplicationsOverTime(applications, dateRange) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const count = applications.filter(a => 
        a.applied_at && 
        new Date(a.applied_at) >= date && 
        new Date(a.applied_at) <= monthEnd
      ).length;

      data.push({
        month: months[date.getMonth()],
        applications: count,
      });
    }

    return data;
  },

  _calculateTopPerformingJobs(jobs, applications) {
    const jobStats = {};
    
    jobs.forEach(job => {
      jobStats[job.id] = {
        title: job.title,
        applications: 0,
        views: 0,
      };
    });

    applications.forEach(app => {
      const id = app.course_id || app.job_id;
      if (jobStats[id]) {
        jobStats[id].applications++;
      }
    });

    return Object.values(jobStats)
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);
  },

  _calculateApplicationSource(applications) {
    const sourceCounts = {};
    applications.forEach(app => {
      const source = app.source || app.application_source || 'Direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const total = applications.length;
    return Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      count,
    }));
  },

  _calculateTimeToHire(applications) {
    const hiredApps = applications.filter(a => 
      a.status === 'hired' || a.status === 'accepted'
    );

    if (hiredApps.length === 0) return 0;

    const times = hiredApps
      .filter(a => a.applied_at && a.updated_at)
      .map(a => {
        const applied = new Date(a.applied_at);
        const hired = new Date(a.updated_at);
        return (hired - applied) / (1000 * 60 * 60 * 24); // days
      })
      .filter(t => t > 0);

    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  },

  _getRecentActivity(jobs, applications) {
    const activities = [];

    // Recent jobs
    jobs.slice(0, 3).forEach(j => {
      activities.push({
        type: 'job',
        id: j.id,
        title: `New job: ${j.title}`,
        timestamp: j.created_at,
      });
    });

    // Recent applications
    applications.slice(0, 7).forEach(a => {
      activities.push({
        type: 'application',
        id: a.id,
        title: `New application received`,
        timestamp: a.applied_at || a.created_at,
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  },
};

export default recruiterService;

