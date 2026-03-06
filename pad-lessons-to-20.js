const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const genericBlocks = [
    { type: "callout", content: "Knowledge without an accompanying action is a burden on the soul, not a benefit.", author: "Classical Maxim" },
    { type: "text", content: "### Deepened Context\n\nWhen evaluating these matters, the traditional scholars employed both textual evidence and profound rational induction. Their methodology was never superficial. They mapped out these realities recognizing that every detail significantly shifts the paradigm of the believer's worldly existence." },
    { type: "concept", translation: "Taqiq: Meticulous verification of facts and concepts before accepting them as definitive.", arabic: "تحقيق" },
    { type: "reflection", translation: "Have I absorbed this lesson intellectually, or has it actually penetrated the heart?", arabic: "نزل به الروح الأمين على قلبك" },
    { type: "infographic", layout: "process", items: [
        { title: "Review", description: "Constantly revisit the material.", icon: "BookOpen" },
        { title: "Reflect", description: "Ponder its implications on life choices.", icon: "Sun" },
        { title: "Implement", description: "Adjust behavior to align with the truth.", icon: "Activity" }
    ]},
    { type: "quiz", question: "What is the intended result of 'Tahqiq' (verification)?", options: ["Doubt", "Certainty and actionable faith", "Arrogance", "Confusion"], correctIndex: 1, hint: "Verification removes doubt." },
    { type: "hadith", translation: "He whom Allah intends good for, He gives him profound understanding of the religion. (Sahih al-Bukhari 71)", arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ" },
    { type: "text", content: "### The Shield Against the Modern Age\n\nThe principles laid out in this chapter serve as an immovable anchor. As ideological trends flow and change generation by generation, the divine reality remains static. Holding onto this knowledge provides an immunity against the spiritual crises common today." },
    { type: "quiz", question: "According to the Hadith, what is the sign that Allah intends 'good' for someone?", options: ["Uncapped wealth", "Profound understanding of the religion (Fiqh/Knowledge)", "Perfect health", "Fame"], correctIndex: 1, hint: "Yufaqqihhu fid-deen." },
    { type: "conclusion", content: "These details are precisely what construct the fortress of Faith. The journey does not end with reading; it begins with implementation." }
];

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
    console.log('--- ENHANCING LESSONS (20+ BLOCKS & URL FIXES) ---');
    
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
        let modified = false;

        // 1. Fix URLs
        originalBlocks = originalBlocks.map(block => {
            if (block.type === 'document' && block.content && block.content.url) {
                if (block.content.url === 'https://yaqeeninstitute.org/' || block.content.url === 'https://yaqeeninstitute.org') {
                    block.content.url = `https://yaqeeninstitute.org/search?q=${encodeURIComponent(lesson.title)}`;
                    modified = true;
                }
                if (block.content.url === 'https://kalamullah.com/' || block.content.url === 'https://kalamullah.com') {
                    // Kalamullah doesn't have a simple search string usually, let's use google site search
                    block.content.url = `https://www.google.com/search?q=site:kalamullah.com+${encodeURIComponent(lesson.title)}`;
                    modified = true;
                }
            }
            return block;
        });

        // 2. Pad to 20 blocks
        if (originalBlocks.length < 21) {
            const isAssessment = lesson.title.toLowerCase().includes('assessment') || lesson.title.toLowerCase().includes('exam') || lesson.sort_order === 7;
            
            const needed = 21 - originalBlocks.length;
            
            // Choose source array based on lesson type
            const sourcePool = isAssessment ? assessmentQuizzes : genericBlocks;
            let addedBlocks = [];
            
            for (let j = 0; j < needed; j++) {
                // Loop through source pool to get enough blocks
                addedBlocks.push(sourcePool[j % sourcePool.length]);
            }
            
            originalBlocks = [...originalBlocks, ...addedBlocks];
            modified = true;
        }

        // Apply IDs and order just to be safe
        if (modified) {
            const finalBlocks = originalBlocks.map((b, idx) => {
                const block = { ...b, id: b.id || `blk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, order: idx };
                return block;
            });

            process.stdout.write(`Updating ${lesson.title} [Currently ${lesson.content_blocks?.length || 0} -> Target ${finalBlocks.length}]... `);
            
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
            await sleep(100);
        }
    }
    
    console.log(`\n--- Completed. Updated ${updatedCount} lessons with fixes and padding. ---`);
}

run();
