import { task } from "@trigger.dev/sdk/v3";
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase lazily inside the task to avoid startup crashes

/**
 * Autopilot AI Agent Task
 * Handles sophisticated background job applications using Stagehand & AI
 */
export const autopilotAgentTask = task({
    id: "autopilot-agent",
    run: async (payload: {
        jobUrl: string;
        resumeData: any;
        userId: string;
        jobId: string;
        logId: string;
    }) => {
        const { jobUrl, resumeData, userId, jobId, logId } = payload;

        // Lazy initialize Supabase to prevent build-time errors
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        console.log(`🚀 Starting AI Agent for job: ${jobUrl}`);

        const stagehand = new Stagehand({
            env: "LOCAL",
            apiKey: process.env.BROWSERBASE_API_KEY!,
            projectId: process.env.BROWSERBASE_PROJECT_ID!,
            modelName: "gpt-4o", // Using high-intelligence model for complex logic
            domSettleTimeoutMs: 3000,
            headless: false, // Ensure user can see the browser
        });

        try {
            await stagehand.init();
            const page = stagehand.page;

            // 1. Navigate to Job URL
            await page.goto(jobUrl);
            console.log("✅ Navigated to portal. Beginning AI observation...");

            // 2. Identify and Initiate Application
            await page.act({
                action: "Find the primary 'Apply' or 'Apply Now' button and click it. If it's a multi-step modal, wait for the first step to load.",
            });

            // 3. Recursive Form Handling
            let applicationComplete = false;
            let steps = 0;
            const MAX_STEPS = 10;

            while (!applicationComplete && steps < MAX_STEPS) {
                steps++;

                // Extract current view state/questions
                const { questions } = await page.extract({
                    instruction: "Identify any form questions, input fields, or requirements currently visible on the page.",
                    schema: z.object({
                        questions: z.array(z.string()),
                    }),
                });

                if (questions.length > 0) {
                    console.log(`🧠 Answering ${questions.length} questions using resume context...`);
                    // AI Logic to fill form based on resume context
                    await page.act({
                        action: `Fill out the form fields and answer these questions: ${questions.join(", ")}. Use this resume context: ${JSON.stringify(resumeData)}. Be concise and professional.`,
                    });
                }

                // Attempt to move to Next or Submit
                const { isLastStep } = await page.extract({
                    instruction: "Determine if this is the final 'Submit' step or if there is a 'Next' button.",
                    schema: z.object({
                        isLastStep: z.boolean(),
                    }),
                });

                if (isLastStep) {
                    await page.act({ action: "Click the 'Submit Application' button." });
                    applicationComplete = true;
                } else {
                    await page.act({ action: "Click the 'Next' or 'Continue' button." });
                }

                // Brief settle for navigation
                await new Promise(r => setTimeout(r, 2000));
            }

            // 4. Update Database upon Success
            if (applicationComplete) {
                await supabase
                    .from("applications")
                    .insert({
                        user_id: userId,
                        job_id: jobId,
                        status: "applied",
                        notes: "Applied via Autopilot AI Agent (Stagehand)",
                    });

                await supabase
                    .from("auto_apply_logs")
                    .update({ status: "success", applied_at: new Date().toISOString() })
                    .eq("id", logId);

                return { success: true };
            }

            throw new Error("Failed to reach confirmation state within step limit.");

        } catch (error: any) {
            console.error(`❌ Agent Mission Failed: ${error.message}`);

            // Update Log with failure
            await supabase
                .from("auto_apply_logs")
                .update({
                    status: "failed",
                    reason: error.message || "Unknown automation error"
                })
                .eq("id", logId);

            // Recursive retry or CAPTCHA check could go here
            if (error.message.includes("CAPTCHA")) {
                console.warn("⚠️ CAPTCHA detected. Human intervention might be required.");
            }

            throw error; // Let Trigger.dev handle the retry if configured
        } finally {
            await stagehand.close();
        }
    },
});
