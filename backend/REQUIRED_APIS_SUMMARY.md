# Required APIs Summary

## ✅ All APIs You Need to Add

### 🔴 CRITICAL - AI Provider (Choose at least ONE)

The app needs at least **ONE** AI provider API key for these features to work:
- ✅ Resume Generator
- ✅ Job Matching & Recommendations
- ✅ Interview Prep
- ✅ Career Advisor
- ✅ AI Conversations

**Recommended FREE Options:**
1. **Hugging Face** (FREE) - `HUGGINGFACE_API_KEY`
   - Get: https://huggingface.co/settings/tokens
   - Rate limit: 30 requests/minute

2. **Google Gemini** (FREE tier) - `GOOGLE_API_KEY`
   - Get: https://makersuite.google.com/app/apikey
   - Rate limit: 60 requests/minute, 1,500/day

3. **Groq** (FREE tier) - `GROQ_API_KEY`
   - Get: https://console.groq.com/keys
   - Rate limit: 30 requests/minute

**Paid Options (Better Quality):**
4. **OpenAI** - `OPENAI_API_KEY`
   - Get: https://platform.openai.com/api-keys
   - Cost: Pay-as-you-go

5. **Anthropic Claude** - `ANTHROPIC_API_KEY`
   - Get: https://console.anthropic.com/
   - Cost: Pay-as-you-go

6. **Together AI** - `TOGETHER_API_KEY`
   - Get: https://api.together.xyz/
   - Cost: Very affordable

7. **DeepSeek** - `DEEPSEEK_API_KEY`
   - Get: https://platform.deepseek.com/
   - Cost: Very affordable

8. **Ollama** (Local - FREE) - `OLLAMA_BASE_URL`
   - Install: https://ollama.ai
   - Runs locally, no API key needed

9. **Cohere** - `COHERE_API_KEY`
   - Get: https://cohere.com/
   - Cost: Paid

---

### 🔴 CRITICAL - Job Crawler (Choose at least ONE)

The app needs at least **ONE** job crawler API key for these features to work:
- ✅ Job Listings
- ✅ Job Search
- ✅ Automatic Job Updates

**Recommended FREE Options:**
1. **Indeed Publisher API** (FREE) - `INDEED_PUBLISHER_ID`
   - Get: https://ads.indeed.com/jobroll/signup
   - Covers: Indeed jobs only

2. **SerpAPI** (100 free searches/month) - `SERP_API_KEY`
   - Get: https://serpapi.com/
   - Covers: Google Jobs

3. **Adzuna API** (FREE tier) - `ADZUNA_API_KEY` + `ADZUNA_APP_ID`
   - Get: https://developer.adzuna.com/
   - Covers: Multiple job boards

**Paid Options (More Sources):**
4. **RapidAPI** - `RAPIDAPI_KEY`
   - Get: https://rapidapi.com/
   - Covers: LinkedIn, Glassdoor, Indeed
   - Cost: Subscription

5. **LinkedIn Official API** - `LINKEDIN_API_KEY`
   - Get: https://www.linkedin.com/developers/
   - Covers: LinkedIn jobs only
   - Cost: Paid

---

### 🟡 REQUIRED - Database

**Supabase** (FREE tier available):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Get: https://supabase.com/

---

### 🟡 REQUIRED - Talent Crawler (NEW FEATURE)

**RapidAPI (JSearch API):**
- `RAPIDAPI_KEY` - https://rapidapi.com/
- `RAPIDAPI_HOST` - `jsearch.p.rapidapi.com`
- **What it does:** Crawls top-rated freelancers from Upwork, Fiverr, Freelancer
- **Cost:** FREE tier: 100 requests/month, Paid from $9.99/month
- **📖 Full Setup Guide:** See `API_SETUP_GUIDE.md` Section 1

---

### 🟡 REQUIRED - Email Notifications (NEW FEATURE)

