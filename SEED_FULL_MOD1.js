const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });
const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const uid = () => `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const rawLessons = [
{
    title: "Definition of Iman in Qur'an and Sunnah",
    hook: "A successful surgeon returns home after saving three lives. Yet lying in the dark, she feels a hollow ache she cannot name. Wealth, status, skill — none of it fills the void. This lesson begins the journey toward understanding what that void is, and what alone can fill it.",
    bridge: "This is the opening lesson of the course. You bring your doubts, your questions, your inherited beliefs. This lesson meets you exactly there and lays the first brick of conviction.",
    objectives: ['Define Iman according to Qur\'an and authentic Sunnah.', 'Distinguish between Iman as declaration vs. Iman as a comprehensive state.', 'Identify the three dimensions of faith: heart, tongue, limbs.', 'Recognize the feedback loop between conviction and conduct.'],
    concepts: [
        { term: 'Tasdiq', english: 'Heartfelt affirmation; the heart\'s recognition and acceptance of truth.' },
        { term: 'Iqrar', english: 'Verbal testimony; the public and private declaration of belief.' },
        { term: 'Amal', english: 'Action by the limbs; the outward manifestation of inward conviction.' }
    ],
    core: [
        { title: 'What Iman Is NOT', content: 'Iman is not a feeling that comes and goes with our mood. It is not a cultural identity inherited without examination. It is not a box ticked by saying words without understanding. Al-Hasan al-Basri stated: "Faith is not through outward adornment or wishful thinking — it is what settles in the heart and is proven by deeds."' },
        { title: 'The Three-Dimensional Reality of Iman', content: 'Classical scholars systematized Iman into three inseparable dimensions:\n\n**1. Tasdiq bil-Qalb** — Conviction of the heart. The heart "knows" and submits to the truth.\n**2. Iqrar bil-Lisan** — Affirmation of the tongue. The lips publicly testify.\n**3. Amal bil-Jawarih** — Action of the limbs. The body lives the belief.\n\nRemove any one dimension, and the structure weakens.' },
        { title: 'Iman as a Living, Breathing Reality', content: 'The Qur\'an (8:2) describes true believers as those whose hearts tremble at the mention of Allah and whose faith increases upon hearing His verses. This is experiential, not merely intellectual. Faith is not a document signed once — it is a relationship maintained daily.' },
        { title: 'The Feedback Loop: Belief ↔ Action', content: 'Spiritual conviction drives ethical conduct. Ethical conduct, in turn, reinforces conviction. This is the divine feedback loop:\n\n→ You believe Allah is Al-Basir (All-Seeing)\n→ You behave with integrity even alone\n→ Acting with integrity deepens your awareness of being seen\n→ That awareness increases Iman.' },
        { title: 'The Garment Analogy', content: 'The Prophet ﷺ said: "Iman wears out in the heart of any one of you just as a garment wears out." (Al-Hakim, authenticated). Just as a worn garment needs washing, mending, and eventually replacing, Iman requires constant renewal through deliberate spiritual effort.' },
        { title: 'Over 70 Branches of Iman', content: 'The Prophet ﷺ said: "Iman has over seventy branches — or over sixty — the highest of which is to say \'La ilaha illallah\' and the lowest of which is to remove something harmful from the road. And modesty is a branch of Iman." (Muslim, 35)' }
    ],
    quran: '• Surah Al-Anfal 8:2 — "The believers are only those who, when Allah is mentioned, their hearts tremble; and when His verses are recited, it increases them in faith."',
    hadith: '• Sahih Muslim 35 — "Iman has over seventy branches; the highest is La ilaha illallah, the lowest is removing harm from a path."',
    scholar: '**Imam al-Ghazali** (d. 1111 CE) in *Ihya Ulum al-Din* wrote that the heart is the "king" and the limbs are its subjects. When the king is corrupted (weak Iman), the kingdom descends into chaos. When the king is sound, order flows outward naturally.',
    misconception: '**Misconception:** "I have faith in my heart — I don\'t need to pray or act on it. God knows my intentions."\n\n**Correction:** Sincere internal belief that never produces any outward fruit contradicts the Prophetic model. A heart truly \'settled\' in Iman naturally seeks expression through action.',
    scenario: '**Case Study: The Silent Surgeon**\n\nDr. Layla is a respected cardiac surgeon. She was raised Muslim, says she "believes in God," but hasn\'t prayed in eight years. She reasoned: "My work saves lives — that\'s my worship." After a crisis, she feels spiritually shattered. Discussion: What was missing from Dr. Layla\'s Iman?',
    activity: '**The Iman Audit**\n\n1. Draw three columns: Heart | Tongue | Limbs\n2. List 3 things you currently do that reflect that dimension of your faith.\n3. Identify which column is the weakest for YOU right now.\n4. Write one practical action you will add this week to strengthen it.',
    modernApp: [
        { title: 'Faith in the Age of Anxiety', content: 'Mental health professionals report a crisis of meaning in modern life. Islamic theology offers a diagnosis: disconnection from the root of meaning. Iman provides a structured daily relationship with the source of existence.' },
        { title: 'Iman in the Digital Age', content: 'Social media has created a culture of performed identity. People display religiosity (Iqrar) without the inner reality (Tasdiq). Reclaiming Iman means intentionally building the private, unseen dimensions of faith.' }
    ],
    reflection: 'Think of a moment in your life when your faith felt most alive. What were you doing? Who were you with? Write 5 sentences about what "reviving that feeling" would look like in practical terms this week.',
    actionPlan: '**Day 1:** Audit your schedule for actions that testify to faith.\n**Day 2:** Select one Prophetic habit and commit to it.\n**Day 3:** Read Surah Al-Anfal 8:2 for 5 minutes.\n**Day 4:** Perform one "invisible" act of worship.\n**Day 5:** Review the three dimensions of Iman.',
    dua: { arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', translation: 'O Turner of Hearts, keep my heart firm upon Your religion.' },
    youtube: 'https://www.youtube.com/watch?v=m1RqRgFBrxI',
    summary: 'Iman is not a feeling or a label — it is a three-dimensional reality: heart, tongue, and limbs. Al-Hasan al-Basri taught that true faith settles in the heart AND is proven by deeds. Iman is dynamic — it increases with obedience and decreases with neglect.',
    quizzes: [
        { question: 'According to Al-Hasan al-Basri, what is true Iman?', options: ['Saying the Shahada publicly', 'What settles in the heart and is proven by action', 'Performing Hajj', 'Having strong emotions during worship'], correctIndex: 1 },
        { question: 'Which Surah and verse describes believers whose hearts tremble at the mention of Allah?', options: ['Al-Baqarah 2:1', 'Al-Anfal 8:2', 'Al-Hujurat 49:14', 'Al-Ikhlas 112:1'], correctIndex: 1 },
        { question: 'What does the "garment" analogy for Iman teach us?', options: ['Iman looks different on everyone', 'Iman wears out and needs constant renewal', 'Iman is inherited', 'Iman is only for scholars'], correctIndex: 1 }
    ],
    resources: [
        { title: 'Yaqeen Institute — Faith Revival Series', url: 'https://yaqeeninstitute.org/series/faith-revival' },
        { title: 'SeekersGuidance — What Is Iman?', url: 'https://seekersguidance.org/answers/aqeedah-creed/what-is-the-reality-of-iman-and-how-can-i-truly-be-a-mumin/' }
    ]
},
{
    title: 'Linguistic vs Technical Meaning of Faith',
    hook: 'The Arabic root a-m-n (أ م ن) gave the world the word "Amin" — safety, security, trustworthiness. The same root gave us "Iman." Before a single prayer is discussed, this lesson asks: do you truly feel safe? Because the linguistic promise of this faith is that you can.',
    bridge: 'Last lesson established that Iman is a three-dimensional reality: heart, tongue, and limbs. Now we go one level deeper — into the actual word "Iman." What does it mean at its linguistic root? And how does the technical definition expand that root?',
    objectives: ['Trace the linguistic root of Iman to its core meaning of security and safety.', 'Define the technical (Shari\'i) meaning of Iman.', 'Explain why both meanings must coexist.', 'Apply the "Amn" framework as a spiritual tool for modern anxiety.'],
    concepts: [
        { term: 'Amn', english: 'Safety, security, the absence of fear; the linguistic root of Iman.' },
        { term: 'Lughawi', english: 'Linguistic or etymological meaning of a term.' },
        { term: 'Shar\'i', english: 'Technical or legal meaning as defined by Islamic scholarship.' }
    ],
    core: [
        { title: 'The Root: A-M-N', content: 'The Arabic root أ-م-ن (A-M-N) generates a family of words that share a core meaning:\n\n• **Amn** — Security, safety\n• **Amanah** — Trust\n• **Amin** — Trustworthy one\n• **Iman** — The state of having granted security to a truth' },
        { title: 'The Linguistic Gift: Inner Peace', content: 'When you truly trust in Allah, fear loses its grip. The Qur\'an (106:4) praises Allah as the One who "fed them against hunger AND made them safe (amana-hum) from fear."' },
        { title: 'The Technical Definition', content: 'Technically, Iman is defined by Islamic scholars as: "Believing in Allah, His angels, His books, His messengers, the Last Day, and divine decree." (Derived from the Hadith of Jibreel).' },
        { title: 'When Linguistic and Technical Diverge', content: 'A person may have the linguistic experience (Amn) without the technical content (correct belief). This produces spirituality that lacks structure. Conversely, holding technical Iman without the linguistic experience produces rigidity and anxiety.' },
        { title: 'The Combination: Certainty + Security', content: 'Imam al-Nawawi noted that Iman\'s full richness emerges when a person has both: Yaqeen (certainty) and Amn (security). Without certainty, security becomes superstition. Without security, certainty becomes academia.' },
        { title: 'The Prophet\'s Name: Al-Amin', content: 'Before revelation, Quraysh called Muhammad ﷺ "Al-Amin" — the Trustworthy. The community recognized in him a man in whom you could place your ultimate trust.' }
    ],
    quran: '• Surah Quraysh 106:4 — "Who fed them against hunger and made them safe (amanahu) from fear."\n• Surah Al-Ra\'d 13:28 — "Verily, in the remembrance of Allah do hearts find rest (tatma\'inn)."',
    hadith: '• Sahih Muslim 8 (Hadith of Jibreel) — Technical definition of Iman.\n• Tirmidhi 2518 — "How wonderful is the affair of the believer, for all of it is good..."',
    scholar: '**Imam al-Jurjani** (*al-Ta\'rifat*): Defined Iman technically as "the acknowledgment by the heart and affirmation by the tongue of the truth of the Prophetic message."',
    misconception: '**Misconception:** "I can be a good person and have a spiritual connection to God without following the technical details of Islamic belief."\n\n**Correction:** Linguistic Amn (inner peace) is fragile and easily misled without the technical anchor of revelation.',
    scenario: '**Case Study: Two Brothers**\n\nHamid memorized the pillars of Iman but is chronically anxious. Tariq feels deeply connected to God but doesn\'t know the six pillars. When a crisis hits, Tariq has no intellectual anchor, and Hamid has no emotional peace. How do they help each other?',
    activity: '**The Safety Audit**\n\n1. Write down three things in your life you find emotionally "safe".\n2. Rate your internal security level (1–10) when imagining losing each.\n3. Write one sentence about what your life would feel like if you internalized: "My security comes from Allah."',
    modernApp: [
        { title: 'Iman as the Answer to Modern Anxiety', content: 'A global poll found 74% of adults feel overwhelmed by uncertainty. The linguistic root of Iman says: there is a source of safety that cannot be taken by a market crash or a health diagnosis.' },
        { title: 'Rebuilding the Technical Foundation', content: 'Many raised in Muslim cultures absorbed Islam culturally without learning its technical doctrines. Learning the technical definition of Iman is building the fortress walls before the storm arrives.' }
    ],
    reflection: 'Ask yourself: "Where do I currently place my security? What makes me feel safe?" Read Surah Al-Ra\'d 13:28. What would change in your choices this week if Allah was the PRIMARY source of your Amn?',
    actionPlan: '**Step 1:** Memorize the root A-M-N and its derivatives.\n**Step 2:** Each morning, say: "My security is from Allah."\n**Step 3:** Study the six pillars of Iman (technical definition).\n**Step 4:** Identify one area where you seek security from something other than Allah, and redirect it.',
    dua: { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْيَقِينَ وَالْعَافِيَةَ', translation: 'O Allah, I ask You for certainty (in faith) and wellbeing.' },
    youtube: 'https://www.youtube.com/watch?v=F8TKK4-oe8I',
    summary: 'Iman comes from A-M-N: safety, security, trust. Technical Iman: believing in the six pillars. Linguistic Iman: the lived experience of divine security. Both must coexist for a resilient faith.',
    quizzes: [
        { question: 'What is the linguistic root of the word Iman?', options: ['I-M-N', 'A-M-N', 'A-L-M', 'I-L-H'], correctIndex: 1 },
        { question: 'According to Imam al-Jurjani, what constitutes Iman?', options: ['Prayer and fasting', 'Acknowledgment of the heart AND affirmation of the tongue', 'Feeling spiritual', 'Following cultural tradition'], correctIndex: 1 },
        { question: 'What happens when a person has technical Iman without the linguistic experience (Amn)?', options: ['They become more charitable', 'They become rigid and feel no peace, anxiety persists', 'They earn more reward', 'Nothing — technical Iman is sufficient alone'], correctIndex: 1 }
    ],
    resources: [
        { title: 'Bayyinah — Arabic roots', url: 'https://bayyinah.com' },
        { title: 'Yaqeen Institute — Guidebook to God Series', url: 'https://yaqeeninstitute.org/series/guidebook-to-god' }
    ]
},
{
    title: 'Relationship Between Belief and Action',
    hook: 'A man plants a seed, waters it once, then walks away. "The seed was good," he insists. "I believed in it." But a seed needs consistent care to become a tree. Faith is the same. The conviction may be genuine. But if it never breaks the surface of your actions, it starves itself of the sunlight it needs to grow.',
    bridge: 'We have established WHAT Iman is and WHERE it comes from. Now we ask the practical question: Once you have Iman in your heart, what does it DO? This lesson maps the relationship between internal belief and outward action.',
    objectives: ['Explain the "tree" model of belief and deed.', 'Analyze hadiths that directly link Iman to social and ethical conduct.', 'Identify specific "social branches" of faith.', 'Build a personal "faith-to-action" map using the 99 Names of Allah.'],
    concepts: [
        { term: 'Amal Salih', english: 'Righteous deeds; the external manifestation of internal faith.' },
        { term: 'Niyyah', english: 'Intention; the engine that transforms an ordinary act into an act of worship.' },
        { term: 'Khushu', english: 'Focused presence and humility; the inner quality that elevates outward action.' }
    ],
    core: [
        { title: 'The Tree Model: Roots, Trunk, Fruit', content: 'The Qur\'an uses the tree metaphor (14:24). Classical scholars mapped this to faith:\n\n• **Roots** = Inward belief (Iman in the heart)\n• **Branches** = Character and ritual worship\n• **Fruit** = Benefit to self and society' },
        { title: 'The Prophetic Linkage to Ethics', content: 'The Prophet ﷺ repeatedly framed social actions as requirements of faith: "Let whoever believes in Allah and the Last Day speak good or remain silent." He did not say "it would be nice" — he said it is what belief in Allah demands.' },
        { title: 'Character IS the Test of Faith', content: 'The Prophet ﷺ said: "The most complete of believers in faith are those with the best character." (Abu Dawud). We often measure Iman by ritual intensity, but the Prophet measured it by character quality.' },
        { title: 'The Names of Allah Bridge', content: 'Every Name of Allah implies a corresponding divine value. Al-Karim (The Generous) → The believer is generous. Al-Adl (The Just) → The believer is fair. This is the "Names-to-Values-to-Actions" pathway.' },
        { title: 'When Action Is Missing: The Dead Heart', content: 'Ibn al-Qayyim described the heart in three states: Living, Sick, and Dead. The absence of any action from a person who claims Iman is a diagnostic sign of a heart that requires urgent spiritual attention.' },
        { title: 'Niyyah: The Converter', content: 'Niyyah (intention) is the engine that converts an ordinary action into an act of worship. Driving to work can become an act of Iman if the Niyyah is to provide for your family in obedience to Allah.' }
    ],
    quran: '• Surah Ibrahim 14:24-25 — "The good word is like a good tree — root firm, branches in the sky, giving fruit every season."\n• Surah Al-Asr 103:1-3 — "By time! Indeed man is in loss — EXCEPT those who have believed AND done righteous deeds."',
    hadith: '• Bukhari 6018 — "Let whoever believes in Allah and Last Day speak good or be silent; honor neighbor; honor guest."\n• Abu Dawud 4682 — "Most complete in faith are those with best character."',
    scholar: '**Ibn al-Qayyim al-Jawziyyah**: "The heart is the king and the limbs are its army. When the king is righteous, the army becomes righteous. When the king is corrupt, the army becomes corrupt. Yet no one questions the king — only the army is visible."',
    misconception: '**Misconception:** "Belief and action are separate. I can have strong faith in my heart even if my actions are poor."\n\n**Correction:** The organic link between root and fruit is biological. A root disconnected from its fruit is dead. The test of the root\'s health is the fruit it eventually produces.',
    scenario: '**Case Study: The Angry Engineer**\n\nKareem prays five times and fasts Ramadan, but he is chronically harsh with employees and family. He begins studying Al-Halim (The Forbearing). Something shifts. Discussion: What does Kareem\'s situation tell us about ritual worship without character development?',
    activity: '**The Character Map**\n\n1. Choose 3 character traits you want to embody more fully.\n2. Find the Name of Allah that corresponds to each (Generosity = Al-Karim).\n3. Write one concrete action you will take this week reflecting that attribute.',
    modernApp: [
        { title: 'The Workplace as a Worship Space', content: 'Every workplace interaction — how you treat a junior colleague, whether you return borrowed items — is either building or eroding your Iman. Treating professional ethics as an expression of faith.' },
        { title: 'Social Media and the Niyyah Test', content: 'Every post, comment, and share can be tested against Niyyah: "Why am I sharing this?" The Prophetic standard "speak good or remain silent" applies directly to our digital feeds.' }
    ],
    reflection: 'What specific situation triggers a misalignment between what you believe is right and what you actually do? What ONE small action would begin to close the gap between your belief and your behavior today?',
    actionPlan: '**Step 1:** Print the 99 Names of Allah; identify top 3.\n**Step 2:** Write the character trait each implies for YOU.\n**Step 3:** Design 3 faith-to-action sentences: "Because I believe in Allah as [Name], I will [action]."\n**Step 4:** Execute over the next 3 days.',
    dua: { arabic: 'اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَأَحْسِنْ خُلُقِي', translation: 'O Allah, You have made my physical form good, so make my character good.' },
    youtube: 'https://www.youtube.com/watch?v=m1RqRgFBrxI',
    summary: 'Belief and action are organically connected (the tree model). The Prophet repeatedly framed ethical social behavior as a direct requirement of believing in Allah and the Last Day. Niyyah transforms action into worship.',
    quizzes: [
        { question: 'Which Surah uses the tree metaphor for faith and good speech?', options: ['Al-Ikhlas 112:1', 'Ibrahim 14:24', 'Al-Anfal 8:2', 'Al-Asr 103:2'], correctIndex: 1 },
        { question: 'According to Abu Dawud 4682, who is "most complete in faith"?', options: ['Those who pray the longest', 'Those who fast the most', 'Those with the best character', 'Those who give most charity'], correctIndex: 2 },
        { question: 'According to Ibn al-Qayyim, what is the "king" in the heart-limbs model?', options: ['The tongue', 'The limbs', 'The heart', 'The intellect'], correctIndex: 2 }
    ],
    resources: [
        { title: 'Yaqeen — Character in the Prophetic Model', url: 'https://yaqeeninstitute.org/read/paper/the-morality-toolkit' },
        { title: 'SeekersGuidance — Faith and Deeds', url: 'https://seekersguidance.org' }
    ]
},
{
    title: 'Increase and Decrease of Iman',
    hook: 'If you have ever felt entirely detached in your prayer, wondering where the "sweetness" went, you are experiencing the fluctuating reality of Iman. Faith is not a static monolith; it breathes, it swells, and it starves. Understanding this rhythm is the secret to enduring spiritual storms.',
    bridge: 'We know Iman links to action. But what happens when action fails? Does Iman disappear? Today we study the mainstream Sunni theological reality: Iman increases and decreases.',
    objectives: ['Understand the theological mechanism of fluctuating Iman.', 'Identify acts that increase and decrease faith.', 'Learn the Prophetic method for dealing with spiritual slumps (Fatrah).', 'Establish a routine of spiritual maintenance.'],
    concepts: [
        { term: 'Ziyadah & Nuqsan', english: 'Increase and decrease; the nature of faith according to Ahl al-Sunnah.' },
        { term: 'Fatrah', english: 'A period of spiritual slump, fatigue, or low motivation.' },
        { term: 'Tajdid', english: 'Renewal; actively refreshing one\'s faith through specific actions.' }
    ],
    core: [
        { title: 'The Ebbs and Flows', content: 'Mainstream Islamic theology posits that Iman increases with acts of obedience and decreases with acts of disobedience and negligence. This fluctuation is an essential component of the human experience.' },
        { title: 'The Mechanics of Increase', content: 'Constant Dhikr softens the heart and dispels Satanic whispers. Sincere Repentance restores the connection after a slip. Sitting in gatherings of knowledge actively restores the "charge" of the soul.' },
        { title: 'The Mechanics of Decrease', content: 'Persistent sin hardens the heart and desensitizes the soul. The neglect of prayer severs the primary link to Divine guidance, accelerating spiritual decay.' },
        { title: 'The Reality of Fatrah (The Slump)', content: 'The Prophet ﷺ acknowledged spiritual slumps: "For every action there is a period of enthusiasm, and for every period of enthusiasm there is a period of lethargy (Fatrah)." The key is ensuring your lowest point does not dip below the obligatory acts.' },
        { title: 'Why Does Allah Remove the Sweetness?', content: 'Allah may temporarily remove the "sweetness of faith" to test a servant\'s sincerity; the yearning for that sweetness then drives the servant to increase their efforts, leading to an even higher station of faith.' },
        { title: 'The Imperative of Maintenance', content: 'Because Iman is like a garment that wears out, it must be maintained. Without maintenance through knowledge and gatherings of remembrance, the "light" of faith dims.' }
    ],
    quran: '• Surah Al Imran 3:173 — "Those to whom hypocrites said, \'Indeed, the people have gathered against you, so fear them.\' But it [merely] increased them in faith..."',
    hadith: '• Musnad Ahmad — "Faith wears out in the heart of any one of you just as clothes wear out, so ask Allah to renew the faith in your hearts."',
    scholar: '**Imam Ahmad bin Hanbal**: When asked "Does Iman increase and decrease?" he replied, "It increases until it reaches the highest heavens, and it decreases until it reaches the lowest depths."',
    misconception: '**Misconception:** "If I lose the ‘feeling’ of faith, I must be a hypocrite."\n\n**Correction:** Losing the feeling is proof you are human. A hypocrite never worries about their Iman; only a true believer worries about losing it. The fluctuation is natural; how you respond to the dip is what matters.',
    scenario: '**Case Study: The Burnout Phase**\n\nYusuf used to pray Tahajjud daily. Lately, he struggles to wake up for Fajr. He feels like a fraud. He stops making Du\'a entirely because "I don\'t deserve to ask." Discussion: How does understanding Ziyadah and Nuqsan (Increase and Decrease) change Yusuf\'s perspective on his current state?',
    activity: '**The Spiritual Baseline Audit**\n\n1. What is your "high tide" worship? (What you do when Iman is soaring).\n2. What is your "low tide" baseline? (The unbreakable minimum you do when Iman is weak).\n3. Set your absolute baseline today (e.g., the 5 prayers, no matter what).',
    modernApp: [
        { title: 'The Digital Drain', content: 'Constant consumption of mindless content is a form of "negligence" that decreases Iman. Dopamine saturation numbs the heart to spiritual subtlety.' },
        { title: 'Spiritual Detox', content: 'A "spiritual detox" involving periods of silence and Qur\'anic reflection is necessary. The brain needs quiet to process the Divine reality.' }
    ],
    reflection: 'When was the last time you felt a "slump"? Did you panic, or did you hold fast to the baseline? Write down your absolute minimum daily baseline for when motivation is zero.',
    actionPlan: '**Step 1:** Add 100 Istighfar (seeking forgiveness) to your morning routine to polish the heart.\n**Step 2:** For one week, guard your obligatory prayers fiercely.\n**Step 3:** Perform a 24-hour media fast this weekend to let the heart breathe.',
    dua: { arabic: 'اللَّهُمَّ جَدِّدِ الْإِيمَانَ فِي قَلْبِي', translation: 'O Allah, renew the faith in my heart.' },
    youtube: 'https://www.youtube.com/watch?v=t0zqP8OmZN0',
    summary: 'Iman is not static; it increases with obedience and decreases with sin/negligence. Spiritual slumps (Fatrah) are natural, but the believer must maintain an unbreakable baseline (obligations). Sins harden the heart; Dhikr and repentance polish it.',
    quizzes: [
        { question: 'What does "Ziyadah" and "Nuqsan" mean regarding Iman?', options: ['The different branches of faith', 'The inward and outward aspects', 'Its increase and decrease', 'The rewards in the Hereafter'], correctIndex: 2 },
        { question: 'According to Imam Ahmad, what happens to faith?', options: ['It remains constant once achieved', 'It belongs only to the prophets', 'It increases to the heavens and decreases to the depths', 'It cannot be measured'], correctIndex: 2 },
        { question: 'What is the Prophetic approach to "Fatrah" (spiritual slump)?', options: ['Stop praying until the feeling returns', 'Maintain the obligatory acts without extremism', 'Perform a major pilgrimage immediately', 'Declare oneself a hypocrite'], correctIndex: 1 }
    ],
    resources: [
        { title: 'SeekersGuidance — Is Depression a Sign of Weak Faith?', url: 'https://seekersguidance.org' },
        { title: 'Yaqeen Institute — Daily Reminders', url: 'https://yaqeeninstitute.org' }
    ]
},
{
    title: 'Signs of Strong Faith',
    hook: 'How do you measure spiritual strength? The world measures strength by dominance, volume, and wealth. But the architecture of strong faith operates on entirely different physics. The strongest believer is often the calmest person in the storm.',
    bridge: 'We\'ve discussed how Iman fluctuates. Now, we define the "high tide." What does peak Iman actually look like in a person\'s daily life? It is not what popular culture assumes.',
    objectives: ['Identify the internal and external signs of high Iman.', 'Differentiate between performative religiosity and true strong faith.', 'Analyze how strong faith manifests during calamity.', 'Develop traits of spiritual resilience.'],
    concepts: [
        { term: 'Khushu', english: 'Presence of heart, stillness, and deep humility before the Divine.' },
        { term: 'Tawakkul', english: 'Active reliance on Allah after exhausting one\'s worldly means.' },
        { term: 'Ridha', english: 'Complete contentment and satisfaction with the decree of Allah.' }
    ],
    core: [
        { title: 'The Soft Heart', content: 'Strong faith is characterized by a "soft heart" that is highly sensitive to the Divine and the suffering of others. A hard heart is a dead heart.' },
        { title: 'Khushu in Prayer', content: 'The first sign of the successful believers (Surah Al-Mu\'minun) is that they possess Khushu in their prayers. It is the immediate presence of awe during worship.' },
        { title: 'Resilience in Calamity', content: 'A strong believer views trials as opportunities for purification and growth rather than arbitrary punishments. Their internal peace (Amn) is not shaken by external chaos.' },
        { title: 'Independence from Creation', content: 'High Iman produces independence from the validation of creation. The believer relies solely on the Creator, caring more for the Divine gaze than public opinion.' },
        { title: 'Consistency of Character', content: 'The private and public character are identical. The strong believer does not have a "stage persona" for religion. They are the same at 2 AM alone in their bedroom as they are at Friday prayers.' },
        { title: 'The Strong Will', content: 'A "strong believer" is not necessarily one with physical prowess alone, but one with a "firm will" to work for the Hereafter and the courage to enjoin good and forbid evil.' }
    ],
    quran: '• Surah Al-Mu\'minun 23:1-2 — "Certainly will the believers have succeeded. They who are during their prayer humbly submissive (khashi\'un)."',
    hadith: '• Sahih Muslim — "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both."',
    scholar: '**Hasan al-Basri**: "The believer does the best of deeds, yet is most fearful that they will not be accepted. The hypocrite does the worst of deeds, and feels completely secure."',
    misconception: '**Misconception:** "Strong faith means never having doubts or feeling sad."\n\n**Correction:** The Prophets felt profound sorrow and faced intellectual challenges. Strong faith is not the absence of emotion or struggle; it is the refusal to let that struggle disconnect you from Allah.',
    scenario: '**Case Study: The Quiet Resilience**\n\nA community leader faces immense public criticism and cancellation for a principled stand. Instead of reacting with anger or seeking to "rebrand" their image, they spend the night in prayer and continue their work with calm. Discussion: How does this demonstrate Iman that is independent of human approval?',
    activity: '**The Secret Deed Challenge**\n\nChoose an action (giving charity, praying extra, helping someone) and execute it without ANYONE knowing. If you feel the urge to tell someone, suppress it. This builds the "muscle" of doing things solely for the Divine gaze.',
    modernApp: [
        { title: 'Surviving Outrage Culture', content: 'In an era of performative outrage, strong faith manifests as intellectual and emotional sobriety. The strong believer does not let the algorithm dictate their emotional state.' },
        { title: 'The Private vs Public Self', content: 'Digital life encourages a polished external persona. Developing "Strong Faith" requires investing more in your hidden private life than your public digital avatar.' }
    ],
    reflection: 'Look at the last time you were criticized. Did your internal peace shatter? What does this tell you about where your security (Amn) is anchored?',
    actionPlan: '**Step 1:** Spend 10 minutes tonight in complete silence, focusing on the concept of Ridha (contentment).\n**Step 2:** Fast one day this week with the intention of building the "Strong Will".\n**Step 3:** When provoked to argue online this week, walk away.',
    dua: { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا بَعْدَ الْقَضَاءِ', translation: 'O Allah, I ask You for contentment after the decree.' },
    youtube: 'https://www.youtube.com/watch?v=x-9lp0m3Qcw',
    summary: 'Strong faith is marked by a soft heart, Khushu in worship, and resilience in calamity. It produces independence from human validation. The strong believer is not devoid of sadness or struggle, but possesses a firm will anchored in the Divine.',
    quizzes: [
        { question: 'What is the FIRST sign of the successful believers mentioned in Surah Al-Mu\'minun?', options: ['They give charity', 'They fast all year', 'They are humbly submissive (Khushu) in prayer', 'They fight in battles'], correctIndex: 2 },
        { question: 'How did Hasan al-Basri contrast the believer and the hypocrite?', options: ['The believer is poor, the hypocrite is rich', 'The believer does good and fears rejection; the hypocrite does bad and feels secure', 'The believer prays loud, the hypocrite prays quietly', 'There is no difference'], correctIndex: 1 },
        { question: 'What defines a "strong believer" according to the application in the lesson?', options: ['Physical strength only', 'Having the most followers', 'A firm will and independence from the validation of creation', 'Never feeling sad'], correctIndex: 2 }
    ],
    resources: [
        { title: 'SeekersGuidance — The Strong Believer', url: 'https://seekersguidance.org' },
        { title: 'Yaqeen Institute — Finding Resilience', url: 'https://yaqeeninstitute.org' }
    ]
},
{
    title: 'Causes of Weak Faith',
    hook: 'There is a condition more dangerous than physical illness, yet it goes completely undiagnosed. It is characterized by spiritual numbness, a hard heart, and a sudden allergy to the Qur\'an. This is the crisis of weak faith—and it has specific, curable causes.',
    bridge: 'We have seen the heights of strong faith. Now we must examine the pathology of its decline. What actively destroys Iman?',
    objectives: ['Identify the primary causes of weakened faith.', 'Recognize the symptoms of a "hardened heart".', 'Understand how modern environments accelerate spiritual decay.', 'Apply specific Prophetic counter-measures for revival.'],
    concepts: [
        { term: 'Qaswah', english: 'Hardness of the heart; the inability to be moved by spiritual reminders.' },
        { term: 'Ghaflah', english: 'Heedlessness; spiritual amnesia regarding one\'s ultimate purpose.' },
        { term: 'Tadabbur', english: 'Deep, transformative reflection on the Qur\'an.' }
    ],
    core: [
        { title: 'The Disease of Ghaflah', content: 'The primary cause of weak faith is heedlessness (Ghaflah). It is living as if the Hereafter is a myth, totally absorbed by the immediate pleasures of the material world. It induces spiritual amnesia.' },
        { title: 'Unrepented Sins', content: 'Sins committed without remorse act like rust on the heart (Ran). The Prophet ﷺ explained that every sin leaves a black spot on the heart until, without repentance, it becomes completely encased, unable to absorb light.' },
        { title: 'Toxic Environments', content: 'Faith weakens when surrounded by environments that mock morality or heavily rely on vain, purposeless arguments. Arguing for the sake of argument kills the spirituality of the heart.' },
        { title: 'The Abandonment of the Qur\'an', content: 'When the Qur\'an is reduced to a background sound or abandoned entirely, the soul starves. The Qur\'an is the primary life-support system for Iman.' },
        { title: 'Obsession with Status', content: 'Preoccupation with worldly status and wealth at the expense of the Hereafter splits the heart\'s focus. Research indicates "heaven\'s celebrities" are often unknown on earth.' },
        { title: 'The Antidotes', content: 'If hardness is the disease, Tadabbur (reflection on the Qur\'an) is the cure. If laziness is the disease, attending gatherings of knowledge is the cure.' }
    ],
    quran: '• Surah Al-Mutaffifin 83:14 — "No! Rather, the stain (ran) has covered their hearts from that which they were earning."',
    hadith: '• Sunan Ibn Majah — "When the believer sins, a black spot appears on his heart. If he repents, his heart is polished. If he increases, the spot increases..."',
    scholar: '**Imam Ibn al-Jawzi**: "Beware of heedlessness (Ghaflah), for it is a heavy slumber. A person may not wake up from it until they are in their grave."',
    misconception: '**Misconception:** "I feel nothing when I pray, so I should just stop until I feel it again."\n\n**Correction:** Stopping prayer when faith is weak is like unplugging a dying patient from life support. The prayer, even if robotic initially, is the very medicine needed to revive the heart.',
    scenario: '**Case Study: The Social Media Executive**\n\nTariq works 14 hours a day chasing a promotion. He hasn\'t opened the Qur\'an outside of Ramadan. He feels a crushing emptiness, masked only by buying new things. Discussion: Trace Tariq\'s symptoms back to the theological root. What is the immediate prescription?',
    activity: '**The Rust Removal (Istighfar Sprint)**\n\nFor 3 days, set an alarm at a random time. When it goes off, drop everything for exactly 60 seconds and say "Astaghfirullah" (I seek forgiveness) with deep presence, visualizing the "black spots" being washed off the heart.',
    modernApp: [
        { title: 'The Weapon of Distraction', content: 'The modern economy runs on our attention. The constant barrage of notifications is an engineered system of Ghaflah, actively severing our focus from the Divine.' },
        { title: 'Earthly Fame vs Heavenly Reality', content: 'Pursuit of followers and likes creates a reliance on the creation. Weak Iman seeks human approval; reviving Iman requires seeking Divine approval.' }
    ],
    reflection: 'Examine your heart honestly: When a verse of warning is recited, do you feel anything? If not, what specific sin or distraction is acting as the "rust"?',
    actionPlan: '**Step 1:** Delete one app from your phone that causes Ghaflah (heedlessness).\n**Step 2:** Read one page of the Qur\'an daily with translation.\n**Step 3:** Commit to one "secret" good deed daily to build sincerity.',
    dua: { arabic: 'اللَّهُمَّ طَهِّرْ قَلْبِي مِنَ النِّفَاقِ', translation: 'O Allah, purify my heart from hypocrisy.' },
    youtube: 'https://www.youtube.com/watch?v=t0zqP8OmZN0',
    summary: 'Weak faith manifests as spiritual emptiness and a hard heart. Its primary causes are unrepented sins (forming "rust"), heedlessness (Ghaflah), and obsession with worldly status. The cure involves profound repentance, Qur\'anic reflection, and breaking attachments to performing for people.',
    quizzes: [
        { question: 'What does the term "Ran" (stain/rust) refer to in Surah 83:14?', options: ['Physical dirt', 'The accumulation of unrepented sins on the heart', 'A disease of the blood', 'Forgetfulness of old age'], correctIndex: 1 },
        { question: 'According to the lesson, what is the Prophetic cure for a heart suffering from "rust"?', options: ['Sleeping more', 'Arguing to defend Islam', 'Sincere repentance (Istighfar) which polishes the heart', 'Seeking earthly fame'], correctIndex: 2 },
        { question: 'What is "Ghaflah"?', options: ['A type of charity', 'Spiritual amnesia/heedlessness regarding one\'s purpose', 'A chapter of the Quran', 'Strictness in religion'], correctIndex: 1 }
    ],
    resources: [
        { title: 'Yaqeen — Heaven\'s Celebrities', url: 'https://yaqeeninstitute.org' },
        { title: 'Islamway — Signs of weak Iman', url: 'https://en.islamway.net' }
    ]
},
{
    title: 'Module 1 Synthesis & Knowledge Check',
    hook: 'The foundation has been laid. You now understand that faith is not a passive title; it is the most critical infrastructure of the human soul. Now, we secure the blueprints.',
    bridge: 'This lesson consolidates everything learned in Module 1. It bridges the foundational definitions of Iman directly into the practice of your modern life.',
    objectives: ['Synthesize the linguistic and technical definitions of Iman.', 'Evaluate personal spiritual health using the components of strong/weak faith.', 'Prepare for the transition from belief (Iman) to execution (Islam & Ihsan) in Module 2.'],
    concepts: [
        { term: 'Synthesis', english: 'The combination of ideas to form a connected theory or system.' },
        { term: 'Application', english: 'Putting the theory of Iman into active daily practice.' }
    ],
    core: [
        { title: 'The Architecture of Faith', content: 'Module 1 has traversed the "Architecture of Faith". We established that Iman comes from Amn (security) and thrives as a three-dimensional reality: Heart, Tongue, Limbs.' },
        { title: 'The Dynamic Heart', content: 'We destroyed the myth of static faith. Iman increases with obedience and decreases with negligence. The heart is fluid; it requires active daily management.' },
        { title: 'The Diagnostics', content: 'We learned to read the diagnostics of the soul: Khushu and resilience mark a strong faith, while apathy, "rust" from unrepented sins, and Ghaflah mark a weakened state.' }
    ],
    quran: '• Surah Al-Hujurat 49:15 — "The true believers are only those who have believed in Allah and His Messenger and then had no doubt, and strove with their wealth and their lives..."',
    hadith: '• Bukhari — "Whoever possesses three qualities will taste the sweetness of faith: that Allah and His Messenger are dearer to him than anything else, that he loves a person solely for the sake of Allah, and that he hates to return to disbelief as much as he hates to be thrown into the Fire."',
    scholar: '**Synthesis Insight**: Classical theology teaches that true knowing must eventually result in doing. Knowledge of Iman without the action of Iman becomes a witness against the believer.',
    misconception: '**Misconception:** "Now that I know what Iman is, my spiritual struggles are over."\n\n**Correction:** Knowledge is the compass, not the journey. Knowing the map of Ziyadah and Nuqsan means you are now equipped for the struggle, not exempt from it.',
    scenario: '**The Next Step**\n\nYou know that your Iman fluctuates. You know what strengthens it. You are stepping into Module 2: Islam, Iman, and Ihsan. How will you apply the "Garment Analogy" this week?',
    activity: '**The 60-Second Elevator Pitch**\n\nIf someone asked you, "What exactly IS faith in Islam, and why does it matter?" — write down a 3-sentence response unifying the technical (6 pillars) and linguistic (security) perspectives.',
    modernApp: [
        { title: 'The Shield of Amn', content: 'Take the linguistic reality of Amn (security) into your workplace and family. When anxiety hits, deliberately state: "My Amn is with Al-Wakil."' }
    ],
    reflection: 'What was the single most paradigm-shifting concept for you in Module 1? Why did it strike you so deeply?',
    actionPlan: '**Action Plan for the Month:**\n1. Commit to a "No-Screen" hour daily for reflection.\n2. Establish one secret act of worship.\n3. Implement the daily Istighfar habit.',
    dua: { arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا', translation: 'Our Lord, let not our hearts deviate after You have guided us.' },
    youtube: 'https://www.youtube.com/watch?v=m1RqRgFBrxI',
    summary: 'Module 1 has provided the definitive architecture of Iman. Faith is a volatile, living organism requiring constant input (action, knowledge) to remain "settled" in the heart. The true believer operates from a place of Divine security, allowing the limbs to act out of devotion rather than panic.',
    quizzes: [
        { question: 'Which relationship best defines mainstream Sunni theology regarding belief and action?', options: ['They are entirely separate', 'Belief happens in the heart, action is optional', 'Belief and action are organically linked like roots and fruit', 'Action only matters during Ramadan'], correctIndex: 2 },
        { question: 'What is the linguistic root of Iman?', options: ['Peace and submission', 'Safety, security, and trust (A-m-n)', 'Knowledge and wisdom', 'Prayer and fasting'], correctIndex: 1 },
        { question: 'What is the primary spiritual antidote to the "rust" of the heart?",', options: ['Arguing about religion', 'Sincere repentance (Istighfar) and Qur\'anic reflection (Tadabbur)', 'Achieving public fame', 'Ignoring the feeling entirely'], correctIndex: 1 }
    ],
    resources: [
        { title: 'Course Review Materials', url: 'https://yaqeeninstitute.org' }
    ]
}
];



async function seedSuper() {
    console.log('\\n============================================');
    console.log('SEEDING FULL MODULE 1 (7 Lessons) with 25+ blocks & 3 ending quizzes');
    console.log('============================================\\n');

    for (const data of rawLessons) {
        let order = 1;
        const blocks = [];

        // 1. Hook
        blocks.push({ id: uid(), type: 'text', order: order++, content:"### " + data.hookTitle + "\\n\\n" + data.hook });

        // 2. Bridge
        blocks.push({ id: uid(), type: 'text', order: order++, content:"### " + data.bridgeTitle + "\\n\\n" + data.bridge });

        // 3. Objectives
        blocks.push({ id: uid(), type: 'objectives', order: order++, content: { items: data.objectives } });

        // 4, 5, 6. Concepts (Key Terms)
        if(data.concepts) {
            for(const concept of data.concepts) {
                blocks.push({ id: uid(), type: 'concept', order: order++, content: { translation: concept.english, arabic: concept.term } });
            }
        }

        // Core Teaching Blocks
        for(let i=0; i<data.core.length; i++){
            blocks.push({ id: uid(), type: 'text', order: order++, content:"### " + data.core[i].title + "\\n\\n" + data.core[i].content });
        }

        // Quran, Hadith, Scholar
        if(data.quran) blocks.push({ id: uid(), type: 'quran', order: order++, content: { translation: data.quran, arabic: "" } });
        if(data.hadith) blocks.push({ id: uid(), type: 'hadith', order: order++, content: { translation: data.hadith, arabic: "" } });
        if(data.scholar) blocks.push({ id: uid(), type: 'scholar', order: order++, content: { translation: data.scholar, arabic: "" } });

        // Misconception, Scenario, Activity
        if(data.misconception) blocks.push({ id: uid(), type: 'text', order: order++, content:"### Clearing Misconceptions\\n\\n" + data.misconception });
        if(data.scenario) blocks.push({ id: uid(), type: 'text', order: order++, content:"### Behavioral Scenario\\n\\n" + data.scenario });
        if(data.activity) blocks.push({ id: uid(), type: 'text', order: order++, content:"### Mini Activity\\n\\n" + data.activity });

        // Modern Apps
        if(data.modernApp) {
            for(let i=0; i<data.modernApp.length; i++){
                blocks.push({ id: uid(), type: 'text', order: order++, content:"### " + data.modernApp[i].title + "\\n\\n" + data.modernApp[i].content });
            }
        }

        // Guided Reflection, Action Plan, Dua
        if(data.reflection) blocks.push({ id: uid(), type: 'reflection', order: order++, content: { translation: data.reflection, arabic: "Guided Reflection" } });
        if(data.actionPlan) blocks.push({ id: uid(), type: 'text', order: order++, content:"### Your Action Plan\\n\\n" + data.actionPlan });
        if(data.dua) blocks.push({ id: uid(), type: 'reflection', order: order++, content: { translation: data.dua.translation, arabic: data.dua.arabic } });

        // Video
        if(data.youtube) blocks.push({ id: uid(), type: 'video', order: order++, url: data.youtube });

        // QUIZZES AT THE END (Exactly 3)
        if(data.quizzes) {
            for(let i=0; i<data.quizzes.length; i++){
                blocks.push({ id: uid(), type: 'quiz', order: order++, question: data.quizzes[i].question, options: data.quizzes[i].options, correctIndex: data.quizzes[i].correctIndex });
            }
        }

        // Summary
        if(data.summary) blocks.push({ id: uid(), type: 'conclusion', order: order++, content: data.summary });

        // Resources
        if(data.resources) {
            for(let i=0; i<data.resources.length; i++){
                blocks.push({ id: uid(), type: 'document', order: order++, title: data.resources[i].title, url: data.resources[i].url, platform: 'Verification Archive', description: 'Scholarly source.' });
            }
        }

        // Find lesson by title
        const { data: lessonData } = await sb.from('course_lessons').select('id, title').ilike('title', data.title).single();
        if(lessonData) {
            const { error } = await sb.from('course_lessons').update({ content_blocks: blocks, duration_minutes: 45 }).eq('id', lessonData.id);
            if(error) console.error(error.message);
            else console.log(`✅ ${data.title} -> Seeded smoothly with ${blocks.length} blocks!`);
        } else {
            console.log(`❌ Lesson not found matching: ${data.title}`);
        }
    }
}

seedSuper();
