const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "The Major Signs",
        blocks: [
            { type: "callout", content: "The Hour will not be established until you see ten signs... (The Dajjal, the Smoke, the Beast, the Sun rising from the West, the Descent of Jesus...)", author: "Prophetic Hadith (Sahih Muslim 2901)" },
            { type: "objectives", items: ["Categorize the ten major signs of the Hour", "Learn the traits and trials of Al-Masih ad-Dajjal", "Understand the pivotal role of Prophet 'Isa (Jesus) in the end times", "Identify the cosmological signs like the Sun rising from the West and the Beast"] },
            { type: "text", content: "## The Final Countdown\n\nWhile the minor signs occur gradually over centuries, the Major Signs (Ashrat al-Sa'ah al-Kubra) will occur like a broken string of beads—rapidly and undeniably. These are cosmological and history-altering events that mark the transition to the Day of Resurrection." },
            { type: "concept", translation: "Al-Malhamah al-Kubra: The great final battle between truth and falsehood that precedes the emergence of the Dajjal.", arabic: "الملاحم الكبرى" },
            { type: "infographic", layout: "grid", items: [
                { title: "Ad-Dajjal", description: "The False Messiah and the greatest trial for mankind.", icon: "Eye" },
                { title: "Prophet 'Isa", description: "The true Messiah who will defeat the Dajjal.", icon: "Shield" },
                { title: "Yajuj & Majuj", description: "Gog and Magog - a vast nation that will spread chaos.", icon: "Users" },
                { title: "The Sun", description: "Rising from the West (The closing of repentance).", icon: "Sun" }
            ]},
            { type: "text", content: "### Al-Masih ad-Dajjal\n\nHe is the greatest trial that will ever face humanity. He will be given miraculous powers (creating rain, bringing 'dead' back to life) as a test of faith. The Prophet (PBUH) warned that he is one-eyed, and 'your Lord is not one-eyed.' Sincerity is the only shield." },
            { type: "hadith", translation: "Every Prophet warned his people against the one-eyed liar... I tell you he is one-eyed and your Lord is not one-eyed. (Sahih al-Bukhari 7131 / Muslim 2933)", arabic: "إِنَّهُ أَعْوَرُ وَإِنَّ رَبَّكُمْ لَيْسَ بِأَعْوَرَ" },
            { type: "quran", translation: "Until, when [the dam of] Gog and Magog has been opened and they, from every elevation, swoop down. (Surah Al-Anbiya 21:96)", arabic: "حَتَّىٰ إِذَا فُتِحَتْ يَأْجُوجُ وَمَأْجُوجُ وَهُم مِّن كُلِّ حَدَبٍ يَنصِلُونَ" },
            { type: "scholar", translation: "The Mahdi will appear first to unite the believers, then the Dajjal to test them, then Jesus to save them. (Sequence in Hadith literature)", arabic: "المهدي ناصر الدين" },
            { type: "infographic", layout: "process", items: [
                { title: "The Mahdi", description: "Emerges to fill the earth with justice.", icon: "Zap" },
                { title: "The Trial", description: "Dajjal emergence and the time of hunger.", icon: "ShieldAlert" },
                { title: "The Victory", description: "Jesus (Isa) descends at the white minaret.", icon: "ArrowDown" }
            ]},
            { type: "text", content: "### The Closing of the Door\n\nOnce the Sun rises from the West, or the 'Beast of the Earth' emerges, the door of Tawbah (repentance) is historically closed. Faith at that moment will not benefit a soul that had not believed before." },
            { type: "reflection", translation: "If the Dajjal offered me a 'paradise' of food and water during a time of famine, would my heart be strong enough to choose the 'fire' of Allah's pleasure?", arabic: "فتنة المسيح الدجال" },
            { type: "hadith", translation: "Whoever memorizes ten verses from the beginning of Surah al-Kahf will be protected from the Dajjal. (Sahih Muslim 809)", arabic: "مَنْ حَفِظَ عَشْرَ آيَاتٍ مِنْ أَوَّلِ سُورَةِ الْكَهْفِ عُصِمَ مِنَ الدَّجَّالِ" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "The major signs are the 'Points of No Return'. They teach us that history has a destination, and we must prepare our hearts while the door of repentance is still open." },
            { type: "quiz", question: "How many 'Major Signs' were mentioned in the Hadith of Sahih Muslim 2901?", options: ["Five", "Seven", "Ten", "Twelve"], correctIndex: 2, hint: "A round number." },
            { type: "quiz", question: "What physical trait did the Prophet (PBUH) use to identify the Dajjal's lie?", options: ["He is very short", "He is one-eyed (A'war)", "He has three hands", "He cannot speak"], correctIndex: 1, hint: "Innahu A'war..." },
            { type: "quiz", question: "Where will Prophet 'Isa (Jesus) descend according to the Hadith?", options: ["Jerusalem", "Mecca", "At the white minaret in Eastern Damascus", "Cairo"], correctIndex: 2, hint: "Near a white tower/minaret." },
            { type: "quiz", question: "What spiritual preparation did the Prophet (PBUH) recommend the most to protect against the Dajjal?", options: ["Build a bunker", "Collect gold", "Memorize verses from Surah Al-Kahf", "Run to the ocean"], correctIndex: 2, hint: "Specifically the first or last ten verses." },
            { type: "quiz", question: "At which sign is the door of repentance (Tawbah) strictly closed?", options: ["Emergence of the Mahdi", "The Sun rising from the West", "The death of a scholar", "The building of tall towers"], correctIndex: 1, hint: "A cosmological reversal." },
            { type: "document", title: "The Trial of Dajjal", description: "Comprehensive analysis of the psychological and spiritual dimensions of the False Messiah.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Descent of Jesus", description: "Comparing Islamic and Christian eschatology on the return of the Messiah.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "The Grave & Barzakh",
        blocks: [
            { type: "callout", content: "The grave is either a garden from the gardens of Paradise or a pit from the pits of the Fire.", author: "Prophetic Hadith (Sunan at-Tirmidhi 2460 - Weakened chain but accepted meaning)" },
            { type: "objectives", items: ["Define the concept of Barzakh (The Interval)", "Understand the three questions of the grave: Lord, Religion, and Prophet", "Explore the reality of punishment (Adhab) and bliss (Na'im) in the grave", "Learn the importance of seeking refuge from the punishment of the grave in every prayer"] },
            { type: "text", content: "## The First Station of the Hereafter\n\nDeath is not the end of consciousness. It is the beginning of the 'Intermediate Realm' (Barzakh). This is a space between this world and the final Resurrection where the soul begins its journey toward its ultimate destination." },
            { type: "concept", translation: "Al-Barzakh (The Barrier): The state between death and resurrection. Souls experience a preview of their final fate in Paradise or Hell.", arabic: "البرزخ" },
            { type: "quran", translation: "And behind them is a barrier (Barzakh) until the Day they are resurrected. (Surah Al-Mu'minun 23:100)", arabic: "وَمِن وَرَائِهِم بَرْزَخٌ إِلَىٰ يَوْمِ يُبْعَثُونَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Munkar & Nakir", description: "The two angels who ask the three fundamental questions.", icon: "User" },
                { title: "Who is your Lord?", description: "Does your heart know Allah?", icon: "Sun" },
                { title: "What is your Deen?", description: "Did you live by Islam?", icon: "Book" },
                { title: "Who is this Prophet?", description: "Was Muhammad your role model?", icon: "CheckCircle" }
            ]},
            { type: "hadith", translation: "When a human is placed in his grave... two angels come to him and sit him up... they ask: 'Who is your Lord?' (Sahih al-Bukhari 1374 / Muslim 2870)", arabic: "مَنْ رَبُّكَ؟ مَا دِينُكَ؟ مَا هَذَا الرَّجُلُ؟" },
            { type: "text", content: "### The Questions of the Heart\n\nThe answers given in the grave are not a matter of 'memorizing' the words. A person who claimed to be a Muslim but never prayed or cared for the religion will find their tongue tied. The answers emerge from the *reality* of what the heart followed in the world." },
            { type: "scholar", translation: "The grave is the first stage of the Hereafter. If one passes it successfully, what follows will be easier. If not, what follows will be harder. (Uthman ibn Affan citing the Prophet)", arabic: "القبر أول منازل الآخرة" },
            { type: "infographic", layout: "process", items: [
                { title: "The Squeeze", description: "The grave tightens on the body (The first moment).", icon: "Lock" },
                { title: "The Questions", description: "The test of identity and conviction.", icon: "Zap" },
                { title: "The Result", description: "A window to Paradise or Hell opens.", icon: "Eye" }
            ]},
            { type: "text", content: "### Seeking Refuge\n\nThe Prophet (PBUH) would seek refuge in Allah from four things in every prayer: 1. Punishment of Hell. 2. Punishment of the Grave. 3. Trials of Life and Death. 4. Trial of the Dajjal. This highlights the seriousness of the Barzakh state." },
            { type: "hadith", translation: "Seek refuge in Allah from the punishment of the grave. (Sahih Muslim 586)", arabic: "اسْتَعِيذُوا بِاللَّهِ مِنْ عَذَابِ الْقَبْرِ" },
            { type: "reflection", translation: "If my grave was opened tomorrow, would I be someone who finds peace in their good deeds, or someone terrified of their distractions?", arabic: "يا ليتني قدمت لحياتي" },
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "The grave is the place where the masks of the world are stripped away. What remains is only the light of your Iman and the weight of your actions." },
            { type: "quiz", question: "What does the word 'Barzakh' mean linguistically?", options: ["Death", "A barrier or interval", "A garden", "A dark hole"], correctIndex: 1, hint: "Between two things." },
            { type: "quiz", question: "Who are 'Munkar and Nakir'?", options: ["The keepers of paradise", "The angels of death", "The two angels who question the soul in the grave", "The recorders of deeds"], correctIndex: 2, hint: "They ask the three questions." },
            { type: "quiz", question: "What governs a person's ability to answer the questions in the grave?", options: ["Their memory and IQ", "The sincerity and reality of their life's actions", "The help of their relatives", "A written sheet"], correctIndex: 1, hint: "The tongue follows the heart." },
            { type: "quiz", question: "According to the Hadith, what is the 'Grave' considered in the sequence of the Hereafter?", options: ["The final destination", "The first station", "An optional stage", "A dream"], correctIndex: 1, hint: "Awal manazil al-akhirah." },
            { type: "quiz", question: "In which part of the Salah did the Prophet (PBUH) command us to seek refuge from the punishment of the grave?", options: ["In Sujud", "After the final Tashahhud, before Tasleem", "In the beginning", "Only in the night prayer"], correctIndex: 1, hint: "The final supplication of the prayer." },
            { type: "document", title: "Life in the Barzakh", description: "A theological study of the soul's journey after death.", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "Cures for the Grave", description: "Specific good deeds (like Surah Al-Mulk) that protect from the punishment of the grave.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 6 (STAGES) TO 20+ BLOCKS ---');
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
