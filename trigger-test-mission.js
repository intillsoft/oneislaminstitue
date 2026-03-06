import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('backend/.env') });
import { tasks } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTestMission() {
    console.log("🚀 Preparing Autopilot 3.0 Background Mission...");

    try {
        // 1. Fetch User and Resume
        const { data: settings } = await supabase.from('auto_apply_settings').select('user_id').limit(1).single();
        if (!settings) throw new Error("No user found in auto_apply_settings");
        const userId = settings.user_id;

        const { data: resume } = await supabase.from('resumes').select('id, content_json').eq('user_id', userId).limit(1).single();
        if (!resume) throw new Error("No resume found for user. Run get-test-data.js first to create one.");
        const resumeId = resume.id;

        const { data: jobs, error: jobError } = await supabase.from('jobs').select('id, url').limit(1);
        if (jobError) throw jobError;
        if (!jobs || jobs.length === 0) throw new Error("No job found in jobs table");
        const job = jobs[0];
        const jobId = job.id;
        const jobUrl = job.url;

        console.log(`👤 User: ${userId}`);
        console.log(`📄 Resume: ${resumeId}`);
        console.log(`💼 Job: ${jobId}`);

        const payload = {
            user_id: userId,
            job_id: jobId,
            status: 'skipped', // Using 'skipped' to pass DB check constraint for now
            platform: 'linkedin',
            resume_id: resumeId,
            applied_at: new Date().toISOString()
        };
        console.log("Insert Payload:", JSON.stringify(payload));

        // 2. Create a log entry
        const { data: log, error: logError } = await supabase
            .from('auto_apply_logs')
            .insert(payload)
            .select()
            .single();

        if (logError) throw logError;
        console.log(`✅ Log entry created: ${log.id}`);

        // 3. Trigger the task
        const handle = await tasks.trigger("autopilot-agent", {
            jobUrl: jobUrl,
            resumeData: resume.content_json || { skills: ["Test"] },
            userId: userId,
            jobId: jobId,
            logId: log.id
        });

        console.log("🛰️ Background Mission Launched!");
        console.log(`Trigger Handle: ${handle.id}`);
        console.log(`Monitor here: https://cloud.trigger.dev/projects/workflow-autopilot/runs/${handle.id}`);

    } catch (error) {
        console.error("❌ Mission Launch Failed:", error.message);
    }
}

runTestMission();