**SendGrid (Recommended):**
- `SENDGRID_API_KEY` - https://sendgrid.com/
- `FROM_EMAIL` - Your sender email
- `FROM_NAME` - Your sender name
- **What it does:** Sends email notifications for job applications, auto-applies, subscriptions
- **Cost:** FREE tier: 100 emails/day, Paid from $19.95/month
- **📖 Full Setup Guide:** See `API_SETUP_GUIDE.md` Section 2

**OR Resend (Alternative):**
- `RESEND_API_KEY` - https://resend.com/
- `RESEND_FROM_EMAIL` - Your sender email
- **Cost:** FREE tier: 3,000 emails/month

---

### 🟡 REQUIRED - SMS Notifications (NEW FEATURE)

**Twilio (Recommended):**
- `TWILIO_ACCOUNT_SID` - https://www.twilio.com/
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- **What it does:** Sends SMS notifications for job applications and auto-applies
- **Cost:** FREE trial: $15.50 credit, Paid: ~$0.0075 per SMS
- **📖 Full Setup Guide:** See `API_SETUP_GUIDE.md` Section 3

**OR AWS SNS (Alternative):**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

---

### 🟡 REQUIRED - Payment Processing (NEW FEATURE)

**Stripe:**
- `STRIPE_SECRET_KEY` - https://stripe.com/
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_FREE` - Price ID for Free plan
- `STRIPE_PRICE_ID_PROFESSIONAL` - Price ID for Professional plan
- `STRIPE_PRICE_ID_PREMIUM` - Price ID for Premium plan
- `STRIPE_PRICE_ID_RECRUITER` - Price ID for Recruiter plan
- **What it does:** Handles subscription payments, upgrades, billing
- **Cost:** FREE to set up, 2.9% + $0.30 per transaction
- **📖 Full Setup Guide:** See `API_SETUP_GUIDE.md` Section 4

---

## 📋 Quick Setup Checklist

### Minimum Setup (FREE - All features work)
```
✅ HUGGINGFACE_API_KEY (or GOOGLE_API_KEY or GROQ_API_KEY)
✅ INDEED_PUBLISHER_ID (or SERP_API_KEY or ADZUNA_API_KEY)
✅ SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### Recommended Setup (Best quality)
```
✅ OPENAI_API_KEY (or ANTHROPIC_API_KEY)
✅ RAPIDAPI_KEY
✅ SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

---

## 🚀 How to Add API Keys

1. Copy `env.example` to `.env`:
   ```bash
   cp backend/env.example backend/.env
   ```

2. Edit `backend/.env` and add your API keys

3. Restart the backend server

---

## 🔄 Automatic Fallback

The app automatically tries alternative providers if one fails:

**AI Providers Fallback Chain:**
OpenAI → Anthropic → Gemini → Groq → Together AI → Hugging Face → Ollama

**Job Crawlers Fallback Chain:**
RapidAPI → Indeed Publisher → SerpAPI → Adzuna → LinkedIn

---

## 📚 Full Documentation

**📖 COMPLETE SETUP GUIDE:** See `backend/API_SETUP_GUIDE.md` for **step-by-step instructions** on how to get ALL API keys, including:
- ✅ Talent Crawler (RapidAPI) - How to crawl freelancers
- ✅ Email Notifications (SendGrid/Resend) - How to send emails
- ✅ SMS Notifications (Twilio) - How to send SMS
- ✅ Payment Processing (Stripe) - How to set up payments
- ✅ Job Crawler (RapidAPI) - How to crawl jobs
- ✅ AI Providers - How to set up AI features

**👉 START HERE:** Open `backend/API_SETUP_GUIDE.md` for detailed instructions!

---

## ❓ Troubleshooting

**"AI generation failed"**
- ✅ Add at least one AI provider API key
- ✅ Verify the API key is correct
- ✅ Check API quota/limits

**"No jobs found"**
- ✅ Add at least one job crawler API key
- ✅ Verify the API key is correct
- ✅ Check API rate limits

**"401 Unauthorized"**
- ✅ Verify API key is correct
- ✅ Check if API key expired
- ✅ Ensure API key has correct permissions