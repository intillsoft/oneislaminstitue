const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Causes of Weak Faith", // Existing title
        blocks: [
            { type: "callout", content: "Faith wears out in the heart of any one of you just as clothes wear out, so ask Allah to renew the faith in your hearts.", author: "Prophet Muhammad (PBUH)" },
            { type: "objectives", items: ["Identify the internal and external psychological causes of Futur (spiritual stagnation)", "Understand the destructive nature of persistent minor sins", "Recognize the impact of environment and heedlessness", "Explore actionable remedies for weak faith"] },
            { type: "text", content: "## Extinguishing the Flame\n\nJust as a flame requires oxygen and wood, Iman requires remembrance and good deeds. When the heart is deprived of its spiritual oxygen, it undergoes 'Futur'—a dangerous period of stagnation or decline. Understanding *why* faith drops is the first step in spiritual medicine." },
            { type: "quran", translation: "Has the time not come for those who have believed that their hearts should become humbly submissive at the remembrance of Allah?", arabic: "أَلَمْ يَأْنِ لِلَّذِينَ آمَنُوا أَن تَخْشَعَ قُلُوبُهُمْ لِذِكْرِ اللَّهِ" },
            { type: "concept", translation: "Ghaflah (Heedlessness): A state of spiritual unawareness where one forgets Allah, the ultimate purpose of life, and the impending reality of the Hereafter.", arabic: "الغفلة: نسيان الله والآخرة والانهماك في الدنيا" },
            { type: "text", content: "### The Rust on the Mirror\n\nThe Prophet (PBUH) described the heart as a mirror. Every sin places a dark spot upon it. If unchecked, this rust (Raan) prevents the heart from reflecting the light of truth." },
            { type: "infographic", layout: "process", items: [
                { title: "Stage 1: Committing Sin", description: "The initial act of disobedience.", icon: "AlertTriangle" },
                { title: "Stage 2: The Dark Spot", description: "A subtle stain appears on the spiritual heart.", icon: "Eye" },
                { title: "Stage 3: The Gathering", description: "If repentance is delayed, the spots merge.", icon: "Grid3X3" },
                { title: "Stage 4: The Seal (Khatm)", description: "The heart becomes completely rusted and unable to recognize truth.", icon: "Lock" }
            ]},
            { type: "hadith", translation: "When the believer commits a sin, a black spot appears on his heart. If he repents, gives it up, and seeks forgiveness, his heart is polished...", arabic: "إِنَّ الْمُؤْمِنَ إِذَا أَذْنَبَ كَانَتْ نُكْتَةٌ سَوْدَاءُ فِي قَلْبِهِ..." },
            { type: "scholar", translation: "Beware of minor sins, for they gather upon a person until they destroy him.", arabic: "إياكم ومحقرات الذنوب، فإنهن يجتمعن على الرجل حتى يهلكنه" },
            { type: "reflection", translation: "Your environment acts as a passive spiritual force. If you are surrounded by people who do not remind you of Allah, you are swimming against the current alone.", arabic: "بيئتك تعمل كقوة روحية كامنة. إذا كنت محاطًا بمن لا يذكرونك بالله، فأنت تسبح ضد التيار بمفردك." },
            { type: "infographic", layout: "grid", items: [
                { title: "Bad Companionship", description: "Friends who encourage worldliness.", icon: "Users" },
                { title: "Neglecting Quran", description: "Abandoning the primary source of nourishment.", icon: "BookOpen" },
                { title: "Love of Dunya", description: "Extreme attachment to temporary status or wealth.", icon: "Globe" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Weak faith is a universal human experience, but complacency in that state is a choice. We must aggressively combat the rust." },
            { type: "quiz", question: "What does the Quran call the 'rust' or 'stain' that covers the heart due to sins?", options: ["Raan", "Khushu", "Nifaq", "Ghaflah"], correctIndex: 0, hint: "See the Quran block." },
            { type: "quiz", question: "What is the consequence of leaving minor sins unchecked?", options: ["They eventually disappear", "They gather and can destroy a person", "They turn into major sins automatically", "They don't affect faith"], correctIndex: 1, hint: "Look at the scholarly quote." },
            { type: "quiz", question: "According to the Hadith, what polishes the heart after a sin?", options: ["Sleeping", "Repenting and seeking forgiveness", "Donating all wealth", "Fasting for a month"], correctIndex: 1, hint: "Tawbah polishes the mirror." },
            { type: "quiz", question: "What is 'Ghaflah'?", options: ["Arrogance", "Spiritual Heedlessness", "Hypocrisy", "Greed"], correctIndex: 1, hint: "Forgetting the Hereafter." },
            { type: "quiz", question: "Which Surah asks: 'Has the time not come for those who have believed that their hearts should become humbly submissive?'", options: ["Al-Hadid", "Al-Baqarah", "Yasin", "Al-Mulk"], correctIndex: 0, hint: "The Chapter of Iron." }
        ]
    },
    {
        title: "Protecting the Heart from Doubts", // Will rename "New Lesson" to this
        targetOriginalTitle: "New Lesson", 
        blocks: [
            { type: "callout", content: "Intellectual doubts (Shubuhat) and carnal desires (Shahawat) are the two primary thieves of the road to Allah.", author: "Ibn Qayyim" },
            { type: "objectives", items: ["Understand the difference between Shubuhat (intellectual doubts) and Shahawat (base desires)", "Learn the concept of 'Certainty' (Yaqeen)", "Build intellectual defenses against modern skepticism", "Recognize why questioning is natural but lingering in doubt is perilous"] },
            { type: "text", content: "## The Architecture of Doubt\n\nIn the modern age, a believer's faith is not primarily attacked physically, but intellectually and philosophically. Doubts (Shubuhat) are like viruses; if the spiritual immune system is compromised, they can take hold and severely damage a person's Yaqeen (certainty)." },
            { type: "concept", translation: "Yaqeen (Certainty): Firm, unwavering conviction in the truths of Islam, free from any element of doubt or hesitation.", arabic: "اليقين: سكون القلب وثباته على عقيدة حق لا ريب فيها" },
            { type: "infographic", layout: "grid", items: [
                { title: "Shubuhat (Doubts)", description: "Attacks on the intellect. Cured by Knowledge (Ilm).", icon: "Brain" },
                { title: "Shahawat (Desires)", description: "Attacks on the physical appetites. Cured by Patience (Sabr).", icon: "Activity" },
                { title: "Wiswas (Whispers)", description: "Random intrusive thoughts. Cured by seeking refuge (Isti'adhah).", icon: "Shield" }
            ]},
            { type: "quran", translation: "And they say, 'There is not but our worldly life; we die and live, and nothing destroys us except time.' And they have of that no knowledge; they are only assuming.", arabic: "وَقَالُوا مَا هِيَ إِلَّا حَيَاتُنَا الدُّنْيَا نَمُوتُ وَنَحْيَا وَمَا يُهْلِكُنَا إِلَّا الدَّهْرُ ۚ وَمَا لَهُم بِذَٰلِكَ مِنْ عِلْمٍ ۖ إِنْ هُمْ إِلَّا يَظُنُّونَ" },
            { type: "scholar", translation: "The heart should not be made like a sponge, absorbing every doubt that passes by. Rather, make it like a solid glass vessel; doubts pass over its exterior but do not penetrate it.", arabic: "لا تجعل قلبك للإيرادات والشبهات مثل الإسفنجة... بل اجعله كالزجاجة المصمتة" },
            { type: "text", content: "### Dealing with Intrusive Thoughts\n\nThe Companions came to the Prophet (PBUH) complaining of thoughts they considered too horrific to speak aloud. Instead of condemning them, the Prophet celebrated their concern." },
            { type: "hadith", translation: "Some of the companions said: 'We find in ourselves thoughts that are too terrible to speak of.' He said: 'Are you really having such thoughts?' They said: 'Yes.' He said: 'That is clear faith.'", arabic: "ذَاكَ صَرِيحُ الإِيمَانِ" },
            { type: "reflection", translation: "A thief does not break into an empty house. Shaytan attacks your heart with whispers precisely because it contains the incredibly valuable treasure of Iman.", arabic: "اللص لا يقتحم بيتًا فارغًا. الشيطان يهاجم قلبك لأنه يحتوي على كنز الإيمان." },
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "Doubt is a storm. Let your roots of knowledge be deep, and the winds will only sway branches, not uproot the tree." },
            { type: "quiz", question: "What is the Arabic term for intellectual doubts?", options: ["Shahawat", "Yaqeen", "Shubuhat", "Futur"], correctIndex: 2, hint: "Things that are unclear or ambiguous." },
            { type: "quiz", question: "According to Ibn Taymiyyah/Ibn Qayyim, what cures 'Shubuhat'?", options: ["Patience (Sabr)", "Knowledge (Ilm)", "Fasting", "Ignoring them"], correctIndex: 1, hint: "A disease of the mind requires an intellectual cure." },
            { type: "quiz", question: "When the companions complained about intrusive thoughts, the Prophet (PBUH) called it:", options: ["Clear hypocrisy", "A sign of a weak mind", "Clear faith", "A temporary illness"], correctIndex: 2, hint: "Sareeh al-Iman." },
            { type: "quiz", question: "What does 'Yaqeen' mean?", options: ["Doubt", "Certainty", "Hope", "Fear"], correctIndex: 1, hint: "Firm, unwavering conviction." },
            { type: "quiz", question: "How did Ibn Taymiyyah say we should treat our hearts when exposed to doubts?", options: ["Like a sponge", "Like a shield", "Like a solid glass vessel", "Like a sword"], correctIndex: 2, hint: "So you can see the doubt, but it stays outside." }
        ]
    },
    {
        title: "Module 1 Synthesis & Knowledge Check", // Will rename "Weekly Knowledge Check" to this
        targetOriginalTitle: "Weekly Knowledge Check",
        blocks: [
            { type: "callout", content: "Knowledge without action is arrogance, and action without knowledge is misguidance.", author: "Al-Ghazali" },
            { type: "objectives", items: ["Synthesize the key themes of Module 1: Iman, Islam, Ihsan", "Demonstrate comprehensive understanding of the orthodox Islamic creed", "Self-assess spiritual readiness before advancing to Tawheed"] },
            { type: "text", content: "## The Foundation is Laid\n\nYou have traversed the fundamental landscape of Islamic belief. We have established that Iman is not a passive noun, but an active, breathing reality. It requires the *assent of the heart*, the *testimony of the tongue*, and the *compliance of the limbs*. It fluctuates based on our proximity to the Divine." },
            { type: "infographic", layout: "process", items: [
                { title: "The Definition", description: "Iman is belief, speech, and action.", icon: "BookOpen" },
                { title: "The Structure", description: "Islam (Outer), Iman (Inner), Ihsan (Excellence).", icon: "Grid3X3" },
                { title: "The Fluctuation", description: "Increases with obedience, decreases with sin.", icon: "Activity" },
                { title: "The Preservation", description: "Protecting the heart from Shubuhat (doubts) and Ghaflah (heedlessness).", icon: "Shield" }
            ]},
            { type: "reflection", translation: "Before stepping into the profound study of Tawheed, pause. Is your heart ready to receive the magnitude of knowing Allah?", arabic: "قبل الخوض في دراسة التوحيد العميقة، توقف. هل قلبك مستعد لتلقي عظمة معرفة الله؟" },
            { type: "legal", translation: "Consensus (Ijma) of Ahl al-Sunnah: Iman is dynamic, and actions are integral to its constitution.", arabic: "إجماع أهل السنة: الإيمان يزيد وينقص، والعمل جزء منه" },
            { type: "document", title: "Module 1 Comprehensive Map", description: "Review the key terms and Hadiths covered in this foundational module.", url: "https://yaqeeninstitute.org/", platform: "Course Materials" },
            { type: "conclusion", content: "You have verified your scholarship concerning the architecture of belief. Now, prove your mastery in the final assessment." },
            { type: "quiz", question: "If a person claims belief purely in their heart but absolutely refuses to pray, fast, or act outwardly, what occurs according to Sunni theology?", options: ["Their faith is perfect", "Their faith is incomplete/deficient, and possibly invalid depending on the action", "They are angels", "Faith only requires the heart"], correctIndex: 1, hint: "Actions are a necessary component of Iman." },
            { type: "quiz", question: "Which level of religion involves 'worshipping Allah as if you see Him'?", options: ["Islam", "Iman", "Ihsan", "Tawbah"], correctIndex: 2, hint: "The highest pinnacle." },
            { type: "quiz", question: "What is the primary spiritual cure for a heart suffering from 'Ghaflah' (Heedlessness)?", options: ["Arguing with atheists", "Dhikr (Remembrance) and Tawbah", "Gaining more wealth", "Changing a career"], correctIndex: 1, hint: "Connecting back to Allah." },
            { type: "quiz", question: "The Murji'ah sect deviated by claiming:", options: ["Allah has a body", "Actions are disconnected from Iman", "Fate does not exist", "There is no hereafter"], correctIndex: 1, hint: "Separating outer from inner." },
            { type: "quiz", question: "Ultimately, when one tastes 'Halawat al-Iman' (the sweetness of faith), obedience becomes:", options: ["A difficult burden", "A source of joy and ease", "A means to show off", "Irrelevant"], correctIndex: 1, hint: "It transforms hardship into pleasure." }
        ]
    }
];

