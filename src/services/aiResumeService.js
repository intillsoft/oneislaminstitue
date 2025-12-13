import { apiService } from '../lib/api';

export const aiResumeService = {
    /**
     * Analyze resume for ATS score
     */
    async analyze(resumeContent) {
        try {
            const response = await apiService.post('/ai-resume/analyze', {
                resumeContent,
            });
            return response.data;
        } catch (error) {
            console.error('ATS analysis error:', error);
            throw error;
        }
    },

    /**
     * Save resume
     */
    async save(resumeData) {
        try {
            const response = await apiService.post('/ai-resume/save', resumeData);
            return response.data;
        } catch (error) {
            console.error('Resume save error:', error);
            throw error;
        }
    },

    /**
     * Generate resume with AI
     */
    async generate(params) {
        try {
            const response = await apiService.post('/ai-resume/generate', params);
            return response.data;
        } catch (error) {
            console.error('Resume generation error:', error);
            throw error;
        }
    },

    /**
     * Get available templates
     */
    async getTemplates() {
        try {
            const response = await apiService.get('/ai-resume/templates');
            return response.data;
        } catch (error) {
            console.error('Templates fetch error:', error);
            throw error;
        }
    },

    /**
     * Match resume against job description
     */
    async matchJob(resumeContent, jobDescription) {
        try {
            const response = await apiService.post('/ai-resume/job-match', {
                resumeContent,
                jobDescription,
            });
            return response.data;
        } catch (error) {
            console.error('Job match error:', error);
            throw error;
        }
    },

    /**
     * Auto-save resume (with debouncing on client side)
     */
    async autoSave(resumeData) {
        try {
            const response = await apiService.post('/ai-resume/save', {
                ...resumeData,
                isDraft: true,
            });
            return response.data;
        } catch (error) {
            console.error('Auto-save error:', error);
            // Don't throw on auto-save errors to avoid interrupting user
            return null;
        }
    },
};
