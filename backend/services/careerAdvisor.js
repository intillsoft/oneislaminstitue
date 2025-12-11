/**
 * AI Career Advisor Service
 * Provides personalized career guidance and recommendations
 */

import { generateCompletion, generateEmbedding, cosineSimilarity } from './openaiService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Analyze user profile and suggest career paths
 */
export async function analyzeCareerProfile(userId) {
  try {
    // Get user data
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: resume } = await supabase
      .from('resumes')
      .select('content_json')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    const { data: applications } = await supabase
      .from('applications')
      .select('job_id, status')
      .eq('user_id', userId)
      .limit(20);

    // Analyze current state
    const analysis = await performCareerAnalysis(resume?.content_json, applications);

    // Suggest career paths
    const careerPaths = await suggestCareerPaths(analysis);

    // Identify skill gaps
    const skillGaps = await identifySkillGaps(analysis);

    // Generate learning roadmap
    const learningRoadmap = await generateLearningRoadmap(analysis, skillGaps);

    // Predict market trends
    const marketForecast = await predictMarketTrends(analysis.currentRole);

    return {
      user_id: userId,
      current_state: analysis,
      career_paths: careerPaths,
      skill_gaps: skillGaps,
      learning_roadmap: learningRoadmap,
      market_forecast: marketForecast,
      recommendations: await generatePersonalizedRecommendations(analysis, careerPaths),
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Career analysis error:', error);
    throw error;
  }
}

/**
 * Perform comprehensive career analysis
 */
async function performCareerAnalysis(resumeJson, applications) {
  if (!resumeJson) {
    return {
      currentRole: 'Unknown',
      experienceLevel: 'entry',
      skills: [],
      strengths: [],
      areasForGrowth: [],
    };
  }

  const prompt = `Analyze this career profile:

Resume Summary: ${resumeJson.summary || 'N/A'}
Experience: ${JSON.stringify(resumeJson.experience || [])}
Skills: ${JSON.stringify(resumeJson.skills || {})}
Education: ${JSON.stringify(resumeJson.education || [])}

Provide analysis:
1. Current role/level
2. Experience level (entry/mid/senior/executive)
3. Core skills
4. Strengths (top 5)
5. Areas for growth (top 5)
6. Career trajectory assessment

Return as JSON object.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are an expert career counselor. Analyze career profiles comprehensively.',
      max_tokens: 800,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Career analysis failed, using defaults');
  }

  // Fallback
  return {
    currentRole: resumeJson.experience?.[0]?.title || 'Professional',
    experienceLevel: 'mid',
    skills: [
      ...(resumeJson.skills?.technical || []),
      ...(resumeJson.skills?.soft || []),
    ],
    strengths: ['Technical skills', 'Problem solving'],
    areasForGrowth: ['Leadership', 'Communication'],
  };
}

/**
 * Suggest career progression paths
 */
async function suggestCareerPaths(analysis) {
  const prompt = `Based on this career profile, suggest 3-4 realistic career progression paths:

Current Role: ${analysis.currentRole}
Experience Level: ${analysis.experienceLevel}
Core Skills: ${analysis.skills.join(', ')}
Strengths: ${analysis.strengths.join(', ')}

For each path, provide:
1. Next role (1-2 years)
2. Mid-term goal (3-5 years)
3. Long-term goal (5-10 years)
4. Required skills/qualifications
5. Likelihood of success (high/medium/low)
6. Time to next role (months)

Return as JSON array of career path objects.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a career strategist. Suggest realistic, achievable career paths based on current profile.',
      max_tokens: 1200,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Career path suggestion failed');
  }

  // Fallback paths
  return [
    {
      name: 'Technical Leadership',
      next_role: 'Senior Developer',
      mid_term: 'Tech Lead',
      long_term: 'Engineering Manager',
      required_skills: ['Leadership', 'System Design', 'Architecture'],
      likelihood: 'high',
      timeline_months: 18,
    },
    {
      name: 'Individual Contributor',
      next_role: 'Senior Specialist',
      mid_term: 'Principal Engineer',
      long_term: 'Distinguished Engineer',
      required_skills: ['Deep Technical Expertise', 'Mentoring'],
      likelihood: 'medium',
      timeline_months: 24,
    },
  ];
}

/**
 * Identify skill gaps
 */
