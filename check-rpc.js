const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRPC() {
  const { data, error } = await supabase.rpc('execute_sql', { sql: 'SELECT 1;' });
  if (error) {
    console.log('RPC execute_sql NOT found or error:', error.message);
  } else {
    console.log('RPC execute_sql IS available!');
  }
}

checkRPC();
