import express from 'express';
import Stripe from 'stripe';
import axios from 'axios';
import { supabase } from '../lib/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize Stripe Payment Intent
router.post('/stripe/create-intent', async (req, res) => {
    try {
        const { amount, currency, course_id, type } = req.body;
        const user_id = req.user?.id; // Assuming auth middleware sets this

        if (!amount || !user_id) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency: currency || 'usd',
            metadata: {
                user_id,
                course_id,
                type: type || 'general'
            },
        });

        // Pre-record the donation in "pending" status
        const { error: dbError } = await supabase
            .from('donations')
            .insert({
                user_id,
                course_id: course_id || null,
                amount,
                currency: currency || 'usd',
                provider: 'stripe',
                status: 'pending',
                reference: paymentIntent.id,
                type: type || 'general',
                title: `Stripe: ${course_id || 'General'}`
            });

        if (dbError) {
            console.error('Record donation error:', dbError);
            return res.status(500).json({ error: 'Failed to initialize transaction record' });
        }

        res.json({
            clientSecret: paymentIntent.client_secret,
            reference: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe initialization error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Initialize Paystack Transaction
router.post('/paystack/initialize', async (req, res) => {
    try {
        const { amount, email, currency, course_id, type } = req.body;
        const user_id = req.user?.id;

        if (!amount || !email || !user_id) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Paystack integration in GH often only supports GHS. 
        // If USD is requested, we convert to GHS for the payment gateway.
        let finalCurrency = currency || 'GHS';
        let finalAmount = amount;

        if (finalCurrency === 'USD') {
            // Check if we should fallback to GHS (Ghanaian accounts often require this)
            // Using a more accurate rate (approx 14.2 for mid-2024, but keeping it flexible)
            finalCurrency = 'GHS';
            finalAmount = amount * 14.2; 
            console.log(`Paystack: Converting $${amount} USD to ${finalAmount} GHS for GH integration`);
        }

        const exactAmount = Math.round(finalAmount * 100); // Paystack uses kobo/pesewas
        
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email,
            amount: exactAmount,
            currency: finalCurrency,
            // Add a timestamp as a cache buster and debug info
            callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/verify?provider=paystack&courseId=${course_id || ''}&t=${Date.now()}`,
            metadata: {
                custom_fields: [
                    { display_name: "User ID", variable_name: "user_id", value: user_id },
                    { display_name: "Course ID", variable_name: "course_id", value: course_id },
                    { display_name: "Type", variable_name: "type", value: type || 'general' },
                    { display_name: "Original Amount", variable_name: "original_amount", value: `${amount} ${currency || 'USD'}` }
                ]
            }
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const { authorization_url, reference } = response.data.data;

        // Pre-record the donation
        const { error: dbError } = await supabase
            .from('donations')
            .insert({
                user_id,
                course_id: course_id || null,
                amount: finalAmount, // Record the GHS amount
                currency: finalCurrency,
                provider: 'paystack',
                status: 'pending',
                reference,
                type: type || 'general',
                title: `Paystack: ${course_id || 'General'}`
            });

        if (dbError) {
            console.error('Record donation error:', dbError);
            return res.status(500).json({ error: 'Failed to initialize transaction record' });
        }

        res.json({ authorization_url, reference });
    } catch (error) {
        const errorData = error.response?.data;
        console.error('Paystack initialization error:', errorData || error.message);
        
        const msg = errorData?.message || error.message || 'Paystack checkout failed';
        res.status(500).json({ error: msg });
    }
});

// Verify transaction success & update records
router.post('/verify', async (req, res) => {
    const { reference, provider } = req.body;

    if (!reference || !provider) {
        return res.status(400).json({ error: 'Missing reference or provider parameters' });
    }

    try {
        console.log(`[Verify] Initiating verification for ref: ${reference} via ${provider}`);
        
        // Handle invalid placeholders from old client sessions
        if (reference === '{{reference}}' || reference === '{{trxref}}' || !reference) {
            return res.status(400).json({ 
                error: 'Invalid payment reference.', 
                message: 'Your checkout session has expired or is invalid. Please refresh the checkout page and try again.' 
            });
        }

        let isSuccess = false;
        
        if (provider === 'stripe') {
            const intent = await stripe.paymentIntents.retrieve(reference);
            isSuccess = intent.status === 'succeeded';
        } else if (provider === 'paystack') {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
            });
            isSuccess = response.data.data.status === 'success';
        } else {
            return res.status(400).json({ error: 'Invalid provider' });
        }

        if (isSuccess) {
            console.log(`[Verify] Payment success confirmed for ref: ${reference}`);
            // Update donation status
            const { data: updateData, error: updateError } = await supabase
                .from('donations')
                .update({ status: 'completed' })
                .eq('reference', reference)
                .select()
                .single();

            if (updateError) {
                console.error('[Verify] Donation status update failed:', updateError);
                return res.status(500).json({ error: 'Verification succeeded but failed to update record' });
            }

            if (!updateData) {
                console.error('[Verify] No donation record found for reference:', reference);
                return res.status(404).json({ error: 'Donation record not found' });
            }

            // If this is a course enrollment, trigger the enrollment function
            const isCourseEnrollment = updateData.type === 'course_enrollment' || (updateData.metadata?.type === 'course_enrollment');
            
            if (isCourseEnrollment) {
                const cleanCourseId = updateData.course_id || updateData.metadata?.course_id;
                const userId = updateData.user_id;
                console.log(`[Verify] Attempting auto-enrollment for user ${userId} in course ${cleanCourseId}`);
                
                if (cleanCourseId && cleanCourseId !== 'General') {
                    // Check for existing enrollment (check both job_id and course_id columns for safety)
                    const { data: existingApp, error: checkError } = await supabase
                        .from('applications')
                        .select('id')
                        .or(`job_id.eq.${cleanCourseId},course_id.eq.${cleanCourseId}`)
                        .eq('user_id', userId)
                        .maybeSingle();

                    if (!existingApp && !checkError) {
                        const now = new Date().toISOString();
                        const { error: enrollError } = await supabase.from('applications').insert({
                            job_id: cleanCourseId,
                            course_id: cleanCourseId, // Set both for compatibility
                            user_id: userId,
                            student_id: userId, // Set both for compatibility
                            status: 'accepted',
                            enrolled_at: now,
                            applied_at: now,
                            notes: 'Auto-enrolled via verified donation'
                        });
                        
                        if (enrollError) {
                            console.error('[Verify] Auto-enrollment insert failed:', enrollError);
                        } else {
                            console.log('[Verify] Auto-enrollment successful');
                            // Also update donation title to be more descriptive if it was generic
                            await supabase.from('donations')
                                .update({ title: `Course Enrollment: ${cleanCourseId}` })
                                .eq('id', updateData.id);
                        }
                    } else if (checkError) {
                        console.error('[Verify] Error checking existing enrollment:', checkError);
                    } else {
                        console.log('[Verify] User already enrolled, skipping insert.');
                    }
                }
            }
            
            return res.json({ success: true, message: 'Payment verified and access granted.' });
        } else {
            console.warn(`[Verify] Payment status was not successful for ref: ${reference}`);
            return res.json({ success: false, message: 'Payment incomplete.' });
        }

    } catch (error) {
        console.error('[Verify] Unexpected error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Verification failed.', details: error.message });
    }
});

// Paystack Webhook Handler
router.post('/paystack/webhook', async (req, res) => {
    // 1. Verify signature
    const hash = req.headers['x-paystack-signature'];
    if (!hash) return res.sendStatus(400);

    // In production, verify the HMAC SHA512 signature using PAYSTACK_SECRET_KEY
    // const crypto = require('crypto');
    // const expected = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    // if (hash !== expected) return res.sendStatus(400);

    const event = req.body;
    
    if (event.event === 'charge.success') {
        const { reference, metadata, amount, currency } = event.data;
        console.log(`[Webhook] Payment success for ref: ${reference}`);

        // Update donation status
        const { data: updateData, error: updateError } = await supabase
            .from('donations')
            .update({ status: 'completed' })
            .eq('reference', reference)
            .select()
            .single();

        if (updateError) {
            console.error('[Webhook] Update Error:', updateError);
            return res.sendStatus(500);
        }

        // Handle auto-enrollment if applicable
        const type = updateData?.type || metadata?.type || 'general';
        const course_id = updateData?.course_id || metadata?.custom_fields?.find(f => f.variable_name === 'course_id')?.value;
        const user_id = updateData?.user_id || metadata?.custom_fields?.find(f => f.variable_name === 'user_id')?.value;

        if (type === 'course_enrollment' && course_id && user_id) {
            const { data: existingApp } = await supabase
                .from('applications')
                .select('id')
                .eq('job_id', course_id)
                .eq('user_id', user_id)
                .maybeSingle();

            if (!existingApp) {
                await supabase.from('applications').insert({
                    job_id: course_id,
                    user_id: user_id,
                    status: 'accepted',
                    notes: 'Auto-enrolled via Paystack Webhook'
                });
            }
        }
    }

    res.sendStatus(200);
});

export default router;
