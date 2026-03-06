/**
 * MASTER RESEED — Foundations of Islamic Faith
 * Completely rebuilds all 30 modules + 210 lessons for the existing course
 * Then seeds rich content blocks for all available lessons.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_TITLE = 'Foundations of Islamic Faith';

// ============================================================
// FULL 30-MODULE / 210-LESSON CURRICULUM STRUCTURE
// ============================================================
const CURRICULUM = [
  // WEEK 1
  {
    title: 'Understanding Iman', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Foundations of belief in Islam.',
    lessons: [
      { title: "Definition of Iman in Qur'an and Sunnah", sort_order: 1 },
      { title: 'Linguistic vs Technical Meaning of Faith', sort_order: 2 },
      { title: 'Relationship Between Belief and Action', sort_order: 3 },
      { title: 'Increase and Decrease of Iman', sort_order: 4 },
      { title: 'Signs of Strong Faith', sort_order: 5 },
      { title: 'Causes of Weak Faith', sort_order: 6 },
      { title: 'Module 1 Synthesis & Knowledge Check', sort_order: 7 },
    ]
  },
  {
    title: 'Islam, Iman & Ihsan', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: The hierarchy of spirituality.',
    lessons: [
      { title: 'The Hadith of Jibreel Explained', sort_order: 1 },
      { title: 'The Five Pillars of Islam', sort_order: 2 },
      { title: 'The Six Pillars of Iman', sort_order: 3 },
      { title: 'The Concept of Ihsan', sort_order: 4 },
      { title: 'Internal vs External Submission', sort_order: 5 },
      { title: 'Hypocrisy: Major and Minor', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Tawheed – Oneness of Allah', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: The central pillar of Islam.',
    lessons: [
      { title: 'Introduction to Tawheed', sort_order: 1 },
      { title: 'Tawheed ar-Rububiyyah', sort_order: 2 },
      { title: 'Tawheed al-Uluhiyyah', sort_order: 3 },
      { title: 'Tawheed al-Asma wa Sifat', sort_order: 4 },
      { title: 'Types of Shirk', sort_order: 5 },
      { title: 'Hidden Shirk in Modern Times', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Names & Attributes of Allah', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Knowing the Creator.',
    lessons: [
      { title: 'Importance of Knowing Allah', sort_order: 1 },
      { title: 'Mercy and Compassion', sort_order: 2 },
      { title: 'Justice and Wisdom', sort_order: 3 },
      { title: 'Power and Authority', sort_order: 4 },
      { title: 'Love and Nearness', sort_order: 5 },
      { title: 'Balance Between Hope and Fear', sort_order: 6 },
      { title: 'Weekly Reflection', sort_order: 7 },
    ]
  },
  {
    title: 'Fitrah and Natural Belief', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: The innate disposition toward God.',
    lessons: [
      { title: 'The Concept of Fitrah', sort_order: 1 },
      { title: 'Faith in Childhood', sort_order: 2 },
      { title: 'Cultural Influence on Belief', sort_order: 3 },
      { title: 'Protecting the Fitrah', sort_order: 4 },
      { title: 'Doubt vs Curiosity', sort_order: 5 },
      { title: 'Spiritual Awareness', sort_order: 6 },
      { title: 'Week 1 Final Assessment', sort_order: 7 },
    ]
  },
  // WEEK 2
  {
    title: 'Logical Proofs of God', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Intellectual arguments for Islam.',
    lessons: [
      { title: 'The Cosmological Argument', sort_order: 1 },
      { title: 'The Design Argument', sort_order: 2 },
      { title: 'The Moral Argument', sort_order: 3 },
      { title: 'The Argument from Contingency', sort_order: 4 },
      { title: 'The Argument from Consciousness', sort_order: 5 },
      { title: 'Refuting Randomness', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Islam and Science', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: History and compatibility.',
    lessons: [
      { title: 'What Is Science?', sort_order: 1 },
      { title: 'Limits of Scientific Knowledge', sort_order: 2 },
      { title: 'Misconceptions About Islam and Science', sort_order: 3 },
      { title: 'Evolution Discussion', sort_order: 4 },
      { title: 'Miracles Debate', sort_order: 5 },
      { title: 'Harmony of Revelation and Reason', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Revelation and Scripture', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: The divine source.',
    lessons: [
      { title: 'Why Humanity Needs Revelation', sort_order: 1 },
      { title: 'How Revelation Came', sort_order: 2 },
      { title: "Compilation of the Qur'an", sort_order: 3 },
      { title: "Preservation of the Qur'an", sort_order: 4 },
      { title: 'Authenticity of Hadith', sort_order: 5 },
      { title: 'Transmission Sciences', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Prophethood', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: The messengers of Allah.',
    lessons: [
      { title: 'Why Prophets Are Necessary', sort_order: 1 },
      { title: 'Characteristics of Prophets', sort_order: 2 },
      { title: 'The Finality of Prophet Muhammad ﷺ', sort_order: 3 },
      { title: 'Proofs of His Prophethood', sort_order: 4 },
      { title: 'The Sunnah as Guidance', sort_order: 5 },
      { title: 'Following the Prophet in Modern Times', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'The Afterlife', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Journey beyond death.',
    lessons: [
      { title: 'Death and the Grave', sort_order: 1 },
      { title: 'Barzakh', sort_order: 2 },
      { title: 'Resurrection', sort_order: 3 },
      { title: 'Judgment Day', sort_order: 4 },
      { title: 'Paradise', sort_order: 5 },
      { title: 'Hell', sort_order: 6 },
      { title: 'Week 2 Final Assessment', sort_order: 7 },
    ]
  },
  // WEEK 3
  {
    title: 'Angels', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Celestial beings.',
    lessons: [
      { title: 'Creation of Angels', sort_order: 1 },
      { title: 'Roles of Angels', sort_order: 2 },
      { title: 'Jibreel and Revelation', sort_order: 3 },
      { title: 'Recording Deeds', sort_order: 4 },
      { title: 'Angels and Daily Life', sort_order: 5 },
      { title: 'Belief Impact on Behavior', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Divine Decree (Qadr)', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Fate and destiny.',
    lessons: [
      { title: 'Meaning of Qadr', sort_order: 1 },
      { title: 'Knowledge of Allah', sort_order: 2 },
      { title: 'Writing of Decree', sort_order: 3 },
      { title: 'Will of Allah', sort_order: 4 },
      { title: 'Creation of Actions', sort_order: 5 },
      { title: 'Free Will vs Destiny', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Accountability', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Personal responsibility.',
    lessons: [
      { title: 'Human Responsibility', sort_order: 1 },
      { title: 'Minor and Major Sins', sort_order: 2 },
      { title: 'Repentance', sort_order: 3 },
      { title: 'Divine Justice', sort_order: 4 },
      { title: 'Mercy of Allah', sort_order: 5 },
      { title: 'Hope and Fear Balance', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Spiritual Consequences', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Impact of deeds.',
    lessons: [
      { title: 'Effects of Sin', sort_order: 1 },
      { title: 'Effects of Good Deeds', sort_order: 2 },
      { title: 'Barakah', sort_order: 3 },
      { title: 'Trials and Tests', sort_order: 4 },
      { title: 'Patience', sort_order: 5 },
      { title: 'Gratitude', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Preparing for the Afterlife', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Living for eternity.',
    lessons: [
      { title: 'Daily Self-Review', sort_order: 1 },
      { title: 'Building Good Deeds', sort_order: 2 },
      { title: 'Avoiding Major Sins', sort_order: 3 },
      { title: 'Making Sincere Tawbah', sort_order: 4 },
      { title: 'Maintaining Sincerity', sort_order: 5 },
      { title: 'End-of-Life Reflection', sort_order: 6 },
      { title: 'Week 3 Assessment', sort_order: 7 },
    ]
  },
  // WEEK 4
  {
    title: 'Atheism & Secularism', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Navigating modern philosophies.',
    lessons: [
      { title: 'What Is Atheism?', sort_order: 1 },
      { title: 'Rise of Secularism', sort_order: 2 },
      { title: 'Moral Relativism', sort_order: 3 },
      { title: 'Responding to Common Claims', sort_order: 4 },
      { title: 'Faith and Rationality', sort_order: 5 },
      { title: 'Identity in Secular Society', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'The Problem of Evil', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Why do bad things happen?',
    lessons: [
      { title: 'Understanding Suffering', sort_order: 1 },
      { title: 'Types of Evil', sort_order: 2 },
      { title: 'Divine Wisdom', sort_order: 3 },
      { title: 'Human Responsibility', sort_order: 4 },
      { title: 'Trials as Growth', sort_order: 5 },
      { title: 'Responding with Patience', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Feminism & Islam', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Gender dynamics and rights.',
    lessons: [
      { title: 'Gender in Islam', sort_order: 1 },
      { title: 'Rights and Responsibilities', sort_order: 2 },
      { title: 'Misconceptions', sort_order: 3 },
      { title: 'Equality vs Equity', sort_order: 4 },
      { title: 'Marriage Roles', sort_order: 5 },
      { title: 'Modern Debates', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Science-Based Doubts', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Addressing specific conflicts.',
    lessons: [
      { title: 'Evolution Debate', sort_order: 1 },
      { title: 'Big Bang Theory', sort_order: 2 },
      { title: 'Scientific Method Limits', sort_order: 3 },
      { title: 'Philosophy of Science', sort_order: 4 },
      { title: 'Miracles and Laws', sort_order: 5 },
      { title: 'Balance Between Faith & Science', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Identity Crisis', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Maintaining faith in a globalized world.',
    lessons: [
      { title: 'Muslim Identity in West', sort_order: 1 },
      { title: 'Peer Pressure', sort_order: 2 },
      { title: 'Social Media Influence', sort_order: 3 },
      { title: 'Intellectual Arrogance', sort_order: 4 },
      { title: 'Building Confidence', sort_order: 5 },
      { title: 'Faith-Based Identity Plan', sort_order: 6 },
      { title: 'Week 4 Assessment', sort_order: 7 },
    ]
  },
  // WEEK 5
  {
    title: 'Worship and Iman', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Rituals as fuel for faith.',
    lessons: [
      { title: 'Salah and Spiritual Impact', sort_order: 1 },
      { title: 'Fasting and Discipline', sort_order: 2 },
      { title: 'Zakat and Social Justice', sort_order: 3 },
      { title: 'Hajj and Unity', sort_order: 4 },
      { title: "Du'a and Connection", sort_order: 5 },
      { title: 'Dhikr and Remembrance', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Knowledge and Faith', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: The power of intellectual clarity.',
    lessons: [
      { title: 'Seeking Knowledge', sort_order: 1 },
      { title: 'Avoiding Misinformation', sort_order: 2 },
      { title: 'Respecting Scholars', sort_order: 3 },
      { title: 'Critical Thinking', sort_order: 4 },
      { title: 'Balanced Understanding', sort_order: 5 },
      { title: 'Lifelong Learning', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Companionship', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: The social dimension of faith.',
    lessons: [
      { title: 'Choosing Friends', sort_order: 1 },
      { title: 'Influence of Company', sort_order: 2 },
      { title: 'Community Importance', sort_order: 3 },
      { title: 'Mentorship', sort_order: 4 },
      { title: 'Accountability Partners', sort_order: 5 },
      { title: 'Protecting Your Environment', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Trials and Growth', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Turning pain into purpose.',
    lessons: [
      { title: 'Personal Hardships', sort_order: 1 },
      { title: 'Financial Tests', sort_order: 2 },
      { title: 'Health Challenges', sort_order: 3 },
      { title: 'Social Struggles', sort_order: 4 },
      { title: 'Spiritual Burnout', sort_order: 5 },
      { title: 'Building Resilience', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Consistency', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Habits of successful believers.',
    lessons: [
      { title: 'Small Consistent Deeds', sort_order: 1 },
      { title: 'Habit Formation', sort_order: 2 },
      { title: 'Avoiding Extremes', sort_order: 3 },
      { title: 'Balance in Worship', sort_order: 4 },
      { title: 'Avoiding Burnout', sort_order: 5 },
      { title: 'Staying Motivated', sort_order: 6 },
      { title: 'Week 5 Assessment', sort_order: 7 },
    ]
  },
  // WEEK 6
  {
    title: 'Applied Tawheed', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Practical submission.',
    lessons: [
      { title: 'Trusting Allah in Decisions', sort_order: 1 },
      { title: 'Dependence on Allah', sort_order: 2 },
      { title: 'Avoiding Superstitions', sort_order: 3 },
      { title: 'Tawheed in Daily Life', sort_order: 4 },
      { title: 'Gratitude Mindset', sort_order: 5 },
      { title: 'Accountability Mindset', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Building Intellectual Strength', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Defending faith with wisdom.',
    lessons: [
      { title: 'Evaluating Arguments', sort_order: 1 },
      { title: 'Logical Fallacies', sort_order: 2 },
      { title: 'Debating Respectfully', sort_order: 3 },
      { title: 'Handling Difficult Questions', sort_order: 4 },
      { title: 'Maintaining Humility', sort_order: 5 },
      { title: 'Confidence Without Arrogance', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Faith and Leadership', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Impact on the world.',
    lessons: [
      { title: 'Being a Role Model', sort_order: 1 },
      { title: 'Speaking About Islam', sort_order: 2 },
      { title: 'Engaging Society', sort_order: 3 },
      { title: 'Dawah Principles', sort_order: 4 },
      { title: 'Wisdom in Communication', sort_order: 5 },
      { title: 'Serving the Community', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Personal Faith Blueprint', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Growth mapping.',
    lessons: [
      { title: 'Assessing Your Iman', sort_order: 1 },
      { title: 'Identifying Weak Areas', sort_order: 2 },
      { title: 'Creating a 6-Month Plan', sort_order: 3 },
      { title: 'Setting Spiritual Goals', sort_order: 4 },
      { title: 'Monitoring Progress', sort_order: 5 },
      { title: 'Adjusting Your Plan', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Final Integration', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Culmination of studies.',
    lessons: [
      { title: 'Review of Key Concepts', sort_order: 1 },
      { title: 'Revisiting Core Beliefs', sort_order: 2 },
      { title: 'Personal Reflection', sort_order: 3 },
      { title: 'Written Faith Statement', sort_order: 4 },
      { title: 'Oral Presentation', sort_order: 5 },
      { title: 'Final Exam', sort_order: 6 },
      { title: 'Course Completion Assessment', sort_order: 7 },
    ]
  },
];

// ============================================================
// RICH CONTENT from seed-module-1-final.js (Module 1 Lessons)
// keyed by lesson TITLE (not ID, since IDs will be new)
// ============================================================
function buildBlocks(rawBlocks) {
  return rawBlocks.map((b, i) => {
    const block = { id: `blk_${Date.now()}_${i}_${Math.floor(Math.random()*99999)}`, type: b.type, order: i };
    if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
      block.content = { translation: b.translation, arabic: b.arabic };
    } else if (b.type === 'quiz') {
      block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
    } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
      block.content = b.content || b.translation;
      if (b.author) block.author = b.author;
    } else if (['objectives', 'infographic'].includes(b.type)) {
      block.content = { items: b.items, layout: b.layout };
    } else if (b.type === 'document') {
      block.content = { title: b.title, description: b.description, url: b.url, platform: b.platform };
    } else if (b.type === 'video') {
      block.content = { url: b.url };
    } else {
      block.content = b.content || b.translation || null;
    }
    return block;
  });
}

const RICH_CONTENT_BY_TITLE = {
  "Definition of Iman in Qur'an and Sunnah": buildBlocks([
    { type: "objectives", items: ["Define the six pillars of faith (Arkan al-Iman) as categorized in the Hadith of Jibril.", "Analyze the relationship between Islam, Iman, and Ihsan as distinct but interconnected levels of the religion.", "Critique the historical and pedagogical significance of the Hadith of Jibril.", "Identify the scriptural evidence for faith being both an internal conviction and an outward manifestation."] },
    { type: "concept", translation: "Iman: A comprehensive term for belief that encompasses conviction in the heart, testimony by the tongue, and actions by the limbs.", arabic: "الإيمان" },
    { type: "concept", translation: "Arkan al-Iman: The six foundational pillars of faith—belief in Allah, His angels, His books, His messengers, the Last Day, and the Divine Decree.", arabic: "أركان الإيمان" },
    { type: "text", content: "### The Pedagogical Framework of the Hadith Jibril\nThe study of Islamic faith begins with the most significant educational encounter in the Prophetic biography: the Hadith of Jibril. Often called the \"Mother of the Sunnah,\" it maps out the entirety of the religion." },
    { type: "text", content: "### Islam, Iman, and Ihsan\nThe dialogue established three ascending levels of the religion. Islam represents the outward submission—the five pillars structuring a physical life. Iman represents the internal dimensions—the six pillars grounding the soul. Ihsan is the pinnacle." },
    { type: "infographic", layout: "grid", items: [
      { title: "Islam", description: "Outward submission (5 Pillars).", icon: "Activity" },
      { title: "Iman", description: "Inward faith (6 Pillars).", icon: "Heart" },
      { title: "Ihsan", description: "Spiritual excellence & constant awareness.", icon: "Star" },
      { title: "Integration", description: "True faith requires all parts to function seamlessly.", icon: "Link" }
    ]},
    { type: "quran", translation: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers... (Surah Al-Baqarah 2:285)", arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ" },
    { type: "hadith", translation: "Sahih Muslim, Hadith 8: The Hadith of Jibril establishing Islam, Iman, Ihsan, and the signs of the Hour.", arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ..." },
    { type: "conclusion", content: "Iman is the foundation of inner security and intellectual peace. By affirming the Unseen and practicing its branches, the believer builds a fortress against despair." },
    { type: "callout", content: "Real Life Application:\n- Integrating the Pillars: Choose one pillar of faith each week to deeply reflect upon.\n- Practicing the Branches: Perform a humble branch of faith daily.\n- Active Inquiry: Cultivate the habit of asking sincere, meaningful questions.", author: "Action Items for True Understanding" },
    { type: "video", url: "https://www.youtube.com/watch?v=yWwOimr2D38" },
    { type: "quiz", question: "Which of the following is considered the 'Mother of the Sunnah' for defining the religion?", options: ["Farewell Sermon", "Hadith of Jibril", "Treaty of Hudaybiyyah", "Constitution of Medina"], correctIndex: 1, hint: "It involved an angel asking questions." },
    { type: "quiz", question: "How many branches of faith are mentioned in Prophetic narrations?", options: ["Five", "Six", "Over sixty or seventy", "Exactly ninety-nine"], correctIndex: 2, hint: "Bid'un wa Sab'un." },
    { type: "reflection", translation: "Explain why 'modesty' is considered a branch of faith rather than just a social etiquette.", arabic: "مراجعة الذات" },
  ]),

  "Linguistic vs Technical Meaning of Faith": buildBlocks([
    { type: "objectives", items: ["Explicate the Arabic root of 'Iman' and its connection to security and trust.", "Distinguish between a general linguistic affirmation and the technical parameters of Islamic faith.", "Evaluate why 'Tasdiq' differentiates a believer from a mere knower."] },
    { type: "concept", translation: "Al-Amn: The root meaning of security, safety, and freedom from fear.", arabic: "الأمن" },
    { type: "concept", translation: "Tasdiq: Sincere affirmation and acceptance of the truth in the heart.", arabic: "تصديق" },
    { type: "text", content: "### The Etymological Foundation: Iman as Security\nThe Arabic word Iman is derived from the root a-m-n, meaning safety, security, and tranquility. Linguistically, Iman refers to an internal state of affirming truth that removes doubt and brings peace." },
    { type: "quran", translation: "[He] who has fed them, [saving them] from hunger and made them safe, [saving them] from fear. (Surah Quraysh 106:4)", arabic: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ" },
    { type: "hadith", translation: "The believer is the one from whom people's lives and property are safe.", arabic: "الْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ عَلَى دِمَائِهِمْ وَأَمْوَالِهِمْ" },
    { type: "text", content: "### Technical Definition: Synthesis of Heart, Tongue, and Limbs\nWhile linguistic meaning highlights internal peace, the technical (Istilah) definition integrates a holistic system. Technical Iman is the coupling of heartfelt belief (Tasdiq), verbal testimony (Iqrar), and outward action (Amal)." },
    { type: "conclusion", content: "Recognizing Iman as both an internal sanctuary and a social responsibility ensures the believer is not just privately spiritual, but publicly reliable." },
    { type: "video", url: "https://www.youtube.com/watch?v=T_T4EHV25e8" },
    { type: "quiz", question: "The Arabic root of Iman (a-m-n) is closest to what concept?", options: ["Power", "Safety and Trust", "Study", "Movement"], correctIndex: 1, hint: "Amn" },
    { type: "quiz", question: "Why did Iblis lack Iman despite knowing Allah?", options: ["Forgotten truth", "Lacked Tasdiq (affirmation and submission)", "Lacked information", "Didn't know the Last Day"], correctIndex: 1, hint: "Knowledge alone is not faith." },
    { type: "reflection", translation: "If Iman is 'safety', where do you currently feel most anxious? How can actively affirming Allah's attributes address that fear?", arabic: "طمأنينة" },
  ]),

  "Relationship Between Belief and Action": buildBlocks([
    { type: "objectives", items: ["Define the Sunni orthodox position on the necessity of actions as a component of faith.", "Compare the views of Ahl al-Sunnah with historical theological extremes.", "Illustrate the 'Tree Metaphor' of faith.", "Identify how specific actions act as a 'proof' of sincerity."] },
    { type: "concept", translation: "Amal al-Jawarih: Physical actions performed by limbs, like prayer or charity.", arabic: "عمل الجوارح" },
    { type: "concept", translation: "Niyyah: Intention; the spiritual soul of every action.", arabic: "نية" },
    { type: "text", content: "### The Ontological Inseparability of Faith and Action\nAhl al-Sunnah wal-Jama'ah concludes that faith is a triad: belief in the heart, testimony on the tongue, and actions with the limbs. Actions naturally and necessarily express the true internal state." },
    { type: "infographic", layout: "grid", items: [
      { title: "Murji'ah (Extreme)", description: "Faith is only in the heart. Actions are totally irrelevant.", icon: "XCircle" },
      { title: "Kharijites (Extreme)", description: "Any major sin instantly destroys your faith.", icon: "XCircle" },
      { title: "Ahl al-Sunnah (Middle)", description: "Faith & actions are linked. Sins diminish faith but don't erase it.", icon: "CheckCircle" },
      { title: "Burhan (Action)", description: "Deeds are the decisive proof of the heart's hidden state.", icon: "Zap" }
    ]},
    { type: "quran", translation: "And they were not commanded except to worship Allah, [being] sincere to Him in religion... (Surah Al-Bayyinah 98:5)", arabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ" },
    { type: "hadith", translation: "The most complete of believers in faith are those with the best character.", arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا" },
    { type: "conclusion", content: "Faith is never a dead concept; it is an active force. Without action, faith is a hollow claim. Action is the pulse proving the heart is still alive." },
    { type: "video", url: "https://www.youtube.com/watch?v=r0lF00gXbEU" },
    { type: "quiz", question: "Which group argued faith is only in the heart and actions are irrelevant?", options: ["Kharijites", "Murji'ah", "Ahl al-Sunnah", "Ash'arites"], correctIndex: 1, hint: "Known for suspending judgment on actions." },
    { type: "quiz", question: "What did the Prophet ﷺ call charity?", options: ["A burden", "A decisive proof (Burhan)", "A tax", "Magic"], correctIndex: 1, hint: "Sadaqatu Burhan." },
    { type: "reflection", translation: "How does the middle path handle a believer who commits a major sin? Why is Niyyah the 'soul' of an action?", arabic: "تفكر" },
  ]),

  "Increase and Decrease of Iman": buildBlocks([
    { type: "objectives", items: ["Cite textual evidence proving the dynamic, non-static nature of faith.", "Explain the Prophetic analogy of faith 'wearing out like a garment'.", "Identify specific inputs that increase faith and toxins that decrease it.", "Analyze the concept of Tajdid (renewal) as a continuous necessity."] },
    { type: "concept", translation: "Yazidu wa Yanqusu: Doctrinal concept that faith increases and decreases.", arabic: "يزيد وينقص" },
    { type: "concept", translation: "Tajdid al-Iman: Proactive renewal of faith through remembrance and repentance.", arabic: "تجديد الإيمان" },
    { type: "text", content: "### The Living Nature of Faith: Fluctuations and Flow\nFaith is not a binary switch but a living, dynamic entity. The Qur'an and Sunnah repeatedly emphasize that Iman is subject to change. It serves as a spiritual pulse." },
    { type: "hadith", translation: "Verily, the faith of one of you will diminish just as a garment becomes worn out; so ask Allah to renew faith in your hearts.", arabic: "إِنَّ الإِيمَانَ لَيَخْلَقُ فِي جَوْفِ أَحَدِكُمْ كَمَا يَخْلَقُ الثَّوْبُ" },
    { type: "infographic", layout: "process", items: [
      { title: "Ziyadah (Increase)", description: "Qur'an, Dhikr, Good Company, Righteous Deeds.", icon: "TrendingUp" },
      { title: "Nanqus (Decrease)", description: "Sins, Ghaflah (Heedlessness), Toxic Environments.", icon: "TrendingDown" },
      { title: "Tajdid (Renewal)", description: "Immediate repentance and excessive Dhikr.", icon: "RefreshCw" }
    ]},
    { type: "quran", translation: "And whenever His verses are recited to them, it increases them in faith... (Surah Al-Anfal 8:2)", arabic: "وَإِذَا تُلِيَتْ عَلَيْهِمْ آيَاتُهُ زَادَتْهُمْ إِيمَانًا" },
    { type: "conclusion", content: "Accepting that faith fluctuates is the first step to spiritual maturity. It equips you with the stamina to seek renewal constantly instead of giving up entirely when feeling low." },
    { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
    { type: "quiz", question: "Which describes the Sunni view of faith?", options: ["Fixed amount", "Increases with obedience, decreases with disobedience", "Only increases", "Only changes for prophets"], correctIndex: 1, hint: "It is dynamic." },
    { type: "quiz", question: "What did the Prophet ﷺ compare the need for faith renewal to?", options: ["Iron", "A worn-out garment", "A fading sunset", "Dry well"], correctIndex: 1, hint: "It needs to be washed and renewed." },
    { type: "reflection", translation: "Define Ghaflah. Explain the role of reciting 'La ilaha illa Allah' in faith renewal.", arabic: "تجديد" },
  ]),
};

// Default blocks for lessons without specific content (keeps data rich)
function defaultBlocks(lessonTitle, moduleName) {
  return buildBlocks([
    { type: "objectives", items: [
      `Understand the core concepts of ${lessonTitle}`,
      `Analyze the Islamic perspective on ${lessonTitle}`,
      `Apply these teachings in daily spiritual practice`,
      `Connect this lesson to the broader theme of ${moduleName}`,
    ]},
    { type: "text", content: `## ${lessonTitle}\n\nThis lesson is part of the **${moduleName}** module in the Foundations of Islamic Faith course. The content explores the theological, spiritual, and practical dimensions relevant to this topic from the Quran, Sunnah, and scholarly tradition.` },
    { type: "infographic", layout: "grid", items: [
      { title: "Knowledge", description: "Understanding the theoretical foundation.", icon: "BookOpen" },
      { title: "Application", description: "Implementing in daily life.", icon: "Activity" },
      { title: "Reflection", description: "Deepening spiritual awareness.", icon: "Heart" },
      { title: "Community", description: "Sharing and living collectively.", icon: "Users" }
    ]},
    { type: "text", content: `### Islamic Perspective\n\nThe scholarship of Ahl al-Sunnah wal-Jama'ah provides a rich academic and spiritual framework for understanding ${lessonTitle}. Scholars from the classical tradition have emphasized the importance of integrating both internal conviction and outward practice.` },
    { type: "callout", content: `Practical Reflection: As you study ${lessonTitle}, consider how this knowledge changes your approach to daily worship, interaction with others, and relationship with Allah.`, author: "Spiritual Application" },
    { type: "video", url: "https://www.youtube.com/watch?v=yWwOimr2D38" },
    { type: "quiz", question: `Which is the best description of the core message of ${lessonTitle}?`, options: ["Internal spiritual practice only", "External ritual compliance only", "Integration of knowledge, belief, and action", "Memorization of texts"], correctIndex: 2, hint: "Islam integrates all dimensions of human life." },
    { type: "quiz", question: "What does Islamic scholarship emphasize as the foundation of all spiritual growth?", options: ["Wealth accumulation", "Correct belief (Aqeedah) and righteous action (Amal)", "Political power", "Social status"], correctIndex: 1, hint: "Aqeedah and Amal working together." },
    { type: "reflection", translation: `How does understanding ${lessonTitle} change your daily practice and relationship with Allah?`, arabic: "تفكر" },
  ]);
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function masterReseed() {
  console.log('\n========================================');
  console.log('MASTER RESEED — Foundations of Islamic Faith');
  console.log('========================================\n');

  // 1. Find the existing course
  const { data: course, error: courseErr } = await supabase
    .from('jobs')
    .select('id, title')
    .ilike('title', '%Foundations of Islamic Faith%')
    .limit(1)
    .single();

  if (courseErr || !course) {
    console.error('❌ Course not found. Error:', courseErr?.message);
    process.exit(1);
  }

  console.log(`✅ Found course: "${course.title}" (${course.id})\n`);
  const courseId = course.id;

  // 2. Clean up existing course_modules/course_lessons for this course
  console.log('🗑  Cleaning up existing modules and lessons for this course...');
  const { data: existingMods } = await supabase.from('course_modules').select('id').eq('course_id', courseId);
  if (existingMods && existingMods.length > 0) {
    const modIds = existingMods.map(m => m.id);
    await supabase.from('course_lessons').delete().in('module_id', modIds);
    await supabase.from('course_modules').delete().eq('course_id', courseId);
    console.log(`   Removed ${existingMods.length} old modules.\n`);
  } else {
    console.log('   No existing modules to clean.\n');
  }

  // 3. Create all 30 modules and 210 lessons
  let totalModules = 0;
  let totalLessons = 0;
  let richSeeded = 0;

  for (const mod of CURRICULUM) {
    process.stdout.write(`📚 Creating module: "${mod.title}" (Week ${mod.week})... `);

    const { data: newMod, error: modErr } = await supabase
      .from('course_modules')
      .insert({
        course_id: courseId,
        title: mod.title,
        description: mod.description,
        sort_order: mod.sort_order,
        unlock_week: mod.week,
        is_published: true,
      })
      .select()
      .single();

    if (modErr || !newMod) {
      console.log(`❌ FAILED: ${modErr?.message}`);
      continue;
    }

    console.log(`✅ (${newMod.id})`);
    totalModules++;

    // Create all lessons for this module
    for (const lesson of mod.lessons) {
      const richBlocks = RICH_CONTENT_BY_TITLE[lesson.title] || defaultBlocks(lesson.title, mod.title);
      const isRich = !!RICH_CONTENT_BY_TITLE[lesson.title];

      const { error: lesErr } = await supabase
        .from('course_lessons')
        .insert({
          module_id: newMod.id,
          course_id: courseId,
          title: lesson.title,
          sort_order: lesson.sort_order,
          content_type: 'text',
          is_published: true,
          duration_minutes: 15,
          xp_reward: 10,
          content_blocks: richBlocks,
        });

      if (lesErr) {
        console.log(`   ⚠️  Lesson "${lesson.title}": ${lesErr.message}`);
      } else {
        totalLessons++;
        if (isRich) richSeeded++;
        process.stdout.write(`   ✅ "${lesson.title}"${isRich ? ' [RICH]' : ''}\n`);
      }
    }
  }

  // 4. Update course totals
  console.log('\n📊 Updating course totals...');
  await supabase
    .from('jobs')
    .update({ total_modules: totalModules, total_lessons: totalLessons })
    .eq('id', courseId);

  console.log('\n========================================');
  console.log(`✅ RESEED COMPLETE`);
  console.log(`   📦 Modules created: ${totalModules}/30`);
  console.log(`   📖 Lessons created: ${totalLessons}/210`);
  console.log(`   🌟 Rich content seeded: ${richSeeded} lessons`);
  console.log(`   📝 Default content seeded: ${totalLessons - richSeeded} lessons`);
  console.log('========================================\n');
}

masterReseed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
