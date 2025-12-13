
import { aiService } from './aiService';

export const aiResumeService = {
    // 1. Quantify It (Metric Injector)
    suggestMetrics: async (text) => {
        // In a real app, this would call the LLM to analyze the text and suggest metrics
        // For now, we return intelligent suggestions based on keywords
        const lower = text.toLowerCase();
        const suggestions = [];

        if (lower.includes('develop') || lower.includes('code') || lower.includes('engineer')) {
            suggestions.push('Optimized query performance by [X]%');
            suggestions.push('Reduced build times by [X]%');
        }
        if (lower.includes('lead') || lower.includes('manage') || lower.includes('team')) {
            suggestions.push('Managed team of [X] developers');
            suggestions.push('Increased team velocity by [X]%');
        }
        if (lower.includes('sales') || lower.includes('revenue')) {
            suggestions.push('Generated $[X]k in new revenue');
            suggestions.push('Exceeded quota by [X]%');
        }

        // Default fallback
        if (suggestions.length === 0) {
            suggestions.push('Increased efficiency by [X]%');
            suggestions.push('Reduced costs by [X]%');
            suggestions.push('Impacted [X] users');
        }

        return suggestions;
    },

    // 2. Tone Shift
    adjustTone: async (text, targetTone) => {
        const prompt = `Rewrite the following resume bullet point to have a "${targetTone}" tone. Keep it concise/
    
    Original: "${text}"`;

        try {
            // FAST: Use lighter model or mocked response for responsiveness if needed
            // For production, we call the main AI service
            return await aiService.generateCompletion(prompt);
        } catch (e) {
            // Fallback heuristics if offline
            const tones = {
                'Executive': `Spearheaded initiatives to ${text.replace(/^.*? /, '')}`, // Naive replacement
                'Technical': `Architected and implemented solution: ${text}`,
                'Creative': `Reimagined user experience by ${text.replace(/^.*? /, '')}`
            };
            return tones[targetTone] || text;
        }
    },

    // 3. Verb Boost (Impact Verb Swap)
    suggestPowerVerbs: (text) => {
        // Static dictionary for instant results
        const weakVerbs = ['helped', 'worked', 'made', 'did', 'responsible for', 'managed', 'used'];
        const powerVerbs = {
            'helped': ['Facilitated', 'Assisted', 'Enabled', 'Bolstered'],
            'worked': ['Collaborated', 'Executed', 'Operated'],
            'made': ['Constructed', 'Fabricated', 'Produced', 'Generated'],
            'did': ['Executed', 'Accomplished', 'Performed'],
            'responsible for': ['Owned', 'Accountable for', 'Oversaw'],
            'managed': ['Orchestrated', 'Directed', 'Guided', 'Supervised'],
            'used': ['Leveraged', 'Utilized', 'Deployed', 'Harnessed']
        };

        const words = text.split(' ');
        const firstWord = words[0].toLowerCase();

        // Check first word (most common location for resume verbs)
        if (weakVerbs.includes(firstWord)) {
            return powerVerbs[firstWord];
        }

        // Check phrases
        for (const weak of weakVerbs) {
            if (text.toLowerCase().startsWith(weak)) {
                return powerVerbs[weak];
            }
        }

        return ['Engineered', 'Spearheaded', 'Orchestrated', 'Pioneered']; // Generic power verbs
    },

    // 4. Actionize (The "Magic Fix")
    actionize: async (text) => {
        // Applies the "Action Verb + Task + Result + Metric" formula
        const prompt = `Rewrite this resume bullet using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]). Use strong action verbs.
     
     Input: "${text}"`;

        return await aiService.generateCompletion(prompt);
    },

    // 5. Pivot (Transferable Skills)
    pivotToIndustry: async (text, targetIndustry) => {
        const prompt = `Rewrite this resume skill/experience to highlight transferable skills relevant to the ${targetIndustry} industry. Use industry-standard jargon.
      
      Input: "${text}"`;

        return await aiService.generateCompletion(prompt);
    },

    // 6. Conversational Interface (The Master Brain)
    chat: async (userPrompt, currentData) => {
        // Mock processing - In production this calls a sophisticated agent with tools

        const lowerHelper = userPrompt.toLowerCase();
        let newData = JSON.parse(JSON.stringify(currentData)); // Deep clone
        let message = "I've updated your resume based on your request.";
        let suggestedChanges = false;

        // Heuristic Mock Logic for Demo
        if (lowerHelper.includes('optimize') || lowerHelper.includes('polish')) {
            // Mock "Polish": Capitalize titles, ensure bullets end with periods (mock)
            message = "I've polished the language to be more professional and consistent.";
            suggestedChanges = true;
        }
        else if (lowerHelper.includes('actionize')) {
            // Mock: Would run actionize on all bullets
            message = "I've applied the XYZ impact formula to your experience section.";
            suggestedChanges = true;
        }
        else if (lowerHelper.includes('ats')) {
            message = "Your Resume scores 82/100. I've added missing keywords: 'Agile', 'Scalability'.";
            // Mock: add a skill
            if (!newData.skills.includes('Agile')) newData.skills.push('Agile');
            suggestedChanges = true;
        }
        else {
            message = "I can help with that. Could you provide a bit more detail?";
        }

        return {
            message,
            newData,
            suggestedChanges
        };
    }
};
