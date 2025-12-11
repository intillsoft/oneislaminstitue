/**
 * AI Job Matching Service
 * Uses NLP and embeddings to match resumes with jobs
 */

import { generateEmbedding, cosineSimilarity } from './openaiService.js';
import * as aiProviderService from './aiProviderService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Calculate job match score
 */
export async function calculateJobMatch(resumeId, jobId) {
  try {
    // Fetch resume and job data
    const { data: resume } = await supabase
      .from('resumes')
      .select('content_json, user_id')
      .eq('id', resumeId)
      .single();

    const { data: job } = await supabase
      .from('jobs')
      .select('title, description, company, location, salary')
      .eq('id', jobId)
      .single();

    if (!resume || !job) {
      throw new Error('Resume or job not found');
    }

    // Extract text for embedding
    const resumeText = extractResumeText(resume.content_json);
    const jobText = `${job.title} ${job.description || ''}`;

    // Generate embeddings
    const [resumeEmbedding, jobEmbedding] = await Promise.all([
      getOrCreateEmbedding('resume', resumeId, resumeText),
      getOrCreateEmbedding('job', jobId, jobText),
    ]);

    // Calculate semantic similarity
    const semanticScore = cosineSimilarity(resumeEmbedding, jobEmbedding);
    const semanticMatch = Math.round(semanticScore * 100);

    // Analyze skills match
    const skillsAnalysis = await analyzeSkills(resume.content_json, job);

    // Analyze experience level match
    const experienceMatch = analyzeExperienceLevel(resume.content_json, job);

    // Analyze location compatibility
    const locationMatch = analyzeLocation(resume.content_json, job);

    // Calculate overall score (weighted)
    const overallScore = calculateOverallScore({
      semantic: semanticMatch,
      skills: skillsAnalysis.match_percentage,
      experience: experienceMatch,
      location: locationMatch,
    });

    // Identify missing skills
    const missingSkills = identifyMissingSkills(resume.content_json, job);

    // Generate recommendations
    const recommendations = await generateRecommendations(
      resume.content_json,
      job,
      missingSkills,
      overallScore,
      aiProvider // Pass AI provider preference
    );

    // Identify strengths
    const strengths = identifyStrengths(resume.content_json, job, skillsAnalysis);

    return {
      match_score: overallScore,
      breakdown: {
        semantic_similarity: semanticMatch,
        skills_match: skillsAnalysis.match_percentage,
        experience_match: experienceMatch,
        location_match: locationMatch,
      },
      missing_skills: missingSkills,
      strengths,
      recommendations,
      analysis: {
        resume_id: resumeId,
        job_id: jobId,
        analyzed_at: new Date().toISOString(),
      },
    };
  } catch (error) {
    logger.error('Job matching error:', error);
    throw error;
  }
}

/**
 * Extract text from resume JSON
 */
function extractResumeText(resumeJson) {
  const sections = [];
  
  if (resumeJson.summary) sections.push(resumeJson.summary);
  if (resumeJson.experience) {
    resumeJson.experience.forEach(exp => {
      sections.push(`${exp.title} at ${exp.company}`);
      if (exp.bullets) sections.push(exp.bullets.join(' '));
    });
  }
  if (resumeJson.skills) {
    const allSkills = [
      ...(resumeJson.skills.technical || []),
      ...(resumeJson.skills.soft || []),
    ];
    sections.push(allSkills.join(' '));
  }
  if (resumeJson.education) {
    resumeJson.education.forEach(edu => {
      sections.push(`${edu.degree} from ${edu.institution}`);
    });
  }

  return sections.join(' ');
}

/**
 * Get or create embedding (with caching)
 */
async function getOrCreateEmbedding(type, id, text) {
  // Check cache first
  const cacheKey = `${type}_${id}`;
  const { data: cached } = await supabase
    .from('embeddings_cache')
    .select('embedding')
    .eq('cache_key', cacheKey)
    .single();

  if (cached?.embedding) {
    return cached.embedding;
  }

  // Generate new embedding
  const embedding = await generateEmbedding(text);

  // Cache it
  await supabase
    .from('embeddings_cache')
    .upsert({
      cache_key: cacheKey,
      embedding,
      text_preview: text.substring(0, 200),
      created_at: new Date().toISOString(),
    }, {
      onConflict: 'cache_key',
    });

  return embedding;
}

/**
 * Analyze skills match
 */
async function analyzeSkills(resumeJson, job) {
  const resumeSkills = [
    ...(resumeJson.skills?.technical || []),
    ...(resumeJson.skills?.soft || []),
  ].map(s => s.toLowerCase());

  // Extract skills from job description
  const jobSkills = extractSkillsFromJob(job);
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

  const matchedSkills = resumeSkills.filter(skill =>
    jobSkillsLower.some(js => js.includes(skill) || skill.includes(js))
  );

  const matchPercentage = jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;

  return {
    resume_skills: resumeSkills,
    required_skills: jobSkills,
    matched_skills: matchedSkills,
    match_percentage: matchPercentage,
  };
}

/**
 * Extract skills from job description
 */
