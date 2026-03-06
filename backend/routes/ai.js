/**
 * AI Services API Routes
 * Handles all AI-powered features
 */

import express from 'express';


import resumeGenerator from '../services/resumeGenerator.js';
import jobMatching from '../services/jobMatching.js';
import interviewPrep from '../services/interviewPrep.js';
import salaryIntelligence from '../services/salaryIntelligence.js';
import careerAdvisor from '../services/careerAdvisor.js';
import aiProviderService from '../services/aiProviderService.js';
import aiValidator from '../services/aiValidator.js';
import talentAI from '../services/talentAI.js'; // New Import
import { authenticate, optionalAuth } from '../middleware/auth.js';
import * as jobCrawlerService from '../services/jobCrawler.js';
import logger from '../utils/logger.js';

import { createClient } from '@supabase/supabase-js';
import { SUBSCRIPTION_TIERS } from '../config/subscription-tiers.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ SUPABASE CREDENTIALS REQUIRED! Check backend/.env for SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// RESUME GENERATOR ROUTES
// ============================================================================

/**
 * POST /api/resumes/generate
 * Generate resume with AI
 */
router.post('/resumes/generate', authenticate, async (req, res) => {
  try {
    const {
      job_title,
      experience_level,
      industry,
      skills,
      achievements,
      style = 'professional',
      job_description = null,
      include_ats = true,
      ab_test = false,
      ai_provider = null, // Allow provider override
    } = req.body;

    // Validation
    if (!job_title || !experience_level || !industry || !skills || !achievements) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['job_title', 'experience_level', 'industry', 'skills', 'achievements'],
      });
    }

    // Check subscription limits (admins have unlimited) - skip if no user
    if (req.user && req.supabase) {
      const userId = req.user.id;
      const { data: user } = await req.supabase
        .from('users')
        .select('subscription_tier, role')
        .eq('id', userId)
        .single();

      const isAdmin = user?.role === 'admin';
      const tier = user?.subscription_tier || 'free';

      if (!isAdmin) {
        // Get current resume count
        const { count: resumeCount } = await req.supabase
          .from('resumes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const tierLimit = SUBSCRIPTION_TIERS[tier]?.limits?.resume_generations || 0;

        if (resumeCount >= tierLimit) {
          return res.status(403).json({
            error: `${tier} plan limit reached`,
            limit: tierLimit,
            used: resumeCount,
            upgrade_url: '/pricing',
          });
        }


        // Get tier limits
        const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;
        const maxResumes = tierConfig.features.maxResumes;

        if (maxResumes !== -1 && (resumeCount || 0) >= maxResumes) {
          return res.status(429).json({
            error: 'Resume limit exceeded',
            message: `You have reached your resume limit (${maxResumes} resume${maxResumes > 1 ? 's' : ''} on ${tierConfig.name} plan).`,
            currentCount: resumeCount || 0,
            limit: maxResumes,
            tier: tier,
            upgradeUrl: '/billing/upgrade',
          });
        }
      }
    }

    const userInput = {
      job_title,
      experience_level,
      industry,
      skills: Array.isArray(skills) ? skills : [skills],
      achievements: Array.isArray(achievements) ? achievements : [achievements],
    };

    let result;

    if (ab_test) {
      // Generate A/B test variants
      result = await resumeGenerator.generateABTestVariants(userInput, 2);
    } else {
      // Generate single resume
      result = await resumeGenerator.generateResume(userInput, {
        style,
        jobDescription: job_description,
        includeATS: include_ats,
        aiProvider: ai_provider || null,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Resume generation error:', error);

    // Provide helpful error messages
    let errorMessage = error.message;
    let statusCode = 500;

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      errorMessage = 'OpenAI API quota exceeded. Please check your API key and billing, or the system will automatically use a free alternative.';
      statusCode = 429;
    } else if (error.message?.includes('model_not_found') || error.message?.includes('404')) {
      errorMessage = 'AI model not available. The system will try alternative providers.';
      statusCode = 404;
    }

    res.status(statusCode).json({
      error: 'Failed to generate resume',
      message: errorMessage,
      suggestion: 'Please check your OpenAI API key and quota, or configure an alternative AI provider (Hugging Face, Anthropic, etc.)',
    });
  }
});

