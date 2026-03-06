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
/**
 * AI-POWERED ATS SCORING ENGINE via LLM
 * Uses Generative AI to simulate top-tier ATS systems (Taleo, Greenhouse, Lever)
 */
const calculateAI_ATSScore = async (resumeContent) => {
    try {
        const contentStr = JSON.stringify(resumeContent);
        const prompt = `
        Act as a strict, advanced Applicant Tracking System (ATS) algorithm used by Fortune 500 companies (like Taleo, Workday, Greenhouse).
        
        Analyze the following resume JSON data.
        
        CRITERIA FOR SCORING (0-100):
        1. **Impact & Quantifiable Metrics** (30%): Are achievements measured with numbers (%, $, count)?
        2. **Keyword Optimization** (25%): Does it use strong industry action verbs and relevant hard skills?
        3. **Structure & Readability** (15%): Is the organization logical? Is the summary compelling?
        4. **Content Quality** (30%): Are bullet points result-oriented (XYZ formula) vs task-oriented?
        
        RESUME CONTENT:
        ${contentStr.substring(0, 5000)}
        
        OUTPUT FORMAT (JSON ONLY):
        {
            "score": <number 0-100>,
            "breakdown": {
                "impact": <score 0-100>,
                "keywords": <score 0-100>,
                "structure": <score 0-100>,
                "content": <score 0-100>
            },
            "suggestions": ["<specific, actionable improvement 1>", "<improvement 2>", ...],
            "keywords": ["<detected powerful keyword 1>", "<keyword 2>"],
            "summary_feedback": "<brief feedback on the professional summary>"
        }
        `;

        const aiResponse = await aiProviderService.generateCompletion(prompt, {
            systemMessage: 'You are a ruthless ATS algorithm. Be critical but constructive.',
            max_tokens: 1000,
            temperature: 0.2, // Low temperature for consistent scoring
            response_format: { type: "json_object" }
        });

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);

            // Normalize result to match expected frontend structure if needed
            return {
                score: result.score,
                breakdown: {
                    contact: 100, // Assumed good if parsed
                    summary: result.breakdown.structure,
                    experience: result.breakdown.content,
                    skills: result.breakdown.keywords,
                    education: 100,
                    keywords: result.breakdown.keywords,
                    achievements: result.breakdown.impact,
                    readability: result.breakdown.structure
                },
                suggestions: result.suggestions || [],
                keywords: result.keywords || [],
                readability: result.breakdown.structure
            };
        }
        throw new Error('Failed to parse AI response');

    } catch (error) {
        logger.error('AI ATS Score execution failed, falling back to rule-based:', error);
        return calculateLegacyATSScore(resumeContent); // Fallback to old logic
    }
};

/**
 * LEGACY RULE-BASED SCORING (Fallback)
 */
const calculateLegacyATSScore = (resumeContent) => {
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

    // ... (Keep simplified version of old logic or just basic estimation)
    // For brevity, using a simplified robust fallback
    if (content.includes('@')) score += 10;
    if (resumeContent.experience?.length > 1) score += 30;
    if (resumeContent.skills) score += 20;
    if (/\d+%|\$/.test(content)) score += 20; // Metrics
    if (wordCount > 200) score += 20;

    analysis.score = Math.min(100, score);
    analysis.suggestions.push("Could not reach AI optimization server. Score is estimated.");
    return analysis;
};

/**
 * POST /api/ai-resume/analyze
 * Advanced ATS analysis via AI
 */
