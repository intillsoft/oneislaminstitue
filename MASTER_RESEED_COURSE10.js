/**
 * MASTER RESEED — Course 10: Muslim Leadership, Public Influence & Institution Building
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 * 
 * FOCUS: Community Projects, Public Influence, and Sustainable Institution Building.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Muslim Leadership, Public Influence & Institution Building';

const CURRICULUM = [
  // WEEK 1 — Leadership Foundations & Credibility
  {
    title: 'Leadership Identity Formation', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Responsibility without ego and leadership values.',
    lessons: [
      { title: 'What Leadership Really Means', sort_order: 1 },
      { title: 'Responsibility Without Ego', sort_order: 2 },
      { title: 'Building Trust Before Influence', sort_order: 3 },
      { title: 'Discipline as Leadership Fuel', sort_order: 4 },
      { title: 'Leadership Values Framework', sort_order: 5 },
      { title: 'Avoiding Power Addiction', sort_order: 6 },
      { title: 'Module 1 Leadership Snapshot', sort_order: 7 },
    ]
  },
  {
    title: 'Communication Authority', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: Voice control, structure, and public confidence.',
    lessons: [
      { title: 'Speaking With Structure', sort_order: 1 },
      { title: 'Voice Control and Presence', sort_order: 2 },
      { title: 'Writing Messages That Move People', sort_order: 3 },
      { title: 'Storytelling for Meaning', sort_order: 4 },
      { title: 'Handling Hard Questions Calmly', sort_order: 5 },
      { title: 'Public Confidence Training', sort_order: 6 },
      { title: 'Module 2 Communication Drill', sort_order: 7 },
    ]
  },
  {
    title: 'Strategic Thinking Basics', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Systems thinking and long-term planning.',
    lessons: [
      { title: 'Thinking in Systems', sort_order: 1 },
      { title: 'Long-Term vs Short-Term Planning', sort_order: 2 },
      { title: 'Choosing the Right Battles', sort_order: 3 },
      { title: 'Measuring Impact Correctly', sort_order: 4 },
      { title: 'Risk Awareness Thinking', sort_order: 5 },
      { title: 'Decision Framework for Leaders', sort_order: 6 },
      { title: 'Module 3 Strategy Check', sort_order: 7 },
    ]
  },
  {
    title: 'Building High-Trust Teams', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Hiring, feedback culture, and mediation.',
    lessons: [
      { title: 'Building High-Trust Teams', sort_order: 1 },
      { title: 'Choosing Team Members Wisely', sort_order: 2 },
      { title: 'Roles and Responsibility Design', sort_order: 3 },
      { title: 'Managing Without Micromanaging', sort_order: 4 },
      { title: 'Feedback Culture Setup', sort_order: 5 },
      { title: 'Conflict Mediation Basics', sort_order: 6 },
      { title: 'Building Team Motivation', sort_order: 7 },
    ]
  },
  {
    title: 'Leadership Reputation Protection', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Transparency, ethical standards, and repairing damage.',
    lessons: [
      { title: 'Avoiding Public Mistakes', sort_order: 1 },
      { title: 'Handling Criticism With Dignity', sort_order: 2 },
      { title: 'Transparency vs Oversharing', sort_order: 3 },
      { title: 'Protecting Private Life', sort_order: 4 },
      { title: 'Consistent Ethical Standards', sort_order: 5 },
      { title: 'Repairing Reputation After Error', sort_order: 6 },
      { title: 'Module 5 Reputation Drill', sort_order: 7 },
    ]
  },
  // WEEK 2 — Community Projects & Execution
  {
    title: 'Community Needs Discovery', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Identifying real needs through data and listening.',
    lessons: [
      { title: 'How to Identify Real Needs', sort_order: 1 },
      { title: 'Listening Tours and Interviews', sort_order: 2 },
      { title: 'Data-Based Community Insight', sort_order: 3 },
      { title: 'Separating Needs From Noise', sort_order: 4 },
      { title: 'Mapping Stakeholders', sort_order: 5 },
      { title: 'Choosing a High-Impact Focus', sort_order: 6 },
      { title: 'Module 6 Needs Report', sort_order: 7 },
    ]
  },
  {
    title: 'Project Design for Impact', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Timelines, budgets, and preventing failure.',
    lessons: [
      { title: 'Clear Objectives Writing', sort_order: 1 },
      { title: 'Building a Realistic Timeline', sort_order: 2 },
      { title: 'Budgeting for Small Projects', sort_order: 3 },
      { title: 'Volunteer Coordination Systems', sort_order: 4 },
      { title: 'Deliverables and Accountability', sort_order: 5 },
      { title: 'Preventing Project Failure', sort_order: 6 },
      { title: 'Module 7 Project Draft', sort_order: 7 },
    ]
  },
  {
    title: 'Execution Discipline', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Tracking progress and quality assurance habits.',
    lessons: [
      { title: 'Execution Discipline', sort_order: 1 },
      { title: 'Weekly Execution Meetings', sort_order: 2 },
      { title: 'Tracking Progress Metrics', sort_order: 3 },
      { title: 'Removing Bottlenecks', sort_order: 4 },
      { title: 'Handling Delays Wisely', sort_order: 5 },
      { title: 'Quality Assurance Habits', sort_order: 6 },
      { title: 'Completion Culture Training', sort_order: 7 },
    ]
  },
  {
    title: 'Partnerships & Alliances', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Aligning values and mutual benefit in collaborations.',
    lessons: [
      { title: 'Partner Selection Checklist', sort_order: 1 },
      { title: 'Aligning Values in Partnerships', sort_order: 2 },
      { title: 'Agreements and Expectations', sort_order: 3 },
      { title: 'Managing Conflicting Interests', sort_order: 4 },
      { title: 'Maintaining Mutual Benefit', sort_order: 5 },
      { title: 'Ending Partnerships Gracefully', sort_order: 6 },
      { title: 'Module 9 Alliance Review', sort_order: 7 },
    ]
  },
  {
    title: 'Volunteer Leadership', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Motivating, training, and managing volunteer burnout.',
    lessons: [
      { title: 'Motivating Without Money', sort_order: 1 },
      { title: 'Appreciating Volunteers Properly', sort_order: 2 },
      { title: 'Managing Burnout in Teams', sort_order: 3 },
      { title: 'Handling Volunteer Conflict', sort_order: 4 },
      { title: 'Training Volunteers Quickly', sort_order: 5 },
      { title: 'Scaling Volunteer Systems', sort_order: 6 },
      { title: 'Module 10 Volunteer Score', sort_order: 7 },
    ]
  },
  // WEEK 3 — Public Influence & Media
  {
    title: 'Public Messaging Strategy', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Audience segmentation and trustworthy voices.',
    lessons: [
      { title: 'Public Messaging Strategy', sort_order: 1 },
      { title: 'Crafting a Clear Message', sort_order: 2 },
      { title: 'Audience Segmentation', sort_order: 3 },
      { title: 'Consistency in Communication', sort_order: 4 },
      { title: 'Message Testing and Feedback', sort_order: 5 },
      { title: 'Avoiding Confusing Slogans', sort_order: 6 },
      { title: 'Building a Trustworthy Voice', sort_order: 7 },
    ]
  },
  {
    title: 'Social Media Influence With Purpose', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Using social media for community impact.',
    lessons: [
      { title: 'Creating Useful Content Themes', sort_order: 1 },
      { title: 'Posting Consistency Systems', sort_order: 2 },
      { title: 'Avoiding Ego-Based Posting', sort_order: 3 },
      { title: 'Managing Comment Sections', sort_order: 4 },
      { title: 'Handling Viral Moments Wisely', sort_order: 5 },
      { title: 'Building a Content Calendar', sort_order: 6 },
      { title: 'Module 12 Influence Audit', sort_order: 7 },
    ]
  },
  {
    title: 'Crisis Communication', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: First response principles and damage repair.',
    lessons: [
      { title: 'First Response Principles', sort_order: 1 },
      { title: 'Avoiding Emotional Statements', sort_order: 2 },
      { title: 'Speaking Under Pressure', sort_order: 3 },
      { title: 'Repairing Public Damage', sort_order: 4 },
      { title: 'Owning Mistakes Properly', sort_order: 5 },
      { title: 'Preventing Future Crises', sort_order: 6 },
      { title: 'Module 13 Crisis Drill', sort_order: 7 },
    ]
  },
  {
    title: 'Public Speaking Mastery', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Hooking attention and structure for public impact.',
    lessons: [
      { title: 'Public Speaking Mastery', sort_order: 1 },
      { title: 'Speech Structure Blueprint', sort_order: 2 },
      { title: 'Hooking Attention Without Tricks', sort_order: 3 },
      { title: 'Clarity and Simplicity Skills', sort_order: 4 },
      { title: 'Handling Stage Fear', sort_order: 5 },
      { title: 'Q&A Handling Strategy', sort_order: 6 },
      { title: 'Speaking With Compassion', sort_order: 7 },
    ]
  },
  {
    title: 'Negotiating With Institutions', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Power dynamics and win-win relationship building.',
    lessons: [
      { title: 'Negotiation as Relationship', sort_order: 1 },
      { title: 'Preparing Your Ask', sort_order: 2 },
      { title: 'Power Dynamics Awareness', sort_order: 3 },
      { title: 'Negotiating Terms and Boundaries', sort_order: 4 },
      { title: 'Win-Win Outcomes Strategy', sort_order: 5 },
      { title: 'Ending Talks Professionally', sort_order: 6 },
      { title: 'Module 15 Negotiation Review', sort_order: 7 },
    ]
  },
  // WEEK 4 — Institution Building
  {
    title: 'Building Sustainable Organizations', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Governance, mission, and evitar Founder Syndrome.',
    lessons: [
      { title: 'Vision, Mission, Values Writing', sort_order: 1 },
      { title: 'Governance Structure Basics', sort_order: 2 },
      { title: 'Accountability Systems', sort_order: 3 },
      { title: 'Preventing Founder Syndrome', sort_order: 4 },
      { title: 'Documentation Discipline', sort_order: 5 },
      { title: 'Scaling Without Losing Culture', sort_order: 6 },
      { title: 'Module 16 Org Blueprint', sort_order: 7 },
    ]
  },
  {
    title: 'Finance & Funding Systems', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Fundraising, donor trust, and financial reports.',
    lessons: [
      { title: 'Budgeting for Organizations', sort_order: 1 },
      { title: 'Fundraising With Transparency', sort_order: 2 },
      { title: 'Donor Trust Building', sort_order: 3 },
      { title: 'Grant Basics and Proposals', sort_order: 4 },
      { title: 'Managing Financial Risk', sort_order: 5 },
      { title: 'Reporting and Accountability', sort_order: 6 },
      { title: 'Module 17 Funding Review', sort_order: 7 },
    ]
  },
  {
    title: 'Operational Excellence', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Workflow, SOPs, and staff performance management.',
    lessons: [
      { title: 'Processes That Reduce Chaos', sort_order: 1 },
      { title: 'Standard Operating Procedures', sort_order: 2 },
      { title: 'Tooling and Workflow Management', sort_order: 3 },
      { title: 'Handling Staff Performance', sort_order: 4 },
      { title: 'Internal Communication Systems', sort_order: 5 },
      { title: 'Continuous Improvement Culture', sort_order: 6 },
      { title: 'Module 18 Ops Score', sort_order: 7 },
    ]
  },
  {
    title: 'Leadership Ethics in Power', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Preventing corruption and building checks/balances.',
    lessons: [
      { title: 'Preventing Corruption in Leadership', sort_order: 1 },
      { title: 'Avoiding Favoritism and Nepotism', sort_order: 2 },
      { title: 'Justice in Decision-Making', sort_order: 3 },
      { title: 'Managing Authority With Humility', sort_order: 4 },
      { title: 'Building Checks and Balances', sort_order: 5 },
      { title: 'Protecting Community Trust', sort_order: 6 },
      { title: 'Module 19 Ethics Audit', sort_order: 7 },
    ]
  },
  {
    title: 'Building Next Leaders', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Mentorship, delegation, and succession planning.',
    lessons: [
      { title: 'Mentorship Program Design', sort_order: 1 },
      { title: 'Training Future Leaders', sort_order: 2 },
      { title: 'Delegation as Development', sort_order: 3 },
      { title: 'Succession Planning', sort_order: 4 },
      { title: 'Building Leadership Pipelines', sort_order: 5 },
      { title: 'Measuring Leadership Growth', sort_order: 6 },
      { title: 'Module 20 Succession Review', sort_order: 7 },
    ]
  },
  // WEEK 5 — Governance, Policy & Social Impact
  {
    title: 'Understanding Policy Influence', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Engaging authorities and organized advocacy.',
    lessons: [
      { title: 'How Policy Shapes Communities', sort_order: 1 },
      { title: 'Engaging Authorities Wisely', sort_order: 2 },
      { title: 'Advocacy Without Chaos', sort_order: 3 },
      { title: 'Building Respectful Dialogue', sort_order: 4 },
      { title: 'Writing Position Statements', sort_order: 5 },
      { title: 'Organizing Community Support', sort_order: 6 },
      { title: 'Module 21 Policy Brief', sort_order: 7 },
    ]
  },
  {
    title: 'Justice-Based Community Reform', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Reform models for youth and economic projects.',
    lessons: [
      { title: 'Reform Without Rage', sort_order: 1 },
      { title: 'Practical Social Change Models', sort_order: 2 },
      { title: 'Building Educational Interventions', sort_order: 3 },
      { title: 'Youth Empowerment Projects', sort_order: 4 },
      { title: 'Economic Empowerment Projects', sort_order: 5 },
      { title: 'Measuring Reform Outcomes', sort_order: 6 },
      { title: 'Module 22 Reform Plan', sort_order: 7 },
    ]
  },
  {
    title: 'Interfaith and Public Relations', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Bridge building, explaining Islam, and PR hosting.',
    lessons: [
      { title: 'Building Bridges With Wisdom', sort_order: 1 },
      { title: 'Explaining Islam Clearly', sort_order: 2 },
      { title: 'Handling Misrepresentation', sort_order: 3 },
      { title: 'Building Media Relationships', sort_order: 4 },
      { title: 'Hosting Public Events', sort_order: 5 },
      { title: 'Professional Representation Standards', sort_order: 6 },
      { title: 'Module 23 PR Review', sort_order: 7 },
    ]
  },
  {
    title: 'Global Thinking for Local Leaders', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Global narratives and cross-border networking.',
    lessons: [
      { title: 'Understanding Global Narratives', sort_order: 1 },
      { title: 'Protecting Local Identity', sort_order: 2 },
      { title: 'Diaspora Community Challenges', sort_order: 3 },
      { title: 'Building Cross-Border Networks', sort_order: 4 },
      { title: 'Adapting to Different Cultures', sort_order: 5 },
      { title: 'Ethical Global Engagement', sort_order: 6 },
      { title: 'Module 24 Global Map', sort_order: 7 },
    ]
  },
  {
    title: 'Leadership Under Opposition', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Handling hate, morale, and strategic responses.',
    lessons: [
      { title: 'Leadership Under Opposition', sort_order: 1 },
      { title: 'Handling Hate and Pressure', sort_order: 2 },
      { title: 'Protecting Team Morale', sort_order: 3 },
      { title: 'Calmness Under Attacks', sort_order: 4 },
      { title: 'Strategic Response Planning', sort_order: 5 },
      { title: 'Legal Awareness Basics', sort_order: 6 },
      { title: 'Maintaining Vision in Trials', sort_order: 7 },
    ]
  },
  // WEEK 6 — Final Integration & Legacy
  {
    title: 'Personal Leadership Constitution', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Personal leadership rules and monthly self-review.',
    lessons: [
      { title: 'Defining Personal Leadership Rules', sort_order: 1 },
      { title: 'Identifying Temptations of Power', sort_order: 2 },
      { title: 'Building Daily Discipline Systems', sort_order: 3 },
      { title: 'Protecting Spiritual Health While Leading', sort_order: 4 },
      { title: 'Leadership Support Circle', sort_order: 5 },
      { title: 'Monthly Self-Review Process', sort_order: 6 },
      { title: 'Module 26 Constitution Check', sort_order: 7 },
    ]
  },
  {
    title: 'Legacy Projects', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Designing and funding multi-year initiatives.',
    lessons: [
      { title: 'Choosing a Legacy Problem', sort_order: 1 },
      { title: 'Designing Multi-Year Projects', sort_order: 2 },
      { title: 'Funding Long-Term Initiatives', sort_order: 3 },
      { title: 'Building Scalable Systems', sort_order: 4 },
      { title: 'Documenting for Future Teams', sort_order: 5 },
      { title: 'Measuring Legacy Impact', sort_order: 6 },
      { title: 'Module 27 Legacy Draft', sort_order: 7 },
    ]
  },
  {
    title: 'Influence Without Celebrity', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Avoiding fame addiction and quiet leadership strategy.',
    lessons: [
      { title: 'Avoiding Fame Addiction', sort_order: 1 },
      { title: 'Quiet Leadership Strategy', sort_order: 2 },
      { title: 'Serving Without Recognition', sort_order: 3 },
      { title: 'Building Influence Through Outcomes', sort_order: 4 },
      { title: 'Staying Consistent Over Years', sort_order: 5 },
      { title: 'Protecting Sincerity in Public Work', sort_order: 6 },
      { title: 'Module 28 Influence Review', sort_order: 7 },
    ]
  },
  {
    title: 'Capstone Launch Sprint', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Launch day checklists and risk planning for capstones.',
    lessons: [
      { title: 'Capstone Scope Definition', sort_order: 1 },
      { title: 'Stakeholder Communication Plan', sort_order: 2 },
      { title: 'Execution Timeline Build', sort_order: 3 },
      { title: 'Risk and Failure Planning', sort_order: 4 },
      { title: 'Launch Day Checklist', sort_order: 5 },
      { title: 'Post-Launch Improvement Plan', sort_order: 6 },
      { title: 'Module 29 Sprint Review', sort_order: 7 },
    ]
  },
  {
    title: 'Graduation & Verification', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Final portfolios and certification panels.',
    lessons: [
      { title: 'Final Leadership Portfolio Assembly', sort_order: 1 },
      { title: 'Public Presentation Recording', sort_order: 2 },
      { title: 'Community Project Report Submission', sort_order: 3 },
      { title: 'Personal Leadership Roadmap', sort_order: 4 },
      { title: 'Team Feedback Collection', sort_order: 5 },
      { title: 'Certification Panel Simulation', sort_order: 6 },
      { title: 'Course 10 Completion Evaluation', sort_order: 7 },
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
          `Master the leadership principles supporting ${lessonTitle}.`,
          `Analyze institution-building strategies from ${moduleName}.`,
          `Implement tactical influence methods for ${lessonTitle}.`,
          `Align public leadership with Islamic accountability (Amanah).`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: Reclaiming the Prophetic model of leadership and public service.`,
        arabic: 'القيادة والمؤسسات'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nIn this strategic session, we analyze **${lessonTitle}**. True leadership in the Muslim community is not about status, but about service (*Khidma*) and responsibility (*Amanah*). To build lasting institutions, we must master the tactical skills of governance, communication, and strategic impact.\n\n> "Each of you is a shepherd and each of you is responsible for his flock." (Prophetic Narrative)\n\nThis module provides the framework for mastering ${lessonTitle} as a pillar of long-term community transformation.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Vision', description: `Defining the path for ${lessonTitle}.`, icon: 'Compass' },
          { title: 'Strategy', description: 'Aligning resources and people.', icon: 'Layout' },
          { title: 'Execution', description: 'Delivering results through discipline.', icon: 'CheckCircle' },
          { title: 'Legacy', description: 'Building systems that outlast the builder.', icon: 'Anchor' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'And We made them leaders, guiding by Our command. And We inspired to them the doing of good deeds and the establishment of prayer... (Surah Al-Anbiya 21:73)',
        arabic: 'وَجَعَلْنَاهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'The leader of a people is their servant. (Prophetic Narrative)',
        arabic: 'سَيِّدُ الْقَوْمِ خَادِمُهُمْ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Leadership Lab: ${lessonTitle}\n\nTo master **${moduleName}**, you must transition from a solo achiever to a system builder. ${lessonTitle} is the test of your ability to influence and organize for the benefit of others.\n\n1. **Amanah (Trust)** — You will be questioned about your authority.\n2. **Strategic Focus** — Not all battles are worth fighting.\n3. **Institutional Durability** — Does the project survive without you?\n4. **Public Presence** — Authenticity is your greatest power.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Leadership Task:\n- Perform a 10-minute "Impact Audit" for ${lessonTitle}.\n- Identify one team member or peer you can mentor today.\n- Draft a 3-point "Position Statement" for an area related to this topic.\n- Practice one "Active Listening" session in your next meeting.`,
      author: 'Elite Leadership Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `What is the primary psychological trap for a leader handling ${lessonTitle}?`,
        options: [
          'Founder Syndrome (the idea that the project is only you)',
          'Delegating too much work to competent people',
          'Focusing too much on data-driven results',
          'Not having enough social media followers'
        ],
        correctIndex: 0,
        hint: 'Sustainability requires letting go of personal identity with the institution.'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `In modern institution building, how does ${lessonTitle} impact durability?`,
        options: [
          'It creates a system of accountability that prevents failure',
          'It makes the organization look more expensive',
          'It allows the leader to take a permanent vacation',
          'It is purely decorative'
        ],
        correctIndex: 0,
        hint: 'Strength comes from the structure, not the individual.'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'What is the "Prophetic Model" of influence regarding ${lessonTitle}?',
        options: [
          'Leading through service and character excellence',
          'Leading through force and strictly enforced rules',
          'Leading through wealth accumulation',
          'Not leading at all'
        ],
        correctIndex: 0,
        hint: '"The leader is the servant."'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `If you were called to account for every single decision related to ${lessonTitle}, would you be satisfied? What is the one legacy you want to leave behind in this field?`,
        arabic: 'تزكية القيادة'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'Harvard Kennedy School — Adaptive Leadership',
        description: 'Elite frameworks for leading through systemic change.',
        url: 'https://www.hks.harvard.edu/educational-programs/',
        platform: 'Harvard.edu'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Stanford Social Innovation Review — Scale',
        description: 'Proven models for scaling community impact.',
        url: 'https://ssir.org/articles/entry/scaling_social_impact',
        platform: 'SSIR'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `Building institutions for the Ummah through ${lessonTitle} is one of the highest forms of continuous charity. By completing this session within ${moduleName}, you are preparing to lead with clarity and dignity. Build high, build deep, and let your legacy speak for itself.`
    },
  ];
}

async function masterReseedCourse10() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Leadership & Institutions (Course 10)');
  console.log('============================================\n');

  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week elite program for community leaders, organization builders, and public influencers. Master strategy, team building, institution governance, and public influence.',
    course_level: 'advanced',
    subject_area: 'Leadership & Institution Building',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 65,
    status: 'published',
    price: 0.00,
    featured: true,
    instructor_id: instr?.id,
  }).select().single();

  if (ce) { console.error('❌ Error:', ce.message); process.exit(1); }
  
  const course = nc;
  console.log(`✅ Created Course: "${course.title}" (${course.id})\n`);

  let totalModules = 0, totalLessons = 0;

  for (const mod of CURRICULUM) {
    process.stdout.write(`📚 Module ${mod.sort_order}/30: "${mod.title}"... `);
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
      }
    }
  }

  await supabase.from('jobs').update({ total_modules: totalModules, total_lessons: totalLessons }).eq('id', course.id);
  console.log(`\n✅ COMPLETE — ${totalLessons} Lessons live.`);
}

masterReseedCourse10().catch(e => { console.error('Fatal:', e); process.exit(1); });
