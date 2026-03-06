const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Relationship Between Belief and Action",
        blocks: [
            { type: "callout", content: "Action is a part of Iman, not just a result of it. A tree is not just its roots, and it is not just its fruit; it is the organic unity of both.", author: "Imam Ahmad ibn Hanbal (Ar-Radd 'ala al-Jahmiyyah)" },
            { type: "objectives", items: ["Understand how actions are structurally integrated into faith", "Identify the error of the Murji'ah (separating action from faith)", "Analyze Quranic verses that link 'those who believe' with 'those who do good'", "Explore the 'Branches of Faith' and their practical significance"] },
            { type: "text", content: "## The Inseparable Twins\n\nA common misconception is that Iman is purely an internal feeling, and actions are merely 'extra' or optional manifestations. In the Sunni paradigm, actions are an *essential component* of the very definition of faith. One cannot exist in a healthy state without the other." },
            { type: "quran", translation: "By time! Indeed, mankind is in loss. Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience. (Surah Al-Asr 103:1-3)", arabic: "وَالْعَصْرِ ۞ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۞ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ" },
            { type: "concept", translation: "Inseparability of Faith (Tasdiq) and Action ('Amal): The heart's conviction is the engine, and the limbs' actions are the movement. If the engine is truly running, the car must move.", arabic: "ارتباط الإيمان بالعمل" },
            { type: "infographic", layout: "process", items: [
                { title: "Inward Conviction", description: "The silent acknowledgment of truth.", icon: "Heart" },
                { title: "Outward Testimony", description: "The verbal confirmation.", icon: "MessageCircle" },
                { title: "Practical Application", description: "The physical verification of belief.", icon: "Activity" }
            ]},
            { type: "text", content: "### The Branches of Faith\n\nThe Prophet (PBUH) described Iman as having many branches. This imagery suggests that while faith has a core, it also has varying depths and diverse expressions ranging from ritual worship to social ethics." },
            { type: "hadith", translation: "Faith has over seventy branches... the most excellent of which is the declaration 'La ilaha illallah', and the humblest of which is the removal of harm from the path; and modesty (Haya') is a branch of faith. (Sahih Muslim 35)", arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً... وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ وَالْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ" },
            { type: "scholar", translation: "Whoever removes action from Iman is a Murji' (follower of the Murji'ah), and whoever claims action alone is the entirety of Iman is a Khariji. The middle path is the path of the Sunnah. (Sufyan al-Thawri)", arabic: "الإيمان قول وعمل" },
            { type: "infographic", layout: "grid", items: [
                { title: "Ritual Actions", description: "Salah, Siyam, Hajj.", icon: "Users" },
                { title: "Ethical Actions", description: "Honesty, keeping promises.", icon: "CheckSquare" },
                { title: "Social Actions", description: "Removing harm, helping neighbors.", icon: "Heart" },
                { title: "Spiritual Actions", description: "Tawakkul, Sabr, Shukr.", icon: "Sunrise" }
            ]},
            { type: "text", content: "### The Error of Irja' (Separation)\n\nThe sect known as the Murji'ah claimed that actions have no bearing on the status of faith. They argued that if one believes in their heart, they are a 'perfect believer' regardless of their sins. The Sunnah strictly refutes this, emphasizing that sins weaken faith and can lead to its destruction." },
            { type: "quran", translation: "And they say, 'We have believed in Allah and in the Messenger, and we obey'; then a party of them turns away after that. And those are not believers. (Surah An-Nur 24:47)", arabic: "وَيَقُولُونَ آمَنَّا بِاللَّهِ وَبِالرَّسُولِ وَأَطَعْنَا ثُمَّ يَتَوَلَّىٰ فَرِيقٌ مِّنْهُم مِّن بَعْدِ ذَٰلِكَ ۚ وَمَا أُولَٰئِكَ بِالْمُؤْمِنِينَ" },
            { type: "reflection", translation: "If my heart truly loves Allah, why is it so difficult for my limbs to move in His service?", arabic: "لو صدقت المحبة لأطاع المحب محبوبه" },
            { type: "hadith", translation: "None of you truly believes until his desires are in accordance with what I have brought. (Al-Arba'in an-Nawawiyyah, Hadith 41 - Hasan)", arabic: "لا يؤمن أحدكم حتى يكون هواه تبعا لما جئت به" },
            { type: "legal", translation: "The Nullifiers of Faith: Just as actions can build faith, certain actions (like worshipping idols) can entirely nullify the core conviction of the heart.", arabic: "نواقض الإيمان" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "Faith and action are two sides of the same coin. A believer strives for internal sincerity that manifests as external excellence (Ihsan)." },
            { type: "quiz", question: "Which Surah famously links success to 'believing and doing righteous deeds' by mentioning loss for all others?", options: ["Surah Al-Fatiha", "Surah At-Tin", "Surah Al-Asr", "Surah Al-Mulk"], correctIndex: 2, hint: "Wal-Asr..." },
            { type: "quiz", question: "What was the main error of the 'Murji'ah' sect?", options: ["They believed in many gods", "They separated actions from the definition of faith", "They denied the existence of angels", "They claimed faith is only for scholars"], correctIndex: 1, hint: "They 'postponed' or separated action." },
            { type: "quiz", question: "According to the Hadith, 'Modesty' (Haya') is:", options: ["A cultural trait", "A branch of faith", "A sign of weakness", "Unnecessary for men"], correctIndex: 1, hint: "Al-Haya'u Shu'batun min al-Iman." },
            { type: "quiz", question: "If Iman is a tree, what are the actions?", options: ["The roots", "The soil", "The branches and fruit", "The water"], correctIndex: 2, hint: "They are the visible growth." },
            { type: "quiz", question: "What happens to the status of a believer who claims faith but persistently turns away from all obedience?", options: ["Their faith is perfect", "Their faith is deficient/in danger", "They are automatically a saint", "Nothing"], correctIndex: 1, hint: "See the verse from Surah An-Nur." },
            { type: "document", title: "Action as a Pillar of Faith", description: "Scholarly analysis of the 'Murji'ah' controversy and the Sunni response.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The 77 Branches of Faith", description: "Imam al-Bayhaqi's comprehensive list of how faith manifests in every area of life.", url: "https://sunnah.com/", platform: "Classical Collections" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 1 LESSON 3 TO 24 BLOCKS ---');
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
