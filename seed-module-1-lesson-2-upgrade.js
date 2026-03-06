const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Linguistic vs Technical Meaning of Faith",
        blocks: [
            { type: "callout", content: "Words are the vessels of meaning. To truly grasp faith, we must look at its linguistic ancestors and how revelation transformed them.", author: "Classical Philology Principle" },
            { type: "objectives", items: ["Differentiate between the general use of 'Iman' and its sacred designation", "Understand the root 'A-M-N' (Amn) and its connection to safety", "Analyze why Islam and Iman are sometimes used interchangeably and sometimes distinctly", "Explore the concept of 'Haqiqah Shar'iyyah' (Legal Reality)"] },
            { type: "text", content: "## Beyond Mere Belief\n\nIn everyday Arabic, 'Iman' can simply mean to believe someone or to give them security. However, when the Qur'an uses this word, it undergoes a semantic transformation into a 'Legal Reality' (Haqiqah Shar'iyyah). It becomes a specific term with specific conditions." },
            { type: "concept", translation: "Haqiqah Shar'iyyah: A term whose meaning has been defined by the Lawgiver (Allah) in a way that differs from or adds to its original linguistic meaning.", arabic: "الحقيقة الشرعية: اللفظ الذي وضعه الشارع لمعنى خاص" },
            { type: "quran", translation: "The bedouins say, 'We have believed.' Say, 'You have not [yet] believed; but say [instead], \"We have submitted,\" for faith has not yet entered your hearts.' (Surah Al-Hujurat 49:14)", arabic: "قَالَتِ الْأَعْرَابُ آمَنَّا ۖ قُل لَّمْ تُؤْمِنُوا وَلَٰكِن قُولُوا أَسْلَمْنَا وَلَمَّا يَدْخُلِ الْإِيمَانُ فِي قُلُوبِكُمْ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Linguistic Iman", description: "To believe or verify (Tasdiq).", icon: "CheckCircle" },
                { title: "Technical Iman", description: "Submission, conviction, and action.", icon: "Shield" },
                { title: "Islam (Outer)", description: "The physical acts of submission.", icon: "Activity" },
                { title: "Iman (Inner)", description: "The spiritual certainty of the heart.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Relationship: Islam vs Iman\n\nScholars have a famous rule: 'If they (Islam and Iman) are mentioned together, they differ (Islam is outer, Iman is inner). If they are mentioned alone, they include one another.' This explains why some verses use them as synonyms and others contrast them." },
            { type: "hadith", translation: "Tell me about Islam. He said: It is to testify that there is no god but Allah... Tell me about Iman. He said: It is to believe in Allah, His angels, His books... (Hadith Jibreel, Sahih Muslim 8)", arabic: "قَالَ فَأَخْبِرْنِي عَنِ الإِسْلاَمِ... قَالَ فَأَخْبِرْنِي عَنِ الإِيمَانِ..." },
            { type: "scholar", translation: "Islam is the outer garment of faith, and Iman is its inner lining. One protecting the other. (Al-Hasan al-Basri)", arabic: "الإسلام علانية والإيمان في القلب" },
            { type: "reflection", translation: "Is my submission just a series of physical movements, or has the light of Iman truly settled in my heart?", arabic: "هل إسلامي مجرد حركات، أم سكن الإيمان قلبي؟" },
            { type: "text", content: "### The Safety Component\n\nThe root 'Amn' implies that a believer is someone who finds safety in Allah and from whom others are safe. True faith produces a sense of internal security that no worldly chaos can disturb." },
            { type: "hadith", translation: "A believer is one from whom people's lives and wealth are safe. (Sunan an-Nasa'i 4998, Authentic)", arabic: "الْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ عَلَى دِمَائِهِمْ وَأَمْوَالِهِمْ" },
            { type: "legal", translation: "The Rule of Conjunction: When Islam and Iman appear in the same context, Islam = Pillars, Iman = Articles of Faith.", arabic: "إذا اجتمعا افترقا، وإذا افترقا اجتمعا" },
            { type: "infographic", layout: "process", items: [
                { title: "Amn (Safety)", description: "The linguistic root.", icon: "Lock" },
                { title: "Tasdiq (Verification)", description: "The mental acceptance.", icon: "Search" },
                { title: "Inqiyad (Submission)", description: "The total surrender.", icon: "UserCheck" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "By understanding these nuances, we avoid being superficial in our faith. We realize that 'Muslim' is a starting point, and 'Mu'min' is the depth we strive for." },
            { type: "quiz", question: "What does 'Amn', the root of Iman, mean?", options: ["Knowledge", "Safety and Security", "Power", "Love"], correctIndex: 1, hint: "A believer is secure in their heart." },
            { type: "quiz", question: "According to Surah Al-Hujurat 49:14, what did Allah tell the bedouins who claimed they had 'believed'?", options: ["You are correct", "Say instead 'We have submitted' (Islam)", "You are hypocrites", "Go back home"], correctIndex: 1, hint: "Faith had not yet entered their hearts." },
            { type: "quiz", question: "What is the scholarly rule about 'Islam' and 'Iman'?", options: ["They are always different", "They are always the same", "If mentioned together they differ; alone they include each other", "They have no relationship"], correctIndex: 2, hint: "Idha ijtama'a iftaraqa..." },
            { type: "quiz", question: "In the Technical sense, Iman requires:", options: ["Only mental belief", "Only physical actions", "Conviction, Speech, and Action", "Only a good heart"], correctIndex: 2, hint: "It's the tripartite definition." },
            { type: "quiz", question: "What is a 'Haqiqah Shar'iyyah'?", options: ["A scientific fact", "A linguistic metaphor", "A terminalogically defined term by Divine Revelation", "A historical event"], correctIndex: 2, hint: "Specialized religious vocabulary." },
            { type: "document", title: "Islam and Iman: Semantic Study", description: "An in-depth study on the linguistic evolution of 'Faith' in early Islamic texts.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Bedouin Faith", description: "Commentary on Surah Al-Hujurat and the differentiation between Islam and Iman.", url: "https://quran.com/", platform: "Tafsir Archives" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 1 LESSON 2 TO 23 BLOCKS ---');
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
