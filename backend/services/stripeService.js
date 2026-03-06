/**
 * Stripe Service
 * Handles all Stripe-related operations
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { getTierConfig } from '../config/subscription-tiers.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in stripeService. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

/**
 * Create or retrieve Stripe customer
 */
export async function getOrCreateCustomer(userId, email, name) {
  try {
    // Check if customer already exists
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscription?.stripe_customer_id) {
      const customer = await stripe.customers.retrieve(subscription.stripe_customer_id);
      return customer;
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Update subscription record
    logger.info(`Updating subscription record for user ${userId} with customer ${customer.id}`);
    const { error: upsertError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customer.id,
        plan: 'free',
        status: 'active',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
      });

    if (upsertError) {
      logger.error('Database error in getOrCreateCustomer upsert:', upsertError);
      throw new Error(`Database error: ${upsertError.message}`);
    }

    return customer;
  } catch (error) {
    logger.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Create checkout session for subscription
 */
export async function createCheckoutSession(userId, tier) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new Error('User not found');
    }

    const customer = await getOrCreateCustomer(userId, user.email, user.name);
    const tierConfig = getTierConfig(tier);

    logger.info(`Initializing checkout for user ${userId}, tier ${tier}, priceId ${tierConfig.priceId}`);

    if (!tierConfig.priceId) {
      logger.error(`No priceId found for tier ${tier}. Current config: ${JSON.stringify(tierConfig)}`);
      throw new Error(`Invalid tier or tier is free: ${tier}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
      metadata: {
        userId,
        tier,
      },
    });

    return session;
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create customer portal session
 */
export async function createPortalSession(userId) {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_customer_id) {
      throw new Error('No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    return session;
  } catch (error) {
    logger.error('Error creating portal session:', error);
    throw error;
  }
}

/**
 * Handle subscription update (upgrade/downgrade)
 */
export async function updateSubscription(userId, newTier) {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_subscription_id) {
      // Create new subscription
      return await createCheckoutSession(userId, newTier);
    }

    const tierConfig = getTierConfig(newTier);
    if (!tierConfig.priceId) {
      throw new Error('Invalid tier');
    }

    // Get current subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    // Update subscription
    const updated = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: tierConfig.priceId,
        }],
        proration_behavior: 'always_invoice',
        metadata: {
          tier: newTier,
        },
      }
    );

    return updated;
  } catch (error) {
    logger.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId, cancelImmediately = false) {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_subscription_id) {
      throw new Error('No active subscription found');
    }

    if (cancelImmediately) {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    }

    return { success: true };
  } catch (error) {
    logger.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Resume canceled subscription
 */
export async function resumeSubscription(userId) {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_subscription_id) {
      throw new Error('No subscription found');
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    return { success: true };
  } catch (error) {
    logger.error('Error resuming subscription:', error);
    throw error;
  }
}

/**
 * Handle failed payment recovery
 */
export async function retryPayment(userId) {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_subscription_id) {
      throw new Error('No subscription found');
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    if (stripeSubscription.status === 'past_due') {
      // Attempt to pay the latest invoice
      const latestInvoice = await stripe.invoices.retrieve(
        stripeSubscription.latest_invoice
      );

      if (latestInvoice.status === 'open') {
        await stripe.invoices.pay(latestInvoice.id);
      }
    }

    return { success: true };
  } catch (error) {
    logger.error('Error retrying payment:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(userId) {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !subscription) {
      return null;
    }

    let stripeSubscription = null;
    if (subscription.stripe_subscription_id) {
      stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripe_subscription_id
      );
    }

    return {
      ...subscription,
      stripeDetails: stripeSubscription,
    };
  } catch (error) {
    logger.error('Error getting subscription details:', error);
    throw error;
  }
}

export default {
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  updateSubscription,
  cancelSubscription,
  resumeSubscription,
  retryPayment,
  getSubscriptionDetails,
};

