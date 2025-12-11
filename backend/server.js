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

// Routes
import billingRoutes from './routes/billing.js';
import webhookRoutes from './routes/webhooks.js';
import emailRoutes from './routes/email.js';
import messagesRoutes from './routes/messages.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import jobCrawlerRoutes from './routes/jobCrawler.js';
import recommendationsRoutes from './routes/recommendations.js';
import talentRoutes from './routes/talent.js';
import profileRoutes from './routes/profile.js';
import applicationRoutes from './routes/applications.js';
import autoApplyRoutes from './routes/autoApply.js';
import notificationRoutes from './routes/notifications.js';
import subscriptionRoutes from './routes/subscriptions.js';
import talentCrawlerRoutes from './routes/talentCrawler.js';
import unifiedMessagesRoutes from './routes/unifiedMessages.js';
import talentAIRoutes from './routes/talentAI.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
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

// Job crawler (needs auth)
app.use('/api/job-crawler', authenticate, jobCrawlerRoutes);

// Talent routes - routes handle their own authentication (some public, some authenticated)
app.use('/api/talent', talentRoutes); // Routes handle auth individually - some public, some require auth
app.use('/api/profile', authenticate, profileRoutes); // Profile operations (needs auth)
app.use('/api/messages', authenticate, unifiedMessagesRoutes); // Unified messaging system (needs auth) - MUST be before legacy messages
app.use('/api/billing', authenticate, billingRoutes);
app.use('/api/email', authenticate, emailRoutes);
app.use('/api/emails', authenticate, messagesRoutes); // Legacy bulk email routes (needs auth)
app.use('/api/chat', authenticate, chatRoutes); // Chat/Conversation routes (needs auth)
app.use('/api/applications', authenticate, applicationRoutes); // Application routes (needs auth)
app.use('/api/autopilot', authenticate, autoApplyRoutes); // Autopilot routes (needs auth) - MUST be before /api catch-all
app.use('/api/auto-apply', authenticate, autoApplyRoutes); // Legacy alias for backward compatibility
app.use('/api/notifications', authenticate, notificationRoutes); // Notification routes (needs auth) - MUST be before /api catch-all
app.use('/api/subscriptions', subscriptionRoutes); // Subscription routes (some public, some auth) - MUST be before /api catch-all
app.use('/api/talent-crawler', talentCrawlerRoutes); // Talent crawler routes (admin only)
app.use('/api/talent-ai', authenticate, talentAIRoutes); // Talent AI features (needs auth)
app.use('/api/recommendations', authenticate, recommendationsRoutes); // Recommendations routes (needs auth)

// AI services - mount at /api/ai first for /api/ai/search/all route
app.use('/api/ai', aiRoutes); // AI routes at /api/ai (for /api/ai/search/all)
// IMPORTANT: Mount /api catch-all LAST to avoid intercepting specific routes
app.use('/api', aiRoutes); // Also mount at /api for other routes (resumes, jobs/match, etc.)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);

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

export default app;
