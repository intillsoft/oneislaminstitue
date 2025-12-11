/**
 * Usage Tracking Service
 * Tracks feature usage for subscription limits
 */

import logger from '../utils/logger.js';

/**
 * Get current usage count for a feature
 */
export async function getUsageCount(supabase, userId, feature) {
  try {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { data, error } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .gte('period_start', periodStart.toISOString())
      .lt('period_end', periodEnd.toISOString())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      logger.error('Error getting usage count:', error);
      return 0;
    }

    return data?.count || 0;
  } catch (error) {
    logger.error('Error getting usage count:', error);
    return 0;
  }
}

/**
 * Increment usage count
 */
export async function incrementUsage(supabase, userId, feature, amount = 1) {
  try {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Try to update existing record
    const { data: existing } = await supabase
      .from('usage_tracking')
      .select('id, count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .gte('period_start', periodStart.toISOString())
      .lt('period_end', periodEnd.toISOString())
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('usage_tracking')
        .update({
          count: existing.count + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase
        .from('usage_tracking')
        .insert({
          user_id: userId,
          feature,
          count: amount,
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
        });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    logger.error('Error incrementing usage:', error);
    throw error;
  }
}

/**
 * Reset usage for a new period (called monthly)
 */
export async function resetUsage(supabase, userId, feature) {
  try {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { error } = await supabase
      .from('usage_tracking')
      .update({
        count: 0,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('feature', feature);

    if (error) throw error;
    return true;
  } catch (error) {
    logger.error('Error resetting usage:', error);
    throw error;
  }
}

/**
 * Get all usage stats for a user
 */
export async function getUserUsageStats(supabase, userId) {
  try {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { data, error } = await supabase
      .from('usage_tracking')
      .select('feature, count')
      .eq('user_id', userId)
      .gte('period_start', periodStart.toISOString())
      .lt('period_end', periodEnd.toISOString());

    if (error) throw error;

    const stats = {};
    data.forEach((record) => {
      stats[record.feature] = record.count;
    });

    return stats;
  } catch (error) {
    logger.error('Error getting usage stats:', error);
    return {};
  }
}

export default {
  getUsageCount,
  incrementUsage,
  resetUsage,
  getUserUsageStats,
};

