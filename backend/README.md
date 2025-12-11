# Workflows Backend API

Backend API for Workflows job board with Supabase, Stripe subscriptions, and Resend email integration.

## Features

- ✅ **Supabase PostgreSQL Database** with RLS policies
- ✅ **Stripe Subscription System** (4 tiers: Free, Basic, Premium, Pro)
- ✅ **Feature Gating Middleware** for API endpoints
- ✅ **Stripe Webhook Handling** for subscription events
- ✅ **Resend Email System** with templates
- ✅ **Usage Tracking** and limits enforcement
- ✅ **Customer Portal Integration**
- ✅ **Email Preferences** and unsubscribe handling

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp env.example .env
```

Edit `.env` with your credentials:
- Supabase project URL and keys
- Stripe secret key and webhook secret
- Resend API key
- Stripe price IDs for each tier

### 3. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema:

```bash
# In Supabase SQL Editor, run:
backend/supabase/schema.sql
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 4. Configure Stripe

1. Create products and prices in Stripe Dashboard
2. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Add webhook secret to `.env`
4. Update price IDs in `.env` and `config/subscription-tiers.js`

### 5. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Get API key and add to `.env`
3. Verify your domain
4. Update `RESEND_FROM_EMAIL` in `.env`

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3001` by default.

## API Endpoints

### Billing

- `GET /api/billing/subscription` - Get current subscription
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/portal` - Create customer portal session
- `POST /api/billing/subscription/update` - Update subscription
- `POST /api/billing/subscription/cancel` - Cancel subscription
- `POST /api/billing/subscription/resume` - Resume subscription
- `POST /api/billing/payment/retry` - Retry failed payment

### Email Preferences

- `GET /api/email/preferences` - Get email preferences
- `PUT /api/email/preferences/:emailType` - Update preference
- `POST /api/email/unsubscribe` - Unsubscribe from all

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook endpoint

## Database Schema

### Tables

- `users` - User accounts
- `resumes` - User resumes
- `jobs` - Job listings
- `applications` - Job applications
- `saved_jobs` - Saved jobs
- `subscriptions` - Stripe subscriptions
- `usage_tracking` - Feature usage tracking
- `email_preferences` - Email preferences

All tables include:
- Row Level Security (RLS) policies
- Proper indexes
- Foreign key relationships
- Timestamps (created_at, updated_at)

## Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 resume, 10 applications/month, 20 saved jobs |
| Basic | $4.99 | 3 resumes, 50 applications/month, AI matching |
| Premium | $9.99 | 10 resumes, 200 applications/month, priority support |
| Pro | $19.99 | Unlimited, API access, all features |

## Email Templates

Available templates:
- Welcome sequence (3 emails)
- Password reset
- Email verification
- Application confirmation
- Weekly job recommendations
- Interview reminders
- Subscription notifications
- Payment confirmations/failures

## Usage Tracking

Tracks feature usage per user per month:
- `applicationsPerMonth`
- `savedJobsPerMonth`
- `resumesPerMonth`
- `apiCallsPerMonth`

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <supabase_jwt_token>
```

## Webhook Setup

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Copy webhook signing secret to `.env`

## Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test subscription endpoint (with auth)
curl -H "Authorization: Bearer <token>" \
     http://localhost:3001/api/billing/subscription
```

## Deployment

### Environment Variables

Ensure all environment variables are set in your hosting platform:
- Supabase credentials
- Stripe keys
- Resend API key
- Frontend URL
- Webhook secrets

### Webhook URL

Update Stripe webhook URL to your production domain:
```
https://your-domain.com/api/webhooks/stripe
```

## License

MIT

