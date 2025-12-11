/**
 * Talent Marketplace AI Service
 * Advanced AI features for freelancers and gig economy
 */

import { generateCompletion } from './openaiService.js';
import logger from '../utils/logger.js';

/**
 * 1. Gig Doctor & SEO Booster
 * Optimizes gig titles and descriptions for better visibility and conversion
 */
export async function optimizeGig(title, description, category, tags = []) {
    try {
        const prompt = `You are an expert Freelance Copywriter and SEO Specialist. Optimize this gig listing for a talent marketplace (like Upwork/Fiverr).

Current Title: ${title}
Current Description: ${description}
Category: ${category}
Current Tags: ${tags.join(', ')}

Task:
1. Rewrite Title: Make it punchy, benefit-driven, and SEO-friendly (max 80 chars).
2. Rewrite Description: Use AIDA framework (Attention, Interest, Desire, Action). Highlight benefits, not just features. Use markdown formatting.
3. Suggest Tags: 5-7 high-traffic search tags.
4. Provide a "Why this is better" explanation.

Return JSON format: { "optimizedTitle": "...", "optimizedDescription": "...", "suggestedTags": ["..."], "improvements": "..." }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a world-class copywriter for freelancers. promoting high conversion rates.',
            max_tokens: 1000,
            temperature: 0.7,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { optimizedTitle: title, optimizedDescription: description, suggestedTags: tags, improvements: "Could not optimize." };

    } catch (error) {
        logger.error('Gig optimization failed:', error);
        throw new Error('Failed to optimize gig');
    }
}

/**
 * 2. Smart Rate Intelligence
 * Analyzes pricing vs. market data to maximize revenue
 */
export async function analyzeRates(title, skills, experienceLevel, currentRate, category) {
    try {
        const prompt = `You are a Pricing Strategy Consultant for freelancers. Analyze this freelancer's rate.

Role: ${title}
Category: ${category}
Skills: ${skills.join(', ')}
Experience: ${experienceLevel}
Current Hourly Rate: $${currentRate}

Task:
1. Determine market rate range for this profile (Low, Mid, High).
2. Analyze if the user is underpriced, overpriced, or optimal.
3. Suggest a new rate strategy.
4. Calculate potential annual revenue difference.

Return JSON format: { "marketRange": {"low": X, "high": Y}, "status": "underpriced/optimal/overpriced", "suggestedRate": Z, "potentialRevenueIncrease": "...", "reasoning": "..." }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a data-driven pricing expert.',
            max_tokens: 500,
            temperature: 0.5,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    } catch (error) {
        logger.error('Rate analysis failed:', error);
        throw new Error('Failed to analyze rates');
    }
}

/**
 * 3. Auto-Proposal Generator
 * Generates custom proposals for jobs
 */
export async function generateProposal(jobDetails, freelancerProfile, tone = 'professional') {
    try {
        const prompt = `Write a winning freelance proposal for this job.

Job Details:
Title: ${jobDetails.title}
Description: ${jobDetails.description}
Client Budget: ${jobDetails.budget}

Freelancer Profile:
Name: ${freelancerProfile.name}
Title: ${freelancerProfile.title}
Skills: ${freelancerProfile.skills.join(', ')}
Portfolio Items: ${JSON.stringify(freelancerProfile.portfolio || []).substring(0, 500)}

Tone: ${tone} (Options: professional, enthusiastic, direct)

Task:
1. Hook the client in the first sentence referencing a specific detail from their job.
2. Explain why I am the perfect fit based on my skills.
3. Mention a relevant portfolio item if applicable.
4. Call to action (question or meeting request).
5. Keep it concise (under 200 words).

Return JSON format: { "subjectLine": "...", "proposalBody": "..." }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a top-rated freelancer who writes high-converting proposals.',
            max_tokens: 600,
            temperature: 0.7,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { subjectLine: `Proposal for ${jobDetails.title}`, proposalBody: response };

    } catch (error) {
        logger.error('Proposal generation failed:', error);
        throw new Error('Failed to generate proposal');
    }
}

/**
 * 4. Client "Vibe Check" (Risk Guard)
 * Analyzes client messages for red flags
 */
export async function analyzeClientVibe(messages, clientData) {
    try {
        const prompt = `Analyze this client communication for a freelancer. Identify any "Red Flags" or "Green Flags".

Client Name: ${clientData.name}
Messages:
${messages.map(m => `[${m.role}]: ${m.content}`).join('\n')}

Risk Factors to check:
- Asking for free work / "spec work"
- Vague requirements
- Disrespectful tone
- Unrealistic deadlines
- "Payment issues" mentions

Task:
1. Assign a Risk Score (0-100, where 100 is high risk).
2. Identify specific flags.
3. Provide advice on how to proceed.

Return JSON format: { "riskScore": X, "riskLevel": "Low/Medium/High", "redFlags": [], "greenFlags": [], "advice": "..." }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a Freelance Safety Expert protecting talent from bad clients.',
            max_tokens: 500,
            temperature: 0.5,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { riskScore: 0, advice: "Analysis failed." };

    } catch (error) {
        logger.error('Client vibe check failed:', error);
        throw new Error('Failed to analyze client');
    }
}

