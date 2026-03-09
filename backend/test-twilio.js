
import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// CHANGE THIS to your personal phone number (with country code, e.g., +1234567890)
const TO_PHONE_NUMBER = '+233 59 343 4679'; 

async function testTwilio() {
    console.log('--- Twilio Integration Test ---');
    console.log('Account SID:', accountSid ? 'FOUND' : 'MISSING');
    console.log('Auth Token:', authToken ? 'FOUND' : 'MISSING');
    console.log('From Phone:', fromPhoneNumber);

    if (!accountSid || !authToken || !fromPhoneNumber) {
        console.error('Error: missing Twilio configuration in .env');
        return;
    }

    if (TO_PHONE_NUMBER === '+00000000000') {
        console.warn('Warning: TO_PHONE_NUMBER is not set. Please edit this file and add your phone number.');
        return;
    }

    const client = twilio(accountSid, authToken);

    try {
        console.log(`Sending test SMS to ${TO_PHONE_NUMBER}...`);
        const message = await client.messages.create({
            body: 'Hello from One Islam Institute! Your Twilio integration is working successfully.',
            from: fromPhoneNumber,
            to: TO_PHONE_NUMBER
        });
        
        console.log('SUCCESS! Message SID:', message.sid);
        console.log('Status:', message.status);
    } catch (error) {
        console.error('FAILED to send SMS:', error.message);
        if (error.code === 21608) {
            console.error('Note: This usually means you are using a Trial Account and the "To" number is not verified in your Twilio Console.');
        }
    }
}

testTwilio();
