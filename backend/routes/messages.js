/**
 * Messages API Routes
 * Handles bulk messaging and email sending
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in messages.js. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

/**
 * Send bulk messages to candidates
 * POST /api/messages/bulk
 */
router.post('/bulk', async (req, res) => {
  try {
    const { applications } = req.body;

    if (!applications || !Array.isArray(applications) || applications.length === 0) {
      return res.status(400).json({ error: 'Applications array is required' });
    }

    const results = [];
    const errors = [];

    for (const app of applications) {
      try {
        // Send email via email service
        const emailResult = await sendEmail({
          to: app.email,
          subject: app.subject,
          html: app.message.replace(/\n/g, '<br>'),
          text: app.message,
          template: 'custom',
          data: {
            recipientName: `${app.firstName} ${app.lastName}`,
            message: app.message,
          },
        });

        if (emailResult.success) {
          results.push({ applicationId: app.applicationId, email: app.email, success: true });
        } else {
          errors.push({ applicationId: app.applicationId, email: app.email, error: emailResult.reason || 'Failed' });
        }
      } catch (error) {
        logger.error(`Error sending message to ${app.email}:`, error);
        errors.push({ applicationId: app.applicationId, email: app.email, error: error.message });
      }
    }

    res.json({
      success: results.length > 0,
      sent: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    logger.error('Error in bulk messages:', error);
    res.status(500).json({ error: 'Failed to send bulk messages' });
  }
});

/**
 * Send single email
 * POST /api/emails/send
 */
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, text, template, data } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      template: template || 'custom',
      data: data || {},
    });

    if (result.success) {
      res.json({ success: true, messageId: result.id });
    } else {
      res.status(400).json({ error: result.reason || 'Failed to send email' });
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;









