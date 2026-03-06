import { Resend } from 'resend';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Workflow <noreply@workflow.surf>';

export const emailService = {
  /**
   * Send email
   */
  async send({ to, subject, html, text }) {
    try {
      if (!process.env.RESEND_API_KEY) {
        logger.warn('RESEND_API_KEY not found, skipping email send');
        return { success: false, error: 'API Key missing' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
        text: text
      });

      if (error) {
        logger.error('Resend error:', error);
        throw error;
      }

      logger.info('Email sent successfully via Resend:', { to, subject, id: data.id });
      return { success: true, messageId: data.id };
    } catch (error) {
      logger.error('Error sending email via Resend:', error);
      throw error;
    }
  },
};

// Export sendEmail as a standalone function for convenience
export const sendEmail = emailService.send.bind(emailService);

export default emailService;
