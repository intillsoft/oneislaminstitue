/**
 * AI Validator Service
 * Validates user input for quality, relevance, and safety before processing.
 */

import { generateCompletion } from './aiProviderService.js';
import logger from '../utils/logger.js';

/**
 * Validate user input using AI
 * @param {string} type - The type of input (e.g., 'resume', 'job_description', 'message', 'negotiation_offer')
 * @param {string} content - The actual content to validate
 * @param {object} context - Optional context (e.g., job title, recipient role)
 */
export async function validateInput(type, content, context = {}) {
    try {
        if (!content || content.length < 10) {
            return {
                isValid: false,
                issues: ['Input is too short to be meaningful.'],
                suggestions: ['Please provide more detailed information.'],
                improvedContent: null,
            };
        }

        const systemPrompt = `You are an expert Content Quality Assurance AI. 
Your goal is to validate user inputs for a professional career platform.
Check for:
1. Gibberish or nonsense.
2. Irrelevance to the requested type (${type}).
3. Profanity or inappropriate content.
4. "Lazy" input (e.g., "idk", "fill this in").

Output strict JSON:
{
  "isValid": boolean,
  "issues": ["list", "of", "critical", "issues"],
  "suggestions": ["list", "of", "improvement", "ideas"],
  "improvedContent": "A rewritten, professional version of the input (only if it was poor but salvageable, otherwise null)"
}`;

        const userPrompt = `Validate this ${type}:
Content: "${content.substring(0, 2000)}" // Truncated for safety
Context: ${JSON.stringify(context)}`;

        const response = await generateCompletion(userPrompt, {
            systemMessage: systemPrompt,
            max_tokens: 500,
            temperature: 0.3, // Low temperature for consistent validation
        });

        try {
            // Clean up markdown code blocks if present
            const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '');
            const result = JSON.parse(cleanResponse);
            return result;
        } catch (parseError) {
            logger.warn('AI Validator JSON parse failed', parseError);
            // Fallback if AI output is malformed, assume valid but warn
            return {
                isValid: true,
                issues: [],
                suggestions: [],
                improvedContent: null,
            };
        }

    } catch (error) {
        logger.error('AI Input Validation failed:', error);
        // Fail open (allow input) if validator breaks, but log it
        return {
            isValid: true,
            issues: ['Validation service unavailable - proceeding with caution.'],
            suggestions: [],
            improvedContent: null,
        };
    }
}

export default {
    validateInput,
};
