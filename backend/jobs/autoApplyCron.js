/**
 * Autopilot Cron Job (Enhanced)
 * Continuously checks for new jobs and automatically applies
 * Runs every 5 minutes by default, or based on user-defined intervals
 */

import cron from 'node-cron';
import { autoApplyService } from '../services/autoApplyService.js';
import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * Process autopilot for all enabled users
 * Enhanced to check continuously and apply immediately when matches are found
 */
async function processAllAutoApplies() {
  try {
    logger.info('🚀 Starting Autopilot check...');

    // Get all users with autopilot enabled
    const { data: users, error } = await supabase
      .from('auto_apply_settings')
      .select('user_id, check_interval_minutes, last_check_at')
      .eq('enabled', true);

    if (error) {
      logger.error('Error fetching users with autopilot enabled:', error);
      return;
    }

    if (!users || users.length === 0) {
      logger.info('No users with autopilot enabled');
      return;
    }

    logger.info(`🔍 Checking ${users.length} users for new job matches...`);

    // Process each user (in parallel for efficiency)
    const results = await Promise.allSettled(
      users.map(async (user) => {
        try {
          const result = await autoApplyService.processAutoApply(user.user_id);
          if (result.applied > 0) {
            logger.info(`✅ User ${user.user_id}: Applied to ${result.applied} jobs`);
          }
          return result;
        } catch (error) {
          logger.error(`❌ Error processing autopilot for user ${user.user_id}:`, error);
          throw error;
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const totalApplied = results
      .filter(r => r.status === 'fulfilled' && r.value?.applied)
      .reduce((sum, r) => sum + (r.value.applied || 0), 0);

    logger.info(`✨ Autopilot check completed: ${successful} users processed, ${failed} failed, ${totalApplied} total applications sent`);
  } catch (error) {
    logger.error('Error in autopilot cron job:', error);
  }
}

/**
 * Start the enhanced cron job
 * Runs every 5 minutes by default for continuous checking
 * This ensures Autopilot is always checking for new jobs
 */
export function startAutoApplyCron(schedule = '*/5 * * * *') {
  logger.info(`🚀 Starting Enhanced Autopilot with schedule: ${schedule} (every 5 minutes)`);
  logger.info('💡 Autopilot will continuously check for new jobs and apply automatically');

  // Run every 5 minutes by default for continuous checking
  cron.schedule(schedule, async () => {
    await processAllAutoApplies();
  });

  // Run immediately on startup to start checking right away
  logger.info('🔄 Running initial Autopilot check...');
  setTimeout(() => processAllAutoApplies(), 3000); // Wait 3 seconds for server to fully start
}

// End of file
