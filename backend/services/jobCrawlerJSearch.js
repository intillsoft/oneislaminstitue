import axios from 'axios';
import logger from '../utils/logger.js';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Helper for retrying API calls with exponential backoff
const withRetry = async (fn, retries = 3, delay = 2000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0 && (error.response?.status === 429 || error.message?.includes('429'))) {
            logger.warn(`Rate limit hit (429). Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const jobCrawlerService = {
    async searchJobs(query, options = {}) {
        const { location = 'United States', page = 1, limit = 10 } = options;
        logger.info(`Searching for jobs on JSearch: ${query} in ${location}`, options);

        if (!RAPIDAPI_KEY) {
            logger.warn('RAPIDAPI_KEY not found, JSearch crawl will fail');
            return [];
        }

        try {
            const response = await withRetry(() => axios.get('https://jsearch.p.rapidapi.com/search', {
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                },
                params: {
                    query: `${query} in ${location}`,
                    page: page,
                    num_pages: Math.ceil(limit / 10)
                },
                timeout: 30000
            }));

            if (response.data && response.data.data) {
                return response.data.data.map(job => ({
                    title: job.job_title,
                    company: job.employer_name,
                    location: `${job.job_city || ''} ${job.job_state || ''} ${job.job_country || ''}`.trim(),
                    description: job.job_description,
                    source: (job.job_publisher && !job.job_publisher.toLowerCase().includes('jsearch'))
                        ? job.job_publisher
                        : 'External Site',
                    url: job.job_apply_link || job.job_google_link,
                    salary: job.job_salary_period ? `${job.job_min_salary || ''}-${job.job_max_salary || ''} ${job.job_salary_currency || ''}` : null,
                    salary_min: job.job_min_salary,
                    salary_max: job.job_max_salary,
                    job_type: mapJobType(job.job_employment_type),
                    experience_level: null, // JSearch doesn't provide this directly in a clear field
                    remote: job.job_is_remote ? 'remote' : 'on-site',
                    scraped_at: new Date().toISOString(),
                }));
            }
            return [];
        } catch (error) {
            logger.error('JSearch API error:', error.message);
            return [];
        }
    },

    async getJobDetails(jobId) {
        logger.info(`Getting job details from JSearch: ${jobId}`);
        if (!RAPIDAPI_KEY) return null;

        try {
            const response = await axios.get('https://jsearch.p.rapidapi.com/job-details', {
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                },
                params: { job_id: jobId },
                timeout: 30000
            });

            return response.data?.data?.[0] || null;
        } catch (error) {
            logger.error('JSearch Details API error:', error.message);
            return null;
        }
    }
};

/**
 * Helper: Map job type to standard format
 */
function mapJobType(type) {
    if (!type) return 'full-time';
    const lower = type.toLowerCase();
    if (lower.includes('full') || lower === 'fulltime') return 'full-time';
    if (lower.includes('part') || lower === 'parttime') return 'part-time';
    if (lower.includes('contract')) return 'contract';
    if (lower.includes('freelance')) return 'freelance';
    if (lower.includes('intern')) return 'internship';
    return 'full-time';
}

export default jobCrawlerService;
