
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debug() {
    console.log('--- DB Debug ---');

    const { count: jobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
    console.log('Jobs count:', jobsCount);

    const { count: crawledCount } = await supabase.from('crawled_jobs').select('*', { count: 'exact', head: true });
    console.log('Crawled jobs count:', crawledCount);

    const { data: users } = await supabase.from('users').select('id, email, role').limit(5);
    console.log('First 5 users:', users);

    const { count: embeddingsCount } = await supabase.from('embeddings_cache').select('*', { count: 'exact', head: true });
    console.log('Embeddings cache count:', embeddingsCount);
}

debug();
