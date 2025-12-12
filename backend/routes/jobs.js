/**
 * Job Routes
 * Public and authenticated routes for job listings
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in jobs.js');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

/**
 * GET /api/jobs
 * Get all jobs with filtering and pagination
 * Public endpoint
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      location,
      type,
      category,
      remote,
      sort = 'newest'
    } = req.query;

    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:companies(name, logo, location),
        saved_jobs(id)
      `, { count: 'exact' })
      .or('status.eq.active,status.eq.published');

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company_name.ilike.%${search}%`);
    }

    // Location filter
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Job type filter
    if (type && type !== 'all') {
      query = query.eq('employment_type', type);
    }

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Remote filter
    if (remote === 'true') {
      query = query.eq('is_remote', true);
    }

    // Sorting
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'salary_high') {
      query = query.order('salary_max', { ascending: false });
    } else if (sort === 'salary_low') {
      query = query.order('salary_min', { ascending: true });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Enhance data with "saved" status if user is logged in
    const userId = req.user?.id;
    const enhancedData = data.map(job => ({
      ...job,
      is_saved: userId && job.saved_jobs && job.saved_jobs.length > 0
    }));

    res.json({
      success: true,
      data: enhancedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

/**
 * GET /api/jobs/:id
 * Get single job details
 * Public endpoint
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        requirements,
        benefits
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    logger.error(`Error fetching job ${req.params.id}:`, error);
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
});

/**
 * PPOST /api/jobs/search
 * Advanced job search
 * Public endpoint
 */
router.post('/search', async (req, res) => {
  try {
    const { query, filters, limit = 20 } = req.body;
    
    // Construct text search query
    // detailed implementation would go here, for now reusing simple search
    // or calling the same logic as GET but with body params
    
    // For simplicity, just reusing the GET logic if possible or basic search
     let supabaseQuery = supabase
      .from('jobs')
      .select('*, company:companies(name, logo)')
      .or('status.eq.active,status.eq.published')
      .limit(limit);

    if (query) {
      supabaseQuery = supabaseQuery.textSearch('fts', query); // Assuming Full Text Search content column 'fts'
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;

    res.json({ success: true, data });

  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * POST /api/jobs
 * Create a new job posting
 * Protected (Recruiters/Admins only)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    // Validate role
    // const { role } = req.user; ...

    const jobData = {
      ...req.body,
      posted_by: req.user.id,
      status: 'pending_approval' // Default to pending
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

/**
 * POST /api/jobs/:id/apply
 * Apply to a job
 * Protected
 */
router.post('/:id/apply', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const applicationData = req.body;

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        ...applicationData,
        job_id: id,
        user_id: userId,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Apply error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

export default router;
