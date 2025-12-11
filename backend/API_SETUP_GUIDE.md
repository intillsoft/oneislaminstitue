# 🔑 Complete API Setup Guide - All New Features

This guide shows you **exactly how to get** all API keys needed for Workflow's features.

---

## 📋 Table of Contents

1. [Talent Crawler APIs](#1-talent-crawler-apis-rapidapi)
2. [Email Notification APIs](#2-email-notification-apis-sendgrid)
3. [SMS Notification APIs](#3-sms-notification-apis-twilio)
4. [Payment Processing APIs](#4-payment-processing-apis-stripe)
5. [Job Crawler APIs](#5-job-crawler-apis-rapidapi)
6. [AI Provider APIs](#6-ai-provider-apis)
7. [Quick Setup Checklist](#quick-setup-checklist)

---

## 1. 🎯 Talent Crawler APIs (RapidAPI)

**What it does:** Crawls top-rated freelancers from Upwork, Fiverr, and Freelancer.

### Step-by-Step Setup:

#### Option A: RapidAPI (Recommended - Covers All Platforms)

1. **Go to RapidAPI:**
   - Visit: https://rapidapi.com/
   - Click **"Sign Up"** (or "Log In" if you have an account)

2. **Create Account:**
   - Sign up with email or Google/GitHub
   - Verify your email

3. **Subscribe to JSearch API:**
   - Search for: **"JSearch"** in the search bar
   - Click on **"JSearch API"** by `jsearch`
   - Click **"Subscribe to Test"** (Free tier: 100 requests/month)
   - OR **"Subscribe to Basic"** (Paid: $9.99/month for 1,000 requests)

4. **Get Your API Key:**
   - Go to your **Dashboard**: https://rapidapi.com/developer/billing
   - Find **"X-RapidAPI-Key"** - this is your `RAPIDAPI_KEY`
   - Copy the key

5. **Get the Host:**
   - In the JSearch API page, look for **"X-RapidAPI-Host"**
   - It should be: `jsearch.p.rapidapi.com`
   - This is your `RAPIDAPI_HOST`

6. **Add to `.env` file:**
   ```env
   RAPIDAPI_KEY=your_rapidapi_key_here
   RAPIDAPI_HOST=jsearch.p.rapidapi.com
   ```

**Cost:** Free tier available (100 requests/month), Paid from $9.99/month

---

## 2. 📧 Email Notification APIs (SendGrid)

**What it does:** Sends email notifications for job applications, auto-applies, and subscription updates.

### Step-by-Step Setup:

#### Option A: SendGrid (Recommended)

1. **Go to SendGrid:**
   - Visit: https://sendgrid.com/
   - Click **"Start for Free"**

2. **Create Account:**
   - Enter your email and create a password
   - Verify your email address
   - Complete the signup form

3. **Verify Your Sender:**
   - Go to **Settings** → **Sender Authentication**
   - Click **"Verify a Single Sender"**
   - Enter your email address and verify it
   - OR set up **Domain Authentication** (recommended for production)

4. **Create API Key:**
   - Go to **Settings** → **API Keys**
   - Click **"Create API Key"**
   - Name it: `Workflow Email Service`
   - Select **"Full Access"** (or "Restricted Access" with Mail Send permissions)
   - Click **"Create & View"**
   - **IMPORTANT:** Copy the key immediately (you won't see it again!)
   - This is your `SENDGRID_API_KEY`

5. **Add to `.env` file:**
   ```env
   SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Workflow
   ```

**Cost:** FREE tier: 100 emails/day forever, Paid from $19.95/month

#### Option B: Resend (Alternative)

1. **Go to Resend:**
   - Visit: https://resend.com/
   - Click **"Get Started"**

2. **Create Account:**
   - Sign up with email or GitHub
   - Verify your email

3. **Get API Key:**
   - Go to **API Keys** section
   - Click **"Create API Key"**
   - Name it: `Workflow Email`
   - Copy the key (starts with `re_`)

4. **Add to `.env` file:**
   ```env
   RESEND_API_KEY=re_your_resend_api_key_here
   RESEND_FROM_EMAIL=Workflow <noreply@yourdomain.com>
   ```

**Cost:** FREE tier: 3,000 emails/month, Paid from $20/month

---

## 3. 📱 SMS Notification APIs (Twilio)

**What it does:** Sends SMS notifications for job applications and auto-applies.

### Step-by-Step Setup:

#### Option A: Twilio (Recommended)

1. **Go to Twilio:**
   - Visit: https://www.twilio.com/
   - Click **"Sign up"**

2. **Create Account:**
   - Enter your email, name, and password
   - Verify your email and phone number
   - Complete the verification

3. **Get Your Credentials:**
   - After signup, you'll see your **Console Dashboard**
   - Find **"Account SID"** - this is your `TWILIO_ACCOUNT_SID`
   - Find **"Auth Token"** - click "View" to reveal it - this is your `TWILIO_AUTH_TOKEN`
   - Copy both

4. **Get a Phone Number:**
   - Go to **Phone Numbers** → **Manage** → **Buy a number**
   - Select your country
   - Choose a number (FREE for trial accounts)
   - This number will be your `TWILIO_PHONE_NUMBER`

5. **Add to `.env` file:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**Cost:** FREE trial: $15.50 credit, Paid: ~$0.0075 per SMS

#### Option B: AWS SNS (Alternative)

1. **Go to AWS:**
   - Visit: https://aws.amazon.com/
   - Sign up for AWS account

2. **Enable SNS:**
   - Go to **AWS Console** → **SNS**
   - Create a topic and subscription

3. **Get Credentials:**
   - Go to **IAM** → **Users** → **Security Credentials**
   - Create access key
   - Copy `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

4. **Add to `.env` file:**
   ```env
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   ```

**Cost:** Pay-as-you-go, ~$0.00645 per SMS

---

## 4. 💳 Payment Processing APIs (Stripe)

**What it does:** Handles subscription payments, upgrades, and billing.

### Step-by-Step Setup:

1. **Go to Stripe:**
   - Visit: https://stripe.com/
   - Click **"Start now"**

2. **Create Account:**
   - Enter your email and create password
   - Verify your email
   - Complete business information

3. **Get API Keys:**
   - Go to **Developers** → **API Keys**
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_` or `pk_live_`)
     - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Click **"Reveal test key"** to see secret key
   - Copy both keys

4. **Set Up Webhooks (For Production):**
   - Go to **Developers** → **Webhooks**
   - Click **"Add endpoint"**
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

5. **Create Products & Prices:**
   - Go to **Products** → **Add product**
   - Create products for each plan:
     - **Free Plan** (Price: $0)
     - **Professional Plan** (Price: $9.99/month)
     - **Premium Plan** (Price: $19.99/month)
     - **Recruiter Plan** (Price: $49.99/month)
   - Copy the **Price IDs** (start with `price_`)

6. **Add to `.env` file:**
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   STRIPE_PRICE_ID_FREE=price_free_plan
   STRIPE_PRICE_ID_PROFESSIONAL=price_professional_plan
   STRIPE_PRICE_ID_PREMIUM=price_premium_plan
   STRIPE_PRICE_ID_RECRUITER=price_recruiter_plan
   ```

**Cost:** FREE to set up, 2.9% + $0.30 per transaction

---

## 5. 🔍 Job Crawler APIs (RapidAPI)

**What it does:** Crawls jobs from LinkedIn, Glassdoor, and Indeed (only jobs from last week).

### Step-by-Step Setup:

**Same as Talent Crawler!** If you already set up RapidAPI for talent crawling, you can use the same API key.

1. **Use the same RapidAPI key from Step 1**
2. **Add to `.env` file:**
   ```env
   RAPIDAPI_KEY=your_rapidapi_key_here
   RAPIDAPI_HOST=jsearch.p.rapidapi.com
   ```

**Note:** The job crawler uses the same JSearch API, so no additional setup needed if you already have RapidAPI configured.

---

## 6. 🤖 AI Provider APIs

**What it does:** Powers AI features like resume generation, job matching, and career advisor.

### Quick Setup (Choose at least ONE):

#### Option A: OpenAI (Best Quality - Recommended)

1. **Go to OpenAI:**
   - Visit: https://platform.openai.com/
   - Click **"Sign up"**

2. **Create Account:**
   - Sign up with email or Google/Microsoft
   - Add payment method (required for API access)

3. **Get API Key:**
   - Go to **API Keys**: https://platform.openai.com/api-keys
   - Click **"Create new secret key"**
   - Name it: `Workflow AI`
   - Copy the key (starts with `sk-`)

4. **Add to `.env` file:**
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   AI_PROVIDER=openai
   ```

**Cost:** Pay-as-you-go, ~$0.15 per 1M tokens

#### Option B: Hugging Face (FREE)

1. **Go to Hugging Face:**
   - Visit: https://huggingface.co/
   - Click **"Sign up"**

2. **Create Account:**
   - Sign up with email or GitHub

3. **Get API Token:**
   - Go to **Settings** → **Access Tokens**: https://huggingface.co/settings/tokens
   - Click **"New token"**
   - Name it: `Workflow AI`
   - Select **"Read"** permission
   - Copy the token

4. **Add to `.env` file:**
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   AI_PROVIDER=huggingface
   ```

**Cost:** FREE (30 requests/minute)

#### Option C: Google Gemini (FREE Tier)

1. **Go to Google AI Studio:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account

2. **Create API Key:**
   - Click **"Create API Key"**
   - Copy the key

3. **Add to `.env` file:**
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   AI_PROVIDER=gemini
   ```

**Cost:** FREE tier: 60 requests/minute, 1,500/day

---

## 📝 Quick Setup Checklist

### Minimum Setup (FREE - Core Features Work)
```env
# AI Provider (Choose ONE)
HUGGINGFACE_API_KEY=your_key_here
# OR
GOOGLE_API_KEY=your_key_here

# Job & Talent Crawler
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=jsearch.p.rapidapi.com

# Database (Required)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Full Setup (All Features)
```env
# AI Provider
OPENAI_API_KEY=sk-your_key_here
AI_PROVIDER=openai

# Job & Talent Crawler
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=jsearch.p.rapidapi.com

# Email Notifications
SENDGRID_API_KEY=SG.your_key_here
FROM_EMAIL=noreply@yourdomain.com

# SMS Notifications
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🚀 How to Add API Keys

1. **Open your `.env` file:**
   ```bash
   # In backend folder
   cd backend
   # Edit .env file (create if it doesn't exist)
   ```

2. **Add all your API keys** (copy from above checklist)

3. **Restart your backend server:**
   ```bash
   npm run dev
   # or
   node server.js
   ```

---

## ✅ Verification

After adding API keys, test each feature:

1. **Talent Crawler:** Go to Admin Dashboard → Crawl Talents
2. **Job Crawler:** Jobs should appear in Job Browse page
3. **Email:** Apply to a job and check if email is sent
4. **SMS:** Enable SMS notifications and test
5. **Stripe:** Try upgrading a subscription
6. **AI:** Generate a resume or ask career advisor

---

## 🆘 Troubleshooting

**"Talent crawler not working"**
- ✅ Check `RAPIDAPI_KEY` and `RAPIDAPI_HOST` are correct
- ✅ Verify RapidAPI subscription is active
- ✅ Check API quota hasn't been exceeded

**"Email not sending"**
- ✅ Verify `SENDGRID_API_KEY` is correct
- ✅ Check sender email is verified in SendGrid
- ✅ Check SendGrid daily limit (100 emails/day on free tier)

**"SMS not sending"**
- ✅ Verify Twilio credentials are correct
- ✅ Check Twilio account has credit
- ✅ Verify phone number format (+1234567890)

**"Stripe payments failing"**
- ✅ Use test keys (`sk_test_`, `pk_test_`) for development
- ✅ Verify webhook endpoint is accessible
- ✅ Check Stripe dashboard for error logs

**"AI features not working"**
- ✅ Add at least one AI provider API key
- ✅ Check API quota/limits
- ✅ Verify API key is correct

---

## 📚 Additional Resources

- **RapidAPI Docs:** https://docs.rapidapi.com/
- **SendGrid Docs:** https://docs.sendgrid.com/
- **Twilio Docs:** https://www.twilio.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs

---

## 💡 Pro Tips

1. **Start with FREE tiers** - Most services offer generous free tiers
2. **Use test keys first** - Test everything before going live
3. **Monitor usage** - Set up alerts to avoid unexpected charges
4. **Rotate keys regularly** - For security, rotate API keys every 90 days
5. **Use environment variables** - Never commit API keys to Git!

---

**Need Help?** Check the main `REQUIRED_APIS_SUMMARY.md` file for quick reference.