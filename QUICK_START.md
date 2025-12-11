# ⚡ QUICK START - Get Running in 5 Minutes

## 🎯 Minimum Setup to Run the App

### Step 1: Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `workflow`
   - Database password: (save this!)
   - Region: Choose closest
4. Wait for project to initialize (~2 minutes)

### Step 2: Set Up Database (2 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy contents of `backend/supabase/schema.sql`
4. Paste and click **Run**
5. Wait for success message

### Step 3: Get Credentials (1 minute)

1. In Supabase Dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### Step 4: Create Environment File (1 minute)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3001/api
```

**Replace with your actual values!**

### Step 5: Start the App (1 minute)

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm start
```

**Done!** 🎉

Open http://localhost:3000 and you should see the app!

## ✅ What Works Now

- ✅ Sign up / Sign in
- ✅ Browse jobs
- ✅ View job details
- ✅ Save jobs
- ✅ Apply to jobs
- ✅ Create resumes
- ✅ View dashboard
- ✅ Track applications

## ⚠️ What Needs Backend (Optional)

These features need the backend server running:

- AI Resume Generation
- Job Matching
- Interview Prep
- Salary Intelligence
- Career Advisor
- Email Notifications
- Stripe Payments

**But the core app works without them!**

## 🚀 Next Steps

1. **Test the app** - Sign up, search jobs, apply
2. **Set up backend** (optional) - See `PRODUCTION_READINESS_CHECKLIST.md`
3. **Deploy** (when ready) - See `PRODUCTION_DEPLOYMENT.md`

## 🆘 Troubleshooting

**Error: "Missing Supabase environment variables"**
- Check `.env` file exists
- Check variable names start with `VITE_`
- Restart dev server after creating `.env`

**Error: "Failed to fetch"**
- Check Supabase URL is correct
- Check anon key is correct
- Check database schema was applied

**Blank page**
- Check browser console for errors
- Verify `.env` file is in root directory
- Restart dev server

## 📚 More Help

- `PRODUCTION_READINESS_CHECKLIST.md` - Complete setup guide
- `INTEGRATION_GUIDE.md` - How to use the services
- `TROUBLESHOOTING.md` - Common issues and fixes

