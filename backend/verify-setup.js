/**
 * Verify Backend Setup
 * Checks if all required environment variables and services are configured
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import Stripe from 'stripe';
import { Resend } from 'resend';

dotenv.config();

const checks = {
  supabase: false,
  openai: false,
  stripe: false,
  resend: false,
};

console.log('🔍 Verifying Backend Setup...\n');

// Check Supabase
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    );
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (!error) {
      checks.supabase = true;
      console.log('✅ Supabase: Connected');
    } else {
      console.log('⚠️  Supabase: Connected but database error (may need schema)');
    }
  } else {
    console.log('❌ Supabase: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
} catch (error) {
  console.log('❌ Supabase: Connection failed -', error.message);
}

// Check OpenAI
try {
  if (process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Test with a simple request
    await openai.models.list();
    checks.openai = true;
    console.log('✅ OpenAI: API key valid');
  } else {
    console.log('❌ OpenAI: Missing OPENAI_API_KEY');
  }
} catch (error) {
  if (error.status === 401) {
    console.log('❌ OpenAI: Invalid API key');
  } else {
    console.log('⚠️  OpenAI: API key set but connection issue -', error.message);
  }
}

// Check Stripe
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Test with a simple request
    await stripe.balance.retrieve();
    checks.stripe = true;
    console.log('✅ Stripe: API key valid');
  } else {
    console.log('❌ Stripe: Missing STRIPE_SECRET_KEY');
  }
} catch (error) {
  if (error.type === 'StripeAuthenticationError') {
    console.log('❌ Stripe: Invalid API key');
  } else {
    console.log('⚠️  Stripe: API key set but connection issue -', error.message);
  }
}

// Check Resend
try {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Resend doesn't have a simple test endpoint, so just check if key exists
    if (process.env.RESEND_API_KEY.startsWith('re_')) {
      checks.resend = true;
      console.log('✅ Resend: API key format valid');
    } else {
      console.log('⚠️  Resend: API key format may be invalid (should start with re_)');
    }
  } else {
    console.log('❌ Resend: Missing RESEND_API_KEY');
  }
} catch (error) {
  console.log('⚠️  Resend: Error checking -', error.message);
}

// Summary
console.log('\n📊 Setup Summary:');
console.log('─'.repeat(50));
console.log(`Supabase: ${checks.supabase ? '✅' : '❌'}`);
console.log(`OpenAI:   ${checks.openai ? '✅' : '❌'}`);
console.log(`Stripe:   ${checks.stripe ? '✅' : '❌'}`);
console.log(`Resend:   ${checks.resend ? '✅' : '❌'}`);
console.log('─'.repeat(50));

const allConfigured = Object.values(checks).every(v => v === true);

if (allConfigured) {
  console.log('\n🎉 All services configured! Backend is ready to run.');
} else {
  console.log('\n⚠️  Some services are not configured. Check your .env file.');
  console.log('\nRequired for:');
  if (!checks.supabase) console.log('  - Core functionality (authentication, database)');
  if (!checks.openai) console.log('  - AI features (resume generation, job matching)');
  if (!checks.stripe) console.log('  - Payment processing');
  if (!checks.resend) console.log('  - Email notifications');
}

process.exit(allConfigured ? 0 : 1);

