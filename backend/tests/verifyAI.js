import { calculateJobMatch } from '../services/jobMatching.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function testMatch() {
    console.log('Testing Job Match...');
    try {
        // We'll just test the function call itself with fake/real IDs if possible
        // But since we fixed the ReferenceError, the main thing is it shouldn't crash on 'aiProvider'

        // This will likely fail with "Resume or job not found" but that's a GOOD thing (it means it got past the ReferenceError)
        const result = await calculateJobMatch('fake-id', 'fake-id');
        console.log('Result:', result);
    } catch (error) {
        console.log('Expected failure or success:', error.message);
        if (error.message.includes('aiProvider is not defined')) {
            console.error('FAILED: ReferenceError still exists!');
            process.exit(1);
        } else {
            console.log('PASSED: ReferenceError is gone.');
        }
    }
}

testMatch();
