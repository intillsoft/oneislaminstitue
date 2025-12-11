/**
 * Job Service
 * Service layer for job-related operations
 */

import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';
import { handleSupabaseError } from '../lib/supabase';

export const jobService = {
  /**
   * Get all jobs with filters
   */
  async getAll(filters = {}) {
    try {
      // Build query - fetch jobs first, then companies separately to avoid RLS recursion
      // Using simpler query to prevent infinite recursion in RLS policies
      // Note: RLS policies should allow everyone to view active jobs
      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' });

      // Filter by status - only show active/published jobs by default
      // Admins and recruiters can see all jobs including drafts
      // Note: RLS policies now allow everyone to view active jobs
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          // Only filter by status if user is not admin or recruiter
          if (!profile || (profile.role !== 'admin' && profile.role !== 'recruiter')) {
            // For job seekers, only show active/published jobs (or jobs with no status)
            query = query.or('status.eq.active,status.eq.published,status.is.null');
          }
          // Admins and recruiters see all jobs (no status filter)
        } else {
          // For non-authenticated users, only show active/published jobs
          query = query.or('status.eq.active,status.eq.published,status.is.null');
        }
      } catch (authError) {
        // If auth check fails, default to showing only active/published jobs
        // This allows the app to work even if auth check fails
        console.warn('Auth check failed, defaulting to active jobs only:', authError);
        query = query.or('status.eq.active,status.eq.published,status.is.null');
      }

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.employmentType) {
        query = query.eq('job_type', filters.employmentType);
      }

      if (filters.salaryMin) {
        query = query.gte('salary_min', parseFloat(filters.salaryMin));
      }

      if (filters.salaryMax) {
        query = query.lte('salary_max', parseFloat(filters.salaryMax));
      }

      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }

      if (filters.remote === true || filters.remote === 'true') {
        query = query.eq('remote', 'remote');
      }

      // Ordering
      const orderBy = filters.sortBy || 'created_at';
      const ascending = filters.sortOrder !== 'desc';
      query = query.order(orderBy, { ascending });

      // Pagination
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Job query error:', error);
        // Provide more detailed error message
        const errorMessage = error.message || 'Failed to load jobs';
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          throw new Error('You do not have permission to view jobs. Please sign in or contact support.');
        } else if (error.message?.includes('JWT')) {
          throw new Error('Authentication error. Please sign in again.');
        } else {
          throw new Error(`Failed to load jobs: ${errorMessage}`);
        }
      }

      // Fetch companies separately to avoid RLS recursion
      const companyIds = [...new Set((data || []).map(job => job.company_id).filter(Boolean))];
      let companiesMap = {};
      
      if (companyIds.length > 0) {
        const { data: companies, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .in('id', companyIds);
        
        if (!companiesError && companies) {
          companiesMap = companies.reduce((acc, company) => {
            acc[company.id] = company;
            return acc;
          }, {});
        }
      }

      // Transform data to ensure consistent structure
      const transformedData = (data || []).map(job => {
        const companyData = job.company_id ? companiesMap[job.company_id] : null;
        return {
          ...job,
          companies: companyData || null,
          company: job.company || companyData?.name || 'Unknown Company',
          logo: job.logo || companyData?.logo || null,
        };
      });

      return {
        data: transformedData,
        total: count || transformedData.length,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('Error in jobService.getAll:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get job by ID
   */
  /**
   * Get jobs created by a specific recruiter
   * Used for recruiter dashboard to show only their jobs
   */
  async getByRecruiter(recruiterId, filters = {}) {
    try {
      if (!recruiterId) {
        throw new Error('Recruiter ID is required');
      }

      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('created_by', recruiterId);

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.employmentType) {
        query = query.eq('job_type', filters.employmentType);
      }

      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.industry) {
        query = query.ilike('industry', `%${filters.industry}%`);
      }

      // Pagination
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Fetch company separately to avoid RLS recursion
      let companyData = null;
      if (data.company_id) {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', data.company_id)
          .single();
        
        if (!companyError && company) {
          companyData = company;
        }
      }
      
      // Transform data for consistency
      return {
        ...data,
        companies: companyData || null,
        company: data.company || companyData?.name || 'Unknown Company',
        logo: data.logo || companyData?.logo || null,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Search jobs using API (for AI-powered search)
   */
  async search(query, filters = {}) {
    try {
      const response = await apiService.jobs.search(query, filters);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },

  /**
   * Apply to job
   */
  async apply(jobId, applicationData) {
    try {
      const response = await apiService.jobs.apply(jobId, applicationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Application failed');
    }
  },

  /**
   * Save job
   */
  async saveJob(jobId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
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
   * Unsave job
   */
  async unsaveJob(jobId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get saved jobs
   */
  async getSavedJobs() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch saved_jobs first, then jobs separately to avoid RLS recursion
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      // Fetch jobs separately
      const jobIds = [...new Set((data || []).map(sj => sj.job_id).filter(Boolean))];
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

      // Fetch companies separately
      const companyIds = [...new Set(Object.values(jobsMap).map(job => job.company_id).filter(Boolean))];
      let companiesMap = {};
      
      if (companyIds.length > 0) {
        const { data: companies, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .in('id', companyIds);
        
        if (!companiesError && companies) {
          companiesMap = companies.reduce((acc, company) => {
            acc[company.id] = company;
            return acc;
          }, {});
        }
      }

      // Combine saved_jobs with jobs and companies
      return (data || []).map(savedJob => {
        const job = jobsMap[savedJob.job_id] || null;
        const company = job?.company_id ? companiesMap[job.company_id] : null;
        
        return {
          ...savedJob,
          job: job ? {
            ...job,
            companies: company || null,
            company: job.company || company?.name || 'Unknown Company',
            logo: job.logo || company?.logo || null,
          } : null,
        };
      });
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },
};

export default jobService;