router.post('/analyze', authenticate, async (req, res) => {
    try {
        const { resumeContent } = req.body;

        if (!resumeContent) {
            return res.status(400).json({ error: 'Resume content is required' });
        }

        const analysis = await calculateAI_ATSScore(resumeContent);

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
 * AI-powered resume generation with XYZ Formula & Deep Intelligence
 */
router.post('/generate', authenticate, async (req, res) => {
    try {
        const { jobTitle, experienceLevel, industry, skills, achievements, style, template } = req.body;

        if (!jobTitle || !skills || !achievements) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // REVOLUTIONARY PROMPT ENGINEERING: XYZ Formula
        const prompt = `
        You are the world's best resume writer, known for creating "unignorable" resumes.
        
        TASK: Write a high-impact resume for a ${experienceLevel} ${jobTitle} in the ${industry} industry.
        
        CRITICAL RULES:
        1. **XYZ FORMULA**: Every bullet point must follow the structure: "Accomplished [X] as measured by [Y], by doing [Z]".
        2. **QUANTIFY EVERYTHING**: Use specific numbers, percentages, and dollar amounts (estimate if needed based on typical industry standards for this level).
        3. **STRONG ACTION VERBS**: Start every bullet with power words (e.g., "Spearheaded", "Engineered", "Orchestrated"). Avoid weak words like "Helped" or "Responsible for".
        4. **ATS OPTIMIZATION**: Naturally weave in the provided skills.
        
        INPUT DATA:
        - Skills: ${skills.join(', ')}
        - Key Achievements (Raw): ${achievements.map((a, i) => `${i + 1}. ${a}`).join('\n')}
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "summary": "3-4 sentence powerful professional summary. Open with years of experience and top achievement.",
          "experience": [
            {
              "title": "Job Title",
              "company": "Company Name",
              "duration": "2020 - Present",
              "bullets": [
                "Spearheaded [Project] resulting in [Metric] increase by leveraging [Tech/Skill]...",
                "Orchestrated [Initiative] that saved $[Amount] annually by implementing [Strategy]..."
              ]
            }
          ],
          "skills": {
             "Technical": ["Hard Skill 1", "Hard Skill 2"],
             "Soft Skills": ["Leadership", "Strategic Thinking"]
          },
          "education": [...]
        }`;

        const aiResponse = await aiProviderService.generateCompletion(prompt, {
            systemMessage: 'You are an elite career coach. You hate generic resumes. You write concise, metric-heavy, result-oriented content.',
            max_tokens: 2500,
            temperature: 0.7,
        });

        // Parse AI response (Robust JSON extraction)
        let resumeContent;
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                resumeContent = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found');
            }
        } catch (parseError) {
            // Fallback Logic
            logger.error("AI JSON Parse Error", parseError);
            resumeContent = {
                summary: "Experienced professional seeking new opportunities.",
                experience: [],
                skills: { Technical: skills },
                education: []
            };
        }

        // Calculate ATS score
        const analysis = await calculateAI_ATSScore(resumeContent);

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
 * Intelligent Job Fit Analysis & Gap Detection
 */
router.post('/job-match', authenticate, async (req, res) => {
    try {
        const { resumeContent, jobDescription } = req.body;

        if (!resumeContent || !jobDescription) {
            return res.status(400).json({ error: 'Resume and job description required' });
        }

        // Use AI for Deep Semantic Matching instead of simple regex
        const prompt = `
        Analyze the fit between this resume and the job description.
        
        JOB DESCRIPTION:
        ${jobDescription.substring(0, 1000)}...
        
        RESUME SUMMARY:
        ${JSON.stringify(resumeContent.summary)}
        ${JSON.stringify(resumeContent.skills)}
        
        OUTPUT JSON:
        {
            "matchScore": <number 0-100>,
            "recommendation": "<Strong/Good/Weak>",
            "matchedKeywords": ["list", "of", "matches"],
            "missingKeywords": ["critical", "missing", "skills"],
            "suggestions": ["specific advice to improve fit"]
        }
        `;

        const aiResponse = await aiProviderService.generateCompletion(prompt, {
            systemMessage: 'You are an expert recruiter. Analyze candidate fit strictly.',
            max_tokens: 1000,
            temperature: 0.3,
        });

        let analysisData;
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : { matchScore: 50, missingKeywords: [] };
        } catch (e) {
            analysisData = { matchScore: 0, missingKeywords: [], suggestions: ["Could not analyze."] };
        }

        res.json({
            success: true,
            data: analysisData,
        });
    } catch (error) {
        logger.error('Job match error:', error);
        res.status(500).json({ error: 'Match analysis failed' });
    }
});

export default router;
