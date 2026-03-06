/**
 * Enrollment Service (Simplified)
 * Handles course enrollments via the 'applications' table.
 */
import { supabase } from '../lib/supabase';
import { progressService } from './progressService';

const TABLE_ENROLLMENTS = 'applications';

export const enrollmentService = {
  /**
   * Get all enrollments for current scholar
   */
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from(TABLE_ENROLLMENTS)
        .select(`
          *,
          course:jobs!course_id(*),
          job:jobs!course_id(*)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Enrollment fetch error:', error);
      return [];
    }
  },

  /**
   * Enroll in a course
   */
  async create(courseId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sign in required');

      // 1. Check if already enrolled
      const { data: existing } = await supabase
        .from(TABLE_ENROLLMENTS)
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existing) return { status: 'already_enrolled' };

      // 2. Create enrollment
      const { data, error } = await supabase
        .from(TABLE_ENROLLMENTS)
        .insert([{
          user_id: user.id,
          course_id: courseId,
          job_id: courseId, // Compatibility
          status: 'enrolled',
          applied_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // 3. Initialize progress (no lesson yet, just create baseline record)
      await progressService.logActivity(courseId, 0, null, 0, null);

      return data;
    } catch (error) {
      console.error('Enrollment creation error:', error);
      throw error;
    }
  },

  /**
   * Delete application
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from(TABLE_ENROLLMENTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Enrollment deletion error:', error);
      return false;
    }
  },

  /**
   * Get enrollment analytics for current user
   */
  async getAnalytics() {
    try {
      const enrollments = await this.getAll();
      const progress = await progressService.getAll();
      
      const completedCount = progress.filter(p => p.status === 'completed').length;
      const inProgressCount = enrollments.length - completedCount;

      return {
        total: enrollments.length,
        active: inProgressCount,
        completed: completedCount,
        // Legacy mappings for dashboard metrics
        interview: inProgressCount, // Mapping 'active' to 'assessments'
        offer: completedCount      // Mapping 'completed' to 'certificates'
      };
    } catch (error) {
      console.error('Analytics error:', error);
      return { total: 0, active: 0, completed: 0, interview: 0, offer: 0 };
    }
  },

  /**
   * Get all enrollments for courses created by the instructor
   */
  async getAllForInstructor() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // 1. Get instructor's courses
      const { data: courses } = await supabase
        .from('jobs')
        .select('id')
        .eq('created_by', user.id);
      
      if (!courses || courses.length === 0) return [];
      const courseIds = courses.map(c => c.id);

      // 2. Get enrollments for those courses
      const { data, error } = await supabase
        .from(TABLE_ENROLLMENTS)
        .select(`
          *,
          user:users(id, full_name, role, email, avatar_url),
          course:jobs!course_id(id, title),
          job:jobs!course_id(id, title)
        `)
        .in('course_id', courseIds)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Instructor enrollment fetch error:', error);
      return [];
    }
  },

  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from(TABLE_ENROLLMENTS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Status update error:', error);
      throw error;
    }
  },

  /**
   * Alias for instructor/recruiter parity
   */
  async getAllForRecruiter() {
    return this.getAllForInstructor();
  }
};

// Aliases
export const applicationService = enrollmentService;
export default enrollmentService;
