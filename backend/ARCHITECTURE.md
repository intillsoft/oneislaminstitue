# Architecture Overview

## System Components

### 1. Database Layer (Supabase PostgreSQL)

**Tables:**
- `users` - User accounts with subscription tier
- `resumes` - User resumes (JSONB storage)
- `jobs` - Job listings from scrapers
- `applications` - Job applications tracking
- `saved_jobs` - Saved job bookmarks
- `subscriptions` - Stripe subscription data
- `usage_tracking` - Monthly feature usage limits
- `email_preferences` - User email preferences

**Security:**
- Row Level Security (RLS) enabled on all tables
- Policies restrict access to user's own data
- Service role for admin operations

### 2. Subscription System (Stripe)

**Tiers:**
- **Free**: $0 - Basic features, limited usage
- **Basic**: $4.99/month - Enhanced features
- **Premium**: $9.99/month - Advanced features + support
- **Pro**: $19.99/month - Unlimited + API access

**Features:**
- Checkout session creation
- Customer portal integration
- Subscription upgrade/downgrade
- Payment retry on failure
- Webhook event handling

### 3. Feature Gating

**Middleware:**
- `requireFeature(feature)` - Check feature access
- `checkUsageLimit(feature)` - Enforce usage limits
- `requireTier(minTier)` - Require minimum tier

**Usage Tracking:**
- Monthly limits per feature
- Automatic reset each month
- Real-time limit checking

### 4. Email System (Resend)

**Templates:**
- Welcome sequence (3 emails)
- Authentication (password reset, verification)
- Application confirmations
- Weekly job recommendations
- Interview reminders
- Subscription notifications
- Payment confirmations/failures

**Features:**
- User preferences (opt-in/opt-out)
- Unsubscribe handling
- Dynamic content rendering

### 5. API Endpoints

**Billing:**
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/checkout` - Create checkout
- `POST /api/billing/portal` - Customer portal
- `POST /api/billing/subscription/update` - Change plan
- `POST /api/billing/subscription/cancel` - Cancel
- `POST /api/billing/payment/retry` - Retry payment

**Email:**
- `GET /api/email/preferences` - Get preferences
- `PUT /api/email/preferences/:type` - Update preference
- `POST /api/email/unsubscribe` - Unsubscribe all

**Webhooks:**
- `POST /api/webhooks/stripe` - Stripe events

## Data Flow

### Subscription Flow

1. User clicks "Upgrade" → Frontend calls `/api/billing/checkout`
2. Backend creates Stripe checkout session
3. User completes payment on Stripe
4. Stripe sends webhook → `/api/webhooks/stripe`
5. Webhook handler updates database
6. User tier updated in `users` table
7. Welcome email sent

### Feature Access Flow

1. User makes API request
2. `authenticate` middleware validates JWT
3. `requireFeature` middleware checks tier
4. `checkUsageLimit` middleware verifies limits
5. Request processed if allowed
6. Usage incremented on success

### Email Flow

1. Event triggers email (e.g., application submitted)
2. `emailService` checks user preferences
3. Template rendered with dynamic data
4. Resend API sends email
5. Result logged

## Security

- JWT authentication via Supabase
- RLS policies on all database tables
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Webhook signature verification

## Scalability

- Stateless API design
- Database connection pooling
- Efficient indexing on queries
- Usage tracking for monitoring
- Logging for debugging

## Error Handling

- Try-catch blocks in all async operations
- Winston logging for errors
- Graceful degradation
- User-friendly error messages
- Retry logic for external APIs

## Monitoring

- Request logging
- Error logging
- Usage tracking
- Webhook event logging
- Subscription status tracking

