import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';
import * as aiProviderService from '../services/aiProviderService.js';

const router = express.Router();

/**
 * WORLD-CLASS ATS SCORING ENGINE
 * Analyzes resumes like top platforms (Jobscan, Resume Worded)
 */
const calculateAdvancedATSScore = (resumeContent) => {
    let score = 0;
    const analysis = {
        score: 0,
        breakdown: {},
        suggestions: [],
        keywords: [],
        readability: 0,
    };

    const content = JSON.stringify(resumeContent).toLowerCase();
    const wordCount = content.split(/\s+/).length;

    // 1. Contact Information (10 points)
    if (content.includes('email') || content.includes('@')) {
        score += 5;
        analysis.breakdown.contact = 5;
    }
    if (content.includes('phone') || /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(content)) {
        score += 5;
        analysis.breakdown.contact = (analysis.breakdown.contact || 0) + 5;
    } else {
        analysis.suggestions.push('Add phone number for better ATS compatibility');
    }

    // 2. Professional Summary (15 points)
    if (resumeContent.summary && resumeContent.summary.length > 50) {
        const summaryScore = Math.min(15, Math.floor(resumeContent.summary.length / 20));
        score += summaryScore;
        analysis.breakdown.summary = summaryScore;
    } else {
        analysis.suggestions.push('Add a compelling professional summary (150-200 words)');
    }

    // 3. Work Experience (25 points)
    if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
        const expScore = Math.min(25, resumeContent.experience.length * 8);
        score += expScore;
        analysis.breakdown.experience = expScore;

        // Check for bullet points
        const hasBullets = resumeContent.experience.some(exp =>
            exp.bullets && exp.bullets.length > 0
        );
        if (!hasBullets) {
            analysis.suggestions.push('Use bullet points in experience section for better readability');
        }
    } else {
        analysis.suggestions.push('Add work experience with specific achievements');
    }

    // 4. Skills Section (20 points)
    if (resumeContent.skills) {
        let skillsCount = 0;
        if (Array.isArray(resumeContent.skills)) {
            skillsCount = resumeContent.skills.length;
        } else if (typeof resumeContent.skills === 'object') {
            skillsCount = Object.values(resumeContent.skills).flat().length;
        }

        const skillsScore = Math.min(20, skillsCount * 2);
        score += skillsScore;
        analysis.breakdown.skills = skillsScore;
        analysis.keywords = Array.isArray(resumeContent.skills)
            ? resumeContent.skills.slice(0, 10)
            : [];

        if (skillsCount < 5) {
            analysis.suggestions.push('Add at least 8-10 relevant skills');
        }
    } else {
        analysis.suggestions.push('Add a skills section with technical and soft skills');
    }

    // 5. Education (10 points)
    if (resumeContent.education && resumeContent.education.length > 0) {
        score += 10;
        analysis.breakdown.education = 10;
    } else {
        analysis.suggestions.push('Add education information');
    }

    // 6. Keyword Density (10 points)
    const industryKeywords = ['leadership', 'managed', 'developed', 'implemented',
        'achieved', 'increased', 'improved', 'created', 'designed', 'analyzed'];
    const foundKeywords = industryKeywords.filter(keyword => content.includes(keyword));
    const keywordScore = Math.min(10, foundKeywords.length * 2);
    score += keywordScore;
    analysis.breakdown.keywords = keywordScore;
    analysis.keywords = [...analysis.keywords, ...foundKeywords];

    // 7. Quantifiable Achievements (10 points)
    const hasNumbers = /\d+%|\$\d+|increased by|decreased by|managed \d+/i.test(content);
    if (hasNumbers) {
        score += 10;
        analysis.breakdown.achievements = 10;
    } else {
        analysis.suggestions.push('Add quantifiable achievements with numbers and percentages');
    }

    // 8. Readability (10 points)
    if (wordCount > 200 && wordCount < 800) {
        score += 10;
        analysis.readability = 100;
        analysis.breakdown.readability = 10;
    } else if (wordCount < 200) {
        analysis.suggestions.push('Resume is too short, aim for 400-600 words');
        analysis.readability = 40;
    } else {
        analysis.suggestions.push('Resume is too long, keep it concise (1-2 pages)');
        analysis.readability = 60;
    }

    analysis.score = Math.min(100, score);
    return analysis;
};

/**
 * POST /api/ai-resume/analyze
 * Advanced ATS analysis
 */
router.post('/analyze', authenticate, async (req, res) => {
    try {
        const { resumeContent } = req.body;

        if (!resumeContent) {
            return res.status(400).json({ error: 'Resume content is required' });
        }

        const analysis = calculateAdvancedATSScore(resumeContent);

        res.json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        logger.error('ATS analysis error:', error);
        res.status(500).json({ error: 'Analysis failed', message: error.message });
    }
});

/**
 * POST /api/ai-resume/save
 * Save resume with auto-save support
 */
router.post('/save', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId, title, content, template, atsScore, isDraft } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Resume content is required' });
        }

        let result;

        if (resumeId) {
            // Update existing
            const { data, error } = await supabase
                .from('resumes')
                .update({
                    title: title || 'My Resume',
                    content_json: content,
                    template: template || 'professional',
                    ats_score: atsScore,
                    is_draft: isDraft !== false,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', resumeId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Create new
            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: userId,
                    title: title || 'My Resume',
                    content_json: content,
                    template: template || 'professional',
                    ats_score: atsScore,
                    is_draft: isDraft !== false,
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        res.json({
            success: true,
            data: result,
            message: resumeId ? 'Resume updated' : 'Resume saved',
        });
    } catch (error) {
        logger.error('Resume save error:', error);
        res.status(500).json({ error: 'Save failed', message: error.message });
    }
});

