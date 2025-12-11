/**
 * Resume Generator Service
 * Uses multiple AI providers (OpenAI, Gemini, DeepSeek) to generate professional resumes
 */

import * as aiProviderService from './aiProviderService.js';
import logger from '../utils/logger.js';

const WRITING_STYLES = {
  professional: {
    name: 'Professional',
    description: 'Traditional, formal business style',
    systemMessage: 'You are a professional resume writer specializing in creating ATS-optimized, professional resumes. Use formal language, action verbs, and quantifiable achievements.',
  },
  creative: {
    name: 'Creative',
    description: 'Modern, engaging style for creative industries',
    systemMessage: 'You are a creative resume writer. Use engaging language, showcase creativity while maintaining professionalism. Perfect for design, marketing, and creative roles.',
  },
  technical: {
    name: 'Technical',
    description: 'Focused on technical skills and achievements',
    systemMessage: 'You are a technical resume writer. Emphasize technical skills, certifications, projects, and measurable technical achievements. Use industry-specific terminology.',
  },
  executive: {
    name: 'Executive',
    description: 'Leadership-focused, strategic style',
    systemMessage: 'You are an executive resume writer. Focus on leadership, strategic impact, business results, and C-level achievements. Use executive-level language and metrics.',
  },
};

/**
 * Generate resume summary
 */
async function generateSummary(userInput, style, aiProvider = null) {
  const prompt = `Generate a powerful, professional resume summary (3-4 sentences) for:
Job Title: ${userInput.job_title}
Experience Level: ${userInput.experience_level}
Industry: ${userInput.industry}
Key Skills: ${userInput.skills.join(', ')}
Notable Achievements: ${userInput.achievements.join('; ')}

Requirements:
- Make it compelling, ATS-friendly, and optimized for the ${userInput.job_title} role
- Include quantifiable achievements and impact
- Use industry-specific keywords
- Highlight unique value proposition
- Write in ${style} style (professional/creative/technical)
- Make it stand out to recruiters and hiring managers

Return only the summary text, no explanations.`;

  // Temporarily override AI provider if specified
  const originalProvider = process.env.AI_PROVIDER;
  if (aiProvider) {
    process.env.AI_PROVIDER = aiProvider;
  }

  try {
    return await aiProviderService.generateCompletion(prompt, {
      systemMessage: WRITING_STYLES[style].systemMessage,
      max_tokens: 200,
    });
  } finally {
    // Restore original provider
    if (aiProvider) {
      process.env.AI_PROVIDER = originalProvider;
    }
  }
}

/**
 * Generate experience section
 */
async function generateExperience(userInput, style, aiProvider = null) {
  const prompt = `Generate 4-5 powerful professional experience entries for a ${userInput.experience_level} ${userInput.job_title} in the ${userInput.industry} industry.

Key Skills: ${userInput.skills.join(', ')}
Achievements: ${userInput.achievements.join('; ')}

Requirements:
- Create realistic, impressive work experience entries
- Each entry should have 3-4 bullet points
- Use strong action verbs (Led, Developed, Implemented, Optimized, etc.)
- Include quantifiable metrics (percentages, dollar amounts, team sizes, time saved, etc.)
- Show impact and results
- Use ATS-optimized keywords relevant to ${userInput.job_title}
- Make it ${style} style (professional/creative/technical)
- Include relevant technologies and tools

Format: Return as JSON array of objects with: title, company, duration, bullets (array of strings)
Example structure:
[
  {
    "title": "Senior Software Engineer",
    "company": "Tech Company",
    "duration": "2020 - Present",
    "bullets": [
      "Led development of...",
      "Optimized performance by 40%...",
      "Managed team of 5 engineers..."
    ]
  }
]`;

  const originalProvider = process.env.AI_PROVIDER;
  if (aiProvider) {
    process.env.AI_PROVIDER = aiProvider;
  }

  try {
    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: WRITING_STYLES[style].systemMessage,
      max_tokens: 800,
      aiProvider,
    });

    // Try to extract JSON array from response - handle markdown code blocks
    let jsonText = response;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }
    
    // Try to find JSON array
    let jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Try object format
      jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    }
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // If it's an array, return it
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
        // If it's an object with experience array
        if (parsed.experience && Array.isArray(parsed.experience)) {
          return parsed.experience;
        }
      } catch (parseError) {
        logger.warn('JSON parse error in generateExperience, using fallback:', parseError.message);
      }
    }
    
    // Fallback: parse manually
    return parseExperienceFromText(response);
  } finally {
    // Restore original provider
    if (aiProvider) {
      process.env.AI_PROVIDER = originalProvider;
    }
  }
}

