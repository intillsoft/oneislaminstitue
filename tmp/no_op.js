
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function checkAmountCols() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: cols, error } = await supabase.from('jobs').select('*').limit(1);
    if (!error && data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    }
}
// Actually, let's just use the list from Step 2124.
// Step 2124 list:
// 'id', 'instructor_id', 'department_id', 'title', 'description', 'curriculum', 'requirements', 'learning_outcomes', 'study_mode', 'academic_level', 'study_plan_tier', 'location', 'status', 'is_featured', 'created_at', 'updated_at', 'faculty_id', 'syllabus', 'course_level', 'subject_area', 'total_modules', 'total_lessons', 'credit_hours', 'enrollment_limit', 'enrollment_count', 'featured', 'prerequisite_ids', 'price', 'created_by', 'thumbnail_url', 'preview_video_url', 'instructor_bio', 'target_audience', 'estimated_duration_hours', 'difficulty_rating', 'language', 'company', 'salary_min', 'job_type', 'experience_level', 'industry', 'logo', 'thumbnail', 'image', 'salary_max'
