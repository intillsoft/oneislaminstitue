/**
 * Chat API Routes - Bolt.new Style Streaming Chat
 * Handles streaming AI conversations, file uploads, and voice interactions
 */

import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import aiProviderService from '../services/aiProviderService.js';
import { searchService } from '../services/searchService.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in chat.js. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Configure Multer for memory storage (for parsing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' ||
      file.mimetype === 'text/plain' ||
      file.mimetype === 'application/json' ||
      file.mimetype === 'text/markdown' ||
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, MD, JSON, CSV, and DOCX are allowed.'), false);
    }
  }
});

/**
 * Enhanced System Prompt with Platform Awareness
 */
const SYSTEM_PROMPT = `You are Workflow AI, the intelligent assistant for the Workflow job marketplace platform. Your primary role is to help users navigate and maximize their experience on THIS PLATFORM ONLY.

**Your Capabilities on Workflow:**
- Search and recommend jobs from our database
- Analyze user profiles and resumes
- Provide career insights and salary data
- Help with applications and interviews
- Track application status
- Connect with talent and freelancers

**Response Guidelines (CRITICAL):**
1. **Accuracy is Paramout**: Only provide information you are sure about. If unsure, guide the user to the relevant search or dashboard page.
2. **Platform Focus**: You are Workflow AI. Do not recommend external sites like LinkedIn or Indeed unless specifically asked for comparisons.
3. **Links are MANDATORY**: When mentioning a feature, you **MUST** provide a clickable Markdown link.
   - Example: "You can find this in the [Talent Marketplace](/talent/marketplace)."
   - Example: "Check your [Dashboard](/job-seeker-dashboard)."
4. **Editable Content**: Remind users they can edit their inputs or your responses if needed (using the edit/copy buttons).

**Key Platform Links (Use these exact paths):**
- **Home**: [/](/)
- **Find Jobs**: [/jobs](/jobs)
- **AI Match Recommendations**: [/ai-powered-job-matching-recommendations](/ai-powered-job-matching-recommendations)
- **Resume Builder**: [/dashboard/resume-builder](/dashboard/resume-builder)
- **Talent Marketplace**: [/talent/marketplace](/talent/marketplace)
- **Job Seeker Dashboard**: [/dashboard](/dashboard) or [/job-seeker-dashboard](/job-seeker-dashboard)
- **Recruiter Dashboard**: [/recruiter/dashboard](/recruiter/dashboard)
- **Autopilot Settings**: [/dashboard/autopilot](/dashboard/autopilot)
- **Analytics**: [/dashboard/applications](/dashboard/applications)
- **Interview Prep**: [/dashboard/interview-prep](/dashboard/interview-prep)
- **Salary Insights**: [/dashboard/salary-intel](/dashboard/salary-intel)

**Tone:**
Professional, encouraging, accurate, and eager to help. Be concise but thorough.
`;

/**
 * POST /api/chat/upload
 * Handle file uploads and extract text
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let textContent = '';

    // Extract text based on mime type
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      textContent = data.text;
    } else if (req.file.mimetype === 'text/plain' || req.file.mimetype === 'text/markdown' || req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/json') {
      textContent = req.file.buffer.toString('utf-8');
    } else {
      // For other types, return a placeholder (DOCX parsing would go here)
      textContent = `[File uploaded: ${req.file.originalname} (${req.file.mimetype})]`;
    }

    // Truncate if too long (simple check)
    if (textContent.length > 10000) {
      textContent = textContent.substring(0, 10000) + '... [Content truncated]';
    }

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        content: textContent,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to process file', message: error.message });
  }
});

/**
 * POST /api/chat/stream
 * Stream AI chat responses (Bolt.new style)
 */
router.post('/stream', authenticate, async (req, res) => {
  try {
    const { message, conversation_history = [], model = null, context = null } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set up SSE (Server-Sent Events) for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx

    // Build conversation messages
    let messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversation_history.map(msg => ({
        role: msg.role || (msg.type === 'user' ? 'user' : 'assistant'),
        content: msg.content || msg.text || ''
      }))
    ];

    // Check for search intent (Naive implementation)
    // Triggers if message contains specific keywords and is long enough
    const lowerMsg = message.toLowerCase();
    const isSearchIntent = (lowerMsg.includes('search') || lowerMsg.includes('latest') || lowerMsg.includes('find') || lowerMsg.includes('google')) && lowerMsg.length > 5;

    let searchContext = '';
    if (isSearchIntent) {
      try {
        const results = await searchService.search(message);
        if (results) {
          searchContext = results;
        }
      } catch (err) {
        logger.warn('Search failed:', err.message);
      }
    }

    // Add file context or search context if provided
    let extraContext = '';
    if (context) extraContext += `User has uploaded a file. Context:\n${context}\n\n`;
    if (searchContext) extraContext += `Real-time Web Search Results:\n${searchContext}\n\n`;

    if (extraContext) {
      messages.push({
        role: 'system',
        content: extraContext
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    // Stream response using OpenAI or other providers
    const streamResponse = async () => {
      try {
        const aiClient = aiProviderService.getAIClient();

        if (aiClient.type === 'openai' && aiClient.client) {
          // OpenAI streaming
          const completion = await aiClient.client.chat.completions.create({
            model: model || 'gpt-4-turbo-preview',
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`);
            }
          }

          res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        } else {
          // Fallback: non-streaming for other providers
          const response = await aiProviderService.generateCompletion(
            messages.map(m => `${m.role}: ${m.content}`).join('\n\n'),
            {
              systemMessage: messages[0].content,
              temperature: 0.7,
              max_tokens: 2000,
            }
          );

          // Simulate streaming by sending chunks
          const words = response.split(' ');
          for (let i = 0; i < words.length; i++) {
            const content = words[i] + (i < words.length - 1 ? ' ' : '');
            res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`);

            // Small delay for streaming effect
            await new Promise(resolve => setTimeout(resolve, 20));
          }

          res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        }
      } catch (error) {
        logger.error('Streaming error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      } finally {
        res.end();
      }
    };

    streamResponse();
  } catch (error) {
    logger.error('Chat stream error:', error);
    res.status(500).json({ error: 'Failed to stream chat', message: error.message });
  }
});

/**
 * POST /api/chat
 * Non-streaming chat endpoint (fallback)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { message, conversation_history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversation_history.map(msg => ({
        role: msg.role || (msg.type === 'user' ? 'user' : 'assistant'),
        content: msg.content || msg.text || ''
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await aiProviderService.generateCompletion(
      messages.map(m => `${m.role}: ${m.content}`).join('\n\n'),
      {
        systemMessage: messages[0].content,
        temperature: 0.7,
        max_tokens: 2000,
      }
    );

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat', message: error.message });
  }
});

/**
 * GET /api/chat/history
 * Get conversation history for user
 */
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get conversation history from database
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const conversation = data[0];
      res.json({
        success: true,
        data: {
          id: conversation.id,
          messages: conversation.messages || [],
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          id: null,
          messages: [],
        },
      });
    }
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history', message: error.message });
  }
});

/**
 * POST /api/chat/history
 * Save conversation history
 */
router.post('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array' });
    }

    // Check if conversation exists
    const { data: existing } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('user_id', userId)
      .single();

    let data, error;

    if (existing) {
      // Update
      const result = await supabase
        .from('ai_conversations')
        .update({
          messages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert
      const result = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          messages,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    res.json({
      success: true,
      data: {
        id: data.id,
        messages: data.messages,
      },
    });
  } catch (error) {
    logger.error('Save history error:', error);
    res.status(500).json({ error: 'Failed to save history', message: error.message });
  }
});

export default router;


