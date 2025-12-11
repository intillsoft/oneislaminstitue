/**
 * Glassdoor Company Data Scraper
 * Scrapes company ratings, reviews, salaries, and interview data
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

class GlassdoorScraper {
  constructor(options = {}) {
    this.options = {
      companyName: options.companyName || '',
      companyIds: options.companyIds || [],
      maxCompanies: options.maxCompanies || 10,
      ...options,
    };
  }

  /**
   * Build Glassdoor company URL
   */
  buildCompanyUrl(companyName) {
    const encodedName = encodeURIComponent(companyName);
    return `https://www.glassdoor.com/Overview/Working-at-${encodedName}-EI_IE*.htm`;
  }

  /**
   * Search for company and get company ID
   */
  async searchCompany(page, companyName) {
    try {
      const searchUrl = `https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(companyName)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      await randomDelay(2000, 3000);

      const companyData = await page.evaluate(() => {
        const firstResult = document.querySelector('[data-test="employer-card-single"]');
        if (!firstResult) return null;

        const linkElement = firstResult.querySelector('a');
        const href = linkElement?.getAttribute('href') || '';
        const companyIdMatch = href.match(/EI_IE(\d+)\./);
        const companyId = companyIdMatch ? companyIdMatch[1] : null;

        const nameElement = firstResult.querySelector('[data-test="employer-name"]');
        const name = nameElement?.textContent?.trim() || '';

        return {
          company_id: companyId,
          company_name: name,
          url: href.startsWith('http') ? href : `https://www.glassdoor.com${href}`,
        };
      });

      return companyData;
    } catch (error) {
      logger.error(`Error searching for company ${companyName}:`, error.message);
      return null;
    }
  }

  /**
   * Initialize browser
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
   * Scrape company overview page
   */
  async scrapeCompanyOverview(page, companyUrl) {
    try {
      await page.goto(companyUrl, { waitUntil: 'networkidle2' });
      await randomDelay(2000, 3000);

      const data = await page.evaluate(() => {
        // Extract rating
        const ratingElement = document.querySelector('[data-test="rating"]');
        const rating = ratingElement ? parseFloat(ratingElement.textContent) : null;

        // Extract review count
        const reviewCountElement = document.querySelector('[data-test="cell-Reviews-count"]');
        const reviewCountText = reviewCountElement?.textContent || '0';
        const reviewCount = parseInt(reviewCountText.replace(/[^\d]/g, '')) || 0;

        // Extract CEO approval
        const ceoElement = document.querySelector('[data-test="ceo-approval"]');
        const ceoText = ceoElement?.textContent || '';
        const ceoMatch = ceoText.match(/(\d+)%/);
        const ceoApproval = ceoMatch ? parseFloat(ceoMatch[1]) / 100 : null;

        // Extract company ID from URL
        const url = window.location.href;
        const companyIdMatch = url.match(/EI_IE(\d+)\./);
        const companyId = companyIdMatch ? companyIdMatch[1] : null;

        // Extract company name
        const nameElement = document.querySelector('[data-test="employer-name"]');
        const companyName = nameElement?.textContent?.trim() || '';

        return {
          company_id: companyId,
          company_name: companyName,
          rating,
          review_count: reviewCount,
          ceo_approval_rating: ceoApproval,
          url: window.location.href,
        };
      });

      return data;
    } catch (error) {
      logger.error(`Error scraping company overview ${companyUrl}:`, error.message);
      return null;
    }
  }

  /**
   * Scrape company reviews (pros and cons)
   */
  async scrapeReviews(page, companyUrl) {
    try {
      const reviewsUrl = companyUrl.replace('/Overview/', '/Reviews/');
      await page.goto(reviewsUrl, { waitUntil: 'networkidle2' });
      await randomDelay(2000, 3000);

      const reviews = await page.evaluate(() => {
        const reviewCards = document.querySelectorAll('[data-test="review"]');
        const pros = [];
        const cons = [];

        reviewCards.forEach((card) => {
          const prosElement = card.querySelector('[data-test="pros"]');
          const consElement = card.querySelector('[data-test="cons"]');

          if (prosElement) {
            const prosText = prosElement.textContent?.trim();
            if (prosText) pros.push(prosText);
          }

          if (consElement) {
            const consText = consElement.textContent?.trim();
            if (consText) cons.push(consText);
          }
        });

        return {
          pros: pros.join(' | '),
          cons: cons.join(' | '),
        };
      });

      return reviews;
    } catch (error) {
      logger.warn(`Error scraping reviews:`, error.message);
      return { pros: '', cons: '' };
    }
  }

  /**
   * Scrape salary data
   */
  async scrapeSalaries(page, companyUrl) {
    try {
      const salariesUrl = companyUrl.replace('/Overview/', '/Salary/');
      await page.goto(salariesUrl, { waitUntil: 'networkidle2' });
      await randomDelay(2000, 3000);

      const salaries = await page.evaluate(() => {
        const salaryRows = document.querySelectorAll('[data-test="salary-row"]');
        const results = [];

        salaryRows.forEach((row) => {
          const positionElement = row.querySelector('[data-test="job-title"]');
          const position = positionElement?.textContent?.trim() || '';

          const salaryElement = row.querySelector('[data-test="salary-value"]');
          const salaryText = salaryElement?.textContent || '';
          const salaryMatch = salaryText.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
          
          const locationElement = row.querySelector('[data-test="job-location"]');
          const location = locationElement?.textContent?.trim() || '';

          if (position && salaryMatch) {
            results.push({
              position,
              location,
              salary_min: parseInt(salaryMatch[1].replace(/,/g, '')),
              salary_max: parseInt(salaryMatch[2].replace(/,/g, '')),
            });
          }
        });

        return results;
      });

      return salaries;
    } catch (error) {
      logger.warn(`Error scraping salaries:`, error.message);
      return [];
    }
  }

  /**
   * Scrape interview data
   */
  async scrapeInterviews(page, companyUrl) {
    try {
      const interviewsUrl = companyUrl.replace('/Overview/', '/Interview/');
      await page.goto(interviewsUrl, { waitUntil: 'networkidle2' });
      await randomDelay(2000, 3000);

      const interviewData = await page.evaluate(() => {
        // Extract interview difficulty
        const difficultyElement = document.querySelector('[data-test="difficulty-rating"]');
        const difficultyText = difficultyElement?.textContent || '';
        const difficultyMatch = difficultyText.match(/(\d+\.?\d*)/);
        const difficulty = difficultyMatch ? parseFloat(difficultyMatch[1]) : null;

        return {
          interview_difficulty: difficulty,
        };
      });

      return interviewData;
    } catch (error) {
      logger.warn(`Error scraping interviews:`, error.message);
      return { interview_difficulty: null };
    }
  }

  /**
   * Save company data to database
   */
  async saveCompany(companyData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert or update company
      await client.query(
        `INSERT INTO glassdoor_companies 
         (company_id, company_name, rating, review_count, ceo_approval_rating, 
          pros, cons, interview_difficulty, url, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
         ON CONFLICT (company_id) 
         DO UPDATE SET 
           company_name = EXCLUDED.company_name,
           rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count,
           ceo_approval_rating = EXCLUDED.ceo_approval_rating,
           pros = EXCLUDED.pros,
           cons = EXCLUDED.cons,
           interview_difficulty = EXCLUDED.interview_difficulty,
           url = EXCLUDED.url,
           updated_at = CURRENT_TIMESTAMP`,
        [
          companyData.company_id,
          companyData.company_name,
          companyData.rating,
          companyData.review_count,
          companyData.ceo_approval_rating,
          companyData.pros,
          companyData.cons,
          companyData.interview_difficulty,
          companyData.url,
        ]
      );

      // Insert salaries
      if (companyData.salaries && companyData.salaries.length > 0) {
        for (const salary of companyData.salaries) {
          await client.query(
            `INSERT INTO glassdoor_salaries 
             (company_id, position, location, salary_min, salary_max, salary_currency)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [
              companyData.company_id,
              salary.position,
              salary.location,
              salary.salary_min,
              salary.salary_max,
              'USD',
            ]
          );
        }
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error saving company to database:', error);
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
    let totalCompanies = 0;
    const { browser, page } = await this.initBrowser();

    try {
      logger.info('Starting Glassdoor scraper', { options: this.options });

      const companiesToScrape = this.options.companyIds.length > 0
        ? this.options.companyIds.map(id => ({ company_id: id }))
        : [];

      // If company names provided, search for them
      if (this.options.companyName) {
        const companyData = await this.searchCompany(page, this.options.companyName);
        if (companyData) {
          companiesToScrape.push(companyData);
        }
      }

      if (companiesToScrape.length === 0) {
        logger.warn('No companies to scrape');
        return {
          success: false,
          error: 'No companies specified',
          companiesScraped: 0,
        };
      }

      for (const company of companiesToScrape.slice(0, this.options.maxCompanies)) {
        try {
          if (!company.url && company.company_id) {
            // Build URL from company ID
            company.url = `https://www.glassdoor.com/Overview/Working-at-Company-EI_IE${company.company_id}.htm`;
          }

          if (!company.url) {
            logger.warn(`Skipping company ${company.company_id || company.company_name}: No URL`);
            continue;
          }

          logger.info(`Scraping company: ${company.company_name || company.company_id}`);

          // Scrape overview
          const overview = await retryWithBackoff(
            () => this.scrapeCompanyOverview(page, company.url),
            3,
            2000,
            `Scraping overview for ${company.company_id}`
          );

          if (!overview) {
            logger.warn(`Failed to scrape overview for ${company.company_id}`);
            continue;
          }

          // Scrape reviews
          const reviews = await this.scrapeReviews(page, company.url);
          Object.assign(overview, reviews);

          // Scrape salaries
          const salaries = await this.scrapeSalaries(page, company.url);
          overview.salaries = salaries;

          // Scrape interviews
          const interviews = await this.scrapeInterviews(page, company.url);
          Object.assign(overview, interviews);

          // Save to database
          await this.saveCompany(overview);
          totalCompanies++;

          await rateLimiter.wait();
        } catch (error) {
          logger.error(`Error processing company ${company.company_id}:`, error.message);
        }
      }

      const executionTime = Date.now() - startTime;
      logger.info(`Glassdoor scraper completed. Total companies: ${totalCompanies}, Time: ${executionTime}ms`);

      return {
        success: true,
        companiesScraped: totalCompanies,
        executionTime,
      };
    } catch (error) {
      logger.error('Glassdoor scraper failed:', error);
      return {
        success: false,
        error: error.message,
        companiesScraped: totalCompanies,
      };
    } finally {
      await browser.close();
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('glassdoor-scraper.js')) {
  const args = process.argv.slice(2);
  const options = {};

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key && value) {
      options[key.replace('--', '')] = value;
    }
  });

  const scraper = new GlassdoorScraper(options);
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

export default GlassdoorScraper;

