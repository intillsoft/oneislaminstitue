/**
 * Course Service
 * Service layer for academic course operations
 */

import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';
import { handleSupabaseError } from '../lib/supabase';

const TABLE_COURSES = 'jobs'; // Legacy table mapping
const TABLE_COMPANIES = 'companies'; // Maps to Departments/Faculties

export const courseService = {
  /**
   * Get all courses with filters
   */
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from(TABLE_COURSES)
        .select('*', { count: 'exact' });

      // Filter by status - only show active/published jobs by default
      // Admins and recruiters can see all jobs including drafts
      // Note: RLS policies now allow everyone to view active jobs
      // Use provided role from filters or fallback
      const userRole = filters.role;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let isAdminOrInstructor = (userRole === 'admin' || userRole === 'instructor');
        
        if (!isAdminOrInstructor && user) {
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (profile && (profile.role === 'admin' || profile.role === 'instructor')) {
            isAdminOrInstructor = true;
          }
        }

        if (!isAdminOrInstructor) {
          // Public and students only see live content
          query = query.or('status.eq.published,status.eq.active,status.is.null');
        }
      } catch (authError) {
        // Fallback for non-auth environments or errors
        query = query.or('status.eq.published,status.eq.active,status.is.null');
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

      if (filters.instructorId) {
        query = query.eq('created_by', filters.instructorId);
      }

      if (filters.createdBy) {
        query = query.eq('created_by', filters.createdBy);
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
        console.error('Course query error:', error);
        // Provide more detailed error message
        const errorMessage = error.message || 'Failed to load courses';
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          throw new Error('You do not have permission to view courses. Please sign in or contact support.');
        } else if (error.message?.includes('JWT')) {
          throw new Error('Authentication error. Please sign in again.');
        } else {
          throw new Error(`Failed to load courses: ${errorMessage}`);
        }
      }

      // Fetch departments separately to avoid RLS recursion
      const departmentIds = [...new Set((data || []).map(course => course.company_id).filter(Boolean))];
      let departmentsMap = {};
      
      if (departmentIds.length > 0) {
        const { data: departments, error: deptsError } = await supabase
          .from(TABLE_COMPANIES)
          .select('*')
          .in('id', departmentIds);
        
        if (!deptsError && departments) {
          departmentsMap = departments.reduce((acc, dept) => {
            acc[dept.id] = dept;
            return acc;
          }, {});
        }
      }

      // Transform data to ensure consistent structure
      const transformedData = (data || []).map(course => {
        const deptData = course.company_id ? departmentsMap[course.company_id] : null;
        return {
          ...course,
          department: deptData || null,
          company: course.company || deptData?.name || 'Unknown Curator Team',
          logo: course.logo || deptData?.logo || null,
        };
      });

      return {
        data: transformedData,
        total: count || transformedData.length,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('Error in courseService.getAll:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get job by ID
   */
  /**
   * Get courses created by a specific instructor
   * Used for instructor dashboard to show only their courses
   */
  async getByInstructor(instructorId, filters = {}) {
    try {
      if (!instructorId) {
        throw new Error('Instructor ID is required');
      }

      let query = supabase
        .from(TABLE_COURSES)
        .select('*', { count: 'exact' })
        .eq('created_by', instructorId);
        
      // ... same filter logic ...
      const { data, error, count } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return { data: data || [], count: count || 0 };
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
        company: data.company || companyData?.name || 'Unknown Curator Team',
        logo: data.logo || companyData?.logo || null,
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Search courses using API (for AI-powered search)
   */
  async search(query, filters = {}) {
    try {
      const response = await apiService.courses.search(query, filters);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Academic search failed');
    }
  },

  async enroll(courseId, enrollmentData) {
    try {
      const response = await apiService.courses.enroll(courseId, enrollmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Enrollment failed');
    }
  },

  async toggleCourseStatus(courseId, currentStatus) {
    try {
      const newStatus = (currentStatus === 'active' || currentStatus === 'published') ? 'draft' : 'active';
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  async saveCourse(courseId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_courses')
        .insert([{ user_id: user.id, course_id: courseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  async unsaveCourse(courseId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_courses')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },
  async getSavedCourses() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_courses')
        .select(`
          *,
          job:jobs!saved_courses_course_id_fkey(*)
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      // Fetch companies for the jobs separately to avoid RLS recursion
      const companyIds = [...new Set((data || []).map(item => item.job?.company_id).filter(Boolean))];
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

      return (data || []).map(item => {
        const job = item.job;
        const company = job?.company_id ? companiesMap[job.company_id] : null;
        const transformedJob = job ? {
          ...job,
          companies: company || null,
          company: job.company || company?.name || 'Unknown Curator Team',
          logo: job.logo || company?.logo || null,
        } : null;

        return {
          ...item,
          course: transformedJob,
          job: transformedJob, // Legacy
        };
      });
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Legacy Aliases
  saveJob(id) { return this.saveCourse(id); },
  unsaveJob(id) { return this.unsaveCourse(id); },
  getSavedJobs() { return this.getSavedCourses(); },
};

// Export jobService as a legacy alias to prevent SyntaxErrors during migration
export const jobService = courseService;
export default courseService;
