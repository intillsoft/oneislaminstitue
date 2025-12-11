/**
 * Resume Service
 * Service layer for resume operations
 */

import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';
import { handleSupabaseError } from '../lib/supabase';

export const resumeService = {
  /**
   * Get all resumes for current user
   */
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get resume by ID
   */
  async getById(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create resume
   */
  async create(resumeData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: resumeData.title,
          content_json: resumeData.content,
          is_default: resumeData.isDefault || false,
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
   * Update resume
   */
  async update(id, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
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
   * Delete resume
   */
  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('resumes')
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
   * Set default resume
   */
  async setDefault(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First, unset all defaults
      await supabase
        .from('resumes')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set this one as default
      const { data, error } = await supabase
        .from('resumes')
        .update({ is_default: true })
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
   * Generate resume with AI
   */
  async generateAI(userInput) {
    try {
      const response = await apiService.ai.generateResume(userInput);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'AI generation failed');
    }
  },

  /**
   * Export resume
   */
  async export(id, format = 'html') {
    try {
      const response = await apiService.resumes.export(id, format);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Export failed');
    }
  },
};

export default resumeService;