async function seedLessons() {
    console.log('--- MASSIVE OVERHAUL OF LAST 3 LESSONS IN MODULE 1 ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}`, order: i };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                block.content = { translation: b.translation, arabic: b.arabic };
            } else if (b.type === 'quiz') {
                block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
            } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
                block.content = b.content;
                block.author = b.author;
            } else if (['objectives', 'infographic'].includes(b.type)) {
                block.content = { items: b.items, layout: b.layout };
            } else if (b.type === 'document') {
                block.content = { title: b.title, description: b.description, url: b.url, platform: b.platform };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        // First find the lesson we want to replace
        const searchTitle = item.targetOriginalTitle || item.title;
        const { data: existingLessons, error: err } = await supabase.from('course_lessons').select('id')
            .eq('course_id', COURSE_ID).ilike('title', `%${searchTitle}%`);
            
        if (err || !existingLessons || existingLessons.length === 0) {
            console.log('SKIPPED (Not found: ' + searchTitle + ')');
            continue;
        }

        const targetId = existingLessons[0].id;
        
        // Update both its content and its TITLE to match the shiny new structure
        const { error: updErr } = await supabase.from('course_lessons').update({ 
            title: item.title,
            content_blocks: finalBlocks 
        }).eq('id', targetId);
        
        if (updErr) {
            console.log('ERR: ' + updErr.message);
        } else {
            console.log('DONE (15+ Blocks Seeded)');
        }
    }
}

seedLessons();
