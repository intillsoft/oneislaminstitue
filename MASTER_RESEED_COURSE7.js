/**
 * MASTER RESEED — Course 7: Modern Marriage, Attraction & Relationship Intelligence in Islam
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 * 
 * FOCUS: Relationship Psychology, Compatibility, and Communication (Zero overlap with Courses 1-6)
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Modern Marriage, Attraction & Relationship Intelligence in Islam';

const CURRICULUM = [
  // ─────────────────────────────────────────────────────────
  // WEEK 1 – Attraction, Compatibility & Choosing Right
  // ─────────────────────────────────────────────────────────
  {
    title: 'Understanding Modern Relationship Reality', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Analyzing dating culture vs Islamic structure and social media illusions.',
    lessons: [
      { title: 'Dating culture vs Islamic structure', sort_order: 1 },
      { title: 'Hookup psychology', sort_order: 2 },
      { title: 'Unrealistic expectations', sort_order: 3 },
      { title: 'Social media illusion', sort_order: 4 },
      { title: 'Cultural pressures', sort_order: 5 },
      { title: 'Red flag awareness', sort_order: 6 },
      { title: 'Weekly reflection', sort_order: 7 },
    ]
  },
  {
    title: 'Self-Preparation Before Marriage', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: Maturity tests, trauma awareness, and spiritual readiness indicators.',
    lessons: [
      { title: 'Emotional maturity test', sort_order: 1 },
      { title: 'Trauma baggage awareness', sort_order: 2 },
      { title: 'Financial readiness', sort_order: 3 },
      { title: 'Masculinity & femininity balance', sort_order: 4 },
      { title: 'Spiritual readiness indicators', sort_order: 5 },
      { title: 'Self-improvement roadmap', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Compatibility Framework', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Aligning values, communication styles, and attachment patterns.',
    lessons: [
      { title: 'Values alignment', sort_order: 1 },
      { title: 'Communication styles', sort_order: 2 },
      { title: 'Attachment styles', sort_order: 3 },
      { title: 'Conflict patterns', sort_order: 4 },
      { title: 'Lifestyle expectations', sort_order: 5 },
      { title: 'Long-term vision matching', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Attraction & Respect', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Polarity principles, confidence signals, and emotional attraction.',
    lessons: [
      { title: 'Emotional attraction', sort_order: 1 },
      { title: 'Physical attraction expectations', sort_order: 2 },
      { title: 'Respect dynamics', sort_order: 3 },
      { title: 'Polarity principles', sort_order: 4 },
      { title: 'Confidence signals', sort_order: 5 },
      { title: 'Maintaining dignity', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Proposal & Decision-Making', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Due diligence, Istikhara models, and asking the right questions.',
    lessons: [
      { title: 'Asking the right questions', sort_order: 1 },
      { title: 'Family involvement strategy', sort_order: 2 },
      { title: 'Avoiding emotional rush', sort_order: 3 },
      { title: 'Due diligence', sort_order: 4 },
      { title: 'Istikhara decision model', sort_order: 5 },
      { title: 'Final evaluation checklist', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 2 – Communication Mastery
  // ─────────────────────────────────────────────────────────
  {
    title: 'Communication Styles', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Direct vs indirect styles and repairing misunderstandings.',
    lessons: [
      { title: 'Direct vs indirect styles', sort_order: 1 },
      { title: 'Emotional vs logical processing', sort_order: 2 },
      { title: 'Listening without reacting', sort_order: 3 },
      { title: 'Miscommunication traps', sort_order: 4 },
      { title: 'Tone control', sort_order: 5 },
      { title: 'Repairing misunderstandings', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Conflict Resolution', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Escalation patterns, time-out strategies, and apology structures.',
    lessons: [
      { title: 'Argument triggers', sort_order: 1 },
      { title: 'Escalation patterns', sort_order: 2 },
      { title: 'Time-out strategy', sort_order: 3 },
      { title: 'Solution-focused dialogue', sort_order: 4 },
      { title: 'Apology structure', sort_order: 5 },
      { title: 'Repair conversations', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Intimacy', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Building trust through vulnerability and validation rituals.',
    lessons: [
      { title: 'Vulnerability skills', sort_order: 1 },
      { title: 'Building trust', sort_order: 2 },
      { title: 'Sharing fears safely', sort_order: 3 },
      { title: 'Validation techniques', sort_order: 4 },
      { title: 'Avoiding emotional shutdown', sort_order: 5 },
      { title: 'Reconnection rituals', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Respect & Authority Balance', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Leadership, consultation, and ego management in marriage.',
    lessons: [
      { title: 'Leadership in marriage', sort_order: 1 },
      { title: 'Mutual consultation', sort_order: 2 },
      { title: 'Decision hierarchy', sort_order: 3 },
      { title: 'Ego management', sort_order: 4 },
      { title: 'Fair compromise', sort_order: 5 },
      { title: 'Maintaining harmony', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Boundaries in Marriage', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Navigating social media, privacy, and online transparency.',
    lessons: [
      { title: 'Social media jealousy', sort_order: 1 },
      { title: 'Opposite-gender boundaries', sort_order: 2 },
      { title: 'Privacy protection', sort_order: 3 },
      { title: 'Online transparency', sort_order: 4 },
      { title: 'Avoiding comparison', sort_order: 5 },
      { title: 'Digital trust system', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 3 – Intimacy & Emotional Security
  // ─────────────────────────────────────────────────────────
  {
    title: 'Emotional Safety', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Protecting vulnerability and creating safe stability habits.',
    lessons: [
      { title: 'Creating safe space', sort_order: 1 },
      { title: 'Avoiding humiliation', sort_order: 2 },
      { title: 'Handling criticism', sort_order: 3 },
      { title: 'Protecting vulnerability', sort_order: 4 },
      { title: 'Emotional reassurance', sort_order: 5 },
      { title: 'Stability habits', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Physical Intimacy Framework', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Communication, healthy expectations, and long-term attraction.',
    lessons: [
      { title: 'Healthy expectations', sort_order: 1 },
      { title: 'Communication in intimacy', sort_order: 2 },
      { title: 'Avoiding performance pressure', sort_order: 3 },
      { title: 'Respecting boundaries', sort_order: 4 },
      { title: 'Mutual satisfaction mindset', sort_order: 5 },
      { title: 'Maintaining attraction long-term', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Jealousy & Possessiveness', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Distinguishing healthy jealousy from control behavior.',
    lessons: [
      { title: 'Healthy jealousy', sort_order: 1 },
      { title: 'Insecurity roots', sort_order: 2 },
      { title: 'Trust-building', sort_order: 3 },
      { title: 'Avoiding control behavior', sort_order: 4 },
      { title: 'Emotional reassurance', sort_order: 5 },
      { title: 'Stability plan', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Trauma in Marriage', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Supporting healing from past scars and joint recovery plans.',
    lessons: [
      { title: 'Past relationship scars', sort_order: 1 },
      { title: 'Childhood wounds', sort_order: 2 },
      { title: 'Trigger awareness', sort_order: 3 },
      { title: 'Supporting healing', sort_order: 4 },
      { title: 'Avoiding blame cycles', sort_order: 5 },
      { title: 'Joint recovery plan', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Maintaining Romance', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Quality time, appreciation habits, and renewal rituals.',
    lessons: [
      { title: 'Surprise culture', sort_order: 1 },
      { title: 'Appreciation habits', sort_order: 2 },
      { title: 'Non-verbal affection', sort_order: 3 },
      { title: 'Quality time structure', sort_order: 4 },
      { title: 'Shared experiences', sort_order: 5 },
      { title: 'Renewal rituals', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 4 – Finance, Roles & Stability
  // ─────────────────────────────────────────────────────────
  {
    title: 'Financial Alignment', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Income transparency, budget systems, and financial trust.',
    lessons: [
      { title: 'Income transparency', sort_order: 1 },
      { title: 'Budget systems', sort_order: 2 },
      { title: 'Saving goals', sort_order: 3 },
      { title: 'Debt discussion', sort_order: 4 },
      { title: 'Spending expectations', sort_order: 5 },
      { title: 'Financial trust', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Gender Roles in Modern Context', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Work-life balance and aligning shared responsibilities.',
    lessons: [
      { title: 'Cultural vs religious roles', sort_order: 1 },
      { title: 'Work-life balance', sort_order: 2 },
      { title: 'Shared responsibilities', sort_order: 3 },
      { title: 'Parenting alignment', sort_order: 4 },
      { title: 'Decision authority', sort_order: 5 },
      { title: 'Respect structure', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'In-Laws & Extended Family', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Setting boundaries and managing cultural pressures.',
    lessons: [
      { title: 'Boundary setting', sort_order: 1 },
      { title: 'Cultural pressure', sort_order: 2 },
      { title: 'Respect without interference', sort_order: 3 },
      { title: 'Visiting frequency', sort_order: 4 },
      { title: 'Conflict mediation', sort_order: 5 },
      { title: 'Unified couple strategy', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Crisis Management in Marriage', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Joint resilience during job loss, health issues, or stress.',
    lessons: [
      { title: 'Job loss', sort_order: 1 },
      { title: 'Infertility', sort_order: 2 },
      { title: 'Financial collapse', sort_order: 3 },
      { title: 'Emotional distance', sort_order: 4 },
      { title: 'Health challenges', sort_order: 5 },
      { title: 'Joint resilience system', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Rebuilding After Conflict', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Trust repair, forgiveness, and recommitment dialogues.',
    lessons: [
      { title: 'Trust repair', sort_order: 1 },
      { title: 'Forgiveness process', sort_order: 2 },
      { title: 'Behavior change plans', sort_order: 3 },
      { title: 'Recommitment dialogue', sort_order: 4 },
      { title: 'Monitoring improvement', sort_order: 5 },
      { title: 'Stability restoration', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 5 – Parenting & Family Legacy
  // ─────────────────────────────────────────────────────────
  {
    title: 'Parenting Alignment', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Discipline frameworks and emotional coaching for kids.',
    lessons: [
      { title: 'Parenting philosophy', sort_order: 1 },
      { title: 'Discipline framework', sort_order: 2 },
      { title: 'Emotional coaching', sort_order: 3 },
      { title: 'Screen boundaries', sort_order: 4 },
      { title: 'Value transmission', sort_order: 5 },
      { title: 'Consistency system', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Raising Confident Children', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Identity building and leadership exposure for children.',
    lessons: [
      { title: 'Identity building', sort_order: 1 },
      { title: 'Self-esteem development', sort_order: 2 },
      { title: 'Responsibility training', sort_order: 3 },
      { title: 'Emotional intelligence', sort_order: 4 },
      { title: 'Leadership exposure', sort_order: 5 },
      { title: 'Faith confidence', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Teen Challenges', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Navigating peer pressure, social media, and communication.',
    lessons: [
      { title: 'Social media exposure', sort_order: 1 },
      { title: 'Peer pressure', sort_order: 2 },
      { title: 'Gender confusion', sort_order: 3 },
      { title: 'Communication bridges', sort_order: 4 },
      { title: 'Discipline without rebellion', sort_order: 5 },
      { title: 'Monitoring strategy', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Protecting Family Stability', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Legacy planning and protecting the family from external influence.',
    lessons: [
      { title: 'External influences', sort_order: 1 },
      { title: 'Community integration', sort_order: 2 },
      { title: 'Time prioritization', sort_order: 3 },
      { title: 'Family rituals', sort_order: 4 },
      { title: 'Crisis readiness', sort_order: 5 },
      { title: 'Legacy planning', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Marriage Renewal Strategy', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Annual review systems and recalibration processes.',
    lessons: [
      { title: 'Annual review system', sort_order: 1 },
      { title: 'Shared goal planning', sort_order: 2 },
      { title: 'Growth conversations', sort_order: 3 },
      { title: 'Emotional check-ins', sort_order: 4 },
      { title: 'Recalibration process', sort_order: 5 },
      { title: 'Long-term vision', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 6 – Advanced Relationship Intelligence
  // ─────────────────────────────────────────────────────────
  {
    title: 'Long-Term Attraction Maintenance', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Self-improvement habits and shared ambition.',
    lessons: [
      { title: 'Self-improvement habits', sort_order: 1 },
      { title: 'Physical health', sort_order: 2 },
      { title: 'Intellectual growth', sort_order: 3 },
      { title: 'Shared ambition', sort_order: 4 },
      { title: 'Respect preservation', sort_order: 5 },
      { title: 'Growth partnership', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Leadership & Influence in Family', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Family governance models and modeling values.',
    lessons: [
      { title: 'Modeling behavior', sort_order: 1 },
      { title: 'Decision authority balance', sort_order: 2 },
      { title: 'Inspiring children', sort_order: 3 },
      { title: 'Crisis leadership', sort_order: 4 },
      { title: 'Value reinforcement', sort_order: 5 },
      { title: 'Family governance model', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Handling External Temptations', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Digital boundaries and prevention strategies.',
    lessons: [
      { title: 'Workplace boundaries', sort_order: 1 },
      { title: 'Digital flirtation risks', sort_order: 2 },
      { title: 'Emotional cheating', sort_order: 3 },
      { title: 'Prevention strategies', sort_order: 4 },
      { title: 'Trust repair after breach', sort_order: 5 },
      { title: 'Accountability systems', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Building a Legacy Marriage', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Strategic wealth and long-term education planning.',
    lessons: [
      { title: 'Long-term wealth strategy', sort_order: 1 },
      { title: 'Education planning', sort_order: 2 },
      { title: 'Intergenerational values', sort_order: 3 },
      { title: 'Social contribution', sort_order: 4 },
      { title: 'Retirement vision', sort_order: 5 },
      { title: 'Marriage mission statement', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Final Integration & Capstone', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Relationship audit and written family blueprint.',
    lessons: [
      { title: 'Relationship audit', sort_order: 1 },
      { title: 'Compatibility reassessment', sort_order: 2 },
      { title: 'Personal growth evaluation', sort_order: 3 },
      { title: 'Written family blueprint', sort_order: 4 },
      { title: 'Oral presentation', sort_order: 5 },
      { title: 'Final exam', sort_order: 6 },
      { title: 'Certification review', sort_order: 7 },
    ]
  },
];

// CONTENT BLOCK BUILDER (Relationship Intelligence + Modern Context)
function makeBlocks(lessonTitle, moduleName, week) {
  const id = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;
  return [
    {
      id: id(), type: 'objectives', order: 0,
      content: {
        items: [
          `Analyze the psychological underpinnings of ${lessonTitle}.`,
          `Identify modern challenges and pitfalls regarding ${lessonTitle}.`,
          `Develop a proactive Islamic strategy for managing ${lessonTitle}.`,
          `Synthesize learnings from ${moduleName} to build a lasting relationship blueprint.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: Mastering relationship intelligence through the lens of modern psychology and Islamic wisdom.`,
        arabic: 'الذكاء العاطفي الزوجي'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nIn this session, we dive deep into **${lessonTitle}**. Modern marriage faces unprecedented pressures from digital culture, changing social roles, and unrealistic expectations. To succeed, we must move beyond basic law into true relationship intelligence.\n\n> "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy." (Surah Ar-Rum 30:21)\n\nTranquillity (*Sakinah*) is not accidental; it is built through the intentional practice of ${lessonTitle}.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Identification', description: `Recognizing the signs of ${lessonTitle} in your bond.`, icon: 'Search' },
          { title: 'Communication', description: 'Opening the dialogue with empathy.', icon: 'MessageSquare' },
          { title: 'Adjustment', description: 'Modifying behaviors and expectations.', icon: 'Sliders' },
          { title: 'Connection', description: 'Strengthening the bond of trust.', icon: 'Heart' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'They are clothing for you and you are clothing for them. (Surah Al-Baqarah 2:187)',
        arabic: 'هُنَّ لِبَاسٌ لَّكُمْ وَأَنتُمْ لِبَاسٌ لَّهُنَّ'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'The best of you are those who are best to their wives. (At-Tirmidhi)',
        arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا وَخِيَارُكُمْ خِيَارُكُمْ لِنِسَائِهِمْ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Relationship Lab: ${lessonTitle}\n\nTo master **${moduleName}**, you must learn the art of emotional responsiveness. When your partner raises an issue regarding ${lessonTitle}, it is an invitation for connection, not an attack.\n\n1. **Triggers** — What makes ${lessonTitle} difficult for you?\n2. **The "Bids" for Connection** — How to spot them in daily life.\n3. **De-escalation** — Breaking the cycle of blame.\n4. **Legacy** — How this strength impacts your children and future generations.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Relationship Intelligence Task:\n- Perform a 5-minute "Relationship Audit" focused on ${lessonTitle}.\n- Identify one "Repair Attempt" you can use this week.\n- Discuss one shared goal related to ${moduleName} with your partner or mentor.\n- Record one thing you appreciate about your partner’s approach to this topic.`,
      author: 'Relationship Intelligence Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `What is the primary psychological goal of the "Clothing" metaphor (2:187) in the context of ${lessonTitle}?`,
        options: [
          'Strict control over one another',
          'Mutual protection, warmth, and concealment of faults',
          'Economic partnership only',
          'A reminder to dress modestly'
        ],
        correctIndex: 1,
        hint: 'Clothes protect and cover.'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `In modern psychology, what is the most effective way to handle a conflict regarding ${lessonTitle}?`,
        options: [
          'Winning the argument at any cost',
          'Using "I" statements and emotional validation',
          'Silent treatment until they apologize',
          'Bringing up past mistakes to gain leverage'
        ],
        correctIndex: 1,
        hint: 'Focus on your own feelings rather than attacking.'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'What is "Sakinah" in the context of relationship intelligence?',
        options: [
          'A state of constant excitement',
          'The presence of deep rooted peace and security in the home',
          'The absence of any disagreement',
          'Strict adherence to traditional gender roles only'
        ],
        correctIndex: 1,
        hint: 'It is the core goal of an Islamic marriage.'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `How would your family life transform if ${lessonTitle} became a core strength of your home? What is one behavior you are willing to change today to invite more Sakinah?`,
        arabic: 'التفكر الزوجي'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'The Gottman Institute — Research-Based Marriage',
        description: 'World-leading research on why marriages succeed or fail.',
        url: 'https://www.gottman.com/blog/category/marriage-life/',
        platform: 'Gottman Institute'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Institute for Family Studies — Modern Realities',
        description: 'Data and analysis on marriage trends in the digital age.',
        url: 'https://ifstudies.org/blog/category/marriage',
        platform: 'IFS'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `Mastering ${lessonTitle} is an investment in your legacy. By completing this session within ${moduleName}, you are building a home founded on Sakinah, Mawaddah, and Rahmah. Carry these insights into your daily interactions and watch your relationships thrive.`
    },
  ];
}

// MAIN SEED
async function masterReseedCourse7() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Relationship Intelligence (Course 7)');
  console.log('============================================\n');

  // ALWAYS create a brand new official course entry
  console.log('🏗  Creating new official Course 7 entry...');
  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week premium relationship intelligence program. Master communication, compatibility, intimacy, and family legacy through modern psychology and Islamic wisdom.',
    course_level: 'advanced',
    subject_area: 'Relationship Intelligence (Ahl al-Bayt)',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 55,
    status: 'published',
    price: 0.00,
    featured: true,
    instructor_id: instr?.id,
  }).select().single();

  if (ce) { 
    console.error('❌ Could not create official course:', ce.message); 
    process.exit(1); 
  }
  
  const course = nc;
  console.log(`✅ Created Official Course: "${course.title}" (${course.id})\n`);

  let totalModules = 0, totalLessons = 0;

  for (const mod of CURRICULUM) {
    process.stdout.write(`📚 Module ${mod.sort_order}/30: "${mod.title}" (Week ${mod.week})... `);
    const { data: newMod, error: me } = await supabase.from('course_modules').insert({
      course_id: course.id,
      title: mod.title,
      description: mod.description,
      sort_order: mod.sort_order,
      unlock_week: mod.week,
      is_published: true,
    }).select().single();

    if (me || !newMod) { console.log(`❌ ${me?.message}`); continue; }
    console.log(`✅`);
    totalModules++;

    for (const lesson of mod.lessons) {
      const blocks = makeBlocks(lesson.title, mod.title, mod.week);
      const { data: newLesson, error: le } = await supabase.from('course_lessons').insert({
        module_id: newMod.id,
        course_id: course.id,
        title: lesson.title,
        sort_order: lesson.sort_order,
        content_type: 'text',
        is_published: true,
        duration_minutes: 20,
        xp_reward: 15,
        coin_reward: 10,
      }).select().single();
      
      if (newLesson) {
        await supabase.from('course_lessons').update({ content_blocks: blocks }).eq('id', newLesson.id);
        totalLessons++; 
        process.stdout.write(`   ✅ ${lesson.sort_order}. ${lesson.title}\n`); 
      } else {
        console.log(`   ⚠️  "${lesson.title}" failed.`);
      }
    }
  }

  // Update totals
  await supabase.from('jobs').update({
    total_modules: totalModules,
    total_lessons: totalLessons,
  }).eq('id', course.id);

  console.log('\n============================================');
  console.log('✅ COMPLETE — Course 7: Modern Marriage & Relationship Intelligence');
  console.log(`   📦 Modules  : ${totalModules}/30`);
  console.log(`   📖 Lessons  : ${totalLessons}/210`);
  console.log(`   🌟 Blocks   : 15 per lesson`);
  console.log('============================================\n');
}

masterReseedCourse7().catch(e => { console.error('Fatal:', e); process.exit(1); });
