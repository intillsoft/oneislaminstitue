const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkOwnership() {
  const { data: courses, error } = await supabase.from('jobs').select('id, title, created_by, instructor_id').limit(10);
  console.table(courses);
}

checkOwnership();
