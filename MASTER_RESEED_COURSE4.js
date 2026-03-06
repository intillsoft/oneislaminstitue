/**
 * MASTER RESEED — Course 4: Qur’anic Worldview & Intellectual Confidence
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Qur’anic Worldview & Intellectual Confidence';

const CURRICULUM = [
  // WEEK 1
  {
    title: 'What Is a Worldview?', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Understanding the lens through which we see reality.',
    lessons: [
      { title: 'Definition of worldview', sort_order: 1 },
      { title: 'Competing worldviews today', sort_order: 2 },
      { title: 'Secular vs religious frameworks', sort_order: 3 },
      { title: 'Why worldview shapes behavior', sort_order: 4 },
      { title: 'Hidden assumptions in society', sort_order: 5 },
      { title: 'Qur’anic worldview introduction', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'The Qur’an’s View of Reality', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: Exploring the metaphysical framework of Islam.',
    lessons: [
      { title: 'Reality of the unseen', sort_order: 1 },
      { title: 'Material vs spiritual reality', sort_order: 2 },
      { title: 'Purpose-driven universe', sort_order: 3 },
      { title: 'Divine order', sort_order: 4 },
      { title: 'Accountability framework', sort_order: 5 },
      { title: 'Meaning beyond materialism', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Human Nature in the Qur’an', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Understanding the Fitrah and our moral capacity.',
    lessons: [
      { title: 'Fitrah', sort_order: 1 },
      { title: 'Strengths of humanity', sort_order: 2 },
      { title: 'Weaknesses of humanity', sort_order: 3 },
      { title: 'Free will and responsibility', sort_order: 4 },
      { title: 'Spiritual capacity', sort_order: 5 },
      { title: 'Moral consciousness', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Purpose of Life', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Defining success through Khilafah and service.',
    lessons: [
      { title: 'Worship concept', sort_order: 1 },
      { title: 'Vicegerency (Khilafah)', sort_order: 2 },
      { title: 'Moral responsibility', sort_order: 3 },
      { title: 'Personal accountability', sort_order: 4 },
      { title: 'Short-term vs eternal goals', sort_order: 5 },
      { title: 'Defining success', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Justice & Accountability', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: The ethical responsibility of a believer.',
    lessons: [
      { title: 'Divine justice', sort_order: 1 },
      { title: 'Individual accountability', sort_order: 2 },
      { title: 'Social justice principles', sort_order: 3 },
      { title: 'Reward and punishment', sort_order: 4 },
      { title: 'Balance of mercy and justice', sort_order: 5 },
      { title: 'Ethical responsibility', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // WEEK 2
  {
    title: 'Linguistic Uniqueness', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: The I’jaz (inimitability) of the Qur’an.',
    lessons: [
      { title: 'Arabic eloquence', sort_order: 1 },
      { title: 'Structure of verses', sort_order: 2 },
      { title: 'Rhetorical devices', sort_order: 3 },
      { title: 'Literary coherence', sort_order: 4 },
      { title: 'Challenge to humanity', sort_order: 5 },
      { title: 'Preservation of language', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Structural Coherence', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Thematic unity and Ring composition.',
    lessons: [
      { title: 'Thematic unity', sort_order: 1 },
      { title: 'Ring composition', sort_order: 2 },
      { title: 'Surah connections', sort_order: 3 },
      { title: 'Narrative patterns', sort_order: 4 },
      { title: 'Historical consistency', sort_order: 5 },
      { title: 'Internal harmony', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Preservation of the Qur’an', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: History of oral and written transmission.',
    lessons: [
      { title: 'Oral transmission', sort_order: 1 },
      { title: 'Written compilation', sort_order: 2 },
      { title: 'Manuscript history', sort_order: 3 },
      { title: 'Memorization culture', sort_order: 4 },
      { title: 'Scholarly verification', sort_order: 5 },
      { title: 'Authenticity debates', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Moral Depth of the Qur’an', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Compassion and universality of guidance.',
    lessons: [
      { title: 'Ethical framework', sort_order: 1 },
      { title: 'Justice principles', sort_order: 2 },
      { title: 'Compassion themes', sort_order: 3 },
      { title: 'Accountability messages', sort_order: 4 },
      { title: 'Balance in morality', sort_order: 5 },
      { title: 'Universality of guidance', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Psychological Insight', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Emotional resilience and transformation.',
    lessons: [
      { title: 'Human emotions', sort_order: 1 },
      { title: 'Fear and hope', sort_order: 2 },
      { title: 'Grief and resilience', sort_order: 3 },
      { title: 'Motivation structure', sort_order: 4 },
      { title: 'Self-discipline themes', sort_order: 5 },
      { title: 'Moral transformation', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // WEEK 3
  {
    title: 'Atheism', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Responding wisely to a crisis of meaning.',
    lessons: [
      { title: 'Origins of atheism', sort_order: 1 },
      { title: 'Arguments of atheists', sort_order: 2 },
      { title: 'Qur’anic response', sort_order: 3 },
      { title: 'Moral implications', sort_order: 4 },
      { title: 'Meaning crisis', sort_order: 5 },
      { title: 'Responding wisely', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Secularism', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: The Qur’anic alternative to societal fragmentation.',
    lessons: [
      { title: 'Definition', sort_order: 1 },
      { title: 'Separation of religion', sort_order: 2 },
      { title: 'Ethical consequences', sort_order: 3 },
      { title: 'Identity fragmentation', sort_order: 4 },
      { title: 'Qur’anic alternative', sort_order: 5 },
      { title: 'Balanced engagement', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Moral Relativism', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Objective morality vs subjective ethics.',
    lessons: [
      { title: 'Objective morality', sort_order: 1 },
      { title: 'Subjective ethics', sort_order: 2 },
      { title: 'Accountability problem', sort_order: 3 },
      { title: 'Justice challenges', sort_order: 4 },
      { title: 'Qur’anic moral anchor', sort_order: 5 },
      { title: 'Consistency issues', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Materialism', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Overcoming consumer culture and emptiness.',
    lessons: [
      { title: 'Consumer culture', sort_order: 1 },
      { title: 'Wealth obsession', sort_order: 2 },
      { title: 'Loss of meaning', sort_order: 3 },
      { title: 'Spiritual emptiness', sort_order: 4 },
      { title: 'Qur’anic warnings', sort_order: 5 },
      { title: 'Balanced lifestyle', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Identity Crisis', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Rebuilding confidence in faith-based identity.',
    lessons: [
      { title: 'Modern identity politics', sort_order: 1 },
      { title: 'Cultural confusion', sort_order: 2 },
      { title: 'Faith-based identity', sort_order: 3 },
      { title: 'Peer pressure', sort_order: 4 },
      { title: 'Social media influence', sort_order: 5 },
      { title: 'Confidence rebuilding', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // WEEK 4
  {
    title: 'Critical Thinking in Islam', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Role of reason and limits of intellect.',
    lessons: [
      { title: 'Role of reason', sort_order: 1 },
      { title: 'Limits of intellect', sort_order: 2 },
      { title: 'Evidence evaluation', sort_order: 3 },
      { title: 'Reflection in Qur’an', sort_order: 4 },
      { title: 'Balanced reasoning', sort_order: 5 },
      { title: 'Avoiding blind following', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Logical Fallacies', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Identifying bias and emotional manipulation.',
    lessons: [
      { title: 'Ad hominem', sort_order: 1 },
      { title: 'Strawman', sort_order: 2 },
      { title: 'False dilemma', sort_order: 3 },
      { title: 'Emotional manipulation', sort_order: 4 },
      { title: 'Confirmation bias', sort_order: 5 },
      { title: 'Debate ethics', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Evaluating Arguments', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Sound reasoning and intellectual humility.',
    lessons: [
      { title: 'Sound reasoning', sort_order: 1 },
      { title: 'Premises and conclusions', sort_order: 2 },
      { title: 'Burden of proof', sort_order: 3 },
      { title: 'Internal consistency', sort_order: 4 },
      { title: 'Intellectual humility', sort_order: 5 },
      { title: 'Civil discourse', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Intellectual Discipline', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Hierarchy of knowledge and structured learning.',
    lessons: [
      { title: 'Knowledge hierarchy', sort_order: 1 },
      { title: 'Scholar authority', sort_order: 2 },
      { title: 'Avoiding misinformation', sort_order: 3 },
      { title: 'Structured learning', sort_order: 4 },
      { title: 'Consistency in belief', sort_order: 5 },
      { title: 'Intellectual patience', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Debate Ethics', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Civil discourse and respectful dialogue.',
    lessons: [
      { title: 'Respectful dialogue', sort_order: 1 },
      { title: 'Wisdom in speech', sort_order: 2 },
      { title: 'Avoiding arrogance', sort_order: 3 },
      { title: 'Emotional control', sort_order: 4 },
      { title: 'Listening skills', sort_order: 5 },
      { title: 'Constructive disagreement', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // WEEK 5
  {
    title: 'Principles of Dawah', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Wisdom, compassion, and sincerity in teaching.',
    lessons: [
      { title: 'Wisdom approach', sort_order: 1 },
      { title: 'Compassion', sort_order: 2 },
      { title: 'Gradual teaching', sort_order: 3 },
      { title: 'Audience awareness', sort_order: 4 },
      { title: 'Avoiding harshness', sort_order: 5 },
      { title: 'Sincerity', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Answering Difficult Questions', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Responding to evil, science, and freedom debates.',
    lessons: [
      { title: 'Problem of evil', sort_order: 1 },
      { title: 'Science questions', sort_order: 2 },
      { title: 'Women in Islam', sort_order: 3 },
      { title: 'Violence misconceptions', sort_order: 4 },
      { title: 'Freedom debates', sort_order: 5 },
      { title: 'Structured responses', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Intelligence', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Patience and character in dialogue.',
    lessons: [
      { title: 'Managing reactions', sort_order: 1 },
      { title: 'Empathy', sort_order: 2 },
      { title: 'Conflict handling', sort_order: 3 },
      { title: 'Patience in disagreement', sort_order: 4 },
      { title: 'Emotional awareness', sort_order: 5 },
      { title: 'Character in dialogue', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Public Representation', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Integrity and professional conduct in public.',
    lessons: [
      { title: 'Professional conduct', sort_order: 1 },
      { title: 'Social responsibility', sort_order: 2 },
      { title: 'Media awareness', sort_order: 3 },
      { title: 'Digital behavior', sort_order: 4 },
      { title: 'Leadership presence', sort_order: 5 },
      { title: 'Integrity consistency', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Writing & Communication', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Persuasive writing and public speaking ethics.',
    lessons: [
      { title: 'Clear messaging', sort_order: 1 },
      { title: 'Structuring arguments', sort_order: 2 },
      { title: 'Persuasive writing', sort_order: 3 },
      { title: 'Public speaking', sort_order: 4 },
      { title: 'Responsible influence', sort_order: 5 },
      { title: 'Ethical persuasion', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // WEEK 6
  {
    title: 'Faith-Based Leadership', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Vision building and moral authority.',
    lessons: [
      { title: 'Vision building', sort_order: 1 },
      { title: 'Moral authority', sort_order: 2 },
      { title: 'Accountability', sort_order: 3 },
      { title: 'Justice framework', sort_order: 4 },
      { title: 'Responsibility mindset', sort_order: 5 },
      { title: 'Humility in leadership', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Influencing Society', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Long-term vision and ethical reform.',
    lessons: [
      { title: 'Cultural impact', sort_order: 1 },
      { title: 'Education systems', sort_order: 2 },
      { title: 'Community reform', sort_order: 3 },
      { title: 'Strategic thinking', sort_order: 4 },
      { title: 'Long-term vision', sort_order: 5 },
      { title: 'Ethical influence', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Institution Building', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Governance and legacy mindset.',
    lessons: [
      { title: 'Organizational ethics', sort_order: 1 },
      { title: 'Governance structure', sort_order: 2 },
      { title: 'Sustainability', sort_order: 3 },
      { title: 'Risk management', sort_order: 4 },
      { title: 'Team leadership', sort_order: 5 },
      { title: 'Legacy mindset', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Personal Intellectual Blueprint', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Strength assessment and long-term planning.',
    lessons: [
      { title: 'Strength assessment', sort_order: 1 },
      { title: 'Knowledge gaps', sort_order: 2 },
      { title: '1-year plan', sort_order: 3 },
      { title: '5-year plan', sort_order: 4 },
      { title: 'Skill development', sort_order: 5 },
      { title: 'Accountability partner', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Final Integration & Capstone', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Synthesis and professional certification.',
    lessons: [
      { title: 'Qur’anic worldview summary', sort_order: 1 },
      { title: 'Modern ideology comparison', sort_order: 2 },
      { title: 'Personal reflection', sort_order: 3 },
      { title: 'Capstone project', sort_order: 4 },
      { title: 'Oral defense', sort_order: 5 },
      { title: 'Final exam', sort_order: 6 },
      { title: 'Certification review', sort_order: 7 },
    ]
  },
];

// CONTENT BLOCK BUILDER
function makeBlocks(lessonTitle, moduleName, week) {
  const id = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;
  return [
    {
      id: id(), type: 'objectives', order: 0,
      content: {
        items: [
          `Analyze the core concepts of ${lessonTitle} within the Qur’anic framework.`,
          `Evaluate contemporary challenges related to ${lessonTitle}.`,
          `Develop intellectual confidence in articulating ${lessonTitle} to a modern audience.`,
          `Synthesize learnings from ${moduleName} to build a coherent worldview.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: A pivotal pillar of the Qur’anic worldview, establishing intellectual clarity and faith-based perspective.`,
        arabic: 'الرؤية القرآنية'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nIn this lesson, we explore **${lessonTitle}** as it pertains to the broader theme of *Qur’anic Worldview & Intellectual Confidence*. Our goal is to move beyond superficial understanding toward a deep, evidence-based conviction that can withstand modern intellectual pressures.\n\n> "Will they not then reflect upon the Qur'an? Or are there locks upon [their] hearts?" (Surah Muhammad 47:24)\n\nThe Qur'an does not merely provide answers; it provides a framework for asking the right questions. By understanding ${lessonTitle}, we equip ourselves with the tools necessary to navigate secular, materialistic, and relativistic ideologies with confidence and grace.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Observation', description: `Identifying how ${lessonTitle} manifests in modern thought.`, icon: 'Eye' },
          { title: 'Deconstruction', description: 'Analyzing the assumptions behind modern views.', icon: 'Zap' },
          { title: 'Reconstruction', description: 'Rebuilding the concept through Qur’anic evidence.', icon: 'RefreshCw' },
          { title: 'Articulation', description: 'Communicating the Islamic view with clarity.', icon: 'MessageCircle' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'And follow not that of which you have not the knowledge; surely the hearing and the sight and the heart, all of these, shall be questioned about that. (Surah Al-Isra 17:36)',
        arabic: 'وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'The seeking of knowledge is obligatory for every Muslim. (Al-Tirmidhi)',
        arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Intellectual Leadership: ${lessonTitle}\n\nDeveloping intellectual leadership requires more than memorization; it requires the ability to engage with the world’s most difficult ideas while remaining firmly rooted in revelation. As we study **${moduleName}**, consider how ${lessonTitle} serves as a shield against doubt and a beacon for those seeking truth.\n\n1. **Foundations** — Identifying the primary texts.\n2. **Contextualization** — Understanding the modern debate.\n3. **Refutation** — Addressing common fallacies.\n4. **Integration** — Living the principle in daily life.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Weekly Intellectual Task:\n- Research one common objection to ${lessonTitle}.\n- Draft a 3-point response based on the Qur’anic worldview.\n- Practice explaining this response to a peer or mentor.\n- Reflect on how this strengthens your overall confidence.`,
      author: 'Intellectual Confidence Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `What is the primary objective of studying ${lessonTitle} in this course?`,
        options: [
          'To memorize historical dates and names',
          'To develop a coherent Qur’anic framework for reality',
          'To engage in aggressive online debates',
          'To ignore all modern scientific advancements'
        ],
        correctIndex: 1,
        hint: 'Worldview is about the lens of reality.'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `Which cognitive faculty does the Qur'an most frequently appeal to in the context of ${lessonTitle}?`,
        options: ['Blind obedience', 'Reason and reflection (Aql)', 'Emotional impulse', 'Cultural tradition'],
        correctIndex: 1,
        hint: 'Look for terms like "Afala Ta’qilun" (Do you not reason?).'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'What does "Intellectual Confidence" mean in this curriculum?',
        options: [
          'Arrogance regarding one’s own knowledge',
          'Dismissing any idea that sounds foreign',
          'Evidence-based conviction in the Truth of Islam',
          'The ability to win every argument at any cost'
        ],
        correctIndex: 2,
        hint: 'Confidence comes from solid evidence (Burhan).'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `How has your understanding of ${lessonTitle} shifted since starting this module? In what area of your life do you feel the most "intellectually challenged" right now?`,
        arabic: 'التدبر الفكري'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'Cambridge Muslim College — Intellectual Tradition',
        description: 'Papers on the intersection of Islamic thought and modern philosophy.',
        url: 'https://www.cambridgemuslimcollege.ac.uk/research/',
        platform: 'Cambridge Muslim College'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Yaqeen Institute — Doubt & Conviction',
        description: 'Comprehensive resources on navigating modern doubts with intellectual rigor.',
        url: 'https://yaqeeninstitute.org/series/conviction-circles',
        platform: 'Yaqeen Institute'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `Mastering ${lessonTitle} is a step toward becoming a leader in thought. The Qur’anic Worldview & Intellectual Confidence program is designed to transform the way you think, speak, and lead. Continue to reflect, continue to research, and always seek the Truth with sincerity.`
    },
  ];
}

// MAIN SEED
async function masterReseedCourse4() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Qur’anic Worldview & Intellectual Confidence (Course 4)');
  console.log('============================================\n');

  // ALWAYS create a brand new official course entry
  console.log('🏗  Creating new official Course 4 entry...');
  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week elite certificate program building a coherent Qur’anic worldview and intellectual leadership in the modern world.',
    course_level: 'advanced',
    subject_area: 'Qur’anic Worldview (Fikr)',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 50,
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
        content_blocks: blocks,
      });
      if (le) { console.log(`   ⚠️  "${lesson.title}": ${le.message}`); }
      else { totalLessons++; process.stdout.write(`   ✅ ${lesson.sort_order}. ${lesson.title}\n`); }
    }
  }

  // Update totals
  await supabase.from('jobs').update({
    total_modules: totalModules,
    total_lessons: totalLessons,
  }).eq('id', course.id);

  console.log('\n============================================');
  console.log('✅ COMPLETE — Course 4: Qur’anic Worldview & Intellectual Confidence');
  console.log(`   📦 Modules  : ${totalModules}/30`);
  console.log(`   📖 Lessons  : ${totalLessons}/210`);
  console.log(`   🌟 Blocks   : 15 per lesson`);
  console.log('============================================\n');
}

masterReseedCourse4().catch(e => { console.error('Fatal:', e); process.exit(1); });
