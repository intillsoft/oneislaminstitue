# 🚀 START BACKEND SERVER

## Quick Start

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies (first time only)
npm install

# 3. Create .env file (see below)

# 4. Start server
npm start
```

**Server will run on:** http://localhost:3001

---

## Required Environment Variables

Create `backend/.env` file with:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your_openai_key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_BASIC=price_xxxxx
STRIPE_PRICE_ID_PREMIUM=price_xxxxx
STRIPE_PRICE_ID_PRO=price_xxxxx

# Resend (for emails)
RESEND_API_KEY=re_your_resend_key
RESEND_FROM_EMAIL=Workflow <noreply@yourdomain.com>

# Application
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

---

## Verify Backend is Running

1. **Check health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check in browser:**
   Open http://localhost:3001/health

---

## API Endpoints Available

### AI Services:
- `POST /api/resumes/generate` - Generate AI resume
- `POST /api/jobs/match` - Match job with resume
- `POST /api/interview/questions/generate` - Generate interview questions
- `POST /api/interview/analyze` - Analyze interview answer
- `POST /api/salary/predict` - Predict salary
- `GET /api/career/analyze` - Career analysis

### Billing:
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/portal` - Customer portal
- `POST /api/billing/subscription/update` - Update subscription
- `POST /api/billing/subscription/cancel` - Cancel subscription

### Email:
- `GET /api/email/preferences` - Get preferences
- `PUT /api/email/preferences/:type` - Update preference
- `POST /api/email/unsubscribe` - Unsubscribe

### Webhooks:
- `POST /api/webhooks/stripe` - Stripe webhook

---

## Troubleshooting

### Port 3001 already in use:
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill
```

### Missing dependencies:
```bash
cd backend
npm install
```

### Environment variables not loading:
- Check `.env` file is in `backend/` folder
- Check variable names are correct
- Restart server after changing `.env`

### OpenAI errors:
- Check API key is valid
- Check you have credits in OpenAI account
- Check API key has proper permissions

### Stripe errors:
- Check you're using test keys in development
- Check webhook secret matches Stripe dashboard
- Check price IDs are correct

---

## Development Mode

For auto-reload on file changes:
```bash
npm run dev
```

---

## Production

For production:
```bash
NODE_ENV=production npm start
```

Make sure to:
- Use production Stripe keys
- Use production Resend domain
- Set proper CORS origins
- Enable rate limiting
- Set up monitoring

---

## Next Steps

1. ✅ Backend running
2. ✅ Frontend connected (set `VITE_API_URL=http://localhost:3001/api`)
3. ✅ Test AI features
4. ✅ Test payments
5. ✅ Test emails

**See `COMPLETE_SETUP_GUIDE.md` in project root for full setup!**

