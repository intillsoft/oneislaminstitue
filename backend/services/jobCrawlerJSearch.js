/**
 * Job Crawler Service using JSearch API
 */

import logger from '../utils/logger.js';

export const jobCrawlerService = {
    async searchJobs(query, options = {}) {
        logger.info(`Searching for jobs: ${query}`, options);
        // Placeholder implementation
        return [];
    },

    async getJobDetails(jobId) {
        logger.info(`Getting job details: ${jobId}`);
        return null;
    }
};

export default jobCrawlerService;