/**
 * GET /api/resumes/styles
 * Get available writing styles
 */
router.get('/resumes/styles', (req, res) => {
  res.json({
    success: true,
    styles: resumeGenerator.WRITING_STYLES,
  });
});

// ============================================================================
// JOB MATCHING ROUTES
// ============================================================================

/**
 * POST /api/jobs/match
 * Calculate job match score
 */
router.post('/jobs/match', authenticate, async (req, res) => {
  try {
    const { resume_id, job_id, ai_provider = null } = req.body;

    if (!resume_id || !job_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['resume_id', 'job_id'],
      });
    }

    const matchResult = await jobMatching.calculateJobMatch(resume_id, job_id, ai_provider);

    res.json({
      success: true,
      data: matchResult,
    });
  } catch (error) {
    logger.error('Job matching error:', error);

    // Provide helpful error messages
    let errorMessage = error.message;
    let statusCode = 500;

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      errorMessage = 'OpenAI API quota exceeded. Job matching will use keyword-based fallback.';
      statusCode = 429;
    } else if (error.message?.includes('model_not_found') || error.message?.includes('404')) {
      errorMessage = 'AI model not available. Using keyword-based matching instead.';
      statusCode = 404;
    }

    res.status(statusCode).json({
      error: 'Failed to calculate job match',
      message: errorMessage,
      suggestion: 'The system will use keyword-based matching as a fallback. For better results, check your OpenAI API key and quota.',
    });
  }
});

// ============================================================================
// INTERVIEW PREP ROUTES
// ============================================================================

/**
 * POST /api/interview/questions/generate
 * Generate interview questions
 */
router.post('/interview/questions/generate', authenticate, async (req, res) => {
  try {
    const {
      job_description,
      count = 10,
      difficulty = 'medium',
      question_types = ['behavioral', 'technical', 'situational'],
    } = req.body;

    if (!job_description) {
      return res.status(400).json({
        error: 'Missing required field: job_description',
      });
    }

    const questions = await interviewPrep.generateInterviewQuestions(job_description, {
      count,
      difficulty,
      questionTypes: question_types,
    });

    res.json({
      success: true,
      data: {
        questions,
        count: questions.length,
        difficulty,
      }
    });
  } catch (error) {
    logger.error('Question generation error:', error);
    console.error('Full AI Error Details:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/interview/questions/company/:companyName
 * Get company-specific questions
 */
router.get('/interview/questions/company/:companyName', authenticate, async (req, res) => {
  try {
    const { companyName } = req.params;
    const questions = await interviewPrep.getCompanyQuestions(companyName);

    res.json({
      success: true,
      data: {
        company: companyName,
        questions,
        count: questions.length,
      },
    });
  } catch (error) {
    logger.error('Company questions error:', error);
    res.status(500).json({
      error: 'Failed to fetch company questions',
      message: error.message,
    });
  }
});

/**
 * POST /api/interview/analyze
 * Analyze interview answer
 */
router.post('/interview/analyze', authenticate, async (req, res) => {
  try {
    const { question, answer, job_description } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        error: 'Missing required fields: question, answer',
      });
    }

    const [analysis, sentiment] = await Promise.all([
      interviewPrep.analyzeAnswer(question, answer, job_description || ''),
      interviewPrep.analyzeSentiment(answer),
    ]);

    res.json({
      success: true,
      data: {
        analysis,
        sentiment,
      },
    });
  } catch (error) {
    logger.error('Answer analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze answer',
      message: error.message,
    });
  }
});

/**
 * POST /api/interview/mock/create
 * Create mock interview session
 */