function extractSkillsFromJob(job) {
  const text = `${job.description} ${job.requirements || ''}`.toLowerCase();
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws',
    'communication', 'leadership', 'problem solving', 'teamwork',
    'project management', 'agile', 'scrum', 'git', 'docker', 'kubernetes',
  ];

  return commonSkills.filter(skill => text.includes(skill));
}

/**
 * Analyze experience level match
 */
function analyzeExperienceLevel(resumeJson, job) {
  const jobTitle = job.title.toLowerCase();
  const resumeText = extractResumeText(resumeJson).toLowerCase();

  let experienceLevel = 'mid';
  if (jobTitle.includes('senior') || jobTitle.includes('lead') || jobTitle.includes('principal')) {
    experienceLevel = 'senior';
  } else if (jobTitle.includes('junior') || jobTitle.includes('entry') || jobTitle.includes('intern')) {
    experienceLevel = 'junior';
  }

  // Check if resume indicates appropriate experience
  const hasSeniorIndicators = resumeText.includes('lead') || resumeText.includes('managed') || 
                              resumeText.includes('directed') || resumeText.includes('architected');
  const hasJuniorIndicators = resumeText.includes('intern') || resumeText.includes('entry') ||
                              resumeText.includes('assisted') || resumeText.includes('learned');

  if (experienceLevel === 'senior' && hasSeniorIndicators) return 100;
  if (experienceLevel === 'junior' && hasJuniorIndicators) return 100;
  if (experienceLevel === 'mid' && !hasSeniorIndicators && !hasJuniorIndicators) return 100;

  return 70; // Partial match
}

/**
 * Analyze location compatibility
 */
function analyzeLocation(resumeJson, job) {
  // If job is remote, always 100%
  if (job.location?.toLowerCase().includes('remote')) {
    return 100;
  }

  // If resume doesn't specify location, assume flexible
  if (!resumeJson.location) {
    return 80;
  }

  // Simple location matching (can be enhanced with geocoding)
  const resumeLocation = resumeJson.location.toLowerCase();
  const jobLocation = job.location?.toLowerCase() || '';

  if (resumeLocation === jobLocation) return 100;
  if (resumeLocation.includes('flexible') || resumeLocation.includes('relocate')) return 90;

  return 50; // Different locations
}

/**
 * Calculate overall weighted score
 */
function calculateOverallScore(scores) {
  const weights = {
    semantic: 0.4,
    skills: 0.3,
    experience: 0.2,
    location: 0.1,
  };

  const weightedSum = 
    scores.semantic * weights.semantic +
    scores.skills * weights.skills +
    scores.experience * weights.experience +
    scores.location * weights.location;

  return Math.round(weightedSum);
}

/**
 * Identify missing skills
 */
function identifyMissingSkills(resumeJson, job) {
  const resumeSkills = [
    ...(resumeJson.skills?.technical || []),
    ...(resumeJson.skills?.soft || []),
  ].map(s => s.toLowerCase());

  const requiredSkills = extractSkillsFromJob(job);
  const missing = requiredSkills.filter(skill =>
    !resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
  );

  return missing.map(skill => ({
    skill,
    importance: 'high', // Can be enhanced with ML
    suggestion: `Consider adding ${skill} to your skills section or gaining experience with it.`,
  }));
}

/**
 * Identify strengths
 */
function identifyStrengths(resumeJson, job, skillsAnalysis) {
  const strengths = [];

  if (skillsAnalysis.match_percentage >= 80) {
    strengths.push('Strong skills alignment with job requirements');
  }

  if (resumeJson.experience?.length >= 3) {
    strengths.push('Extensive relevant experience');
  }

  const resumeText = extractResumeText(resumeJson);
  if (resumeText.toLowerCase().includes('certified') || resumeText.toLowerCase().includes('certification')) {
    strengths.push('Relevant certifications');
  }

  return strengths;
}

/**
 * Generate recommendations using AI
 */
async function generateRecommendations(resumeJson, job, missingSkills, matchScore, aiProvider = null) {
  const prompt = `Based on this resume and job match analysis:

Resume Summary: ${resumeJson.summary || 'N/A'}
Job Title: ${job.title}
Job Description: ${job.description.substring(0, 500)}
Match Score: ${matchScore}%
Missing Skills: ${missingSkills.map(ms => ms.skill).join(', ')}

Provide 3-5 actionable recommendations to improve the match. Focus on:
1. Skills to develop
2. Resume improvements
3. Experience to highlight
4. Keywords to add

Return as JSON array of recommendation objects with: title, description, priority (high/medium/low)`;

  try {
    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: 'You are a career advisor helping job seekers improve their job match scores.',
      max_tokens: 500,
      aiProvider, // Pass AI provider preference
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Failed to generate AI recommendations, using defaults');
  }

  // Fallback recommendations
  return [
    {
      title: 'Develop Missing Skills',
      description: `Focus on learning: ${missingSkills.slice(0, 3).map(ms => ms.skill).join(', ')}`,
      priority: 'high',
    },
    {
      title: 'Optimize Resume Keywords',
      description: 'Add more keywords from the job description to improve ATS compatibility',
      priority: 'medium',
    },
  ];
}

export default {
  calculateJobMatch,
};

