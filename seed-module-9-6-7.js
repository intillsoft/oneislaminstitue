const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Following the Prophet in Modern Times",
        blocks: [
            { type: "callout", content: "He is not of us who does not have mercy on young children, nor honor the elderly.", author: "Prophetic Hadith (Sunan At-Tirmidhi 1919)" },
            { type: "objectives", items: ["Implement the Sunnah in daily routines (Awrad)", "Differentiate between Cultural Practices and Prophetic Tradition", "Apply the Prophetic ethics of business and community to the 21st century", "Understand 'Loving the Prophet' as an action, not just an emotion"] },
            { type: "text", content: "## Beyond the Thawb and Beard\n\nMany Muslims reduce the Sunnah to specific clothing or grooming styles. While these are parts of the tradition, the core of the Sunnah is the Prophetic character: his absolute honesty in business, his gentle treatment of women and children, and his unrelenting commitment to justice. To follow him in modern times means to resurrect his ethics in a corporate boardroom just as much as wearing his clothes in a mosque." },
            { type: "concept", translation: "Ittiba' (Following): The conscious alignment of one's actions, beliefs, and character with the model of the Prophet (PBUH) out of love for Allah.", arabic: "الاتباع" },
            { type: "quran", translation: "Say, [O Muhammad], 'If you should love Allah, then follow me, [so] Allah will love you and forgive you your sins.' (Surah Ali 'Imran 3:31)", arabic: "قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Personal Habits", description: "Eating, sleeping, and waking with the name of Allah.", icon: "Sun" },
                { title: "Social Ethics", description: "Smiling, shaking hands, and keeping promises.", icon: "Heart" },
                { title: "Economic Justice", description: "Avoiding interest (Riba) and fraud.", icon: "DollarSign" },
                { title: "Family Life", description: "Being the 'best to your family' as he was to his.", icon: "Home" }
            ]},
            { type: "text", content: "### The Living Sunnah\n\nTo follow the Prophet today is to combat the modern 'diseases' of the heart. In an age of extreme consumerism, his Sunnah of Zuhd (minimalism and detachment) is the cure. In an age of digital anger, his Sunnah of Hilm (forbearance) is the shield." },
            { type: "hadith", translation: "Whoever revives my Sunnah then he has loved me. And whoever loved me, he shall be with me in Paradise. (Sunan at-Tirmidhi 2678)", arabic: "مَنْ أَحْيَا سُنَّتِي فَقَدْ أَحَبَّنِي" },
            { type: "scholar", translation: "You cannot claim to love someone while continuously opposing everything they stand for. True love manifests in obedience. (Ibn al-Qayyim)", arabic: "المحبة توجب الموافقة" },
            { type: "infographic", layout: "process", items: [
                { title: "Learn", description: "Read the Seerah (Biography) to know the man.", icon: "BookOpen" },
                { title: "Love", description: "Let the knowledge create a deep, emotional connection.", icon: "Heart" },
                { title: "Live", description: "Reflect that love in your choices tomorrow.", icon: "Activity" }
            ]},
            { type: "text", content: "### Culture vs Sunnah\n\nIt is crucial to differentiate between the cultural norms of 7th century Arabia (which are entirely permissible but not necessarily religious mandates) and the universal, timeless religious rulings (like honoring parents or praying the night prayer). The Sunnah is flexible enough to thrive in any culture while elevating its morals." },
            { type: "reflection", translation: "If the Prophet (PBUH) were to sit in my living room or look at my internet history, would he recognize me as his follower?", arabic: "فليحذر الذين يخالفون عن أمره" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "To follow him is to be a stranger in a world that has forgotten God, but it is to be intimate with the Creator of the world." },
            { type: "quiz", question: "What is the true measure of 'loving Allah' according to Surah Ali 'Imran 3:31?", options: ["Saying 'I love Allah' 100 times", "Following the Prophet (PBUH)", "Going to the desert", "Never sleeping"], correctIndex: 1, hint: "In kuntum tuhibbunna Allah fat-tabi'ooni..." },
            { type: "quiz", question: "The lesson highlights that reducing the Sunnah ONLY to specific clothing misses its core. What is the 'core' of the Sunnah?", options: ["Speaking Arabic", "Only eating dates", "The Prophetic character, ethics, and theology", "Riding horses"], correctIndex: 2, hint: "Ethics in business and family." },
            { type: "quiz", question: "According to the Hadith in Tirmidhi, what happens if someone 'revives the Sunnah' of the Prophet?", options: ["They get political power", "They prove they love him, and will be with him in Paradise", "They become angels", "They never get sick"], correctIndex: 1, hint: "Man ahya sunnati faqad ahabannii..." },
            { type: "quiz", question: "What does 'Ittiba' mean?", options: ["Conscious following/alignment of actions with the Prophet", "Innovation", "Memorization", "A type of tax"], correctIndex: 0, hint: "The opposite of Ibtida' (Innovation)." },
            { type: "quiz", question: "What is an example of applying the Sunnah to combat 'modern consumerism'?", options: ["Buying more things", "Prophetic Zuhd (minimalism and detachment from worldly greed)", "Borrowing with interest", "Avoiding technology"], correctIndex: 1, hint: "Asceticism cures greed." },
            { type: "document", title: "Applying the Sunnah", description: "A guide to incorporating prophetic habits into a corporate lifestyle.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Beautiful Character", description: "A translation of Al-Adab Al-Mufrad (Book of manners) by Imam Bukhari.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Module Assessment",
        blocks: [
            { type: "callout", content: "The scholars are the inheritors of the Prophets. The Prophets did not leave behind dinars or dirhams, but they left behind knowledge.", author: "Prophetic Hadith (Sunan Abi Dawud 3641)" },
            { type: "objectives", items: ["Verify the understanding of the definition and role of Prophethood (Nubuwwah)", "Confirm the finality of Prophet Muhammad (Khatm an-Nubuwwah)", "Assess knowledge of the Prophet's characteristics (Ismah)", "Demonstrate comprehension of the Sunnah as foundational to Islam"] },
            { type: "text", content: "## Prophethood Knowledge Check\n\nThe 9th module covers the vast topic of the Guides sent to humanity. You have learned why they were sent, how they functioned, and why the door of Prophecy is now permanently closed." },
            { type: "infographic", layout: "grid", items: [
                { title: "Necessity", description: "Reason alone cannot find the details of salvation.", icon: "Brain" },
                { title: "Perfection", description: "Prophets are protected (Ma'sum) in delivering the message.", icon: "Shield" },
                { title: "Finality", description: "The message was completed in 7th century Arabia.", icon: "Lock" },
                { title: "Application", description: "The Sunnah is the blueprint for living the Quran.", icon: "BookOpen" }
            ]},
            { type: "quran", translation: "Nor does he speak from [his own] inclination. It is not but a revelation revealed [to him]. (Surah An-Najm 53:3-4)", arabic: "وَمَا يَنطِقُ عَنِ الْهَوَىٰ ۞ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ" },
            { type: "text", content: "### Final Assessment\n\nPlease answer the following questions to verify your completion of Module 9." },
            { type: "quiz", question: "If the Quran is the 'What', what is the Sunnah?", options: ["The 'When'", "The 'How' (practical application)", "The 'Where'", "There is no connection"], correctIndex: 1, hint: "It details the method." },
            { type: "quiz", question: "Which term denotes the Protection (infallibility) of Prophets from major sins?", options: ["Amanah", "Sidq", "Ismah", "Sabr"], correctIndex: 2, hint: "Ma'sum." },
            { type: "quiz", question: "What is the primary difference identified between a Nabi and a Rasul?", options: ["A Rasul brings a new book/law, a Nabi operates under an existing one", "A Rasul is divine", "There is no difference", "A Nabi is a poet"], correctIndex: 0, hint: "A Messenger vs a Prophet." },
            { type: "quiz", question: "Why is an 'unlettered' (Ummi) Prophet a stronger proof for the Quran's divinity?", options: ["It isn't", "Because a man who cannot read or write cannot copy vast historical and theological data from previous books", "Because Arabs liked unlettered people", "Because it makes reading easier"], correctIndex: 1, hint: "It eliminates the claim of plagiarism." },
            { type: "quiz", question: "What happens to the claim of anyone arriving today and calling themselves a new prophet?", options: ["It should be evaluated based on their miracles", "It must be rejected utterly, as Muhammad (PBUH) is the absolute Seal of the Prophets", "It might be accepted", "Only if they bring a new book"], correctIndex: 1, hint: "La Nabiyya ba'dee." },
            { type: "quiz", question: "Is the claim that 'We only need the Quran, not the Hadith' theologically sound?", options: ["Yes, the Quran is enough for everything", "No, because the Quran itself commands obedience to the Messenger and lacks the specific details of worship found only in the Sunnah", "Maybe", "Yes, if the person is smart"], correctIndex: 1, hint: "The Sunnah explains the Quran." },
            { type: "quiz", question: "Which verse explicitly names Muhammad (PBUH) as the 'last of the prophets'?", options: ["Surah Al-Ahzab 33:40", "Surah Al-Fatihah", "Surah Yasin", "Surah Al-Ikhlas"], correctIndex: 0, hint: "Khatam an-Nabiyyin." },
            { type: "conclusion", content: "Congratulations on completing Module 9. You are now ready to tackle the greatest unknown: Module 10 - The Afterlife." },
            { type: "document", title: "Module 9 Synthesis", description: "A summary chart of the names of the Prophets mentioned in the Quran.", url: "https://kalamullah.com/", platform: "Course Assets" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 9 (LESSON 6-7) ---');
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
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title.replace(' ﷺ', '')}%`);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE (${finalBlocks.length} Blocks Seeded)`);
        }
    }
}

seedLessons();
