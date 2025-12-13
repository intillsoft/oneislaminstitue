/**
 * PRODUCTION-READY Resume Service
 * Handles all resume operations with proper error handling
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
      console.error('Get all resumes error:', error);
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
      console.error('Get resume by ID error:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get public resume by ID (no auth required if visibility is public)
   */
  async getPublicById(id) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('visibility', 'public')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get public resume error:', error);
      throw new Error('Resume not found or private');
    }
  },

  /**
   * Create resume - FIXED to properly save content
   */
  async create(resumeData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Creating resume with data:', resumeData);

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: resumeData.title || 'My Resume',
          content_json: resumeData.content || resumeData, // Handle both formats
          template: resumeData.template || 'professional',
          ats_score: resumeData.atsScore || null,
          is_default: resumeData.isDefault || false,
          is_draft: resumeData.isDraft !== undefined ? resumeData.isDraft : true,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Resume created successfully:', data);
      return data;
    } catch (error) {
      console.error('Create resume error:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update resume - FIXED to handle all fields
   */
  async update(id, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Updating resume:', id, updates);

      const updateData = {
        title: updates.title,
        content_json: updates.content_json || updates.content,
        template: updates.template,
        ats_score: updates.atsScore || updates.ats_score,
        is_draft: updates.isDraft !== undefined ? updates.isDraft : updates.is_draft,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
      );

      const { data, error } = await supabase
        .from('resumes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Resume updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Update resume error:', error);
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
      console.error('Delete resume error:', error);
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
      console.error('Set default resume error:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Generate resume with AI - IMPROVED
   */
  async generateAI(userInput) {
    try {
      const response = await apiService.ai.generateResume(userInput);
      return response.data;
    } catch (error) {
      console.error('AI generation error:', error);
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
      console.error('Export error:', error);
      throw new Error(error.response?.data?.message || 'Export failed');
    }
  },
};

export default resumeService;
