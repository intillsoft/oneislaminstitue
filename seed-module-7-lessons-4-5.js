const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Secularism & Islam",
        blocks: [
            { type: "callout", content: "Secularism is not just the separation of church and state; it is often the separation of the soul from its source of guidance in the public square.", author: "Modern Sociological Perspective" },
            { type: "objectives", items: ["Define Secularism and its historical roots in Europe", "Understand the Islamic perspective on the role of religion in public life", "Analyze the concept of 'Shura' (Consultation) and justice", "Address the tension between 'Material Progress' and 'Spiritual Integrity'"] },
            { type: "text", content: "## Faith in the Public Square\n\nOne of the most pervasive challenges today is Secularism—the idea that religion should be a private hobby and have no influence on law, education, or economics. Islam, however, is a 'Din' (Way of Life) that provides a moral compass for both the private home and the public street." },
            { type: "concept", translation: "Ad-Din: A comprehensive way of life that encompasses creed (Aqidah), law (Shariah), and character (Akhlaq).", arabic: "الدين" },
            { type: "quran", translation: "Say, 'Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.' (Surah Al-An'am 6:162)", arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Private Faith", description: "Prayer, fasting, and individual remembrance.", icon: "User" },
                { title: "Public Ethics", description: "Honesty in business, justice in law, and care for society.", icon: "Gavel" },
                { title: "Education", description: "Seeking knowledge as a holistic duty.", icon: "Book" },
                { title: "Economics", description: "Interest-free systems and wealth distribution (Zakat).", icon: "DollarSign" }
            ]},
            { type: "text", content: "### The Myth of Neutrality\n\nMany think Secularism is 'neutral'. However, if a state decides that life begins at conception or that it doesn't, it is making a moral choice. Islam argues that since Allah is the Creator of all, His guidance is the most 'neutral' and just standard for human flourishing." },
            { type: "scholar", translation: "Politics without morality is tyranny, and morality without religion is a house built on sand. (Classical scholars)", arabic: "السياسة الشرعية" },
            { type: "quran", translation: "And those who do not judge by what Allah has revealed - then it is those who are the disbelievers/wrongdoers/defiant. (Surah Al-Ma'idah 5:44-47)", arabic: "وَمَن لَّمْ يَحْكُم بِمَا أَنزَلَ اللَّهُ" },
            { type: "infographic", layout: "process", items: [
                { title: "Submission", description: "Recognizing Allah's sovereignty over all aspects.", icon: "Zap" },
                { title: "Consultation", description: "Developing systems based on Shura and Justice.", icon: "Users" },
                { title: "Service", description: "Using power as a trust (Amanah) to serve people.", icon: "Shield" }
            ]},
            { type: "text", content: "### Modern Challenges\n\nIn a secular world, success is often measured only by GDP and consumption. Islam redefines success (Falah) to include spiritual contentment and success in the Hereafter. A society can be technologically advanced but spiritually bankrupt." },
            { type: "reflection", translation: "Do I live two lives—one where I am a 'Muslim' in the Mosque, and one where I am a 'Secularist' at my job?", arabic: "ادخلوا في السلم كافة" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Secularism asks us to compartmentalize our lives. Islam asks us to harmonize them. True peace comes when the public action matches the private conviction." },
            { type: "quiz", question: "What is the primary characteristic of 'Secularism'?", options: ["Belief in many gods", "Separation of religion from public/political life", "Praying five times a day", "Writing poetry"], correctIndex: 1, hint: "It comes from 'Saeculum' (Worldly/Of the age)." },
            { type: "quiz", question: "What does the term 'Ad-Din' imply in Islam?", options: ["Only a personal prayer method", "A comprehensive way of life", "A type of tax", "Only for scholars"], correctIndex: 1, hint: "The deen is 360 degrees." },
            { type: "quiz", question: "According to Surah Al-An'am 6:162, for whom should a believer's life and death be?", options: ["For his country", "For his family", "For Allah, Lord of the worlds", "For wealth"], correctIndex: 2, hint: "Lillahi Rabbil-'aalameen." },
            { type: "quiz", question: "What is 'Shura'?", options: ["Consultation/Mutual counsel in governance and life", "A type of food", "Running a race", "Silence"], correctIndex: 0, hint: "A key Islamic political principle." },
            { type: "quiz", question: "How does Islam measure 'Success' (Falah)?", options: ["Only through wealth", "Only through social status", "Holistically: through faith, action, and the Hereafter", "It doesn't"], correctIndex: 2, hint: "Hayya 'ala al-Falah." },
            { type: "document", title: "Islam and Secularism", description: "Syed Muhammad Naquib al-Attas's profound analysis of the secular challenge.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Public Ethics in Islam", description: "A guide to maintaining Islamic integrity in a non-Islamic workplace.", url: "https://yaqeeninstitute.org/", platform: "Islamic Ethics" }
        ]
    },
    {
        title: "Doubt & Sincerity",
        blocks: [
            { type: "callout", content: "Having a doubt is like having a question in a classroom; it is not a sign that you have failed, but a sign that you are thinking. The danger is not the doubt, but staying silent about it.", author: "Spiritual Advice for the Modern Youth" },
            { type: "objectives", items: ["Differentiate between 'Intellectual Doubt' and 'Spiritual Whim' (Shubhah vs Shahwah)", "Learn how to transform doubts into certain knowledge through research", "Analyze the role of 'Ikhlas' (Sincerity) in protecting the heart", "Understand that even the Sahaba faced intrusive thoughts and were praised for resisting them"] },
            { type: "text", content: "## The Heart in a Storm\n\nIn an age of information overload, it is common to encounter ideas that challenge one's faith. Many feel 'guilty' for having doubts. However, the Islamic tradition encourages seeking answers and using the intellect as a tool for grounding one's conviction." },
            { type: "concept", translation: "Shubhah (Doubt/Misconception): An idea that appears true but is actually based on a fallacy or lack of knowledge.", arabic: "الشبهة" },
            { type: "quran", translation: "So ask the people of the message [scholars] if you do not know. (Surah Al-Anbiya 21:7)", arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Acknowledge", description: "Don't suppress the doubt; write it down clearly.", icon: "Edit" },
                { title: "Trace the Source", description: "Is this a logic question or an emotional one?", icon: "Search" },
                { title: "Consult Expertise", description: "Ask those who have spent decades studying.", icon: "Users" },
                { title: "Pray (Dua)", description: "Ask the 'Turner of Hearts' for steadfastness.", icon: "Sunrise" }
            ]},
            { type: "text", content: "### Even the Sahaba Faced It\n\nSome companions came to the Prophet (PBUH) and said, 'We find in our souls thoughts that are too terrible to speak of.' He asked, 'Do you really find that?' They said 'Yes.' He said, 'That is clear faith.' Their hatred for the doubt was proof of their sincere Iman." },
            { type: "hadith", translation: "Some of the companions of the Prophet said... 'We find in ourselves what is too great to speak of.' He said: 'That is clear faith.' (Sahih Muslim 132)", arabic: "ذَاكَ صَرِيحُ الإِيمَانِ" },
            { type: "scholar", translation: "Sincerity (Ikhlas) is the secret between a servant and his Lord. Not even an angel can record it, nor a devil can corrupt it. (Al-Junayd)", arabic: "الإخلاص سر بين الله وبين العبد" },
            { type: "infographic", layout: "process", items: [
                { title: "Intrusive Thought", description: "A dark idea flashes.", icon: "Zap" },
                { title: "Rejection", description: "Recognizing it as contrary to truth.", icon: "Shield" },
                { title: "Reward", description: "The struggle to reject earns pleasure from Allah.", icon: "Award" }
            ]},
            { type: "text", content: "### The Shield of Sincerity\n\nSincerity (Ikhlas) is the most powerful weapon against doubt. If your intention is truly to find the Truth, and not just to justify your own desires, Allah will guide you. Doubts often flourish when there is a hidden desire to be 'free' from religious obligations." },
            { type: "reflection", translation: "Do I want an answer to my doubt, or do I want my doubt to be an excuse for me to stop practicing?", arabic: "أفرأيت من اتخذ إلهه هواه" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Doubt is the beginning of investigation, and investigation leads to certainty. The Quran is a book for 'those who think' and those who have 'intelligence'. Do not fear the question; fear the neglect of the answer." },
            { type: "quiz", question: "What is the Prophet's (PBUH) definition of 'Clear Faith' (Sarikh al-Iman) in the context of intrusive thoughts?", options: ["Never having a doubt", "Feeling terrible about having an intrusive/doubtful thought", "Following the doubt", "Being cold towards faith"], correctIndex: 1, hint: "Their dislike of the thought was proof of love for truth." },
            { type: "quiz", question: "What does 'Shubhah' mean?", options: ["Absolute truth", "A misconception or doubt that appears true", "A type of charity", "A beautiful poem"], correctIndex: 1, hint: "Something that 'resembles' the truth but isn't." },
            { type: "quiz", question: "According to Surah Al-Anbiya 21:7, what should we do when we don't know something?", options: ["Guess", "Ask the people of knowledge (Ahl al-Dhikr)", "Forget it", "Make up an answer"], correctIndex: 1, hint: "Fas'alu ahla al-dhikri..." },
            { type: "quiz", question: "Why is 'Ikhlas' (Sincerity) considered a shield against confusion?", options: ["It makes you smarter", "Allah guides those who are truly seeking Him", "It's a secret code", "It replaces studying"], correctIndex: 1, hint: "The intention determines the guidance." },
            { type: "quiz", question: "What is the 'Epicurean Paradox' related to?", options: ["The Problem of Evil", "The direction of prayer", "Scientific methodology", "Fasting rules"], correctIndex: 0, hint: "See previous lessons (or common knowledge) - it deals with why suffering exists." },
            { type: "document", title: "Dealing with Doubts", description: "A series of articles for Muslims struggling with specific theological questions.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Purification of the Soul", description: "Ibn Qayyim's exercises for strengthening 'Ikhlas'.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 7 (DOUBTS) TO 20+ BLOCKS ---');
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
