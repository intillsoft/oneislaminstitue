const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "The Hadith of Jibreel Explained",
        blocks: [
            { type: "callout", content: "This is a comprehensive Hadith that contains the entirety of the religion. It is the mother of all Sunnah, just as Surah Al-Fatiha is the mother of the Qur'an.", author: "Imam Al-Qurtubi (Al-Mufhim)" },
            { type: "objectives", items: ["Understand the context and timing of the Hadith of Jibreel", "Identify the four levels of religion mentioned: Islam, Iman, Ihsan, and the Hour", "Learn the etiquette of seeking knowledge as demonstrated by Jibreel", "Recognize why this Hadith is considered the 'Mother of the Sunnah'"] },
            { type: "text", content: "## A Spiritual Architecture\n\nOne day, while the Prophet (PBUH) was sitting with his companions, a man with intensely white clothes and intensely black hair appeared. He showed no signs of travel, yet no one knew him. This was the opening scene of the most profound teaching moment in Islamic history." },
            { type: "hadith", translation: "A man appeared... he sat down by the Prophet (PBUH) and propped his knees against his (the Prophet's) knees and placed his hands on his thighs and said: O Muhammad, tell me about Islam. (Sahih Muslim 8)", arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ ﷺ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ..." },
            { type: "concept", translation: "Levels of the Deen: The three concentric circles of religious development: Islam (Submission), Iman (Faith), and Ihsan (Excellence).", arabic: "مراتب الدين: الإسلام والإيمان والإحسان" },
            { type: "infographic", layout: "process", items: [
                { title: "Islam", description: "The core entrance. Five pillars of action.", icon: "Lock" },
                { title: "Iman", description: "The internal depth. Six pillars of conviction.", icon: "Zap" },
                { title: "Ihsan", description: "The spiritual peak. Excelling in awareness.", icon: "Sparkles" }
            ]},
            { type: "text", content: "### The Etiquette of the Seeker\n\nBefore any questions were asked, Jibreel taught through his posture. He sat close, showed respect, and was precise in his questioning. Knowledge in Islam is not just information; it is the refinement of character (Adab)." },
            { type: "scholar", translation: "This Hadith summarizes the outer rituals, the inner beliefs, the perfection of character, and the awareness of the hereafter. (Ibn Rajab al-Hanbali, Jami' al-Ulum wal-Hikam)", arabic: "هذا الحديث يجمع معاني الدين كله" },
            { type: "text", content: "### The Validation\n\nAfter each answer, the stranger said, 'You have spoken the truth.' This surprised the companions, for how could a man ask a question and then verify the answer as if he already knew it? Only at the end did the Prophet reveal the mystery." },
            { type: "hadith", translation: "That was Jibreel who came to you to teach you your religion. (Sahih Muslim 8)", arabic: "فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ" },
            { type: "reflection", translation: "If Jibreel (the chief of angels) sat in such humble submission to learn, who am I to be arrogant in the presence of sacred knowledge?", arabic: "التواضع مفتاح العلم" },
            { type: "infographic", layout: "grid", items: [
                { title: "Islam (Outer)", description: "Limbs submitting to commands.", icon: "Activity" },
                { title: "Iman (Inner)", description: "Heart submitting to truth.", icon: "Heart" },
                { title: "Ihsan (Apex)", description: "Soul and heart unified in awareness.", icon: "Sun" },
                { title: "The End", description: "Awareness of the looming Hour.", icon: "Clock" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Final Question: The Hour\n\nThe final part of the Hadith deals with the end of time. When asked about the Hour, the Prophet replied, 'The one questioned knows no more than the questioner.' This teaches us the value of saying 'I don't know' and focuses us on the *signs* of the hour rather than the date." },
            { type: "quran", translation: "They ask you, [O Muhammad], about the Hour: when is its arrival? Say, 'Its knowledge is only with my Lord.' (Surah Al-A'raf 7:187)", arabic: "يَسْأَلُونَكَ عَنِ السَّاعَةِ أَيَّانَ مُرْسَاهَا ۖ قُلْ إِنَّمَا عِلْمُهَا عِندَ رَبِّي" },
            { type: "conclusion", content: "The Hadith of Jibreel is a roadmap for life. It tells you where to start (Islam), where to deepen (Iman), and where to aim for the finish line (Ihsan)." },
            { type: "quiz", question: "Who was the man with intensely white clothes and black hair according to the end of the Hadith?", options: ["A traveling scholar", "The Angel Jibreel", "A companion from Makkah", "Khalid ibn Walid"], correctIndex: 1, hint: "The chief of the angels." },
            { type: "quiz", question: "How many major levels of the religion (Dine) are mentioned in this Hadith?", options: ["Two", "Three", "Five", "Ten"], correctIndex: 1, hint: "Islam, Iman, Ihsan." },
            { type: "quiz", question: "Why were the companions surprised by the stranger's behavior?", options: ["Because he shouted", "Because he sat too far away", "Because he verified the Prophet's answers as 'true'", "Because he wore black clothes"], correctIndex: 2, hint: "A questioner usually doesn't know the answer." },
            { type: "quiz", question: "In which book of Hadith is the most famous version of this 'Hadith Jibreel' located (as Hadith number 8)?", options: ["Sahih al-Bukhari", "Sahih Muslim", "Sunan at-Tirmidhi", "Musnad Ahmad"], correctIndex: 1, hint: "It's the very first Hadith in the Chapter of Iman in this collection." },
            { type: "quiz", question: "What did the Prophet (PBUH) say about the date of the Day of Judgment?", options: ["It will be in 100 years", "The one questioned knows no more than the questioner", "It is on a Friday", "Only the angels know"], correctIndex: 1, hint: "Both the Prophet and Jibreel share the same limit of knowledge." },
            { type: "document", title: "Commentary on Hadith Jibreel", description: "Ibn Rajab al-Hanbali's masterful breakdown of every sentence in this Hadith.", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "Etiquettes of the Seeker", description: "How the Hadith of Jibreel defines the student-teacher relationship in Islam.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute Monographs" }
        ]
    },
    {
        title: "The Five Pillars of Islam",
        blocks: [
            { type: "callout", content: "Islam is built upon five: Testimony that there is no god but Allah... establishing prayer, giving zakat, fasting Ramadan, and performing Hajj.", author: "Prophetic Hadith (Sahih al-Bukhari 8)" },
            { type: "objectives", items: ["Categorize the five pillars as the external framework of faith", "Understand why the Shahadah is the foundation of the other four", "Explore the spiritual and social wisdom behind Zakat and Fasting", "Identify the textual evidence for fasting and Hajj"] },
            { type: "text", content: "## The Framework of Submission\n\nIf the religion is a building, the Five Pillars are the load-bearing columns. They represent the minimum outward requirements that define a person's identity as a Muslim. These acts are bodily submissions that demonstrate the heart's hidden faith." },
            { type: "concept", translation: "Arkan al-Islam (Pillars of Islam): The five primary acts of worship that are obligatory for every able Muslim.", arabic: "أركان الإسلام الخمسة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Shahadah", description: "The internal key and external entrance.", icon: "Key" },
                { title: "Salah", description: "The daily vertical connection to the Divine.", icon: "Activity" },
                { title: "Zakat", description: "The purification of wealth and social justice.", icon: "Coins" },
                { title: "Sawm", description: "The discipline of the physical self.", icon: "Moon" },
                { title: "Hajj", description: "The journey to the origins of faith.", icon: "Map" }
            ]},
            { type: "quran", translation: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous. (Surah Al-Baqarah 2:183)", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ" },
            { type: "hadith", translation: "Islam is built on five... (Sahih al-Bukhari 8 / Sahih Muslim 16)", arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ" },
            { type: "text", content: "### The Hierarchy of Actions\n\nThe Shahadah is unique; it is the prerequisite for all other pillars. Salah is the daily link, Sawm is the annual retreat, Zakat is the financial responsibility, and Hajj is the once-in-a-lifetime pilgrimage. Together, they regulate time, money, body, and soul." },
            { type: "legal", translation: "Obligatory Nature (Fard): Denying any of these five pillars as an obligation takes one outside the fold of Islam, though falling short in performing them (due to laziness) is a different legal category.", arabic: "الإقرار بالأركان شرط لصحة الإيمان" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "scholar", translation: "The Pillars are the signs of Islam by which a person's life is preserved and their wealth is protected. (Imam An-Nawawi)", arabic: "أركان الإسلام هي شعائر الظاهرة" },
            { type: "reflection", translation: "If my building has five pillars, but I only maintain two or three, how stable is the roof over my head?", arabic: "كيف يستقيم البناء بلا أعمدة؟" },
            { type: "text", content: "### Beyond the Ritual\n\nZakat is not just a tax; it is a spiritual acknowledgment that everything we 'own' actually belongs to Allah. Hajj is not just a trip; it is a rehearsal for the Day of Resurrection, where all statuses are leveled before the Creator." },
            { type: "quran", translation: "And they were not commanded except to worship Allah, [being] sincere to Him in religion... and to establish prayer and to give zakat. And that is the correct religion. (Surah Al-Bayyinah 98:5)", arabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ ۚ وَذَٰلِكَ دِينُ الْقَيِّمَةِ" },
            { type: "infographic", layout: "process", items: [
                { title: "Sincerity", description: "Doing it for Allah alone.", icon: "Heart" },
                { title: "Correctness", description: "Doing it according to the Sunnah.", icon: "Check" },
                { title: "Consistency", description: "The daily habit of submission.", icon: "RefreshCw" }
            ]},
            { type: "conclusion", content: "The Five Pillars are the baseline. They anchor the believer to the earth through service and to the heavens through prayer. Mastering these is the first step of the journey." },
            { type: "quiz", question: "Which pillar is considered the daily 'ascending line' (Mi'raj) between the servant and the Lord?", options: ["Zakat", "Sawm", "Salah", "Hajj"], correctIndex: 2, hint: "Performed five times a day." },
            { type: "quiz", question: "In the Hadith 'Islam is built on five', which book and number is this recorded as (Bukhari)?", options: ["Bukhari No. 1", "Bukhari No. 8", "Bukhari No. 100", "Bukhari No. 7372"], correctIndex: 1, hint: "It is very early in the Chapter of Iman." },
            { type: "quiz", question: "What is the primary spiritual goal of fasting according to Surah Al-Baqarah 2:183?", options: ["Weight loss", "Taqwa (God-consciousness/Righteousness)", "Saving money", "Sleeping all day"], correctIndex: 1, hint: "La'allakum tattaqun." },
            { type: "quiz", question: "Is Hajj obligatory for every Muslim every year?", options: ["Yes, every year", "Only for those who can afford and are physically able once in a lifetime", "No, it's optional", "Only for scholars"], correctIndex: 1, hint: "Many conditions exist for its obligation." },
            { type: "quiz", question: "Which pillar purifies wealth and protects the poor in society?", options: ["Sawm", "Zakat", "Shahadah", "Hajj"], correctIndex: 1, hint: "It's the 2.5% contribution." },
            { type: "document", title: "The Wisdom of the Pillars", description: "A metaphysical look at the five pillars and their psychological impact.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute Monographs" },
            { type: "document", title: "Detailed Rulings of Salah", description: "Comprehensive guide to the conditions and pillars of the prayer.", url: "https://sunnah.com/", platform: "Fiqh Collections" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 2 LESSONS 1 & 2 TO 22+ BLOCKS ---');
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
