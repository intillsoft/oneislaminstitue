import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyUpdate() {
  console.log('--- TESTING DONATION SAVING ---');
  // First find the first course
  const { data: firstCourse } = await supabase.from('jobs').select('id, title').limit(1).single();
  
  if (!firstCourse) {
    console.log('No courses found.');
    return;
  }
  
  console.log(`Setting course "${firstCourse.title}" donation to $15 - $100`);
  
  const { data: updated, error } = await supabase
    .from('jobs')
    .update({
      salary_min: 15,
      salary_max: 100,
      price: 15,
      min: 15,
      max: 100
    })
    .eq('id', firstCourse.id)
    .select()
    .single();

  if (error) {
    console.error('Update failed:', error);
  } else {
    console.log('✅ Update successful!');
    console.log('Saved values:', {
      salary_min: updated.salary_min,
      salary_max: updated.salary_max,
      price: updated.price,
      min: updated.min,
      max: updated.max
    });
  }
}

verifyUpdate();
