/**
 * LinkedIn Job Scraper
 * Scrapes job postings from LinkedIn
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

class LinkedInScraper {
  constructor(options = {}) {
    this.options = {
      keywords: options.keywords || '',
      location: options.location || '',
      experienceLevel: options.experienceLevel || '', // intern, entry, associate, mid-senior, director, executive
      jobType: options.jobType || '', // full-time, part-time, contract, temporary, volunteer, internship
      maxPages: options.maxPages || 5,
      ...options,
    };
    this.sessionCookies = null;
  }

  /**
   * Build LinkedIn search URL
   */
  buildSearchUrl(page = 0) {
    const baseUrl = 'https://www.linkedin.com/jobs/search';
    const params = new URLSearchParams();
    
    if (this.options.keywords) params.append('keywords', this.options.keywords);
    if (this.options.location) params.append('location', this.options.location);
    if (this.options.experienceLevel) {
      params.append('f_E', this.mapExperienceLevel(this.options.experienceLevel));
    }
    if (this.options.jobType) {
      params.append('f_JT', this.mapJobType(this.options.jobType));
    }
    
    if (page > 0) {
      params.append('start', page * 25);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Map experience level to LinkedIn filter code
   */
  mapExperienceLevel(level) {
    const mapping = {
      intern: '1',
      entry: '2',
      associate: '3',
      'mid-senior': '4',
      director: '5',
      executive: '6',
    };
    return mapping[level.toLowerCase()] || '';
  }

  /**
   * Map job type to LinkedIn filter code
   */
  mapJobType(type) {
    const mapping = {
      'full-time': 'F',
      'part-time': 'P',
      contract: 'C',
      temporary: 'T',
      volunteer: 'V',
      internship: 'I',
    };
    return mapping[type.toLowerCase()] || '';
  }

  /**
   * Initialize browser with session management
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

    // Set LinkedIn cookies if available
    if (this.sessionCookies) {
      await page.setCookie(...this.sessionCookies);
    }
    
    return { browser, page };
  }

  /**
   * Handle LinkedIn authentication (if needed)
   */
  async handleAuthentication(page) {
    // Check if we're logged in
    const isLoggedIn = await page.evaluate(() => {
      return document.querySelector('.global-nav__me') !== null;
    });

    if (!isLoggedIn) {
      logger.warn('Not logged into LinkedIn. Some features may be limited.');
      // In production, you would implement proper login flow
      // For now, we'll proceed with public job listings
    }
  }

  /**
   * Scrape job listings from a page
   */
  async scrapePage(page) {
    await randomDelay(2000, 4000);
    
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.jobs-search-results__list-item');
      const results = [];

      jobCards.forEach((card) => {
        try {
          const linkElement = card.querySelector('a.job-card-list__title');
          if (!linkElement) return;

          const jobUrl = linkElement.getAttribute('href');
          const jobIdMatch = jobUrl.match(/\/jobs\/view\/(\d+)/);
          const jobId = jobIdMatch ? jobIdMatch[1] : null;

          if (!jobId) return;

          const title = linkElement.textContent?.trim() || '';
          const companyElement = card.querySelector('.job-card-container__company-name');
          const company = companyElement?.textContent?.trim() || '';
          
          const locationElement = card.querySelector('.job-card-container__metadata-item');
          const location = locationElement?.textContent?.trim() || '';
          
          const descriptionElement = card.querySelector('.job-card-container__description');
          const description = descriptionElement?.textContent?.trim() || '';

          // Extract additional metadata
          const metadataElements = card.querySelectorAll('.job-card-container__metadata-item');
          let industry = '';
          let employmentType = '';
          let seniorityLevel = '';

          metadataElements.forEach((el) => {
            const text = el.textContent?.toLowerCase() || '';
            if (text.includes('full-time') || text.includes('part-time') || 
                text.includes('contract') || text.includes('internship')) {
              employmentType = el.textContent?.trim() || '';
            }
          });

          results.push({
            job_id: jobId,
            title,
            company,
            location,
            industry,
            seniority_level: seniorityLevel,
            employment_type: employmentType,
            description,
            url: jobUrl.startsWith('http') ? jobUrl : `https://www.linkedin.com${jobUrl}`,
          });
        } catch (error) {
          console.error('Error parsing job card:', error);
        }
      });

      return results;
    });

    return jobs;
  }

  /**
   * Get full job details including skills
   */
  async getJobDetails(page, jobUrl) {
    try {
      await page.goto(jobUrl, { waitUntil: 'networkidle2' });
      await randomDelay(1000, 2000);
      
      const details = await page.evaluate(() => {
        const descriptionElement = document.querySelector('.show-more-less-html__markup') ||
                                   document.querySelector('.description__text');
        const description = descriptionElement?.textContent?.trim() || '';

        // Extract skills
        const skillsElements = document.querySelectorAll('.job-details-jobs-unified-top-card__job-insight');
        const skills = [];
        skillsElements.forEach((el) => {
          const text = el.textContent?.trim();
          if (text) skills.push(text);
        });

        // Get additional metadata
        const criteriaElements = document.querySelectorAll('.description__job-criteria-item');
        let industry = '';
        let seniorityLevel = '';
        let employmentType = '';

        criteriaElements.forEach((el) => {
          const label = el.querySelector('h3')?.textContent?.trim() || '';
          const value = el.querySelector('span')?.textContent?.trim() || '';
          
          if (label.toLowerCase().includes('industry')) {
            industry = value;
          }
          if (label.toLowerCase().includes('seniority') || label.toLowerCase().includes('level')) {
            seniorityLevel = value;
          }
          if (label.toLowerCase().includes('employment') || label.toLowerCase().includes('type')) {
            employmentType = value;
          }
        });

        return {
          description,
          skills_required: skills,
          industry,
          seniority_level: seniorityLevel,
          employment_type: employmentType,
        };
      });

      return details;
    } catch (error) {
      logger.warn(`Failed to get details for ${jobUrl}:`, error.message);
      return {
        description: '',
        skills_required: [],
        industry: '',
        seniority_level: '',
        employment_type: '',
      };
    }
  }

  /**
   * Save job to database
   */
  async saveJob(job) {
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO linkedin_jobs 
         (job_id, title, company, location, industry, seniority_level, employment_type, description, skills_required, url, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
         ON CONFLICT (job_id) 
         DO UPDATE SET 
           title = EXCLUDED.title,
           company = EXCLUDED.company,
           location = EXCLUDED.location,
           industry = EXCLUDED.industry,
           seniority_level = EXCLUDED.seniority_level,
           employment_type = EXCLUDED.employment_type,
           description = EXCLUDED.description,
           skills_required = EXCLUDED.skills_required,
           url = EXCLUDED.url,
           updated_at = CURRENT_TIMESTAMP`,
        [
          job.job_id,
          job.title,
          job.company,
          job.location,
          job.industry,
          job.seniority_level,
          job.employment_type,
          job.description,
          job.skills_required || [],
          job.url,
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
      logger.info('Starting LinkedIn scraper', { options: this.options });

      // Handle authentication
      await this.handleAuthentication(page);

      for (let pageNum = 0; pageNum < this.options.maxPages; pageNum++) {
        const searchUrl = this.buildSearchUrl(pageNum);
        logger.info(`Scraping page ${pageNum + 1}: ${searchUrl}`);

        await retryWithBackoff(
          async () => {
            await page.goto(searchUrl, { waitUntil: 'networkidle2' });
            await randomDelay(3000, 5000);
          },
          3,
          2000,
          `Loading page ${pageNum + 1}`
        );

        // Check for rate limiting or blocking
        const isBlocked = await page.evaluate(() => {
          return document.querySelector('.challenge') !== null ||
                 document.body.textContent.includes('unusual traffic');
        });

        if (isBlocked) {
          logger.warn('LinkedIn may have detected automated access. Waiting...');
          await randomDelay(30000, 60000);
          continue;
        }

        // Scrape jobs from current page
        let jobs = await this.scrapePage(page);

        // Get full details for each job
        for (const job of jobs) {
          try {
            const details = await this.getJobDetails(page, job.url);
            Object.assign(job, details);
            
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
      logger.info(`LinkedIn scraper completed. Total jobs: ${totalJobs}, Time: ${executionTime}ms`);

      return {
        success: true,
        jobsScraped: totalJobs,
        executionTime,
      };
    } catch (error) {
      logger.error('LinkedIn scraper failed:', error);
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
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('linkedin-scraper.js')) {
  const args = process.argv.slice(2);
  const options = {};

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key && value) {
      options[key.replace('--', '')] = value;
    }
  });

  const scraper = new LinkedInScraper(options);
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

export default LinkedInScraper;

