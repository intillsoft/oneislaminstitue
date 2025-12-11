# 📋 Environment Variables Setup Guide

## ✅ Correct File Names

### Frontend:
- **`.env`** (in project root) - ✅ CORRECT
- `.env.local` - ❌ Vite doesn't use this by default

### Backend:
- **`backend/.env`** - ✅ CORRECT

---

## 🔧 Frontend `.env` (Project Root)

**File:** `.env` (NOT `.env.local`)

```env
# Supabase (REQUIRED)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API (REQUIRED for AI features)
VITE_API_URL=http://localhost:3001/api
```

**Important:** 
- ✅ Must start with `VITE_` prefix
- ✅ File must be named `.env` (not `.env.local`)
- ✅ Must be in project root (same folder as `package.json`)

---

## 🔧 Backend `.env` (backend/ folder)

**File:** `backend/.env`

```env
# Supabase (REQUIRED)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_BASIC=price_basic_monthly
STRIPE_PRICE_ID_PREMIUM=price_premium_monthly
STRIPE_PRICE_ID_PRO=price_pro_monthly

# Resend (REQUIRED for emails)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=Workflows <noreply@yourdomain.com>

# Application
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

**Important:**
- ✅ NO `VITE_` prefix (backend doesn't use Vite)
- ✅ File must be in `backend/` folder
- ✅ Replace all `your_*` values with real credentials

---

## ✅ Quick Setup

### 1. Frontend `.env`:
```bash
# In project root, create .env file
# Copy the template above and fill in your Supabase values
```

### 2. Backend `.env`:
```bash
# In backend/ folder, create .env file
# Copy the template above and fill in all values
```

---

## 🚀 Start Both Servers

### Terminal 1 - Frontend:
```bash
npm start
```

### Terminal 2 - Backend:
```bash
cd backend
npm install  # First time only
npm start
```

---

## ✅ Verification

**Frontend:** http://localhost:5173 (or 3000)
**Backend:** http://localhost:3001

**Test backend:**
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

---

## 📝 Notes

- `.env.local` won't work with Vite by default
- Use `.env` for frontend
- Restart servers after changing `.env` files
- Don't commit `.env` files to git (they're in .gitignore)

---

**I've created both `.env` files for you! Just fill in your actual values.** ✅

