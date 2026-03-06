const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const assessmentQuizzes = [
    { type: "quiz", question: "Which of the following describes the most accurate historical understanding of this doctrine?", options: ["It was invented centuries later", "It was perfectly preserved by the unbroken chain of students of the Prophet", "It changed radically in different eras", "It is entirely metaphorical"], correctIndex: 1, hint: "The transmission is flawless." },
    { type: "quiz", question: "What is the fundamental theological implication discussed in this module?", options: ["The absolute Omnipotence and Wisdom of the Creator", "The insignificance of human action", "That all paths lead to the same destination", "That theology does not matter"], correctIndex: 0, hint: "God's perfection." },
    { type: "quiz", question: "If an objector claimed this concept contradicts reason, what is the classical defense?", options: ["Reason is an illusion", "There is no contradiction between pure reason and authentic revelation", "We just ignore reason", "The text is wrong"], correctIndex: 1, hint: "Reason and Revelation harmonized." },
    { type: "quiz", question: "How does applying this module's teachings impact a person functionally in a time of crisis?", options: ["It does nothing", "It brings profound psychological anchoring (Tawakkul and Yaqeen)", "It makes them angry", "It isolates them"], correctIndex: 1, hint: "Trust and certainty." },
    { type: "quiz", question: "What represents the 'Fruit' (Thamarah) of studying this specific aspect of theology?", options: ["Winning arguments online", "Ihsan (Spiritual Excellence and God-consciousness)", "Gaining an academic title", "Making money"], correctIndex: 1, hint: "The highest level of faith." },
    { type: "quiz", question: "What prevents the believer from falling into intellectual arrogance after mastering these topics?", options: ["Knowing you can't learn more", "The realization that intellect itself is a fragile gift from Allah (Tawfiq)", "Ignoring critics", "Never speaking about it"], correctIndex: 1, hint: "Humility in front of the Divine." },
    { type: "quiz", question: "Identify the false dichotomy often presented in modern discussions about these principles.", options: ["Science vs Wealth", "Faith vs Intellect (when in reality they are perfectly compatible)", "Action vs Emotion", "Charity vs Fasting"], correctIndex: 1, hint: "Faith and reason." },
    { type: "quiz", question: "From the perspectives covered, which trait did the early generations (Salaf) emphasize most alongside profound knowledge?", options: ["Poetry", "Action and extreme piety (Taqwa)", "Business building", "Architecture"], correctIndex: 1, hint: "Implementation." },
    { type: "quiz", question: "What is the ultimate purpose of understanding the Divine Decrees and Unseen Realities?", options: ["Telling the future", "Achieving peace of heart and submitting one's will to the Creator", "Communicating with Jinn", "Changing the past"], correctIndex: 1, hint: "Rida and Taslim." },
    { type: "quiz", question: "According to the consensus of the scholars, these foundational concepts are considered...", options: ["Optional reading", "Known from the religion by necessity (Ma'lum min ad-din bil-darurah)", "Fringe theology", "Metaphors for meditation"], correctIndex: 1, hint: "Essential to the faith." },
    { type: "quiz", question: "When addressing doubts related to these topics, the Islamic framework prioritizes...", options: ["Screaming loudly", "Solidifying the foundations (Usul) before getting lost in minor hypothetical branches", "Ignoring the doubter entirely", "Admitting defeat"], correctIndex: 1, hint: "Fix the foundation first." }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
    console.log('--- RESTRUCTURING LESSON BLOCKS ---');
    
    // Fetch ALL lessons
    const { data: lessons, error: lessErr } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', COURSE_ID);
        
    if (lessErr) return console.log('Les Error:', lessErr);

    let updatedCount = 0;

    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        let originalBlocks = lesson.content_blocks || [];
        
        let newBlocks = [];
        const isAssessment = lesson.title.toLowerCase().includes('assessment') || lesson.title.toLowerCase().includes('exam') || lesson.sort_order === 7;

        if (isAssessment) {
            // Assessment: ONLY quizzes. Exactly 10.
            let quizBlocks = originalBlocks.filter(b => b.type === 'quiz');
            
            // Pad if less than 10
            let poolIndex = 0;
            while (quizBlocks.length < 10) {
                quizBlocks.push(assessmentQuizzes[poolIndex % assessmentQuizzes.length]);
                poolIndex++;
            }
            
            // Trim if more than 10
            if (quizBlocks.length > 10) {
                quizBlocks = quizBlocks.slice(0, 10);
            }
            
            newBlocks = quizBlocks;
            
        } else {
            // Normal Lesson: Non-quizzes first, then quizzes at the bottom
            const nonQuizzes = originalBlocks.filter(b => b.type !== 'quiz');
            const quizzes = originalBlocks.filter(b => b.type === 'quiz');
            newBlocks = [...nonQuizzes, ...quizzes];
        }

        // Re-assign IDs and orders to be safe
        const finalBlocks = newBlocks.map((b, idx) => {
            const blockContent = Object.assign({}, b);
            if (blockContent.content && typeof blockContent.content === 'object') {
                blockContent.content = Object.assign({}, blockContent.content);
            }
            
            return {
                ...blockContent,
                id: b.id && b.id.includes('blk_') ? b.id : `blk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                order: idx
            };
        });

        // Always update to enforce correct order
        process.stdout.write(`Updating ${lesson.title} [Type: ${isAssessment ? 'Assessment (10 Qs)' : 'Standard'}]... `);
        
        const { error } = await supabase
            .from('course_lessons')
            .update({ content_blocks: finalBlocks })
            .eq('id', lesson.id);
            
        if (error) {
            console.log(`ERR: ${error.message}`);
        } else {
            console.log(`DONE`);
            updatedCount++;
        }
        await sleep(50);
    }
    
    console.log(`\n--- Completed. Restructured ${updatedCount} lessons perfectly. ---`);
}

run();
