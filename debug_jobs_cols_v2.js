const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('jobs').select('*').limit(1);
  if (error) {
    console.error(error);
  } else if (data && data.length > 0) {
    const keys = Object.keys(data[0]);
    keys.forEach(k => console.log(k));
  } else {
    console.log('No data in jobs table');
  }
}

run();
