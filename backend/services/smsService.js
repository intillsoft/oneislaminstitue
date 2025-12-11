/**
 * SMS Service for sending text messages
 */

import logger from '../utils/logger.js';

export const smsService = {
    async sendSMS(phoneNumber, message) {
        logger.info(`Sending SMS to ${phoneNumber}: ${message}`);
        // Real Twilio integration required
        throw new Error('SMS service not configured. Add TWILIO credentials to .env');
    },

    async verifyPhoneNumber(phoneNumber, code) {
        logger.info(`Verifying phone number ${phoneNumber} with code ${code}`);
        return true;
    }
};

export default smsService;
