/**
 * Course Routes
 * Public and authenticated routes for course listings
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { generateEmbedding } from '../services/aiProviderService.js';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in courses.js');
}

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;


/**
 * GET /api/courses
 * Get all courses with filtering and pagination
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

    if (!supabase) {
      logger.error('GET /api/courses: Supabase not initialized');
      return res.json({ success: true, data: [], total: 0, warning: 'Database unavailable' });
    }

    let query = supabase
      .from('jobs') // Keep table name as 'jobs' for now until migration
      .select(`
        *,
        department:companies(name, logo, location),
        saved_courses:saved_jobs(id)
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

    // Course type filter
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
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Enhance data with "saved" status if user is logged in
    const userId = req.user?.id;
    const enhancedData = data.map(course => ({
      ...course,
      is_saved: userId && course.saved_courses && course.saved_courses.length > 0
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
    logger.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/courses/:id
 * Get single course details
 * Public endpoint
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: course, error } = await supabase
      .from('jobs')
      .select(`
        *,
        department:companies(*),
        curriculum:requirements,
        outcomes:benefits
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    logger.error(`Error fetching course ${req.params.id}:`, error);
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
});

/**
 * POST /api/courses/search
 * Advanced course search
 * Public endpoint
 */
router.post('/search', async (req, res) => {
  try {
    const { query, filters, limit = 20 } = req.body;

    let supabaseQuery = supabase
      .from('jobs')
      .select('*, department:companies(name, logo)')
      .or('status.eq.active,status.eq.published')
      .limit(limit);

    if (query) {
      supabaseQuery = supabaseQuery.textSearch('fts', query);
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
 * POST /api/courses
 * Create a new course posting
 * Protected (Instructors/Admins only)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor_id: req.user.id,
      status: 'pending_approval'
    };

    // Generate embedding for semantic search
    let embedding = null;
    try {
      const textToEmbed = `${courseData.title} ${courseData.department} ${courseData.location} ${courseData.description || ''}`;
      embedding = await generateEmbedding(textToEmbed);
      logger.info(`Generated embedding for new course: ${courseData.title}`);
    } catch (embError) {
      logger.error('Failed to generate embedding for course:', embError);
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...courseData,
        embedding
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

/**
 * POST /api/courses/:id/enroll
 * Enroll in a course
 * Protected
 */
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const enrollmentData = req.body;

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        ...enrollmentData,
        job_id: id,
        user_id: userId,
        status: 'enrolled'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

export default router;
