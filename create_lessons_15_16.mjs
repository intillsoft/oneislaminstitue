import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function main() {
    const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'public' } });
    const moduleId = 'c32c01b9-d72e-47ae-aefd-97cf10439b70'; // Module 1 ID

    // 1. Create Lesson 1.5
    const { data: l15, error: err15 } = await supabase
        .from('course_lessons')
        .insert([
            {
                module_id: moduleId,
                title: "Lesson 1.5: Is There a God? The Human Intuition",
                sort_order: 5,
                duration: 40,
                xp_reward: 100,
                coins_reward: 50
            }
        ])
        .select();

    console.log("Created 1.5:", l15 ? l15[0].id : "Failed", err15 ? err15.message : "");

    // 2. Create Lesson 1.6
    const { data: l16, error: err16 } = await supabase
        .from('course_lessons')
        .insert([
            {
                module_id: moduleId,
                title: "Lesson 1.6: Why Do People Believe Differently?",
                sort_order: 6,
                duration: 40,
                xp_reward: 100,
                coins_reward: 50
            }
        ])
        .select();

    console.log("Created 1.6:", l16 ? l16[0].id : "Failed", err16 ? err16.message : "");
}

main();
