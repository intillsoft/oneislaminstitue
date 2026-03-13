/**
 * Stripe Webhook Handler
 * Handles Stripe webhook events
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { sendEmail } from './emailService.js';

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('❌ webhookHandler: SUPABASE CREDENTIALS MISSING!');
}

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Handle webhook event
 */
export async function handleWebhook(event) {
  try {
    logger.info(`Processing webhook: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialEnding(event.data.object);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  } catch (error) {
    logger.error('Webhook handler error:', error);
    throw error;
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;

  if (!userId || !tier) {
    logger.warn('Missing metadata in checkout session');
    return;
  }

  // Get subscription from Stripe
  const subscriptionId = session.subscription;
  if (!subscriptionId) {
    logger.warn('No subscription ID in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update database
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscriptionId,
      plan: tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, {
      onConflict: 'user_id',
    });

  // Update user subscription tier
  await supabase
    .from('users')
    .update({ subscription_tier: tier })
    .eq('id', userId);

  // Send welcome email
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', userId)
    .single();

  if (user) {
    await sendEmail({
      to: user.email,
      template: 'subscription-activated',
      data: {
        name: user.name,
        tier,
      },
    });
  }

  logger.info(`Subscription activated for user ${userId}`);
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;

  // Find user by customer ID
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!sub) {
    logger.warn(`No user found for customer ${customerId}`);
    return;
  }

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price?.id;
  const tier = getTierFromPriceId(priceId) || 'free';

  // Update subscription
  await supabase
    .from('subscriptions')
    .update({
      plan: tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_customer_id', customerId);

  // Update user tier
  await supabase
    .from('users')
    .update({ subscription_tier: tier })
    .eq('id', sub.user_id);

  logger.info(`Subscription updated for user ${sub.user_id}`);
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!sub) {
    return;
  }

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_customer_id', customerId);

  // Downgrade user to free
  await supabase
    .from('users')
    .update({ subscription_tier: 'free' })
    .eq('id', sub.user_id);

  // Send cancellation email
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', sub.user_id)
    .single();

  if (user) {
    await sendEmail({
      to: user.email,
      template: 'subscription-canceled',
      data: {
        name: user.name,
      },
    });
  }

  logger.info(`Subscription canceled for user ${sub.user_id}`);
}

/**
 * Handle payment succeeded
 */
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!sub) {
    return;
  }

  // Send payment confirmation email
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', sub.user_id)
    .single();

  if (user) {
    await sendEmail({
      to: user.email,
      template: 'payment-confirmation',
      data: {
        name: user.name,
        amount: (invoice.amount_paid / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
      },
    });
  }
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!sub) {
    return;
  }

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_customer_id', customerId);

  // Send payment failed email
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', sub.user_id)
    .single();

  if (user) {
    await sendEmail({
      to: user.email,
      template: 'payment-failed',
      data: {
        name: user.name,
        amount: (invoice.amount_due / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        retryUrl: `${process.env.FRONTEND_URL}/billing/retry-payment`,
      },
    });
  }

  logger.warn(`Payment failed for user ${sub.user_id}`);
}

/**
 * Handle trial ending
 */
async function handleTrialEnding(subscription) {
  const customerId = subscription.customer;

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!sub) {
    return;
  }

  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', sub.user_id)
    .single();

  if (user) {
    await sendEmail({
      to: user.email,
      template: 'trial-ending',
      data: {
        name: user.name,
        trialEndDate: new Date(subscription.trial_end * 1000).toLocaleDateString(),
      },
    });
  }
}

/**
 * Get tier from Stripe price ID
 */
/**
 * Handle payment intent succeeded (Donations)
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  const reference = paymentIntent.id;
  const userId = paymentIntent.metadata?.user_id;
  const courseId = paymentIntent.metadata?.course_id;
  const type = paymentIntent.metadata?.type;

  logger.info(`Processing donation success for reference ${reference}`);

  // Update donation status
  const { data: donation, error: updateError } = await supabase
    .from('donations')
    .update({ status: 'completed' })
    .eq('reference', reference)
    .select()
    .single();

  if (updateError) {
    logger.error('Failed to update donation status in webhook:', updateError);
    return;
  }

  // Handle course enrollment if applicable
  if (type === 'course_enrollment' && courseId && userId) {
    // Check for existing application
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingApp) {
      const { error: enrollError } = await supabase
        .from('applications')
        .insert({
          course_id: courseId,
          user_id: userId,
          status: 'accepted',
          notes: 'Auto-enrolled via verified Stripe donation'
        });

      if (enrollError) {
        logger.error('Failed to auto-enroll user after donation:', enrollError);
      } else {
        logger.info(`User ${userId} auto-enrolled in course ${courseId} via donation`);
      }
    }
  }

  // Send donation receipt email
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', userId || donation.user_id)
    .single();

  if (user) {
    await sendEmail({
      to: user.email,
      template: 'donation-received',
      data: {
        name: user.name,
        amount: (paymentIntent.amount / 100).toFixed(2),
        currency: paymentIntent.currency.toUpperCase(),
        course_id: courseId
      },
    });
  }
}

function getTierFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_ID_BASIC) return 'basic';
  if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) return 'premium';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return 'pro';
  return 'free';
}

export { getTierFromPriceId };
export default handleWebhook;

