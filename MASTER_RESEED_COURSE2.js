/**
 * MASTER RESEED — Course 2: Spiritual Development & Purification of the Heart
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Spiritual Development & Purification of the Heart';

// ============================================================
// FULL 30-MODULE / 210-LESSON CURRICULUM
// ============================================================
const CURRICULUM = [

  // ─────────────────────────────────────────────────────────
  // WEEK 1 – Understanding the Inner Self
  // ─────────────────────────────────────────────────────────
  {
    title: 'The Human Soul in Islam', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Understanding the nature of the human soul.',
    lessons: [
      { title: 'What Is the Soul (Ruh)?', sort_order: 1 },
      { title: 'The Heart (Qalb) and Its Central Role', sort_order: 2 },
      { title: 'The Nafs and Its Levels', sort_order: 3 },
      { title: 'Spiritual vs Physical Reality', sort_order: 4 },
      { title: 'The Inner Struggle', sort_order: 5 },
      { title: 'Relationship Between Body and Soul', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Levels of the Nafs', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: The three levels of the self.',
    lessons: [
      { title: 'Nafs al-Ammarah (Commanding Self)', sort_order: 1 },
      { title: 'Nafs al-Lawwamah (Self-Reproaching Soul)', sort_order: 2 },
      { title: "Nafs al-Mutma'innah (Tranquil Soul)", sort_order: 3 },
      { title: 'Signs of Each Level', sort_order: 4 },
      { title: 'Transition Between Levels', sort_order: 5 },
      { title: 'Identifying Your Current State', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'The Heart and Its Conditions', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: The spiritual states of the heart.',
    lessons: [
      { title: 'Sound Heart', sort_order: 1 },
      { title: 'Diseased Heart', sort_order: 2 },
      { title: 'Hardened Heart', sort_order: 3 },
      { title: 'Spiritual Blindness', sort_order: 4 },
      { title: 'Signs of a Living Heart', sort_order: 5 },
      { title: 'Causes of Heart Corruption', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Intention (Niyyah)', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: The role and purification of intention.',
    lessons: [
      { title: 'Meaning of Niyyah', sort_order: 1 },
      { title: 'Sincerity vs Showing Off', sort_order: 2 },
      { title: 'Intention in Daily Actions', sort_order: 3 },
      { title: 'Purifying Intentions', sort_order: 4 },
      { title: 'Hidden Riya', sort_order: 5 },
      { title: 'Monitoring Your Intentions', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Self-Awareness & Reflection', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Building self-awareness through reflection.',
    lessons: [
      { title: 'Muhasabah (Self-Accountability)', sort_order: 1 },
      { title: 'Daily Reflection Practices', sort_order: 2 },
      { title: 'Recognizing Personal Weaknesses', sort_order: 3 },
      { title: 'Emotional Triggers', sort_order: 4 },
      { title: 'Spiritual Journaling', sort_order: 5 },
      { title: 'Building Self-Discipline', sort_order: 6 },
      { title: 'Week 1 Final Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 2 – Diseases of the Heart
  // ─────────────────────────────────────────────────────────
  {
    title: 'Pride & Arrogance', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Understanding and curing pride.',
    lessons: [
      { title: 'Definition of Pride', sort_order: 1 },
      { title: 'Arrogance in Belief', sort_order: 2 },
      { title: 'Arrogance in Knowledge', sort_order: 3 },
      { title: 'Arrogance in Wealth', sort_order: 4 },
      { title: 'Subtle Pride', sort_order: 5 },
      { title: 'Humility as a Cure', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Envy & Jealousy', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Hasad and its spiritual remedy.',
    lessons: [
      { title: 'Understanding Hasad', sort_order: 1 },
      { title: 'Causes of Envy', sort_order: 2 },
      { title: 'Envy in Modern Society', sort_order: 3 },
      { title: 'Social Media and Envy', sort_order: 4 },
      { title: 'Effects of Jealousy', sort_order: 5 },
      { title: 'Contentment as a Cure', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Showing Off (Riya)', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Recognizing and eliminating ostentation.',
    lessons: [
      { title: 'What Is Riya?', sort_order: 1 },
      { title: 'Major vs Minor Riya', sort_order: 2 },
      { title: 'Public Acts of Worship', sort_order: 3 },
      { title: 'Riya in the Digital Age', sort_order: 4 },
      { title: 'Seeking Praise', sort_order: 5 },
      { title: 'Protecting Sincerity', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Greed & Love of Dunya', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Overcoming materialism and love of the world.',
    lessons: [
      { title: 'Materialism', sort_order: 1 },
      { title: 'Obsession with Status', sort_order: 2 },
      { title: 'Wealth and Spiritual Danger', sort_order: 3 },
      { title: 'Balance Between Dunya and Akhirah', sort_order: 4 },
      { title: 'Contentment', sort_order: 5 },
      { title: 'Simple Living', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Anger & Hatred', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Managing anger and removing hatred.',
    lessons: [
      { title: 'Roots of Anger', sort_order: 1 },
      { title: 'Uncontrolled Rage', sort_order: 2 },
      { title: 'Anger and Ego', sort_order: 3 },
      { title: 'Forgiveness', sort_order: 4 },
      { title: 'Emotional Regulation', sort_order: 5 },
      { title: 'Prophetic Methods for Anger', sort_order: 6 },
      { title: 'Week 2 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 3 – Modern Spiritual Challenges
  // ─────────────────────────────────────────────────────────
  {
    title: 'Social Media & Ego', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Spiritual dangers of the digital age.',
    lessons: [
      { title: 'Validation Culture', sort_order: 1 },
      { title: 'Comparison Trap', sort_order: 2 },
      { title: 'Influencer Mindset', sort_order: 3 },
      { title: 'Digital Arrogance', sort_order: 4 },
      { title: 'Addiction to Attention', sort_order: 5 },
      { title: 'Healthy Digital Habits', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Addiction & Distraction', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Overcoming modern addictions and distractions.',
    lessons: [
      { title: 'Technology Addiction', sort_order: 1 },
      { title: 'Entertainment Overload', sort_order: 2 },
      { title: 'Procrastination', sort_order: 3 },
      { title: 'Laziness', sort_order: 4 },
      { title: 'Escapism', sort_order: 5 },
      { title: 'Focus and Discipline', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Doubt & Spiritual Weakness', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Addressing doubt and rebuilding certainty.',
    lessons: [
      { title: 'Sources of Doubt', sort_order: 1 },
      { title: 'Emotional Doubt', sort_order: 2 },
      { title: 'Intellectual Doubt', sort_order: 3 },
      { title: 'Sin and Iman', sort_order: 4 },
      { title: 'Isolation and Faith', sort_order: 5 },
      { title: 'Rebuilding Certainty', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Anxiety & Emotional Struggles', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Islamic approach to emotional health.',
    lessons: [
      { title: 'Fear and Uncertainty', sort_order: 1 },
      { title: 'Stress Management', sort_order: 2 },
      { title: 'Grief and Loss', sort_order: 3 },
      { title: 'Loneliness', sort_order: 4 },
      { title: 'Self-Worth', sort_order: 5 },
      { title: 'Emotional Resilience', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Peer Pressure & Environment', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Protecting your faith from external pressures.',
    lessons: [
      { title: 'Influence of Friends', sort_order: 1 },
      { title: 'Toxic Environments', sort_order: 2 },
      { title: 'Workplace Pressure', sort_order: 3 },
      { title: 'Family Pressure', sort_order: 4 },
      { title: 'Building Protective Circles', sort_order: 5 },
      { title: 'Healthy Boundaries', sort_order: 6 },
      { title: 'Week 3 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 4 – Pathways to Spiritual Healing
  // ─────────────────────────────────────────────────────────
  {
    title: 'Tawbah (Repentance)', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: The path of sincere repentance.',
    lessons: [
      { title: 'Meaning of Tawbah', sort_order: 1 },
      { title: 'Conditions of Repentance', sort_order: 2 },
      { title: 'Repeated Sins', sort_order: 3 },
      { title: 'Overcoming Shame', sort_order: 4 },
      { title: "Hope in Allah's Mercy", sort_order: 5 },
      { title: 'Staying Consistent After Tawbah', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Dhikr & Remembrance', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: The power of remembering Allah.',
    lessons: [
      { title: 'Importance of Dhikr', sort_order: 1 },
      { title: 'Morning and Evening Adhkar', sort_order: 2 },
      { title: 'Impact on the Heart', sort_order: 3 },
      { title: 'Consistency in Remembrance', sort_order: 4 },
      { title: 'Dhikr During Hardship', sort_order: 5 },
      { title: 'Building a Dhikr Routine', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Gratitude & Contentment', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Cultivating shukr and qana\'ah.',
    lessons: [
      { title: 'Meaning of Shukr', sort_order: 1 },
      { title: 'Gratitude in Difficulty', sort_order: 2 },
      { title: "Contentment (Qana'ah)", sort_order: 3 },
      { title: 'Avoiding Complaining', sort_order: 4 },
      { title: 'Positive Mindset', sort_order: 5 },
      { title: 'Gratitude Journal Practice', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Patience & Perseverance', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Mastering sabr across all dimensions.',
    lessons: [
      { title: 'Types of Patience', sort_order: 1 },
      { title: 'Patience During Tests', sort_order: 2 },
      { title: 'Patience in Worship', sort_order: 3 },
      { title: 'Patience in Avoiding Sin', sort_order: 4 },
      { title: 'Long-Term Discipline', sort_order: 5 },
      { title: 'Endurance and Growth', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Strengthening Worship', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Elevating the quality of worship.',
    lessons: [
      { title: 'Improving Salah', sort_order: 1 },
      { title: 'Khushu in Prayer', sort_order: 2 },
      { title: 'Voluntary Acts', sort_order: 3 },
      { title: 'Fasting Beyond Ramadan', sort_order: 4 },
      { title: 'Charity and Generosity', sort_order: 5 },
      { title: 'Balance in Worship', sort_order: 6 },
      { title: 'Week 4 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 5 – Discipline & Consistency
  // ─────────────────────────────────────────────────────────
  {
    title: 'Habit Formation', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Building righteous habits that last.',
    lessons: [
      { title: 'Power of Small Habits', sort_order: 1 },
      { title: 'Breaking Bad Habits', sort_order: 2 },
      { title: 'Replacing Negative Patterns', sort_order: 3 },
      { title: 'Time Management', sort_order: 4 },
      { title: 'Accountability Systems', sort_order: 5 },
      { title: 'Avoiding Burnout', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Intelligence', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Developing emotional maturity from an Islamic lens.',
    lessons: [
      { title: 'Self-Control', sort_order: 1 },
      { title: 'Managing Reactions', sort_order: 2 },
      { title: 'Empathy', sort_order: 3 },
      { title: 'Listening Skills', sort_order: 4 },
      { title: 'Conflict Handling', sort_order: 5 },
      { title: 'Forgiveness Skills', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Building Resilience', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Spiritual and mental toughness.',
    lessons: [
      { title: 'Trials as Growth', sort_order: 1 },
      { title: 'Failure and Recovery', sort_order: 2 },
      { title: 'Mental Toughness', sort_order: 3 },
      { title: 'Spiritual Resilience', sort_order: 4 },
      { title: 'Overcoming Setbacks', sort_order: 5 },
      { title: 'Long-Term Vision', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Companionship', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: The social foundation of spiritual growth.',
    lessons: [
      { title: 'Choosing Righteous Friends', sort_order: 1 },
      { title: 'Mentorship', sort_order: 2 },
      { title: 'Community Involvement', sort_order: 3 },
      { title: 'Positive Influence', sort_order: 4 },
      { title: 'Serving Others', sort_order: 5 },
      { title: 'Avoiding Isolation', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Personal Growth Plan', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Designing and executing your spiritual roadmap.',
    lessons: [
      { title: 'Identifying Weak Areas', sort_order: 1 },
      { title: 'Setting Goals', sort_order: 2 },
      { title: 'Tracking Progress', sort_order: 3 },
      { title: 'Monthly Reviews', sort_order: 4 },
      { title: 'Adjusting Your Plan', sort_order: 5 },
      { title: 'Sustaining Growth', sort_order: 6 },
      { title: 'Week 5 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 6 – Personal Spiritual Blueprint
  // ─────────────────────────────────────────────────────────
  {
    title: 'Long-Term Vision', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Defining your spiritual identity and life direction.',
    lessons: [
      { title: 'Defining Your Spiritual Identity', sort_order: 1 },
      { title: 'Aligning Goals with Faith', sort_order: 2 },
      { title: 'Vision for the Akhirah', sort_order: 3 },
      { title: 'Life Priorities', sort_order: 4 },
      { title: 'Balancing Roles', sort_order: 5 },
      { title: 'Strategic Growth', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Preventing Relapse', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Systems to maintain spiritual progress.',
    lessons: [
      { title: 'Recognizing Warning Signs', sort_order: 1 },
      { title: 'Trigger Management', sort_order: 2 },
      { title: 'Recovery Systems', sort_order: 3 },
      { title: 'Avoiding Extremism', sort_order: 4 },
      { title: 'Moderation', sort_order: 5 },
      { title: 'Staying Motivated', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Leadership Through Character', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Influencing others through spiritual maturity.',
    lessons: [
      { title: 'Leading by Example', sort_order: 1 },
      { title: 'Influence Through Humility', sort_order: 2 },
      { title: 'Emotional Maturity', sort_order: 3 },
      { title: 'Serving Others', sort_order: 4 },
      { title: 'Wisdom in Speech', sort_order: 5 },
      { title: 'Community Responsibility', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Integration of Knowledge & Action', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Bridging learning and living.',
    lessons: [
      { title: 'Knowledge Without Action', sort_order: 1 },
      { title: 'Action Without Knowledge', sort_order: 2 },
      { title: 'Balanced Practice', sort_order: 3 },
      { title: 'Evaluating Growth', sort_order: 4 },
      { title: 'Personal Reflection', sort_order: 5 },
      { title: 'Writing Your Faith Statement', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Final Integration', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Culmination and completion of the programme.',
    lessons: [
      { title: 'Review of All Key Concepts', sort_order: 1 },
      { title: 'Revisiting Spiritual Weaknesses', sort_order: 2 },
      { title: 'Personal Reflection Essay', sort_order: 3 },
      { title: 'Oral Reflection', sort_order: 4 },
      { title: 'Final Written Exam', sort_order: 5 },
      { title: 'Final Personal Blueprint Submission', sort_order: 6 },
      { title: 'Course Completion Assessment', sort_order: 7 },
    ]
  },
];

// ============================================================
// DEFAULT CONTENT BLOCKS (rich, structured, DB-driven)
// ============================================================
function makeBlocks(lessonTitle, moduleName, week) {
  const ts = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;
  return [
    {
      id: ts(), type: 'objectives', order: 0,
      content: {
        items: [
          `Understand the core principles of ${lessonTitle} from the Quran and Sunnah.`,
          `Analyze the spiritual significance of ${lessonTitle} within the module on ${moduleName}.`,
          `Apply practical strategies related to ${lessonTitle} in daily life.`,
          `Connect this lesson to the Tazkiyah journey of Week ${week}.`,
        ]
      }
    },
    {
      id: ts(), type: 'text', order: 1,
      content: `## ${lessonTitle}\n\nThis lesson is part of the **${moduleName}** module in the *Spiritual Development & Purification of the Heart* course. The Quran and Prophetic tradition provide a rich framework for understanding ${lessonTitle} as a dimension of Tazkiyah — the purification of the soul.\n\n> *"Indeed he succeeds who purifies it, and indeed he fails who corrupts it."* — (Surah Ash-Shams 91:9-10)\n\nWe explore both the classical scholarly insights and their practical application in the modern Muslim's life.`
    },
    {
      id: ts(), type: 'infographic', order: 2,
      content: {
        layout: 'grid',
        items: [
          { title: 'Foundation', description: 'Quranic and Sunnah basis for this topic.', icon: 'BookOpen' },
          { title: 'Recognition', description: 'Identifying this in your own life.', icon: 'Eye' },
          { title: 'Remedy', description: 'Practical spiritual cure and habit.', icon: 'Heart' },
          { title: 'Consistency', description: 'Building long-term spiritual discipline.', icon: 'RefreshCw' },
        ]
      }
    },
    {
      id: ts(), type: 'quran', order: 3,
      content: {
        translation: 'But those who believe and do righteous deeds — We will surely remove from them their misdeeds and will surely reward them according to the best of what they used to do. (Surah Al-Ankabut 29:7)',
        arabic: 'وَالَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَنُكَفِّرَنَّ عَنْهُمْ سَيِّئَاتِهِمْ'
      }
    },
    {
      id: ts(), type: 'hadith', order: 4,
      content: {
        translation: 'Verily, Allah does not look at your appearance or wealth, but rather He looks at your hearts and actions. (Sahih Muslim)',
        arabic: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ'
      }
    },
    {
      id: ts(), type: 'text', order: 5,
      content: `### Practical Application of ${lessonTitle}\n\nScholars of Tazkiyah have emphasized that spiritual development is never passive. Every lesson in this module is designed to move from knowledge to transformation. The Prophet Muhammad ﷺ modeled how each aspect of inner purification directly impacts one's relationship with Allah, family, and community.\n\nConsider how ${lessonTitle} manifests in your current daily life. Where do you see areas for growth? Where are your strengths?`
    },
    {
      id: ts(), type: 'callout', order: 6,
      content: `Practical Steps:\n- Reflect daily on your progress with ${lessonTitle} for one week.\n- Identify one specific habit to build or break related to this lesson.\n- Share your reflection with an accountability partner or spiritual mentor.\n- Return to this lesson after 30 days to reassess your growth.`,
      author: 'Spiritual Growth Action Plan'
    },
    {
      id: ts(), type: 'video', order: 7,
      content: { url: 'https://www.youtube.com/watch?v=yWwOimr2D38' }
    },
    {
      id: ts(), type: 'quiz', order: 8,
      content: {
        question: `What is the primary Islamic principle that guides growth in the area of ${lessonTitle}?`,
        options: [
          'External compliance without internal change',
          'Integration of sincere intention with consistent righteous action',
          'Memorization of texts without reflection',
          'Avoiding all social interaction'
        ],
        correctIndex: 1,
        hint: 'Tazkiyah requires both internal and external transformation.'
      }
    },
    {
      id: ts(), type: 'quiz', order: 9,
      content: {
        question: 'According to Prophetic tradition, what does Allah look at when evaluating a person?',
        options: [
          'Their wealth and appearance',
          'Their social status and connections',
          'Their hearts and actions',
          'Their scholarly titles'
        ],
        correctIndex: 2,
        hint: 'Sahih Muslim — Allah looks at hearts and actions.'
      }
    },
    {
      id: ts(), type: 'reflection', order: 10,
      content: {
        translation: `How does ${lessonTitle} relate to your personal spiritual journey? What one change can you commit to this week?`,
        arabic: 'محاسبة النفس'
      }
    },
    {
      id: ts(), type: 'conclusion', order: 11,
      content: `Understanding ${lessonTitle} within the broader context of Tazkiyah empowers you to move from theoretical knowledge to real spiritual transformation. This lesson is a step in your journey toward a purified heart and a life lived in conscious awareness of Allah.`
    },
  ];
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function masterReseedCourse2() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Spiritual Development & Purification of the Heart');
  console.log('============================================\n');

  // 1. Find existing course
  const { data: course, error: courseErr } = await supabase
    .from('jobs')
    .select('id, title')
    .ilike('title', '%Spiritual Development%')
    .limit(1)
    .single();

  if (courseErr || !course) {
    // Try to create it
    console.log('Course not found. Creating it...');
    const { data: instructor } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
    const { data: newCourse, error: createErr } = await supabase
      .from('jobs')
      .insert({
        title: COURSE_TITLE,
        company: 'One Islam Institute',
        location: 'Remote / Online',
        description: 'A comprehensive 6-week certificate program focused on Tazkiyah — purification of the soul, emotional discipline, and spiritual growth.',
        course_level: 'intermediate',
        subject_area: 'Tazkiyah (Spiritual Purification)',
        total_modules: 30,
        total_lessons: 210,
        credit_hours: 40,
        status: 'active',
        price: 0.00,
        featured: true,
        instructor_id: instructor?.id,
      })
      .select()
      .single();
    if (createErr) { console.error('❌ Failed to create course:', createErr.message); process.exit(1); }
    console.log(`✅ Created course: "${newCourse.title}" (${newCourse.id})`);
    return runSeed(newCourse.id);
  }

  console.log(`✅ Found course: "${course.title}" (${course.id})\n`);
  return runSeed(course.id);
}

async function runSeed(courseId) {
  // 2. Clean up existing modules/lessons
  console.log('🗑  Cleaning up existing modules/lessons for this course...');
  const { data: existingMods } = await supabase.from('course_modules').select('id').eq('course_id', courseId);
  if (existingMods?.length > 0) {
    const modIds = existingMods.map(m => m.id);
    await supabase.from('course_lessons').delete().in('module_id', modIds);
    await supabase.from('course_modules').delete().eq('course_id', courseId);
    console.log(`   Removed ${existingMods.length} old modules.\n`);
  } else {
    console.log('   No existing modules found.\n');
  }

  let totalModules = 0;
  let totalLessons = 0;

  // 3. Seed all 30 modules and 210 lessons
  for (const mod of CURRICULUM) {
    process.stdout.write(`📚 Module ${mod.sort_order}/30: "${mod.title}" (Week ${mod.week})... `);

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

    console.log(`✅`);
    totalModules++;

    for (const lesson of mod.lessons) {
      const blocks = makeBlocks(lesson.title, mod.title, mod.week);
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
          coin_reward: 5,
          content_blocks: blocks,
        });

      if (lesErr) {
        console.log(`   ⚠️  Lesson "${lesson.title}": ${lesErr.message}`);
      } else {
        totalLessons++;
        process.stdout.write(`   ✅ ${lesson.sort_order}. ${lesson.title}\n`);
      }
    }
  }

  // 4. Update course totals
  await supabase
    .from('jobs')
    .update({ total_modules: totalModules, total_lessons: totalLessons, is_published: true, status: 'active' })
    .eq('id', courseId);

  console.log('\n============================================');
  console.log('✅ RESEED COMPLETE — Course 2');
  console.log(`   📦 Modules created : ${totalModules}/30`);
  console.log(`   📖 Lessons created : ${totalLessons}/210`);
  console.log(`   🌟 Content blocks  : 12 per lesson (rich, structured)`);
  console.log('============================================\n');
}

masterReseedCourse2().catch(err => { console.error('Fatal error:', err); process.exit(1); });
