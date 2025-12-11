# Quick Start Guide

## 1. Install Dependencies

```bash
cd scrapers
npm install
```

## 2. Set Up Database

```bash
# Create PostgreSQL database
createdb job_scraper_db

# Or using psql:
psql -U postgres
CREATE DATABASE job_scraper_db;
\q
```

## 3. Configure Environment

```bash
# Copy example env file
cp env.example .env

# Edit .env with your database credentials
# At minimum, set:
# DB_PASSWORD=your_postgres_password
```

## 4. Initialize Database Schema

```bash
npm run setup:db
```

## 5. Run a Scraper

### Indeed Scraper
```bash
node index.js indeed --title="software engineer" --location="San Francisco" --maxPages=3
```

### LinkedIn Scraper
```bash
node index.js linkedin --keywords="developer" --location="New York" --maxPages=3
```

### Glassdoor Scraper
```bash
node index.js glassdoor --companyName="Google" --maxCompanies=1
```

## 6. Start Automated Scheduler

```bash
node index.js schedule
```

This will run all scrapers every 6 hours automatically.

## Verify Data

Check your PostgreSQL database:

```sql
-- View Indeed jobs
SELECT * FROM indeed_jobs LIMIT 10;

-- View LinkedIn jobs
SELECT * FROM linkedin_jobs LIMIT 10;

-- View Glassdoor companies
SELECT * FROM glassdoor_companies LIMIT 10;

-- View scraping logs
SELECT * FROM scraping_logs ORDER BY started_at DESC LIMIT 10;
```

## Troubleshooting

### "Cannot find module" errors
- Make sure you're in the `scrapers` directory
- Run `npm install` again

### Database connection errors
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -l | grep job_scraper_db`

### Scraping fails immediately
- Check internet connection
- Verify target websites are accessible
- Try with `HEADLESS=false` in `.env` to see browser

### Rate limiting / blocking
- Increase `RATE_LIMIT_DELAY_MIN` and `RATE_LIMIT_DELAY_MAX` in `.env`
- Reduce `maxPages` value
- Use proxies if available

