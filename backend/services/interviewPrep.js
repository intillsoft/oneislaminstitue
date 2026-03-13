/**
 * AI Interview Prep Service
 * Provides interview questions, mock interviews, and feedback
 */

import { generateCompletion, generateEmbedding, cosineSimilarity } from './openaiService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('❌ interviewPrep: SUPABASE CREDENTIALS MISSING!');
}

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'expert'];

/**
 * Generate interview questions based on job description
 */
export async function generateInterviewQuestions(jobDescription, options = {}) {
  try {
    const {
      count = 10,
      difficulty = 'medium',
      questionTypes = ['behavioral', 'technical', 'situational'],
    } = options;

    const prompt = `Generate ${count} interview questions for this job:

Job Description:
${jobDescription}

Difficulty Level: ${difficulty}
Question Types: ${questionTypes.join(', ')}

For each question, provide:
1. The question text
2. What the interviewer is looking for
3. A sample answer framework
4. Key points to cover

Return as JSON array with: question, type, difficulty, looking_for, sample_framework, key_points (array)`;

    const response = await generateCompletion(prompt, {
      systemMessage: 'You are an expert interview coach. Generate realistic, relevant interview questions that help candidates prepare effectively.',
      max_tokens: 2000,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback
    return generateFallbackQuestions(count, difficulty);
  } catch (error) {
    logger.error('Question generation error:', error);
    throw error;
  }
}

/**
 * Get company-specific interview questions
 */
export async function getCompanyQuestions(companyName) {
  try {
    // Check database first
    const { data: cached } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('company', companyName.toLowerCase())
      .limit(20);

    if (cached && cached.length > 0) {
      return cached;
    }

    // Generate new questions
    const prompt = `Generate 15 common interview questions asked by ${companyName}. Include:
- Behavioral questions
- Technical questions (if applicable)
- Company culture questions
- Role-specific questions

Return as JSON array with: question, type, difficulty, category`;

    const response = await generateCompletion(prompt, {
      systemMessage: 'You are an expert on company interview processes. Generate authentic questions based on real interview experiences.',
      max_tokens: 1500,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      
      // Cache questions
      const questionsToInsert = questions.map(q => ({
        company: companyName.toLowerCase(),
        question: q.question,
        type: q.type,
        difficulty: q.difficulty || 'medium',
        category: q.category || 'general',
      }));

      await supabase
        .from('interview_questions')
        .insert(questionsToInsert);

      return questions;
    }

    return generateFallbackQuestions(15, 'medium');
  } catch (error) {
    logger.error('Company questions error:', error);
    throw error;
  }
}

/**
 * Analyze answer and provide feedback
 */
export async function analyzeAnswer(question, userAnswer, jobDescription) {
  try {
    const prompt = `Analyze this interview answer:

Question: ${question}
User Answer: ${userAnswer}
Job Context: ${jobDescription.substring(0, 300)}

Provide feedback on:
1. Content quality (0-100)
2. Structure and clarity (0-100)
3. Relevance to question (0-100)
4. Strengths (array)
5. Areas for improvement (array)
6. Suggested improvements (array)
7. Overall score (0-100)
8. Confidence level (low/medium/high)

Return as JSON object with all these fields.`;

    const response = await generateCompletion(prompt, {
      systemMessage: 'You are an expert interview coach providing constructive feedback. Be specific and actionable.',
      max_tokens: 800,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback analysis
    return {
      content_quality: 70,
      structure: 75,
      relevance: 80,
      strengths: ['Clear communication', 'Relevant experience'],
      improvements: ['Add more specific examples', 'Quantify achievements'],
      overall_score: 75,
      confidence: 'medium',
    };
  } catch (error) {
    logger.error('Answer analysis error:', error);
    throw error;
  }
}

/**
 * Perform sentiment analysis on answer
 */
export async function analyzeSentiment(answer) {
  try {
    const prompt = `Analyze the sentiment and tone of this interview answer:

${answer}

Provide:
1. Sentiment (positive/neutral/negative)
2. Confidence level (0-100)
3. Professionalism (0-100)
4. Enthusiasm (0-100)
5. Tone description

Return as JSON object.`;

    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a sentiment analysis expert. Analyze interview answers for tone and emotional content.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      sentiment: 'positive',
      confidence: 70,
      professionalism: 80,
      enthusiasm: 75,
      tone: 'professional and confident',
    };
  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    throw error;
  }
}

/**
 * Create mock interview session
 */
export async function createMockInterview(jobId, options = {}) {
  try {
    const {
      difficulty = 'medium',
      questionCount = 5,
      includeFollowUps = true,
    } = options;

    // Get job details
    const { data: job } = await supabase
      .from('jobs')
      .select('title, description, company, requirements')
      .eq('id', jobId)
      .single();

    if (!job) {
      throw new Error('Job not found');
    }

    const jobDescription = `${job.title} at ${job.company}. ${job.description} ${job.requirements || ''}`;

    // Generate questions with progression
    const questions = await generateProgressiveQuestions(jobDescription, questionCount, difficulty);

    return {
      session_id: `mock_${Date.now()}`,
      job_id: jobId,
      job_title: job.title,
      company: job.company,
      questions,
      difficulty,
      started_at: new Date().toISOString(),
      status: 'in_progress',
    };
  } catch (error) {
    logger.error('Mock interview creation error:', error);
    throw error;
  }
}

/**
 * Generate progressive questions (easy → hard)
 */
async function generateProgressiveQuestions(jobDescription, count, startDifficulty) {
  const difficultyIndex = DIFFICULTY_LEVELS.indexOf(startDifficulty);
  const questions = [];

  for (let i = 0; i < count; i++) {
    const currentDifficulty = DIFFICULTY_LEVELS[
      Math.min(difficultyIndex + Math.floor(i / 2), DIFFICULTY_LEVELS.length - 1)
    ];

    const prompt = `Generate 1 ${currentDifficulty} interview question for:

${jobDescription}

Return as JSON object with: question, type, difficulty, expected_answer_framework`;

    const response = await generateCompletion(prompt, {
      systemMessage: 'Generate progressively challenging interview questions.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      questions.push(JSON.parse(jsonMatch[0]));
    }
  }

  return questions;
}

/**
 * Track performance and provide improvement suggestions
 */
export async function trackPerformance(userId, sessionData) {
  try {
    // Calculate performance metrics
    const metrics = {
      total_questions: sessionData.answers?.length || 0,
      average_score: calculateAverageScore(sessionData.answers),
      confidence_trend: analyzeConfidenceTrend(sessionData.answers),
      improvement_areas: identifyImprovementAreas(sessionData.answers),
    };

    // Generate personalized suggestions
    const suggestions = await generateImprovementSuggestions(metrics, sessionData);

    // Save to database
    await supabase
      .from('interview_sessions')
      .insert({
        user_id: userId,
        session_data: sessionData,
        metrics,
        suggestions,
        completed_at: new Date().toISOString(),
      });

    return {
      metrics,
      suggestions,
      next_steps: generateNextSteps(metrics),
    };
  } catch (error) {
    logger.error('Performance tracking error:', error);
    throw error;
  }
}

/**
 * Helper functions
 */
function generateFallbackQuestions(count, difficulty) {
  const questions = [
    { question: 'Tell me about yourself.', type: 'behavioral', difficulty: 'easy' },
    { question: 'Why do you want to work here?', type: 'behavioral', difficulty: 'medium' },
    { question: 'Describe a challenging project you worked on.', type: 'behavioral', difficulty: 'medium' },
    { question: 'How do you handle tight deadlines?', type: 'situational', difficulty: 'medium' },
    { question: 'What are your strengths and weaknesses?', type: 'behavioral', difficulty: 'hard' },
  ];

  return questions.slice(0, count);
}

function calculateAverageScore(answers) {
  if (!answers || answers.length === 0) return 0;
  const scores = answers.map(a => a.score || 0);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function analyzeConfidenceTrend(answers) {
  if (!answers || answers.length < 2) return 'stable';
  const scores = answers.map(a => a.confidence || 0);
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  if (secondAvg > firstAvg + 5) return 'improving';
  if (secondAvg < firstAvg - 5) return 'declining';
  return 'stable';
}

function identifyImprovementAreas(answers) {
  if (!answers) return [];
  const areas = [];
  answers.forEach(answer => {
    if (answer.improvements) {
      areas.push(...answer.improvements);
    }
  });
  return [...new Set(areas)];
}

async function generateImprovementSuggestions(metrics, sessionData) {
  const prompt = `Based on this interview performance:

Average Score: ${metrics.average_score}%
Confidence Trend: ${metrics.confidence_trend}
Improvement Areas: ${metrics.improvement_areas.join(', ')}

Provide 5 actionable suggestions to improve interview performance.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a career coach providing interview improvement advice.',
      max_tokens: 400,
    });
    return response.split('\n').filter(line => line.trim());
  } catch (error) {
    return [
      'Practice more behavioral questions',
      'Work on structuring answers (STAR method)',
      'Improve confidence in technical answers',
    ];
  }
}

function generateNextSteps(metrics) {
  if (metrics.average_score < 70) {
    return ['Focus on fundamental questions', 'Practice daily', 'Review common interview questions'];
  } else if (metrics.average_score < 85) {
    return ['Practice advanced questions', 'Work on specific improvement areas', 'Mock interviews weekly'];
  } else {
    return ['Maintain practice schedule', 'Focus on company-specific prep', 'Prepare for final rounds'];
  }
}

export default {
  generateInterviewQuestions,
  getCompanyQuestions,
  analyzeAnswer,
  analyzeSentiment,
  createMockInterview,
  trackPerformance,
};

