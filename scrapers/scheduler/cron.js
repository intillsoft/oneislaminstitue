/**
 * Cron Job Scheduler
 * Runs scrapers every 6 hours
 */

import cron from 'node-cron';
import IndeedScraper from '../scrapers/indeed-scraper.js';
import LinkedInScraper from '../scrapers/linkedin-scraper.js';
import GlassdoorScraper from '../scrapers/glassdoor-scraper.js';
import pool from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Log scraping execution to database
 */
async function logExecution(scraperType, status, jobsScraped, errors, executionTime) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO scraping_logs 
       (scraper_type, status, jobs_scraped, errors, started_at, completed_at, execution_time_ms)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5)`,
      [scraperType, status, jobsScraped, errors, executionTime]
    );
  } catch (error) {
    logger.error('Error logging execution:', error);
  } finally {
    client.release();
  }
}

/**
 * Run Indeed scraper
 */
async function runIndeedScraper() {
  const startTime = Date.now();
  logger.info('Starting scheduled Indeed scraper');
  
  try {
    const scraper = new IndeedScraper({
      title: process.env.INDEED_TITLE || 'software engineer',
      location: process.env.INDEED_LOCATION || '',
      maxPages: parseInt(process.env.INDEED_MAX_PAGES) || 5,
    });
    
    const result = await scraper.scrape();
    const executionTime = Date.now() - startTime;
    
    await logExecution(
      'indeed',
      result.success ? 'success' : 'failed',
      result.jobsScraped || 0,
      result.error || null,
      executionTime
    );
    
    logger.info('Indeed scraper completed', result);
  } catch (error) {
    const executionTime = Date.now() - startTime;
    await logExecution('indeed', 'failed', 0, error.message, executionTime);
    logger.error('Indeed scraper failed:', error);
  }
}

/**
 * Run LinkedIn scraper
 */
async function runLinkedInScraper() {
  const startTime = Date.now();
  logger.info('Starting scheduled LinkedIn scraper');
  
  try {
    const scraper = new LinkedInScraper({
      keywords: process.env.LINKEDIN_KEYWORDS || 'software engineer',
      location: process.env.LINKEDIN_LOCATION || '',
      maxPages: parseInt(process.env.LINKEDIN_MAX_PAGES) || 5,
    });
    
    const result = await scraper.scrape();
    const executionTime = Date.now() - startTime;
    
    await logExecution(
      'linkedin',
      result.success ? 'success' : 'failed',
      result.jobsScraped || 0,
      result.error || null,
      executionTime
    );
    
    logger.info('LinkedIn scraper completed', result);
  } catch (error) {
    const executionTime = Date.now() - startTime;
    await logExecution('linkedin', 'failed', 0, error.message, executionTime);
    logger.error('LinkedIn scraper failed:', error);
  }
}

/**
 * Run Glassdoor scraper
 */
async function runGlassdoorScraper() {
  const startTime = Date.now();
  logger.info('Starting scheduled Glassdoor scraper');
  
  try {
    const companyNames = process.env.GLASSDOOR_COMPANIES 
      ? process.env.GLASSDOOR_COMPANIES.split(',')
      : [];
    
    if (companyNames.length === 0) {
      logger.warn('No companies specified for Glassdoor scraper');
      return;
    }
    
    const scraper = new GlassdoorScraper({
      companyName: companyNames[0],
      maxCompanies: companyNames.length,
    });
    
    const result = await scraper.scrape();
    const executionTime = Date.now() - startTime;
    
    await logExecution(
      'glassdoor',
      result.success ? 'success' : 'failed',
      result.companiesScraped || 0,
      result.error || null,
      executionTime
    );
    
    logger.info('Glassdoor scraper completed', result);
  } catch (error) {
    const executionTime = Date.now() - startTime;
    await logExecution('glassdoor', 'failed', 0, error.message, executionTime);
    logger.error('Glassdoor scraper failed:', error);
  }
}

/**
 * Schedule all scrapers to run every 6 hours
 * Cron format: '0 */6 * * *' = every 6 hours
 */
function startScheduler() {
  logger.info('Starting cron scheduler (runs every 6 hours)');
  
  // Run immediately on start (optional)
  if (process.env.RUN_ON_START === 'true') {
    logger.info('Running scrapers on startup...');
    runIndeedScraper();
    runLinkedInScraper();
    runGlassdoorScraper();
  }
  
  // Schedule to run every 6 hours
  cron.schedule('0 */6 * * *', () => {
    logger.info('Cron job triggered - running all scrapers');
    runIndeedScraper();
    
    // Stagger the scrapers to avoid overwhelming the system
    setTimeout(() => runLinkedInScraper(), 30 * 60 * 1000); // 30 minutes later
    setTimeout(() => runGlassdoorScraper(), 60 * 60 * 1000); // 1 hour later
  });
  
  logger.info('✅ Cron scheduler started successfully');
  console.log('✅ Cron scheduler is running. Scrapers will execute every 6 hours.');
}

// Start scheduler if running directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('cron.js')) {
  startScheduler();
  
  // Keep process alive
  process.on('SIGINT', () => {
    logger.info('Shutting down scheduler...');
    process.exit(0);
  });
}

export { startScheduler, runIndeedScraper, runLinkedInScraper, runGlassdoorScraper };

