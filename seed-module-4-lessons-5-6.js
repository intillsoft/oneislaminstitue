const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Applying Allah's Names",
        blocks: [
            { type: "callout", content: "To know the Name is one thing; to live by the Name is true knowledge. Every Name of Allah has a corresponding effect on the heart and character of the believer.", author: "Ibn Qayyim (Madarij as-Salikeen)" },
            { type: "objectives", items: ["Understand the practical 'trace' (Athar) of Allah's Names in life", "Learn how to color one's character with the meanings of Divine Beauty", "Explore the concept of 'At-Takhalluq' (Refining character) through Divine Attributes", "Identify how to use specific names for specific life challenges"] },
            { type: "text", content: "## From Theory to Transformation\n\nIslamic monotheism is not a set of abstract philosophical definitions. It is a lived reality. When we learn that Allah is 'Al-Baseer' (The All-Seeing), it is not just to answer a quiz question; it is to transform how we behave when we are alone." },
            { type: "concept", translation: "Al-Athar (The Trace/Effect): The practical impact that belief in a specific name of Allah has on a person's emotions, actions, and character.", arabic: "آثار الإقرار بالأسماء والصفات" },
            { type: "infographic", layout: "grid", items: [
                { title: "Al-Haleem (Forbearing)", description: "Belief in His patience leads us to be patient with others.", icon: "Sunrise" },
                { title: "Al-Karim (Generous)", description: "Belief in His bounty leads us to be generous to the poor.", icon: "Hand" },
                { title: "Al-Afuww (Pardoner)", description: "Belief in His pardon leads us to forgive those who hurt us.", icon: "RefreshCw" },
                { title: "Al-Hakeem (Wise)", description: "Belief in His wisdom leads us to accept difficult trials.", icon: "Shield" }
            ]},
            { type: "quran", translation: "Indeed, Allah is Case-Accepting and Merciful. (Surah An-Nisa 4:16)", arabic: "إِنَّ اللَّهَ كَانَ تَوَّابًا رَّحِيمًا" },
            { type: "hadith", translation: "Show mercy to those on earth, and the One in the heavens will show mercy to you. (Sunan at-Tirmidhi 1924, Authentic)", arabic: "ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ" },
            { type: "scholar", translation: "Allah is Beautiful and He loves beauty; He is Generous and He loves generosity. (Scholarly deduction from various Hadiths)", arabic: "إن الله جميل يحب الجمال" },
            { type: "text", content: "### The Concept of At-Takhalluq\n\nScholars use the term 'At-Takhalluq' to describe the process of adopting the qualities that Allah loves. If Allah is 'Ash-Shakoor' (The Appreciative), we should strive to be appreciative people. If He is 'Al-Adl' (The Just), we must be just in our homes and businesses." },
            { type: "infographic", layout: "process", items: [
                { title: "Knowledge", description: "Learning the meaning of the Name.", icon: "BookOpen" },
                { title: "Meditation", description: "Finding the Name's effect in the universe.", icon: "Eye" },
                { title: "Implementation", description: "Acting in a way that aligns with the Name.", icon: "Zap" }
            ]},
            { type: "text", content: "### Names for Every Moment\n\nA believer switches between names as life changes. In times of poverty, they call upon 'Ar-Razzaq'. In times of sin, they call upon 'Al-Ghaffar'. In times of confusion, they call upon 'Al-Hadi' (The Guide). This creates a constant, dynamic conversation with the Divine." },
            { type: "reflection", translation: "If I find it hard to forgive my brother, have I forgotten that I am constantly asking 'Al-Afuww' (The Pardoner) to forgive me?", arabic: "فليعفوا وليصفحوا" },
            { type: "hadith", translation: "Verily, for Allah there are ninety-nine names... whoever 'ahsaha' (lives by them/guards them) will enter Paradise. (Sahih al-Bukhari 2736)", arabic: "مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Allah introduced His names so that we could find our way back to Him. Each name is a path; each attribute is a light." },
            { type: "quiz", question: "What does the term 'Al-Athar' refer to in this context?", options: ["An ancient ruin", "The practical effect of a Name on character", "A type of Hadith", "A scientific law"], correctIndex: 1, hint: "The 'trace' left in the heart." },
            { type: "quiz", question: "According to the Hadith in Tirmidhi 1924, what is the reward for showing mercy to those on earth?", options: ["Wealth", "The One in the heavens will show mercy to you", "Fame", "Nothing"], correctIndex: 1, hint: "Irhamu man fi al-ard..." },
            { type: "quiz", question: "When a believer faces a difficult outcome they didn't want, which Name should they lean on for comfort?", options: ["Al-Muntaqim (The Avenger)", "Al-Hakeem (The All-Wise)", "Al-Mudabbir", "Both 2 and 3"], correctIndex: 3, hint: "Relying on His perfect management and wisdom." },
            { type: "quiz", question: "Which name should you invoke when you feel lost and need direction in life?", options: ["Ar-Razzaq", "Al-Hadi (The Guide)", "Al-Qahhar", "Al-Malik"], correctIndex: 1, hint: "The One who guides." },
            { type: "quiz", question: "What is 'At-Takhalluq'?", options: ["Creating new names", "Adopting the character traits that Allah loves", "Memorizing without understanding", "Arguing about theology"], correctIndex: 1, hint: "Improving character through divine inspiration." },
            { type: "document", title: "Living the Names", description: "A practical guide on spiritual exercises related to each of the 99 names.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Charitable Faith", description: "How 'Al-Karim' and 'Al-Wahhab' inspire a life of service.", url: "https://yaqeeninstitute.org/", platform: "Islamic Ethics Series" }
        ]
    },
    {
        title: "Misunderstandings",
        blocks: [
            { type: "callout", content: "The scholars of the Sunnah walk a middle path between those who strip Allah of His attributes (Mu'attilah) and those who liken Him to His creation (Mushabbihah).", author: "Imam Al-Barbahari (Sharh as-Sunnah)" },
            { type: "objectives", items: ["Identify the two extreme deviations in understanding attributes", "Learn the concept of 'Ta'wil' (Metaphorical interpretation) and its dangers", "Understand the concept of 'Tajsim' (Anthropomorphism) and its refutation", "Analyze the orthodox methodology of 'Ithbat bi-la Tamthil'"] },
            { type: "text", content: "## Navigating the Middle Path\n\nThe most beautiful names and attributes of Allah have often been the subject of intense theological debate. To protect our creed, we must understand the errors that lead to a distorted view of the Creator." },
            { type: "concept", translation: "Ta'til (Denial): Negating the attributes that Allah has established for Himself, often claiming they are just metaphors.", arabic: "التعطيل" },
            { type: "concept", translation: "Tamthil (Likening): Comparing Allah's attributes to the attributes of human beings (Anthropomorphism).", arabic: "التمثيل" },
            { type: "infographic", layout: "process", items: [
                { title: "Deviation 1: Ta'til", description: "Stripping God of attributes. Result: An abstract 'nothing'.", icon: "XCircle" },
                { title: "Middle Path: Sunnah", description: "Affirmation without comparison. Result: A known God who is beyond likeness.", icon: "CheckCircle" },
                { title: "Deviation 2: Tamthil", description: "Likening God to humans. Result: An idol-like concept.", icon: "XCircle" }
            ]},
            { type: "quran", translation: "Vision perceives Him not, but He perceives [all] vision; and He is the Subtle, the Acquainted. (Surah Al-An'am 6:103)", arabic: "لَّا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ ۖ وَهُوَ اللَّطِيفُ الْخَبِيرُ" },
            { type: "text", content: "### The Myth of 'Metaphor Only'\n\nSome groups, in their attempt to 'protect' Allah from human-likeness, claimed that when the Quran says Allah 'hears', it only means 'He knows'. The scholars of the Sunnah rejected this, arguing that Allah used specific words for specific attributes. We affirm the attribute itself (Hearing) but deny the *mechanism* (human ears)." },
            { type: "scholar", translation: "Affirming an attribute is not likening (Tamthil). Likening is to say: He has a hand like my hand, or hearing like my hearing. (Na'im ibn Hammad)", arabic: "ليس لشيء من صفاته مثل" },
            { type: "hadith", translation: "When Allah completed the creation, He wrote in His book which is with Him on His Throne: 'Verily, My mercy prevails over My wrath.' (Sahih al-Bukhari 7404)", arabic: "إِنَّ رَحْمَتِي تَغْلِبُ غَضَبِي" },
            { type: "text", content: "### The Concept of Bi-la Kayf\n\nThe great Imam Malik summed it up perfectly: when asked about an attribute, we say: 'The meaning is known (in language), the manner (how) is unknown (to us), believing in it is obligatory, and asking 'how' is an innovation.' This preserves the mystery while affirming the truth." },
            { type: "infographic", layout: "grid", items: [
                { title: "Avoid Tahrif", description: "Don't distort the wording.", icon: "Type" },
                { title: "Avoid Ta'til", description: "Don't deny the attribute.", icon: "X" },
                { title: "Avoid Takyif", description: "Don't ask 'how'.", icon: "HelpCircle" },
                { title: "Avoid Tamthil", description: "Don't make comparisons.", icon: "Copy" }
            ]},
            { type: "reflection", translation: "If I cannot even understand the nature of my own soul, how can I demand to understand the 'how' of the Creator's attributes?", arabic: "ولا يحيطون به علما" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "To know Allah is to know your limits. We affirm what He said about Himself, and we stop our imagination at the border of His absolute Uniqueness." },
            { type: "quiz", question: "What is the extreme error of 'Ta'til'?", options: ["Likening Allah to humans", "Stripping or denying Allah of His established attributes", "Affirming every name too literally", "Praising the Prophet too much"], correctIndex: 1, hint: "It means 'vacating' or 'stripping' meanings." },
            { type: "quiz", question: "What is the extreme error of 'Tamthil'?", options: ["Denying God exists", "Comparing Allah's attributes to human attributes", "Giving money to the poor", "Reading too much Quran"], correctIndex: 1, hint: "Thinking God is 'like' us." },
            { type: "quiz", question: "Which Imam famously stated the 'Bi-la Kayf' rule for attributes?", options: ["Imam Malik", "Imam Ash-Shafi'i", "Imam Abu Hanifa", "Imam Ahmad"], correctIndex: 0, hint: "His rule regarding 'Istiwa' is legendary." },
            { type: "quiz", question: "According to Sahih al-Bukhari 7404, what 'prevails' over Allah's wrath?", options: ["His Power", "His Knowledge", "His Mercy", "His Justice"], correctIndex: 2, hint: "Inna rahmati taghlibu ghadhabi." },
            { type: "quiz", question: "In the rule 'Ithbat bi-la Tamthil', what does 'Ithbat' mean?", options: ["Comparison", "Denial", "Affirmation", "Forgetfulness"], correctIndex: 2, hint: "To establish/affirm the truth." },
            { type: "document", title: "The Middle Path in Creed", description: "A refutation of Both Ta'til and Tamthil based on early scholarship.", url: "https://kalamullah.com/", platform: "Classical Archives" },
            { type: "document", title: "God and Metaphor", description: "Analyzing the linguistic limits of describing the Divine in Islamic thought.", url: "https://yaqeeninstitute.org/", platform: "Philosophical Series" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 4 (APPLICATIONS) TO 20+ BLOCKS ---');
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
