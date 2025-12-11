import { supabase } from '../lib/supabase';

/**
 * Service for managing company data
 */
export const companyService = {
    async create(companyData) {
        const { data, error } = await supabase
            .from('companies')
            .insert([companyData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('companies')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async search(query) {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .ilike('name', `%${query}%`)
            .order('name');

        if (error) throw error;
        return data || [];
    }
};

export default companyService;
