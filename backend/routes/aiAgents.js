/**
 * AI Agent Routes - Backend API for managing AI job search agents
 */

import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';

// Get all agents for current user
router.get('/', authenticate, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error('Error fetching AI agents:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get single agent
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching AI agent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create new agent
router.post('/', authenticate, async (req, res) => {
    try {
        const agentData = {
            user_id: req.user.id,
            name: req.body.name,
            description: req.body.description || '',
            goal: req.body.goal || 'find_jobs',
            job_criteria: req.body.jobCriteria || {},
            actions: req.body.actions || {},
            schedule: req.body.schedule || {},
            intelligence: req.body.intelligence || {},
            status: 'active',
            runs_count: 0,
            last_run: null
        };

        const { data, error } = await supabase
            .from('ai_agents')
            .insert([agentData])
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data,
            message: 'AI agent created successfully'
        });
    } catch (error) {
        console.error('Error creating AI agent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update agent
router.put('/:id', authenticate, async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            description: req.body.description,
            goal: req.body.goal,
            job_criteria: req.body.jobCriteria,
            actions: req.body.actions,
            schedule: req.body.schedule,
            intelligence: req.body.intelligence,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('ai_agents')
            .update(updates)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data,
            message: 'AI agent updated successfully'
        });
    } catch (error) {
        console.error('Error updating AI agent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Toggle agent status (enable/disable)
router.put('/:id/toggle', authenticate, async (req, res) => {
    try {
        // First get current status
        const { data: agent, error: fetchError } = await supabase
            .from('ai_agents')
            .select('schedule')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (fetchError) throw fetchError;

        // Toggle enabled status
        const newSchedule = {
            ...agent.schedule,
            enabled: !agent.schedule.enabled
        };

        const { data, error } = await supabase
            .from('ai_agents')
            .update({
                schedule: newSchedule,
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data,
            message: `Agent ${newSchedule.enabled ? 'activated' : 'paused'} successfully`
        });
    } catch (error) {
        console.error('Error toggling AI agent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete agent
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { error } = await supabase
            .from('ai_agents')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'AI agent deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting AI agent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Run agent manually
router.post('/:id/run', authenticate, async (req, res) => {
    try {
        const { data: agent, error: fetchError } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (fetchError) throw fetchError;

        // Execute agent logic here (search jobs, apply, etc.)
        // This would integrate with job search and auto-apply services

        // Update last run time and runs count
        const { data, error } = await supabase
            .from('ai_agents')
            .update({
                last_run: new Date().toISOString(),
                runs_count: (agent.runs_count || 0) + 1
            })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data,
            message: 'Agent executed successfully'
        });
    } catch (error) {
        console.error('Error running AI agent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get agent analytics
router.get('/:id/analytics', authenticate, async (req, res) => {
    try {
        // Get agent execution logs and stats
        const { data: agent } = await supabase
            .from('ai_agents')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        const analytics = {
            totalRuns: agent.runs_count || 0,
            lastRun: agent.last_run,
            status: agent.schedule?.enabled ? 'active' : 'paused',
            jobsFound: 0, // Would come from execution logs
            applicationsSubmitted: 0 // Would come from execution logs
        };

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Error fetching agent analytics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
