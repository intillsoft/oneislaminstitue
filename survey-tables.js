
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllTables() {
    // Attempt to query information_schema via a trick or just lists
    // Actually, Supabase doesn't let you query information_schema via the JS client easily 
    // BUT we can use an RPC if the user has one, or try to use 'pg_catalog' if possible.
    // Let's try to find an RPC or just try many names.
    const names = [
        'users', 'profiles', 'jobs', 'companies', 'applications', 'saved_courses',
        'course_modules', 'course_lessons', 'lesson_content', 'lesson_progress',
        'study_progress', 'course_progress', 'enrollments', 'course_enrollments',
        'study_streaks', 'achievements', 'user_achievements', 'notifications',
        'messages', 'curriculum', 'lesson_chat_messages', 'lesson_chats'
    ];
    
    console.log("Starting table survey...");
    for (const name of names) {
        const { error } = await supabase.from(name).select('id').limit(1);
        if (error) {
            if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.message.includes('not find')) {
                // console.log(`[ABSENT] ${name}`);
            } else {
                console.log(`[ERROR] ${name}: ${error.message} (${error.code})`);
            }
        } else {
            console.log(`[EXISTS] ${name}`);
        }
    }
}

listAllTables();
