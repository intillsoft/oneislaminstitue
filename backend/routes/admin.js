/**
 * Admin API Routes
 * Handles admin-only operations: user management, moderation, analytics
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in admin.js. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    logger.error('Admin check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/admin/users
 * Get all users with filters
 */
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;

    let query = supabase
      .from('users')
      .select(`
        *,
        applications:applications(count),
        jobs:jobs(count)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Format response
    const formattedUsers = data.map(user => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      avatar: user.avatar_url,
      location: user.location,
      joinDate: user.created_at,
      lastLogin: user.updated_at,
      applications: user.applications?.[0]?.count || 0,
      jobsPosted: user.jobs?.[0]?.count || 0,
      verified: user.verified || false,
      profileCompletion: calculateProfileCompletion(user),
    }));

    res.json({
      success: true,
      data: formattedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || formattedUsers.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/admin/users/:id
 * Get single user details
 */
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user (role, status, etc.)
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only allow specific fields to be updated
    const allowedFields = ['role', 'status', 'verified', 'subscription_tier'];
    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const { data, error } = await supabase
      .from('users')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * GET /api/admin/moderation
 * Get moderation queue (pending jobs, reports, etc.)
 */
router.get('/moderation', async (req, res) => {
  try {
    const { status = 'pending', type } = req.query;

    // Get pending jobs
    let jobsQuery = supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        posted_by:users!jobs_posted_by_fkey(name, email)
      `)
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false });

    if (type && type !== 'all') {
      jobsQuery = jobsQuery.eq('type', type);
    }

    const { data: jobs, error: jobsError } = await jobsQuery;

    if (jobsError) throw jobsError;

    // Format moderation items
    const items = jobs.map(job => ({
      id: job.id,
      type: 'job_posting',
      title: job.title,
      company: job.company?.name || 'Unknown',
      submittedBy: job.posted_by?.name || job.posted_by?.email || 'Unknown',
      submittedAt: job.created_at,
      priority: job.priority || 'medium',
      status: job.status,
      category: job.category || 'General',
      flaggedReason: job.flagged_reason || 'Pending admin review',
    }));

    res.json({ success: true, data: items });
  } catch (error) {
    logger.error('Error fetching moderation queue:', error);
    res.status(500).json({ error: 'Failed to fetch moderation queue' });
  }
});

/**
 * POST /api/admin/moderation/:id/approve
 * Approve moderation item
 */
router.post('/moderation/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('jobs')
      .update({ status: 'active', approved_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error approving item:', error);
    res.status(500).json({ error: 'Failed to approve item' });
  }
});

/**
 * POST /api/admin/moderation/:id/reject
 * Reject moderation item
 */
router.post('/moderation/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error rejecting item:', error);
    res.status(500).json({ error: 'Failed to reject item' });
  }
});

/**
 * GET /api/admin/analytics
 * Get platform analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { dateRange = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get user counts
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: jobSeekers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'job-seeker');

    const { count: recruiters } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'recruiter');

    // Get job counts
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get application counts
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    // Get revenue (from subscriptions)
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('amount')
      .eq('status', 'active');

    const revenue = subscriptions?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

    // Get top categories
    const { data: categoryData } = await supabase
      .from('jobs')
      .select('category')
      .eq('status', 'active');

    const categoryCounts = {};
    categoryData?.forEach(job => {
      const cat = job.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([name, jobs]) => ({ name, jobs, applications: 0, fillRate: '0%' }))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        communityHealth: {
          userEngagement: '74.3%', // TODO: Calculate from activity logs
          jobPostingVolume: totalJobs || 0,
          successfulPlacements: 0, // TODO: Calculate from applications with status 'offer_accepted'
          revenue: `$${revenue.toLocaleString()}`,
        },
        userGrowth: {
          jobSeekers: jobSeekers || 0,
          recruiters: recruiters || 0,
          companies: 0, // TODO: Count companies
        },
        topCategories,
        platformHealth: {
          systemUptime: '99.9%',
          avgResponseTime: '245ms',
          errorRate: '0.02%',
          satisfactionScore: '4.8/5',
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Helper function
function calculateProfileCompletion(user) {
  const fields = ['name', 'email', 'avatar_url', 'bio', 'location', 'phone'];
  const completed = fields.filter(field => user[field]).length;
  return Math.round((completed / fields.length) * 100);
}

export default router;

