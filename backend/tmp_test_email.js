import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

async function testEmail() {
    console.log('Using API Key:', process.env.RESEND_API_KEY?.substring(0, 5) + '...');
    console.log('From Email:', FROM_EMAIL);
    
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ['yussifabduljalil603@gmail.com'],
            subject: 'Test Email from Antigravity',
            html: '<strong>Success!</strong> Your email system is working.'
        });

        if (error) {
            console.error('RESEND ERROR:', error);
        } else {
            console.log('RESEND SUCCESS:', data);
        }
    } catch (err) {
        console.error('CATCH ERROR:', err);
    }
}

testEmail();
