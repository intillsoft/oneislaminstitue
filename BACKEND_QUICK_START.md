# 🚀 BACKEND QUICK START

## ✅ Backend Code is 100% Complete!

All backend services are implemented and ready to use:
- ✅ AI Resume Generation
- ✅ AI Job Matching  
- ✅ AI Career Advisor
- ✅ Stripe Payments
- ✅ Resend Emails
- ✅ All API endpoints

---

## 🎯 3-Step Setup

### Step 1: Install Dependencies (1 minute)

```bash
cd backend
npm install
```

### Step 2: Create `.env` File (2 minutes)

Create `backend/.env` file:

```env
# Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-your_openai_key

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_BASIC=price_xxxxx
STRIPE_PRICE_ID_PREMIUM=price_xxxxx
STRIPE_PRICE_ID_PRO=price_xxxxx

# Resend (REQUIRED for emails)
RESEND_API_KEY=re_your_resend_key
RESEND_FROM_EMAIL=Workflow <noreply@yourdomain.com>

# Application
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

**See `ENV_VARIABLES_CHECKLIST.md` for where to get each value!**

### Step 3: Start Server (1 minute)

```bash
npm start
```

**✅ Backend running on http://localhost:3001**

---

## 🔍 Verify Setup

After creating `.env`, verify everything is configured:

```bash
npm run verify
```

This will check:
- ✅ Supabase connection
- ✅ OpenAI API key
- ✅ Stripe API key
- ✅ Resend API key

---

## 📋 What's Available

### AI Endpoints:
- `POST /api/resumes/generate` - Generate AI resume
- `POST /api/jobs/match` - Match job with resume
- `GET /api/career/analyze` - Career analysis
- `POST /api/interview/questions/generate` - Interview questions
- `POST /api/salary/predict` - Salary prediction

### Billing Endpoints:
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/checkout` - Create checkout
- `POST /api/billing/portal` - Customer portal
- `POST /api/billing/subscription/update` - Update plan
- `POST /api/billing/subscription/cancel` - Cancel

### Email Endpoints:
- `GET /api/email/preferences` - Get preferences
- `PUT /api/email/preferences/:type` - Update preference

### Webhooks:
- `POST /api/webhooks/stripe` - Stripe webhook

---

## 🧪 Test Backend

### 1. Health Check:
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### 2. Test AI (requires auth token):
```bash
curl -X POST http://localhost:3001/api/resumes/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Software Engineer",
    "experience_level": "mid",
    "industry": "Technology",
    "skills": ["JavaScript", "React"],
    "achievements": ["Led team of 5"]
  }'
```

---

## 🆘 Troubleshooting

### "Port 3001 already in use"
```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill
```

### "Cannot find module"
```bash
cd backend
npm install
```

### "Missing environment variables"
- Check `.env` file exists in `backend/` folder
- Check all required variables are set
- Restart server after changing `.env`

### "OpenAI API error"
- Check API key is valid
- Check you have credits
- Check key has proper permissions

---

## 📚 Full Documentation

- `backend/README.md` - Complete backend docs
- `backend/README_AI.md` - AI services docs
- `backend/START_BACKEND.md` - Detailed startup guide
- `COMPLETE_SETUP_GUIDE.md` - Full project setup

---

## ✅ Next Steps

1. ✅ Backend running
2. ✅ Frontend connected (`VITE_API_URL=http://localhost:3001/api`)
3. ✅ Test AI features in frontend
4. ✅ Test payments
5. ✅ Test emails

**You're all set! 🎉**

