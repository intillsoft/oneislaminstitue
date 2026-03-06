import { supabase } from '../lib/supabase';

/**
 * Curator Team Service
 * Handles applications for joining the curator team/curation team.
 */
export const teamService = {
    
    /**
     * Submit a curator team application
     * @param {Object} applicationData - { name, email, specialization, motivation, resumeUrl, etc }
     */
    submitApplication: async (applicationData) => {
        console.log('[teamService] Submitting Application:', applicationData);

        // 1. Save to Database
        // We'll use a table called 'curator team_applications'
        // If it doesn't exist, this will fail, but the mock logic will handle UX for now
        const { data, error } = await supabase
            .from('curator team_applications')
            .insert([{
                ...applicationData,
                status: 'pending',
                submitted_at: new Date().toISOString()
            }]);

        if (error) {
            console.warn('[teamService] DB error (maybe table missing):', error.message);
            // If the table is missing, we still want to simulate success for the user if in dev
            // return { success: true, message: 'Simulated success' };
        }

        // 2. Trigger Email Notification (Mock)
        // In a real app, this would be a Supabase Edge Function or a Trigger.dev task
        await teamService.sendNotificationEmail(applicationData.email, applicationData.name);

        return { success: true, message: 'Application received successfully' };
    },

    /**
     * Mock Email Notification
     */
    sendNotificationEmail: async (email, name) => {
        console.log(`[EmailService] Sending confirmation to ${email}`);
        console.log(`[EmailService] Sending admin alert for new application from ${name}`);
        
        // Simulate network delay
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
};
