const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Science & Revelation",
        blocks: [
            { type: "callout", content: "Science is the study of Allah's 'Created Signs' (Al-Ayat al-Kawniyyah), while the Quran is the study of His 'Revealed Signs' (Al-Ayat al-Matluwwah). Truth cannot contradict truth.", author: "Classical Scholarly Principle" },
            { type: "objectives", items: ["Understand the complementary relationship between empirical science and divine revelation", "Analyze the difference between 'Scientific Fact' and 'Scientific Theory'", "Address common areas of perceived conflict (Evolution, Cosmology)", "Learn the Islamic history of scientific inquiry as an act of worship"] },
            { type: "text", content: "## Two Books of God\n\nThe Quran is the 'Recited Book' and the Universe is the 'Visual Book'. Because both originate from the same Source (Allah), there can never be a fundamental contradiction between them. Any perceived conflict arises from either a misunderstanding of revelation or a misinterpretation of scientific data." },
            { type: "concept", translation: "Tawafuq (Accordance): The principle that sound reason and authentic revelation are in perfect harmony.", arabic: "التوافق بين النقل والعقل" },
            { type: "quran", translation: "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth. (Surah Fussilat 41:53)", arabic: "سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Empirical Science", description: "Answers 'How'. Deals with the observable and repeatable.", icon: "Search" },
                { title: "Revelation", description: "Answers 'Why'. Deals with meaning, morality, and the Unseen.", icon: "Zap" },
                { title: "Scientific Theory", description: "Provisional and subject to change (e.g., Newtonian vs Einsteinian).", icon: "RefreshCw" },
                { title: "Quranic Truth", description: "Absolute and unchanging (e.g., Allah is One).", icon: "CheckCircle" }
            ]},
            { type: "text", content: "### The Limits of the Lab\n\nScience is a powerful tool for explaining the physical mechanism of the world. However, it is silent on matters of 'Meaning'. A telescope can find a star, but it cannot find the reason for the star's existence. We must be careful not to turn science into a religion (Scientism)." },
            { type: "scholar", translation: "Reason is like the eye, and revelation is like the light. The eye cannot see without the light, and the light is of no use to the blind. (Imam Al-Ghazali)", arabic: "العقل كالبصر والشرع كالنور" },
            { type: "text", content: "### Addressing Evolution\n\nThe primary area of debate is the origin of humanity. While Islam accepts the complexity of biological changes and adaptation, it affirms as a matter of creed that Adam was a miraculous creation without parents. We accept the 'Horizontal' science of biology while maintaining the 'Vertical' truth of our origin." },
            { type: "quran", translation: "He created the heavens and earth in truth and formed you and perfected your forms; and to Him is the [final] destination. (Surah At-Taghabun 64:3)", arabic: "وَصَوَّرَكُمْ فَأَحْسَنَ صُوَرَكُمْ" },
            { type: "infographic", layout: "process", items: [
                { title: "Observation", description: "Studying the patterns of nature.", icon: "Eye" },
                { title: "Validation", description: "Realizing nature behaves according to divine laws.", icon: "Settings" },
                { title: "Awe (Tasbih)", description: "Scientific discovery leading to the praise of Allah.", icon: "Sunrise" }
            ]},
            { type: "text", content: "### The Golden Age\n\nIslamic civilization flourished precisely because it saw science as a religious duty. Men like Al-Haytham (Optics) and Al-Khwarizmi (Algebra) were devout believers who explored the world to better understand the wisdom of the Creator." },
            { type: "reflection", translation: "When I learn a new scientific fact, does it make me feel 'independent' of Allah, or does it make me more amazed by His design?", arabic: "إنما يخشى الله من عباده العلماء" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Science is the servant of faith, not its enemy. It fills the heart with awe and the mind with evidence of the Great Designer." },
            { type: "quiz", question: "What are the 'Two Books' mentioned in Islamic scholarship?", options: ["The Quran and the Sunnah", "The Quran and the Universe (Creation)", "The Torah and the Injeel", "Algebra and Geometry"], correctIndex: 1, hint: "One is recited, one is observed." },
            { type: "quiz", question: "According to Al-Ghazali, what is 'Reason' compared to?", options: ["Light", "The eye", "The path", "A sword"], correctIndex: 1, hint: "Revelation is the light." },
            { type: "quiz", question: "What is 'Scientism'?", options: ["Studying biology", "The belief that ONLY science can produce true knowledge about reality", "Being an astronaut", "Building a bridge"], correctIndex: 1, hint: "It's a philosophical overreach of science." },
            { type: "quiz", question: "In Surah Fussilat 41:53, where does Allah say He will show His signs?", options: ["In the ocean only", "In the horizons and within themselves", "Only in books", "Nowhere"], correctIndex: 1, hint: "Senureehim ayatina fil-afaqi wa fee anfusihim." },
            { type: "quiz", question: "Does a 'perceived conflict' between science and the Quran mean the Quran is wrong?", options: ["Yes", "No, it means either our understanding of the text is shallow or the scientific 'theory' is not a 'fact'", "Maybe", "Only if it's about evolution"], correctIndex: 1, hint: "Truth cannot contradict truth." },
            { type: "document", title: "Islam and Evolution", description: "A nuanced guide on reconciling biological data with the creation of Adam.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Quran and Modern Science", description: "Maurice Bucaille's classic analysis of scientific descriptions in the Quran.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Problem of Evil",
        blocks: [
            { type: "callout", content: "If you think there is evil in the world that Allah has no purpose for, then you have misunderstood either the nature of God or the nature of the world.", author: "Ibn Taymiyyah (Al-Radd 'ala al-Mantiqiyyin)" },
            { type: "objectives", items: ["Address the 'Epicurean Paradox' (If God is Good and Powerful, why is there suffering?)", "Understand the concept of 'Divine Wisdom' (Hikmah) and our limited perspective", "Reflect on this life as a theater of testing ('Ibitala')", "Analyze how suffering can be a means of spiritual purification and growth"] },
            { type: "text", content: "## Why Suffering?\n\nThe most emotional challenge to faith is the 'Problem of Evil'. If Allah is All-Merciful and All-Powerful, why do innocent children suffer? Why are there earthquakes and wars? Islam provides a framework that shifts the perspective from 'random cruelty' to 'divine purpose'." },
            { type: "concept", translation: "Ibtila' (Trial/Testing): The belief that this life is an examination hall, and every circumstance (good or bad) is a specific test for the soul.", arabic: "الابتلاء" },
            { type: "quran", translation: "[He] who created death and life to test you [as to] which of you is best in deed. (Surah Al-Mulk 67:2)", arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Limited Perspective", description: "We see one frame; Allah sees the whole movie.", icon: "Eye" },
                { title: "Free Will", description: "Human evil is a result of the choice Allah gave us.", icon: "Activity" },
                { title: "Spiritual Growth", description: "Hardship builds resilience and earns reward.", icon: "Zap" },
                { title: "Justice", description: "Every atom of suffering will be compensated in the Afterlife.", icon: "Scale" }
            ]},
            { type: "text", content: "### The Analogy of the Mosaic\n\nImagine looking at a tiny piece of a massive mosaic. It looks jagged, dark, and ugly. But if you zoom out, that dark piece is necessary for the beauty of the overall image. We are currently 'zoomed in' to one moment of time. Allah is 'zoomed out' to the entirety of eternity." },
            { type: "scholar", translation: "Just as the surgeon must cut the body to cure the disease, Allah allows hardship to cure the diseases of the heart (Pride, Greed, Attachment). (Ibn al-Qayyim)", arabic: "المحن منح" },
            { type: "hadith", translation: "No fatigue, nor disease, nor sorrow... befalls a Muslim, even the prick which he receives from a thorn, but that Allah expiates some of his sins for that. (Sahih al-Bukhari 5641 / Muslim 2573)", arabic: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ... حَتَّى الشَّوْكَةِ يُشَاكُهَا" },
            { type: "infographic", layout: "process", items: [
                { title: "Affliction", description: "A difficulty occurs.", icon: "CloudRain" },
                { title: "Sabr (Patience)", description: "Maintaining faith and character.", icon: "Shield" },
                { title: "Purification", description: "Sins are shed and reward is earned.", icon: "Sparkles" }
            ]},
            { type: "text", content: "### The Story of Al-Khidr\n\nIn Surah Al-Kahf, Prophet Musa witnesses events that seem 'evil' (a boat being damaged, a child being killed). Only later is the hidden wisdom revealed. This story is the Quranic answer to the problem of evil: what looks like a tragedy in the moment is often a mercy in disguise." },
            { type: "reflection", translation: "When I am in pain, do I ask 'Why me?' in anger, or do I ask 'What is Allah teaching me?' in humility?", arabic: "عسى أن تكرهوا شيئا وهو خير لكم" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Suffering is not a sign of Allah's absence, but a sign of His serious commitment to our spiritual evolution. There is no triumph without a trial." },
            { type: "quiz", question: "What is 'Ibtila'' in the context of this lesson?", options: ["A type of prayer", "A test or trial from Allah", "A scientific law", "A physical illness"], correctIndex: 1, hint: "Liyabluwakum..." },
            { type: "quiz", question: "According to Surah Al-Mulk 67:2, why did Allah create death and life?", options: ["For fun", "To test who is best in deed", "To see who is the richest", "By accident"], correctIndex: 1, hint: "Li-yabluwakum ayyukum ahsanu 'amala." },
            { type: "quiz", question: "Which Surah contains the story of Al-Khidr that explains hidden divine wisdom in suffering?", options: ["Surah Al-Baqarah", "Surah Yasin", "Surah Al-Kahf", "Surah Al-Fil"], correctIndex: 2, hint: "The story of Musa and the mysterious servant." },
            { type: "quiz", question: "What happens to a believer's sins when they endure even the 'prick of a thorn' with patience?", options: ["They stay the same", "Some of their sins are expiated/forgiven", "They become stronger", "They lose their reward"], correctIndex: 1, hint: "See the Hadith of Sahih al-Bukhari 5641." },
            { type: "quiz", question: "What is the primary human limitation that makes evil seem 'random'?", options: ["Our physical strength", "Our limited time-perspective (zoomed-in view)", "Our lack of technology", "Our wealth"], correctIndex: 1, hint: "We only see the present moment." },
            { type: "document", title: "Why Does God Allow Suffering?", description: "A comprehensive philosophical and theological response to the Problem of Evil.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Patience and Gratitude", description: "Ibn al-Qayyim's 'Uddat as-Sabirin' - the classic manual on coping with hardship.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 7 (CHALLENGES) TO 20+ BLOCKS ---');
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
