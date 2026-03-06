import { supabase } from '../lib/supabase';

export const courseService = {

  // ============================
  // COURSES
  // ============================

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting courses:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async getById(courseId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', courseId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting course by id:', error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(courseData)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating course:', error);
      return { success: false, error: error.message };
    }
  },

  async update(courseId, updates) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', courseId)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating course:', error);
      return { success: false, error: error.message };
    }
  },

  async delete(courseId) {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', courseId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting course:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================
  // MODULES  (course_modules)
  // ============================

  async getModules(courseId) {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*, lessons:course_lessons(*)')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const modules = (data || []).map(mod => ({
        ...mod,
        lessons: (mod.lessons || []).sort((a, b) => a.sort_order - b.sort_order),
      }));

      return { success: true, data: modules };
    } catch (error) {
      console.error('Error getting modules:', error);
      return { success: false, error: error.message };
    }
  },

  async createModule(courseId, title, description = '') {
    try {
      const { data: existing } = await supabase
        .from('course_modules')
        .select('sort_order')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

      const { data, error } = await supabase
        .from('course_modules')
        .insert({ course_id: courseId, title, description, sort_order: nextOrder })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: { ...data, lessons: [] } };
    } catch (error) {
      console.error('Error creating module:', error);
      return { success: false, error: error.message };
    }
  },

  async updateModule(moduleId, updates) {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .update(updates)
        .eq('id', moduleId)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating module:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteModule(moduleId) {
    try {
      // cascade deletes lessons via FK
      const { error } = await supabase.from('course_modules').delete().eq('id', moduleId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting module:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================
  // LESSONS  (course_lessons)
  // ============================

  async getLessons(moduleId) {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting lessons:', error);
      return { success: false, error: error.message };
    }
  },

  async createLesson(moduleId, courseId, lessonData = {}) {
    try {
      const { data: existing } = await supabase
        .from('course_lessons')
        .select('sort_order')
        .eq('module_id', moduleId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

      const payload = {
        module_id: moduleId,
        course_id: courseId,
        title: lessonData.title || 'New Lesson',
        sort_order: nextOrder,
        content_type: lessonData.content_type || 'text',
        is_published: lessonData.is_published ?? true,
        duration_minutes: lessonData.duration_minutes || 15,
        xp_reward: lessonData.xp_reward || 10,
        content_blocks: lessonData.content_blocks || [],
        ...lessonData,
      };

      const { data, error } = await supabase
        .from('course_lessons')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating lesson:', error);
      return { success: false, error: error.message };
    }
  },

  async updateLesson(lessonId, updates) {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .update(updates)
        .eq('id', lessonId)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating lesson:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteLesson(lessonId) {
    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return { success: false, error: error.message };
    }
  },

  async getLessonById(lessonId) {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting lesson by id:', error);
      return null;
    }
  },

  // ============================
  // ENROLLMENTS  (applications)
  // ============================

  async enroll(courseId, userId) {
    try {
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) return { success: true, data: existing, alreadyEnrolled: true };

      const { data, error } = await supabase
        .from('applications')
        .insert({ course_id: courseId, job_id: courseId, user_id: userId, status: 'enrolled' })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error enrolling:', error);
      return { success: false, error: error.message };
    }
  },

  async isEnrolled(courseId, userId) {
    try {
      const { data } = await supabase
        .from('applications')
        .select('id')
        .or(`course_id.eq.${courseId},job_id.eq.${courseId}`)
        .eq('user_id', userId)
        .maybeSingle();
      return !!data;
    } catch {
      return false;
    }
  },

  // ============================
  // COMPLETION / PROGRESS
  // ============================

  async getTotalLessons(courseId) {
    try {
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', courseId);

      if (!modules?.length) return 0;

      const moduleIds = modules.map(m => m.id);
      const { count } = await supabase
        .from('course_lessons')
        .select('*', { count: 'exact', head: true })
        .in('module_id', moduleIds);

      return count || 0;
    } catch (error) {
      console.error('Error getting total lessons:', error);
      return 0;
    }
  },
};

export default courseService;
