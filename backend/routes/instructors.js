/**
 * Instructor API Routes
 * Handles instructor-specific operations
 */

import express from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to check instructor role
const requireInstructor = async (req, res, next) => {
    try {
        const { role } = req.user;
        if (role !== 'instructor' && role !== 'recruiter' && role !== 'admin') {
            return res.status(403).json({ error: 'Instructor access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.use(authenticate);
router.use(requireInstructor);

/**
 * GET /api/instructor/dashboard
 * Get instructor dashboard stats
 */
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.id;

        // Get courses counts
        const { count: activeCourses } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('posted_by', userId)
            .eq('status', 'active');

        // Get total enrollments for instructor's courses
        const { data: courses } = await supabase
            .from('jobs')
            .select('id')
            .eq('posted_by', userId);

        const courseIds = courses?.map(c => c.id) || [];

        const { count: totalEnrollments } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .in('job_id', courseIds);

        res.json({
            success: true,
            data: {
                activeCourses: activeCourses || 0,
                totalEnrollments: totalEnrollments || 0,
                newEnrollments: 0,
                activeStudents: 0,
            }
        });
    } catch (error) {
        logger.error('Instructor dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
});

/**
 * GET /api/instructor/courses
 * Get instructor's course postings
 */
router.get('/courses', async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        let query = supabase
            .from('jobs')
            .select(`
                *,
                enrollments:applications(count)
            `)
            .eq('posted_by', userId)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        logger.error('Instructor courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

/**
 * GET /api/instructor/courses/:courseId/students
 * Get students for a specific course
 */
router.get('/courses/:courseId/students', async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        // Verify course ownership
        const { data: course } = await supabase
            .from('jobs')
            .select('posted_by')
            .eq('id', courseId)
            .single();

        if (!course || (course.posted_by !== userId && req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { data: students, error } = await supabase
            .from('applications')
            .select(`
                *,
                user:users(id, name, email, avatar_url, location)
            `)
            .eq('job_id', courseId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data: students });
    } catch (error) {
        logger.error('Instructor students error:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

/**
 * PUT /api/instructor/settings
 * Update instructor department/institute info
 */
router.put('/settings', async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        logger.error('Instructor settings update error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
