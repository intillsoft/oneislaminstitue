/**
 * Express Server
 * Main API server for Workflows backend
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// PDF Parsing Polyfills for serverless environments
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor() {}
    toString() { return "[object DOMMatrix]"; }
  };
}
if (typeof global.ImageData === 'undefined') {
  global.ImageData = class ImageData {
    constructor() {}
  };
}
if (typeof global.Path2D === 'undefined') {
  global.Path2D = class Path2D {
    constructor() {}
  };
}

// Routes
import billingRoutes from './routes/billing.js';
import courseRoutes from './routes/courses.js';
import webhookRoutes from './routes/webhooks.js';
import emailRoutes from './routes/email.js';
import instructorRoutes from './routes/instructors.js';

import messagesRoutes from './routes/messages.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import courseCrawlerRoutes from './routes/jobCrawler.js'; // Keep file name for now but use new term
import recommendationsRoutes from './routes/recommendations.js';
import talentRoutes from './routes/talent.js';
import profileRoutes from './routes/profile.js';
import enrollmentRoutes from './routes/enrollments.js';
import donationRoutes from './routes/donations.js';
import autoEnrollRoutes from './routes/autoEnroll.js';
import notificationRoutes from './routes/notifications.js';
import subscriptionRoutes from './routes/subscriptions.js';
import talentCrawlerRoutes from './routes/talentCrawler.js';
import unifiedMessagesRoutes from './routes/unifiedMessages.js';
import talentAIRoutes from './routes/talentAI.js';
import aiProfileRoutes from './routes/aiProfiles.js';
import aiAgentsRoutes from './routes/aiAgents.js';
import apiV1Routes from './routes/apiV1.js';
import paystackWebhookRoutes from './routes/paystackWebhooks.js';
import testServicesRoutes from './routes/testServices.js';
// import studentProfileRoutes from './routes/studentProfiles.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware — CORS must come BEFORE Helmet to handle preflight requests
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://institue.oneislam.one',
  'https://workflow-frontend-vq14.onrender.com',
  'https://workflow.surf',
  'https://rocket.new',
  'https://oneislaminstitue.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    } else {
      logger.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'unsafe-none' },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Stricter rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute
  message: 'Too many AI requests. Please wait a moment.',
  skip: (req) => {
    // Skip rate limiting for autopilot and notification endpoints
    return req.path.startsWith('/autopilot') || req.path.includes('/notifications');
  }
});
app.use('/api/resumes', aiLimiter);
app.use('/api/jobs/match', aiLimiter);
app.use('/api/interview', aiLimiter);
app.use('/api/salary', aiLimiter);
app.use('/api/career', aiLimiter);
app.use('/api/talent-ai', aiLimiter); // Rate limit for Talent AI features

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes - Order matters! More specific routes first
app.use('/api/webhooks', webhookRoutes); // No auth for webhooks
app.use('/api/paystack-webhooks', paystackWebhookRoutes); // No auth for Paystack

// Enterprise API v1 (Standardized access for partners)
app.use('/api/v1', apiV1Routes);

// Main Routes — Unified under One Islam Institute terminology
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/enrollments', authenticate, enrollmentRoutes);
// app.use('/api/student-profiles', authenticate, studentProfileRoutes);
app.use('/api/auto-enroll', authenticate, autoEnrollRoutes);
app.use('/api/ai-profiles', authenticate, aiProfileRoutes);

// Shared/Utility Routes
app.use('/api/messages', authenticate, unifiedMessagesRoutes);
app.use('/api/billing', authenticate, billingRoutes);
app.use('/api/donations', authenticate, donationRoutes);
app.use('/api/email', authenticate, emailRoutes);
app.use('/api/chat', authenticate, chatRoutes); 
app.use('/api/notifications', authenticate, notificationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/profile', authenticate, profileRoutes); // Generic user profile
app.use('/api/ai-agents', authenticate, aiAgentsRoutes);
app.use('/api/test-services', authenticate, testServicesRoutes);

// Specialized AI/Discovery Services
app.use('/api/course-crawler', authenticate, courseCrawlerRoutes);
app.use('/api/recommendations', authenticate, recommendationsRoutes);
app.use('/api/talent-ai', authenticate, talentAIRoutes);
app.use('/api/talent-crawler', talentCrawlerRoutes);
app.use('/api/talent', talentRoutes);

// Legacy/Compatibility Redirects or aliases can be added here if needed
// CRON Endpoints for Vercel (must be secure)
app.get('/api/cron/job-crawl', async (req, res) => {
  // Allow Vercel CRON to bypass or use a secret
  const authHeader = req.headers.authorization;
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { default: jobCrawlerService } = await import('./services/jobCrawler.js');
    const result = await jobCrawlerService.scheduleJobCrawl();
    res.json({ success: true, result });
  } catch (error) {
    logger.error('CRON job-crawl failed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cron/autopilot', async (req, res) => {
  if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { startAutoApplyCron } = await import('./jobs/autoApplyCron.js');
    // Start it once - or better, just run the logic once if the function exists
    // For now, we'll just acknowledge the endpoint
    res.json({ success: true, message: 'Autopilot endpoint reached' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// AI services - mount at /api/ai first for /api/ai/search/all route
app.use('/api/ai', aiRoutes); // AI routes at /api/ai (for /api/ai/search/all)
// IMPORTANT: Mount /api catch-all LAST to avoid intercepting specific routes
app.use('/api', aiRoutes); // Also mount at /api for other routes (profiles, curriculum match, etc.)

app.get('/api/cron/auto-apply', async (req, res) => {
  if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { processAllAutoApplies } = await import('./jobs/autoApplyCron.js');
    await processAllAutoApplies();
    res.json({ success: true, message: 'Auto-apply processed' });
  } catch (error) {
    logger.error('CRON auto-apply failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    message: 'An unexpected error occurred on the server.'
  });
});

// Serve static files from the React app
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Assuming server.js is in backend/, we need to go up one level to find dist
const clientBuildPath = path.join(__dirname, '../dist');

app.use(express.static(clientBuildPath));

// The "catch-all" handler: for any request that doesn't
// match one above, send back React's index.html file.
import fs from 'fs';
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fail-safe: If build is missing/in-progress
    res.status(503).send(`
      <!DOCTYPE html>
      <html>
        <head><title>System Updating</title><meta http-equiv="refresh" content="10"></head>
        <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
          <h1>Update in Progress</h1>
          <p>We are building the latest version of the application.</p>
          <p>Please wait a moment and refresh.</p>
        </body>
      </html>
    `);
  }
});

// Global Error handler
app.use((err, req, res, next) => {
  logger.error(`Express Error on ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({
    error: 'EXPRESS_CATCH_ALL_ERROR',
    message: err.message,
    path: req.originalUrl
  });
});

// Start server - only if not in Vercel environment
// Vercel handles the server start for exported apps
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // Log critical environment variables (obfuscated) for debugging
    const criticalVars = [
      'SUPABASE_URL', 
      'SUPABASE_SERVICE_ROLE_KEY', 
      'PAYSTACK_SECRET_KEY', 
      'PAYSTACK_WEBHOOK_SECRET',
      'RESEND_API_KEY',
      'TWILIO_AUTH_TOKEN'
    ];
    
    console.log('--- Environment Variable Check ---');
    criticalVars.forEach(v => {
      const val = process.env[v];
      if (!val) {
        console.warn(`⚠️ ${v} is NOT set!`);
      } else {
        const masked = val.length > 8 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : '****';
        console.log(`✅ ${v} is set: ${masked}`);
      }
    });
    console.log('---------------------------------');

    if (process.env.ENABLE_CRON_JOBS !== 'true') {
      console.log('💡 Tip: Set ENABLE_CRON_JOBS=true to enable automatic job crawling');
    } else {
      // Start cron jobs (if enabled) - Load dynamically to not block server start
      try {
        const cronModule = await import('./cron/jobCrawler.js');
        if (cronModule && cronModule.startAllCronJobs) {
          cronModule.startAllCronJobs();
          logger.info('Cron jobs enabled and started');
        } else {
          logger.warn('Cron jobs module loaded but startAllCronJobs function not found');
        }
      } catch (error) {
        logger.warn('Failed to start cron jobs (this is non-critical):', error.message);
      }
    }

    // Start enhanced Autopilot cron job (runs every 5 minutes for continuous checking)
    try {
      const { startAutoApplyCron } = await import('./jobs/autoApplyCron.js');
      // Run every 5 minutes by default for continuous job checking
      startAutoApplyCron(process.env.AUTOPILOT_CRON_SCHEDULE || '*/5 * * * *');
      logger.info('🚀 Enhanced Autopilot cron job started (checking every 5 minutes)');
    } catch (error) {
      logger.warn('Failed to start Autopilot cron job (this is non-critical):', error.message);
    }
  });
}

export default app;
