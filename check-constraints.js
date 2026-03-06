
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkConstraints() {
    // We can check constraints by trying to insert a conflict or checking raw metadata if possible.
    // Usually, we can check by querying information_schema if we had RPC.
    // For now, let's try a test upsert to see if it works as expected.
    const testId = '00000000-0000-0000-0000-000000000000'; // Dummy ID
    const { error } = await supabase.from('study_progress').upsert({
        user_id: testId,
        course_id: testId,
        lessons_completed: 1
    }, { onConflict: 'user_id,course_id' });
    
    if (error) {
        console.log("Upsert error:", error.message);
        if (error.message.includes("constraint")) {
            console.log("Constraint info:", error.details);
        }
    } else {
        console.log("Upsert test successful.");
        // Clean up
        await supabase.from('study_progress').delete().eq('user_id', testId);
    }
}

checkConstraints();
