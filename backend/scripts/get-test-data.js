import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFetch() {
    try {
        const { data: userData, error: userError } = await supabase.from('auto_apply_settings').select('user_id').limit(1);
        const { data: jobData, error: jobError } = await supabase.from('jobs').select('id, url').limit(1);
        const { data: resumeData, error: resumeError } = await supabase.from('resumes').select('id').eq('user_id', userData[0]?.user_id).limit(1);

        if (userError) throw userError;
        if (jobError) throw jobError;
        let resumeId = resumeData?.[0]?.id;

        if (!resumeId) {
            console.log('Creating test resume...');
            const { data: newResume, error: createError } = await supabase
                .from('resumes')
                .insert({
                    user_id: userData[0].user_id,
                    name: 'Test Resume',
                    content_json: { personal_info: { name: 'Test User' }, experience: [] },
                    is_default: true
                })
                .select()
                .single();

            if (createError) throw createError;
            resumeId = newResume.id;
        }

        console.log('DATA_START');
        console.log('User:', userData?.length, userData?.[0]?.user_id);
        console.log('Resumes:', resumeId);
        console.log('Job:', jobData?.[0]?.url);
        console.log('DATA_END');
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

testFetch();
