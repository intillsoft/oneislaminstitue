import jobCrawler from '../services/jobCrawler.js';
const { crawlLinkedInJobs } = jobCrawler;
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: './backend/.env' });
if (!process.env.RAPIDAPI_KEY) {
    dotenv.config({ path: '.env' });
}

// Mock axios to trigger a 403
const originalGet = axios.get;

async function testCrawlerFallback() {
    console.log('Testing Crawler 403 Fallback...');

    // Setup mock
    axios.get = async (url, config) => {
        if (url.includes('linkedin-jobs-search.p.rapidapi.com')) {
            console.log('--- Mocking 403 for LinkedIn ---');
            const error = new Error('Forbidden');
            error.response = { status: 403 };
            throw error;
        }
        return originalGet(url, config);
    };

    try {
        const jobs = await crawlLinkedInJobs('software engineer', 'New York', 5);
        console.log(`Found ${jobs.length} jobs via fallback!`);

        if (jobs.length > 0 && jobs[0].source === 'jsearch') {
            console.log('PASSED: Fallback to JSearch successful.');
        } else if (jobs.length === 0) {
            console.warn('WARNING: No jobs found, but it might be due to empty JSearch results or no RAPIDAPI_KEY.');
        } else {
            console.error('FAILED: Source is not jsearch.');
        }
    } catch (error) {
        console.error('FAILED: Crawler crashed instead of falling back:', error.message);
    } finally {
        axios.get = originalGet;
    }
}

testCrawlerFallback();
