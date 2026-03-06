/**
 * MASTER RESEED — Course 5: Islamic Law, Society & Contemporary Application
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Islamic Law, Society & Contemporary Application';

const CURRICULUM = [
  // ─────────────────────────────────────────────────────────
  // WEEK 1 – Foundations of Islamic Law
  // ─────────────────────────────────────────────────────────
  {
    title: 'What Is Shariah?', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: The definition, scope, and moral dimension of Islamic law.',
    lessons: [
      { title: 'Definition of Shariah', sort_order: 1 },
      { title: 'Misconceptions about Shariah', sort_order: 2 },
      { title: 'Divine law vs human law', sort_order: 3 },
      { title: 'Scope of Islamic law', sort_order: 4 },
      { title: 'Moral dimension of law', sort_order: 5 },
      { title: 'Justice framework', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Sources of Islamic Law', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: Understanding the primary and secondary sources of Fiqh.',
    lessons: [
      { title: 'Qur’an as primary source', sort_order: 1 },
      { title: 'Sunnah as legal authority', sort_order: 2 },
      { title: 'Ijma (consensus)', sort_order: 3 },
      { title: 'Qiyas (analogy)', sort_order: 4 },
      { title: 'Role of scholars', sort_order: 5 },
      { title: 'Legal methodology basics', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Maqasid al-Shariah', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Exploring the five objectives of the Shariah.',
    lessons: [
      { title: 'Definition of Maqasid', sort_order: 1 },
      { title: 'Protection of religion', sort_order: 2 },
      { title: 'Protection of life', sort_order: 3 },
      { title: 'Protection of intellect', sort_order: 4 },
      { title: 'Protection of wealth', sort_order: 5 },
      { title: 'Protection of lineage', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Schools of Thought', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: The development and methodologies of the four Madhahib.',
    lessons: [
      { title: 'Overview of Madhahib', sort_order: 1 },
      { title: 'Differences in methodology', sort_order: 2 },
      { title: 'Respecting scholarly disagreement', sort_order: 3 },
      { title: 'Unity despite diversity', sort_order: 4 },
      { title: 'Fatwa process', sort_order: 5 },
      { title: 'Avoiding extremism', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Legal Accountability', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Principles of responsibility, intention, and flexibility.',
    lessons: [
      { title: 'Who is legally responsible?', sort_order: 1 },
      { title: 'Age of accountability', sort_order: 2 },
      { title: 'Intention in law', sort_order: 3 },
      { title: 'Public vs private law', sort_order: 4 },
      { title: 'Legal maxims', sort_order: 5 },
      { title: 'Flexibility in hardship', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 2 – Personal Law & Worship
  // ─────────────────────────────────────────────────────────
  {
    title: 'Purification & Salah', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: The legal and spiritual dimensions of worship.',
    lessons: [
      { title: 'Taharah principles', sort_order: 1 },
      { title: 'Salah obligations', sort_order: 2 },
      { title: 'Conditions of prayer', sort_order: 3 },
      { title: 'Common mistakes', sort_order: 4 },
      { title: 'Spiritual dimension', sort_order: 5 },
      { title: 'Discipline through worship', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Fasting & Spiritual Law', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Ramadan, fasting rules, and exceptions.',
    lessons: [
      { title: 'Purpose of fasting', sort_order: 1 },
      { title: 'Rules of Ramadan', sort_order: 2 },
      { title: 'Exceptions', sort_order: 3 },
      { title: 'Zakat basics', sort_order: 4 },
      { title: 'Charity principles', sort_order: 5 },
      { title: 'Economic purification', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Family Law Foundations', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: The marriage contract and rights of spouses.',
    lessons: [
      { title: 'Marriage contract', sort_order: 1 },
      { title: 'Rights and responsibilities', sort_order: 2 },
      { title: 'Divorce principles', sort_order: 3 },
      { title: 'Child custody', sort_order: 4 },
      { title: 'Financial support', sort_order: 5 },
      { title: 'Justice in family life', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Gender Interaction', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Modesty, public conduct, and boundaries.',
    lessons: [
      { title: 'Modesty principles', sort_order: 1 },
      { title: 'Professional interaction', sort_order: 2 },
      { title: 'Public conduct', sort_order: 3 },
      { title: 'Boundaries', sort_order: 4 },
      { title: 'Cultural vs religious norms', sort_order: 5 },
      { title: 'Respect framework', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Ethics of Daily Living', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Halal food, personal conduct, and trust.',
    lessons: [
      { title: 'Food and halal', sort_order: 1 },
      { title: 'Financial transactions', sort_order: 2 },
      { title: 'Contracts', sort_order: 3 },
      { title: 'Trust and honesty', sort_order: 4 },
      { title: 'Personal conduct', sort_order: 5 },
      { title: 'Accountability', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 3 – Economic & Financial Law
  // ─────────────────────────────────────────────────────────
  {
    title: 'Halal Income', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Lawful earnings, labor ethics, and job integrity.',
    lessons: [
      { title: 'Lawful earnings', sort_order: 1 },
      { title: 'Prohibited income', sort_order: 2 },
      { title: 'Integrity in work', sort_order: 3 },
      { title: 'Transparency', sort_order: 4 },
      { title: 'Labor ethics', sort_order: 5 },
      { title: 'Accountability', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Riba & Financial Ethics', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: The prohibition of interest and alternative economic models.',
    lessons: [
      { title: 'Definition of riba', sort_order: 1 },
      { title: 'Economic harm', sort_order: 2 },
      { title: 'Alternative models', sort_order: 3 },
      { title: 'Modern banking discussion', sort_order: 4 },
      { title: 'Ethical finance', sort_order: 5 },
      { title: 'Wealth distribution', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Business Contracts', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Types of contracts, risk sharing, and fraud prevention.',
    lessons: [
      { title: 'Types of contracts', sort_order: 1 },
      { title: 'Consent', sort_order: 2 },
      { title: 'Fraud prevention', sort_order: 3 },
      { title: 'Risk sharing', sort_order: 4 },
      { title: 'Ethical negotiation', sort_order: 5 },
      { title: 'Documentation', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Zakat System', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Social welfare, calculations, and community development.',
    lessons: [
      { title: 'Calculation basics', sort_order: 1 },
      { title: 'Eligible recipients', sort_order: 2 },
      { title: 'Social welfare', sort_order: 3 },
      { title: 'Economic stability', sort_order: 4 },
      { title: 'Poverty reduction', sort_order: 5 },
      { title: 'Community development', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Public Economic Justice', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Market regulation, anti-monopoly, and consumer protection.',
    lessons: [
      { title: 'Market regulation', sort_order: 1 },
      { title: 'Anti-monopoly', sort_order: 2 },
      { title: 'Consumer protection', sort_order: 3 },
      { title: 'Public trust', sort_order: 4 },
      { title: 'Ethical investment', sort_order: 5 },
      { title: 'Transparency', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 4 – Criminal & Social Justice
  // ─────────────────────────────────────────────────────────
  {
    title: 'Philosophy of Punishment', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Justice vs revenge, deterrence, and due process.',
    lessons: [
      { title: 'Justice vs revenge', sort_order: 1 },
      { title: 'Protection of society', sort_order: 2 },
      { title: 'Deterrence', sort_order: 3 },
      { title: 'Mercy balance', sort_order: 4 },
      { title: 'Due process', sort_order: 5 },
      { title: 'Legal safeguards', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Hudud Overview (Balanced)', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Standards of evidence and historical context.',
    lessons: [
      { title: 'Conditions', sort_order: 1 },
      { title: 'High evidentiary standards', sort_order: 2 },
      { title: 'Historical context', sort_order: 3 },
      { title: 'Misconceptions', sort_order: 4 },
      { title: 'Rare application', sort_order: 5 },
      { title: 'Justice framework', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Rights of Minorities', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Religious freedom and civic coexistence in Islam.',
    lessons: [
      { title: 'Protection of non-Muslims', sort_order: 1 },
      { title: 'Religious freedom', sort_order: 2 },
      { title: 'Civic coexistence', sort_order: 3 },
      { title: 'Justice standards', sort_order: 4 },
      { title: 'Social harmony', sort_order: 5 },
      { title: 'Historical examples', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Governance & Leadership', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Shura, public welfare, and anti-corruption.',
    lessons: [
      { title: 'Role of rulers', sort_order: 1 },
      { title: 'Accountability', sort_order: 2 },
      { title: 'Shura', sort_order: 3 },
      { title: 'Public welfare', sort_order: 4 },
      { title: 'Anti-corruption', sort_order: 5 },
      { title: 'Justice mechanisms', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Conflict & War Ethics', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Rules of engagement and diplomacy in Islam.',
    lessons: [
      { title: 'Rules of engagement', sort_order: 1 },
      { title: 'Protection of civilians', sort_order: 2 },
      { title: 'Prohibition of aggression', sort_order: 3 },
      { title: 'Environmental ethics', sort_order: 4 },
      { title: 'Peace treaties', sort_order: 5 },
      { title: 'Diplomacy', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 5 – Contemporary Issues
  // ─────────────────────────────────────────────────────────
  {
    title: 'Islam & Democracy', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Governance principles and civic participation.',
    lessons: [
      { title: 'Governance principles', sort_order: 1 },
      { title: 'Consultation', sort_order: 2 },
      { title: 'Civic participation', sort_order: 3 },
      { title: 'Ethical engagement', sort_order: 4 },
      { title: 'Modern states', sort_order: 5 },
      { title: 'Identity balance', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Human Rights', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Dignity, equality, and freedom of belief.',
    lessons: [
      { title: 'Dignity in Islam', sort_order: 1 },
      { title: 'Equality', sort_order: 2 },
      { title: 'Freedom of belief', sort_order: 3 },
      { title: 'Justice principles', sort_order: 4 },
      { title: 'Social responsibility', sort_order: 5 },
      { title: 'Accountability', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Bioethics', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Medical decisions, organ donation, and reproductive ethics.',
    lessons: [
      { title: 'Medical decisions', sort_order: 1 },
      { title: 'Organ donation', sort_order: 2 },
      { title: 'End-of-life care', sort_order: 3 },
      { title: 'Reproductive ethics', sort_order: 4 },
      { title: 'Technology challenges', sort_order: 5 },
      { title: 'Moral framework', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Digital & AI Ethics', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Data privacy, AI morality, and online responsibility.',
    lessons: [
      { title: 'Online responsibility', sort_order: 1 },
      { title: 'Data privacy', sort_order: 2 },
      { title: 'AI morality', sort_order: 3 },
      { title: 'Misinformation', sort_order: 4 },
      { title: 'Automation ethics', sort_order: 5 },
      { title: 'Responsible innovation', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Globalization & Identity', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Integration, cultural preservation, and resilience.',
    lessons: [
      { title: 'Cultural preservation', sort_order: 1 },
      { title: 'Integration challenges', sort_order: 2 },
      { title: 'Minority living', sort_order: 3 },
      { title: 'Ethical representation', sort_order: 4 },
      { title: 'Global justice', sort_order: 5 },
      { title: 'Community resilience', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 6 – Applied Legal Thinking
  // ─────────────────────────────────────────────────────────
  {
    title: 'Legal Maxims', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: The core rules (Qawaid) that simplify law.',
    lessons: [
      { title: 'Hardship brings ease', sort_order: 1 },
      { title: 'Certainty is not removed by doubt', sort_order: 2 },
      { title: 'Harm must be removed', sort_order: 3 },
      { title: 'Custom is considered', sort_order: 4 },
      { title: 'Intentions matter', sort_order: 5 },
      { title: 'Application in modern life', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Fatwa & Ijtihad', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: The role of scholars and the limits of interpretation.',
    lessons: [
      { title: 'Role of scholars', sort_order: 1 },
      { title: 'Limits of ijtihad', sort_order: 2 },
      { title: 'Qualifications', sort_order: 3 },
      { title: 'Avoiding self-fatwa', sort_order: 4 },
      { title: 'Contextual application', sort_order: 5 },
      { title: 'Balanced reasoning', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Reform & Renewal', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Tajdid concept and addressing new realities.',
    lessons: [
      { title: 'Tajdid concept', sort_order: 1 },
      { title: 'Avoiding extremism', sort_order: 2 },
      { title: 'Preserving principles', sort_order: 3 },
      { title: 'Addressing new realities', sort_order: 4 },
      { title: 'Unity framework', sort_order: 5 },
      { title: 'Responsible scholarship', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Personal Legal Responsibility', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Living ethically and avoiding doubtful matters.',
    lessons: [
      { title: 'Living ethically', sort_order: 1 },
      { title: 'Avoiding doubtful matters', sort_order: 2 },
      { title: 'Financial integrity', sort_order: 3 },
      { title: 'Family leadership', sort_order: 4 },
      { title: 'Public responsibility', sort_order: 5 },
      { title: 'Accountability systems', sort_order: 6 },
      { title: 'Weekly review', sort_order: 7 },
    ]
  },
  {
    title: 'Final Integration & Capstone', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Synthesis, case study analysis, and final exam.',
    lessons: [
      { title: 'Review of legal framework', sort_order: 1 },
      { title: 'Maqasid summary', sort_order: 2 },
      { title: 'Contemporary application', sort_order: 3 },
      { title: 'Case study analysis', sort_order: 4 },
      { title: 'Capstone submission', sort_order: 5 },
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
          `Analyze the legal foundations of ${lessonTitle} within the Shariah.`,
          `Understand the Maqasid (objectives) served by ${lessonTitle}.`,
          `Apply ${lessonTitle} to contemporary social and legal scenarios.`,
          `Synthesize learnings from ${moduleName} to form a holistic legal view.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: A vital component of Islamic jurisprudence (Fiqh) and social application.`,
        arabic: 'الشريعة والتطبيق'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nThis lesson explores **${lessonTitle}** as a fundamental aspect of *Islamic Law, Society & Contemporary Application*. Shariah is not merely a set of rules, but a divine framework designed to maximize human welfare (*Maslaha*) and prevent harm (*Mufsadah*).\n\n> "Indeed, Allah orders justice and good conduct and giving to relatives and forbids immorality and bad conduct and oppression. He admonishes you that perhaps you will be reminded." (Surah An-Nahl 16:90)\n\nBy understanding the deeper objectives behind ${lessonTitle}, we can better appreciate how Islamic law adapts to new realities while preserving its eternal principles.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Basis', description: `Identifying the source (Dalil) for ${lessonTitle}.`, icon: 'Book' },
          { title: 'Objective', description: 'Connecting it to one of the five Maqasid.', icon: 'Target' },
          { title: 'Ruling', description: 'Determining the legal category (Ahkam al-Khamsa).', icon: 'Scale' },
          { title: 'Application', description: 'Implementing it in a modern context.', icon: 'CheckCircle' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'He has ordained for you of religion what He enjoined upon Noah and that which We have revealed to you, [O Muhammad], and what We enjoined upon Abraham and Moses and Jesus - to establish the religion and not be divided therein. (Surah Ash-Shura 42:13)',
        arabic: 'شَرَعَ لَكُم مِّنَ الدِّينِ مَا وَصَّىٰ بِهِ نُوحًا وَالَّذِي أَوْحَيْنَا إِلَيْكَ وَمَا وَصَّيْنَا بِهِ إِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَىٰ ۖ أَنْ أَقِيمُوا الدِّينَ وَلَا تَتَفَرَّقُوا فِيهِ'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'Actions are but by intentions, and every person will have only what they intended. (Bukhari & Muslim)',
        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Applied Fiqh: ${lessonTitle}\n\nScholars have noted that the beauty of Fiqh lies in its ability to address the details of life without losing sight of the spirit of Shariah. In the context of **${moduleName}**, ${lessonTitle} provides a practical guide for building a just and moral society.\n\n1. **Evidence** — Quran and Sunnah basis.\n2. **Reasoning** — Illah (cause) and Hikmah (wisdom).\n3. **Modern Context** — How it applies in today's complex world.\n4. **Ethics** — The moral weight of the legal decision.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Practical Legal Reflection:\n- Identify one common misconception about ${lessonTitle} in society.\n- How does the actual legal principle differ from this misconception?\n- List three ways this principle protects human dignity or justice.\n- Discuss a real-world case study where this principle was applied correctly.`,
      author: 'Contemporary Law Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `What is the primary objective (Maqsad) served by the legal principles of ${lessonTitle}?`,
        options: [
          'Unnecessary restriction of freedom',
          'Maximizing human welfare and justice',
          'Strict adherence to cultural traditions',
          'Simple punishement without purpose'
        ],
        correctIndex: 1,
        hint: 'Shariah is designed for Maslaha (welfare).'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `Which of the following is NOT one of the five essential protections (Maqasid) in Islamic Law?`,
        options: ['Protection of Religion', 'Protection of Wealth', 'Protection of Global Status', 'Protection of Intellect'],
        correctIndex: 2,
        hint: 'The five are: Religion, Life, Intellect, Lineage, and Wealth.'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'What does the legal maxim "Hardship brings ease" imply?',
        options: [
          'Law is irrelevant during difficulty',
          'Flexibility and concession are provided in cases of genuine necessity',
          'One can ignore any rule they find inconvenient',
          'Law only applies to the wealthy'
        ],
        correctIndex: 1,
        hint: 'Al-mashaqqah tajlib al-taysir.'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `How does the study of ${lessonTitle} change your perspective on the role of Shariah in modern society? What is one legal responsibility you feel more conscious of now?`,
        arabic: 'التفكر الفقهي'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'SeekersGuidance — Fiqh & Law',
        description: 'Detailed courses and fatwas on contemporary legal and social issues.',
        url: 'https://seekersguidance.org/courses/introduction-to-islamic-law/',
        platform: 'SeekersGuidance'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Yaqeen Institute — Fiqh & Ethics',
        description: 'Research papers on Islamic law and its application in the modern world.',
        url: 'https://yaqeeninstitute.org/category/law-ethics',
        platform: 'Yaqeen Institute'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `The journey through ${lessonTitle} is a step toward understanding the profound wisdom of divine guidance. Use the knowledge gained in ${moduleName} to serve your community and uphold justice with wisdom and compassion. Return to this lesson whenever you need to revisit these vital principles.`
    },
  ];
}

// MAIN SEED
async function masterReseedCourse5() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Islamic Law & Society (Course 5)');
  console.log('============================================\n');

  // ALWAYS create a brand new official course entry
  console.log('🏗  Creating new official Course 5 entry...');
  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week premium certificate program exploring Shariah, Maqasid, and the application of Islamic law in contemporary society.',
    course_level: 'advanced',
    subject_area: 'Islamic Law (Shariah/Fiqh)',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 45,
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
        xp_reward: 12,
        coin_reward: 6,
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
  console.log('✅ COMPLETE — Course 5: Islamic Law, Society & Contemporary Application');
  console.log(`   📦 Modules  : ${totalModules}/30`);
  console.log(`   📖 Lessons  : ${totalLessons}/210`);
  console.log(`   🌟 Blocks   : 15 per lesson`);
  console.log('============================================\n');
}

masterReseedCourse5().catch(e => { console.error('Fatal:', e); process.exit(1); });
