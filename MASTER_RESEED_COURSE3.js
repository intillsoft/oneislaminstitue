/**
 * MASTER RESEED — Course 3: Islamic Ethics & Modern Life
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Islamic Ethics & Modern Life';

const CURRICULUM = [
  // ─────────────────────────────────────────────────────────
  // WEEK 1 – Foundations of Islamic Ethics
  // ─────────────────────────────────────────────────────────
  {
    title: 'What is Akhlaq?', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: The meaning and sources of Islamic character.',
    lessons: [
      { title: 'Definition of Akhlaq', sort_order: 1 },
      { title: 'History of Islamic Ethics', sort_order: 2 },
      { title: 'Sources of Islamic Morality', sort_order: 3 },
      { title: 'Ethics vs Morality in Islam', sort_order: 4 },
      { title: 'Character in the Quran', sort_order: 5 },
      { title: 'Prophetic Character as the Model', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Divine Law and Morality', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: How Shariah grounds ethical life.',
    lessons: [
      { title: 'Shariah and Ethics', sort_order: 1 },
      { title: 'Maqasid al-Shariah', sort_order: 2 },
      { title: 'Universal vs Relative Morality', sort_order: 3 },
      { title: 'Natural Law in Islam', sort_order: 4 },
      { title: 'Ethics Without Revelation', sort_order: 5 },
      { title: 'Morality in Practice', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Justice and Accountability', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Adl and personal accountability in Islam.',
    lessons: [
      { title: "Concept of Justice (Adl)", sort_order: 1 },
      { title: 'Accountability Before Allah', sort_order: 2 },
      { title: 'Justice in Personal Life', sort_order: 3 },
      { title: 'Social Justice in Islam', sort_order: 4 },
      { title: 'Upholding the Rights of Others', sort_order: 5 },
      { title: 'Justice in Speech and Action', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Character and the Heart', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: The inner root of outward ethics.',
    lessons: [
      { title: 'Connection Between Character and Heart', sort_order: 1 },
      { title: 'Inner vs Outer Character', sort_order: 2 },
      { title: 'The Qalb as the Seat of Character', sort_order: 3 },
      { title: 'Building Good Character', sort_order: 4 },
      { title: 'Character Through Worship', sort_order: 5 },
      { title: 'Long-Term Character Development', sort_order: 6 },
      { title: 'Weekly Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Public vs Private Ethics', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Consistency between public and private character.',
    lessons: [
      { title: 'Consistency in Character', sort_order: 1 },
      { title: 'Public vs Private Behavior', sort_order: 2 },
      { title: 'Hypocrisy and Nifaq', sort_order: 3 },
      { title: 'Character at Home', sort_order: 4 },
      { title: 'Character in Public Life', sort_order: 5 },
      { title: 'Building Authentic Character', sort_order: 6 },
      { title: 'Week 1 Final Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 2 – Personal Character Development
  // ─────────────────────────────────────────────────────────
  {
    title: 'Truthfulness and Integrity', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: The virtue of Sidq in personal life.',
    lessons: [
      { title: 'Concept of Sidq', sort_order: 1 },
      { title: 'Truthfulness in Speech', sort_order: 2 },
      { title: 'Truthfulness in Action', sort_order: 3 },
      { title: 'Integrity in Commitments', sort_order: 4 },
      { title: 'The Cost of Lying', sort_order: 5 },
      { title: 'Building a Culture of Honesty', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Humility and Patience', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Developing Tawadu and Sabr as daily virtues.',
    lessons: [
      { title: 'Understanding Tawadu (Humility)', sort_order: 1 },
      { title: 'Humility vs Self-Deprecation', sort_order: 2 },
      { title: 'Patience (Sabr) Defined', sort_order: 3 },
      { title: 'Practicing Humility Daily', sort_order: 4 },
      { title: 'Patience in Hardship', sort_order: 5 },
      { title: 'Sustaining Both Virtues Together', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Gratitude and Generosity', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Shukr and Karam as ethical practices.',
    lessons: [
      { title: 'Shukr as a Character Trait', sort_order: 1 },
      { title: 'Expressing Gratitude', sort_order: 2 },
      { title: 'Generosity (Karam) in Islam', sort_order: 3 },
      { title: 'Overcoming Stinginess', sort_order: 4 },
      { title: 'Gratitude in Adversity', sort_order: 5 },
      { title: 'Generosity Beyond Wealth', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Self-Control and Discipline', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Mastering the self through Islamic principles.',
    lessons: [
      { title: 'Nafs and Self-Control', sort_order: 1 },
      { title: 'Controlling Desires', sort_order: 2 },
      { title: 'Discipline in Worship', sort_order: 3 },
      { title: 'Self-Control in Speech', sort_order: 4 },
      { title: 'Digital Self-Control', sort_order: 5 },
      { title: 'Building Daily Discipline', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Emotional Intelligence in Islam', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: The Islamic framework for emotional maturity.',
    lessons: [
      { title: 'Emotional Awareness in the Quran', sort_order: 1 },
      { title: 'Managing Emotions Islamically', sort_order: 2 },
      { title: 'Empathy as a Prophetic Trait', sort_order: 3 },
      { title: 'Emotional Responses and Ethics', sort_order: 4 },
      { title: 'Emotional Intelligence in Relationships', sort_order: 5 },
      { title: 'Building Emotional Resilience', sort_order: 6 },
      { title: 'Week 2 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 3 – Family & Social Ethics
  // ─────────────────────────────────────────────────────────
  {
    title: 'Rights of Parents', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Birr al-Walidayn and its modern application.',
    lessons: [
      { title: 'Concept of Birr al-Walidayn', sort_order: 1 },
      { title: 'Obedience with Boundaries', sort_order: 2 },
      { title: 'Caring for Parents in Old Age', sort_order: 3 },
      { title: 'Dealing with Non-Muslim Parents', sort_order: 4 },
      { title: 'Balancing Family and Independence', sort_order: 5 },
      { title: 'Expressing Gratitude to Parents', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Marriage and Spousal Ethics', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Marriage as an ethical and spiritual institution.',
    lessons: [
      { title: 'Marriage as an Ethical Institution', sort_order: 1 },
      { title: 'Rights and Responsibilities of Spouses', sort_order: 2 },
      { title: 'Kindness and Compassion in Marriage', sort_order: 3 },
      { title: 'Conflict and Resolution', sort_order: 4 },
      { title: 'Communication Ethics', sort_order: 5 },
      { title: 'Intimacy and Mutual Respect', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Raising Children with Character', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Parental ethics in character formation.',
    lessons: [
      { title: 'Parental Responsibility in Islam', sort_order: 1 },
      { title: 'Islamic Upbringing', sort_order: 2 },
      { title: 'Values-Based Education', sort_order: 3 },
      { title: 'Screen Time and Character', sort_order: 4 },
      { title: 'Discipline with Mercy', sort_order: 5 },
      { title: 'Building Faith in Children', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Friendship and Brotherhood', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Ukhuwwah and the ethics of social bonds.',
    lessons: [
      { title: 'Concept of Ukhuwwah', sort_order: 1 },
      { title: 'Choosing Righteous Friends', sort_order: 2 },
      { title: 'Rights of a Muslim Over Another', sort_order: 3 },
      { title: 'Brotherhood Beyond Ethnicity', sort_order: 4 },
      { title: 'Maintaining Long-Term Relationships', sort_order: 5 },
      { title: 'Ending Toxic Friendships Wisely', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Conflict Resolution', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Islamic principles for resolving disputes.',
    lessons: [
      { title: 'Conflict in Human Nature', sort_order: 1 },
      { title: 'Islamic Principles of Reconciliation', sort_order: 2 },
      { title: 'Mediation and Sulh', sort_order: 3 },
      { title: 'Forgiveness vs Justice', sort_order: 4 },
      { title: 'Resolving Family Conflict', sort_order: 5 },
      { title: 'Handling Community Disputes', sort_order: 6 },
      { title: 'Week 3 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 4 – Digital & Media Ethics
  // ─────────────────────────────────────────────────────────
  {
    title: 'Social Media Responsibility', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Ethical use of social media from an Islamic lens.',
    lessons: [
      { title: 'Islam and the Digital World', sort_order: 1 },
      { title: 'Intent in Online Activity', sort_order: 2 },
      { title: 'Content Creation and Character', sort_order: 3 },
      { title: 'Influence and Responsibility', sort_order: 4 },
      { title: 'Protecting Others Online', sort_order: 5 },
      { title: 'Digital Dawah Ethics', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Backbiting and Online Speech', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Gheebah, slander, and ethical digital discourse.',
    lessons: [
      { title: 'Gheebah in the Digital Age', sort_order: 1 },
      { title: 'Slander (Buhtan) Online', sort_order: 2 },
      { title: 'Cancel Culture and Islam', sort_order: 3 },
      { title: 'Anonymous Speech Ethics', sort_order: 4 },
      { title: 'Navigating Online Arguments', sort_order: 5 },
      { title: 'Constructive Digital Discourse', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Privacy and Modesty', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Haya and privacy in the information age.',
    lessons: [
      { title: 'Islamic Concept of Privacy', sort_order: 1 },
      { title: "Sharing Others' Information", sort_order: 2 },
      { title: "Haya' in the Digital Age", sort_order: 3 },
      { title: 'Modesty in Content Creation', sort_order: 4 },
      { title: 'Protecting Personal Data', sort_order: 5 },
      { title: 'Boundaries in Online Interaction', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Influencer Culture & Fame', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Fame, authenticity, and Islamic influence ethics.',
    lessons: [
      { title: 'Seeking Fame and Viral Content', sort_order: 1 },
      { title: 'Ethics of Islamic Influence', sort_order: 2 },
      { title: 'Authenticity vs Performance', sort_order: 3 },
      { title: 'Fame and Accountability', sort_order: 4 },
      { title: 'Role of Muslim Public Figures', sort_order: 5 },
      { title: 'Avoiding the Fame Trap', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Entertainment and Boundaries', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Islamic framework for recreation and leisure.',
    lessons: [
      { title: 'Islamic View on Entertainment', sort_order: 1 },
      { title: 'Permissible vs Impermissible Recreation', sort_order: 2 },
      { title: 'Music, Movies, and Streaming', sort_order: 3 },
      { title: 'Gaming and Addiction', sort_order: 4 },
      { title: 'Art and Expression in Islam', sort_order: 5 },
      { title: 'Protecting Your Time', sort_order: 6 },
      { title: 'Week 4 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 5 – Professional & Economic Ethics
  // ─────────────────────────────────────────────────────────
  {
    title: 'Halal Income', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Earning halal in the modern economy.',
    lessons: [
      { title: 'Importance of Halal Earnings', sort_order: 1 },
      { title: 'Prohibited Forms of Income', sort_order: 2 },
      { title: 'Riba (Interest) and Islamic Alternatives', sort_order: 3 },
      { title: 'Digital Income Ethics', sort_order: 4 },
      { title: 'Gray Areas in Modern Business', sort_order: 5 },
      { title: 'Purifying Earnings through Charity', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Business Ethics', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Islamic principles for ethical commerce.',
    lessons: [
      { title: 'Islamic Commercial Law', sort_order: 1 },
      { title: 'Honest Trade Practices', sort_order: 2 },
      { title: 'Customer Rights in Islam', sort_order: 3 },
      { title: 'Contracts and Trust', sort_order: 4 },
      { title: 'Market Ethics', sort_order: 5 },
      { title: 'Avoiding Deception and Fraud', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Workplace Interaction', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Ethical conduct in professional environments.',
    lessons: [
      { title: 'Professionalism as Worship', sort_order: 1 },
      { title: 'Dealing with Non-Muslims at Work', sort_order: 2 },
      { title: 'Ethics of Representing Islam', sort_order: 3 },
      { title: 'Harassment and Human Dignity', sort_order: 4 },
      { title: 'Work-Life Balance', sort_order: 5 },
      { title: 'Muslim Identity at Work', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Leadership and Trust', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: The Islamic model of ethical leadership.',
    lessons: [
      { title: 'Islamic Concept of Leadership', sort_order: 1 },
      { title: 'Servant Leadership', sort_order: 2 },
      { title: 'Fulfilling Amanah', sort_order: 3 },
      { title: 'Ethical Decision Making', sort_order: 4 },
      { title: 'Accountability in Leadership', sort_order: 5 },
      { title: 'Leading with Character', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Financial Responsibility', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Stewardship of wealth and financial ethics.',
    lessons: [
      { title: 'Islamic Financial Ethics', sort_order: 1 },
      { title: 'Budgeting and Moderation', sort_order: 2 },
      { title: 'Zakat and Wealth Distribution', sort_order: 3 },
      { title: 'Debt and Responsibility', sort_order: 4 },
      { title: 'Financial Planning for Muslims', sort_order: 5 },
      { title: 'Leaving a Legacy', sort_order: 6 },
      { title: 'Week 5 Assessment', sort_order: 7 },
    ]
  },

  // ─────────────────────────────────────────────────────────
  // WEEK 6 – Civic & Global Responsibility
  // ─────────────────────────────────────────────────────────
  {
    title: 'Muslims in Modern Society', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Muslim citizenship and civic participation.',
    lessons: [
      { title: 'Muslim Citizenship Ethics', sort_order: 1 },
      { title: 'Participation in Civil Life', sort_order: 2 },
      { title: 'Voting and Political Ethics', sort_order: 3 },
      { title: 'Contributing to Society', sort_order: 4 },
      { title: 'Being a Positive Minority', sort_order: 5 },
      { title: 'Islam and Democratic Systems', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Justice and Social Responsibility', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Speaking up for justice in society.',
    lessons: [
      { title: 'Standing for Justice', sort_order: 1 },
      { title: 'Supporting the Oppressed', sort_order: 2 },
      { title: 'Charity and Systemic Change', sort_order: 3 },
      { title: 'Environmental Responsibility', sort_order: 4 },
      { title: 'Community Service as Worship', sort_order: 5 },
      { title: 'Advocacy and Ethics', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Responding to Islamophobia', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Wisdom and resilience in the face of prejudice.',
    lessons: [
      { title: 'Understanding Islamophobia', sort_order: 1 },
      { title: 'The Prophetic Model of Response', sort_order: 2 },
      { title: 'Intellectual Defense of Islam', sort_order: 3 },
      { title: 'Emotional Wellbeing Under Pressure', sort_order: 4 },
      { title: 'Community Solidarity', sort_order: 5 },
      { title: 'Building Bridges with Others', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Activism with Wisdom', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Ethical engagement in social causes.',
    lessons: [
      { title: 'What Is Islamic Activism?', sort_order: 1 },
      { title: 'Limits of Protest and Advocacy', sort_order: 2 },
      { title: 'Social Media and Activism', sort_order: 3 },
      { title: 'Avoiding Extremism', sort_order: 4 },
      { title: 'Wisdom (Hikmah) in Action', sort_order: 5 },
      { title: 'Long-Term Community Impact', sort_order: 6 },
      { title: 'Module Assessment', sort_order: 7 },
    ]
  },
  {
    title: 'Positive Representation', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Muslims as ambassadors of ethical excellence.',
    lessons: [
      { title: 'Muslim Identity as Dawah', sort_order: 1 },
      { title: 'Character as Representation', sort_order: 2 },
      { title: 'Professional Excellence', sort_order: 3 },
      { title: 'Cultural Engagement', sort_order: 4 },
      { title: 'Muslims in Media', sort_order: 5 },
      { title: 'Building Community Legacy', sort_order: 6 },
      { title: 'Course Completion Assessment', sort_order: 7 },
    ]
  },
];

// ─────────────────────────────────────────────────────────
// CONTENT BLOCK BUILDER  (rich, structured, no hardcoding)
// ─────────────────────────────────────────────────────────
function makeBlocks(lessonTitle, moduleName, week) {
  const id = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;
  return [
    {
      id: id(), type: 'objectives', order: 0,
      content: {
        items: [
          `Define and explain ${lessonTitle} using Quranic and Sunnah evidence.`,
          `Analyse the relevance of ${lessonTitle} to contemporary Muslim life.`,
          `Apply the ethical principles of ${lessonTitle} to real-world scenarios.`,
          `Evaluate personal conduct in light of ${lessonTitle} within the broader framework of ${moduleName}.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: A fundamental dimension of Islamic ethics explored within the module on ${moduleName}. Classical scholars categorised this under Akhlaq — the science of character and moral conduct.`,
        arabic: 'الأخلاق الإسلامية'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nThis lesson examines **${lessonTitle}** as a core component of *Islamic Ethics & Modern Life*. The Quran invites believers to embody the highest moral standards — not as a burden, but as a natural expression of sincere faith and conscious awareness of Allah.\n\n> "And indeed, you are of a great moral character." (Surah Al-Qalam 68:4 — referring to the Prophet ﷺ)\n\nThe discipline of Akhlaq (Islamic ethics) traces its roots to both divine revelation and the lived example of the Prophet Muhammad ﷺ. Every area of life — from personal interactions to professional conduct, from family life to civic responsibility — is governed by ethical principles drawn from the Quran and Sunnah.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Knowledge', description: `Understanding the Islamic ruling on ${lessonTitle}.`, icon: 'BookOpen' },
          { title: 'Reflection', description: 'Connecting the ruling to your current life.', icon: 'Heart' },
          { title: 'Application', description: 'Implementing one concrete change this week.', icon: 'CheckCircle' },
          { title: 'Accountability', description: 'Reviewing your progress after 30 days.', icon: 'Target' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'O you who have believed, why do you say what you do not do? Great is hatred in the sight of Allah that you say what you do not do. (Surah As-Saf 61:2-3)',
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ ۝ كَبُرَ مَقْتًا عِندَ اللَّهِ أَن تَقُولُوا مَا لَا تَفْعَلُونَ'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'The most beloved of people to Allah are those who are most beneficial to people. (Al-Tabarani — Hasan)',
        arabic: 'أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Applied Ethics: ${lessonTitle} in Context\n\nScholars from Imam al-Ghazali's *Ihya Ulum al-Din* to contemporary thinkers at institutions such as Yaqeen Institute and SeekersGuidance have consistently emphasised that Islamic ethics are inseparable from worship. Character (*Akhlaq*) is not a supplement to the Deen — it **is** the Deen in action.\n\nIn the context of **${moduleName}**, ${lessonTitle} represents a practical dimension that students can immediately apply:\n\n1. **Awareness** — recognising how this principle manifests daily\n2. **Assessment** — evaluating your current standard against the Sunnah\n3. **Action** — committing to one measurable improvement\n4. **Accountability** — building a support system to maintain progress`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Practical Action Plan:\n- Identify one specific way ${lessonTitle} appears (or should appear) in your daily life.\n- Write a short reflection on where you currently stand with this quality.\n- Choose one Sunnah-based action to practice consistently for the next 7 days.\n- Discuss your experience with a study partner or mentor at the end of the week.`,
      author: 'Weekly Ethics Practice'
    },
    {
      id: id(), type: 'video', order: 8,
      content: { url: 'https://www.youtube.com/watch?v=yWwOimr2D38' }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `In Islamic ethical tradition, what is the primary source of moral guidance for ${lessonTitle}?`,
        options: [
          'Cultural tradition and social norms',
          'Personal opinion and majority consensus',
          'The Quran and Sunnah of the Prophet ﷺ',
          'Western philosophical frameworks'
        ],
        correctIndex: 2,
        hint: 'Islamic ethics are rooted in divine revelation and Prophetic example.'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: `Which classical scholar wrote Ihya Ulum al-Din, a foundational text in Islamic ethics and character?`,
        options: ['Ibn Taymiyyah', 'Imam al-Ghazali', 'Imam Nawawi', 'Ibn al-Qayyim'],
        correctIndex: 1,
        hint: 'Known as Hujjat al-Islam.'
      }
    },
    {
      id: id(), type: 'quiz', order: 11,
      content: {
        question: 'What does Akhlaq mean?',
        options: [
          'Islamic jurisprudence and legal rulings',
          'Character, morality, and ethical conduct',
          'The study of theology and creed',
          'Economic and financial dealings'
        ],
        correctIndex: 1,
        hint: 'From the root Khuluq — character.'
      }
    },
    {
      id: id(), type: 'reflection', order: 12,
      content: {
        translation: `How does ${lessonTitle} within the module of ${moduleName} challenge or affirm your current ethical practice? What one commitment will you make this week?`,
        arabic: 'الأخلاق التطبيقية'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Yaqeen Institute — Islamic Ethics',
        description: 'Research papers and articles on contemporary Islamic ethical questions.',
        url: 'https://yaqeeninstitute.org/category/ethics',
        platform: 'Yaqeen Institute'
      }
    },
    {
      id: id(), type: 'document', order: 14,
      content: {
        title: 'SeekersGuidance — Character & Ethics',
        description: 'Structured courses and Q&A on Islamic character and ethics from qualified scholars.',
        url: 'https://seekersguidance.org/courses/character-and-morality/',
        platform: 'SeekersGuidance'
      }
    },
    {
      id: id(), type: 'conclusion', order: 15,
      content: `The study of ${lessonTitle} is not merely academic — it is a call to transformation. Islamic Ethics & Modern Life challenges every student to move from passive knowledge to active character. As you complete this lesson, carry one practical commitment forward into your daily life, and return to review your progress.`
    },
  ];
}

// ─────────────────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────────────────
async function masterReseedCourse3() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Islamic Ethics & Modern Life (Course 3)');
  console.log('============================================\n');

  // ALWAYS create a brand new official course entry
  console.log('🏗  Creating new official Course 3 entry...');
  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week premium certificate program applying Islamic moral philosophy to personal, social, professional, and digital life.',
    course_level: 'intermediate',
    subject_area: 'Islamic Ethics (Akhlaq)',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 40,
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

  // Clean up
  console.log('🗑  Cleaning existing modules/lessons...');
  const { data: oldMods } = await supabase.from('course_modules').select('id').eq('course_id', course.id);
  if (oldMods?.length) {
    await supabase.from('course_lessons').delete().in('module_id', oldMods.map(m => m.id));
    await supabase.from('course_modules').delete().eq('course_id', course.id);
    console.log(`   Removed ${oldMods.length} old modules.\n`);
  } else {
    console.log('   Nothing to clean.\n');
  }

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
        duration_minutes: 15,
        xp_reward: 10,
        coin_reward: 5,
        content_blocks: blocks,
      });
      if (le) { console.log(`   ⚠️  "${lesson.title}": ${le.message}`); }
      else { totalLessons++; process.stdout.write(`   ✅ ${lesson.sort_order}. ${lesson.title}\n`); }
    }
  }

  // Update totals
  await supabase.from('jobs').update({
    title: COURSE_TITLE,
    total_modules: totalModules,
    total_lessons: totalLessons,
    status: 'published'
  }).eq('id', course.id);

  console.log('\n============================================');
  console.log('✅ COMPLETE — Course 3: Islamic Ethics & Modern Life');
  console.log(`   📦 Modules  : ${totalModules}/30`);
  console.log(`   📖 Lessons  : ${totalLessons}/210`);
  console.log(`   🌟 Blocks   : 16 per lesson`);
  console.log('============================================\n');
}

masterReseedCourse3().catch(e => { console.error('Fatal:', e); process.exit(1); });
