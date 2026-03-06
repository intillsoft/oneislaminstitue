/**
 * Talent Marketplace API Routes
 * Handles all talent marketplace operations
 */

import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateEmbedding } from '../services/aiProviderService.js';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in talent.js. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// ============================================================================
// TALENT PROFILE ROUTES
// ============================================================================

/**
 * GET /api/talent/profile/:id
 * Get talent profile by ID or user_id
 */
router.get('/profile/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Try to get by talent id first, then by user_id
    let query = supabase
      .from('talents')
      .select(`
        *,
        user:users(id, name, email, avatar_url)
      `);

    // Check if id is a UUID format (talent id) or try user_id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUUID) {
      query = query.eq('id', id);
    } else {
      // Try user_id
      query = query.eq('user_id', id);
    }

    const { data: talent, error } = await query.single();

    // Handle case where profile doesn't exist
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist - return success with null data (not 404)
      // This allows frontend to show create form instead of error
      return res.json({
        success: true,
        data: null,
        message: 'Talent profile not found',
      });
    }

    if (error) throw error;
    if (!talent) {
      // Profile doesn't exist - return success with null data
      return res.json({
        success: true,
        data: null,
        message: 'Talent profile not found',
      });
    }

    // Get talent's gigs (use talent.id from the query result)
    const talentId = talent.id;
    const { data: gigs } = await supabase
      .from('gigs')
      .select('*')
      .eq('talent_id', talentId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Get reviews
    const { data: reviews } = await supabase
      .from('talent_reviews')
      .select(`
        *,
        reviewer:users(id, name, avatar_url)
      `)
      .eq('talent_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...talent,
        gigs: gigs || [],
        reviews: reviews || [],
      },
    });
  } catch (error) {
    logger.error('Error fetching talent profile:', error);
    res.status(500).json({ error: 'Failed to fetch talent profile', message: error.message });
  }
});

/**
 * POST /api/talent/profile
 * Create or update talent profile
 */
router.post('/profile', authenticate, async (req, res) => {
  try {
    const {
      title,
      bio,
      hourly_rate,
      profile_picture_url,
      cover_image_url,
      skills,
      experience_level,
      languages,
      availability,
      response_time,
      id, // If provided, verify ownership
    } = req.body;

    // If id is provided, verify ownership before updating
    if (id) {
      const { data: existingProfile } = await supabase
        .from('talents')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingProfile) {
        return res.status(404).json({ error: 'Talent profile not found' });
      }

      if (existingProfile.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized: You can only edit your own profile' });
      }
    }

    // Check if talent profile exists for this user
    const { data: existing } = await supabase
      .from('talents')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const talentData = {
      user_id: req.user.id,
      title: title || 'Freelancer',
      bio,
      hourly_rate,
      profile_picture_url,
      cover_image_url,
      skills: skills || [],
      experience_level: experience_level || 'intermediate',
      languages: languages || [],
      availability: availability || 'available',
      response_time: response_time || 24,
    };

    let result;
    if (existing) {
      // Update existing - ensure user owns it
      if (id && existing.id !== id) {
        return res.status(403).json({ error: 'Unauthorized: Profile ID mismatch' });
      }

      const { data, error } = await supabase
        .from('talents')
        .update(talentData)
        .eq('id', existing.id)
        .eq('user_id', req.user.id) // Double-check ownership
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('talents')
        .insert(talentData)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    // Update the USER record with the embedding for semantic search
    try {
      const textToEmbed = `${result.title || 'Freelancer'} - ${result.skills?.join(', ') || ''} - ${result.bio || ''}`;
      const embeddingArr = await generateEmbedding(textToEmbed);

      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ embedding: embeddingArr })
        .eq('id', req.user.id);

      if (userUpdateError) throw userUpdateError;
      logger.info(`Updated user embedding for talent: ${req.user.id}`);
    } catch (embError) {
      logger.error('Failed to update user embedding for talent:', embError);
      // Non-blocking
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error creating/updating talent profile:', error);
    res.status(500).json({ error: 'Failed to save talent profile', message: error.message });
  }
});

// ============================================================================
// GIGS ROUTES
// ============================================================================

/**
 * GET /api/talent/gigs
 * Get all gigs (with filters)
 */
