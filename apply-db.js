const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySQL() {
  const sql = fs.readFileSync('fix-db.sql', 'utf8');
  
  // Try to use rpc execute_sql
  const { data, error } = await supabase.rpc('execute_sql', { sql });
  if (error) {
    console.log('Cant run RPC:', error.message);
    console.log('Please copy the contents of fix-db.sql into the Supabase SQL Editor manually.');
  } else {
    console.log('SQL Executed successfully:', data);
  }
}
applySQL();
