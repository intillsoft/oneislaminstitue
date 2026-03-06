import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkNum() {
    console.log("Fetching numeric columns info for jobs table...");
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
          sql: "SELECT column_name, numeric_precision, numeric_scale FROM information_schema.columns WHERE table_name = 'jobs' AND numeric_precision IS NOT NULL;"
      });
      
      if (error) {
          console.error("RPC Error:", error.message);
      } else if (data) {
          console.log("Numeric Columns:", data);
      } else {
          console.log("No data");
      }
    } catch (e) {
      console.error(e);
    }
}

checkNum();
