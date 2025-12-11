# 🎯 COMPLETE SETUP INSTRUCTIONS

## 🚀 GET YOUR APP RUNNING IN 10 MINUTES

### PART 1: Supabase Setup (5 minutes)

#### 1.1 Create Project
1. Visit [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `workflow-production`
   - **Database Password**: (create strong password, save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

#### 1.2 Set Up Database
1. In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open `backend/supabase/schema.sql` in your editor
4. Copy **ALL** the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for "Success" message

#### 1.3 Set Up AI Tables (Optional - for AI features)
1. Still in SQL Editor, click **"New query"**
2. Open `backend/supabase/ai-schema.sql`
3. Copy and paste, then run

#### 1.4 Get API Credentials
1. Click **"Settings"** (gear icon, left sidebar)
2. Click **"API"**
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (keep secret! Only for backend)

### PART 2: Environment Variables (2 minutes)

#### 2.1 Frontend `.env` File

Create `.env` in the **root** directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend API (for AI features)
VITE_API_URL=http://localhost:3001/api
```

**Replace with your actual Supabase values!**

#### 2.2 Backend `.env` File (Optional - for AI features)

Create `backend/.env`:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your_openai_key_here

# Stripe (for payments - use test keys first)
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
```

### PART 3: Start the App (3 minutes)

#### 3.1 Install Dependencies

```bash
# In project root
npm install
```

#### 3.2 Start Frontend

```bash
npm start
```

App should open at http://localhost:3000

#### 3.3 Start Backend (Optional - for AI features)

```bash
# Open new terminal
cd backend
npm install
npm start
```

Backend runs on http://localhost:3001

### PART 4: Test Everything

#### ✅ Test Checklist:

1. **Authentication:**
   - [ ] Go to http://localhost:3000
   - [ ] Click "Sign In" or "Create Account"
   - [ ] Create account with email/password
   - [ ] Check email for verification (if enabled)
   - [ ] Sign in successfully

2. **Job Search:**
   - [ ] Search for jobs
   - [ ] Apply filters
   - [ ] Click on a job
   - [ ] View job details

3. **Save Job:**
   - [ ] Click save/bookmark icon
   - [ ] Go to Dashboard → Saved Jobs
   - [ ] Verify job appears

4. **Apply to Job:**
   - [ ] Click "Apply Now"
   - [ ] Fill application form
   - [ ] Submit application
   - [ ] Check Dashboard → Applications

5. **Resume Builder:**
   - [ ] Go to Resume Builder
   - [ ] Create resume sections
   - [ ] Save resume
   - [ ] Verify it saves

6. **Dashboard:**
   - [ ] View metrics
   - [ ] Check recent activity
   - [ ] View saved jobs
   - [ ] View applications

## 🎉 SUCCESS!

If all tests pass, **your app is running!**

## 🚀 DEPLOY TO PRODUCTION

### Frontend Deployment (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Add environment variables in Vercel Dashboard:**
- Go to Project → Settings → Environment Variables
- Add all `VITE_*` variables from `.env`

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

**Add environment variables in Railway Dashboard**

## 📊 WHAT'S WORKING

### ✅ Works Without Backend:
- User authentication
- Job search and browsing
- Job applications
- Resume creation
- Dashboard
- Saved jobs
- Job alerts

### ⚠️ Needs Backend:
- AI resume generation
- Job matching algorithm
- Interview prep
- Salary predictions
- Career advisor
- Email notifications
- Stripe payments

## 🔧 TROUBLESHOOTING

### "Failed to resolve import"
- Run `npm install` again
- Restart dev server

### "Missing environment variables"
- Check `.env` file exists in root
- Check variable names start with `VITE_`
- Restart dev server

### "Database error"
- Verify schema.sql was run
- Check Supabase credentials are correct
- Check RLS policies are enabled

### "Backend not responding"
- Check backend is running on port 3001
- Check `VITE_API_URL` in `.env`
- Check backend `.env` is configured

## 📞 SUPPORT

- Check `TROUBLESHOOTING.md` for common issues
- Check `PRODUCTION_READINESS_CHECKLIST.md` for complete setup
- Check `INTEGRATION_GUIDE.md` for code examples

## ✅ FINAL CHECKLIST

Before going live:

- [ ] Supabase database set up
- [ ] Schema applied successfully
- [ ] Frontend `.env` configured
- [ ] App runs without errors
- [ ] Can sign up/sign in
- [ ] Can search jobs
- [ ] Can apply to jobs
- [ ] Can create resumes
- [ ] Dashboard shows data
- [ ] Backend running (if using AI features)
- [ ] Environment variables set in production
- [ ] Domain configured
- [ ] SSL certificate active

**You're ready to launch! 🚀**