/**
 * 5. Skill Verification via AI Chat
 * Conducts a technical interview
 */
export async function verifySkill(skill, chatHistory) {
    try {
        const prompt = `You are a Senior Technical Interviewer verifying a candidate's skill in "${skill}".

History so far:
${chatHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

Task:
If this is the start, ask a challenging but fair conceptual question about ${skill}.
If the user answered, grade their answer (Pass/Fail) and ask a follow-up or conclude.
If concluding, provide a final score (0-100) and certification status.

Return JSON format: { "message": "...", "isComplete": boolean, "score": number, "passed": boolean }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a strict but fair technical interviewer.',
            max_tokens: 400,
            temperature: 0.3,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { message: "Error in verification.", isComplete: true };

    } catch (error) {
        logger.error('Skill verification failed:', error);
        throw new Error('Failed to verify skill');
    }
}

/**
 * 6. "Smart Upsell" Assistant
 * Suggests upsell opportunities during chat
 */
export async function suggestUpsell(chatContext, availableServices) {
    try {
        const prompt = `Review this chat between a freelancer and client. Suggest a relevant service to upsell.

Chat Context:
${chatContext}

Available Services (Gigs):
${JSON.stringify(availableServices)}

Task:
1. Identify a need expressed by the client that isn't fully met by the current agreement.
2. Select the best matching service from the list.
3. Draft a polite, helpful upsell message the freelancer can send.

Return JSON format: { "opportunityFound": boolean, "suggestedServiceId": "...", "suggestionReason": "...", "draftMessage": "..." }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a Helpful Sales Assistant for freelancers.',
            max_tokens: 400,
            temperature: 0.6,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { opportunityFound: false };

    } catch (error) {
        logger.error('Upsell suggestion failed:', error);
        return { opportunityFound: false };
    }
}

/**
 * 7. Earnings Forecaster
 * Predicts future revenue
 */
export async function forecastEarnings(earningsHistory, activeGigs, pipeline) {
    try {
        const prompt = `Predict freelancer earnings for next month.

Past 3 Months Earnings: ${JSON.stringify(earningsHistory)}
Current Active Gigs Value: $${activeGigs}
Pipeline (Proposals Sent): ${pipeline}

Task:
1. Predict next month's earnings.
2. Provide a confidence interval.
3. List key factors influencing the prediction.

Return JSON format: { "predictedAmount": X, "range": {"min": Y, "max": Z}, "trend": "up/down/stable", "factors": ["..."] }`;

        const response = await generateCompletion(prompt, {
            systemMessage: 'You are a Financial Analyst for gig workers.',
            max_tokens: 300,
            temperature: 0.4,
            jsonMode: true
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { predictedAmount: 0 };

    } catch (error) {
        logger.error('Earnings forecast failed:', error);
        throw new Error('Failed to forecast earnings');
    }
}

export default {
    optimizeGig,
    analyzeRates,
    generateProposal,
    analyzeClientVibe,
    verifySkill,
    suggestUpsell,
    forecastEarnings
};
