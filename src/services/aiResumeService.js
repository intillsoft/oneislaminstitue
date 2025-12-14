
import { aiService } from './aiService';

export const aiResumeService = {
    // --- THE POWER SUITE (10 TOOLS) ---

    // 1. Job Matcher (Fit Score + Keywords)
    matchJob: async (resumeText, jobDescription) => {
        const prompt = `Analyze this resume against the job description.
        1. Give a match score (0-100).
        2. List 5 missing keywords/skills that are in the JD but missing in the resume.
        3. Explain *why* the score is what it is.
        
        Resume: "${resumeText.substring(0, 3000)}"
        Job Description: "${jobDescription.substring(0, 3000)}"
        
        Return JSON format: { "score": number, "missingKeywords": [], "analysis": "" }`;
        return await aiService.generateCompletion(prompt, { max_tokens: 500 });
    },

    // 2. Buzzword Blaster
    removeBuzzwords: async (text) => {
        const prompt = `Identify and remove cliché buzzwords (e.g., "synergy", "go-getter", "hard worker") from this text. Replace them with specific, professional descriptors or remove them if redundant.
        Input: "${text}"`;
        return await aiService.generateCompletion(prompt);
    },

    // 3. Quantify-er Plus (Deep Metric Scan)
    suggestMetricsDeep: async (text) => {
        const prompt = `Analyze these resume bullets. Identify places where numbers/metrics are missing but implied (e.g., "Managed team", "Improved performance"). Suggest specific questions the user can answer to add those metrics.
        Input: "${text}"`;
        return await aiService.generateCompletion(prompt);
    },

    // 4. Skill Gap Analyzer
    analyzeSkillGap: async (currentSkills, targetRole) => {
        const prompt = `The user has these skills: ${currentSkills.join(', ')}. They want to be a "${targetRole}". 
        List 5 critical skills they are likely missing for this role.`;
        return await aiService.generateCompletion(prompt);
    },

    // 5. Summary Generator (3 Styles)
    generateSummary: async (resumeData, style = 'Professional') => { // style: Professional | Creative | Technical
        const prompt = `Write a ${style} LinkedIn summary / Resume objective for this profile.
        Role: ${resumeData.title || 'Professional'}
        Experience: ${JSON.stringify(resumeData.experience).substring(0, 2000)}
        Skills: ${resumeData.skills.join(', ')}`;
        return await aiService.generateCompletion(prompt);
    },

    // 6. Cover Letter Generator
    generateCoverLetter: async (resumeData, jobDescription) => {
        const prompt = `Write a compelling cover letter for "${resumeData.title}" applying to a job.
        Resume Highlights: ${JSON.stringify(resumeData.experience?.[0] || '')}
        Job Description: "${jobDescription.substring(0, 1000)}..."`;
        return await aiService.generateCompletion(prompt, { max_tokens: 800 });
    },

    // 7. LinkedIn Optimizer
    optimizeLinkedIn: async (resumeData) => {
        const prompt = `Generate a catchy LinkedIn Headline and a "About" section for this profile.
        Profile: ${resumeData.title} - ${resumeData.skills.join(', ')}`;
        return await aiService.generateCompletion(prompt);
    },

    // 8. Format Fixer
    fixFormatting: async (text) => {
        const prompt = `Fix capitalization, punctuation, and grammar in this text. Ensure bullet points end consistently (either all periods or no periods).
        Text: "${text}"`;
        return await aiService.generateCompletion(prompt);
    },

    // 9. Tone Mirror
    mirrorTone: async (text, companyCulture) => {
        const prompt = `Rewrite this resume text to match the tone of a company described as: "${companyCulture}".
        Text: "${text}"`;
        return await aiService.generateCompletion(prompt);
    },

    // 10. Benefit Focus (Duties -> Achievements)
    benefitFocus: async (text) => {
        const prompt = `Rewrite these responsibilities to focus on the *benefit* or *impact* to the company, rather than just the task performed. (Use "Optimized X to save Y" structure).
        Input: "${text}"`;
        return await aiService.generateCompletion(prompt);
    },

    // --- LEGACY / UTILS ---
    chat: async (userPrompt, currentData) => {
        const prompt = `You are an expert Resume Editor.
        User Request: "${userPrompt}"
        Current Resume JSON: ${JSON.stringify(currentData).substring(0, 3000)}
        
        If the user asks to "Actionize", "Optimize", or change specific parts, return a JSON object with the *changed* fields only.
        If it's a general question, just return a "message".
        
        Final Output JSON format: { "message": "...", "suggestedChanges": true/false, "newData": {...merged with changes...} }`;

        try {
            const result = await aiService.generateCompletion(prompt);
            // Attempt to parse JSON response from LLM
            try { return JSON.parse(result); } catch (e) { return { message: result, suggestedChanges: false, newData: currentData }; }
        } catch (e) {
            return { message: "I couldn't process that request right now.", suggestedChanges: false, newData: currentData };
        }
    }
};
