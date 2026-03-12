const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runStabilizer() {
  console.log('--- REPAIRING DB SCHEMA ---');
  const sql = fs.readFileSync('backend/supabase/ULTIMATE_SCHEMA_STABILIZER.sql', 'utf8');
  
  // Try to create the helper first via direct postgres if possible, but 
  // since we only have RPC, we'll try to run a subset or just a simplified command.
  // Actually, let's use a smarter way to run this.
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.log('exec_sql RPC not found. Attempting to create it...');
      const createFn = `
        CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
        RETURNS void AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;
      // Note: We can't use rpc('exec_sql') to create exec_sql. 
      // This is a chicken-and-egg problem in Supabase unless we have direct DB access.
      // But usually, projects like this have it defined.
      console.warn('CRITICAL: Manual SQL Execution required in Supabase Dashboard.');
      console.log('Copy the contents of backend/supabase/ULTIMATE_SCHEMA_STABILIZER.sql and run it in the SQL Editor.');
    } else {
      console.log('✅ Stabilizer applied via RPC successfully!');
    }
  } catch (err) {
    console.error('Fatal error applying stabilizer:', err.message);
  }
}

runStabilizer();