/**
 * POST /api/ai-resume/generate
 * AI-powered resume generation with advanced features
 */
router.post('/generate', authenticate, async (req, res) => {
    try {
        const { jobTitle, experienceLevel, industry, skills, achievements, style, template } = req.body;

        if (!jobTitle || !skills || !achievements) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Build intelligent prompt
        const prompt = `Create a professional, ATS-optimized resume for a ${experienceLevel} ${jobTitle} in the ${industry} industry.

REQUIREMENTS:
- Professional summary (150-200 words) highlighting key strengths
- 3-4 work experience entries with bullet points showcasing achievements
- Skills section organized by category
- Education section
- Use ${style} writing style
- Include quantifiable achievements with numbers
- Optimize for ATS systems

SKILLS TO INCLUDE:
${skills.join(', ')}

KEY ACHIEVEMENTS TO HIGHLIGHT:
${achievements.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Return JSON format:
{
  "summary": "professional summary text",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "2020 - Present",
      "bullets": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "skills": {
    "Technical": ["skill1", "skill2"],
    "Soft Skills": ["skill3", "skill4"]
  },
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University",
      "year": "2020"
    }
  ]
}`;

        const aiResponse = await aiProviderService.generateCompletion(prompt, {
            systemMessage: 'You are an expert resume writer and career coach. Create professional, ATS-optimized resumes.',
            max_tokens: 2000,
            temperature: 0.7,
        });

        // Parse AI response
        let resumeContent;
        try {
            // Try to extract JSON from response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                resumeContent = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            // Fallback: create structured content
            resumeContent = {
                summary: aiResponse.split('\n').slice(0, 3).join(' '),
                experience: [],
                skills: { Technical: skills.slice(0, 5), 'Soft Skills': ['Communication', 'Leadership', 'Problem Solving'] },
                education: [],
            };
        }

        // Calculate ATS score
        const analysis = calculateAdvancedATSScore(resumeContent);

        res.json({
            success: true,
            data: {
                content: resumeContent,
                atsScore: analysis.score,
                analysis: analysis,
                template: template || 'professional',
            },
        });
    } catch (error) {
        logger.error('Resume generation error:', error);
        res.status(500).json({ error: 'Generation failed', message: error.message });
    }
});

/**
 * GET /api/ai-resume/templates
 * Get available templates with previews
 */
router.get('/templates', async (req, res) => {
    try {
        const templates = [
            {
                id: 'professional',
                name: 'Professional',
                description: 'Clean, ATS-friendly design perfect for corporate roles',
                features: ['ATS Optimized', 'Clean Layout', 'Easy to Read'],
                preview: '/templates/professional.png',
                recommended: true,
            },
            {
                id: 'modern',
                name: 'Modern',
                description: 'Contemporary design with subtle colors',
                features: ['Eye-catching', 'Color Accent', 'Modern Typography'],
                preview: '/templates/modern.png',
            },
            {
                id: 'executive',
                name: 'Executive',
                description: 'Premium format for senior leadership',
                features: ['Executive Style', 'Professional', 'Impactful'],
                preview: '/templates/executive.png',
            },
            {
                id: 'creative',
                name: 'Creative',
                description: 'Designer-focused with visual elements',
                features: ['Creative Layout', 'Visual Interest', 'Unique Design'],
                preview: '/templates/creative.png',
            },
            {
                id: 'technical',
                name: 'Technical',
                description: 'Optimized for developers and tech roles',
                features: ['Tech Focused', 'Skills Highlighted', 'Project Showcase'],
                preview: '/templates/technical.png',
            },
        ];

        res.json({
            success: true,
            data: templates,
        });
    } catch (error) {
        logger.error('Templates fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

/**
 * POST /api/ai-resume/job-match
 * Match resume against job description
 */
router.post('/job-match', authenticate, async (req, res) => {
    try {
        const { resumeContent, jobDescription } = req.body;

        if (!resumeContent || !jobDescription) {
            return res.status(400).json({ error: 'Resume and job description required' });
        }

        const resumeText = JSON.stringify(resumeContent).toLowerCase();
        const jobText = jobDescription.toLowerCase();

        // Extract keywords from job description
        const jobWords = jobText.split(/\s+/).filter(word => word.length > 3);
        const uniqueJobWords = [...new Set(jobWords)];

        // Find matches
        const matches = uniqueJobWords.filter(word => resumeText.includes(word));
        const matchPercentage = Math.round((matches.length / uniqueJobWords.length) * 100);

        // Identify missing keywords
        const missing = uniqueJobWords.filter(word => !resumeText.includes(word)).slice(0, 10);

        res.json({
            success: true,
            data: {
                matchScore: matchPercentage,
                matchedKeywords: matches.slice(0, 15),
                missingKeywords: missing,
                recommendation: matchPercentage >= 70 ? 'Strong match!' :
                    matchPercentage >= 50 ? 'Good match, add missing keywords' :
                        'Consider tailoring resume more',
            },
        });
    } catch (error) {
        logger.error('Job match error:', error);
        res.status(500).json({ error: 'Match analysis failed' });
    }
});

export default router;
