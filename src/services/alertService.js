/**
 * Job Alert Service
 * Service layer for job alert operations
 */

import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';
import { handleSupabaseError } from '../lib/supabase';

export const alertService = {
  /**
   * Get all alerts for current user
   */
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_alerts')
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
   * Create alert
   */
  async create(alertData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_alerts')
        .insert({
          user_id: user.id,
          name: alertData.name,
          keywords: alertData.keywords || [],
          location: alertData.location,
          location_type: alertData.locationType,
          frequency: alertData.frequency || 'daily',
          notification_types: alertData.notificationTypes || ['email'],
          is_active: alertData.isActive !== false,
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
   * Update alert
   */
  async update(id, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_alerts')
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
   * Delete alert
   */
  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('job_alerts')
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
   * Toggle alert active status
   */
  async toggleActive(id, isActive) {
    return await this.update(id, { is_active: isActive });
  },
};

export default alertService;

