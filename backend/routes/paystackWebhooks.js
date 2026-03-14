/**
 * Paystack Webhook Route
 * Handles Paystack events for donations and enrollments
 */

import express from 'express';
import crypto from 'crypto';
import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();
// Paystack uses the Secret Key to sign webhooks by default.
// We look for a specific WEBHOOK_SECRET first, then fallback to the general SECRET_KEY.
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;

router.post('/', async (req, res) => {
    try {
        // Verify signature
        if (!PAYSTACK_WEBHOOK_SECRET) {
            logger.error('PAYSTACK_WEBHOOK_SECRET is missing');
            return res.status(500).send('Configuration Error');
        }

        if (PAYSTACK_WEBHOOK_SECRET.startsWith('http')) {
            logger.error('CRITICAL: PAYSTACK_WEBHOOK_SECRET appears to be a URL instead of a secret key. Signature verification will fail.');
        }

        const hash = crypto.createHmac('sha512', PAYSTACK_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest('hex');
        
        if (hash !== req.headers['x-paystack-signature']) {
            logger.warn('Paystack webhook signature verification failed. Ensure PAYSTACK_WEBHOOK_SECRET matches Paystack dashboard.');
            return res.status(401).send('Unauthorized');
        }

        const event = req.body;
        logger.info(`Received Paystack webhook: ${event.event}`);

        if (event.event === 'charge.success') {
            const data = event.data;
            const reference = data.reference;
            const metadata = data.metadata;
            const userId = metadata?.custom_fields?.find(f => f.variable_name === 'user_id')?.value;
            const courseId = metadata?.custom_fields?.find(f => f.variable_name === 'course_id')?.value;
            const type = metadata?.custom_fields?.find(f => f.variable_name === 'type')?.value;

            logger.info(`Processing Paystack success for reference ${reference}`);

            // Update donation status
            const { data: donation, error: updateError } = await supabase
                .from('donations')
                .update({ status: 'completed' })
                .eq('reference', reference)
                .select()
                .single();

            if (updateError) {
                logger.error('Failed to update donation status in Paystack webhook:', updateError);
            }

            // Handle course enrollment if applicable
            if (type === 'course_enrollment' && courseId && userId) {
                // Check for existing enrollment using both possible column names
                const { data: existingApp } = await supabase
                    .from('applications')
                    .select('id')
                    .or(`course_id.eq.${courseId},job_id.eq.${courseId}`)
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!existingApp) {
                    const { error: enrollError } = await supabase
                        .from('applications')
                        .insert({
                            course_id: courseId,
                            job_id: courseId, // Ensure both are populated for legacy/new compatibility
                            user_id: userId,
                            status: 'accepted',
                            enrolled_at: new RegExp('Z$').test(new Date().toISOString()) ? new Date().toISOString() : new Date().toISOString() + 'Z',
                            notes: 'Auto-enrolled via verified Paystack donation'
                        });

                    if (enrollError) {
                        logger.error('Failed to auto-enroll user after Paystack donation:', enrollError);
                    } else {
                        logger.info(`User ${userId} auto-enrolled in course ${courseId} via Paystack donation`);
                    }
                } else {
                    logger.info(`User ${userId} already enrolled in course ${courseId}, skipping auto-enroll.`);
                }
            }

            // Send donation receipt email
            const { data: user } = await supabase
                .from('users')
                .select('email, name')
                .eq('id', userId || (donation ? donation.user_id : null))
                .single();

            if (user) {
                await sendEmail({
                    to: user.email,
                    subject: 'Donation Received - One Islam Institute',
                    html: `<p>Hello ${user.name || 'User'},</p><p>We have successfully received your donation of ${data.currency} ${(data.amount / 100).toFixed(2)}.</p><p>Thank you for your support!</p>`
                });
            }
        }

        res.sendStatus(200);
    } catch (error) {
        logger.error('Paystack webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

export default router;
