/**
 * Main Entry Point
 * Orchestrates all scrapers
 */

import dotenv from 'dotenv';
import IndeedScraper from './scrapers/indeed-scraper.js';
import LinkedInScraper from './scrapers/linkedin-scraper.js';
import GlassdoorScraper from './scrapers/glassdoor-scraper.js';
import { startScheduler } from './scheduler/cron.js';
import logger from './utils/logger.js';

dotenv.config();

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  try {
    switch (command) {
      case 'indeed':
        {
          const options = parseArgs(args);
          const scraper = new IndeedScraper(options);
          const result = await scraper.scrape();
          console.log('Result:', result);
          process.exit(result.success ? 0 : 1);
        }
        break;

      case 'linkedin':
        {
          const options = parseArgs(args);
          const scraper = new LinkedInScraper(options);
          const result = await scraper.scrape();
          console.log('Result:', result);
          process.exit(result.success ? 0 : 1);
        }
        break;

      case 'glassdoor':
        {
          const options = parseArgs(args);
          const scraper = new GlassdoorScraper(options);
          const result = await scraper.scrape();
          console.log('Result:', result);
          process.exit(result.success ? 0 : 1);
        }
        break;

      case 'schedule':
        startScheduler();
        // Keep process alive
        process.on('SIGINT', () => {
          logger.info('Shutting down...');
          process.exit(0);
        });
        break;

      case 'all':
        {
          logger.info('Running all scrapers...');
          
          const indeedOptions = parseArgs(args.filter(a => !a.startsWith('--linkedin') && !a.startsWith('--glassdoor')));
          const linkedinOptions = parseArgs(args.filter(a => !a.startsWith('--indeed') && !a.startsWith('--glassdoor')));
          const glassdoorOptions = parseArgs(args.filter(a => !a.startsWith('--indeed') && !a.startsWith('--linkedin')));
          
          const results = await Promise.allSettled([
            new IndeedScraper(indeedOptions).scrape(),
            new LinkedInScraper(linkedinOptions).scrape(),
            new GlassdoorScraper(glassdoorOptions).scrape(),
          ]);
          
          results.forEach((result, index) => {
            const scraperName = ['Indeed', 'LinkedIn', 'Glassdoor'][index];
            if (result.status === 'fulfilled') {
              console.log(`${scraperName}:`, result.value);
            } else {
              console.error(`${scraperName} failed:`, result.reason);
            }
          });
          
          process.exit(0);
        }
        break;

      default:
        console.log(`
Job Scraper CLI

Usage:
  node index.js <command> [options]

Commands:
  indeed      Run Indeed scraper
  linkedin    Run LinkedIn scraper
  glassdoor   Run Glassdoor scraper
  schedule    Start cron scheduler (runs every 6 hours)
  all         Run all scrapers

Options:
  --title=<value>              Job title/keywords
  --location=<value>           Location
  --maxPages=<number>          Maximum pages to scrape
  --companyName=<value>         Company name (Glassdoor)
  --companyIds=<id1,id2>       Company IDs (Glassdoor)

Examples:
  node index.js indeed --title="software engineer" --location="San Francisco"
  node index.js linkedin --keywords="developer" --location="New York"
  node index.js glassdoor --companyName="Google"
  node index.js schedule
        `);
        process.exit(0);
    }
  } catch (error) {
    logger.error('Error:', error);
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function parseArgs(args) {
  const options = {};
  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (key && value) {
        // Handle array values
        if (value.includes(',')) {
          options[key] = value.split(',');
        } else {
          options[key] = value;
        }
      }
    }
  });
  return options;
}

main();

