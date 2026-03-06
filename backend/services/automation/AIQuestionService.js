/**
 * AIQuestionService
 * Detects and answers job application form questions using Resume context.
 */

import logger from '../../utils/logger.js';
import * as aiProviderService from '../aiProviderService.js';

class AIQuestionService {
    constructor(resume) {
        this.resume = resume;
        this.resumeText = JSON.stringify(resume.content_json || {});
    }

    /**
     * Answer a specific question from a form
     * @param {string} question - The label or question text from the form
     * @param {string} inputType - e.g., 'text', 'radio', 'checkbox', 'select'
     * @param {Array} options - If it's a multiple choice/select
     */
    async answerQuestion(question, inputType, options = []) {
        logger.info(`❓ AIQuestionService: Analyzing question: "${question}"`);

        const prompt = `
        You are an AI Job Assistant. Answer this application question using the provided Resume context.
        
        RESUME CONTEXT:
        ${this.resumeText.substring(0, 3000)}

        QUESTION:
        "${question}"

        INPUT TYPE: ${inputType}
        ${options.length > 0 ? `AVAILABLE OPTIONS: ${options.join(', ')}` : ''}

        Rules:
        1. For 'Yes/No', return exactly 'Yes' or 'No'.
        2. For multiple choice, return the exact text of the matching option.
        3. For text, write a concise, professional answer based on facts in the resume.
        4. If uncertain, provide the most plausible professional answer based on experience level.

        Return a JSON object with:
        1. answer: The actual value to fill.
        2. confidence: 0-1 score.
        3. reasoning: Brief explanation.
        `;

        try {
            const response = await aiProviderService.generateCompletion(prompt, {
                response_format: { type: "json_object" },
                temperature: 0.2
            });

            const result = JSON.parse(response);
            logger.info(`💡 AIQuestionService: Answer generated: "${result.answer}" (${Math.round(result.confidence * 100)}% confidence)`);
            return result.answer;
        } catch (error) {
            logger.error('Failed to generate AI answer for question', error);
            return inputType === 'radio' ? 'Yes' : ''; // Safe fallback
        }
    }

    /**
     * Detect all questions on the page (to be used by browser automation)
     */
    async detectQuestions(page) {
        // Logic to scan the DOM for labels, inputs, and legends
        return await page.evaluate(() => {
            const questions = [];
            const labels = document.querySelectorAll('label, legend, .question-label');

            labels.forEach(label => {
                const text = label.innerText.trim();
                if (text.length > 5) {
                    questions.push({
                        text,
                        element: label.outerHTML.substring(0, 100) // For debugging
                    });
                }
            });

            return questions;
        });
    }
}

export default AIQuestionService;
