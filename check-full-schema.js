const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  console.log('--- TABLE: jobs ---');
  const { data: cols, error: colError } = await supabase.rpc('get_table_columns_v2', { t_name: 'jobs' });
  
  if (colError) {
    console.log('RPC get_table_columns_v2 failed, trying query...');
    // Fallback to a simple select to see what comes back in JSON
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    if (error) {
      console.error('Select failed:', error);
    } else if (data && data.length > 0) {
      console.log('Sample keys in jobs:', Object.keys(data[0]));
      console.log('Sample donation values:', {
        salary_min: data[0].salary_min,
        salary_max: data[0].salary_max,
        price: data[0].price,
        min: data[0].min,
        max: data[0].max
      });
    } else {
      console.log('No data in jobs table to inspect keys.');
    }
  } else {
    console.log('Columns in jobs:', cols);
  }

  console.log('\n--- TABLE: roles check ---');
  const { data: userData, error: userError } = await supabase.from('users').select('id, role, email').limit(5);
  if (userError) console.error('User fetch error:', userError);
  else console.table(userData);
}

checkSchema();
