import { supabase } from '../lib/supabase';

export const trainingService = {
    /**
     * Save a training session result to the database
     * @param {Object} sessionData - { tool_type, score, metadata, title }
     */
    async saveSession(sessionData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('training_sessions')
                .insert([{
                    ...sessionData,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving training session:', error);
            throw error;
        }
    },

    /**
     * Get user's training history
     */
    async getHistory(toolType = null) {
        try {
            let query = supabase
                .from('training_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (toolType) {
                query = query.eq('tool_type', toolType);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching training history:', error);
            throw error;
        }
    }
};
