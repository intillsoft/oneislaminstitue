# Production Deployment Guide

## 🚀 Complete Production Checklist

### 1. Environment Configuration

#### Frontend Environment Variables

Create `.env.production`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Backend API
VITE_API_URL=https://api.yourdomain.com/api

# Analytics (optional)
VITE_GA_ID=your_google_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

#### Backend Environment Variables

Create `backend/.env.production`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_BASIC=price_live_basic
STRIPE_PRICE_ID_PREMIUM=price_live_premium
STRIPE_PRICE_ID_PRO=price_live_pro

# OpenAI
OPENAI_API_KEY=sk-your_production_key

# Resend
RESEND_API_KEY=re_your_production_key
RESEND_FROM_EMAIL=Workflow <noreply@yourdomain.com>

# Application
FRONTEND_URL=https://yourdomain.com
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=your_production_database_url
```

### 2. Security Checklist

#### ✅ Row Level Security (RLS)

Verify all Supabase tables have RLS enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- ... etc
```

#### ✅ API Rate Limiting

Backend already has rate limiting configured. Verify:

```javascript
// backend/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
});
```

#### ✅ Input Validation

All API endpoints should validate input:

```javascript
import Joi from 'joi';

const jobSchema = Joi.object({
  title: Joi.string().required().max(200),
  description: Joi.string().required(),
  // ... etc
});
```

#### ✅ CORS Configuration

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

#### ✅ Environment Variables

- ✅ No hardcoded secrets
- ✅ All secrets in environment variables
- ✅ `.env` files in `.gitignore`
- ✅ Use secret management in production (AWS Secrets Manager, etc.)

### 3. Database Optimization

#### ✅ Indexes

Ensure all frequently queried columns are indexed:

```sql
-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);

-- Applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Resumes table indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_default ON resumes(is_default) WHERE is_default = true;
```

#### ✅ Connection Pooling

Configure Supabase connection pooling:

```javascript
// Use connection pooler URL
const supabaseUrl = 'https://your-project.pooler.supabase.co';
```

### 4. Performance Optimization

#### ✅ Code Splitting

Vite automatically code-splits. Verify in `vite.config.mjs`:

```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
};
```

#### ✅ Image Optimization

```javascript
// Use optimized images
import { Image } from 'components/AppImage';

<Image
  src={job.logo}
  alt={job.company}
  loading="lazy"
  width={64}
  height={64}
/>
```

#### ✅ Caching Strategy

```javascript
// API response caching
const cache = new Map();

export const getCachedJobs = async (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await jobService.getAll();
  cache.set(key, data);
  setTimeout(() => cache.delete(key), 5 * 60 * 1000); // 5 min
  return data;
};
```

### 5. Monitoring & Analytics

#### ✅ Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```javascript
// src/index.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### ✅ Performance Monitoring

```javascript
// Track page load times
import { useEffect } from 'react';

useEffect(() => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page load time:', pageLoadTime);
  // Send to analytics
}, []);
```

#### ✅ Database Monitoring

Set up Supabase monitoring:
- Go to Dashboard > Database > Performance
- Monitor query performance
- Set up alerts for slow queries

### 6. Testing

#### ✅ API Endpoint Testing

```bash
# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test job search
curl -X GET "https://api.yourdomain.com/api/jobs?search=developer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### ✅ End-to-End Testing

Use Playwright or Cypress:

```javascript
// e2e/job-search.spec.js
test('search for jobs', async ({ page }) => {
  await page.goto('/job-search-browse');
  await page.fill('input[placeholder*="Search"]', 'developer');
  await page.click('button[type="submit"]');
  await expect(page.locator('.job-card')).toBeVisible();
});
```

### 7. Deployment

#### Frontend (Vercel/Netlify)

**Vercel:**

```bash
npm install -g vercel
vercel --prod
```

Configure in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Netlify:**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Configure in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_SUPABASE_URL = "your_url"
  VITE_SUPABASE_ANON_KEY = "your_key"
```

#### Backend (Railway/Render/Heroku)

**Railway:**

```bash
railway login
railway init
railway up
```

**Render:**

1. Connect GitHub repo
2. Set build command: `cd backend && npm install && npm start`
3. Add environment variables
4. Deploy

### 8. Post-Deployment

#### ✅ Health Checks

```javascript
// backend/server.js
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    stripe: await checkStripe(),
    openai: await checkOpenAI(),
  };
  
  const healthy = Object.values(checks).every(c => c === true);
  res.status(healthy ? 200 : 503).json({ checks, healthy });
});
```

#### ✅ SSL/TLS

- ✅ Enable HTTPS (automatic with Vercel/Netlify)
- ✅ Force HTTPS redirects
- ✅ HSTS headers

#### ✅ Domain Configuration

1. Add custom domain
2. Configure DNS
3. Update CORS origins
4. Update OAuth redirect URLs

### 9. Backup & Recovery

#### ✅ Database Backups

Supabase automatically backs up. Verify:
- Daily backups enabled
- Point-in-time recovery available
- Backup retention period set

#### ✅ Code Backups

- ✅ Git repository (GitHub/GitLab)
- ✅ Regular commits
- ✅ Tagged releases

### 10. Documentation

#### ✅ API Documentation

Generate with Swagger/OpenAPI:

```javascript
// backend/routes/api.js
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workflow API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
});
```

#### ✅ User Documentation

- ✅ README.md
- ✅ API documentation
- ✅ Integration guides
- ✅ Troubleshooting guides

## 🎯 Go-Live Checklist

- [ ] All environment variables configured
- [ ] RLS policies tested
- [ ] API rate limiting verified
- [ ] Database indexes created
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] SSL certificates valid
- [ ] Domain configured
- [ ] OAuth providers configured
- [ ] Email service tested
- [ ] Payment processing tested (test mode)
- [ ] Backup strategy verified
- [ ] Documentation complete
- [ ] Team trained on deployment process

## 🚨 Emergency Procedures

### Database Issues

```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Kill long-running queries
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '5 minutes';
```

### API Downtime

1. Check backend health endpoint
2. Review error logs
3. Check database connectivity
4. Verify environment variables
5. Restart services if needed

### Security Incident

1. Rotate all API keys immediately
2. Review access logs
3. Check for unauthorized access
4. Update RLS policies if needed
5. Notify affected users

## 📊 Success Metrics

Track these KPIs:

- **Uptime**: Target 99.9%
- **API Response Time**: < 200ms p95
- **Error Rate**: < 0.1%
- **Database Query Time**: < 100ms p95
- **Page Load Time**: < 2s
- **User Satisfaction**: > 4.5/5

## 🔗 Resources

- [Supabase Production Guide](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel Deployment](https://vercel.com/docs)
- [Stripe Production Checklist](https://stripe.com/docs/keys)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

