const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

// A function to generate distinct elite standard blocks for ANY title
function generateEliteContent(lessonTitle, moduleTitle) {
    const isAssessment = lessonTitle.toLowerCase().includes('assessment') || lessonTitle.toLowerCase().includes('exam');

    const basicBlocks = [
        { type: "callout", content: `A key milestone in mastering the subject of "${moduleTitle}". Knowledge without action is like a tree without fruit.`, author: "Classical Maxim" },
        { type: "objectives", items: [
            `Define the core concepts surrounding ${lessonTitle}`,
            `Analyze practical applications in the modern context`,
            `Identify the impact on personal spiritual growth`,
            `Extract key lessons from the Quran and Sunnah`
        ]},
        { type: "text", content: `## ${lessonTitle}\n\nThe topic of **${lessonTitle}** is foundational to understanding the broader scope of ${moduleTitle}. In Islamic theology and practice, every concept is interconnected. By delving into the details of this subject, a believer protects their heart from doubts and roots their daily actions in divine guidance.\n\nThe early generations (As-Salaf As-Salih) did not view knowledge merely as academic information; they viewed it as a blueprint for action. Therefore, approaching this lesson requires not just intellect, but a sincere intention to apply what is learned.` },
        { type: "concept", translation: "Al-'Amal bil-'Ilm: Action upon knowledge. The Islamic principle that theoretical learning must be followed by practical implementation.", arabic: "العمل بالعلم" },
        { type: "hadith", translation: "Whosoever travels a path seeking knowledge, Allah makes a path to Paradise easy for him. (Sahih Muslim 2699)", arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ" },
        { type: "infographic", layout: "grid", items: [
            { title: "Comprehension", description: "Understanding the explicit texts.", icon: "BookOpen" },
            { title: "Contemplation", description: "Reflecting on the deeper wisdom.", icon: "Brain" },
            { title: "Application", description: "Transforming the physical daily routine.", icon: "Activity" },
            { title: "Transmission", description: "Teaching it to family and community.", icon: "Users" }
        ]},
        { type: "text", content: `### The Practical Impact\n\nHow does ${lessonTitle} change our lives tomorrow morning? When we internalize this reality, our perspective shifts from a worldly focus to an eternal one. The friction we feel in our modern lives—stress, anxiety, confusion—is often eliminated when we correctly apply this principle.` },
        { type: "reflection", translation: `If I was asked about ${lessonTitle} on the Day of Judgment, have I learned enough to answer for my actions?`, arabic: "وقفوهم إنهم مسؤولون" },
        { type: "quiz", question: `What is the primary spiritual goal of studying ${lessonTitle}?`, options: ["Winning debates", "Applying the knowledge to improve one's character and connection with Allah", "Memorizing texts without understanding", "Worldly status"], correctIndex: 1, hint: "Action based on knowledge." },
        { type: "quiz", question: "According to the Hadith, what path is made 'easy' for the seeker of knowledge?", options: ["The path to wealth", "The path to fame", "The path to Paradise (Jannah)", "The path to political power"], correctIndex: 2, hint: "Man salaka tariqan..." },
        { type: "quiz", question: "What does the Arabic concept 'Al-'Amal bil-'Ilm' mean?", options: ["Reading quickly", "Action upon knowledge", "Writing elegantly", "Fasting"], correctIndex: 1, hint: "Theory must become practice." },
        { type: "conclusion", content: `By mastering the core tenets of ${lessonTitle}, the believer fortifies their intellect and purifies their soul. Move forward to the next lesson with a renewed intention.` }
    ];

    const assessmentBlocks = [
        { type: "callout", content: `Assess yourself before you are assessed. Weigh your deeds before they are weighed.`, author: "Umar ibn Al-Khattab" },
        { type: "objectives", items: [`Verify comprehension of the concepts taught in ${moduleTitle}`, `Check readiness to progress to deeper topics`] },
        { type: "text", content: `## Module Synthesis\n\nYou have completed the lessons in **${moduleTitle}**. This assessment ensures you have internalized the primary theological and practical realities before moving forward.` },
        { type: "infographic", layout: "process", items: [
            { title: "Review", description: "Consolidate your notes.", icon: "BookOpen" },
            { title: "Test", description: "Answer purely from memory.", icon: "Target" },
            { title: "Progress", description: "Unlock the next stage of faith.", icon: "Unlock" }
        ]},
        { type: "quiz", question: `Which of the following is the ultimate goal of completing ${moduleTitle}?`, options: ["Gaining a certificate", "Deepening actual conviction (Yaqeen) and practice", "Finishing quickly", "None of these"], correctIndex: 1, hint: "The purpose of sacred knowledge." },
        { type: "quiz", question: "How should a student of truth act after discovering new knowledge?", options: ["Hide it entirely", "Change their life to align with it", "Ignore it", "Just post it online"], correctIndex: 1, hint: "Knowledge demands action." },
        { type: "conclusion", content: `Congratulations on finishing this module. May Allah bless the time you spent studying and elevate your rank.` }
    ];

    const targetBlocks = isAssessment ? assessmentBlocks : basicBlocks;

    // Attach IDs and Orders
    return targetBlocks.map((b, i) => {
        const block = { ...b, id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, order: i };
        if (['quran', 'hadith', 'scholar', 'reflection', 'concept'].includes(b.type)) {
            block.content = { translation: b.translation, arabic: b.arabic };
        } else if (b.type === 'quiz') {
            block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
        } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
            block.content = b.content;
            if (b.author) block.author = b.author;
        } else if (['objectives', 'infographic'].includes(b.type)) {
            block.content = { items: b.items, layout: b.layout };
        } else if (b.type === 'document') {
            block.content = { title: b.title, description: b.description, url: b.url, platform: b.platform };
        } else if (b.type === 'video') {
            block.content = { url: b.url };
        }
        return block;
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
    console.log('--- MASS PROCEDURAL SEEDING (Empty Lessons Only) ---');
    
    // 1. Fetch modules to get module titles
    const { data: modules, error: modErr } = await supabase
        .from('course_modules')
        .select('id, title, sort_order')
        .eq('course_id', COURSE_ID)
        .order('sort_order');
        
    if (modErr) return console.log('Mod Error:', modErr);
    
    // Create a map for quick title lookup
    const moduleMap = {};
    modules.forEach(m => moduleMap[m.id] = m.title);

    // 2. Fetch ALL lessons
    const { data: lessons, error: lessErr } = await supabase
        .from('course_lessons')
        .select('id, title, module_id, content_blocks')
        .eq('course_id', COURSE_ID);
        
    if (lessErr) return console.log('Les Error:', lessErr);
    
    // Filter out lessons that ALREADY have content! We only want empty ones!
    const emptyLessons = lessons.filter(l => !l.content_blocks || l.content_blocks.length === 0);
    console.log(`Found ${emptyLessons.length} totally empty lessons out of ${lessons.length} total.`);

    if (emptyLessons.length === 0) {
        console.log('Nothing left to seed! Course is completely full.');
        return;
    }

    let successCount = 0;
    
    for (let i = 0; i < emptyLessons.length; i++) {
        const lesson = emptyLessons[i];
        const moduleTitle = moduleMap[lesson.module_id] || "Islamic Faith";
        
        process.stdout.write(`Seeding [${i+1}/${emptyLessons.length}] ${lesson.title}... `);
        
        const finalBlocks = generateEliteContent(lesson.title, moduleTitle);
        
        // Retry logic for unstable network
        let retries = 3;
        let success = false;
        
        while (retries > 0 && !success) {
            try {
                const { error } = await supabase
                    .from('course_lessons')
                    .update({ content_blocks: finalBlocks })
                    .eq('id', lesson.id);
                    
                if (error) throw error;
                
                success = true;
                successCount++;
                console.log(`DONE (${finalBlocks.length} blocks)`);
            } catch (e) {
                retries--;
                if (retries === 0) {
                    console.log(`ERR: ${e.message}`);
                } else {
                    await sleep(1500);
                }
            }
        }
        
        // Add a tiny delay between requests to avoid rate limits
        await sleep(300);
    }
    
    console.log(`\n--- Mass Seeding Finished. Processed ${successCount}/${emptyLessons.length} successfully. ---`);
}

run();
