import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';
import * as aiProviderService from './aiProviderService.js';

/**
 * AI Auto Apply Service
 * Handles automated job applications using AI
 */
const aiAutoApplyService = {
    /**
     * Analyze job match using AI
     * Returns match score and analysis
     */
    async analyzeJobMatch(resumeText, jobDescription, jobTitle, companyName) {
        try {
            const prompt = `
            You are an expert ATS (Applicant Tracking System) and Career Coach.
            Analyze the following Resume against the Job Description.

            JOB TITLE: ${jobTitle}
            COMPANY: ${companyName}

            JOB DESCRIPTION:
            ${jobDescription.substring(0, 3000)}

            RESUME:
            ${resumeText.substring(0, 3000)}

            Provide a JSON response with:
            1. matchScore: A number between 0-100 indicating fit.
            2. summary: A brief 2-sentence explanation of the match.
            3. pros: Array of 3 key matching strengths.
            4. cons: Array of 3 missing skills or gaps.

            Response must be valid JSON only.
            `;

            const result = await aiProviderService.generateCompletion({
                prompt,
                response_format: { type: "json_object" }, // Ensure JSON mode if supported, or rely on prompt
                temperature: 0.3
            });

            // Parse valid JSON from AI response
            let analysis;
            try {
                // simple cleanup in case of markdown code blocks
                const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
                analysis = JSON.parse(cleanJson);
            } catch (e) {
                logger.warn('Failed to parse AI job match JSON, using fallback', e);
                analysis = { matchScore: 70, summary: "AI analysis text format error.", pros: [], cons: [] };
            }

            return {
                matchScore: analysis.matchScore || 50,
                reasoning: analysis.summary || "Analysis completed.",
                pros: analysis.pros || [],
                cons: analysis.cons || []
            };

        } catch (error) {
            logger.error('Error in AI job analysis:', error);
            // Fail gracefully
            return {
                matchScore: 0,
                reasoning: "AI Service unavailable.",
                pros: [],
                cons: []
            };
        }
    },

    /**
     * Generate a personalized cover letter
     */
    async generateCoverLetter(resumeText, jobDescription, jobTitle, companyName) {
        try {
            const prompt = `
            Write a professional, persuasive cover letter for:
            Role: ${jobTitle} at ${companyName}

            Based on this Resume context:
            ${resumeText.substring(0, 2000)}

            And this Job Description:
            ${jobDescription.substring(0, 2000)}

            Requirements:
            - Professional tone but enthusiastic.
            - Highlight 2 specific achievements from the resume that match the job.
            - Keep it under 250 words.
            - Do not include placeholders like "[Your Name]".
            `;

            const coverLetter = await aiProviderService.generateCompletion({
                prompt,
                temperature: 0.7
            });

            return coverLetter.trim();
        } catch (error) {
            logger.error('Error generating cover letter:', error);
            return null;
        }
    }
};

export default aiAutoApplyService;