async function identifySkillGaps(analysis) {
  const prompt = `Identify skill gaps for career advancement:

Current Skills: ${analysis.skills.join(', ')}
Current Role: ${analysis.currentRole}
Experience Level: ${analysis.experienceLevel}
Areas for Growth: ${analysis.areasForGrowth.join(', ')}

For each gap, provide:
1. Skill name
2. Importance (critical/high/medium)
3. Current level (0-100)
4. Target level (0-100)
5. Why it matters
6. How to develop

Return as JSON array.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a skills development expert. Identify critical skill gaps for career growth.',
      max_tokens: 800,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Skill gap analysis failed');
  }

  return [
    {
      skill: 'Leadership',
      importance: 'high',
      current_level: 40,
      target_level: 80,
      why_matters: 'Required for senior roles',
      how_to_develop: 'Take on team lead responsibilities, mentor junior developers',
    },
  ];
}

/**
 * Generate personalized learning roadmap
 */
async function generateLearningRoadmap(analysis, skillGaps) {
  const roadmap = {
    short_term: [], // 0-3 months
    medium_term: [], // 3-6 months
    long_term: [], // 6-12 months
  };

  for (const gap of skillGaps.slice(0, 6)) {
    const courses = await findRelevantCourses(gap.skill);
    const certifications = await findRelevantCertifications(gap.skill);

    const learningItem = {
      skill: gap.skill,
      priority: gap.importance,
      courses: courses.slice(0, 3),
      certifications: certifications.slice(0, 2),
      practice_opportunities: await suggestPracticeOpportunities(gap.skill),
      timeline: gap.importance === 'critical' ? 'short_term' : 'medium_term',
    };

    roadmap[learningItem.timeline].push(learningItem);
  }

  return roadmap;
}

/**
 * Predict job market trends
 */
async function predictMarketTrends(currentRole) {
  const prompt = `Predict job market trends for ${currentRole} role over next 12 months:

Consider:
- Industry growth
- Technology trends
- Demand forecast
- Salary trends
- Emerging opportunities
- Potential challenges

Return as JSON with: demand_forecast (increasing/stable/decreasing), growth_rate (%), emerging_skills (array), market_opportunities (array), challenges (array)`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a labor market analyst. Predict job market trends accurately.',
      max_tokens: 500,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Market trend prediction failed');
  }

  return {
    demand_forecast: 'increasing',
    growth_rate: '5-8%',
    emerging_skills: ['AI/ML', 'Cloud Architecture', 'DevOps'],
    market_opportunities: ['Remote work', 'Contract roles', 'Startups'],
    challenges: ['Competition', 'Skill requirements'],
  };
}

/**
 * Generate personalized recommendations
 */
async function generatePersonalizedRecommendations(analysis, careerPaths) {
  const prompt = `Provide personalized career recommendations:

Current State: ${JSON.stringify(analysis, null, 2)}
Career Paths: ${JSON.stringify(careerPaths, null, 2)}

Give 5-7 actionable recommendations covering:
1. Immediate actions (this week)
2. Short-term goals (this month)
3. Skill development priorities
4. Networking opportunities
5. Career strategy

Return as JSON array with: title, description, priority, timeline, action_items (array)`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a personal career coach. Provide actionable, personalized advice.',
      max_tokens: 1000,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Recommendation generation failed');
  }

  return [
    {
      title: 'Develop Leadership Skills',
      description: 'Focus on building leadership capabilities for senior roles',
      priority: 'high',
      timeline: '3-6 months',
      action_items: ['Take on team lead role', 'Mentor junior developers', 'Complete leadership course'],
    },
  ];
}

/**
 * Helper functions
 */
async function findRelevantCourses(skill) {
  const prompt = `Suggest 3 top-rated online courses for learning "${skill}".
Return JSON array with: name, provider, duration, level.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are an education advisor. Recommend high-quality, real-world courses.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (error) {
    logger.warn(`Failed to generate course recommendations for ${skill}`);
  }

  // Fallback if AI fails
  return [
    { name: `${skill} for Beginners`, provider: 'Coursera', duration: '4 weeks' },
    { name: `Advanced ${skill} Masterclass`, provider: 'Udemy', duration: '10 hours' },
  ];
}

async function findRelevantCertifications(skill) {
  const prompt = `Suggest key professional certifications for "${skill}".
Return JSON array with: name, provider, validity.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a career certification guide.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (error) {
    logger.warn(`Failed to generate certifications for ${skill}`);
  }

  return [
    { name: `Certified ${skill} Professional`, provider: 'Industry Standard', validity: 'Lifetime' },
  ];
}

async function suggestPracticeOpportunities(skill) {
  const prompt = `Suggest 3 practical project ideas or methods to practice "${skill}".
Return JSON array of simple strings.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a technical mentor.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (error) {
    logger.warn(`Failed to generate practice ideas for ${skill}`);
  }

  return [
    `Build a small project using ${skill}`,
    `Contribute to open source repo using ${skill}`,
    `Solve coding challenges on LeetCode/HackerRank`,
  ];
}

export default {
  analyzeCareerProfile,
};

