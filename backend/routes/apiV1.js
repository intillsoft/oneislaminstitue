/**
 * Enterprise API v1 Router
 * Standardized, versioned endpoints for Recruiters and Partners
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { apiKeyAuth, checkScope } from '../middleware/apiKeyAuth.js';
import { generateEmbedding } from '../services/aiProviderService.js';
import { auditService } from '../services/auditService.js';
import { checkPermission } from '../middleware/checkPermission.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Apply API Key Authentication to ALL v1 routes
router.use(apiKeyAuth);

/**
 * @api {post} /api/v1/jobs Create a Job
 * @apiPermission jobs:write
 */
router.post('/jobs', checkScope('jobs:write'), async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            posted_by: req.user.id,
            source: req.body.source || 'enterprise_api',
            status: 'active'
        };

        // Generate embedding for semantic search
        let embedding = null;
        try {
            const textToEmbed = `${jobData.title} ${jobData.company || ''} ${jobData.location || ''} ${jobData.description || ''}`;
            embedding = await generateEmbedding(textToEmbed);
        } catch (embError) {
            logger.error('API v1: Failed to generate embedding for job:', embError);
        }

        const { data, error } = await supabase
            .from('jobs')
            .insert([{
                ...jobData,
                embedding
            }])
            .select()
            .single();

        if (error) throw error;

        // Log the event for enterprise audit trail
        await auditService.log({
            userId: req.user.id,
            action: 'JOB_POSTED',
            resourceType: 'JOB',
            resourceId: data.id,
            payload: { title: jobData.title, company: jobData.company },
            req
        });

        res.status(201).json({
            success: true,
            data,
            message: 'Job posted successfully via Enterprise API'
        });
    } catch (error) {
        logger.error('API v1: Create job error:', error);
        res.status(500).json({ error: 'Failed to create job', details: error.message });
    }
});

/**
 * @api {get} /api/v1/jobs List Jobs
 * @apiPermission jobs:read
 */
router.get('/jobs', checkScope('jobs:read'), async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const { data, error, count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .eq('posted_by', req.user.id)
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            success: true,
            data,
            pagination: { total: count, limit, offset }
        });
    } catch (error) {
        logger.error('API v1: List jobs error:', error);
        res.status(500).json({ error: 'Failed to list jobs' });
    }
});

/**
 * @api {post} /api/v1/talent/search Semantic Talent Search
 * @apiPermission talent:read
 */
router.post('/talent/search', checkScope('talent:read'), async (req, res) => {
    try {
        const { query, threshold = 0.7, limit = 10 } = req.body;

        if (!query) return res.status(400).json({ error: 'Missing search query' });

        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);

        // Perform vector search
        const { data, error } = await supabase.rpc('match_talent', {
            query_embedding: queryEmbedding,
            match_threshold: threshold,
            match_count: limit
        });

        if (error) throw error;

        res.json({
            success: true,
            results: data || []
        });
    } catch (error) {
        logger.error('API v1: Talent search error:', error);
        res.status(500).json({ error: 'Talent search failed' });
    }
});

/**
 * @api {get} /api/v1/me API Key Information
 */
router.get('/me', async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        },
        scopes: req.scopes
    });
});

export default router;
