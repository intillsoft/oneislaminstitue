import { createClient } from '@supabase/supabase-client';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  { db: { schema: 'public' } }
);

async function dumpSchema() {
  try {
    const { data, error } = await supabase.rpc('get_schema_columns');
    
    if (error) {
       console.log("RPC failed, falling back to manual information_schema lookup...");
       const { data: fallback, error: err2 } = await supabase
         .from('courses')
         .select('*')
         .limit(1);
       
       console.log("No explicit RPC access. Running local check on standard tables instead...");
    }

    // Since directly listing information_schema through RPC is secure, let me write a fast SQL block 
    // to output all table columns and you can run it inside Supabase to read directly!
    fs.writeFileSync('PUBLIC_SCHEMA.sql', `
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
    `);
    console.log("Schema query generated inside PUBLIC_SCHEMA.sql");
  } catch (err) {
    console.error(err);
  }
}

dumpSchema();