router.post('/interview/mock/create', authenticate, async (req, res) => {
  try {
    const {
      job_id,
      difficulty = 'medium',
      question_count = 5,
      include_follow_ups = true,
    } = req.body;

    if (!job_id) {
      return res.status(400).json({
        error: 'Missing required field: job_id',
      });
    }

    const session = await interviewPrep.createMockInterview(job_id, {
      difficulty,
      questionCount: question_count,
      includeFollowUps: include_follow_ups,
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    logger.error('Mock interview creation error:', error);
    res.status(500).json({
      error: 'Failed to create mock interview',
      message: error.message,
    });
  }
});

/**
 * POST /api/interview/performance/track
 * Track interview performance
 */
router.post('/interview/performance/track', authenticate, async (req, res) => {
  try {
    const { session_data } = req.body;
    const userId = req.user.id;

    if (!session_data) {
      return res.status(400).json({
        error: 'Missing required field: session_data',
      });
    }

    const performance = await interviewPrep.trackPerformance(userId, session_data);

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    logger.error('Performance tracking error:', error);
    res.status(500).json({
      error: 'Failed to track performance',
      message: error.message,
    });
  }
});

// ============================================================================
// SALARY INTELLIGENCE ROUTES
// ============================================================================

/**
 * POST /api/salary/predict
 * Predict salary range
 */
router.post('/salary/predict', authenticate, async (req, res) => {
  try {
    const {
      job_title,
      location,
      experience,
      industry,
      skills = [],
    } = req.body;

    if (!job_title || !location || experience === undefined || !industry) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['job_title', 'location', 'experience', 'industry'],
      });
    }

    const prediction = await salaryIntelligence.predictSalary(
      job_title,
      location,
      experience,
      industry,
      skills
    );

    res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    logger.error('Salary prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict salary',
      message: error.message,
    });
  }
});

/**
 * POST /api/salary/report
 * Generate market report
 */
router.post('/salary/report', authenticate, async (req, res) => {
  try {
    const { job_title, location, industry } = req.body;

    if (!job_title || !location || !industry) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['job_title', 'location', 'industry'],
      });
    }

    const report = await salaryIntelligence.generateMarketReport(job_title, location, industry);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error('Market report error:', error);
    res.status(500).json({
      error: 'Failed to generate market report',
      message: error.message,
    });
  }
});

// ============================================================================
// CAREER ADVISOR ROUTES
// ============================================================================

/**
 * GET /api/career/analyze
 * Analyze career profile
 */
router.get('/career/analyze', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const analysis = await careerAdvisor.analyzeCareerProfile(userId);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    logger.error('Career analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze career profile',
      message: error.message,
    });
  }
});

/**
 * POST /api/career/chat
 * Chat with AI career advisor
 */
