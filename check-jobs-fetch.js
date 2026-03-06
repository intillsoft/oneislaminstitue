const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'local.env' }); // Adjust if needed to correctly get variables locally

// We use the REST API via fetch instead of node-fetch to bypass any weird supabase client connection errors we had.
async function getColumns() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.log("Missing env vars. Please make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in a local .env file");
    return;
  }

  try {
    const response = await fetch(`${url}/rest/v1/jobs?select=*&limit=1`, {
      headers: {
        'apikey': anon,
        'Authorization': `Bearer ${anon}`
      }
    });

    const data = await response.json();
    if (data && data.length > 0) {
      console.log('Columns in jobs table:');
      console.log(Object.keys(data[0]).join(', '));
    } else {
      console.log('Jobs table is empty, cannot infer columns.');
    }
  } catch(e) {
    console.error("Fetch error:", e);
  }
}

getColumns();
