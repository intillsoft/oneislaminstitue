import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use SERVICE_ROLE_KEY for backend operations (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found in environment variables');
}

if (!supabaseUrl || !supabaseKey) {
    throw new Error('❌ SUPABASE CREDENTIALS REQUIRED! Check backend/.env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
