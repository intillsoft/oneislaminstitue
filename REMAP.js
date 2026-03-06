const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const uid = () => `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const rawLessons = [
{
    id: 'bbea10ea-a0aa-406a-878f-0b4536b476af',
    title: "Definition of Iman in Qur'an and Sunnah",
    blocks: [
        { origType: 'hook', title: 'The Heart That Cannot Rest', content: 'A successful surgeon returns home after saving three lives. Yet lying in the dark, she feels a hollow ache she cannot name. Wealth, status, skill — none of it fills the void. This lesson begins the journey toward understanding what that void is, and what alone can fill it: Iman.' },
        { origType: 'bridgeFromPreviousLesson', title: 'Where We Begin', content: 'This is the opening lesson of the course. There is no previous lesson — but there is a previous life. You bring your doubts, your questions, your inherited beliefs. This lesson meets you exactly there and lays the first brick of conviction.' },
        { origType: 'learningObjectives', title: 'What You Will Learn', items: ['Define Iman according to Qur\'an and authentic Sunnah.', 'Distinguish between Iman as declaration vs. Iman as a comprehensive state.', 'Identify the three inseparable dimensions of faith: heart, tongue, limbs.', 'Recognize the feedback loop between conviction and conduct.'] },
        { origType: 'keyTerms', title: 'Key Terms', content: '**Tasdiq** — Heartfelt affirmation; the heart\'s recognition and acceptance of truth.\n\n**Iqrar** — Verbal testimony; the public and private declaration of belief.\n\n**Amal** — Action by the limbs; the outward manifestation of inward conviction.\n\n**Iman** — The comprehensive state of faith encompassing all three above dimensions.' },
        { origType: 'coreTeaching', title: 'What Iman Is NOT', content: 'Iman is not a feeling that comes and goes with our mood. It is not a cultural identity inherited without examination. It is not a box ticked by saying words without understanding. Al-Hasan al-Basri stated: "Faith is not through outward adornment or wishful thinking — it is what settles in the heart and is proven by deeds."' },
        { origType: 'coreTeaching', title: 'The Three-Dimensional Reality of Iman', content: 'Classical scholars systematized Iman into three inseparable dimensions:\n\n**1. Tasdiq bil-Qalb** — Conviction of the heart. The heart "knows" and submits to the truth.\n**2. Iqrar bil-Lisan** — Affirmation of the tongue. The lips publicly testify.\n**3. Amal bil-Jawarih** — Action of the limbs. The body lives the belief.\n\nRemove any one dimension, and the structure weakens. A person who "believes in the heart" but never acts has a faith that has stalled.' },
        { origType: 'coreTeaching', title: 'Iman as a Living, Breathing Reality', content: 'The Qur\'an (8:2) describes true believers as those whose hearts tremble at the mention of Allah and whose faith increases upon hearing His verses. This is experiential, not merely intellectual. Faith is not a document signed once — it is a relationship maintained daily.' },
        { origType: 'coreTeaching', title: 'The Feedback Loop: Belief ↔ Action', content: 'Spiritual conviction drives ethical conduct. Ethical conduct, in turn, reinforces conviction. This is the divine feedback loop:\n\n→ You believe Allah is Al-Basir (All-Seeing)\n→ You behave with integrity even alone\n→ Acting with integrity deepens your awareness of being seen\n→ That awareness increases Iman\n\nBreaking this loop — believing without acting — produces spiritual stagnation.' },
        { origType: 'coreTeaching', title: 'The Garment Analogy', content: 'The Prophet ﷺ said: "Iman wears out in the heart of any one of you just as a garment wears out." (Al-Hakim, authenticated). Just as a worn garment needs washing, mending, and eventually replacing, Iman requires constant renewal through deliberate spiritual effort — dhikr, knowledge, good deeds, and repentance.' },
        { origType: 'coreTeaching', title: 'Over 70 Branches of Iman', content: 'The Prophet ﷺ said: "Iman has over seventy branches — or over sixty — the highest of which is to say \'La ilaha illallah\' and the lowest of which is to remove something harmful from the road. And modesty is a branch of Iman." (Muslim, 35)\n\nThis hadith demolishes the idea that faith is only a private, internal affair. Removing harm from a footpath is an act of faith.' },
        { origType: 'quranEvidence', title: 'Qur\'anic Evidence', content: '• Surah Al-Anfal 8:2 — "The believers are only those who, when Allah is mentioned, their hearts tremble; and when His verses are recited, it increases them in faith."\n• Surah Al-Hujurat 49:15 — "The true believers are only those who have believed in Allah and His Messenger and then had no doubt."\n• Surah Al-Baqarah 2:177 — Describes true righteousness as combining belief AND action in an integrated whole.' },
        { origType: 'hadithEvidence', title: 'Hadith Evidence', content: '• Sahih Muslim 35 — "Iman has over seventy branches; the highest is La ilaha illallah, the lowest is removing harm from a path."\n• Al-Hakim (authenticated) — "Iman wears out in the heart as garments wear out."\n• Al-Hasan al-Basri (reported in Shu\'ab al-Iman) — "Faith is not through wishful thinking; it is what settles in the heart and is proven by deeds."' },
        { origType: 'scholarInsight', title: 'Scholar Insight', content: '**Imam al-Ghazali** (d. 1111 CE) in *Ihya Ulum al-Din* wrote that the heart is the "king" and the limbs are its subjects. When the king is corrupted (weak Iman), the kingdom descends into chaos (disordered life). When the king is sound, order flows outward naturally.\n\n**Ibn Hajar al-Asqalani** summarized the mainstream Sunni position: Iman increases with obedience and decreases with sin — confirming it is a dynamic, fluctuating state, not a fixed binary.' },
        { origType: 'misconceptionCorrection', title: 'Common Misconception', content: '**Misconception:** "I have faith in my heart — I don\'t need to pray or act on it. God knows my intentions."\n\n**Correction:** Sincere internal belief that never produces any outward fruit contradicts the Prophetic model and classical theological consensus. The heart and limbs are connected. A heart truly \'settled\' in Iman naturally seeks expression through action. The absence of action is evidence the root is diseased, not just that the fruit is delayed.' },
        { origType: 'scenarioCaseStudy', title: 'Case Study: The Silent Surgeon', content: 'Dr. Layla is a respected cardiac surgeon. She was raised Muslim, says she "believes in God," but has not prayed in eight years. She reasoned: "My work saves lives — that\'s my worship."\n\nAfter a patient dies despite her best efforts, she feels spiritually shattered. She realizes her "belief" had no structure — no daily connection, no renewal. A colleague invites her to a class on Iman. She discovers she had the declaration (Iqrar) but the heart had drifted, and the limbs had followed.\n\n**Discussion:** What was missing from Dr. Layla\'s Iman? Which of the three dimensions had weakened? What would a "revival plan" look like?' },
        { origType: 'miniActivity', title: 'The Iman Audit', content: '**Step 1:** On paper, draw three columns: Heart | Tongue | Limbs\n**Step 2:** Under each column, list 3 things you currently do that reflect that dimension of your faith (e.g., Tongue: you say Bismillah before eating).\n**Step 3:** Identify which column is the weakest for YOU right now.\n**Step 4:** Write one practical action you will add this week to strengthen that dimension.\n**Step 5:** Share it with one trusted person for accountability.' },
        { origType: 'modernApplication', title: 'Faith in the Age of Anxiety', content: 'Mental health professionals report a crisis of meaning in modern life. People have more information, comforts, and options than any previous generation — yet depression and anxiety are at record highs. Islamic theology offers a diagnosis: disconnection from the root of meaning. Iman in its full, three-dimensional form provides not just a belief system but a structured daily relationship with the source of existence — the very antidote to existential emptiness.' },
        { origType: 'modernApplication', title: 'Iman in the Digital Age', content: 'Social media has created a culture of performed identity. People display religiosity (Iqrar) without the inner reality (Tasdiq). This is the modern equivalent of the garment with no fabric — all display, no substance. Reclaiming Iman in the digital age means intentionally building the private, unseen dimensions of faith: secret worship, private dhikr, anonymous charity. These are the roots that hold when public storms arrive.' },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 1', question: 'According to Al-Hasan al-Basri, what is true Iman?', options: ['Saying the Shahada publicly', 'What settles in the heart and is proven by action', 'Performing Hajj', 'Having strong emotions during worship'], correctIndex: 1 },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 2', question: 'Which Surah and verse describes believers whose hearts tremble at the mention of Allah?', options: ['Al-Baqarah 2:1', 'Al-Anfal 8:2', 'Al-Hujurat 49:14', 'Al-Ikhlas 112:1'], correctIndex: 1 },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 3', question: 'Which of these is NOT one of the three dimensions of Iman?', options: ['Tasdiq (heart)', 'Iqrar (tongue)', 'Tafakkur (reflection)', 'Amal (action)'], correctIndex: 2 },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 4', question: 'What does the "garment" analogy for Iman teach us?', options: ['Iman looks different on everyone', 'Iman wears out and needs constant renewal', 'Iman is inherited from parents', 'Iman is only for scholars'], correctIndex: 1 },
        { origType: 'shortAnswer', title: 'Short Answer Questions', content: '**SAQ1:** Explain the feedback loop between Iman and action. Use a concrete example from daily life.\n\n**SAQ2:** Why is the "over 70 branches" hadith significant for understanding the scope of Iman?' },
        { origType: 'guidedReflection', title: 'Guided Reflection', content: 'Think of a moment in your life when your faith felt most alive — when Iman was not just a word but a felt reality. What were you doing? Who were you with? What had you been feeding your heart in the days before?\n\nNow think about your life right now. What has changed? What are the gaps? Write 5 sentences about what "reviving that feeling" would look like in practical terms this week.' },
        { origType: 'actionPlan', title: 'Your 7-Day Iman Action Plan', content: '**Day 1:** Audit your schedule — identify 3 existing actions that testify to your faith.\n**Day 2:** Select one Prophetic habit (e.g., saying Bismillah, smiling at others, removing litter) and commit to it all day.\n**Day 3:** Read Surah Al-Anfal 8:2 and sit with it for 5 minutes in silence.\n**Day 4:** Perform one "invisible" act of worship — no one knows except Allah.\n**Day 5:** Review the three dimensions: which needs most work this week?\n**Day 6:** Tell one person something true about their worth — act from Iman.\n**Day 7:** Renew your Niyyah (intention) before every single action.' },
        { origType: 'dua', title: 'Du\'a for Firm Faith', arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', english: 'O Turner of Hearts, keep my heart firm upon Your religion.' },
        { origType: 'youtubeRecommendedLecture', title: 'The Beauty of Faith', url: 'https://www.youtube.com/watch?v=m1RqRgFBrxI' },
        { origType: 'summary', title: 'Lesson Synthesis', content: 'Iman is not a feeling or a label — it is a three-dimensional reality: heart, tongue, and limbs. Al-Hasan al-Basri taught that true faith settles in the heart AND is proven by deeds. Iman is dynamic — it increases with obedience and decreases with neglect. The garment analogy reminds us that faith wears out and must be actively renewed. Even removing harm from a path is a branch of Iman — faith has social dimensions.' },
        { origType: 'document', title: 'Yaqeen Institute — Faith Revival Series', platform: 'Yaqeen Institute', description: 'Deep dive series on renewing Iman.', url: 'https://yaqeeninstitute.org/series/faith-revival' },
        { origType: 'document', title: 'SeekersGuidance — What Is Iman?', platform: 'SeekersGuidance', description: 'Academic breakdown of the reality of Iman.', url: 'https://seekersguidance.org/answers/aqeedah-creed/what-is-the-reality-of-iman-and-how-can-i-truly-be-a-mumin/' }
    ]
},
{
    id: '38d0e417-bd08-4eba-87d6-d05c0a3df97a',
    title: 'Linguistic vs Technical Meaning of Faith',
    blocks: [
        { origType: 'hook', title: 'The Word That Builds Civilizations', content: 'The Arabic root a-m-n (أ م ن) gave the world the word "Amin" — safety, security, trustworthiness. The same root gave us "Iman." Before a single prayer is discussed, this lesson asks: do you truly feel safe? Because the linguistic promise of this faith is that you can.' },
        { origType: 'bridgeFromPreviousLesson', title: 'Building on Lesson 1', content: 'Last lesson established that Iman is a three-dimensional reality: heart, tongue, and limbs. Now we go one level deeper — into the actual word "Iman." What does it mean at its linguistic root? And how does the technical (Shari\'i) definition expand that root?' },
        { origType: 'learningObjectives', title: 'What You Will Learn', items: ['Trace the linguistic root of Iman to its core meaning of security and safety.', 'Define the technical (Shari\'i) meaning of Iman as belief in the Prophet\'s message.', 'Explain why both meanings must coexist for faith to be functional.', 'Apply the "Amn" framework as a spiritual tool for managing modern anxiety.'] },
        { origType: 'keyTerms', title: 'Key Terms', content: '**Amn (أَمْن)** — Safety, security, the absence of fear.\n\n**Iman (إِيمَان)** — Technical: believing in Allah, His angels, books, messengers, the Last Day, and Divine Decree.\n\n**Lughawi** — Linguistic meaning.\n\n**Shar\'i** — Technical meaning.' },
        { origType: 'coreTeaching', title: 'The Root: A-M-N', content: 'The Arabic root أ-م-ن (A-M-N) generates a family of words that share a core meaning:\n\n• **Amn** — Security, safety\n• **Amanah** — Trust\n• **Amin** — Trustworthy one\n• **Iman** — The state of having granted security to a truth' },
        { origType: 'quranEvidence', title: 'Qur\'anic Evidence', content: '• Surah Quraysh 106:4 — "Who fed them against hunger and made them safe (amana-hum) from fear." — Security as a divine gift.\n• Surah Al-Ra\'d 13:28 — "Verily, in the remembrance of Allah do hearts find rest (tatma\'inn)."' },
        { origType: 'scholarInsight', title: 'Scholar Insight', content: '**Imam al-Jurjani** (*al-Ta\'rifat*): Defined Iman technically as "the acknowledgment by the heart and affirmation by the tongue of the truth of the Prophetic message." Both elements are essential.' },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 1', question: 'What is the linguistic root of the word Iman?', options: ['I-M-N', 'A-M-N', 'A-L-M', 'I-L-H'], correctIndex: 1 },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 2', question: 'According to Imam al-Jurjani, what constitutes Iman?', options: ['Prayer and fasting', 'Acknowledgment of the heart AND affirmation of the tongue', 'Feeling spiritual', 'Following cultural traditions'], correctIndex: 1 },
        { origType: 'guidedReflection', title: 'Guided Reflection', content: 'Sit quietly for 5 minutes. Ask yourself: "Where do I currently place my security? What makes me feel safe?" List three sources. Write: What would it feel like to make Allah the PRIMARY source of your Amn?' },
        { origType: 'dua', title: 'Du\'a for Security and Certainty', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْيَقِينَ وَالْعَافِيَةَ', english: 'O Allah, I ask You for certainty (in faith) and wellbeing.' },
        { origType: 'youtubeRecommendedLecture', title: 'Linguistic Depths of Iman', url: 'https://www.youtube.com/watch?v=F8TKK4-oe8I' },
        { origType: 'summary', title: 'Lesson Synthesis', content: 'Iman comes from A-M-N: safety, security, trust. Technical Iman: believing in the six pillars. Linguistic Iman: the lived experience of divine security. Both must coexist. The Prophet ﷺ was called Al-Amin because he embodied this security.' },
        { origType: 'document', title: 'Bayyinah Institute', platform: 'Bayyinah', description: 'Arabic root studies.', url: 'https://bayyinah.com' }
    ]
},
{
    id: '7b2c7cfe-bfc7-4d82-a42a-f236207d4fb7',
    title: 'Relationship Between Belief and Action',
    blocks: [
        { origType: 'hook', title: 'The Tree That Never Grew', content: 'A man plants a seed, waters it once, then walks away. "The seed was good," he insists. "I believed in it." But a seed needs consistent care to become a tree. Faith is the same.' },
        { origType: 'bridgeFromPreviousLesson', title: 'Building on Lesson 2', content: 'We established WHAT Iman is and WHERE it comes from. Next: Once you have Iman in your heart, what does it DO? This lesson maps the relationship between internal belief and outward action.' },
        { origType: 'learningObjectives', title: 'What You Will Learn', items: ['Explain the "tree" model of the relationship between belief and deed.', 'Analyze hadiths that directly link Iman to social conduct.', 'Identify specific "social branches" of faith.', 'Build a personal "faith-to-action" map.'] },
        { origType: 'coreTeaching', title: 'The Tree Model', content: 'The Qur\'an uses the tree metaphor (14:24). Classical scholars mapped this to faith:\n\n• **Roots** = Inward belief\n• **Branches** = Character and worship\n• **Fruit** = Benefit to self and society' },
        { origType: 'hadithEvidence', title: 'Hadith Evidence', content: '• Bukhari 6018, Muslim 47 — "Let whoever believes in Allah and Last Day speak good or be silent; honor neighbor; honor guest."\n• Abu Dawud 4682 — "Most complete in faith are those with best character."' },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 1', question: 'Which Surah uses the tree metaphor for faith?', options: ['Al-Ikhlas 112:1', 'Ibrahim 14:24', 'Al-Anfal 8:2', 'Al-Asr 103:2'], correctIndex: 1 },
        { origType: 'checkpointQuiz', title: 'Knowledge Check 2', question: 'According to Abu Dawud 4682, who is "most complete in faith"?', options: ['Those who pray the longest', 'Those who fast the most', 'Those with the best character', 'Those who give most charity'], correctIndex: 2 },
        { origType: 'guidedReflection', title: 'Guided Reflection', content: 'Think of one character trait you know needs work. What Name of Allah corresponds to the virtue you are aspiring toward? What ONE small action would close the gap today?' },
        { origType: 'dua', title: 'Du\'a for Righteous Character', arabic: 'اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَأَحْسِنْ خُلُقِي', english: 'O Allah, You have made my physical form good, so make my character good.' },
        { origType: 'youtubeRecommendedLecture', title: 'Faith and Character', url: 'https://www.youtube.com/watch?v=m1RqRgFBrxI' },
        { origType: 'summary', title: 'Lesson Synthesis', content: 'Belief and action are organically connected. "Most complete in faith are those with the best character". Niyyah (intention) transforms action into worship. Ibn al-Qayyim: the heart is king.' },
        { origType: 'document', title: 'Yaqeen - Morality Toolkit', platform: 'Yaqeen Institute', description: 'Character in the Prophetic Model.', url: 'https://yaqeeninstitute.org/read/paper/the-morality-toolkit' }
    ]
}
];

async function seedFixed() {
    for (const lesson of rawLessons) {
        let orderCounter = 1;
        const mappedBlocks = lesson.blocks.map(b => {
            const block = { id: uid(), order: orderCounter++ };
            
            if (b.origType === 'objectives' || b.origType === 'learningObjectives') {
                block.type = 'objectives';
                block.content = { items: b.items };
            } 
            else if (b.origType === 'quiz' || b.origType === 'checkpointQuiz') {
                block.type = 'quiz';
                block.question = b.question;
                block.options = b.options;
                block.correctIndex = b.correctIndex;
            }
            else if (b.origType === 'quranEvidence' || b.origType === 'quran') {
                block.type = 'quran';
                block.content = { translation: b.content, arabic: '' };
            }
            else if (b.origType === 'hadithEvidence' || b.origType === 'hadith') {
                block.type = 'hadith';
                block.content = { translation: b.content, arabic: '' };
            }
            else if (b.origType === 'scholarInsight' || b.origType === 'scholar') {
                block.type = 'scholar';
                block.content = { translation: b.content, arabic: '' };
            }
            else if (b.origType === 'guidedReflection' || b.origType === 'reflection' || b.origType === 'dua') {
                block.type = 'reflection';
                block.content = { 
                    translation: b.english || b.content, 
                    arabic: b.arabic || '' 
                };
            }
            else if (b.origType === 'youtubeRecommendedLecture' || b.origType === 'video') {
                block.type = 'video';
                block.url = b.url;
            }
            else if (b.origType === 'summary' || b.origType === 'conclusion') {
                block.type = 'conclusion';
                block.content = b.content;
            }
            else if (b.origType === 'document' || b.origType === 'resources') {
                block.type = 'document';
                block.title = b.title;
                block.url = b.url;
                block.platform = b.platform;
                block.description = b.description;
            }
            else {
                // hook, bridge, keyTerms, coreTeaching, misconception, scenario, miniActivity, actionPlan, shortAnswer, modernApplication
                block.type = 'text';
                block.content = `### ${b.title}\n\n${b.content}`;
            }
            
            // Add original request references for traceability in DB (helpful for the user)
            block.blockType = b.origType;
            block.blockTitle = b.title;

            return block;
        });

        const { error } = await sb.from('course_lessons').update({ content_blocks: mappedBlocks }).eq('id', lesson.id);
        if (error) console.error(error.message);
        else console.log(`✅ ${lesson.title} - ${mappedBlocks.length} solid blocks`);
    }
}

seedFixed();
