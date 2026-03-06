const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_DATA = [
    {
        id: "74fe6c84-ee7e-4888-b0b3-75d7529f8188",
        title: "The Concept of Ihsan",
        blocks: [
            { type: "objectives", items: ["Define Ihsan linguistically and technically according to the Hadith of Jibril.", "Differentiate between the two 'stations' of Ihsan: Mushahadah (witnessing) and Muraqabah (vigilance).", "Evaluate Ihsan beyond ritual worship, expanding it to human character, professional excellence (Itqan), and emotional intelligence.", "Formulate a practical approach to embedding Ihsan in daily, routine tasks."] },
            { type: "concept", translation: "Ihsan: Spiritual excellence; beautifying one's deeds inwardly and outwardly.", arabic: "إحسان" },
            { type: "concept", translation: "Muraqabah: The constant, vigilant awareness that Allah is observing.", arabic: "مراقبة" },
            { type: "concept", translation: "Mushahadah: 'Witnessing' Allah through the heart; worshipping with absolute certainty as if seeing Him.", arabic: "مشاهدة" },
            { type: "text", content: "### The Pinnacle of Religion\nWhen Jibril asked the Prophet ﷺ about Ihsan, he described the zenith of human spiritual achievement. Ihsan is derived from the root h-s-n, meaning beauty and excellence. It is the beautification of the 'Islam' (the physical) through the perfection of the 'Iman' (the internal state). It transforms stagnant, robotic religious rituals into vibrant, breathing acts of absolute devotion." },
            { type: "infographic", layout: "process", items: [
                { title: "Station 1: Mushahadah", description: "'To worship Allah as if you see Him.' The worshipper acts out of overwhelming love and yearning, propelled by certainty.", icon: "Eye" },
                { title: "Station 2: Muraqabah", description: "'If you cannot see Him, then know He sees you.' The worshipper acts out of deep reverence, fear, and awareness.", icon: "Shield" },
                { title: "The Result: Itqan", description: "Absolute excellence in executing the action, ensuring it is flawlessly sincere and accurate.", icon: "Star" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=O-UoQW2_DDU" },
            { type: "text", content: "### Beyond the Prayer Rug: The Expansive Scope of Ihsan\nIhsan is devastatingly misunderstood if confined only to prayer or fasting. The Prophet ﷺ explicitly commanded Ihsan in all things: 'Verily Allah has prescribed Ihsan in all things.' This expands the concept into professional integrity (Itqan), where an engineer designs a bridge flawlessly because they remember Allah is watching. It expands to interpersonal character: returning cruelty with kindness, or hiding the faults of a sibling." },
            { type: "scholar", translation: "Imam ibn al-Qayyim: The degree of Ihsan is the core of faith, its spirit and its perfection. It is to worship Allah upon the foundation of love, magnification, and reverence...", arabic: "الإمام ابن القيم..." },
            { type: "quran", translation: "Is the reward for good [Ihsan] anything but good [Ihsan]? (Surah ar-Rahman 55:60)", arabic: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ" },
            { type: "text", content: "### The Shield of Muraqabah\nLiving fully in Muraqabah provides an impenetrable psychological shield. When an individual operates with the conviction that 'Allah sees me,' they become effectively immune to the pressures of peer validation or the temptations of secret sins. The modern 'panopticon' (surveillance) enforces physical compliance; the Divine Panopticon (Muraqabah) enforces spiritual integrity." },
            { type: "hadith", translation: "Verily, Allah loves that when one of you does a job, he does it with excellence (Itqan).", arabic: "إِنَّ اللّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلاً أَنْ يُتْقِنَهُ" },
            { type: "callout", content: "The Ihsan Audit: Perform one mundane daily chore tomorrow (e.g., washing dishes, organizing a file) with absolute perfection, explicitly dedicating the 'excellence' of the work to Allah's sight.", author: "Action Item" },
            { type: "quiz", question: "What are the two distinct 'stations' of Ihsan outlined by the Prophet ﷺ?", options: ["Sleeping and Fasting", "Worshipping as if you see Him (Love/Certainty) or worshipping knowing He sees you (Reverence/Awareness)", "Giving Zakat and giving Sadaqah", "Only performing optional prayers"], correctIndex: 1, hint: "Mushahadah and Muraqabah." },
            { type: "quiz", question: "Does the concept of Ihsan only apply to ritual worship?", options: ["Yes, only in Salah and Hajj", "No, it encompasses all human actions, including professional work and social ethics", "Yes, it is only for scholars", "No, it only applies to angels"], correctIndex: 1, hint: "Allah prescribed it in 'all things'." },
            { type: "quiz", question: "What is the psychological benefit of Muraqabah?", options: ["It provides a terrifying feeling of paranoia", "It creates a shield against secret sins and the paralyzing need for human validation", "It automatically increases your bank account", "It removes the need to sleep"], correctIndex: 1, hint: "A spiritual immune system." },
            { type: "reflection", translation: "How would the quality of your work change if you truly visualized your Creator actively 'signing off' on every email you sent or conversation you held?", arabic: "تفكر عميق عن الإحسان" },
            { type: "document", title: "Ihsan: The Pinnacle of Excellence", description: "A deep dive into the highest station of Islamic spirituality.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "d037d520-79ca-4de8-95fe-c7f32e021a90",
        title: "Internal vs External Submission",
        blocks: [
            { type: "objectives", items: ["Categorize the relationship between outward bodily compliance (Islam) and inward spiritual conviction (Iman).", "Evaluate the 'Tree Metaphor' illustrating the codependency between roots of faith and branches of deeds.", "Analyze the danger of separating the internal from the external (the Murji'ite vs. Kharijite historical extremes).", "Identify practical action steps to unify fragmented inner and outer states."] },
            { type: "concept", translation: "Amal al-Jawarih: Physical actions performed by the limbs, usually categorized under Islam.", arabic: "عمل الجوارح" },
            { type: "concept", translation: "Amal al-Qulub: Actions of the heart (love, fear, trust, reliance), the core of Iman.", arabic: "عمل القلوب" },
            { type: "text", content: "### The Synergy of the Dual Engine\nThe Bedouins historically approached the Prophet ﷺ boasting, 'We have believed (Amanna).' The Qur'an immediately corrected them: 'Say: You have not [yet] believed; but say [instead], 'We have submitted (Aslamna)' (Surah al-Hujurat 49:14). This verse fundamentally distinguishes the baseline external submission (Islam) from the deep, penetrated internal conviction (Iman) that follows it." },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Roots (Iman)", description: "Internal conviction, trust (Tasdiq), love, and fear. Hidden but essential.", icon: "Heart" },
                { title: "The Trunk/Branches (Islam)", description: "Visible actions: prayer, fasting, charity. Provide the structure.", icon: "Activity" },
                { title: "The Fruit (Akhlaq)", description: "Outward beautiful character, proving the health of the roots.", icon: "Star" },
                { title: "The Sun (Revelation)", description: "The Divine guidance nourishing the entire organism.", icon: "Sun" }
            ]},
            { type: "text", content: "### False Dichotomies: Navigating the Extremes\nHistorically, two terrifying extremes arose regarding actions. The Kharijites claimed a single major sin destroyed internal faith entirely, ejecting the believer from Islam. The Murji'ites claimed actions were totally irrelevant, stating 'sins do not harm faith.' The Sunni orthodox path ('The Middle Way') asserts that actions are the inescapable, natural fruit of internal belief. Sin severely weakens the heart's faith, but does not inherently annihilate it. High internal faith inescapably drives outward obedience." },
            { type: "quran", translation: "The bedouins say, 'We have believed.' Say, 'You have not [yet] believed; but say [instead], 'We have submitted,' for faith has not yet entered your hearts. (Surah al-Hujurat 49:14)", arabic: "قَالَتِ الْأَعْرَابُ آمَنَّا ۖ قُل لَّمْ تُؤْمِنُوا وَلَٰكِن قُولُوا أَسْلَمْنَا وَلَمَّا يَدْخُلِ الْإِيمَانُ فِي قُلُوبِكُمْ" },
            { type: "text", content: "### The Diagnostic Tool of Charity\nPhysical actions often act as brutal, objective 'diagnostics' of our hidden internal state. The Prophet ﷺ called charity a 'Burhan' (a decisive proof). The Nafs (ego) naturally hoards wealth. Tearing wealth away from the ego is a physical action that absolutely 'proves' the internal heart genuinely believes in the Unseen God rewarding the sacrifice on the Last Day." },
            { type: "hadith", translation: "And charity is a proof (Burhan), and patience is illumination...", arabic: "وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ..." },
            { type: "callout", content: "Action Alignment: Identify one external religious habit you perform completely 'robotically' (like wudu), and deliberately reconnect it to its internal spiritual intention ('washing away sins') tomorrow.", author: "Action Item" },
            { type: "quiz", question: "In Surah al-Hujurat (49:14), what crucial distinction did the Qur'an draw for the Bedouins?", options: ["The difference between Arabic and Persian", "The difference between paying taxes and fighting", "The difference between basic outward submission (Islam) and deep internal faith (Iman) taking root in the heart", "The difference between angels and jinn"], correctIndex: 2, hint: "They said 'Amanna' but were told to say 'Aslamna'." },
            { type: "quiz", question: "According to Ahl al-Sunnah (the Middle Way), what happens if a believer commits a major sin without repenting?", options: ["They immediately remain a perfect believer", "Their internal faith is severely weakened and diminished, but they are not entirely ejected from Islam", "They instantly become a non-Muslim", "Nothing happens"], correctIndex: 1, hint: "The garment wears out." },
            { type: "quiz", question: "Why is charity explicitly called a 'Burhan' (Decisive proof)?", options: ["Because it requires a bank account", "Because ripping wealth from the hoarding ego physically proves the hidden conviction in an unseen eternal reward", "Because the government requires it", "Because it is easy"], correctIndex: 1, hint: "Actions prove the heart." },
            { type: "reflection", translation: "If your external actions (how you spend time/money) were entered as evidence in a court, would they easily 'prove' your internal beliefs?", arabic: "تفكر حول العمل والإيمان" },
            { type: "document", title: "The Synergy of Outward and Inward", description: "How actions and beliefs fuel one another recursively.", url: "https://seekersguidance.org/", platform: "SeekersGuidance" }
        ]
    }
];

async function seedLessons() {
    console.log('Seeding Module 2 - Part 2...');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}" with ${item.blocks.length} blocks... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}_${Math.floor(Math.random()*10000)}`, order: i };
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

        const { error, data } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks, title: item.title })
            .eq('id', item.id).select();
        
        if (error) console.log('\nERR: ' + error.message);
        else console.log(`DONE! Seeded to ${item.title}`);
    }
}

seedLessons();
