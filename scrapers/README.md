# Job Scrapers

A comprehensive web scraping solution for Indeed, LinkedIn, and Glassdoor job and company data.

## Features

- **Indeed.com Scraper**: Scrapes job listings with search parameters (title, location, salary range, date posted)
- **LinkedIn Scraper**: Scrapes job postings with authentication and rate limit handling
- **Glassdoor Scraper**: Scrapes company ratings, reviews, salaries, and interview data
- **PostgreSQL Integration**: Stores all data in a relational database
- **Rate Limiting**: Built-in rate limiting to avoid detection
- **Proxy Rotation**: Support for proxy rotation
- **Anti-Bot Detection**: Advanced techniques to avoid bot detection
- **Cron Scheduling**: Automated scraping every 6 hours
- **Error Handling**: Comprehensive error handling and retry logic

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   cd scrapers
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=job_scraper_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   HEADLESS=true
   RATE_LIMIT_DELAY_MIN=2000
   RATE_LIMIT_DELAY_MAX=5000
   ```

3. **Set up the database:**
   ```bash
   # Create PostgreSQL database
   createdb job_scraper_db
   
   # Run schema setup
   npm run setup:db
   ```

## Usage

### Command Line Interface

#### Run Individual Scrapers

**Indeed Scraper:**
```bash
node index.js indeed --title="software engineer" --location="San Francisco" --maxPages=5
```

**LinkedIn Scraper:**
```bash
node index.js linkedin --keywords="developer" --location="New York" --maxPages=3
```

**Glassdoor Scraper:**
```bash
node index.js glassdoor --companyName="Google" --maxCompanies=5
```

#### Run All Scrapers
```bash
node index.js all
```

#### Start Cron Scheduler
```bash
node index.js schedule
```

The scheduler will run all scrapers every 6 hours automatically.

### Programmatic Usage

```javascript
import IndeedScraper from './scrapers/indeed-scraper.js';
import LinkedInScraper from './scrapers/linkedin-scraper.js';
import GlassdoorScraper from './scrapers/glassdoor-scraper.js';

// Indeed
const indeedScraper = new IndeedScraper({
  title: 'software engineer',
  location: 'San Francisco',
  salaryMin: 100000,
  salaryMax: 200000,
  datePosted: '7', // days
  maxPages: 5
});

const result = await indeedScraper.scrape();

// LinkedIn
const linkedinScraper = new LinkedInScraper({
  keywords: 'developer',
  location: 'New York',
  experienceLevel: 'mid-senior',
  jobType: 'full-time',
  maxPages: 5
});

const result = await linkedinScraper.scrape();

// Glassdoor
const glassdoorScraper = new GlassdoorScraper({
  companyName: 'Google',
  maxCompanies: 10
});

const result = await glassdoorScraper.scrape();
```

## Database Schema

### Indeed Jobs
- `job_id` (unique)
- `title`
- `company`
- `location`
- `salary`
- `description`
- `url`
- `date_posted`

### LinkedIn Jobs
- `job_id` (unique)
- `title`
- `company`
- `location`
- `industry`
- `seniority_level`
- `employment_type`
- `description`
- `skills_required` (array)
- `url`

### Glassdoor Companies
- `company_id` (unique)
- `company_name`
- `rating`
- `review_count`
- `salary_range`
- `interview_difficulty`
- `ceo_approval_rating`
- `pros`
- `cons`
- `url`

### Glassdoor Salaries
- `company_id` (foreign key)
- `position`
- `location`
- `salary_min`
- `salary_max`
- `salary_currency`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `job_scraper_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `HEADLESS` | Run browser in headless mode | `true` |
| `RATE_LIMIT_DELAY_MIN` | Minimum delay between requests (ms) | `2000` |
| `RATE_LIMIT_DELAY_MAX` | Maximum delay between requests (ms) | `5000` |
| `USE_PROXY` | Enable proxy rotation | `false` |
| `PROXY_LIST` | Comma-separated proxy list | - |
| `TIMEOUT` | Page load timeout (ms) | `30000` |
| `LOG_LEVEL` | Logging level | `info` |

### Proxy Configuration

To use proxies, set in `.env`:
```env
USE_PROXY=true
PROXY_LIST=http://proxy1:8080,http://proxy2:8080
```

## Rate Limiting & Anti-Bot

The scrapers include several features to avoid detection:

- **Random delays** between requests
- **User agent rotation**
- **Stealth plugin** for Puppeteer
- **Human-like mouse movements**
- **Viewport randomization**
- **WebDriver property masking**

## Error Handling

All scrapers include:
- Automatic retry with exponential backoff
- Comprehensive error logging
- Database transaction rollback on errors
- Graceful degradation

## Logging

Logs are written to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

Scraping executions are also logged to the `scraping_logs` table in the database.

## Cron Scheduling

The scheduler runs scrapers every 6 hours. To customize:

1. Edit `scheduler/cron.js`
2. Modify the cron expression: `'0 */6 * * *'` (every 6 hours)

Cron format: `minute hour day month weekday`

Examples:
- `'0 */6 * * *'` - Every 6 hours
- `'0 0 * * *'` - Daily at midnight
- `'0 */12 * * *'` - Every 12 hours

## Legal & Ethical Considerations

⚠️ **Important**: 

- Always respect websites' Terms of Service
- Use scrapers responsibly and ethically
- Implement proper rate limiting
- Consider using official APIs when available
- Be aware of legal implications in your jurisdiction
- This tool is for educational purposes

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb job_scraper_db`

### Scraping Failures
- Check network connectivity
- Verify target websites are accessible
- Increase timeout values if pages load slowly
- Check for CAPTCHA or blocking

### Rate Limiting
- Increase delay values in `.env`
- Use proxies if available
- Reduce `maxPages` value

## License

MIT

## Support

For issues and questions, please check the logs in `logs/` directory and the `scraping_logs` table in the database.

