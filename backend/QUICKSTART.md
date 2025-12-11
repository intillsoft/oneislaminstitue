# Quick Start Guide

## 1. Prerequisites

- Node.js 18+
- Supabase account
- Stripe account
- Resend account

## 2. Install Dependencies

```bash
cd backend
npm install
```

## 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL
5. Copy your project URL and API keys

## 4. Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and create products:
   - Basic: $4.99/month
   - Premium: $9.99/month
   - Pro: $19.99/month
2. Copy the Price IDs
3. Set up webhook:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
4. Copy webhook signing secret

## 5. Set Up Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key
4. Create API key with email sending permissions

## 6. Configure Environment

```bash
cp env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
STRIPE_PRICE_ID_PRO=price_...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Workflows <noreply@yourdomain.com>

FRONTEND_URL=http://localhost:3000
```

## 7. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## 8. Test Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Subscription (requires auth)
```bash
curl -H "Authorization: Bearer <supabase_jwt_token>" \
     http://localhost:3001/api/billing/subscription
```

## Next Steps

- Integrate with your frontend
- Set up production environment variables
- Configure webhook URL in Stripe dashboard
- Test subscription flow end-to-end

See `README.md` for full documentation.

