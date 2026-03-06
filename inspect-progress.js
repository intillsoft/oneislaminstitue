import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAccess() {
    // 1. Try to fetch applications to check what jobs/courses the user is enrolled in
    const { data: users, error: userErr } = await supabase.from('users').select('id, email').limit(5);
    if (userErr) {
        console.error("User fetch error:", userErr);
        return;
    }
    
    console.log("Users:", users.map(u => u.email));
    
    if (users.length > 0) {
        const userId = users[0].id;
        console.log(`Checking progress for user: ${userId}`);
        
        const { data: apps, error: appErr } = await supabase
            .from('applications')
            .select('id, course_id, job_id, status')
            .eq('user_id', userId);
            
        console.log("Applications/Enrollments:", apps);
        
        // Use RPC to execute SQL directly and bypass schema cache for the insert/update
        const { data: rpcData, error: rpcErr } = await supabase.rpc('exec_sql', {
            query: `INSERT INTO study_progress (user_id, course_id, status) VALUES ('${userId}', '00000000-0000-0000-0000-000000000000', 'in_progress') ON CONFLICT DO NOTHING;`
        });
        
        console.log("RPC Exec Result:", rpcErr ? rpcErr.message : "Success");
    }
}

testAccess();
