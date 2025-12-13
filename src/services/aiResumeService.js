
import { supabase } from '../lib/supabaseClient'; // Ensure you have this client

class AIResumeService {
    /**
   * analyze
   * Analyzes the resume data and returns score, breakdown, and suggestions
   */
    async analyze(data) {
        try {
            // MOCK ANALYSIS
            await new Promise(resolve => setTimeout(resolve, 1000));

            let score = 0;
            const breakdown = { contact: 0, summary: 0, experience: 0, skills: 0, education: 0 };
            const suggestions = [];

            if (data.personalInfo?.email) { score += 10; breakdown.contact = 10; }
            else suggestions.push({ type: 'critical', text: 'Missing contact email' });

            if (data.summary?.length > 50) { score += 15; breakdown.summary = 15; }
            else suggestions.push({ type: 'warning', text: 'Summary is too short or missing' });

            if (data.experience?.length > 0) { score += 25; breakdown.experience = 25; }
            else suggestions.push({ type: 'critical', text: 'Add at least one work experience' });

            if (data.skills?.length >= 5) { score += 20; breakdown.skills = 20; }
            else suggestions.push({ type: 'warning', text: 'Add more skills (aim for 5+)' });

            if (data.education?.length > 0) { score += 15; breakdown.education = 15; }

            // Cap score
            score = Math.min(100, score + 15); // Base points

            return {
                score,
                breakdown,
                suggestions,
                keywords: ['React', 'Node.js', 'Leadership'] // Mock keywords
            };

        } catch (error) {
            console.error('AI Analysis failed', error);
            throw error;
        }
    }

    /**
     * generateContent
     * Generic content generation
     */
    async generateContent(prompt, currentContent) {
        try {
            // MOCK GEN
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (prompt.includes('Summary')) {
                return { text: "Experienced professional with a proven track record of success in efficient project management and software development. Skilled in leading cross-functional teams and delivering high-quality solutions." };
            }

            if (prompt.includes('bullet points')) {
                return {
                    text: JSON.stringify([
                        "Led key projects resulting in 20% efficiency increase.",
                        "Developed scalable applications using modern tech stack.",
                        "Collaborated with stakeholders to define requirements."
                    ])
                };
            }

            return { text: "AI Generated Content based on: " + prompt };

        } catch (error) {
            console.error("AI Gen failed", error);
            throw error;
        }
    }

    /**
     * enhanceBulletPoint
     * Enhances a single bullet point to be more impactful/ATS-friendly
     */
    async enhanceBulletPoint(text, context = {}) {
        const prompt = `
You are an expert resume writer. Enhance this bullet point to be more impactful.

Original: ${text}
Job Title: ${context.jobTitle || 'Professional'}
Company: ${context.company || 'Company'}

Requirements:
- Use strong action verbs (led, architected, drove, implemented)
- Add quantifiable metrics when possible
- Follow XYZ formula: Accomplished [X] as measured by [Y] by doing [Z]
- Keep under 150 characters
- Make it ATS-friendly with relevant keywords
- Sound professional and human

Generate 3 variations, each on a new line.
    `;

        try {
            // PROD: Call your backend API here
            // const response = await fetch('/api/ai/enhance', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ prompt, context })
            // });

            // if (!response.ok) throw new Error('AI request failed');
            // const data = await response.json();
            // return data.suggestions;

            // MOCK FALLBACK FOR DEV/DEMO
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            return [
                `Spearheaded ${context.jobTitle || 'project'} initiatives, resulting in significant efficiency gains.`,
                `Optimized performance by implementing ${text || 'key strategies'}, enhancing overall productivity.`,
                `Led cross-functional teams to deliver ${text || 'results'} ahead of schedule.`
            ];

        } catch (error) {
            console.error('AI enhancement failed:', error);
            // Simple text transformation fallbacks
            return [
                text.replace(/helped/gi, 'supported').replace(/worked on/gi, 'developed'),
                text.replace(/was responsible for/gi, 'managed').replace(/did/gi, 'executed'),
                text
            ];
        }
    }

    /**
     * generateSummary
     * Generates a professional summary based on user profile
     */
    async generateSummary(userData) {
        try {
            // MOCK FALLBACK
            await new Promise(resolve => setTimeout(resolve, 2000));
            return `Results-oriented ${userData.personalInfo?.title || 'Professional'} with strong expertise in ${userData.skills?.slice(0, 3).join(', ') || 'industry standards'}. Proven track record of delivering high-quality solutions and driving business growth. Passionate about leveraging technology to solve complex problems.`;

        } catch (error) {
            console.error("AI Summary Gen failed", error);
            return "Experienced professional dedicated to delivering results.";
        }
    }

    // You can add tailorToJob, extractKeywords etc here
}

export const aiResumeService = new AIResumeService();
export default aiResumeService;
