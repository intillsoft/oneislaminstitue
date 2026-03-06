
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
// Use correct key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// MOCK SETTINGS (Replace with typical user settings to test)
const settings = {
    job_title_keywords: ['Software Engineer', 'Developer', 'Frontend', 'Backend'],
    location: [], // Empty array or ['Remote']
    remote_only: false,
    min_match_score: 50
};

async function testJobSearch() {
    console.log('🔍 Testing Job Search Logic...');

    let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

    // REPLICATING autoApplyService.js LOGIC EXACTLY

    // 1. Keywords
    if (settings.job_title_keywords && settings.job_title_keywords.length > 0) {
        const jobTitleKeywords = settings.job_title_keywords
            .map(k => {
                const str = typeof k === 'string' ? k : String(k);
                return str.trim();
            })
            .filter(k => k.length > 0)
            .map(keyword => {
                const sanitized = keyword.replace(/[,()]/g, '').replace(/"/g, '');
                return `title.ilike."%${sanitized}%"`;
            })
            .join(',');

        if (jobTitleKeywords.length > 0) {
            console.log('Appling Keyword Filter:', jobTitleKeywords);
            query = query.or(jobTitleKeywords);
        }
    }

    // 2. Location (Array support)
    // Simulating empty location for now to match defaults
    if (settings.remote_only) {
        query = query.or('location.ilike.%remote%,location.ilike.%anywhere%');
    } else if (settings.location) {
        let locations = [];
        if (Array.isArray(settings.location)) {
            locations = settings.location.filter(l => l && l.trim().length > 0);
        } else if (typeof settings.location === 'string' && settings.location.trim().length > 0) {
            locations = [settings.location];
        }

        if (locations.length > 0) {
            const locationQuery = locations
                .map(loc => `location.ilike."%${loc.trim()}%"`)
                .join(',');
            console.log('Applying Location Filter:', locationQuery);
            query = query.or(locationQuery);
        }
    }

    // EXECUTE
    const { data: jobs, error } = await query;

    if (error) {
        console.error('❌ Query Failed:', error);
    } else {
        console.log(`✅ Query Successful! Found ${jobs.length} jobs.`);
        if (jobs.length > 0) {
            console.log('Sample Job:', jobs[0].title, '|', jobs[0].location);
        } else {
            console.log('⚠️ No jobs found with these criteria.');
            // DEBUG: Check total jobs
            const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
            console.log(`(Total active jobs in DB: ${count})`);
        }
    }
}

testJobSearch();
