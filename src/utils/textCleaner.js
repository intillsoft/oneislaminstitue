/**
 * Text Cleaning Utilities
 * Remove special characters and format AI responses properly
 */

/**
 * Clean AI response text - remove markdown, special characters, format nicely
 */
export const cleanAIResponse = (text) => {
    if (!text) return '';

    let cleaned = text;

    // Remove markdown bold (**text**)
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');

    // Remove markdown italic (*text*)
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');

    // Remove markdown headers (### text)
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

    // Remove code blocks (```code```)
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

    // Remove inline code (`code`)
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Remove bullet points and list markers
    cleaned = cleaned.replace(/^[-•*]\s+/gm, '');

    return cleaned;
};

/**
 * Format AI response for display - keep structure but clean special chars
 */
export const formatAIResponse = (text) => {
    if (!text) return '';

    let formatted = text;

    // Convert markdown bold to HTML strong (for display)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert markdown italic to HTML em
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert newlines to br tags
    formatted = formatted.replace(/\n/g, '<br />');

    // Convert bullet points to proper list items
    formatted = formatted.replace(/^[-•*]\s+(.+)$/gm, '• $1');

    return formatted;
};

/**
 * Extract clean text from resume content
 */
export const extractCleanResumeText = (resumeContent) => {
    if (!resumeContent) return '';

    let text = '';

    if (typeof resumeContent === 'string') {
        return cleanAIResponse(resumeContent);
    }

    if (resumeContent.summary) {
        text += cleanAIResponse(resumeContent.summary) + '\n\n';
    }

    if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
        resumeContent.experience.forEach(exp => {
            text += `${exp.title || ''} at ${exp.company || ''}\n`;
            if (exp.bullets && Array.isArray(exp.bullets)) {
                exp.bullets.forEach(bullet => {
                    text += `• ${cleanAIResponse(bullet)}\n`;
                });
            }
            text += '\n';
        });
    }

    if (resumeContent.skills) {
        if (typeof resumeContent.skills === 'object' && !Array.isArray(resumeContent.skills)) {
            Object.entries(resumeContent.skills).forEach(([category, skills]) => {
                text += `${category}: ${Array.isArray(skills) ? skills.join(', ') : skills}\n`;
            });
        } else if (Array.isArray(resumeContent.skills)) {
            text += `Skills: ${resumeContent.skills.join(', ')}\n`;
        }
        text += '\n';
    }

    if (resumeContent.education && Array.isArray(resumeContent.education)) {
        resumeContent.education.forEach(edu => {
            text += `${edu.degree || ''} - ${edu.institution || ''} (${edu.year || ''})\n`;
        });
    }

    return text.trim();
};

/**
 * Validate and clean resume data before saving
 */
export const validateResumeData = (resumeData) => {
    const cleaned = { ...resumeData };

    // Clean summary
    if (cleaned.summary) {
        cleaned.summary = cleanAIResponse(cleaned.summary);
    }

    // Clean experience bullets
    if (cleaned.experience && Array.isArray(cleaned.experience)) {
        cleaned.experience = cleaned.experience.map(exp => ({
            ...exp,
            title: cleanAIResponse(exp.title || ''),
            company: cleanAIResponse(exp.company || ''),
            bullets: exp.bullets ? exp.bullets.map(b => cleanAIResponse(b)) : [],
        }));
    }

    // Clean skills
    if (cleaned.skills) {
        if (typeof cleaned.skills === 'object' && !Array.isArray(cleaned.skills)) {
            const cleanedSkills = {};
            Object.entries(cleaned.skills).forEach(([category, skills]) => {
                cleanedSkills[cleanAIResponse(category)] = Array.isArray(skills)
                    ? skills.map(s => cleanAIResponse(s))
                    : cleanAIResponse(skills);
            });
            cleaned.skills = cleanedSkills;
        } else if (Array.isArray(cleaned.skills)) {
            cleaned.skills = cleaned.skills.map(s => cleanAIResponse(s));
        }
    }

    // Clean education
    if (cleaned.education && Array.isArray(cleaned.education)) {
        cleaned.education = cleaned.education.map(edu => ({
            degree: cleanAIResponse(edu.degree || ''),
            institution: cleanAIResponse(edu.institution || ''),
            year: cleanAIResponse(edu.year || ''),
        }));
    }

    return cleaned;
};

export default {
    cleanAIResponse,
    formatAIResponse,
    extractCleanResumeText,
    validateResumeData,
};
