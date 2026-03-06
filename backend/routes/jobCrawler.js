/**
 * Job Crawler Routes
 * API endpoints for job crawling functionality
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as jobCrawlerService from '../services/jobCrawler.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/job-crawler/crawl
 * Manually trigger job crawling
 * Requires admin or recruiter role
 */
router.post('/crawl', authenticate, async (req, res) => {
  try {
    // Check role manually
    const { data: profile, error: profileError } = await req.supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile || !['admin', 'recruiter'].includes(profile.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin or Recruiter role required'
      });
    }

    const {
      keywords = 'software engineer',
      location = 'United States',
      sources = ['linkedin', 'glassdoor', 'indeed'],
      limit = 50,
    } = req.body;

    const result = await jobCrawlerService.crawlJobs({
      keywords,
      location,
      sources,
      limit,
    });

    res.json({
      success: true,
      message: 'Job crawling completed',
      data: result,
    });
  } catch (error) {
    logger.error('Job crawling route error:', error);
    res.status(500).json({
      error: 'Failed to crawl jobs',
      message: error.message,
    });
  }
});

/**
 * POST /api/job-crawler/schedule
 * Schedule periodic job crawling
 * Requires admin role only
 */
router.post('/schedule', authenticate, async (req, res) => {
  try {
    // Check admin role
    const { data: profile, error: profileError } = await req.supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin role required'
      });
    }

    // This would typically be handled by a cron job or scheduler
    // For now, we'll just trigger it manually
    await jobCrawlerService.scheduleJobCrawl();

    res.json({
      success: true,
      message: 'Scheduled job crawl completed',
    });
  } catch (error) {
    logger.error('Scheduled job crawl route error:', error);
    res.status(500).json({
      error: 'Failed to schedule job crawl',
      message: error.message,
    });
  }
});

/**
 * GET /api/job-crawler/status
 * Get crawling status and statistics
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    // Get statistics about crawled jobs
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get total jobs count
    const { count: totalJobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    // Get crawled jobs stats
    const { data: stats, error } = await supabase
      .from('jobs')
      .select('source, created_at, scraped_at')
      .not('source', 'eq', 'manual')
      .order('scraped_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    // Get last crawl log if available
    const { data: lastCrawlLog } = await supabase
      .from('job_crawl_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    // Group by source
    const crawlResults = {};
    const sourceStats = {};
    stats.forEach(job => {
      const source = job.source || 'unknown';
      if (!sourceStats[source]) {
        sourceStats[source] = {
          total: 0,
          lastCrawled: null,
        };
      }
      sourceStats[source].total++;
      const jobDate = new Date(job.scraped_at || job.created_at);
      if (!sourceStats[source].lastCrawled || jobDate > new Date(sourceStats[source].lastCrawled)) {
        sourceStats[source].lastCrawled = job.scraped_at || job.created_at;
      }

      // For crawl_results format
      if (!crawlResults[source]) {
        crawlResults[source] = {
          count: 0,
          error: null,
        };
      }
      crawlResults[source].count++;
    });

    res.json({
      success: true,
      data: {
        total_jobs_in_db: totalJobsCount || 0,
        last_run: lastCrawlLog ? {
          timestamp: lastCrawlLog.timestamp,
          inserted: lastCrawlLog.inserted || 0,
          skipped: lastCrawlLog.skipped || 0,
          crawl_results: crawlResults,
        } : null,
        crawl_results: crawlResults,
        sources: sourceStats,
        totalCrawled: stats.length,
      },
    });
  } catch (error) {
    logger.error('Job crawler status error:', error);
    res.status(500).json({
      error: 'Failed to get crawler status',
      message: error.message,
    });
  }
});

export default router;

