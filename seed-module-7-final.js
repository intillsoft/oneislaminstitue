const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Strengthening Faith in the Modern Age",
        blocks: [
            { type: "callout", content: "Faith is like a plant; it needs the water of knowledge and the sunlight of remembrance. If you leave it in the dark, it will wither, no matter how strong its roots once were.", author: "Traditional Academic Admonition" },
            { type: "objectives", items: ["Develop a practical daily routine for spiritual maintenance", "Identify the importance of 'Suhbah' (Company) and community", "Learn how to use technology mindfully to aid faith rather than destroy it", "Understand the concept of 'Istiqamah' (Steadfastness)"] },
            { type: "text", content: "## Staying Firm in the Wind\n\nLiving in the modern world is like walking against a gale-force wind. To stay upright, one needs more than just a memory of faith; one needs active, daily anchors. This lesson provides the strategy for turning 'Aqidah' into a lived superpower." },
            { type: "concept", translation: "Istiqamah (Steadfastness): Remaining firm on the straight path without deviating to either side, regardless of trials or temptations.", arabic: "الاستقامة" },
            { type: "quran", translation: "Indeed, those who have said, 'Our Lord is Allah' and then remained on a right course - the angels will descend upon them... (Surah Fussilat 41:30)", arabic: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّه ثُمَّ اسْتَقَامُوا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Daily Salat", description: "The five checkpoints that reset your focus.", icon: "Clock" },
                { title: "Sacred Knowledge", description: "Continuously reading the Quran and Seerah.", icon: "BookOpen" },
                { title: "Righteous Company", description: "Surrounding yourself with those who remind you of Allah.", icon: "Users" },
                { title: "Night Prayer", description: "The secret conversation with the Divine (Tahajjud).", icon: "Moon" }
            ]},
            { type: "text", content: "### The Shield of Dhikr\n\nJust as a phone's battery drains with usage, the soul's battery drains through worldly distractions. 'Dhikr' (Remembrance) is the charger. Whether it is 'SubhanAllah' during a commute or 'Astaghfirullah' during a moment of stress, the tongue must stay moist with the names of Allah." },
            { type: "hadith", translation: "The parable of the one who remembers his Lord and the one who does not... is like the parable of the living and the dead. (Sahih al-Bukhari 6407)", arabic: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ مَثَلُ الْحَىِّ وَالْمَيِّتِ" },
            { type: "scholar", translation: "If you do not occupy your soul with the truth, it will occupy you with falsehood. (Imam Ash-Shafi'i)", arabic: "نفسك إن لم تشغلها بالحق شغلتك بالباطل" },
            { type: "infographic", layout: "process", items: [
                { title: "Intake", description: "Watching what we consume (Media, Food, Speech).", icon: "Wind" },
                { title: "Purification", description: "Frequent Repentance and Charity.", icon: "Droplet" },
                { title: "Stability", description: "Finding peace in the Decree of Allah (Qadr).", icon: "Anchor" }
            ]},
            { type: "text", content: "### The Power of Community\n\nNo one can survive a storm alone. Finding a local community or a group of sincere brothers/sisters is not a luxury—it is a survival mechanism. 'A wolf only eats the sheep that wanders far from the flock.'" },
            { type: "reflection", translation: "Is my faith a 'Sunday morning' faith, or is it the operating system through which I view every single email, conversation, and decision?", arabic: "فأقم وجهك للدين حنيفا" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Steadfastness is not about being perfect. it is about always coming back to the path when you stumble. Faith is a journey, and the destination is the Face of your Lord." },
            { type: "quiz", question: "What does 'Istiqamah' mean?", options: ["Studying for a test", "Steadfastness/Firmness on the straight path", "Traveling to Mecca", "Sleeping"], correctIndex: 1, hint: "Thumma istaqamu." },
            { type: "quiz", question: "What parable did the Prophet (PBUH) use for the one who remembers Allah vs the one who doesn't?", options: ["A king vs a slave", "The living vs the dead", "A bird vs a fish", "Day vs Night"], correctIndex: 1, hint: "Review Sahih al-Bukhari 6407." },
            { type: "quiz", question: "According to Imam Ash-Shafi'i, what happens if you don't occupy your soul with 'the Truth'?", options: ["It stays empty", "It will occupy you with 'falsehood'", "It becomes smarter", "It sleeps"], correctIndex: 1, hint: "The mind cannot remain neutral." },
            { type: "quiz", question: "In the Hadith of the wolf and the sheep, what does the 'flock' represent?", options: ["The family only", "The righteous community/Ummah", "The government", "Animals"], correctIndex: 1, hint: "Stability comes from the group." },
            { type: "quiz", question: "What is the best time for a 'secret' conversation with Allah to charge the soul's battery?", options: ["At noon", "During the last third of the night (Tahajjud)", "At sunset", "Whenever you are eating"], correctIndex: 1, hint: "The time of descent and answer." },
            { type: "document", title: "Daily Spiritual Routine", description: "A PDF map for setting up your morning and evening 'Awrad'.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" },
            { type: "document", title: "The Art of Contentment", description: "How 'Rida' (Satisfaction) with Allah's decree creates psychological strength.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Final Course Assessment", // Grand Finale of the whole course
        blocks: [
            { type: "callout", content: "Successful indeed are the believers... those who are humble in their prayer, who turn away from ill-speech, and who are observant of Zakat.", author: "Surah Al-Mu'minun 23:1-4" },
            { type: "objectives", items: ["Demonstrate mastery of the six pillars of Iman", "Verify understanding of the core categories of Tawheed", "Synthesize the purpose of Prophethood and the reality of the Afterlife", "Confirm readiness to apply Islamic Creed in the modern and practical world"] },
            { type: "text", content: "## The Summit\n\nYou have completed the 'Foundations of Islamic Faith'. From the existence of God to the gates of Paradise, you have explored the map of reality as defined by the Creator Himself. This final assessment is a summary of the entire 8-module journey." },
            { type: "infographic", layout: "grid", items: [
                { title: "The Root", description: "Knowledge of Allah (Tawheed).", icon: "Heart" },
                { title: "The Bark", description: "Belief in Angels and Books.", icon: "Book" },
                { title: "The Fruit", description: "Love for the Messengers (Prophethood).", icon: "Star" },
                { title: "The Harvest", description: "Preparation for the Afterlife (Akhirah).", icon: "Sunrise" }
            ]},
            { type: "quran", translation: "Say, [O Muhammad], 'He is Allah, [who is] One. Allah, the Eternal Refuge.' (Surah Al-Ikhlas 112:1-2)", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ" },
            { type: "text", content: "### Comprehensive Knowledge Audit\n\nPlease proceed to complete your final examination for the course certification." },
            { type: "quiz", question: "What is the first and most foundational pillar of Iman?", options: ["Belief in Angels", "Belief in Allah (Tawheed)", "Belief in the Last Day", "Belief in the Books"], correctIndex: 1, hint: "The beginning of everything." },
            { type: "quiz", question: "Which term refers to attributing 'human characteristics' to Allah (a mistake)?", options: ["Ta'til", "Tamthil / Tashbih", "Tawheed", "Ikhlas"], correctIndex: 1, hint: "Comparing Him to creation." },
            { type: "quiz", question: "Does the belief in 'Qadr' (Divine Decree) mean humans have no choice in their actions?", options: ["Yes, we are robots", "No, we have free choice within the knowledge and permission of Allah", "Choice is only for the rich", "The Quran doesn't explain this"], correctIndex: 1, hint: "The 'Middle Path' of Aqidah." },
            { type: "quiz", question: "What is the unique attribute of the Quran compared to other previous scriptures?", options: ["It is older", "It is the only one written in Arabic", "It is divinely preserved from any human alteration/change", "It has no stories"], correctIndex: 2, hint: "Inna nahnu nazzalna al-dhikra wa inna lahu la-hafizoon." },
            { type: "quiz", question: "Who is the 'Seal of the Prophets'?", options: ["Prophet Musa", "Prophet Ibrahim", "Prophet Muhammad (PBUH)", "No one yet"], correctIndex: 2, hint: "Khatam al-Nabiyyeen." },
            { type: "quiz", question: "What is the status of the 'Sign rising from the West'?", options: ["A minor sign", "A major sign", "A historical event", "A scientific law"], correctIndex: 1, hint: "A cosmological 'Ten Sign'." },
            { type: "quiz", question: "If science and an explicit verse of the Quran seem to clash, what is the believer's stance?", options: ["Science is always right", "The Quran is always right, but we may need to re-examine our understanding of the text or the scientific theory", "Both are wrong", "Religion is irrelevant"], correctIndex: 1, hint: "Truth cannot contradict truth." },
            { type: "quiz", question: "What is 'Ihsan' as defined in the Hadith of Jibreel?", options: ["Praying once a day", "To worship Allah as if you see Him; for if you do not see Him, He sees you", "Doing charity", "Memorizing the 99 names"], correctIndex: 1, hint: "The highest stage of faith." },
            { type: "conclusion", content: "Congratulations! You have completed the 'Foundations of Islamic Faith'. You are now eligible for certification and prepared to represent the wisdom of Islam in your character and your community." },
            { type: "document", title: "Full Course Summary Sheet", description: "Consolidated definitions for all 8 modules.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MOD 7 (FINAL) TO 20+ BLOCKS ---');
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
