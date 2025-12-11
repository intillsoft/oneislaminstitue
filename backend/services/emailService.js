/**
 * Email Service
 * Handles email sending via SendGrid, Mailgun, or AWS SES
 */

import logger from '../utils/logger.js';

// TODO: Integrate with email service (SendGrid, Mailgun, or AWS SES)
// For now, this is a placeholder that logs emails

export const emailService = {
  /**
   * Send email
   */
  async send({ to, subject, html, text }) {
    try {
      // TODO: Implement actual email sending
      // Example with SendGrid:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send({ to, from: process.env.FROM_EMAIL, subject, html, text });

      // For now, just log
      logger.info('Email sent:', { to, subject });
      
      return { success: true, messageId: `mock-${Date.now()}` };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  },
};

// Export sendEmail as a standalone function for convenience
export const sendEmail = emailService.send.bind(emailService);

export default emailService;
