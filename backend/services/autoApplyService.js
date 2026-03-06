/**
 * Auto-Apply Service
 * Handles job auto-apply automation logic
 */

import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';
import { notificationService } from './notificationService.js';
import subscriptionService from './subscriptionService.js';
import aiAutoApplyService from './aiAutoApplyService.js';
import { tasks } from "@trigger.dev/sdk/v3";

export const autoApplyService = {
  /**
   * Get user's auto-apply settings
   */
  async getSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('auto_apply_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    } catch (error) {
      logger.error('Error getting auto-apply settings:', error);
      throw error;
    }
  },

  /**
   * Create or update auto-apply settings
   */
  async saveSettings(userId, settings) {
    try {
      const settingsData = {
        user_id: userId,
        enabled: settings.enabled ?? false,
        job_title_keywords: settings.job_title_keywords || [],
        skills_required: settings.skills_required || [],
        salary_min: settings.salary_min || null,
        salary_max: settings.salary_max || null,
        location: settings.location || [], // Enhanced to support array of locations
        remote_only: settings.remote_only ?? false,
        job_type: settings.job_type || [],
        experience_level: settings.experience_level || [],
        company_size: settings.company_size || [],
        industry: settings.industry || [],
        excluded_companies: settings.excluded_companies || [],
        excluded_titles: settings.excluded_titles || [],
        frequency: settings.frequency || 'continuous', // Changed default to continuous
        custom_schedule: settings.custom_schedule || null,
        max_applications_per_day: settings.max_applications_per_day || 10,
        notification_platform: settings.notification_platform ?? true,
        notification_email: settings.notification_email ?? true,
        notification_sms: settings.notification_sms ?? false,
        last_auto_apply_date: settings.last_auto_apply_date || null,
        // Re-enabled after DB migration
        check_interval_minutes: settings.check_interval_minutes || 15,
        use_ai_matching: settings.use_ai_matching ?? true,
        generate_cover_letter: settings.generate_cover_letter ?? true,
        min_match_score: typeof settings.min_match_score === 'number' ? settings.min_match_score : 50,
        allowed_platforms: settings.allowed_platforms || ['internal', 'linkedin', 'glassdoor', 'indeed'],
        best_resume_matching: settings.best_resume_matching ?? true,
      };

      // Check if settings exist for this user
      const { data: existing } = await supabase
        .from('auto_apply_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      let query;
      if (existing) {
        query = supabase
          .from('auto_apply_settings')
          .update(settingsData)
          .eq('user_id', userId);
      } else {
        query = supabase
          .from('auto_apply_settings')
          .insert(settingsData);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error saving auto-apply settings:', error);
      throw error;
    }
  },

  /**
   * Get auto-apply logs for a user
   */
  async getLogs(userId, options = {}) {
    try {
      const { page = 1, limit = 20, status, startDate, endDate } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('auto_apply_logs')
        .select(`
          *,
          jobs (
            id,
            title,
            company,
            location,
            salary_min,
            salary_max,
            url,
            application_url,
            description,
            source
          )
        `)
        .eq('user_id', userId)
        .order('applied_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      if (startDate) {
        query = query.gte('applied_at', startDate);
      }

      if (endDate) {
        query = query.lte('applied_at', endDate);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        logs: data || [],
        total: count || 0,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error getting auto-apply logs:', error);
      throw error;
    }
  },

  /**
   * Process auto-apply for a user
   * Called by cron job
   */
  async processAutoApply(userId) {
    try {
      // Get user's auto-apply settings
      const settings = await this.getSettings(userId);

      if (!settings || !settings.enabled) {
        return { applied: 0, skipped: 0, reason: 'Auto-apply disabled' };
      }

      // Check if it's time to check for new jobs (enhanced continuous checking)
      if (!this.shouldCheckNow(settings)) {
        logger.info(`⏸️ User ${userId}: Not time to check yet (last check: ${settings.last_check_at})`);
        return { applied: 0, skipped: 0, reason: 'Not time to check yet' };
      }

      // Update last_check_at immediately to prevent duplicate checks
      await supabase
        .from('auto_apply_settings')
        .update({ last_check_at: new Date().toISOString() })
        .eq('user_id', userId);

      // Check subscription limits
      const canApply = await subscriptionService.checkAutoApplyLimit(userId);
      if (!canApply.allowed) {
        return { applied: 0, skipped: 0, reason: canApply.reason };
      }

      // Get user's existing applications to avoid duplicates
      const { data: existingApplications } = await supabase
        .from('applications')
        .select('job_id')
        .eq('user_id', userId);

      const appliedJobIds = new Set(existingApplications?.map(app => app.job_id) || []);

      // Find matching jobs
      const matchingJobs = await this.findMatchingJobs(settings, appliedJobIds);

      if (matchingJobs.length === 0) {
        return { applied: 0, skipped: 0, reason: 'No matching jobs found' };
      }

      // Check daily limit
      const today = new Date().toISOString().split('T')[0];
      const { data: todayLogs } = await supabase
        .from('auto_apply_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'success')
        .gte('applied_at', `${today}T00:00:00Z`)
        .lte('applied_at', `${today}T23:59:59Z`);

      const todayCount = todayLogs?.length || 0;
      const remaining = settings.max_applications_per_day - todayCount;

      if (remaining <= 0) {
        return { applied: 0, skipped: matchingJobs.length, reason: 'Daily limit reached' };
      }

      // Apply to jobs (up to remaining limit)
      const jobsToApply = matchingJobs.slice(0, remaining);
      const results = await Promise.allSettled(
        jobsToApply.map(job => this.applyToJob(userId, job.id, settings))
      );

      const applied = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failed = results.filter(r => r.status === 'rejected').length;

      // Log failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error(`❌ Failed to apply to job ${jobsToApply[index]?.id}:`, result.reason);
        }
      });

      // Update last apply date and last check time
      const now = new Date().toISOString();
      await supabase
        .from('auto_apply_settings')
        .update({
          last_auto_apply_date: now,
          last_check_at: now
        })
        .eq('user_id', userId);

      // Update subscription usage
      // Update subscription usage for each successful application
      if (applied > 0) {
        for (let i = 0; i < applied; i++) {
          await subscriptionService.incrementAutoApplyCount(userId);
        }
      }

      return {
        applied,
        failed,
        skipped: matchingJobs.length - jobsToApply.length,
      };
    } catch (error) {
      logger.error('Error processing auto-apply:', error);
      throw error;
    }
  },

  /**
   * Check if it's time to check for new jobs based on interval
   * Enhanced to support continuous checking with custom intervals
   */
  shouldCheckNow(settings) {
    // If continuous mode or no last check, always check
    if (settings.frequency === 'continuous' || !settings.last_check_at) {
      return true;
    }

    // Use check_interval_minutes if available (new enhanced mode)
    if (settings.check_interval_minutes) {
      const lastCheck = new Date(settings.last_check_at);
      const now = new Date();
      const minutesSinceLastCheck = (now - lastCheck) / (1000 * 60);
      const interval = Math.max(5, settings.check_interval_minutes); // Minimum 5 minutes
      return minutesSinceLastCheck >= interval;
    }

    // Legacy frequency-based checking
    if (!settings.last_auto_apply_date) {
      return true; // Never applied before
    }

    const lastDate = new Date(settings.last_auto_apply_date);
    const now = new Date();
    const hoursSinceLastApply = (now - lastDate) / (1000 * 60 * 60);

    switch (settings.frequency) {
      case 'daily':
        return hoursSinceLastApply >= 24;
      case 'every_2_days':
        return hoursSinceLastApply >= 48;
      case 'weekly':
        return hoursSinceLastApply >= 168; // 7 days
      case 'custom':
        // TODO: Implement cron schedule parsing
        return hoursSinceLastApply >= 24;
      default:
        return true; // Default to continuous checking
    }
  },

  /**
   * Find jobs matching user's criteria
   */
  async findMatchingJobs(settings, appliedJobIds) {
    try {
      // Enhanced: Check ALL active jobs, not just limited set
      // Remove limit to check all jobs in database
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false }); // Newest jobs first

      // Exclude already applied jobs
      if (appliedJobIds.size > 0) {
        const appliedIdsArray = Array.from(appliedJobIds);
        logger.info(`🔍 [AutoApply] Excluding ${appliedIdsArray.length} already applied jobs`);
        // Supabase doesn't support NOT IN with large arrays, so we'll filter client-side
        // But we can still use it for small arrays
        if (appliedIdsArray.length < 100) {
          query = query.not('id', 'in', `(${appliedIdsArray.join(',')})`);
        }
      }

      // DEBUG: Log query parameters
      logger.info(`🔍 [AutoApply] Searching for jobs with criteria:`, {
        keywords: settings.job_title_keywords,
        location: settings.location,
        salary_min: settings.salary_min,
        job_type: settings.job_type,
        remote: settings.remote_only
      });

      // Build job search query with proper escaping
      if (settings.job_title_keywords && settings.job_title_keywords.length > 0) {
        const jobTitleKeywords = settings.job_title_keywords
          .map(k => {
            const str = typeof k === 'string' ? k : String(k);
            return str.trim();
          })
          .filter(k => k.length > 0)
          .map(keyword => {
            // Remove commas (separator in OR clause) and other special chars that break PostgREST
            // Also escape double quotes since we wrap the value in them
            const sanitized = keyword.replace(/[,()]/g, '').replace(/"/g, '');
            // Wrap in quotes to handle spaces and special chars like % correctly
            return `title.ilike."%${sanitized}%"`;
          })
          .join(',');

        if (jobTitleKeywords.length > 0) {
          query = query.or(jobTitleKeywords);
        }
      }

      // Filter by location (Enhanced for multi-location)
      if (settings.remote_only) {
        query = query.or('location.ilike.%remote%,location.ilike.%anywhere%');
      } else if (settings.location) {
        // Handle both array (new schema) and string (legacy)
        let locations = [];
        if (Array.isArray(settings.location)) {
          locations = settings.location.filter(l => l && l.trim().length > 0);
        } else if (typeof settings.location === 'string' && settings.location.trim().length > 0) {
          locations = [settings.location];
        }

        if (locations.length > 0) {
          // Construct OR query for multiple locations: location.ilike.%NY%,location.ilike.%London%
          const locationQuery = locations
            .map(loc => `location.ilike."%${loc.trim()}%"`)
            .join(',');
          query = query.or(locationQuery);
        }
      }

      // Filter by salary range
      if (settings.salary_min) {
        query = query.gte('salary_max', settings.salary_min);
      }
      if (settings.salary_max) {
        query = query.lte('salary_min', settings.salary_max);
      }

      // Filter by job type
      if (settings.job_type && settings.job_type.length > 0) {
        query = query.in('job_type', settings.job_type);
      }

      // Exclude blacklisted companies
      if (settings.excluded_companies && settings.excluded_companies.length > 0) {
        for (const company of settings.excluded_companies) {
          query = query.not('company', 'ilike', `%${company}%`);
        }
      }

      // Exclude blacklisted titles
      if (settings.excluded_titles && settings.excluded_titles.length > 0) {
        for (const title of settings.excluded_titles) {
          query = query.not('title', 'ilike', `%${title}%`);
        }
      }

      const { data, error } = await query;

      if (error) {
        logger.error('❌ [AutoApply] Job search query failed:', error);
        throw error;
      }

      logger.info(`Found ${data?.length || 0} candidate jobs from DB before filtering`);

      // Filter by skills and exclude already applied jobs (client-side for large sets)
      let matchingJobs = data || [];

      // Filter out already applied jobs if we couldn't do it in the query
      if (appliedJobIds.size > 0 && appliedJobIds.size >= 100) {
        matchingJobs = matchingJobs.filter(job => !appliedJobIds.has(job.id));
      }

      if (settings.skills_required && settings.skills_required.length > 0) {
        matchingJobs = matchingJobs.filter(job => {
          const jobText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();
          return settings.skills_required.some(skill =>
            jobText.includes(skill.toLowerCase())
          );
        });
      }

      // Enhanced: Use AI matching if enabled to filter and rank jobs
      if (settings.use_ai_matching !== false) {
        try {
          // Get user's resume for AI matching
          const { data: resumes } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', settings.user_id)
            .eq('is_default', true)
            .limit(1);

          const resume = resumes?.[0];
          if (resume) {
            const resumeText = JSON.stringify(resume.content_json || {});
            const minMatchScore = settings.min_match_score || 60;

            // Filter jobs by AI match score
            const jobsWithScores = await Promise.all(
              matchingJobs.map(async (job) => {
                try {
                  const analysis = await aiAutoApplyService.analyzeJobMatch(
                    resumeText,
                    job.description || '',
                    job.title || '',
                    job.company || ''
                  );
                  logger.info(`🧠 [AutoApply] Job ${job.id} (${job.title}): AI Match Score = ${analysis.matchScore}%`);
                  return { ...job, aiMatchScore: analysis.matchScore || 0 };
                } catch (error) {
                  logger.warn(`AI matching failed for job ${job.id}:`, error);
                  return { ...job, aiMatchScore: 50 }; // Default score if AI fails
                }
              })
            );

            // Filter by minimum match score and sort by score
            logger.info(`🔍 [AutoApply] Filtering ${jobsWithScores.length} jobs with minMatchScore=${minMatchScore}`);
            matchingJobs = jobsWithScores
              .filter(job => job.aiMatchScore >= minMatchScore)
              .sort((a, b) => {
                // Sort by AI match score (highest first), then by date
                if (b.aiMatchScore !== a.aiMatchScore) {
                  return b.aiMatchScore - a.aiMatchScore;
                }
                const dateA = new Date(a.created_at || a.posted_at);
                const dateB = new Date(b.created_at || b.posted_at);
                return dateB - dateA;
              });
          }
        } catch (aiError) {
          logger.warn('AI matching failed, using basic filtering:', aiError);
          // Fall back to basic sorting if AI fails
          matchingJobs.sort((a, b) => {
            const dateA = new Date(a.created_at || a.posted_at);
            const dateB = new Date(b.created_at || b.posted_at);
            return dateB - dateA;
          });
        }
      } else {
        // Basic sorting by date if AI matching is disabled
        matchingJobs.sort((a, b) => {
          const dateA = new Date(a.created_at || a.posted_at);
          const dateB = new Date(b.created_at || b.posted_at);
          return dateB - dateA;
        });
      }

      return matchingJobs;
    } catch (error) {
      logger.error('Error finding matching jobs:', error);
      throw error;
    }
  },

  /**
   * Select the best resume for a specific job
   */
  async pickBestResume(userId, job) {
    try {
      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId);

      if (!resumes || resumes.length === 0) return null;
      if (resumes.length === 1) return resumes[0];

      // Score each resume
      const scoredResumes = await Promise.all(
        resumes.map(async (resume) => {
          try {
            const analysis = await aiAutoApplyService.analyzeJobMatch(
              JSON.stringify(resume.content_json || {}),
              job.description || '',
              job.title || '',
              job.company || ''
            );
            return { ...resume, matchScore: analysis.matchScore };
          } catch (e) {
            return { ...resume, matchScore: 0 };
          }
        })
      );

      // Return the one with the highest score
      return scoredResumes.sort((a, b) => b.matchScore - a.matchScore)[0];
    } catch (error) {
      logger.error('Error picking best resume:', error);
      return null;
    }
  },

  /**
   * Apply to a job on behalf of user
   */
  async applyToJob(userId, jobId, settings) {
    try {
      // Get job details first to determine source
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (!job) {
        await this.logAutoApply(userId, jobId, 'failed', 'Job not found');
        throw new Error('Job not found');
      }

      // Check if platform is allowed
      const platform = job.source || 'internal';
      const allowedPlatforms = settings.allowed_platforms || ['internal'];
      if (!allowedPlatforms.includes(platform)) {
        await this.logAutoApply(userId, jobId, 'skipped', `Platform ${platform} not allowed`);
        return null;
      }

      // Get user's resume (best match or default)
      let resume = null;
      if (settings.best_resume_matching) {
        resume = await this.pickBestResume(userId, job);
      } else {
        const { data: resumes } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .eq('is_default', true)
          .limit(1);
        resume = resumes?.[0];
      }

      if (!resume) {
        await this.logAutoApply(userId, jobId, 'failed', 'No suitable resume found');
        throw new Error('No resume found');
      }

      // Process based on source
      if (platform === 'internal' || platform === 'WorkFlow') {
        return await this.applyInternally(userId, job, resume, settings);
      } else {
        // STRATEGY: External Jobs move to Trigger.dev background task to prevent timeouts
        logger.info(`🛰️ [AutoApply] External job detected (${platform}). Offloading to Trigger.dev Agent.`);

        // 0. Calculate AI Match Score before offloading (for UI visibility)
        let matchScore = null;
        try {
          const resumeText = JSON.stringify(resume.content_json || {});
          const aiAnalysis = await aiAutoApplyService.analyzeJobMatch(
            resumeText,
            job.description || '',
            job.title || '',
            job.company || ''
          );
          matchScore = aiAnalysis?.matchScore || 0;
          logger.info(`🧠 [AutoApply] Pre-calculated match score: ${matchScore}%`);
        } catch (error) {
          logger.warn('Failed to calculate match score for external job:', error);
        }

        // 1. Log the initiation as 'processing'
        const { data: log, error: logError } = await supabase
          .from('auto_apply_logs')
          .insert({
            user_id: userId,
            job_id: job.id,
            status: 'processing',
            platform: platform,
            resume_id: resume.id,
            match_score: matchScore, // Now included!
            applied_at: new Date().toISOString()
          })
          .select()
          .single();

        if (logError) throw logError;

        // 2. Trigger the background task
        await tasks.trigger("autopilot-agent", {
          jobUrl: job.url, // Corrected column
          resumeData: resume.content_json,
          userId: userId,
          jobId: job.id,
          logId: log.id
        });

        return { success: true, queued: true };
      }
    } catch (error) {
      logger.error('Error applying to job:', error);
      await this.logAutoApply(userId, jobId, 'failed', error.message);
      throw error;
    }
  },

  /**
   * Retry external application using AI Agent
   */
  async retryAutoApply(userId, logId) {
    try {
      // Fetch Log + Job Details
      const { data: log, error: logError } = await supabase
        .from('auto_apply_logs')
        .select(`
          *,
          jobs ( id, url, title, description, company )
        `)
        .eq('id', logId)
        .eq('user_id', userId)
        .single();

      if (logError || !log) throw new Error('Log not found or access denied');
      if (!log.jobs) throw new Error('Associated job not found');

      // Fetch User's Resume
      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .eq('id', log.resume_id) // Prefer mapped resume
        .limit(1);

      let resume = resumes?.[0];

      // Fallback if original resume deleted
      if (!resume) {
        const { data: defaultResumes } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .eq('is_default', true)
          .limit(1);
        resume = defaultResumes?.[0];
      }

      if (!resume) throw new Error('No resume found for application');

      // Update Log Status to processing
      await supabase
        .from('auto_apply_logs')
        .update({ status: 'processing', reason: 'Manual Retry' })
        .eq('id', logId);

      // Trigger Background Task
      await tasks.trigger("autopilot-agent", {
        jobUrl: log.jobs.url,
        resumeData: resume.content_json,
        userId: userId,
        jobId: log.jobs.id,
        logId: logId
      });

      return { success: true, queued: true };

    } catch (error) {
      logger.error('Error retrying auto-apply:', error);
      throw error;
    }
  },

  /**
   * Handle internal application
   */
  async applyInternally(userId, job, resume, settings) {
    // Use AI to analyze job match
    let aiAnalysis = null;
    let coverLetter = null;
    try {
      const resumeText = JSON.stringify(resume.content_json || {});
      aiAnalysis = await aiAutoApplyService.analyzeJobMatch(
        resumeText,
        job.description || '',
        job.title || '',
        job.company || ''
      );

      const minMatchScore = settings.min_match_score || 60;
      if (aiAnalysis.matchScore < minMatchScore) {
        await this.logAutoApply(
          userId,
          job.id,
          'skipped',
          `Match score too low: ${aiAnalysis.matchScore} < ${minMatchScore}`,
          'internal',
          resume.id,
          aiAnalysis.matchScore
        );
        return null;
      }

      if (settings.generate_cover_letter !== false) {
        coverLetter = await aiAutoApplyService.generateCoverLetter(
          resumeText,
          job.description || '',
          job.title || '',
          job.company || ''
        );
      }
    } catch (aiError) {
      logger.warn('AI analysis failed, proceeding:', aiError);
    }

    const applicationData = {
      user_id: userId,
      job_id: job.id,
      resume_id: resume.id,
      status: 'applied',
      notes: `Autopilot applied (AI Match: ${aiAnalysis?.matchScore || 'N/A'}%)`,
      cover_letter: coverLetter || null,
      ai_analysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null,
    };

    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();

    if (appError) throw appError;

    await this.logAutoApply(userId, job.id, 'success', null, 'internal', resume.id, aiAnalysis?.matchScore);

    await notificationService.sendAutoAppliedNotification(userId, job, {
      platform: settings.notification_platform,
      email: settings.notification_email,
      sms: settings.notification_sms,
    });

    return application;
  },

  /**
   * Handle third-party application via browser automation simulation
   */
  /**
   * Get auto-apply statistics for dashboard
   */
  async getStats(userId, timeRange = 'week') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'week':
        default:
          startDate.setDate(now.getDate() - 7);
          break;
      }

      // precise start of day for accurate daily stats
      startDate.setHours(0, 0, 0, 0);

      // Get all logs within range
      const { data: logs, error } = await supabase
        .from('auto_apply_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('applied_at', startDate.toISOString());

      if (error) throw error;

      // Calculate totals
      const total = logs.length;
      const internalApplied = logs.filter(l => l.status === 'success').length;
      const externalApplied = logs.filter(l => l.status === 'manual_applied').length;
      const pendingMatches = logs.filter(l => l.status === 'manual_apply').length;
      const failed = logs.filter(l => l.status === 'failed').length;

      // Calculate today's count
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayCount = logs.filter(l => new Date(l.applied_at) >= todayStart).length;

      // Group by date for trends
      const trendsMap = {};
      // Initialize all dates in range with 0
      for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        trendsMap[dateStr] = { date: dateStr, internal: 0, external: 0, failed: 0 };
      }

      logs.forEach(log => {
        const dateStr = new Date(log.applied_at).toISOString().split('T')[0];
        if (trendsMap[dateStr]) {
          if (log.status === 'success') trendsMap[dateStr].internal++;
          if (log.status === 'manual_applied') trendsMap[dateStr].external++;
          if (log.status === 'failed') trendsMap[dateStr].failed++;
        }
      });

      const trends = Object.values(trendsMap).sort((a, b) => new Date(a.date) - new Date(b.date));

      // Get pending count (applications in applied status but no response yet - approx)
      const { count: pending } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'applied');


      // Calculate average match score from applications with AI analysis
      const { data: applications } = await supabase
        .from('applications')
        .select('ai_analysis')
        .eq('user_id', userId)
        .not('ai_analysis', 'is', null)
        .gte('created_at', startDate.toISOString());

      let avgMatchScore = 0;
      if (applications && applications.length > 0) {
        const totalScore = applications.reduce((sum, app) => {
          try {
            const analysis = typeof app.ai_analysis === 'string' ? JSON.parse(app.ai_analysis) : app.ai_analysis;
            return sum + (analysis.matchScore || 0);
          } catch (e) {
            return sum;
          }
        }, 0);
        avgMatchScore = Math.round(totalScore / applications.length);
      }

      return {
        total,
        internalApplied,
        externalApplied,
        pendingMatches,
        failed,
        pending: pending || 0,
        todayCount,
        avgMatchScore,
        trends
      };
    } catch (error) {
      logger.error('Error getting auto-apply stats:', error);
      throw error;
    }
  },

  /**
   * Confirm manual application of a job
   */
  async confirmManualApply(userId, logId) {
    try {
      const { data, error } = await supabase
        .from('auto_apply_logs')
        .update({
          status: 'manual_applied',
          applied_at: new Date().toISOString()
        })
        .eq('id', logId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Also increment subscription usage for manual applied
      await subscriptionService.incrementAutoApplyCount(userId);

      return data;
    } catch (error) {
      logger.error('Error confirming manual apply:', error);
      throw error;
    }
  },

  /**
   * Log auto-apply activity
   */
  async logAutoApply(userId, jobId, status, reason = null, platform = 'internal', resumeId = null, matchScore = null) {
    try {
      const { error } = await supabase
        .from('auto_apply_logs')
        .insert({
          user_id: userId,
          job_id: jobId,
          status,
          reason,
          platform,
          resume_id: resumeId,
          match_score: matchScore,
          notification_sent: status === 'success',
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Error logging auto-apply:', error);
    }
  },
};

export default autoApplyService;