router.post('/career/chat', authenticate, async (req, res) => {
  try {
    const { message, conversation_history = [] } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get comprehensive user profile for context
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: resume } = await supabase
      .from('resumes')
      .select('content_json, title')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    // Get user's applications for context
    const { data: applications } = await supabase
      .from('applications')
      .select('job_id, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Extract detailed resume information
    const resumeContent = resume?.content_json || {};
    const userSkills = resumeContent.sections?.find(s => s.type === 'skills')?.content ||
      resumeContent.skills?.technical?.join(', ') ||
      resumeContent.skills?.join(', ') || '';
    const userExperience = resumeContent.sections?.find(s => s.type === 'experience')?.content ||
      JSON.stringify(resumeContent.experience || []) || '';
    const userEducation = resumeContent.sections?.find(s => s.type === 'education')?.content ||
      JSON.stringify(resumeContent.education || []) || '';
    const userSummary = resumeContent.sections?.find(s => s.type === 'summary')?.content ||
      resumeContent.summary || '';
    const userJobTitle = resumeContent.job_title ||
      resumeContent.sections?.find(s => s.type === 'summary')?.content?.split(' ')[0] ||
      'Professional';

    // Check if user is asking about jobs
    const messageLower = message.toLowerCase();
    const isJobSearch = messageLower.includes('find') ||
      messageLower.includes('search') ||
      messageLower.includes('job') ||
      messageLower.includes('position') ||
      messageLower.includes('opportunity') ||
      messageLower.includes('remote') ||
      messageLower.includes('developer') ||
      messageLower.includes('engineer') ||
      messageLower.includes('show me');

    let jobs = [];
    let similarJobs = [];
    let jobSearchPerformed = false;

    if (isJobSearch) {
      // Extract job search terms from message
      const searchTerms = message
        .toLowerCase()
        .replace(/find|search|show me|jobs?|positions?|opportunities?/gi, '')
        .trim();

      // Search for exact matches
      let jobQuery = supabase
        .from('jobs')
        .select('*')
        .or('status.eq.active,status.eq.published,status.is.null')
        .order('created_at', { ascending: false })
        .limit(20);

      if (searchTerms) {
        jobQuery = jobQuery.or(`title.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%,company.ilike.%${searchTerms}%`);
      }

      const { data: foundJobs } = await jobQuery;
      jobs = foundJobs || [];
      jobSearchPerformed = true;

      // If no exact matches, find similar jobs based on user's skills and experience
      if (jobs.length === 0 && userSkills) {
        const skillKeywords = userSkills.split(',').map(s => s.trim()).filter(s => s.length > 2);
        if (skillKeywords.length > 0) {
          const similarQuery = supabase
            .from('jobs')
            .select('*')
            .or('status.eq.active,status.eq.published,status.is.null')
            .order('created_at', { ascending: false })
            .limit(10);

          // Search by skills
          const skillSearch = skillKeywords.slice(0, 3).map(skill =>
            `description.ilike.%${skill}%,title.ilike.%${skill}%`
          ).join(',');

          if (skillSearch) {
            const { data: similar } = await similarQuery.or(skillSearch);
            similarJobs = similar || [];
          }
        }
      }
    }

    // Build comprehensive user context
    const userContext = `
USER PROFILE:
- Name: ${user?.name || 'User'}
- Email: ${user?.email || ''}
- Location: ${user?.location || 'Not specified'}
- Current Role / Title: ${userJobTitle}
- Skills: ${userSkills || 'Not specified'}
- Experience: ${userExperience ? (typeof userExperience === 'string' ? userExperience.substring(0, 500) : JSON.stringify(userExperience).substring(0, 500)) : 'Not specified'}
- Education: ${userEducation ? (typeof userEducation === 'string' ? userEducation.substring(0, 300) : JSON.stringify(userEducation).substring(0, 300)) : 'Not specified'}
- Summary: ${userSummary ? userSummary.substring(0, 300) : 'Not specified'}
- Recent Applications: ${applications?.length || 0} applications
${applications?.length > 0 ? `- Last applied: ${applications[0].status}` : ''}
`;

    const systemPrompt = `You are Workflow Intelligence, the elite AI core for the Workflow platform. You are professional, analytical, and highly personalized. Your purpose is to provide top-tier career strategy and marketplace intelligence.
 
 ABOUT WORKFLOW PLATFORM:
 - Workflow is an advanced AI job marketplace and professional ecosystem.
 - Features include: AI Job Matching, Resume Roasting, Career Roadmapping, and Autopilot (Automated Applications).
- The platform uses Navy/Blue aesthetics (#0A1628, #0046FF).

YOUR ROLE:
- You are an Elite Career Strategist. You do not just answer; you optimize.
- Never mention external competitors like LinkedIn or Indeed unless asked for comparisons.
- Your goal is to guide users to Workflow's premium tools: [Resume Builder](/dashboard/resume-builder), [Talent Marketplace](/talent/marketplace), and [Autopilot](/dashboard/autopilot).

CAPABILITIES:
- Access to real-time job data on Workflow.
- Profile analysis and skill optimization.
- Salary benchmarking and market demand analysis.

CRITICAL RULES:
1. Branding: You are "Intelligence", part of the "Workflow" ecosystem. NEVER use "WorkGPT" or "ChatGPT" names.
2. Direct Links: Always provide specific links to Workflow features in markdown [Link Name](/path).
3. Precision: Use proper markdown, tables, and structured insights.
 
  ${userContext}
 
Provide strategic, elite-level career advice. Be concise, actionable, and authoritative.`;

    const conversationContext = conversation_history
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Build prompt with job search results if applicable
    let prompt = '';
    if (isJobSearch && jobSearchPerformed) {
      if (jobs.length > 0) {
        const jobsList = jobs.slice(0, 5).map((job, idx) =>
          `${idx + 1}. ${job.title} at ${job.company || 'Company'} - ${job.location || 'Location not specified'}${job.salary_min ? ` ($${job.salary_min}${job.salary_max ? `-$${job.salary_max}` : '+'})` : ''}`
        ).join('\n');

        prompt = `${conversationContext ? conversationContext + '\n\n' : ''}User: ${message}

I found ${jobs.length} job${jobs.length > 1 ? 's' : ''} matching your search on Workflow:

${jobsList}

${jobs.length > 5 ? `\n(Showing top 5 results. There are ${jobs.length - 5} more jobs available on Workflow.)` : ''}

Please provide a warm, personalized response that:
1. Acknowledges the search results
2. Highlights why these jobs might be a good fit based on the user's profile (${userSkills ? `skills: ${userSkills.substring(0, 200)}` : 'their experience'})
3. Encourages them to explore these opportunities
4. Mentions they can view more jobs at /job-search-browse or get AI-powered recommendations at /ai-powered-job-matching-recommendations
5. Be conversational and human-like

Assistant: `;
      } else if (similarJobs.length > 0) {
        const similarList = similarJobs.slice(0, 5).map((job, idx) =>
          `${idx + 1}. ${job.title} at ${job.company || 'Company'} - ${job.location || 'Location not specified'}${job.salary_min ? ` ($${job.salary_min}${job.salary_max ? `-$${job.salary_max}` : '+'})` : ''}`
        ).join('\n');

        prompt = `${conversationContext ? conversationContext + '\n\n' : ''}User: ${message}

I searched the Workflow job database, but couldn't find exact matches for "${message}". However, I found some similar opportunities that might interest you based on your profile:

${similarList}

Please provide a warm, empathetic response that:
1. Acknowledges that exact matches weren't found
2. Explains why these similar jobs might be a good fit based on the user's skills and experience (${userSkills ? `skills: ${userSkills.substring(0, 200)}` : 'their background'})
3. Suggests they can:
- Browse all jobs at /job-search-browse
  - Get AI-powered personalized recommendations at /ai-powered-job-matching-recommendations
    - Refine their search with different keywords
4. Be supportive and encouraging
5. Be conversational and human-like

Assistant: `;
      } else {
        prompt = `${conversationContext ? conversationContext + '\n\n' : ''}User: ${message}

I searched the Workflow job database, but couldn't find any jobs matching "${message}".

Please provide a warm, helpful response that:
1. Acknowledges that no matches were found
2. Suggests alternative actions within Workflow:
- Browse all available jobs at /job-search-browse
  - Get AI-powered personalized recommendations at /ai-powered-job-matching-recommendations
    - Try different search keywords
      - Update their profile / resume to match more opportunities
3. Be supportive and encouraging
4. Be conversational and human-like
5. NEVER mention external platforms

Assistant: `;
      }
    } else {
      prompt = conversationContext
        ? `${conversationContext}\n\nUser: ${message}\n\nAssistant: `
        : `User: ${message}\n\nAssistant: `;
    }

    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: systemPrompt,
      max_tokens: 800,
      temperature: 0.8, // Slightly higher for more natural, human-like responses
    });

    const aiResponseContent = response.trim();

    // PERSISTENCE: Save to conversations table
    try {
      const { data: existingChat } = await supabase
        .from('conversations')
        .select('messages')
        .eq('user_id', userId)
        .single();

      const newMessages = [
        ...(existingChat?.messages || []),
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: aiResponseContent, timestamp: new Date().toISOString() }
      ].slice(-50); // Keep last 50 messages

      await supabase
        .from('conversations')
        .upsert({
          user_id: userId,
          messages: newMessages,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } catch (saveError) {
      logger.error('Failed to save AI conversation history:', saveError);
    }

    res.json({
      success: true,
      data: {
        response: aiResponseContent,
        timestamp: new Date().toISOString(),
        jobs: jobs.slice(0, 5), // Include jobs in response for frontend display
        similarJobs: similarJobs.slice(0, 5), // Include similar jobs if no exact matches
        hasExactMatches: jobs.length > 0,
        jobSearchPerformed,
      },
    });
  } catch (error) {
    logger.error('Career chat error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      message: error.message,
    });
  }
});

