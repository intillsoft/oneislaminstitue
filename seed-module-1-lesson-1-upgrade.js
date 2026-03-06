const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Definition of Iman in Qur’an and Sunnah",
        blocks: [
            { type: "callout", content: "Iman is a statement of the tongue, an action of the limbs, and a conviction of the heart; it increases with obedience and decreases with disobedience.", author: "Imam Ash-Shafi'i (Kitab al-Umm)" },
            { type: "objectives", items: ["Define Iman linguistically and technically", "Understand the three components of faith", "Analyze the dynamic nature of Iman", "Identify textual evidence from the Qur'an and Sunnah"] },
            { type: "text", content: "## The Essence of Belief\n\nLinguistically, Iman (إيمان) is derived from the root 'Amn' (أمن), which means safety, security, and tranquility. Technically, in Islamic theology, it is not merely a passive belief but a comprehensive state involving the entire human being." },
            { type: "quran", translation: "The believers are only those who, when Allah is mentioned, their hearts tremble with awe, and when His verses are recited to them, it increases them in faith; and upon their Lord they rely. (Surah Al-Anfal 8:2)", arabic: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ آيَاتُهُ زَادَتْهُمْ إِيمَانًا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ" },
            { type: "concept", translation: "Tripartite Definition of Iman: 1. Qawl al-Lisan (Tongue), 2. I'tiqad al-Janan (Heart), 3. 'Amal al-Arkan (Limbs).", arabic: "الإيمان قول وعمل واعتقاد" },
            { type: "infographic", layout: "grid", items: [
                { title: "Conviction of Heart", description: "Sincere belief and intention (Niyyah).", icon: "Heart" },
                { title: "Testimony of Tongue", description: "Declaring the Shahadah and Dhikr.", icon: "Command" },
                { title: "Action of Limbs", description: "Performing Salah, Zakat, and good deeds.", icon: "Activity" },
                { title: "Fluctuation", description: "Grows with Taqwa, shrinks with sins.", icon: "TrendingUp" }
            ]},
            { type: "text", content: "### The Interdependence of Faith\n\nScholars compare Iman to a tree: the heart is the root, the tongue is the stem, and the limbs are the branches/fruit. A tree without roots dies, and a tree without fruit is deficient." },
            { type: "hadith", translation: "Iman has over seventy branches, the highest of which is the declaration 'La ilaha illallah', and the lowest is removing an obstacle from the path. (Sahih Muslim 35)", arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً فَأَفْضَلُهَا قَوْلُ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ" },
            { type: "scholar", translation: "If a person has the core of Iman (root), they are a believer, but if they lack the fruits (actions), their faith is in grave danger of withering away. (Ibn al-Qayyim)", arabic: "الإيمان أصل وله شعب وفروع" },
            { type: "reflection", translation: "True safety (Amn) is only found when the heart is anchored in the certainty of the Divine.", arabic: "الأمن الحقيقي في طمأنينة القلب بالله" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Living Evidence\n\nThe Qur'an doesn't just ask us to believe; it shows us the anatomy of the believer. The physical trembling of the heart (Wajal) is a physiological response to a spiritual reality." },
            { type: "legal", translation: "Consensus (Ijma') of the Salaf: Action is a necessary part of the definition of Iman, not just a separate consequence.", arabic: "أجمع السلف على أن العمل من الإيمان" },
            { type: "infographic", layout: "process", items: [
                { title: "Knowledge", description: "Learning the truth about Allah.", icon: "BookOpen" },
                { title: "Certainty", description: "Removing all doubt from the heart.", icon: "Zap" },
                { title: "Submission", description: "Acting upon that knowledge.", icon: "UserCheck" }
            ]},
            { type: "conclusion", content: "Understanding this definition is critical. It prevents the error of thinking faith is just a feeling, and the error of thinking it is just a ritual. It is a unified, lived experience." },
            { type: "quiz", question: "What is the linguistic root of 'Iman'?", options: ["Rahmah (Mercy)", "Amn (Safety/Security)", "Ilm (Knowledge)", "Sabr (Patience)"], correctIndex: 1, hint: "Faith brings security to the heart." },
            { type: "quiz", question: "Which Imam defined Iman as 'statement, action, and conviction'?", options: ["Imam Malik", "Imam Ash-Shafi'i", "Imam Ahmad", "All of the above"], correctIndex: 3, hint: "This is the consensus of the major Sunni Imams." },
            { type: "quiz", question: "According to the Hadith in Sahih Muslim, how many branches does Iman have?", options: ["Five", "Three", "Over seventy", "Ninety-nine"], correctIndex: 2, hint: "Bid'un wa Sab'un." },
            { type: "quiz", question: "What happens to Iman when a person is obedient to Allah?", options: ["It stays the same", "It decreases", "It increases", "It disappears"], correctIndex: 2, hint: "Obedience nourishes faith." },
            { type: "quiz", question: "What is the 'lowest' branch of faith?", options: ["Smiling", "Removing harm from the path", "Sleeping early", "Eating moderately"], correctIndex: 1, hint: "Imatat al-Adha." },
            { type: "document", title: "The Definition of Iman", description: "A detailed academic paper on the tripartite nature of faith in Sunni Islam.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Treatise on Faith", description: "Ibn Taymiyyah's classical 'Kitab al-Iman' providing comprehensive proofs for the definition of faith.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 1 LESSON 1 TO 22 BLOCKS ---');
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
