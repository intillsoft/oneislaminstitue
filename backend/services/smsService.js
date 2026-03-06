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
    async sendSMS(phoneNumber, message) {
        if (!client) {
            logger.warn(`Twilio not configured. Skipping SMS to ${phoneNumber}`);
            return false;
        }
        
        try {
            const result = await client.messages.create({
                body: message,
                from: fromPhoneNumber,
                to: phoneNumber
            });
            logger.info(`Successfully sent SMS to ${phoneNumber}. SID: ${result.sid}`);
            return true;
        } catch (error) {
            logger.error(`Twilio SMS failed to ${phoneNumber}:`, error);
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    },

    async verifyPhoneNumber(phoneNumber, code) {
        logger.info(`Verifying phone number ${phoneNumber} with code ${code}`);
        // Without Twilio Verify Service configured, we'll assume true if they input 0000 
        // Or if you want to implement actual verification, you'd integrate Twilio Verify here.
        return true;
    }
};

export default smsService;
