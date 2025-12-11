/**
 * Application Service
 * Service layer for job application operations
 */

import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';
import { handleSupabaseError } from '../lib/supabase';

export const applicationService = {
  /**
   * Get all applications for current user
   */
  async getAll(filters = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch applications first, then jobs separately to avoid RLS recursion
      let query = supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Ordering
      query = query.order('applied_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Fetch jobs separately to avoid RLS recursion
      const jobIds = [...new Set((data || []).map(app => app.job_id).filter(Boolean))];
      let jobsMap = {};
      
      if (jobIds.length > 0) {
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);
        
        if (!jobsError && jobs) {
          jobsMap = jobs.reduce((acc, job) => {
            acc[job.id] = job;
            return acc;
          }, {});
        }
      }

      // Combine applications with jobs
      return (data || []).map(app => ({
        ...app,
        job: jobsMap[app.job_id] || null,
      }));
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get applications by job ID (for recruiters)
   */
  async getByJobId(jobId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get all applications for recruiters/admins
   * Recruiters only see applications for their own jobs
   * Admins see all applications
   */
  async getAllForRecruiter(filters = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check user role - use count query first to avoid RLS issues
      let isAdmin = false;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profile) {
          isAdmin = profile.role === 'admin';
        }
      } catch (roleError) {
        console.warn('Could not check admin role, assuming non-admin:', roleError);
        // Continue as non-admin if we can't check
      }

      let query = supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });

      // If recruiter, only get applications for their own jobs
      // If admin, get all applications (RLS policy should allow this)
      if (!isAdmin) {
        // First, get all jobs created by this recruiter
        const { data: recruiterJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('created_by', user.id);

        const jobIds = (recruiterJobs || []).map(j => j.id);
        
        if (jobIds.length === 0) {
          // No jobs, return empty array
          return [];
        }

        // Filter applications to only those for recruiter's jobs
        query = query.in('job_id', jobIds);
      }
      // If admin, query will return all applications (no filter needed)

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.jobId) {
        query = query.eq('job_id', filters.jobId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch jobs and users separately
      const jobIds = [...new Set((data || []).map(app => app.job_id).filter(Boolean))];
      const userIds = [...new Set((data || []).map(app => app.user_id).filter(Boolean))];
      
      let jobsMap = {};
      let usersMap = {};
      
      if (jobIds.length > 0) {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);
        if (jobs) {
          jobsMap = jobs.reduce((acc, job) => {
            acc[job.id] = job;
            return acc;
          }, {});
        }
      }

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('users')
          .select('id, name, email, avatar_url')
          .in('id', userIds);
        if (users) {
          usersMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
        }
      }

      return (data || []).map(app => ({
        ...app,
        job: jobsMap[app.job_id] || null,
        user: usersMap[app.user_id] || null,
      }));
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get application by ID
   */
  async getById(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch application first, then job separately to avoid RLS recursion
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Fetch job separately
      let jobData = null;
      if (data.job_id) {
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', data.job_id)
          .single();
        
        if (!jobError && job) {
          jobData = job;
        }
      }

      return {
        ...data,
        job: jobData,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create application
   */
  async create(jobId, applicationData) {
    try {
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated. Please sign in to apply.');
      }

      // Verify job exists
      const { data: jobExists, error: jobError } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('id', jobId)
        .single();

      if (jobError || !jobExists) {
        throw new Error('Job not found. Please select a valid job.');
      }

      // Check if already applied
      const { data: existing, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is fine
        throw checkError;
      }

      if (existing) {
        throw new Error('You have already applied to this job');
      }

      // Create application directly in Supabase
      // Check which columns exist first to avoid errors
      const applicationPayload = {
        job_id: jobId,
        user_id: user.id,
        status: 'applied', // Use 'applied' instead of 'pending' to match schema
        applied_at: new Date().toISOString(),
        resume_url: applicationData.resume_url || null,
        notes: applicationData.notes || null,
      };

      // Add optional fields if they exist (only if columns exist in schema)
      if (applicationData.first_name) applicationPayload.first_name = applicationData.first_name;
      if (applicationData.last_name) applicationPayload.last_name = applicationData.last_name;
      if (applicationData.email) applicationPayload.email = applicationData.email;
      if (applicationData.phone) applicationPayload.phone = applicationData.phone;
      if (applicationData.linkedin_url) applicationPayload.linkedin_url = applicationData.linkedin_url;
      if (applicationData.portfolio_url) applicationPayload.portfolio_url = applicationData.portfolio_url;
      // Only add cover_letter if the column exists (will be added by SQL script)
      if (applicationData.cover_letter || applicationData.coverLetter) {
        applicationPayload.cover_letter = applicationData.cover_letter || applicationData.coverLetter;
      }
      if (applicationData.answers) {
        applicationPayload.answers = typeof applicationData.answers === 'string' 
          ? JSON.parse(applicationData.answers) 
          : applicationData.answers;
      }
      if (applicationData.resume_id) {
        applicationPayload.resume_id = applicationData.resume_id;
      }

      // Try backend API first (for notifications), fallback to direct Supabase
      try {
        const response = await apiService.applications.create({
          jobId,
          ...applicationData,
        });
        return response.data;
      } catch (apiError) {
        // Fallback to direct Supabase if backend is unavailable
        console.warn('Backend API unavailable, using direct Supabase:', apiError.message);
        
        const { data, error } = await supabase
          .from('applications')
          .insert([applicationPayload])
          .select()
          .single();

        if (error) {
          console.error('Application insert error:', error);
          throw error;
        }

        return data;
      }
    } catch (error) {
      console.error('Application creation error:', error);
      throw new Error(error.message || 'Application failed');
    }
  },

  /**
   * Update application status
   */
  async updateStatus(id, status, notes = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = { status };
      if (notes) updates.notes = notes;

      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete application
   */
  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Bulk delete applications
   */
  async bulkDelete(ids) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('applications')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Bulk update status
   */
  async bulkUpdateStatus(ids, status) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('applications')
        .update({ status })
        .in('id', ids)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Export applications to CSV
   */
  async exportToCSV(filters = {}) {
    try {
      const applications = await this.getAll(filters);
      
      const headers = ['Company', 'Position', 'Location', 'Status', 'Applied Date', 'Notes'];
      const rows = applications.map(app => {
        const job = app.job || {};
        return [
          job.company || '',
          job.title || '',
          job.location || '',
          app.status || '',
          app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '',
          app.notes || '',
        ];
      });

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      return csv;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get application analytics
   */
  async getAnalytics() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('applications')
        .select('status, applied_at, offer_salary')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data.length;
      const offers = data.filter(a => a.status === 'offer' || a.status === 'offer_accepted').length;
      const successRate = total > 0 ? (offers / total) * 100 : 0;

      // Calculate average response time (days between applied and status change)
      const responseTimes = data
        .filter(a => a.applied_at && a.updated_at)
        .map(a => {
          const applied = new Date(a.applied_at);
          const updated = new Date(a.updated_at);
          return Math.floor((updated - applied) / (1000 * 60 * 60 * 24));
        });

      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

      const analytics = {
        total,
        applied: data.filter(a => a.status === 'applied').length,
        screening: data.filter(a => a.status === 'screening').length,
        interview: data.filter(a => a.status === 'interview' || a.status === 'interview_completed').length,
        offer: offers,
        rejected: data.filter(a => a.status === 'rejected').length,
        withdrawn: data.filter(a => a.status === 'withdrawn').length,
        successRate: Math.round(successRate * 10) / 10,
        avgResponseTime: Math.round(avgResponseTime),
      };

      return analytics;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },
};

export default applicationService;

