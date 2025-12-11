# 📋 ENVIRONMENT VARIABLES CHECKLIST

## ✅ Copy-Paste Ready Templates

### Frontend `.env` (Create in project root)

```env
# ============================================
# SUPABASE (REQUIRED)
# Get from: https://supabase.com/dashboard → Settings → API
# ============================================
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# ============================================
# BACKEND API (REQUIRED for AI features)
# ============================================
VITE_API_URL=http://localhost:3001/api
```

**Fill in:**
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

---

### Backend `.env` (Create in `backend/` folder)

```env
# ============================================
# SUPABASE (REQUIRED)
# Get from: https://supabase.com/dashboard → Settings → API
# ============================================
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ============================================
# OPENAI (REQUIRED for AI features)
# Get from: https://platform.openai.com/api-keys
# ============================================
OPENAI_API_KEY=

# ============================================
# STRIPE (REQUIRED for payments)
# Get from: https://dashboard.stripe.com/apikeys
# ============================================
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_BASIC=
STRIPE_PRICE_ID_PREMIUM=
STRIPE_PRICE_ID_PRO=

# ============================================
# RESEND (REQUIRED for emails)
# Get from: https://resend.com/api-keys
# ============================================
RESEND_API_KEY=
RESEND_FROM_EMAIL=Workflow <noreply@yourdomain.com>

# ============================================
# APPLICATION (REQUIRED)
# ============================================
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

---

## 📝 Step-by-Step: Where to Get Each Value

### 1. Supabase Variables

**Where:** https://supabase.com/dashboard → Your Project → Settings → API

**Values:**
- `VITE_SUPABASE_URL` = **Project URL** (looks like: `https://xxxxx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` = **anon public** key (long string starting with `eyJ...`)
- `SUPABASE_SERVICE_ROLE_KEY` = **service_role** key (keep secret!)

**Copy to:**
- Frontend `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Backend `.env`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. OpenAI API Key

**Where:** https://platform.openai.com → API Keys → Create new secret key

**Value:**
- `OPENAI_API_KEY` = Key starting with `sk-...`

**Copy to:** Backend `.env` only

**Note:** Add credits to your account (minimum $5)

---

### 3. Stripe Variables

**Where:** https://dashboard.stripe.com

**Secret Key:**
1. Go to **Developers** → **API keys**
2. Copy **Secret key** (starts with `sk_test_` for test mode)

**Price IDs:**
1. Go to **Products** → **Add product**
2. Create 3 products:
   - Basic: $4.99/month → Copy **Price ID** (starts with `price_`)
   - Premium: $9.99/month → Copy **Price ID**
   - Pro: $19.99/month → Copy **Price ID**

**Webhook Secret:**
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `http://localhost:3001/api/webhooks/stripe`
4. Select events: `customer.subscription.*`, `invoice.*`
5. Copy **Signing secret** (starts with `whsec_`)

**Copy to:** Backend `.env` only

---

### 4. Resend API Key

**Where:** https://resend.com → API Keys → Create API Key

**Value:**
- `RESEND_API_KEY` = Key starting with `re_...`

**Email:**
- `RESEND_FROM_EMAIL` = Your verified email (format: `Name <email@domain.com>`)

**Copy to:** Backend `.env` only

---

## ✅ Verification Checklist

### Frontend `.env`:
- [ ] `VITE_SUPABASE_URL` filled in
- [ ] `VITE_SUPABASE_ANON_KEY` filled in
- [ ] `VITE_API_URL` set to `http://localhost:3001/api`
- [ ] File is in project root (same folder as `package.json`)

### Backend `.env`:
- [ ] `SUPABASE_URL` filled in
- [ ] `SUPABASE_ANON_KEY` filled in
- [ ] `SUPABASE_SERVICE_ROLE_KEY` filled in
- [ ] `OPENAI_API_KEY` filled in (for AI features)
- [ ] `STRIPE_SECRET_KEY` filled in (for payments)
- [ ] `STRIPE_WEBHOOK_SECRET` filled in
- [ ] `STRIPE_PRICE_ID_BASIC` filled in
- [ ] `STRIPE_PRICE_ID_PREMIUM` filled in
- [ ] `STRIPE_PRICE_ID_PRO` filled in
- [ ] `RESEND_API_KEY` filled in (for emails)
- [ ] `RESEND_FROM_EMAIL` filled in
- [ ] `FRONTEND_URL` set to `http://localhost:3000`
- [ ] `PORT` set to `3001`
- [ ] File is in `backend/` folder

---

## 🚨 Common Mistakes

### ❌ Wrong File Location
- Frontend `.env` must be in **project root**
- Backend `.env` must be in **`backend/` folder**

### ❌ Missing `VITE_` Prefix
- Frontend env vars MUST start with `VITE_`
- Backend env vars do NOT have prefix

### ❌ Wrong Values
- Don't include quotes around values
- Don't include `export` keyword
- Don't include spaces around `=`

### ❌ Not Restarting Server
- Always restart dev server after creating/updating `.env`

---

## 📋 Quick Copy Template

**Frontend `.env`:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3001/api
```

**Backend `.env`:**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
STRIPE_PRICE_ID_PRO=price_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Workflow <noreply@yourdomain.com>
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

**Replace all `xxxxx` and `...` with your actual values!**

---

## ✅ Done!

Once all values are filled in:
1. Save both `.env` files
2. Restart frontend: `npm start`
3. Restart backend: `cd backend && npm start`
4. Test the app!

**See `COMPLETE_SETUP_GUIDE.md` for full setup instructions.**