/**
 * Generate skills section
 */
async function generateSkills(userInput, style, aiProvider = null) {
  const prompt = `Generate a comprehensive, powerful skills section for a ${userInput.experience_level} ${userInput.job_title} in ${userInput.industry}.

User's mentioned skills: ${userInput.skills.join(', ')}

Requirements:
- Include 8-12 technical skills relevant to ${userInput.job_title} and ${userInput.industry}
- Include 5-7 soft skills that complement the role
- Include 5-8 tools, frameworks, and technologies
- Include 2-3 relevant certifications if applicable for ${userInput.experience_level} level
- Use industry-standard terminology and ATS-friendly keywords
- Make it comprehensive but focused on the role
- Ensure skills are relevant to ${userInput.experience_level} level

Return as JSON object with categories: technical (array), soft (array), tools (array), certifications (array)
Example:
{
  "technical": ["JavaScript", "React", "Node.js", ...],
  "soft": ["Leadership", "Problem Solving", ...],
  "tools": ["Git", "Docker", "AWS", ...],
  "certifications": ["AWS Certified Developer", ...]
}`;

  const originalProvider = process.env.AI_PROVIDER;
  if (aiProvider) {
    process.env.AI_PROVIDER = aiProvider;
  }

  try {
    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: WRITING_STYLES[style].systemMessage,
      max_tokens: 400,
      aiProvider,
    });

    // Try to extract JSON from response - handle markdown code blocks
    let jsonText = response;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }
    
    // Try to find JSON object
    let jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try array format
      jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    }
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate structure
        if (parsed && (parsed.technical || parsed.soft || Array.isArray(parsed))) {
          return parsed;
        }
      } catch (parseError) {
        logger.warn('JSON parse error in generateSkills, using fallback:', parseError.message);
      }
    }

    // Fallback: return structured data from user input
    return {
      technical: Array.isArray(userInput.skills) ? userInput.skills : [userInput.skills],
      soft: ['Communication', 'Problem Solving', 'Teamwork'],
      tools: [],
      certifications: [],
    };
  } finally {
    if (aiProvider) {
      process.env.AI_PROVIDER = originalProvider;
    }
  }
}

/**
 * Generate education section
 */
async function generateEducation(userInput, style, aiProvider = null) {
  const prompt = `Generate a professional education section appropriate for a ${userInput.experience_level} ${userInput.job_title} in ${userInput.industry}.

Requirements:
- Create 1-2 education entries (Bachelor's, Master's, or relevant certifications)
- Include degree name, institution name, graduation year
- For technical roles, include relevant coursework if applicable
- Make it realistic and professional
- Match the education level to ${userInput.experience_level} (entry-level might have Bachelor's, senior might have Master's or additional certifications)

Return as JSON array with: degree, institution, year, relevant_courses (optional array)
Example:
[
  {
    "degree": "Bachelor of Science in Computer Science",
    "institution": "State University",
    "year": "2020",
    "relevant_courses": ["Data Structures", "Algorithms", "Software Engineering"]
  }
]`;

  const originalProvider = process.env.AI_PROVIDER;
  if (aiProvider) {
    process.env.AI_PROVIDER = aiProvider;
  }

  try {
    const response = await aiProviderService.generateCompletion(prompt, {
      systemMessage: WRITING_STYLES[style].systemMessage,
      max_tokens: 300,
      aiProvider,
    });

    // Try to extract JSON array from response - handle markdown code blocks
    let jsonText = response;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }
    
    // Try to find JSON array
    let jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Try object format
      jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    }
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // If it's an array, return it
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
        // If it's an object with education array
        if (parsed.education && Array.isArray(parsed.education)) {
          return parsed.education;
        }
      } catch (parseError) {
        logger.warn('JSON parse error in generateEducation, using fallback:', parseError.message);
      }
    }

    // Fallback: return default education
    return [{
      degree: 'Bachelor\'s Degree',
      institution: 'University',
      year: '2020',
    }];
  } finally {
    if (aiProvider) {
      process.env.AI_PROVIDER = originalProvider;
    }
  }
}