router.get('/gigs', optionalAuth, async (req, res) => {
  try {
    const {
      talent_id,
      category,
      min_price,
      max_price,
      search,
      is_active,
      page = 1,
      pageSize = 20,
    } = req.query;

    // If no talent_id specified, check if user wants their own gigs
    let effectiveTalentId = talent_id;
    if (!talent_id && req.user) {
      // Check if user is a talent and wants their own gigs
      const { data: talent } = await supabase
        .from('talents')
        .select('id')
        .eq('user_id', req.user.id)
        .single();

      if (talent) {
        effectiveTalentId = talent.id;
      }
    }

    let query = supabase
      .from('gigs')
      .select(`
        *,
        talent:talents(
          id,
          title,
          rating,
          total_reviews,
          user:users(id, name, avatar_url)
        )
      `)
      .order('created_at', { ascending: false });

    // Only filter by is_active if specified, otherwise show all for own gigs
    if (is_active !== null && is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true' || is_active === true);
    } else if (!effectiveTalentId || effectiveTalentId !== talent_id) {
      // For marketplace, only show active gigs
      query = query.eq('is_active', true);
    }

    if (effectiveTalentId) {
      query = query.eq('talent_id', effectiveTalentId);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (min_price) {
      query = query.gte('price', min_price);
    }

    if (max_price) {
      query = query.lte('price', max_price);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: count || 0,
      },
    });
  } catch (error) {
    logger.error('Error fetching gigs:', error);
    res.status(500).json({ error: 'Failed to fetch gigs', message: error.message });
  }
});

/**
 * GET /api/talent/gigs/:id
 * Get gig by ID
 */
