const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Protecting the Heart from Doubts",
        blocks: [
            { type: "callout", content: "Intellectual doubts (Shubuhat) and carnal desires (Shahawat) are the two primary thieves of the road to Allah.", author: "Ibn Qayyim (Ighaathat al-Lahfaan)" },
            { type: "objectives", items: ["Understand the difference between Shubuhat (doubts) and Shahawat (desires)", "Learn the concept of 'Certainty' (Yaqeen)", "Build intellectual defenses against modern skepticism", "Recognize why questioning is natural but lingering in doubt is perilous", "Identify the Islamic approach to intrusive thoughts"] },
            { type: "text", content: "## The Architecture of Doubt\n\nIn the modern age, a believer's faith is not primarily attacked physically, but intellectually and philosophically. Doubts (Shubuhat) are like viruses; if the spiritual immune system is compromised, they can take hold and severely damage a person's faith." },
            { type: "concept", translation: "Yaqeen (Certainty): Firm, unwavering conviction in the truths of Islam, free from any element of doubt or hesitation.", arabic: "اليقين: سكون القلب وثباته على عقيدة حق لا ريب فيها" },
            { type: "infographic", layout: "grid", items: [
                { title: "Shubuhat (Doubts)", description: "Attacks on the intellect. Cured by Knowledge (Ilm).", icon: "Brain" },
                { title: "Shahawat (Desires)", description: "Attacks on the physical appetites. Cured by Patience (Sabr).", icon: "Activity" },
                { title: "Wiswas (Whispers)", description: "Random intrusive thoughts. Cured by seeking refuge (Isti'adhah).", icon: "Shield" },
                { title: "Sakinah", description: "The divine tranquility that displaces doubt.", icon: "Sun" }
            ]},
            { type: "quran", translation: "And they say, 'There is not but our worldly life; we die and live, and nothing destroys us except time.' And they have of that no knowledge; they are only assuming. (Surah Al-Jathiyah 45:24)", arabic: "وَقَالُوا مَا هِيَ إِلَّا حَيَاتُنَا الدُّنْيَا نَمُوتُ وَنَحْيَا وَمَا يُهْلِكُنَا إِلَّا الدَّهْرُ" },
            { type: "scholar", translation: "The heart should not be made like a sponge, absorbing every doubt that passes by. Rather, make it like a solid glass vessel; doubts pass over its exterior but do not penetrate it. (Ibn Taymiyyah)", arabic: "لا تجعل قلبك للإيرادات والشبهات مثل الإسفنجة" },
            { type: "text", content: "### Dealing with Intrusive Thoughts\n\nThe Companions came to the Prophet (PBUH) complaining of thoughts they considered too horrific to speak aloud. Instead of condemning them, the Prophet celebrated their concern, calling it 'clear faith'." },
            { type: "hadith", translation: "Some of the companions said: 'We find in ourselves thoughts that are too terrible to speak of.' He said: 'Are you really having such thoughts?' They said: 'Yes.' He said: 'That is clear faith.' (Sahih Muslim 132)", arabic: "ذَاكَ صَرِيحُ الإِيمَانِ" },
            { type: "infographic", layout: "process", items: [
                { title: "Identify", description: "Recognize the doubt as external whispers.", icon: "Eye" },
                { title: "Refuge", description: "Seek refuge in Allah (A'udhu billahi...).", icon: "Shield" },
                { title: "Knowledge", description: "Ask the people of knowledge if you do not know.", icon: "BookOpen" }
            ]},
            { type: "text", content: "### The Thief in the House\n\nA beautiful reflection from the scholars: A thief does not break into an empty house. Shaytan attacks your heart with whispers precisely because it contains the treasure of Iman." },
            { type: "reflection", translation: "Doubt is often the beginning of a deeper journey into certainty, provided it is met with sincere seeking rather than arrogant skepticism.", arabic: "الشبهة ريح عابرة، واليقين جبل راسخ" },
            { type: "hadith", translation: "Allah has forgiven my Ummah for the intrusive thoughts that cross their minds, as long as they do not act on them or speak of them. (Sahih al-Bukhari 5269)", arabic: "إِنَّ اللَّهَ تَجَاوَزَ لِأُمَّتِي عَمَّا وَسْوَسَتْ بِهِ صُدُورُهَا" },
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "Protect your heart by filling it with the light of knowledge. A darkened room is easily filled with shadows, but shadows cannot exist where there is a lamp." },
            { type: "quiz", question: "What is the Arabic term for intellectual doubts?", options: ["Shahawat", "Yaqeen", "Shubuhat", "Futur"], correctIndex: 2, hint: "Things that are ambiguous or confusing." },
            { type: "quiz", question: "According to Ibn Taymiyyah, how should we treat our hearts when exposed to doubts?", options: ["Like a sponge", "Like a solid glass vessel", "Like a shield", "Like a sword"], correctIndex: 1, hint: "View the doubt but don't absorb it." },
            { type: "quiz", question: "When the companions complained about scary intrusive thoughts, the Prophet (PBUH) called it:", options: ["Clear hypocrisy", "Clear faith", "Indication of mental illness", "Irrelevant"], correctIndex: 1, hint: "Dhakka Sareeh al-Iman." },
            { type: "quiz", question: "What is the cure for 'Shahawat' (desires)?", options: ["Logic", "Patience (Sabr)", "Arguing", "Sleeping"], correctIndex: 1, hint: "Base desires are met with self-restraint." },
            { type: "quiz", question: "What does 'Yaqeen' mean?", options: ["Doubt", "Certainty", "Hope", "Fear"], correctIndex: 1, hint: "Unwavering conviction." },
            { type: "document", title: "Dealing with Doubts", description: "A systematic approach to handling modern intellectual challenges to faith.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Intrusive Thoughts in Islam", description: "A spiritual and psychological guide to handling Waswas.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Module 1 Synthesis & Knowledge Check",
        blocks: [
            { type: "callout", content: "Knowledge without action is madness, and action without knowledge is vanity.", author: "Imam Al-Ghazali (Ayyuha al-Walad)" },
            { type: "objectives", items: ["Synthesize the key themes of Module 1: Iman, Islam, Ihsan", "Demonstrate comprehensive understanding of the orthodox Islamic creed", "Reflect on the practical impact of faith on your daily life", "Self-assess spiritual readiness before advancing to Tawheed"] },
            { type: "text", content: "## The Foundation is Laid\n\nYou have traversed the fundamental landscape of Islamic belief. We have established that Iman is not a passive state but an active, breathing reality. It requires the *assent of the heart*, the *testimony of the tongue*, and the *compliance of the limbs*." },
            { type: "infographic", layout: "process", items: [
                { title: "Definition", description: "Iman is belief, speech, and action.", icon: "BookOpen" },
                { title: "Structure", description: "Islam (Outer), Iman (Inner), Ihsan (Excellence).", icon: "Grid3X3" },
                { title: "Fluctuation", description: "Increases with obedience, decreases with sin.", icon: "Activity" },
                { title: "Preservation", description: "Protecting the heart from doubts and desires.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Big Picture\n\nModule 1 served as the bedrock. Without a clear understanding of what faith *is* and how it *works*, the subsequent study of Allah's Oneness (Tawheed) or Attributes (Sifat) remains dry and theoretical. Faith is the lens through which you see the world." },
            { type: "quran", translation: "Indeed, those who have believed and done righteous deeds - their Lord will guide them because of their faith. (Surah Yunus 10:9)", arabic: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ يَهْدِيهِمْ رَبُّهُم بِإِيمَانِهِمْ" },
            { type: "scholar", translation: "If a person's faith is sound, their entire life follows suit. If the heart is healthy, the body is healthy. (Prophetic Maxim translated by scholars)", arabic: "إذا صلح القلب صلح الجسد كله" },
            { type: "reflection", translation: "Before stepping into the deep study of Tawheed, ask yourself: Have I internalized that my faith is a dynamic, living trust that I must nurture every day?", arabic: "هل استقر الإيمان في قلبي حقيقة؟" },
            { type: "infographic", layout: "grid", items: [
                { title: "Level 1: Islam", description: "Submission of the limbs.", icon: "Lock" },
                { title: "Level 2: Iman", description: "Cerainty of the heart.", icon: "Zap" },
                { title: "Level 3: Ihsan", description: "Excellence in worship.", icon: "Sparkles" },
                { title: "The Result", description: "Peace in this life and the next.", icon: "Check" }
            ]},
            { type: "hadith", translation: "The most beloved of deeds to Allah are those that are consistent, even if they are small. (Sahih al-Bukhari 6465)", arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ" },
            { type: "text", content: "### Final Review Assessment\n\nThis assessment tests your grasp of the core definitions, the proofs for the fluctuation of faith, and the essential boundaries of Islamic monotheism established in this module." },
            { type: "conclusion", content: "You have verified your scholarship concerning the architecture of belief. Now, prove your mastery in the final assessment before we begin the study of the One whom you believe in." },
            { type: "quiz", question: "If a person claims belief purely in their heart but absolutely refuses to pray or act outwardly, what occurs according to Sunni theology?", options: ["Their faith is perfect", "Their faith is incomplete/deficient, and potentially invalid", "They are angels", "Faith only requires the heart"], correctIndex: 1, hint: "Actions are an integral branch of faith." },
            { type: "quiz", question: "Which level of religion involves 'worshipping Allah as if you see Him'?", options: ["Islam", "Iman", "Ihsan", "Tawbah"], correctIndex: 2, hint: "The highest pinnacle." },
            { type: "quiz", question: "What is the primary spiritual cure for a heart suffering from 'Ghaflah' (Heedlessness)?", options: ["Arguing with people", "Dhikr (Remembrance) and Quran", "Gaining more wealth", "Changing a career"], correctIndex: 1, hint: "Connecting back to the Source." },
            { type: "quiz", question: "The Murji'ah sect deviated by claiming:", options: ["Allah has partners", "Actions are disconnected from Iman", "Fate does not exist", "There is no hereafter"], correctIndex: 1, hint: "They separated behavior from belief." },
            { type: "quiz", question: "Ultimately, when one tastes 'Halawat al-Iman' (the sweetness of faith), obedience becomes:", options: ["A difficult burden", "A source of joy and ease", "A means to show off", "Irrelevant"], correctIndex: 1, hint: "It transforms hardship into pleasure." },
            { type: "quiz", question: "How does Iman 'wear out' according to the Hadith?", options: ["It doesn't", "Like clothes wearing out", "Like a batteries dying", "Like a tree growing old"], correctIndex: 1, hint: "Fa-as'alu Allah an yujaddida al-Iman." },
            { type: "document", title: "Module 1 Comprehensive Map", description: "A visual map of all the definitions and relationships covered in this module.", url: "https://yaqeeninstitute.org/", platform: "Course Materials" },
            { type: "document", title: "The Heart's Journey", description: "Imam Ibn al-Qayyim's steps to spiritual perfection.", url: "https://kalamullah.com/", platform: "Classical Archives" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 1 LESSON 7 & 8 TO 22+ BLOCKS ---');
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

        const { error } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title}%`);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE (${finalBlocks.length} Blocks Seeded)`);
        }
    }
}

seedLessons();