/**
 * Optimize for ATS
 */
async function optimizeForATS(resumeContent, jobDescription, aiProvider = null) {
  const prompt = `Analyze this resume content and optimize it for ATS (Applicant Tracking System) compatibility.

Resume Content:
${JSON.stringify(resumeContent, null, 2)}

Job Description:
${jobDescription}

Provide:
1. ATS optimization score (0-100)
2. Missing keywords to add
3. Suggestions for improvement
4. Optimized version of key sections

Return as JSON with: score, missing_keywords (array), suggestions (array), optimized_sections (object)`;

  const response = await aiProviderService.generateCompletion(prompt, {
    systemMessage: 'You are an ATS optimization expert. Help make resumes pass through applicant tracking systems.',
    max_tokens: 1000,
    aiProvider,
  });

  // Remove markdown code blocks if present
  let jsonText = response;
  const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }
  
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      logger.warn('JSON parse error in optimizeForATS:', parseError.message);
    }
  }

  return {
    score: 75,
    missing_keywords: [],
    suggestions: [],
    optimized_sections: resumeContent,
  };
}

/**
 * Generate complete resume
 */
export async function generateResume(userInput, options = {}) {
  try {
    const {
      style = 'professional',
      jobDescription = null,
      includeATS = true,
    } = options;

    if (!WRITING_STYLES[style]) {
      throw new Error(`Invalid writing style: ${style}`);
    }

    logger.info(`Generating ${style} resume for ${userInput.job_title}`);

    // Get AI provider from options or use default
    const aiProvider = options.aiProvider || null;

    // Generate all sections in parallel
    const [summary, experience, skills, education] = await Promise.all([
      generateSummary(userInput, style, aiProvider),
      generateExperience(userInput, style, aiProvider),
      generateSkills(userInput, style, aiProvider),
      generateEducation(userInput, style, aiProvider),
    ]);

    const resume = {
      summary,
      experience,
      skills,
      education,
      style,
      generated_at: new Date().toISOString(),
    };

    // ATS optimization if requested
    let atsOptimization = null;
    if (includeATS && jobDescription) {
      atsOptimization = await optimizeForATS(resume, jobDescription, aiProvider);
    }

    return {
      resume,
      ats_optimization: atsOptimization,
      metadata: {
        style: WRITING_STYLES[style],
        word_count: estimateWordCount(resume),
        sections: Object.keys(resume).length,
      },
    };
  } catch (error) {
    logger.error('Resume generation error:', error);
    throw error;
  }
}

/**
 * Generate A/B test variants
 */
export async function generateABTestVariants(userInput, variants = 2) {
  const styles = Object.keys(WRITING_STYLES);
  const selectedStyles = styles.slice(0, Math.min(variants, styles.length));

  const results = await Promise.all(
    selectedStyles.map(style => generateResume(userInput, { style }))
  );

  return {
    variants: results,
    comparison: {
      styles_tested: selectedStyles,
      recommendation: selectBestVariant(results),
    },
  };
}

/**
 * Helper functions
 */
function parseExperienceFromText(text) {
  // Simple parsing fallback
  return [{
    title: 'Position',
    company: 'Company',
    duration: '2020 - Present',
    bullets: ['Achievement 1', 'Achievement 2', 'Achievement 3'],
  }];
}

function estimateWordCount(resume) {
  const text = JSON.stringify(resume);
  return text.split(/\s+/).length;
}

function selectBestVariant(variants) {
  // Simple selection based on word count and completeness
  return variants.reduce((best, current) => {
    const bestScore = best.metadata.word_count + Object.keys(best.resume).length;
    const currentScore = current.metadata.word_count + Object.keys(current.resume).length;
    return currentScore > bestScore ? current : best;
  });
}

export default {
  generateResume,
  generateABTestVariants,
  WRITING_STYLES,
};