router.get('/gigs/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: gig, error } = await supabase
      .from('gigs')
      .select(`
        *,
        talent:talents(
          id,
          title,
          rating,
          total_reviews,
          response_time,
          user:users(id, name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Get reviews for this gig
    const { data: reviews } = await supabase
      .from('gig_orders')
      .select(`
        buyer_rating,
        buyer_review,
        buyer:users(id, name, avatar_url),
        created_at
      `)
      .eq('gig_id', id)
      .not('buyer_rating', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...gig,
        reviews: reviews || [],
      },
    });
  } catch (error) {
    logger.error('Error fetching gig:', error);
    res.status(500).json({ error: 'Failed to fetch gig', message: error.message });
  }
});

/**
 * POST /api/talent/gigs
 * Create new gig
 */
router.post('/gigs', authenticate, async (req, res) => {
  try {
    // Check if user has talent profile
    const { data: talent } = await supabase
      .from('talents')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!talent) {
      return res.status(400).json({ error: 'Please create a talent profile first' });
    }

    const {
      title,
      description,
      category,
      subcategory,
      price,
      delivery_time,
      revisions,
      images,
      tags,
    } = req.body;

    const { data: gig, error } = await supabase
      .from('gigs')
      .insert({
        talent_id: talent.id,
        title,
        description,
        category,
        subcategory,
        price,
        delivery_time,
        revisions: revisions || 1,
        images: images || [],
        tags: tags || [],
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: gig,
    });
  } catch (error) {
    logger.error('Error creating gig:', error);
    res.status(500).json({ error: 'Failed to create gig', message: error.message });
  }
});

/**
 * PUT /api/talent/gigs/:id
 * Update gig
 */
router.put('/gigs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership - get gig with talent info
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select(`
        id,
        talent_id,
        talent:talents!inner(id, user_id)
      `)
      .eq('id', id)
      .single();

    if (gigError || !gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Check if user owns the talent profile
    if (!gig.talent || gig.talent.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only edit your own gigs' });
    }

    const { data: updatedGig, error } = await supabase
      .from('gigs')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: updatedGig,
    });
  } catch (error) {
    logger.error('Error updating gig:', error);
    res.status(500).json({ error: 'Failed to update gig', message: error.message });
  }
});

/**
 * DELETE /api/talent/gigs/:id
 * Delete gig (soft delete by setting is_active = false)
 */
router.delete('/gigs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership - get gig with talent info
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select(`
        id,
        talent_id,
        talent:talents!inner(id, user_id)
      `)
      .eq('id', id)
      .single();

    if (gigError || !gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Check if user owns the talent profile
    if (!gig.talent || gig.talent.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own gigs' });
    }

    const { error } = await supabase
      .from('gigs')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Gig deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting gig:', error);
    res.status(500).json({ error: 'Failed to delete gig', message: error.message });
  }
});

// ============================================================================
// ORDERS ROUTES
// ============================================================================

/**
 * GET /api/talent/orders
 * Get orders (for buyer or talent)
 */
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { role, status } = req.query;

    // Check if user is a talent
    const { data: talent } = await supabase
      .from('talents')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    // Default role: if user is talent, default to 'talent', otherwise 'buyer'
    const defaultRole = talent ? 'talent' : 'buyer';
    const effectiveRole = role || defaultRole;

    let query = supabase
      .from('gig_orders')
      .select(`
        *,
        gig:gigs(id, title, images, talent_id),
        buyer:users!gig_orders_buyer_id_fkey(id, name, email, avatar_url),
        talent:talents!gig_orders_talent_id_fkey(id, title, user:users(id, name, avatar_url))
      `)
      .order('created_at', { ascending: false });

    if (effectiveRole === 'buyer') {
      query = query.eq('buyer_id', req.user.id);
    } else {
      // Get talent_id from user_id
      if (!talent) {
        return res.json({ success: true, data: [] });
      }

      query = query.eq('talent_id', talent.id);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

/**
 * POST /api/talent/orders
 * Create new order
 */
router.post('/orders', authenticate, async (req, res) => {
  try {
    const { gig_id, title, description, price } = req.body;

    // Get gig and talent info
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('*, talent:talents(id)')
      .eq('id', gig_id)
      .single();

    if (gigError || !gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const { data: order, error } = await supabase
      .from('gig_orders')
      .insert({
        gig_id,
        buyer_id: req.user.id,
        talent_id: gig.talent.id,
        title: title || gig.title,
        description: description || gig.description,
        price: price || gig.price,
        delivery_date: new Date(Date.now() + gig.delivery_time * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

/**
 * PUT /api/talent/orders/:id
 * Update order status
 */
router.put('/orders/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, buyer_rating, buyer_review } = req.body;

    // Verify ownership
    const { data: order } = await supabase
      .from('gig_orders')
      .select('buyer_id, talent_id, talents!inner(user_id)')
      .eq('id', id)
      .single();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isBuyer = order.buyer_id === req.user.id;
    const isTalent = order.talents.user_id === req.user.id;

    if (!isBuyer && !isTalent) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData = {};
    if (status && (isTalent || (isBuyer && status === 'cancelled'))) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completed_date = new Date().toISOString();
      }
    }

    if (buyer_rating && isBuyer) {
      updateData.buyer_rating = buyer_rating;
      updateData.buyer_review = buyer_review;
    }

    const { data: updatedOrder, error } = await supabase
      .from('gig_orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create review if rating provided
    if (buyer_rating && isBuyer) {
      await supabase
        .from('talent_reviews')
        .upsert({
          talent_id: order.talent_id,
          reviewer_id: req.user.id,
          rating: buyer_rating,
          review: buyer_review,
          order_id: id,
        });
    }

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    logger.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order', message: error.message });
  }
});

// ============================================================================
// MESSAGES ROUTES
// ============================================================================

/**
 * GET /api/talent/messages
 * Get conversations
 */
router.get('/messages', authenticate, async (req, res) => {
  try {
    const { conversation_with } = req.query;

    let query = supabase
      .from('talent_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (conversation_with) {
      // Get messages between current user and conversation_with user
      query = query.or(`and(sender_id.eq.${req.user.id},receiver_id.eq.${conversation_with}),and(sender_id.eq.${conversation_with},receiver_id.eq.${req.user.id})`);
    } else {
      // Get all messages where user is sender or receiver
      query = query.or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
  }
});

/**
 * POST /api/talent/messages
 * Send message
 */
router.post('/messages', authenticate, async (req, res) => {
  try {
    const { receiver_id, message } = req.body;

    if (receiver_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    const { data: newMessage, error } = await supabase
      .from('talent_messages')
      .insert({
        sender_id: req.user.id,
        receiver_id,
        message,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

// ============================================================================
// TALENT DISCOVERY ROUTES
// ============================================================================

/**
 * GET /api/talent/discover
 * Discover talents (search and filter)
 */
router.get('/discover', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      skills,
      min_rating,
      max_hourly_rate,
      availability,
      experience_level,
      page = 1,
      pageSize = 20,
    } = req.query;

    let query = supabase
      .from('talents')
      .select(`
        *,
        user:users(id, name, email, avatar_url)
      `)
      .order('rating', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      query = query.contains('skills', skillArray);
    }

    if (min_rating) {
      query = query.gte('rating', min_rating);
    }

    if (max_hourly_rate) {
      query = query.lte('hourly_rate', max_hourly_rate);
    }

    if (availability) {
      query = query.eq('availability', availability);
    }

    if (experience_level) {
      query = query.eq('experience_level', experience_level);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: count || 0,
      },
    });
  } catch (error) {
    logger.error('Error discovering talents:', error);
    res.status(500).json({ error: 'Failed to discover talents', message: error.message });
  }
});

// ============================================================================
// DASHBOARD ROUTES
// ============================================================================

/**
 * GET /api/talent/dashboard
 * Get talent dashboard stats
 */
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    // Get talent profile
    const { data: talent } = await supabase
      .from('talents')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!talent) {
      return res.json({
        success: true,
        data: {
          hasProfile: false,
          stats: {},
        },
      });
    }

    const talentId = talent.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get orders stats
    const { data: allOrders } = await supabase
      .from('gig_orders')
      .select('status, price, completed_date, created_at')
      .eq('talent_id', talentId);

    const totalEarnings = allOrders
      ?.filter(o => o.status === 'completed')
      ?.reduce((sum, o) => sum + parseFloat(o.price || 0), 0) || 0;

    const earningsThisMonth = allOrders
      ?.filter(o => o.status === 'completed' && new Date(o.completed_date) >= startOfMonth)
      ?.reduce((sum, o) => sum + parseFloat(o.price || 0), 0) || 0;

    const earningsThisYear = allOrders
      ?.filter(o => o.status === 'completed' && new Date(o.completed_date) >= startOfYear)
      ?.reduce((sum, o) => sum + parseFloat(o.price || 0), 0) || 0;

    // Get gigs count
    const { count: activeGigsCount } = await supabase
      .from('gigs')
      .select('*', { count: 'exact', head: true })
      .eq('talent_id', talentId)
      .eq('is_active', true);

    // Get orders counts
    const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0;
    const inProgressOrders = allOrders?.filter(o => o.status === 'in_progress').length || 0;
    const completedOrders = allOrders?.filter(o => o.status === 'completed').length || 0;

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('gig_orders')
      .select(`
        *,
        gig:gigs(id, title, images),
        buyer:users(id, name, avatar_url)
      `)
      .eq('talent_id', talentId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get top performing gigs
    const { data: topGigs } = await supabase
      .from('gigs')
      .select('id, title, rating, total_orders, price, images')
      .eq('talent_id', talentId)
      .eq('is_active', true)
      .order('total_orders', { ascending: false })
      .limit(5);

    // Get recent reviews
    const { data: recentReviews } = await supabase
      .from('talent_reviews')
      .select(`
        *,
        reviewer:users(id, name, avatar_url)
      `)
      .eq('talent_id', talentId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate response rate (mock for now)
    const responseRate = 95; // TODO: Calculate from actual message response times

    // Calculate profile completion
    const { data: talentProfile } = await supabase
      .from('talents')
      .select('*')
      .eq('id', talentId)
      .single();

    let profileCompletion = 0;
    if (talentProfile) {
      const fields = ['title', 'bio', 'hourly_rate', 'profile_picture_url', 'skills', 'experience_level'];
      const filledFields = fields.filter(f => {
        const value = talentProfile[f];
        return value !== null && value !== undefined && value !== '' &&
          (Array.isArray(value) ? value.length > 0 : true);
      }).length;
      profileCompletion = Math.round((filledFields / fields.length) * 100);
    }

    res.json({
      success: true,
      data: {
        hasProfile: true,
        stats: {
          totalEarnings,
          earningsThisMonth,
          earningsThisYear,
          activeGigs: activeGigsCount || 0,
          totalOrders: allOrders?.length || 0,
          pendingOrders,
          inProgressOrders,
          completedOrders,
          averageRating: talentProfile?.rating || 0,
          totalReviews: talentProfile?.total_reviews || 0,
          responseRate,
          profileCompletion,
        },
        recentOrders: recentOrders || [],
        topGigs: topGigs || [],
        recentReviews: recentReviews || [],
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', message: error.message });
  }
});

/**
 * GET /api/talent/dashboard/stats
 * Get talent dashboard stats (simplified version)
 */
router.get('/dashboard/stats', authenticate, async (req, res) => {
  try {
    const { user } = req;

    // Fetch talent profile
    const { data: talentProfile, error: talentError } = await supabase
      .from('talents')
      .select('id, user_id, rating, total_reviews')
      .eq('user_id', user.id)
      .single();

    if (talentError || !talentProfile) {
      return res.status(404).json({ error: 'Talent profile not found' });
    }

    const talent_id = talentProfile.id;

    // Fetch stats in parallel
    const [
      activeGigsCountResult,
      totalOrdersCountResult,
      pendingOrdersCountResult,
      completedOrdersCountResult,
      earningsResult,
    ] = await Promise.all([
      supabase.from('gigs').select('id', { count: 'exact', head: true }).eq('talent_id', talent_id).eq('is_active', true),
      supabase.from('gig_orders').select('id', { count: 'exact', head: true }).eq('talent_id', talent_id),
      supabase.from('gig_orders').select('id', { count: 'exact', head: true }).eq('talent_id', talent_id).eq('status', 'pending'),
      supabase.from('gig_orders').select('id', { count: 'exact', head: true }).eq('talent_id', talent_id).eq('status', 'completed'),
      supabase.from('gig_orders').select('price, completed_date').eq('talent_id', talent_id).eq('status', 'completed'),
    ]);

    const totalEarnings = earningsResult.data?.reduce((sum, order) => sum + parseFloat(order.price || 0), 0) || 0;

    res.json({
      success: true,
      data: {
        totalEarnings: totalEarnings,
        activeGigs: activeGigsCountResult.count || 0,
        totalOrders: totalOrdersCountResult.count || 0,
        pendingOrders: pendingOrdersCountResult.count || 0,
        completedOrders: completedOrdersCountResult.count || 0,
        averageRating: talentProfile.rating || 0,
        totalReviews: talentProfile.total_reviews || 0,
        responseRate: 95, // Example
        profileCompletion: 80, // Example
      },
    });
  } catch (error) {
    logger.error('Error fetching talent dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', message: error.message });
  }
});

/**
 * GET /api/talent/conversations
 * Get all conversations for the current user
 */
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { user } = req;

    // Get all unique conversations (users who have messaged or been messaged by current user)
    const { data: sentMessages } = await supabase
      .from('talent_messages')
      .select('receiver_id, message, created_at, is_read')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    const { data: receivedMessages } = await supabase
      .from('talent_messages')
      .select('sender_id, message, created_at, is_read')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    // Combine and get unique user IDs
    const userIds = new Set();
    sentMessages?.forEach(m => userIds.add(m.receiver_id));
    receivedMessages?.forEach(m => userIds.add(m.sender_id));

    // Get user details for each conversation
    const conversations = await Promise.all(
      Array.from(userIds).map(async (otherUserId) => {
        const lastSent = sentMessages?.find(m => m.receiver_id === otherUserId);
        const lastReceived = receivedMessages?.find(m => m.sender_id === otherUserId);

        // Determine last message
        let lastMessage = null;
        let lastMessageTime = null;
        if (lastSent && lastReceived) {
          if (new Date(lastSent.created_at) > new Date(lastReceived.created_at)) {
            lastMessage = lastSent.message;
            lastMessageTime = lastSent.created_at;
          } else {
            lastMessage = lastReceived.message;
            lastMessageTime = lastReceived.created_at;
          }
        } else if (lastSent) {
          lastMessage = lastSent.message;
          lastMessageTime = lastSent.created_at;
        } else if (lastReceived) {
          lastMessage = lastReceived.message;
          lastMessageTime = lastReceived.created_at;
        }

        // Count unread messages
        const unreadCount = receivedMessages?.filter(m => m.sender_id === otherUserId && !m.is_read).length || 0;

        // Get user info
        const { data: otherUser } = await supabase
          .from('users')
          .select('id, name, avatar_url')
          .eq('id', otherUserId)
          .single();

        return {
          other_user_id: otherUserId,
          other_user_name: otherUser?.name || 'Unknown',
          other_user_avatar: otherUser?.avatar_url,
          last_message: lastMessage,
          last_message_time: lastMessageTime,
          unread_count: unreadCount,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      if (!a.last_message_time) return 1;
      if (!b.last_message_time) return -1;
      return new Date(b.last_message_time) - new Date(a.last_message_time);
    });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations', message: error.message });
  }
});

/**
 * POST /api/talent/orders/:id/deliver
 * Deliver an order
 */
router.post('/orders/:id/deliver', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { files, message } = req.body;

    // Verify order belongs to talent
    const { data: order, error: orderError } = await supabase
      .from('gig_orders')
      .select('*, talent:talents!gig_orders_talent_id_fkey(user_id)')
      .eq('id', id)
      .single();

    if (orderError) throw orderError;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is the talent
    if (order.talent?.user_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update order status to completed
    const { data: updatedOrder, error: updateError } = await supabase
      .from('gig_orders')
      .update({
        status: 'completed',
        completed_date: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    logger.error('Error delivering order:', error);
    res.status(500).json({ error: 'Failed to deliver order', message: error.message });
  }
});

export default router;
