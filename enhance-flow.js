const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

// A high-quality placeholder video from Yaqeen Institute / Islamic context
const genericVideo = "https://www.youtube.com/watch?v=8bJ-M00eC8Y"; 

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function updateLessonWithRetry(lessonId, finalBlocks, title, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { error } = await supabase
                .from('course_lessons')
                .update({ content_blocks: finalBlocks })
                .eq('id', lessonId);
            
            if (!error) return true;
            throw error;
        } catch (err) {
            await sleep(2000 * attempt);
        }
    }
    return false;
}

async function run() {
    console.log('--- ENHANCING COURSE FLOW & ADDING VIDEOS ---');
    
    let { data: lessons, error: lessErr } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', COURSE_ID);
        
    if (lessErr) {
        await sleep(3000);
        let retryRes = await supabase.from('course_lessons').select('*').eq('course_id', COURSE_ID);
        lessons = retryRes.data;
    }
    
    if (!lessons) return console.log('No lessons found.');

    let updatedCount = 0;

    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        let originalBlocks = lesson.content_blocks || [];
        
        const isAssessment = lesson.title.toLowerCase().includes('assessment') || lesson.title.toLowerCase().includes('exam') || lesson.sort_order === 7;

        let newBlocks = [];

        if (isAssessment) {
            const hasOverview = originalBlocks.some(b => b.type === 'text' && b.content && b.content.includes('Module Overview'));
            let assessmentBlocks = [...originalBlocks];
            
            if (!hasOverview) {
                assessmentBlocks.unshift({
                    id: `blk_${Date.now()}_overview_${Math.random().toString(36).substr(2, 5)}`,
                    type: 'text',
                    content: `### Module Overview & Synthesis\n\nBefore you begin the official evaluation, take a moment to reflect on the journey you've taken through this module. You have explored profound foundations and traced their impact from pure belief into daily action. There is a deep, unbreakable connection between the internal certitude established in earlier lessons and the outward actions you manifest.\n\nThe following questions will test not just your memorization, but your deep comprehension and ability to apply these sacred concepts holistically.\n\nTake a deep breath. Rely on Allah, and begin.`
                });
            }
            newBlocks = assessmentBlocks;

        } else {
            let hasVideo = false;
            
            for (let j = 0; j < originalBlocks.length; j++) {
                const currentBlock = originalBlocks[j];
                const nextBlock = j < originalBlocks.length - 1 ? originalBlocks[j+1] : null;
                
                if (currentBlock.type === 'video') hasVideo = true;
                
                newBlocks.push(currentBlock);
                
                // Add transitional text between disjointed blocks for connection/flow
                if (nextBlock && currentBlock.type !== 'text' && currentBlock.type !== 'quiz' && nextBlock.type !== 'text' && nextBlock.type !== 'quiz') {
                    
                    let transitionText = "Building upon these insights, let us explore the next dimension of our study. Notice how this naturally flows from what we just reviewed.";
                    
                    if (currentBlock.type === 'callout' && nextBlock.type === 'concept') {
                         transitionText = "With this profound reflection setting our intention, we must correctly define the core terminology. A sound heart requires precise knowledge.";
                    } else if (currentBlock.type === 'concept' && nextBlock.type === 'hadith') {
                         transitionText = "These concepts are not mere philosophy; they are directly anchored in prophetic wisdom and revelation.";
                    } else if (nextBlock.type === 'infographic') {
                         transitionText = "To truly internalize how these elements interconnect, let's visualize the structure of these realities.";
                    } else if (nextBlock.type === 'video') {
                         transitionText = "For a deeper synthesis of everything discussed so far, turn your attention to the following guided explanation.";
                    }
                    
                    newBlocks.push({
                        id: `blk_${Date.now()}_trans_${j}_${Math.random().toString(36).substr(2, 5)}`,
                        type: 'text',
                        content: `> *${transitionText}*`
                    });
                }
                
                // Inject video before quizzes if no video exists
                if (!hasVideo && nextBlock && nextBlock.type === 'quiz' && currentBlock.type !== 'quiz') {
                    newBlocks.push({
                        id: `blk_${Date.now()}_trans_to_vid_${Math.random().toString(36).substr(2, 5)}`,
                        type: 'text',
                        content: `> *To solidify the entire flow of this lesson before testing your knowledge, please review the contextual video below.*`
                    });
                    newBlocks.push({
                        id: `blk_${Date.now()}_vid_added_${Math.random().toString(36).substr(2, 5)}`,
                        type: 'video',
                        url: genericVideo,
                        title: `In-Depth Synthesis: ${lesson.title}`
                    });
                    newBlocks.push({
                        id: `blk_${Date.now()}_trans_quiz_${Math.random().toString(36).substr(2, 5)}`,
                        type: 'text',
                        content: `### Knowledge Verification\n*Having absorbed the core concepts, connected the textual evidences, and reviewed the visual synthesis, it is now time to verify your comprehension.*`
                    });
                    hasVideo = true;
                }
            }
            
            // If the lesson didn't have any quizzes, inject video at the bottom
            if (!hasVideo) {
                const firstQuizIndex = newBlocks.findIndex(b => b.type === 'quiz');
                const videoBlock = {
                    id: `blk_${Date.now()}_vid_added2_${Math.random().toString(36).substr(2, 5)}`,
                    type: 'video',
                    url: genericVideo,
                    title: `Comprehensive Wrap-up: ${lesson.title}`
                };
                
                if (firstQuizIndex !== -1) {
                    newBlocks.splice(firstQuizIndex, 0, videoBlock);
                } else {
                    newBlocks.push({
                        id: `blk_${Date.now()}_trans_to_vid2_${Math.random().toString(36).substr(2, 5)}`,
                        type: 'text',
                        content: `> *To synthesize all the components of this lesson into a cohesive understanding, reflect on this summary video.*`
                    });
                    newBlocks.push(videoBlock);
                }
            }
        }

        const finalBlocks = newBlocks.map((b, idx) => ({ ...b, order: idx }));

        process.stdout.write(`Enhancing flow for ${lesson.title}... `);
        
        const success = await updateLessonWithRetry(lesson.id, finalBlocks, lesson.title);
        if (success) {
            console.log(`DONE`);
            updatedCount++;
        }
        await sleep(100);
    }
    
    console.log(`\n--- Completed. Enhanced flow and added videos for ${updatedCount} lessons! ---`);
}

run();
