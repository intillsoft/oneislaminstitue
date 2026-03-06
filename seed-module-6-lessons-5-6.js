const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Resurrection & The Scale",
        blocks: [
            { type: "callout", content: "That Day, the people will depart separated [into categories] to be shown [the result of] their deeds.", author: "Quranic Revelation (Surah Az-Zalzalah 99:6)" },
            { type: "objectives", items: ["Understand the stages of the Great Resurrection (Ba'th) and Standing (Hashr)", "Identify the 'Mizan' (Scale) and how deeds are weighed", "Learn about the 'Siraat' (Bridge) and its characteristics", "Analyze the concept of 'Intercession' (Shafa'ah)"] },
            { type: "text", content: "## Raising the Dead\n\nWhen the second trumpet is blown, every soul from Adam to the last human will emerge from their graves. This is the Day of Resurrection (Yaum al-Qiyamah). People will be barefoot, naked, and uncircumcised, overwhelmed with the gravity of the moment." },
            { type: "hadith", translation: "Mankind will be resurrected on the Day of Resurrection barefoot, naked and uncircumcised. (Sahih al-Bukhari 6527 / Muslim 2859)", arabic: "يُحْشَرُ النَّاسُ يَوْمَ الْقِيَامَةِ حُفَاةً عُرَاةً غُرْلًا" },
            { type: "concept", translation: "Al-Mizan (The Scale): A literal scale that will be set up on the Day of Judgment to weigh the deeds of the servants. It is perfectly just.", arabic: "الميزان" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Standing", description: "Standing for 50,000 years in intense heat.", icon: "Sun" },
                { title: "The Books", description: "Receiving your record in the right or left hand.", icon: "Book" },
                { title: "The Scale", description: "Weighing the sincerity and weight of actions.", icon: "Scale" },
                { title: "The Bridge", description: "Crossing the Siraat over the fire of Hell.", icon: "Activity" }
            ]},
            { type: "quran", translation: "And We place the scales of justice for the Day of Resurrection, so no soul will be treated unjustly at all. (Surah Al-Anbiya 21:47)", arabic: "وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ فَلَا تُظْلَمُ نَفْسٌ شَيْئًا" },
            { type: "text", content: "### The Weight of Good Character\n\nNot all deeds weigh the same. The Prophet (PBUH) mentioned that nothing is heavier on the Scale than 'Good Character'. Sincerity (Ikhlas) acts as a multiplier, turning small deeds into massive weights." },
            { type: "hadith", translation: "There is nothing heavier upon the Scale than good character. (Sunan Abi Dawud 4799, Authentic)", arabic: "مَا مِنْ شَيْءٍ أَثْقَلُ فِي الْمِيزَانِ مِنْ حُسْنِ الْخُلُقِ" },
            { type: "scholar", translation: "The Siraat (Bridge) is sharper than a sword and thinner than a hair. People will cross it at the speed of their deeds in this world. (Common theological description)", arabic: "الصراط أدق من الشعرة" },
            { type: "infographic", layout: "process", items: [
                { title: "Handing of Records", description: "Right hand = Success. Left hand = Failure.", icon: "FileText" },
                { title: "Weighting", description: "The Scale measures the substance of the heart.", icon: "Scale" },
                { title: "Intercession", description: "The Prophet (PBUH) begs for his Ummah.", icon: "Heart" }
            ]},
            { type: "text", content: "### The Great Intercession\n\nOn that terrifying day, people will run from Prophet to Prophet (Adam, Nuh, Ibrahim, Musa, Isa) asking for help, but each will say 'Nafsi, Nafsi' (Myself, Myself). Finally, they will come to Muhammad (PBUH) who will say: 'Ana laha, Ana laha' (I am for it). He will prostrate before Allah and intercede for the beginning of the Judgment." },
            { type: "reflection", translation: "If my life's movie was played today, how much 'dead weight' would be in it vs how much 'sincere weight'?", arabic: "يومئذ يصدر الناس أشتاتا" },
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "Resurrection is the great equalizer. It is the moment where every hidden truth is made manifest and every atom of good and evil is weighed with divine precision." },
            { type: "quiz", question: "What is the physical state of mankind when they are resurrected?", options: ["Fully clothed and wealthy", "Barefoot, naked and uncircumcised", "As they were when they died", "Only souls with no bodies"], correctIndex: 1, hint: "Review the Hadith of Sahih al-Bukhari 6527." },
            { type: "quiz", question: "Which characteristic is described as being 'the heaviest thing on the Scale' on the Day of Judgment?", options: ["Wealth", "Physical strength", "Good Character (Husn al-Khuluq)", "Knowledge without action"], correctIndex: 2, hint: "Maa min shay'in athqalu..." },
            { type: "quiz", question: "What determines the speed at which a person crosses the 'Siraat' (Bridge)?", options: ["Their running ability", "Their physical weight", "Their deeds from the worldly life", "Their social status"], correctIndex: 2, hint: "The bridge reflects your 'walk' in this life." },
            { type: "quiz", question: "In the 'Great Intercession', which Prophet finally agrees to speak to Allah on behalf of the people?", options: ["Prophet Ibrahim", "Prophet Musa", "Prophet 'Isa", "Prophet Muhammad (PBUH)"], correctIndex: 3, hint: "He will say 'Ana laha'." },
            { type: "quiz", question: "Receiving the record of deeds in the 'Left Hand' (or behind the back) signifies:", options: ["Great success", "A minor mistake", "Failure and punishment", "A second chance"], correctIndex: 2, hint: "See the descriptions in Surah Al-Haqqah." },
            { type: "document", title: "Stages of the Resurrection", description: "A chronological list of the events from the first trumpet to the gates of Paradise.", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "The Concept of Shafa'ah", description: "Theological rules for who can intercede and who can receive it.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Paradise & Hellfire",
        blocks: [
            { type: "callout", content: "I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever conceived.", author: "Hadith Qudsi (Sahih al-Bukhari 3244 / Muslim 2824)" },
            { type: "objectives", items: ["Understand the eternal nature of Paradise (Jannah) and Hellfire (Jahannam)", "Identify the different levels and descriptions of Jannah", "Analyze the warnings regarding the intensity and nature of Jahannam", "Learn that the greatest blessing in Jannah is seeing the Countenance of Allah"] },
            { type: "text", content: "## The Final Abodes\n\nExistence does not end with the Day of Judgment. It transitions into 'Eternity'. There are two final destinations: Jannah (The Garden) for the righteous and Jahannam (The Fire) for those who denied truth and justice." },
            { type: "concept", translation: "Jannah: The abode of eternal bliss, beauty, and peace. Jahannam: The abode of eternal punishment, fire, and regret.", arabic: "الجنة والنار" },
            { type: "quran", translation: "Indeed, those who believe and do righteous deeds - for them are the Gardens of Pleasure (Jannat an-Na'im). (Surah Luqman 31:8)", arabic: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتُ النَّعِيمِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Jannah Levels", description: "100 levels between each of which is the distance of heaven and earth.", icon: "Layers" },
                { title: "Jannah Doors", description: "8 gates (Prayer, Charity, Fasting, etc.).", icon: "LockOpen" },
                { title: "Jahannam Depth", description: "Layers of fire and 'Zaqqum' (bitter food).", icon: "Flame" },
                { title: "The Ru'yah", description: "The Vision of Allah's Face for the believers.", icon: "Sun" }
            ]},
            { type: "text", content: "### The Description of Jannah\n\nJannah is a place where there is no illness, no sadness, no aging, and no death. Its soil is musk, its bricks are gold and silver, and its rivers are of milk, honey, and wine (that does not intoxicate). But these are just wordly names for realities that are far beyond our imagination." },
            { type: "quran", translation: "And their Lord will give them a pure drink. [It will be said], 'Indeed, this is for you a reward, and your effort has been appreciated.' (Surah Al-Insan 76:21-22)", arabic: "وَسَقَاهُمْ رَبُّهُمْ شَرَابًا طَهُورًا" },
            { type: "hadith", translation: "The fire of this world is only one-seventieth part of the fire of Hell. (Sahih al-Bukhari 3265 / Muslim 2843)", arabic: "نَارُكُمْ هَذِهِ... جُزْءٌ مِنْ سَبْعِينَ جُزْءًا مِنْ نَارِ جَهَنَّمَ" },
            { type: "scholar", translation: "The inhabitants of Jannah will not sleep, because sleep is the brother of death, and there is no death in Jannah. (Classical reflection)", arabic: "الجنة دار البقاء" },
            { type: "infographic", layout: "process", items: [
                { title: "Entrance", description: "Entering through the gates of mercy.", icon: "DoorOpen" },
                { title: "Purification", description: "Removal of all envy or hatred from the hearts.", icon: "Wind" },
                { title: "Eternity", description: "The 'slaughtering of death' between Jannah and Jahannam.", icon: "Clock" }
            ]},
            { type: "text", content: "### The Greatest Reward\n\nWhile the physical pleasures of Jannah are immense, the scholars agree that the highest pinnacle of joy is the moment the veil is removed and the believers look upon the Face of Allah. In that moment, they will forget every other blessing they were ever given." },
            { type: "hadith", translation: "When the inhabitants of Paradise enter Paradise... Allah will say: 'Do you want anything more?'... Then He will remove the veil and they will not have been given anything more beloved to them than looking at their Lord. (Sahih Muslim 181)", arabic: "فَمَا أُعْطُوا شَيْئًا أَحَبَّ إِلَيْهِمْ مِنَ النَّظَرِ إِلَى رَبِّهِمْ" },
            { type: "reflection", translation: "This life is a few hours. The Next is forever. Why am I trading 'Forever' for 'A few hours'?", arabic: "فما متاع الحياة الدنيا في الآخرة إلا قليل" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Jannah is the home our father Adam left, and it is the home we are all striving to return to. Use the fear of the fire to stay on the path, and the love of the garden to move faster." },
            { type: "quiz", question: "According to the Hadith Qudsi, what is the nature of the rewards in Paradise?", options: ["Exactly like worldly rewards", "Better versions of earthly things", "What no eye has seen, nor ear heard, nor heart conceived", "Only mental happiness"], correctIndex: 2, hint: "Beyond human perception." },
            { type: "quiz", question: "How many gates of Paradise (Jannah) are there?", options: ["Seven", "Eight", "Twelve", "Ninety-nine"], correctIndex: 1, hint: "Abwab al-Jannah thamaniah." },
            { type: "quiz", question: "What is considered the 'Greatest Reward' for the believers in Paradise?", options: ["The golden houses", "The rivers of honey", "The Vision (seeing) of Allah's Face", "Never being hungry"], correctIndex: 2, hint: "An-Nazaru ila wajhillah." },
            { type: "quiz", question: "What is the ratio of the heat of the fire of Hell to the fire of this world (Bukhari 3265)?", options: ["Two times hotter", "Ten times hotter", "Seventy times hotter", "The same"], correctIndex: 2, hint: "Juz'un min sab'eena juz'an." },
            { type: "quiz", question: "Is there 'Death' in Jannah or Jahannam once the inhabitants have entered?", options: ["Yes, after 1000 years", "No, it is eternal (Khulud)", "Only for the sinners", "Only if people want it"], correctIndex: 1, hint: "Death itself will be 'slaughtered'." },
            { type: "document", title: "Descriptions of Paradise", description: "Ibn al-Qayyim's 'Hadi al-Arwah' (Gathering of the Souls) - the most detailed work on Jannah.", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "The Reality of Hell", description: "Spiritual and theological warnings about the dangers of the Fire.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 6 (FINAL) TO 20+ BLOCKS ---');
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