/**
 * GET /api/career/market-insights
 * Get AI-generated market insights
 */
router.get('/career/market-insights', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: resume } = await supabase
      .from('resumes')
      .select('content_json')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    const resumeContent = resume?.content_json || {};
    const jobTitle = resumeContent.sections?.find(s => s.type === 'summary')?.content || '';
    const skills = resumeContent.sections?.find(s => s.type === 'skills')?.content || '';

    const prompt = `Analyze the job market for this profile:
Job Title / Interest: ${jobTitle}
Skills: ${skills}

Provide market insights in JSON format:
{
  "salary_benchmark": { "value": "$X", "range": "$X-$Y", "trend": "+X% vs last year" },
  "job_demand": { "level": "High/Medium/Low", "description": "...", "open_positions": X },
  "career_growth": { "timeline": "X-Y years", "next_level": "...", "path": "..." },
  "market_competition": { "level": "High/Medium/Low", "description": "...", "applications_per_job": X },
  "top_companies": [{ "name": "...", "count": X }, ...],
    "recommendation": "..."
} `;

    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: 'You are a market intelligence expert. Provide accurate, data-driven market insights.',
      max_tokens: 800,
      temperature: 0.3,
    });

    // Parse JSON from response
    let insights;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (e) {
      logger.warn('Failed to parse market insights JSON:', e);
      // Fallback structure
      insights = {
        salary_benchmark: { value: "$80k", range: "$70k-$100k", trend: "+5% vs last year" },
        job_demand: { level: "Medium", description: "Steady demand for this role.", open_positions: 150 },
        career_growth: { timeline: "2-3 years", next_level: "Senior", path: "Management or specialized IC" },
        market_competition: { level: "Medium", description: "Moderate competition.", applications_per_job: 45 },
        top_companies: [{ name: "Tech Corp", count: 12 }, { name: "Startup Inc", count: 8 }],
        recommendation: "Focus on highlighting your unique skills to stand out."
      };
    }

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    logger.error('Market insights error:', error);
    res.status(500).json({
      error: 'Failed to get market insights',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/completion
 * Generic AI completion endpoint for various features
 */
router.post('/completion', authenticate, async (req, res) => {
  try {
    const { prompt, system_message, max_tokens = 1000, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: system_message,
      max_tokens,
      temperature,
    });

    res.json({
      success: true,
      data: {
        text: response,
        content: response // Support both formats
      }
    });
  } catch (error) {
    logger.error('AI completion error:', error);
    res.status(500).json({
      error: 'Failed to generate completion',
      message: error.message
    });
  }
});

// ============================================================================
// AI SEARCH & ENHANCEMENT ROUTES
// ============================================================================

/**
 * POST /api/ai/enhance-search
 * Enhance a search query using AI
 */
router.post('/enhance-search', optionalAuth, async (req, res) => {
  try {
    const { query, context = 'job_search' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const prompt = `As a career expert, enhance this search query for a job board to find more relevant results.
    Original Query: "${query}"
    Context: ${context}
    
    Provide an improved, expanded version of this query that includes relevant synonyms, related skills, or common job titles. 
    Respond ONLY with the enhanced search string.`;

    const enhancedQuery = await aiProviderService.generateCompletion(prompt, {
      max_tokens: 50,
      temperature: 0.3,
    });

    res.json({
      success: true,
      enhancedQuery: enhancedQuery.trim().replace(/^"|"$/g, ''),
    });
  } catch (error) {
    logger.error('Search enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance search' });
  }
});

/**
 * POST /api/ai/search-suggestions
 * Generate search suggestions as the user types
 */
router.post('/search-suggestions', optionalAuth, async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query || query.length < 2) {
      return res.json({ success: true, suggestions: [] });
    }

    const prompt = `Based on the partial search query "${query}", provide ${limit} relevant job titles or skills as search suggestions.
    Return as a simple JSON array of strings.`;

    const response = await aiProviderService.generateCompletion(prompt, {
      max_tokens: 100,
      temperature: 0.2,
    });

    let suggestions = [];
    try {
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      logger.warn('Failed to parse suggestions JSON');
      suggestions = response.split('\n').map(s => s.trim().replace(/^\d+\.\s*/, '')).filter(s => s);
    }

    res.json({
      success: true,
      suggestions: suggestions.slice(0, limit),
    });
  } catch (error) {
    logger.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

/**
 * GET /api/ai/chat/history
 * Get user's AI chat history
 */
router.get('/chat/history', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

/**
 * POST /api/ai/chat/history
 * Save AI chat history
 */
router.post('/chat/history', authenticate, async (req, res) => {
  try {
    const { message, response, context } = req.body;

    if (!message || !response) {
      return res.status(400).json({ error: 'Message and response are required' });
    }

    const { data, error } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: req.user.id,
        message,
        response,
        context,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error saving chat history:', error);
    res.status(500).json({ error: 'Failed to save chat history' });
  }
});

/**
 * POST /api/ai/search/all
 * Centralized AI-powered search across all sources
 */
router.post('/search/all', optionalAuth, async (req, res) => {
  try {
    const { query, filters = {} } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    logger.info(`AI Search: ${query}`);

    // 1. Prepare search terms (handle OR/AND or just split)
    let searchTerms = query.split(/ OR | AND | \| |,/i).map(t => t.trim().replace(/"/g, '')).filter(t => t.length > 2);
    if (searchTerms.length === 0) searchTerms = [query];

    // 2. Search DB (jobs table)
    // We search for matches in title, company, or description for ANY of the terms
    let dbQuery = supabase.from('jobs').select('*');

    // Construct progressive search
    const orConditions = searchTerms.map(term =>
      `title.ilike.%${term}%,company.ilike.%${term}%,description.ilike.%${term}%`
    ).join(',');

    const { data: dbJobs, error: dbError } = await dbQuery
      .or(orConditions)
      .limit(30);

    if (dbError) logger.error('DB Search error:', dbError);

    let allResults = dbJobs || [];

    // 3. Fallback to Crawler if results are low
    if (allResults.length < 5) {
      logger.info('Low DB results, triggering real-time JSearch crawl...');
      try {
        const crawlResult = await jobCrawlerService.crawlJobs({
          keywords: query.length > 100 ? query.substring(0, 100) : query, // Don't send huge boolean strings to API
          limit: 20,
          sources: ['jsearch']
        });

        // Fetch the newly inserted jobs if any
        if (crawlResult.inserted > 0) {
          const { data: newJobs } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(crawlResult.inserted);

          if (newJobs) allResults = [...allResults, ...newJobs];
        }
      } catch (crawlError) {
        logger.warn('Search fallback crawl failed:', crawlError.message);
      }
    }

    // 4. Get AI interpretation/explanation
    const prompt = `A user is searching for "${query}" on a job board. 
    I found ${allResults.length} jobs.
    
    Provide a brief, encouraging response (max 3 sentences) explaining what was found.
    If no jobs were found, give a constructive advice on how to split the query.`;

    const explanation = await aiProviderService.generateCompletion(prompt, {
      max_tokens: 200,
      temperature: 0.7,
    });

    res.json({
      success: true,
      data: {
        jobs: allResults,
        explanation: explanation.trim(),
        query: query
      }
    });
  } catch (error) {
    logger.error('Comprehensive search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});


// ============================================================================
// GENERIC AI ROUTES
// ============================================================================

/**
 * POST /api/ai/validate
 * Validate user input using AI
 */
router.post('/validate', authenticate, async (req, res) => {
  try {
    const { type, content, context } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['type', 'content']
      });
    }

    const result = await aiValidator.validateInput(type, content, context);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Input validation error:', error);
    res.status(500).json({
      error: 'Failed to validate input',
      message: error.message,
    });
  }
});

// ============================================================================
// TALENT MARKETPLACE AI ROUTES
// ============================================================================

/**
 * POST /api/ai/talent/gig-doctor
 * Optimize gig title and description
 */
router.post('/talent/gig-doctor', authenticate, async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const result = await talentAI.optimizeGig(title, description, category, tags);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Gig Doctor Error:', error);
    res.status(500).json({ error: 'Optimization failed', message: error.message });
  }
});

/**
 * POST /api/ai/talent/rate-intel
 * Analyze pricing strategy
 */
router.post('/talent/rate-intel', authenticate, async (req, res) => {
  try {
    const { title, skills, experience_level, current_rate, category } = req.body;
    const result = await talentAI.analyzeRates(title, skills, experience_level, current_rate, category);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Rate Intel Error:', error);
    res.status(500).json({ error: 'Rate analysis failed', message: error.message });
  }
});

/**
 * POST /api/ai/talent/proposal
 * Generate custom proposal
 */
router.post('/talent/proposal', authenticate, async (req, res) => {
  try {
    const { job_details, freelancer_profile, tone } = req.body;
    const result = await talentAI.generateProposal(job_details, freelancer_profile, tone);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Proposal Gen Error:', error);
    res.status(500).json({ error: 'Proposal generation failed', message: error.message });
  }
});

/**
 * POST /api/ai/talent/vibe-check
 * Analyze client communication
 */
router.post('/talent/vibe-check', authenticate, async (req, res) => {
  try {
    const { messages, client_data } = req.body;
    const result = await talentAI.analyzeClientVibe(messages, client_data);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Vibe Check Error:', error);
    res.status(500).json({ error: 'Vibe check failed', message: error.message });
  }
});

/**
 * POST /api/ai/talent/skill-verify
 * Technical Interview Chat
 */
router.post('/talent/skill-verify', authenticate, async (req, res) => {
  try {
    const { skill, chat_history } = req.body;
    const result = await talentAI.verifySkill(skill, chat_history);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Skill Verify Error:', error);
    res.status(500).json({ error: 'Verification failed', message: error.message });
  }
});

/**
 * POST /api/ai/talent/upsell
 * Suggest upsell opportunities
 */
router.post('/talent/upsell', authenticate, async (req, res) => {
  try {
    const { chat_context, available_services } = req.body;
    const result = await talentAI.suggestUpsell(chat_context, available_services);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Upsell Error:', error);
    res.status(500).json({ error: 'Upsell suggestion failed', message: error.message });
  }
});

/**
 * POST /api/ai/talent/forecast
 * Forecast earnings
 */
router.post('/talent/forecast', authenticate, async (req, res) => {
  try {
    const { earnings_history, active_gigs_value, pipeline_count } = req.body;
    const result = await talentAI.forecastEarnings(earnings_history, active_gigs_value, pipeline_count);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Forecast Error:', error);
    res.status(500).json({ error: 'Forecasting failed', message: error.message });
  }
});

export default router;