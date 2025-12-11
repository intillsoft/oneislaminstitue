/**
 * Indeed.com Job Scraper
 * Scrapes job listings from Indeed.com with search parameters
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pool from '../config/database.js';
import rateLimiter from '../utils/rateLimiter.js';
import proxyRotator from '../utils/proxyRotator.js';
import { getAntiBotConfig, humanizePage, randomDelay } from '../utils/antiBot.js';
import { retryWithBackoff } from '../utils/retry.js';
import logger from '../utils/logger.js';

puppeteer.use(StealthPlugin());

class IndeedScraper {
  constructor(options = {}) {
    this.options = {
      title: options.title || '',
      location: options.location || '',
      salaryMin: options.salaryMin || null,
      salaryMax: options.salaryMax || null,
      datePosted: options.datePosted || 'any', // any, 1, 7, 14, 30
      maxPages: options.maxPages || 5,
      ...options,
    };
  }

  /**
   * Build Indeed search URL
   */
  buildSearchUrl(page = 0) {
    const baseUrl = 'https://www.indeed.com/jobs';
    const params = new URLSearchParams();
    
    if (this.options.title) params.append('q', this.options.title);
    if (this.options.location) params.append('l', this.options.location);
    if (this.options.datePosted && this.options.datePosted !== 'any') {
      params.append('fromage', this.options.datePosted);
    }
    
    if (page > 0) {
      params.append('start', page * 10);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Initialize browser with anti-bot measures
   */
  async initBrowser() {
    const browserOptions = {
      ...getAntiBotConfig(),
      ...(await proxyRotator.configureBrowser()),
    };

    const browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();
    
    await humanizePage(page);
    await page.setDefaultTimeout(parseInt(process.env.TIMEOUT) || 30000);
    
    return { browser, page };
  }

  /**
   * Scrape job listings from a page
   */
  async scrapePage(page) {
    await randomDelay(1000, 2000);
    
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('[data-jk]');
      const results = [];

      jobCards.forEach((card) => {
        try {
          const jobId = card.getAttribute('data-jk');
          const titleElement = card.querySelector('[data-testid="job-title"]') || 
                              card.querySelector('h2.jobTitle a');
          const companyElement = card.querySelector('[data-testid="company-name"]') ||
                               card.querySelector('.companyName');
          const locationElement = card.querySelector('[data-testid="job-location"]') ||
                                card.querySelector('.companyLocation');
          const salaryElement = card.querySelector('[data-testid="attribute_snippet_testid"]') ||
                              card.querySelector('.salary-snippet-container');
          const summaryElement = card.querySelector('.job-snippet');

          if (jobId && titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const company = companyElement?.textContent?.trim() || '';
            const location = locationElement?.textContent?.trim() || '';
            const salary = salaryElement?.textContent?.trim() || '';
            const summary = summaryElement?.textContent?.trim() || '';
            
            // Get job URL
            const linkElement = titleElement.querySelector('a') || titleElement;
            const relativeUrl = linkElement.getAttribute('href') || '';
            const url = relativeUrl.startsWith('http') 
              ? relativeUrl 
              : `https://www.indeed.com${relativeUrl}`;

            results.push({
              job_id: jobId,
              title,
              company,
              location,
              salary,
              description: summary,
              url,
            });
          }
        } catch (error) {
          console.error('Error parsing job card:', error);
        }
      });

      return results;
    });

    return jobs;
  }

  /**
   * Get full job description
   */
  async getJobDescription(page, jobUrl) {
    try {
      await page.goto(jobUrl, { waitUntil: 'networkidle2' });
      await randomDelay(500, 1000);
      
      const description = await page.evaluate(() => {
        const descElement = document.querySelector('#jobDescriptionText') ||
                           document.querySelector('.jobsearch-jobDescriptionText');
        return descElement?.textContent?.trim() || '';
      });

      return description;
    } catch (error) {
      logger.warn(`Failed to get description for ${jobUrl}:`, error.message);
      return '';
    }
  }

  /**
   * Parse date posted
   */
  parseDatePosted(dateText) {
    if (!dateText) return null;
    
    const now = new Date();
    const lowerText = dateText.toLowerCase();
    
    if (lowerText.includes('just posted') || lowerText.includes('today')) {
      return now;
    }
    
    const daysMatch = dateText.match(/(\d+)\s*days?/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      return date;
    }
    
    return null;
  }

  /**
   * Filter jobs by salary range
   */
  filterBySalary(jobs) {
    if (!this.options.salaryMin && !this.options.salaryMax) {
      return jobs;
    }

    return jobs.filter((job) => {
      if (!job.salary) return true; // Include jobs without salary info
      
      const salaryMatch = job.salary.match(/\$?([\d,]+)/g);
      if (!salaryMatch) return true;
      
      // Extract numeric values
      const values = salaryMatch.map(m => parseInt(m.replace(/[$,]/g, '')));
      const minSalary = Math.min(...values);
      const maxSalary = Math.max(...values);
      
      if (this.options.salaryMin && maxSalary < this.options.salaryMin) {
        return false;
      }
      if (this.options.salaryMax && minSalary > this.options.salaryMax) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Save job to database
   */
  async saveJob(job) {
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO indeed_jobs 
         (job_id, title, company, location, salary, description, url, date_posted, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
         ON CONFLICT (job_id) 
         DO UPDATE SET 
           title = EXCLUDED.title,
           company = EXCLUDED.company,
           location = EXCLUDED.location,
           salary = EXCLUDED.salary,
           description = EXCLUDED.description,
           url = EXCLUDED.url,
           date_posted = EXCLUDED.date_posted,
           updated_at = CURRENT_TIMESTAMP`,
        [
          job.job_id,
          job.title,
          job.company,
          job.location,
          job.salary,
          job.description,
          job.url,
          job.date_posted,
        ]
      );
      return true;
    } catch (error) {
      logger.error('Error saving job to database:', error);
      return false;
    } finally {
      client.release();
    }
  }

  /**
   * Main scraping function
   */
  async scrape() {
    const startTime = Date.now();
    let totalJobs = 0;
    const { browser, page } = await this.initBrowser();

    try {
      logger.info('Starting Indeed scraper', { options: this.options });

      for (let pageNum = 0; pageNum < this.options.maxPages; pageNum++) {
        const searchUrl = this.buildSearchUrl(pageNum);
        logger.info(`Scraping page ${pageNum + 1}: ${searchUrl}`);

        await retryWithBackoff(
          async () => {
            await page.goto(searchUrl, { waitUntil: 'networkidle2' });
            await randomDelay(2000, 3000);
          },
          3,
          2000,
          `Loading page ${pageNum + 1}`
        );

        // Check if we've reached the end
        const hasMoreJobs = await page.evaluate(() => {
          return document.querySelector('[data-testid="pagination-page-next"]') !== null;
        });

        if (!hasMoreJobs && pageNum > 0) {
          logger.info('No more pages available');
          break;
        }

        // Scrape jobs from current page
        let jobs = await this.scrapePage(page);
        jobs = this.filterBySalary(jobs);

        // Get full descriptions for each job
        for (const job of jobs) {
          try {
            const fullDescription = await this.getJobDescription(page, job.url);
            if (fullDescription) {
              job.description = fullDescription;
            }
            job.date_posted = this.parseDatePosted(job.date_posted);
            
            await this.saveJob(job);
            totalJobs++;
            
            await rateLimiter.wait();
          } catch (error) {
            logger.error(`Error processing job ${job.job_id}:`, error.message);
          }
        }

        logger.info(`Page ${pageNum + 1} completed. Jobs scraped: ${jobs.length}`);
        
        if (pageNum < this.options.maxPages - 1) {
          await rateLimiter.wait();
        }
      }

      const executionTime = Date.now() - startTime;
      logger.info(`Indeed scraper completed. Total jobs: ${totalJobs}, Time: ${executionTime}ms`);

      return {
        success: true,
        jobsScraped: totalJobs,
        executionTime,
      };
    } catch (error) {
      logger.error('Indeed scraper failed:', error);
      return {
        success: false,
        error: error.message,
        jobsScraped: totalJobs,
      };
    } finally {
      await browser.close();
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('indeed-scraper.js')) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key && value) {
      options[key.replace('--', '')] = value;
    }
  });

  const scraper = new IndeedScraper(options);
  scraper.scrape()
    .then((result) => {
      console.log('Scraping completed:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
}

export default IndeedScraper;

