/**
 * Email Preferences API Routes
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in email.js. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

/**
 * Get email preferences
 */
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    logger.error('Error getting email preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update email preference
 */
router.put('/preferences/:emailType', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { emailType } = req.params;
    const { enabled } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('email_preferences')
      .upsert({
        user_id: userId,
        email_type: emailType,
        enabled: enabled !== false,
      }, {
        onConflict: 'user_id,email_type',
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    logger.error('Error updating email preference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Unsubscribe from all emails
 */
router.post('/unsubscribe', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Disable all email types
    const emailTypes = [
      'welcome',
      'password-reset',
      'email-verification',
      'application-confirmation',
      'weekly-recommendations',
      'interview-reminder',
      'subscription-activated',
      'subscription-canceled',
      'payment-confirmation',
      'payment-failed',
      'trial-ending',
      'subscription-renewal',
    ];

    const updates = emailTypes.map(type => ({
      user_id: userId,
      email_type: type,
      enabled: false,
    }));

    const { error } = await supabase
      .from('email_preferences')
      .upsert(updates, {
        onConflict: 'user_id,email_type',
      });

    if (error) throw error;

    res.json({ success: true, message: 'Unsubscribed from all emails' });
  } catch (error) {
    logger.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

