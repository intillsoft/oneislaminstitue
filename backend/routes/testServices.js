/**
 * Service Test Routes
 * Endpoints for testing Resend (email) and Twilio (SMS/WhatsApp) integrations
 * Admin-only (protected via authenticate middleware in server.js)
 */

import express from 'express';
import { emailService } from '../services/emailService.js';
import { smsService } from '../services/smsService.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * GET /api/test-services/status
 * Returns the configuration status (keys present or not) without sending anything
 */
router.get('/status', (req, res) => {
  const resendKey = process.env.RESEND_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  res.json({
    resend: {
      configured: !!(resendKey),
      keyPreview: resendKey ? resendKey.substring(0, 8) + '...' : null,
      fromEmail: fromEmail || null,
    },
    twilio: {
      configured: !!(twilioSid && twilioToken && twilioPhone),
      accountSidPreview: twilioSid ? twilioSid.substring(0, 8) + '...' : null,
      fromPhone: twilioPhone || null,
    },
  });
});

/**
 * POST /api/test-services/email
 * Send a test email via Resend
 * Body: { to: string, subject?: string }
 */
router.post('/email', async (req, res) => {
  const { to, subject } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: 'Recipient email address (to) is required.' });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return res.status(400).json({ success: false, error: 'Invalid email address format.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ success: false, error: 'RESEND_API_KEY is not configured in the server environment.' });
  }

  try {
    const result = await emailService.send({
      to,
      subject: subject || '✅ Test Email from One Islam Institute',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 48px 40px; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin-bottom: 20px;">
              <span style="font-size: 32px;">✉️</span>
            </div>
            <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">ONE ISLAM INSTITUTE</h1>
            <p style="color: #64748b; margin-top: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em;">Service Test Confirmation</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 32px; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="width: 10px; height: 10px; background: #10b981; border-radius: 50%; margin-right: 12px; box-shadow: 0 0 8px #10b981;"></div>
              <span style="color: #10b981; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">System Operational</span>
            </div>
            <p style="color: #e2e8f0; font-size: 18px; font-weight: 600; margin: 0 0 12px;">Your Resend email integration is working!</p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.7; margin: 0;">This test email was sent successfully at <strong style="color: #cbd5e1;">${new Date().toUTCString()}</strong> via the One Islam Institute admin panel.</p>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08);">
            <p style="color: #475569; font-size: 12px; margin: 0;">© 2026 One Islam Institute · Email infrastructure powered by Resend</p>
          </div>
        </div>
      `,
      text: `One Islam Institute - Email Service Test\n\nYour Resend email integration is working!\n\nThis test was sent at ${new Date().toUTCString()}.`
    });

    logger.info(`Test email sent to ${to} by admin ${req.user?.id}`);
    res.json({ success: true, messageId: result.messageId, sentAt: new Date().toISOString() });
  } catch (error) {
    logger.error('Test email failed:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send test email.' });
  }
});

/**
 * POST /api/test-services/sms
 * Send a test SMS via Twilio
 * Body: { to: string }
 */
router.post('/sms', async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: 'Recipient phone number (to) is required.' });
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    return res.status(503).json({ success: false, error: 'Twilio is not fully configured. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.' });
  }

  try {
    const message = `[One Islam Institute] ✅ Test SMS - Your Twilio SMS integration is working correctly! Sent at ${new Date().toUTCString()}.`;
    await smsService.sendSMS(to, message);

    logger.info(`Test SMS sent to ${to} by admin ${req.user?.id}`);
    res.json({ success: true, sentAt: new Date().toISOString() });
  } catch (error) {
    logger.error('Test SMS failed:', error);
    const errorMessage = error.message || 'Failed to send test SMS.';
    // Provide helpful hint for trial accounts
    const hint = error.code === 21608
      ? 'This is a Twilio Trial Account. You must verify the destination number in your Twilio Console first.'
      : null;
    res.status(500).json({ success: false, error: errorMessage, hint });
  }
});

/**
 * POST /api/test-services/whatsapp
 * Send a test WhatsApp message via Twilio
 * Body: { to: string }
 */
router.post('/whatsapp', async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: 'Recipient phone number (to) is required.' });
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    return res.status(503).json({ success: false, error: 'Twilio is not fully configured.' });
  }

  try {
    const message = `*One Islam Institute*\n\n✅ *WhatsApp Test Successful!*\n\nYour Twilio WhatsApp integration is working correctly.\n\n_Sent at ${new Date().toUTCString()}._`;
    await smsService.sendWhatsApp(to, message);

    logger.info(`Test WhatsApp sent to ${to} by admin ${req.user?.id}`);
    res.json({ success: true, sentAt: new Date().toISOString() });
  } catch (error) {
    logger.error('Test WhatsApp failed:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send test WhatsApp message.' });
  }
});

export default router;
