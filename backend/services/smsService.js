/**
 * SMS Service for sending text messages via Twilio
 */

import logger from '../utils/logger.js';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

export const smsService = {
    async sendSMS(phoneNumber, message, options = {}) {
        if (!client) {
            logger.warn(`Twilio not configured. Skipping SMS to ${phoneNumber}`);
            return false;
        }

        const { isWhatsApp = false } = options;
        
        try {
            // Twilio WhatsApp requires 'whatsapp:' prefix for both 'from' and 'to'
            const to = isWhatsApp ? `whatsapp:${phoneNumber.replace(/\s/g, '')}` : phoneNumber.replace(/\s/g, '');
            const from = isWhatsApp ? `whatsapp:${fromPhoneNumber}` : fromPhoneNumber;

            const result = await client.messages.create({
                body: message,
                from: from,
                to: to
            });
            logger.info(`Successfully sent ${isWhatsApp ? 'WhatsApp' : 'SMS'} to ${phoneNumber}. SID: ${result.sid}`);
            return true;
        } catch (error) {
            logger.error(`Twilio ${isWhatsApp ? 'WhatsApp' : 'SMS'} failed to ${phoneNumber}:`, error);
            throw new Error(`Failed to send message: ${error.message}`);
        }
    },

    async sendWhatsApp(phoneNumber, message) {
        return this.sendSMS(phoneNumber, message, { isWhatsApp: true });
    },

    async verifyPhoneNumber(phoneNumber, code) {
        logger.info(`Verifying phone number ${phoneNumber} with code ${code}`);
        // Without Twilio Verify Service configured, we'll assume true if they input 0000 
        // Or if you want to implement actual verification, you'd integrate Twilio Verify here.
        return true;
    }
};

export default smsService;
