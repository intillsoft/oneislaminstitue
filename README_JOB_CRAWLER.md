# 🕷️ Job Crawler Setup Guide

## Overview

The job crawler system allows you to automatically fetch jobs from LinkedIn, Glassdoor, and Indeed and add them to your platform.

## Features

✅ **Real API Integration** - Supports RapidAPI, LinkedIn Official API, and Indeed Publisher API  
✅ **Automatic Deduplication** - Smart duplicate detection using URL, title+company matching  
✅ **Cron Job Support** - Automatic periodic crawling (every 6 hours or daily)  
✅ **Admin UI** - Manual crawling interface in admin dashboard  
✅ **Status Tracking** - View crawling statistics and last crawl times  

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `node-cron` - For scheduled job crawling
- `axios` - For API requests

### 2. Configure API Keys

Add these to your `backend/.env` file:

```env
# RapidAPI (Recommended - supports all platforms)
# Get from: https://rapidapi.com/
RAPIDAPI_KEY=your_rapidapi_key_here

# LinkedIn Official API (Optional)
LINKEDIN_API_KEY=your_linkedin_api_key_here

# Indeed Publisher API (Optional)
# Get from: https://ads.indeed.com/jobroll/xmlfeed
INDEED_API_KEY=your_indeed_publisher_key_here

# Enable Automatic Crawling (Optional)
ENABLE_CRON_JOBS=true
```

### 3. Start Backend Server

```bash
cd backend
npm start
```

The cron jobs will automatically start if `ENABLE_CRON_JOBS=true` is set.

### 4. Access Admin UI

1. Log in as an admin user
2. Navigate to **Admin Dashboard** → **Job Crawler** tab
3. Configure and trigger manual crawls

## API Endpoints

### Manual Crawl
```http
POST /api/job-crawler/crawl
Authorization: Bearer <token>
Content-Type: application/json

{
  "keywords": "software engineer",
  "location": "United States",
  "sources": ["linkedin", "glassdoor", "indeed"],
  "limit": 50
}
```

### Schedule Full Crawl
```http
POST /api/job-crawler/schedule
Authorization: Bearer <token>
```

### Get Crawler Status
```http
GET /api/job-crawler/status
Authorization: Bearer <token>
```

## Cron Job Configuration

The system supports two cron schedules:

1. **Every 6 Hours** - Light crawling for fresh jobs
2. **Daily at 2 AM** - Full comprehensive crawl

To customize, edit `backend/cron/jobCrawler.js`.

## Deduplication Logic

The crawler uses intelligent deduplication:

1. **URL Matching** - Exact URL match (most reliable)
2. **Title + Company Similarity** - Fuzzy matching using Levenshtein distance
3. **Similarity Threshold** - 80% similarity required for duplicate detection

## Troubleshooting

### Backend Connection Error

If you see `ERR_CONNECTION_REFUSED`:
1. Make sure backend is running: `cd backend && npm start`
2. Check that `PORT=3001` in `backend/.env`
3. Verify `VITE_API_URL=http://localhost:3001/api` in root `.env`

### No Jobs Being Crawled

1. Check API keys are set correctly in `backend/.env`
2. Verify API keys are valid and have sufficient quota
3. Check backend logs for error messages
4. Try manual crawl from admin UI first

### Cron Jobs Not Running

1. Verify `ENABLE_CRON_JOBS=true` in `backend/.env`
2. Check backend logs for cron job startup messages
3. Restart backend server after enabling

## API Providers

### RapidAPI (Recommended)
- **LinkedIn Jobs API**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/linkedin-jobs-search
- **Glassdoor API**: https://rapidapi.com/glassdoor/api/glassdoor-api
- **Indeed API**: https://rapidapi.com/indeed/api/indeed11

### Official APIs
- **LinkedIn**: https://developer.linkedin.com/
- **Indeed**: https://ads.indeed.com/jobroll/xmlfeed

## Notes

- The crawler respects rate limits and includes delays between requests
- Duplicate jobs are automatically skipped
- Jobs are marked with their source (`linkedin`, `glassdoor`, `indeed`)
- All crawled jobs are set to `status: 'active'` by default










