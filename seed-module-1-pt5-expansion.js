const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Signs of Strong Faith",
        blocks: [
            { type: "callout", content: "The sweetness of faith is tasted by the one who is pleased with Allah as his Lord, Islam as his religion, and Muhammad as his Messenger.", author: "Sahih Muslim" },
            { type: "objectives", items: ["Identify the internal and external markers of high Iman", "Understand the concept of 'Halawat al-Iman' (Sweetness of Faith)", "Explore the practical manifestations of unwavering trust in Allah", "Examine scholarly perspectives on spiritual resilience"] },
            { type: "text", content: "## Tasting the Sweetness of Faith\n\nIman is not just a theoretical construct; it is a tangible experience. When faith settles firmly into the heart, it produces signs, just as a healthy tree produces good fruit. The Prophet (PBUH) referred to this as 'Halawat al-Iman' (the sweetness of faith). Recognizing these signs allows a believer to measure their own spiritual health." },
            { type: "quran", translation: "True believers are those whose hearts tremble with awe when Allah is mentioned...", arabic: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ" },
            { type: "concept", translation: "Halawat al-Iman (Sweetness of Faith): A spiritual joy and tranquility that a believer feels in their heart during obedience, making hardships for the sake of Allah easy to bear.", arabic: "حلاوة الإيمان: لذة يجدها المؤمن في الطاعة، وتحمل المشاق في رضا الله" },
            { type: "infographic", layout: "grid", items: [
                { title: "Love for Allah", description: "Loving Allah and His Messenger more than anything else.", icon: "Heart" },
                { title: "Love for the Sake of Allah", description: "Loving another person solely for the sake of Allah.", icon: "Users" },
                { title: "Hatred of Disbelief", description: "Hating to return to disbelief as one would hate to be thrown into fire.", icon: "Shield" },
                { title: "Tranquility in Hardship", description: "Finding peace in the decree of Allah during trials.", icon: "Anchor" }
            ]},
            { type: "hadith", translation: "Whoever has three traits within him will taste the sweetness of faith...", arabic: "ثَلاَثٌ مَنْ كُنَّ فِيهِ وَجَدَ حَلاَوَةَ الإِيمَانِ..." },
            { type: "text", content: "### The External Manifestations\n\nStrong faith doesn't just stay inside; it leaks out into the limbs. A person with strong faith rushes to perform good deeds, delays gratification for the hereafter, and treats creation with excellence." },
            { type: "scholar", translation: "The perfection of faith is in excellent character. The best of you are those who are best to their families.", arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا" },
            { type: "reflection", translation: "If a prayer feels like a heavy burden rather than a refreshing break, it is a sign to check the roots of one's faith.", arabic: "إذا شعرت أن الصلاة عبء ثقيل وليست استراحة، فهذه علامة لتفقد جذور إيمانك." },
            { type: "infographic", layout: "process", items: [
                { title: "Sincerity (Ikhlas)", description: "Purifying intentions.", icon: "Check" },
                { title: "Consistency (Istiqamah)", description: "Steadfastness in deeds.", icon: "Activity" },
                { title: "Excellence (Ihsan)", description: "Perfecting the action.", icon: "Sparkles" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=S01Z-Yw2m3E" },
            { type: "document", title: "The Degrees of Faith", description: "An essay on the psychological states of the believers by Ibn Qayyim.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "conclusion", content: "Strong faith is visibly sweet to the beholder and spiritually sweet to the possessor. It transforms the bitter realities of life into opportunities for drawing nearer to the Divine." },
            { type: "quiz", question: "What is 'Halawat al-Iman'?", options: ["A type of required charity", "The sweetness of faith in the heart", "A physical sign on the forehead", "Reciting the Quran quickly"], correctIndex: 1, hint: "It implies tasting a spiritual joy." },
            { type: "quiz", question: "Which of the following is ONE of the three traits necessary to taste the sweetness of faith?", options: ["Having abundant wealth", "Loving Allah and His Messenger more than anything else", "Praying all night every night", "Fasting every day"], correctIndex: 1, hint: "It is about the hierarchy of love." },
            { type: "quiz", question: "How does strong faith affect one's character?", options: ["It has no effect on character", "It makes a person harsh", "The perfection of faith is excellent character", "It isolates a person from society"], correctIndex: 2, hint: "Akimlu al-Mu'mineen Imana..." },
            { type: "quiz", question: "When Allah is mentioned, how does a true believer's heart react according to the Quran?", options: ["It becomes hard", "It ignores it", "It trembles with awe", "It starts debating"], correctIndex: 2, hint: "Wajilat Qulubuhum." },
            { type: "quiz", question: "Loving someone solely for the sake of Allah is considered:", options: ["A communal obligation", "A sign of the sweetness of faith", "A cultural norm", "An innovation"], correctIndex: 1, hint: "One of the three traits in the Hadith." }
        ]
    },
    {
        title: "Causes of Weak Faith",
        blocks: [
            { type: "callout", content: "Faith wears out in the heart of any one of you just as clothes wear out, so ask Allah to renew the faith in your hearts.", author: "Al-Hakim" },
            { type: "objectives", items: ["Identify the primary causes of spiritual stagnation (Futur)", "Understand the destructive nature of persistent sins", "Recognize the impact of environment and heedlessness", "Explore actionable remedies for weak faith"] },
            { type: "text", content: "## The Erosion of the Heart\n\nJust as metal rests, the heart can undergo spiritual corrosion. Exploring the causes of weak faith is essential for the diagnosis and treatment of the soul. The state of heedlessness (Ghaflah) is often the silent killer of Iman." },
            { type: "quran", translation: "No! Rather, the stain has covered their hearts from that which they were earning.", arabic: "كَلَّا ۖ بَلْ ۜ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا يَكْسِبُونَ" },
            { type: "concept", translation: "Ghaflah (Heedlessness): A state of spiritual unawareness where one forgets Allah, the purpose of life, and the impending reality of the Hereafter.", arabic: "الغفلة: نسيان الله والآخرة والانهماك في الدنيا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Sins and Transgressions", description: "Every sin places a black dot on the heart.", icon: "AlertTriangle" },
                { title: "Bad Companionship", description: "Friends who encourage worldliness over godliness.", icon: "Users" },
                { title: "Neglecting Quran", description: "Abandoning the primary source of spiritual nourishment.", icon: "BookOpen" },
                { title: "Love of Dunya", description: "Extreme attachment to the temporary world.", icon: "Globe" }
            ]},
            { type: "hadith", translation: "When the believer commits a sin, a black spot appears on his heart. If he repents, gives it up, and seeks forgiveness, his heart is polished...", arabic: "إِنَّ الْمُؤْمِنَ إِذَا أَذْنَبَ كَانَتْ نُكْتَةٌ سَوْدَاءُ فِي قَلْبِهِ..." },
            { type: "scholar", translation: "If a person persists in minor sins, they gather and destroy him.", arabic: "إياكم ومحقرات الذنوب، فإنهن يجتمعن على الرجل حتى يهلكنه" },
            { type: "text", content: "### The Path to Renewal\n\nThe Prophet (PBUH) taught us that faith wears out like a garment. The renewal process involves repentance (Tawbah), constant remembrance (Dhikr), and seeking beneficial knowledge." },
            { type: "reflection", translation: "Look at your screen time versus your Quran time. The numbers will tell you the state of your heart.", arabic: "انظر إلى وقت شاشتك مقابل وقت القرآن. الأرقام ستخبرك بحالة قلبك." },
            { type: "infographic", layout: "process", items: [
                { title: "Tawbah", description: "Sincere repentance to clear the heart.", icon: "RefreshCw" },
                { title: "Good Deeds", description: "Following a bad deed with a good one to wipe it out.", icon: "Activity" },
                { title: "Dua", description: "Asking Allah 'Ya Muqallib al-Qulub...' (O Turner of hearts).", icon: "Heart" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Weak faith is a disease, but it is not a terminal one. With conscious effort, sincere dua, and a return to the Quran, the rusted heart can shine again." },
            { type: "quiz", question: "What covers the heart as a result of sins, according to Surah Al-Mutaffifin?", options: ["A white veil", "A stain or rust (Raan)", "A lock", "A shield"], correctIndex: 1, hint: "Raan 'ala qulubihim." },
            { type: "quiz", question: "What does the Prophet compare the wearing out of faith to?", options: ["A fading memory", "Water drying up", "Clothes wearing out", "A fire burning out"], correctIndex: 2, hint: "Just as a garment becomes threadbare." },
            { type: "quiz", question: "What happens to the heart when a believer commits a sin (and doesn't repent)?", options: ["Nothing happens", "A black spot appears", "It forgets everything", "It becomes physically painful"], correctIndex: 1, hint: "Nuktah sawda'." },
            { type: "quiz", question: "What is 'Ghaflah'?", options: ["Sincerity", "Intentional disbelief", "Heedlessness or spiritual unawareness", "Arrogance"], correctIndex: 2, hint: "Forgetting Allah and the Hereafter." },
            { type: "quiz", question: "What is an immediate action to take after committing a bad deed?", options: ["Wait until Friday to repent", "Follow it with a good deed that wipes it out", "Tell everyone about it", "Give up trying to be good"], correctIndex: 1, hint: "Atbi' as-sayyi'ah al-hasanah..." }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING LAST TWO LESSONS IN MODULE 1 ---');
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
            console.log('DONE');
        }
    }
}

seedLessons();
