import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function run() {
  try {
    const { data: cols, error } = await supabase.from('jobs').select('*').limit(1);
    if (error) throw error;
    console.log("Jobs columns:", cols.length ? Object.keys(cols[0]) : "No rows");
  } catch (err) {
    console.error('Fatal error:', err);
  }
}
run();
