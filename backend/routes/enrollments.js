/**
 * Enrollment Routes
 * Protected routes for student enrollments
 */

import express from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { notificationService } from '../services/notificationService.js';

dotenv.config();

const router = express.Router();


/**
 * GET /api/enrollments
 * Get user enrollments
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { role } = req.user;
        const { status, course_id } = req.query;

        if (!supabase) {
            logger.error('Enrollment GET: Supabase not initialized (missing credentials)');
            return res.json({ success: true, data: [], warning: 'Database connection unavailable' });
        }

        // Try the joined query first
        let { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                course:jobs(*)
            `)
            .or(`user_id.eq.${userId},student_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        // If joined query fails due to missing relationship, fallback to manual join
        if (error && error.code === 'PGRST201') {
            logger.warn('Enrollment join failed, falling back to manual fetch:', error.message);
            
            let query = supabase.from('applications').select('*');
            
            if (role !== 'admin') {
                query = query.or(`user_id.eq.${userId},student_id.eq.${userId}`);
            }

            const { data: apps, error: appError } = await query.order('created_at', { ascending: false });
            if (appError) throw appError;

            if (apps && apps.length > 0) {
                const jobIds = [...new Set(apps.map(a => a.job_id || a.course_id).filter(Boolean))];
                const { data: jobs } = await supabase.from('jobs').select('*').in('id', jobIds);
                
                data = apps.map(app => ({
                    ...app,
                    course: jobs?.find(j => j.id === (app.job_id || app.course_id)) || null
                }));
            } else {
                data = [];
            }
        } else if (error) {
            throw error;
        }

        // Apply filters in memory
        let filteredData = data || [];
        if (status) {
            filteredData = filteredData.filter(d => d.status === status);
        }
        if (course_id) {
            filteredData = filteredData.filter(d => (d.job_id === course_id || d.course_id === course_id));
        }

        res.json({ success: true, data: filteredData });
    } catch (error) {
        logger.error('Error fetching enrollments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch enrollments', message: error.message });
    }
});

/**
 * POST /api/enrollments
 * Submit new enrollment
 */
router.post('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollmentData = {
            ...req.body,
            user_id: userId,
            status: req.body.status || 'enrolled',
            enrolled_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('applications')
            .insert([enrollmentData])
            .select()
            .single();

        if (error) throw error;

        // Send Notification
        try {
            const { data: course } = await supabase
                .from('jobs')
                .select('title')
                .eq('id', enrollmentData.job_id || enrollmentData.course_id)
                .single();
            
            await notificationService.create(userId, {
                title: 'Course Enrolled',
                message: `You have successfully enrolled in: ${course?.title || 'a new course'}. Welcome!`,
                type: 'ENROLLMENT',
                data: { course_id: enrollmentData.job_id || enrollmentData.course_id }
            });
        } catch (notifError) {
            logger.warn('Failed to send enrollment notification:', notifError);
        }

        // Log activity
        try {
            await supabase.rpc('log_activity', {
                p_user_id: userId,
                p_action: 'COURSE_ENROLLED',
                p_entity_type: 'ENROLLMENT',
                p_entity_id: data.id,
                p_metadata: { course_id: data.job_id }
            });
        } catch (logError) {
            logger.warn('Failed to log enrollment activity:', logError);
        }

        res.status(201).json({ success: true, data });
    } catch (error) {
        logger.error('Error creating enrollment:', error);
        res.status(500).json({ success: false, error: 'Failed to submit enrollment' });
    }
});

/**
 * GET /api/enrollments/:id
 * Get single enrollment details
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                course:jobs(*, department:companies(*)),
                student_profile:resumes(title)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Enrollment not found' });

        // Check permission: only student or admin can view
        if (data.user_id !== userId && req.user.role !== 'admin') {
            // Check if user is an instructor for this course
            const { data: course } = await supabase
                .from('jobs')
                .select('posted_by')
                .eq('id', data.job_id)
                .single();

            if (course?.posted_by !== userId) {
                return res.status(403).json({ error: 'Unauthorized to view this enrollment' });
            }
        }

        res.json({ success: true, data });
    } catch (error) {
        logger.error('Error fetching enrollment details:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch enrollment details' });
    }
});

export default router;

