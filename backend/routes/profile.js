/**
 * Profile API Routes
 * Handles user profile operations including role change requests
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { supabase } from '../lib/supabase.js';
import { auditService } from '../services/auditService.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * POST /api/profile/request-role-change
 * Request a role change (talent or recruiter)
 */
router.post('/request-role-change', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { requested_role, reason, talent_data, recruiter_data } = req.body;

    if (!['talent', 'recruiter'].includes(requested_role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "talent" or "recruiter"' });
    }

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide a reason (at least 10 characters)' });
    }

    // Check if user already has this role
    const { data: currentProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (currentProfile?.role === requested_role) {
      return res.status(400).json({ error: `You already have the ${requested_role} role` });
    }

    // Check if there's already a pending request
    const { data: existingRequest } = await supabase
      .from('role_change_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending role change request' });
    }

    // Create role change request
    const { data: request, error } = await supabase
      .from('role_change_requests')
      .insert({
        user_id: user.id,
        requested_role,
        reason,
        talent_data: talent_data || null,
        recruiter_data: recruiter_data || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: request,
      message: 'Role change request submitted successfully. An admin will review it soon.',
    });
  } catch (error) {
    logger.error('Error creating role change request:', error);
    res.status(500).json({ error: 'Failed to submit role change request', message: error.message });
  }
});

/**
 * GET /api/profile/role-change-requests
 * Get all role change requests (admin only)
 */
router.get('/role-change-requests', authenticate, async (req, res) => {
  try {
    const { user } = req;

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    const { data: requests, error } = await supabase
      .from('role_change_requests')
      .select(`
        *,
        user:users(id, name, email, avatar_url, role)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: requests || [],
    });
  } catch (error) {
    logger.error('Error fetching role change requests:', error);
    res.status(500).json({ error: 'Failed to fetch role change requests', message: error.message });
  }
});

/**
 * PUT /api/profile/role-change-requests/:id/approve
 * Approve a role change request (admin only)
 */
router.put('/role-change-requests/:id/approve', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    // Get the request
    const { data: request, error: requestError } = await supabase
      .from('role_change_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (requestError) throw requestError;
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request is not pending' });
    }

    // Update user role
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: request.requested_role })
      .eq('id', request.user_id);

    if (updateError) throw updateError;

    // If talent role, create talent profile
    if (request.requested_role === 'talent' && request.talent_data) {
      const { error: talentError } = await supabase
        .from('talents')
        .upsert({
          user_id: request.user_id,
          ...request.talent_data,
        }, {
          onConflict: 'user_id',
        });

      if (talentError) {
        logger.error('Error creating talent profile:', talentError);
        // Don't fail the request, just log the error
      }
    }

    // Update request status
    const { error: statusError } = await supabase
      .from('role_change_requests')
      .update({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (statusError) throw statusError;

    res.json({
      success: true,
      message: 'Role change request approved successfully',
    });
  } catch (error) {
    logger.error('Error approving role change request:', error);
    res.status(500).json({ error: 'Failed to approve role change request', message: error.message });
  }
});

/**
 * PUT /api/profile/role-change-requests/:id/reject
 * Reject a role change request (admin only)
 */
router.put('/role-change-requests/:id/reject', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { rejection_reason } = req.body;

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    // Update request status
    const { error } = await supabase
      .from('role_change_requests')
      .update({
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejection_reason || null,
      })
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Role change request rejected',
    });
  } catch (error) {
    logger.error('Error rejecting role change request:', error);
    res.status(500).json({ error: 'Failed to reject role change request', message: error.message });
  }
});

/**
 * GET /api/profile/api-keys
 * Get all API keys for the current user
 */
router.get('/api-keys', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, last_four, scopes, is_active, last_used_at, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

/**
 * POST /api/profile/api-keys
 * Generate a new API key
 */
router.post('/api-keys', authenticate, async (req, res) => {
  try {
    const { name, scopes } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required for the integration' });

    // Generate a secure API key
    const rawKey = `wf_${crypto.randomBytes(32).toString('hex')}`;
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    const lastFour = rawKey.slice(-4);

    const { data: keyRecord, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: req.user.id,
        name,
        key_hash: hashedKey,
        last_four: lastFour,
        scopes: scopes || ['jobs:read'],
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    // Return the RAW KEY only once
    // Log the event for enterprise audit trail
    await auditService.log({
      userId: req.user.id,
      action: 'API_KEY_GENERATED',
      resourceType: 'API_KEY',
      resourceId: keyRecord.id,
      payload: { name: keyRecord.name, lastFour },
      req
    });

    res.status(201).json({
      success: true,
      data: {
        ...keyRecord,
        api_key: rawKey // ONLY time this is shown
      },
      message: 'API Key generated. Save it now, it will not be shown again.'
    });
  } catch (error) {
    logger.error('Error generating API key:', error);
    res.status(500).json({ error: 'Failed to generate API key' });
  }
});

export default router;










