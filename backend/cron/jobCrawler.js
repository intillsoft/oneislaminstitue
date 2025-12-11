/**
 * Cron Job for Automatic Job Crawling
 * Run this periodically to crawl jobs from external sources
 */

import cron from 'node-cron';
import jobCrawlerService from '../services/jobCrawler.js';
import logger from '../utils/logger.js';

/**
 * Schedule job crawling every 5 minutes
 * Format: minute hour day month day-of-week
 * '*/5 * * * * ' = every 5 minutes
  */
export function startJobCrawlerCron() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Starting scheduled job crawl...');
    try {
      const result = await jobCrawlerService.scheduleJobCrawl();
      logger.info('Scheduled job crawl completed:', result);
    } catch (error) {
      logger.error('Scheduled job crawl failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'America/New_York'
  });

  logger.info('Job crawler cron job scheduled (every 5 minutes)');
}

/**
 * Schedule job crawling daily at 2 AM
 */
export function startDailyJobCrawlerCron() {
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting daily job crawl...');
    try {
      const result = await jobCrawlerService.scheduleJobCrawl();
      logger.info('Daily job crawl completed:', result);
    } catch (error) {
      logger.error('Daily job crawl failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'America/New_York'
  });

  logger.info('Daily job crawler cron job scheduled (2 AM daily)');
}

/**
 * Start all cron jobs
 */
export function startAllCronJobs() {
  startJobCrawlerCron();
  startDailyJobCrawlerCron();
  logger.info('All cron jobs started');
}

