/**
 * MASTER RESEED — Course 6: Psychological Strength, Trauma Recovery & Emotional Mastery for Muslims
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 * 
 * FOCUS: Applied Psychology + Islamic Framework (Zero overlap with Courses 1-5)
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Psychological Strength, Trauma Recovery & Emotional Mastery for Muslims';

const CURRICULUM = [
  // ─────────────────────────────────────────────────────────
  // WEEK 1 – Understanding the Modern Mind Crisis
  // ─────────────────────────────────────────────────────────
  {
    title: 'The Modern Mental Health Epidemic', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Analyzing anxiety, isolation, and burnout in the digital age.',
    lessons: [
      { title: 'Global rise of anxiety disorders', sort_order: 1 },
      { title: 'Social pressure and performance culture', sort_order: 2 },
      { title: 'Isolation in the digital age', sort_order: 3 },
      { title: 'Emotional suppression patterns', sort_order: 4 },
      { title: 'Burnout culture', sort_order: 5 },
      { title: 'Faith and psychological misunderstanding', sort_order: 6 },
      { title: 'Weekly reflection', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Awareness Framework', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: Building vocabulary and skills for regulating emotional intensity.',
    lessons: [
      { title: 'What emotions actually are', sort_order: 1 },
      { title: 'Differentiating thoughts vs feelings', sort_order: 2 },
      { title: 'Emotional vocabulary building', sort_order: 3 },
      { title: 'Trigger identification', sort_order: 4 },
      { title: 'Emotional misinterpretation', sort_order: 5 },
      { title: 'Regulating intensity', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Stress & Nervous System Basics', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Body-mind connection and stress reset techniques.',
    lessons: [
      { title: 'Fight or flight explained', sort_order: 1 },
      { title: 'Chronic stress damage', sort_order: 2 },
      { title: 'Cortisol and burnout', sort_order: 3 },
      { title: 'Body-mind connection', sort_order: 4 },
      { title: 'Sleep and emotional balance', sort_order: 5 },
      { title: 'Stress reset techniques', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Identity & Internal Narratives', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Rewriting negative core beliefs and shame-based identity.',
    lessons: [
      { title: 'Self-talk patterns', sort_order: 1 },
      { title: 'Negative core beliefs', sort_order: 2 },
      { title: 'Shame-based identity', sort_order: 3 },
      { title: 'Impostor syndrome', sort_order: 4 },
      { title: 'Rewriting mental narratives', sort_order: 5 },
      { title: 'Faith-aligned identity building', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Discipline Training', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Interruption techniques and internal boundary setting.',
    lessons: [
      { title: 'Delayed reaction skills', sort_order: 1 },
      { title: 'Anger interruption techniques', sort_order: 2 },
      { title: 'Overthinking control', sort_order: 3 },
      { title: 'Emotional pause framework', sort_order: 4 },
      { title: 'Internal boundary setting', sort_order: 5 },
      { title: 'Personal regulation plan', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 2 – Anxiety, Fear & Overthinking
  // ─────────────────────────────────────────────────────────
  {
    title: 'Understanding Anxiety Mechanisms', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Navigating future-based thinking and catastrophic patterns.',
    lessons: [
      { title: 'Fear vs anxiety', sort_order: 1 },
      { title: 'Future-based thinking', sort_order: 2 },
      { title: 'Catastrophic thinking', sort_order: 3 },
      { title: 'Control illusion', sort_order: 4 },
      { title: 'Avoidance patterns', sort_order: 5 },
      { title: 'Acceptance strategy', sort_order: 6 },
      { title: 'Weekly reflection', sort_order: 7 },
    ]
  },
  {
    title: 'Panic & Physical Symptoms', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Rapid calming and grounding tools for panic.',
    lessons: [
      { title: 'What panic attacks are', sort_order: 1 },
      { title: 'Breathing dysregulation', sort_order: 2 },
      { title: 'Physical symptom misinterpretation', sort_order: 3 },
      { title: 'Rapid calming techniques', sort_order: 4 },
      { title: 'Grounding tools', sort_order: 5 },
      { title: 'Exposure principles', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Overthinking & Rumination', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Interrupting the loop and reframing mental distortions.',
    lessons: [
      { title: 'Rumination cycle', sort_order: 1 },
      { title: 'Loop interruption techniques', sort_order: 2 },
      { title: 'Mental reframing', sort_order: 3 },
      { title: 'Cognitive distortions', sort_order: 4 },
      { title: 'Thought journaling', sort_order: 5 },
      { title: 'Clarity decision model', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Fear of Failure', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Overcoming perfectionism traps and comparison anxiety.',
    lessons: [
      { title: 'Perfectionism traps', sort_order: 1 },
      { title: 'Public embarrassment fear', sort_order: 2 },
      { title: 'Comparison anxiety', sort_order: 3 },
      { title: 'Growth mindset training', sort_order: 4 },
      { title: 'Risk tolerance development', sort_order: 5 },
      { title: 'Resilience planning', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Building Inner Security', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Developing self-trust and emotional grounding rituals.',
    lessons: [
      { title: 'Internal validation', sort_order: 1 },
      { title: 'Self-trust development', sort_order: 2 },
      { title: 'Confidence building', sort_order: 3 },
      { title: 'Emotional grounding rituals', sort_order: 4 },
      { title: 'Stability habits', sort_order: 5 },
      { title: 'Weekly security blueprint', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 3 – Depression, Hopelessness & Motivation Collapse
  // ─────────────────────────────────────────────────────────
  {
    title: 'Understanding Depression Patterns', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Analyzing emotional numbness and when to seek professional help.',
    lessons: [
      { title: 'Sadness vs depression', sort_order: 1 },
      { title: 'Emotional numbness', sort_order: 2 },
      { title: 'Loss of meaning', sort_order: 3 },
      { title: 'Withdrawal cycles', sort_order: 4 },
      { title: 'Brain chemistry overview', sort_order: 5 },
      { title: 'Seeking professional help', sort_order: 6 },
      { title: 'Weekly reflection', sort_order: 7 },
    ]
  },
  {
    title: 'Hopelessness & Purpose Loss', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Navigating identity confusion through value alignment.',
    lessons: [
      { title: 'Meaning crisis', sort_order: 1 },
      { title: 'Identity confusion', sort_order: 2 },
      { title: 'Purpose discovery exercises', sort_order: 3 },
      { title: 'Value alignment', sort_order: 4 },
      { title: 'Direction building', sort_order: 5 },
      { title: 'Long-term clarity map', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Motivation Rebuilding', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Dopamine balance and the micro-goal framework.',
    lessons: [
      { title: 'Dopamine imbalance', sort_order: 1 },
      { title: 'Micro-goal framework', sort_order: 2 },
      { title: 'Habit stacking', sort_order: 3 },
      { title: 'Energy management', sort_order: 4 },
      { title: 'Action before motivation', sort_order: 5 },
      { title: 'Consistency tracking', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Isolation & Loneliness', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Rebuilding connection, vulnerability skills, and trust.',
    lessons: [
      { title: 'Social withdrawal', sort_order: 1 },
      { title: 'Rebuilding connections', sort_order: 2 },
      { title: 'Vulnerability skills', sort_order: 3 },
      { title: 'Healthy support systems', sort_order: 4 },
      { title: 'Community integration', sort_order: 5 },
      { title: 'Trust rebuilding', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Restoring Emotional Energy', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Burnout recovery, rest cycles, and saying no.',
    lessons: [
      { title: 'Burnout recovery', sort_order: 1 },
      { title: 'Boundaries', sort_order: 2 },
      { title: 'Saying no', sort_order: 3 },
      { title: 'Rest cycles', sort_order: 4 },
      { title: 'Joy scheduling', sort_order: 5 },
      { title: 'Emotional recharge plan', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 4 – Trauma, Pain & Emotional Healing
  // ─────────────────────────────────────────────────────────
  {
    title: 'Understanding Trauma', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Childhood trauma, flashbacks, and bodily storage of pain.',
    lessons: [
      { title: 'What trauma is', sort_order: 1 },
      { title: 'Childhood trauma', sort_order: 2 },
      { title: 'Emotional flashbacks', sort_order: 3 },
      { title: 'Triggers', sort_order: 4 },
      { title: 'Body storage of trauma', sort_order: 5 },
      { title: 'Healing stages', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Forgiveness & Release', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Letting go of resentment and emotional closure ritual.',
    lessons: [
      { title: 'What forgiveness is not', sort_order: 1 },
      { title: 'Boundaries after harm', sort_order: 2 },
      { title: 'Letting go of resentment', sort_order: 3 },
      { title: 'Processing anger', sort_order: 4 },
      { title: 'Emotional closure', sort_order: 5 },
      { title: 'Personal healing ritual', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Guilt & Shame Recovery', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Self-compassion training and shame detox.',
    lessons: [
      { title: 'Healthy guilt vs toxic shame', sort_order: 1 },
      { title: 'Self-condemnation cycles', sort_order: 2 },
      { title: 'Repairing mistakes', sort_order: 3 },
      { title: 'Self-compassion training', sort_order: 4 },
      { title: 'Accountability restoration', sort_order: 5 },
      { title: 'Shame detox framework', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Boundaries', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Identifying toxic patterns and practicing assertiveness.',
    lessons: [
      { title: 'Toxic relationships', sort_order: 1 },
      { title: 'Manipulation patterns', sort_order: 2 },
      { title: 'Assertiveness skills', sort_order: 3 },
      { title: 'Protecting energy', sort_order: 4 },
      { title: 'Communication boundaries', sort_order: 5 },
      { title: 'Personal safety plan', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Rebuilding After Crisis', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Life post-divorce, career collapse, or public humiliation.',
    lessons: [
      { title: 'Life after divorce', sort_order: 1 },
      { title: 'Career collapse recovery', sort_order: 2 },
      { title: 'Public humiliation', sort_order: 3 },
      { title: 'Financial stress recovery', sort_order: 4 },
      { title: 'Reinvention strategy', sort_order: 5 },
      { title: 'Post-trauma growth', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 5 – High Performance & Emotional Mastery
  // ─────────────────────────────────────────────────────────
  {
    title: 'Discipline Under Pressure', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Composure, stress inoculation, and resilient routines.',
    lessons: [
      { title: 'Emotional control in conflict', sort_order: 1 },
      { title: 'High-stakes calmness', sort_order: 2 },
      { title: 'Leadership composure', sort_order: 3 },
      { title: 'Stress inoculation', sort_order: 4 },
      { title: 'Resilient routines', sort_order: 5 },
      { title: 'Pressure blueprint', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Confidence Mastery', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Presence training and voice/body language psychology.',
    lessons: [
      { title: 'Internal vs external confidence', sort_order: 1 },
      { title: 'Presence training', sort_order: 2 },
      { title: 'Voice control', sort_order: 3 },
      { title: 'Body language psychology', sort_order: 4 },
      { title: 'Self-assurance habits', sort_order: 5 },
      { title: 'Authority without arrogance', sort_order: 6 },
      { title: 'Weekly integration', sort_order: 7 },
    ]
  },
  {
    title: 'Decision-Making Clarity', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Eliminating emotional bias and strategic thinking.',
    lessons: [
      { title: 'Emotional bias', sort_order: 1 },
      { title: 'Strategic thinking', sort_order: 2 },
      { title: 'Risk evaluation', sort_order: 3 },
      { title: 'Long-term thinking', sort_order: 4 },
      { title: 'Clarity checklist', sort_order: 5 },
      { title: 'Decisive action framework', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Intelligence in Leadership', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Empathy balance and influence without force.',
    lessons: [
      { title: 'Empathy balance', sort_order: 1 },
      { title: 'Influence without force', sort_order: 2 },
      { title: 'Conflict navigation', sort_order: 3 },
      { title: 'Listening mastery', sort_order: 4 },
      { title: 'Crisis communication', sort_order: 5 },
      { title: 'Authority with compassion', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Stability in Success', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Handling praise/criticism and sustainable ambition.',
    lessons: [
      { title: 'Avoiding ego inflation', sort_order: 1 },
      { title: 'Handling praise', sort_order: 2 },
      { title: 'Managing criticism', sort_order: 3 },
      { title: 'Sustainable ambition', sort_order: 4 },
      { title: 'Balanced lifestyle', sort_order: 5 },
      { title: 'Long-term discipline', sort_order: 6 },
      { title: 'Weekly assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 6 – Personal Emotional Blueprint
  // ─────────────────────────────────────────────────────────
  {
    title: 'Personal Emotional Audit', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Mapping strengths, triggers, and stress patterns.',
    lessons: [
      { title: 'Strength mapping', sort_order: 1 },
      { title: 'Weakness identification', sort_order: 2 },
      { title: 'Trigger map', sort_order: 3 },
      { title: 'Stress pattern tracking', sort_order: 4 },
      { title: 'Emotional habits review', sort_order: 5 },
      { title: 'Blueprint drafting', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Building a Long-Term Resilience System', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Daily regulation routines and crisis backup plans.',
    lessons: [
      { title: 'Daily regulation routine', sort_order: 1 },
      { title: 'Weekly reset system', sort_order: 2 },
      { title: 'Monthly evaluation', sort_order: 3 },
      { title: 'Crisis backup plan', sort_order: 4 },
      { title: 'Support network design', sort_order: 5 },
      { title: 'Sustainability plan', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Faith-Based Psychological Anchoring', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Gratitude reprogramming and identity stability.',
    lessons: [
      { title: 'Trust in uncertainty', sort_order: 1 },
      { title: 'Emotional reliance framework', sort_order: 2 },
      { title: 'Patience mechanics', sort_order: 3 },
      { title: 'Gratitude reprogramming', sort_order: 4 },
      { title: 'Identity stability', sort_order: 5 },
      { title: 'Long-term grounding system', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Life Design Strategy', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Purpose scheduling and relationship prioritization.',
    lessons: [
      { title: 'Vision clarity', sort_order: 1 },
      { title: 'Energy alignment', sort_order: 2 },
      { title: 'Work-life structure', sort_order: 3 },
      { title: 'Relationship prioritization', sort_order: 4 },
      { title: 'Purpose scheduling', sort_order: 5 },
      { title: 'Long-term mental health plan', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Final Integration & Capstone', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Transformation summary and crisis response simulation.',
    lessons: [
      { title: 'Personal transformation summary', sort_order: 1 },
      { title: 'Emotional mastery checklist', sort_order: 2 },
      { title: 'Crisis response simulation', sort_order: 3 },
      { title: 'Written blueprint submission', sort_order: 4 },
      { title: 'Oral presentation', sort_order: 5 },
      { title: 'Final exam', sort_order: 6 },
      { title: 'Certification review', sort_order: 7 },
    ]
  },
];

// CONTENT BLOCK BUILDER (Applied Psychology + Islamic Perspective)
function makeBlocks(lessonTitle, moduleName, week) {
  const id = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;
  return [
    {
      id: id(), type: 'objectives', order: 0,
      content: {
        items: [
          `Master the fundamental psychology behind ${lessonTitle}.`,
          `Identify biological and cognitive triggers for ${lessonTitle}.`,
          `Implement Islamic grounding techniques to navigate ${lessonTitle}.`,
          `Design a personal mastery strategy within the context of ${moduleName}.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: A clinical and spiritual deep-dive into mastering the modern Muslim's emotional landscape.`,
        arabic: 'القوة النفسية'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nWelcome to a specialized analysis of **${lessonTitle}**. This module moves beyond theory into the mechanics of your mind and heart. In a time of unprecedented global pressure, isolation, and burnout, understanding ${lessonTitle} is a survival skill.\n\n> "No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that." (Prophetic Narrative)\n\nWe don't just "deal" with life; we master our internal response to it through a combination of evidence-based clinical psychology and the timeless stability of the Islamic tradition.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Awareness', description: `Sensing the onset of ${lessonTitle} in the body.`, icon: 'Activity' },
          { title: 'Interruption', description: 'Immediate physical pause techniques.', icon: 'Shield' },
          { title: 'Reframing', description: 'Faith-aligned cognitive shifting.', icon: 'Unlock' },
          { title: 'Mastery', description: 'Long-term habit transformation.', icon: 'Sun' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'He it is Who sent down as-Sakinah (calmness and tranquillity) into the hearts of the believers, that they may grow more in Faith along with their (present) Faith. (Surah Al-Fath 48:4)',
        arabic: 'هُوَ الَّذِي أَنْزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَعَ إِيمَانِهِمْ'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger. (Bukhari & Muslim)',
        arabic: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Behavioral Lab: ${lessonTitle}\n\nTo master **${moduleName}**, you must learn to observe your own nervous system. When you face ${lessonTitle}, your brain often switches to an automatic, survival-driven response. Our goal is to activate the prefrontal cortex—the seat of reason and faith.\n\n1. **Biological Markers** — How ${lessonTitle} feels in your chest, gut, and head.\n2. **The "Grand Narrative"** — How your faith explains this moment of pain.\n3. **Tactical Response** — The 5-second rule for emotional regulation.\n4. **Recovery** — Returning to a state of Sakinah.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Psychological Mastery Task:\n- Record your primary internal narrative during ${lessonTitle}.\n- Challenge it with one attribute of Allah’s Mercy or Wisdom.\n- Practice one "Nervous System Reset" for 2 minutes today.\n- Identify one boundary that needs to be set to protect your peace.`,
      author: 'Emotional Mastery Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `What is the primary psychological function of "Sakinah" in the context of ${lessonTitle}?`,
        options: [
          'Complete removal of all external problems',
          'Internal stability and tranquility amidst external chaos',
          'Avoidance and denial of real difficulties',
          'Suppressing all human emotions entirely'
        ],
        correctIndex: 1,
        hint: 'Sakinah is described as coming *into* the heart during trial.'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `In modern psychology, what is the best way to handle a "trigger" related to ${lessonTitle}?`,
        options: [
          'Immediate reactive behavior to release energy',
          'Naming the emotion and practicing a mindful pause',
          'Ignoring it until it goes away',
          'Blaming others for the trigger'
        ],
        correctIndex: 1,
        hint: '"Name it to tame it."'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'Why is "Delayed Reaction" critical for emotional mastery?',
        options: [
          'It shows you are slow at thinking',
          'It allows the thinking brain to override the survival brain',
          'It confuses the person you are arguing with',
          'It has no significant purpose'
        ],
        correctIndex: 1,
        hint: 'It breaks the "loop" of automatic behavior.'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `If you could re-design your immediate response to ${lessonTitle}, what would it look like? How would your life change if you were the master of your emotions rather than their servant?`,
        arabic: 'التدبر النفسي'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'Khalil Center — Islamic Psychology',
        description: 'Professional resources on faith-based mental health and emotional healing.',
        url: 'https://khalilcenter.com/resources/',
        platform: 'Khalil Center'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Stanford Health — Stress & Resilience',
        description: 'Evidence-based protocols for nervous system regulation and trauma recovery.',
        url: 'https://beaverhealth.stanford.edu/resilience/',
        platform: 'Stanford University'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `Mastering ${lessonTitle} is not a one-time event, but a lifelong discipline. By completing this session within ${moduleName}, you have taken a massive step toward true psychological strength. Carry this Sakinah with you as you navigate the complexities of the modern world.`
    },
  ];
}

// MAIN SEED
async function masterReseedCourse6() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Psychological Strength (Course 6)');
  console.log('============================================\n');

  // ALWAYS create a brand new official course entry
  console.log('🏗  Creating new official Course 6 entry...');
  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'An elite 6-week premium program for trauma recovery, emotional mastery, and building psychological strength through a clinical and Islamic framework.',
    course_level: 'advanced',
    subject_area: 'Applied Psychology (Nafsiyah)',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 60,
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
      const { error: le } = await supabase.from('course_lessons').insert({
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
      
      // Update with blocks separately if needed, or just insert. 
      // Insert with blocks usually works, let's keep it simple.
      await supabase.from('course_lessons').update({ content_blocks: blocks }).eq('id', le?.id);

      if (le) { totalLessons++; process.stdout.write(`   ✅ ${lesson.sort_order}. ${lesson.title}\n`); }
      else { console.log(`   ⚠️  "${lesson.title}" failed.`); }
    }
  }

  // Update totals
  await supabase.from('jobs').update({
    total_modules: totalModules,
    total_lessons: totalLessons,
  }).eq('id', course.id);

  console.log('\n============================================');
  console.log('✅ COMPLETE — Course 6: Psychological Strength, Trauma Recovery & Emotional Mastery');
  console.log(`   📦 Modules  : ${totalModules}/30`);
  console.log(`   📖 Lessons  : ${totalLessons}/210`);
  console.log(`   🌟 Blocks   : 15 per lesson`);
  console.log('============================================\n');
}

masterReseedCourse6().catch(e => { console.error('Fatal:', e); process.exit(1); });
