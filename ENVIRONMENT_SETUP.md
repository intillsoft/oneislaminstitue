# 🔐 Environment Variables Setup Guide

## 📋 Quick Answer

**Frontend (`.env` in root):** Only variables used in `src/` need `VITE_` prefix
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_API_URL`

**Backend (`.env` in `backend/`):** NO `VITE_` prefix - just regular names
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `STRIPE_SECRET_KEY`
- etc.

---

## 🎯 Step-by-Step Setup

### Step 1: Frontend Environment Variables

1. **Create `.env` file in the root directory** (same level as `package.json`)

2. **Copy from `.env.example`**:
   ```bash
   cp .env.example .env
   ```

3. **Fill in your values**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Where to find Supabase keys:**
   - Go to Supabase Dashboard → Settings → API
   - Copy "Project URL" → `VITE_SUPABASE_URL`
   - Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

### Step 2: Backend Environment Variables

1. **Create `.env` file in `backend/` directory**

2. **Copy from `backend/.env.example`**:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Fill in your values**:
   ```env
   # Supabase (Required)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # AI Provider (At least one required)
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   
   # Stripe (Required for payments)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Resend (Required for emails)
   RESEND_API_KEY=re_...
   ```

4. **Where to find keys:**
   - **Supabase Service Role Key:** Dashboard → Settings → API → "service_role" key (⚠️ Keep secret!)
   - **OpenAI API Key:** https://platform.openai.com/api-keys
   - **Stripe Keys:** https://dashboard.stripe.com/apikeys
   - **Resend API Key:** https://resend.com/api-keys

---

## ✅ Verification

### Check Frontend Variables
```bash
# In root directory
npm run dev
# Check browser console - should NOT see Supabase warnings
```

### Check Backend Variables
```bash
cd backend
node verify-setup.js
# Should show ✅ for all configured services
```

---

## 🚨 Important Notes

### Frontend (Vite)
- ✅ **MUST** prefix with `VITE_` for variables used in `src/`
- ⚠️ **NEVER** put secrets here - they're exposed in browser bundle
- ✅ Only public keys (like Supabase anon key) are safe

### Backend (Node.js)
- ✅ **NO** `VITE_` prefix needed
- ✅ Use `process.env.VARIABLE_NAME`
- ✅ Secrets are safe here (server-side only)

### Security
- ❌ **NEVER** commit `.env` files to git
- ✅ `.env` is already in `.gitignore`
- ✅ Use `.env.example` as a template
- ⚠️ Service role keys are SECRET - never expose to frontend

---

## 📝 Complete Variable List

### Frontend (`.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous key (public) |
| `VITE_API_URL` | ❌ No | Backend API URL (defaults to localhost:3001) |

### Backend (`backend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Supabase service role key (secret) |
| `AI_PROVIDER` | ✅ Yes | AI provider: `openai`, `huggingface`, `gemini`, `anthropic`, `cohere` |
| `OPENAI_API_KEY` | ⚠️ If using OpenAI | OpenAI API key |
| `HUGGINGFACE_API_KEY` | ⚠️ If using Hugging Face | Hugging Face API key |
| `GOOGLE_API_KEY` | ⚠️ If using Gemini | Google API key |
| `ANTHROPIC_API_KEY` | ⚠️ If using Claude | Anthropic API key |
| `COHERE_API_KEY` | ⚠️ If using Cohere | Cohere API key |
| `STRIPE_SECRET_KEY` | ✅ Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ Yes | Stripe webhook secret |
| `RESEND_API_KEY` | ✅ Yes | Resend API key |
| `PORT` | ❌ No | Server port (defaults to 3001) |
| `NODE_ENV` | ❌ No | Environment: `development` or `production` |

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- ✅ Check `.env` file exists in root
- ✅ Check variables start with `VITE_`
- ✅ Restart dev server after adding variables

### "Cannot connect to backend"
- ✅ Check `VITE_API_URL` is correct
- ✅ Check backend is running on port 3001
- ✅ Check backend `.env` has correct values

### "AI features not working"
- ✅ Check at least one AI provider is configured
- ✅ Check `AI_PROVIDER` matches the provider you configured
- ✅ Verify API key is valid

---

## 🚀 After Setup

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   # In root directory
   npm install
   npm start
   ```

3. **Open Browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

