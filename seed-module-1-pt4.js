const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Definition of Iman in Qur'an and Sunnah",
        blocks: [
            { type: "callout", content: "Iman in the Quran is not merely an intellectual exercise; it is an active, lived reality.", author: "Ibn Qayyim" },
            { type: "objectives", items: ["Understand how Allah defines true believers in the Quran", "Analyze the physical attributes associated with Iman", "Examine Prophetic traditions clarifying faith"] },
            { type: "text", content: "## A Living Faith\n\nThe Qur'an consistently defines Iman not merely by what is believed in the mind, but by how the heart reacts and the limbs perform. A defining characteristic of the believer is their dynamic response to the remembrance of Allah." },
            { type: "quran", translation: "Successful indeed are the believers: those who offer their Salat (prayers) with all solemnity and full submissiveness.", arabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ" },
            { type: "concept", translation: "Khushu' (Submissiveness): The quietness of the heart and stillness of the limbs in the presence of the Divine.", arabic: "الخشوع: خضوع القلب وسكون الجوارح" },
            { type: "hadith", translation: "By Him in whose hand is my soul, no one of you truly believes until I am dearer to him than his father, his child, and all mankind.", arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Trembling Hearts", description: "When Allah is mentioned.", icon: "Heart" },
                { title: "Increased Faith", description: "When His verses are recited.", icon: "BookOpen" },
                { title: "Total Reliance", description: "Upon their Lord they trust (Tawakkul).", icon: "Shield" },
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "To claim faith is easy. The Qur'an sets the standard of what true, verified faith looks like in practice." },
            { type: "quiz", question: "Which Surah begins heavily detailing the attributes of the successful believers?", options: ["Al-Fatiha", "Al-Mu'minun", "Al-Mulk", "Al-Nas"], correctIndex: 1, hint: "'Successful indeed are the believers...'" },
            { type: "quiz", question: "What physical reaction is associated with true believers in Surah Al-Anfal?", options: ["They sleep heavily", "Their hearts tremble when Allah is mentioned", "They become angry", "They close their eyes"], correctIndex: 1, hint: "Awe and reverence." },
            { type: "quiz", question: "In the Hadith of love, a believer must love the Prophet more than:", options: ["His wealth", "His status", "His father, child, and all mankind", "The angels"], correctIndex: 2, hint: "More than all worldly attachments." }
        ]
    },
    {
        title: "Relationship Between Belief and Action",
        blocks: [
            { type: "callout", content: "Action is a part of Iman, not just a result of it.", author: "Imam Ahmad" },
            { type: "objectives", items: ["Dispel the notion that actions are separate from Iman (the Murji'ah error)", "Understand the integration of inward and outward", "Explore 'branches of faith'"] },
            { type: "text", content: "## Inseparable Twins\n\nA critical deviation that historically arose was the separation of actions from the core of faith. Ahl al-Sunnah established that one's outer actions confirm and form a part of their inner reality." },
            { type: "hadith", translation: "Faith has over seventy branches or over sixty branches. The most excellent of which is the declaration that there is no god but Allah, and the humblest of which is the removal of what is injurious from the path...", arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ أَوْ بِضْعٌ وَسِتُّونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ..." },
            { type: "scholar", translation: "Haya (Modesty/Shyness) is also a major branch of faith.", arabic: "وَالْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ" },
            { type: "infographic", layout: "process", items: [
                { title: "Belief of Heart", description: "Conviction and certainty.", icon: "Heart" },
                { title: "Statement of Tongue", description: "Shahadah and dhikr.", icon: "Command" },
                { title: "Action of Limbs", description: "Prayer, fasting, removing harm.", icon: "Activity" }
            ]},
            { type: "legal", translation: "The sects of Al-Murji'ah claimed that actions are not part of Iman, a view strictly refuted by the Salaf.", arabic: "المرجئة أخرجوا العمل عن مسمى الإيمان، وهو قول بدعي" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "A tree without fruit might still be called a tree, but its nature is compromised. Faith without action is an incomplete reality." },
            { type: "quiz", question: "How many branches does Iman have according to the famous Hadith?", options: ["Five", "Three", "Over sixty or seventy", "One hundred"], correctIndex: 2, hint: "It encompasses many parts of life." },
            { type: "quiz", question: "What is the 'lowest' or 'humblest' branch of faith?", options: ["Smiling at a brother", "Removing harm from the path", "Sleeping early", "Eating moderately"], correctIndex: 1, hint: "A physical action of public benefit." },
            { type: "quiz", question: "Which historical sect wrongly claimed actions are entirely separate from faith?", options: ["Khawarij", "Murji'ah", "Mu'tazilah", "Qadariyyah"], correctIndex: 1, hint: "Irja' means to 'postpone' or separate." }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING LESSONS PT 4 ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}`, order: i };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                block.content = { translation: b.translation, arabic: b.arabic };
                delete block.translation;
                delete block.arabic;
            } else if (b.type === 'quiz') {
                block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
            } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
                block.content = b.content;
                block.author = b.author;
            } else if (['objectives', 'infographic'].includes(b.type)) {
                block.content = { items: b.items, layout: b.layout };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title}%`);
        console.log('DONE');
    }
}

seedLessons();
