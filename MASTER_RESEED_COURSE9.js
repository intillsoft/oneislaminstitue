/**
 * MASTER RESEED — Course 9: Digital Life Mastery & Identity Protection in the AI Age
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 * 
 * FOCUS: Attention Discipline, Online Safety, and AI Era Literacy.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Digital Life Mastery & Identity Protection in the AI Age';

const CURRICULUM = [
  // WEEK 1 — Attention, Dopamine & Screen Discipline
  {
    title: 'The Attention Economy Explained', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Understanding platform monetization and dopamine loops.',
    lessons: [
      { title: 'How Platforms Monetize Your Focus', sort_order: 1 },
      { title: 'Dopamine Loops and Habit Hooks', sort_order: 2 },
      { title: 'Scroll Fatigue and Mental Fog', sort_order: 3 },
      { title: 'Why “Just Stop” Doesn’t Work', sort_order: 4 },
      { title: 'Designing an Attention Shield', sort_order: 5 },
      { title: 'Tracking Screen Triggers', sort_order: 6 },
      { title: 'Module 1 Focus Audit', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Addiction Recovery', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: Recognizing compulsive patterns and building friction.',
    lessons: [
      { title: 'Recognizing Compulsive Use Patterns', sort_order: 1 },
      { title: 'Detox Without Quitting Life', sort_order: 2 },
      { title: 'Replacing Scrolling With Meaning', sort_order: 3 },
      { title: 'Building Friction Against Bad Habits', sort_order: 4 },
      { title: 'Creating Healthy Reward Systems', sort_order: 5 },
      { title: 'Weekend Reset Framework', sort_order: 6 },
      { title: 'Module 2 Recovery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Identity Under Pressure Online', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Comparison psychology and handling online criticism.',
    lessons: [
      { title: 'Comparison Culture Psychology', sort_order: 1 },
      { title: 'The “Perfect Life” Illusion', sort_order: 2 },
      { title: 'Self-Worth Without Likes', sort_order: 3 },
      { title: 'Building Inner Confidence Offline', sort_order: 4 },
      { title: 'Faith-Consistent Self-Image', sort_order: 5 },
      { title: 'Handling Online Criticism', sort_order: 6 },
      { title: 'Module 3 Identity Check', sort_order: 7 },
    ]
  },
  {
    title: 'Online Speech & Conflict', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Tone control and manual for online de-escalation.',
    lessons: [
      { title: 'Controlling Tone in Text', sort_order: 1 },
      { title: 'Avoiding Comment Wars', sort_order: 2 },
      { title: 'Disagreeing Without Humiliation', sort_order: 3 },
      { title: 'Preventing Misinterpretation', sort_order: 4 },
      { title: 'Repairing Digital Mistakes', sort_order: 5 },
      { title: 'Handling Provocation Calmly', sort_order: 6 },
      { title: 'Module 4 Speech Check', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Routine Engineering', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Morning rituals, app limits, and work blocks.',
    lessons: [
      { title: 'Morning Without Phone Strategy', sort_order: 1 },
      { title: 'Work Blocks Without Notifications', sort_order: 2 },
      { title: 'Night Routine for Better Sleep', sort_order: 3 },
      { title: 'App Limits That Actually Stick', sort_order: 4 },
      { title: 'Building a “Clean Feed”', sort_order: 5 },
      { title: 'Weekly Digital Review', sort_order: 6 },
      { title: 'Module 5 Routine Score', sort_order: 7 },
    ]
  },
  // WEEK 2 — Privacy, Safety & Reputation
  {
    title: 'Privacy Protection Essentials', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Data footprints, password hygiene, and 2FA.',
    lessons: [
      { title: 'Your Digital Footprint Reality', sort_order: 1 },
      { title: 'Password Hygiene Systems', sort_order: 2 },
      { title: 'Two-Factor Authentication Setup', sort_order: 3 },
      { title: 'Avoiding Data Leaks', sort_order: 4 },
      { title: 'Location Sharing Risks', sort_order: 5 },
      { title: 'Safe Device Habits', sort_order: 6 },
      { title: 'Module 6 Security Check', sort_order: 7 },
    ]
  },
  {
    title: 'Reputation & Future Risk', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Cleaning old posts and building a professional brand.',
    lessons: [
      { title: 'Permanent Internet Memory', sort_order: 1 },
      { title: 'Cleaning Old Posts Safely', sort_order: 2 },
      { title: 'Professional Online Presence', sort_order: 3 },
      { title: 'Avoiding Oversharing', sort_order: 4 },
      { title: 'Handling Screenshots & Leaks', sort_order: 5 },
      { title: 'Building a Respectable Brand', sort_order: 6 },
      { title: 'Module 7 Reputation Check', sort_order: 7 },
    ]
  },
  {
    title: 'Scams, Fraud & Manipulation', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Social engineering defense and scan patterns.',
    lessons: [
      { title: 'Social Engineering Tricks', sort_order: 1 },
      { title: 'Common Online Scam Patterns', sort_order: 2 },
      { title: 'Fake Jobs and Fake Links', sort_order: 3 },
      { title: 'Protecting Family From Scams', sort_order: 4 },
      { title: 'Recognizing Emotional Manipulation', sort_order: 5 },
      { title: 'Reporting and Recovery Steps', sort_order: 6 },
      { title: 'Module 8 Scam Defense Test', sort_order: 7 },
    ]
  },
  {
    title: 'AI Tools Without Dependence', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Efficient AI use and avoiding brain-off dependence.',
    lessons: [
      { title: 'What AI Can and Can’t Do', sort_order: 1 },
      { title: 'Using AI for Learning Efficiency', sort_order: 2 },
      { title: 'Avoiding “Brain Off” Dependence', sort_order: 3 },
      { title: 'Checking AI Mistakes', sort_order: 4 },
      { title: 'Prompts for Real Productivity', sort_order: 5 },
      { title: 'Building AI-Assisted Workflows', sort_order: 6 },
      { title: 'Module 9 AI Literacy Check', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Boundaries With People', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Group chat control and unavailability expectations.',
    lessons: [
      { title: 'Group Chat Overload Control', sort_order: 1 },
      { title: 'Saying No Without Conflict', sort_order: 2 },
      { title: 'Setting Availability Expectations', sort_order: 3 },
      { title: 'Blocking and Muting With Wisdom', sort_order: 4 },
      { title: 'Family Boundaries Online', sort_order: 5 },
      { title: 'Friendship Health Online', sort_order: 6 },
      { title: 'Module 10 Boundary Score', sort_order: 7 },
    ]
  },
  // WEEK 3 — Media, Music, Trends & Lifestyle
  {
    title: 'Trend Immunity Training', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: FOMO, viral toxicity, and intentional taste.',
    lessons: [
      { title: 'Trend Immunity Training', sort_order: 1 },
      { title: 'How Trends Shape Values', sort_order: 2 },
      { title: 'FOMO and Identity Loss', sort_order: 3 },
      { title: 'Choosing Content Intentionally', sort_order: 4 },
      { title: 'Avoiding Viral Toxicity', sort_order: 5 },
      { title: 'Trend Filtering Framework', sort_order: 6 },
      { title: 'Module 11 Trend Audit', sort_order: 7 },
    ]
  },
  {
    title: 'Entertainment Consumption Discipline', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Binge patterns and replacing entertainment with skill.',
    lessons: [
      { title: 'Binge Patterns and Time Theft', sort_order: 1 },
      { title: 'Choosing Media Wisely', sort_order: 2 },
      { title: 'Replacing Entertainment With Skill', sort_order: 3 },
      { title: 'Social Media vs Real Rest', sort_order: 4 },
      { title: 'Avoiding Emotional Numbness', sort_order: 5 },
      { title: 'Building Balanced Recreation', sort_order: 6 },
      { title: 'Module 12 Balance Check', sort_order: 7 },
    ]
  },
  {
    title: 'Influencer Culture & Self-Respect', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Parasocial relationships and marketing tricks.',
    lessons: [
      { title: 'Parasocial Relationships Explained', sort_order: 1 },
      { title: 'Marketing Tricks to Spot', sort_order: 2 },
      { title: 'Consumerism Through Influence', sort_order: 3 },
      { title: 'Guarding Heart From Envy', sort_order: 4 },
      { title: 'Learning Without Idolizing', sort_order: 5 },
      { title: 'Curating Healthy Role Models', sort_order: 6 },
      { title: 'Module 13 Influence Check', sort_order: 7 },
    ]
  },
  {
    title: 'News, Outrage & Anxiety', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: Doomscrolling, news intake, and mental calm.',
    lessons: [
      { title: 'News, Outrage & Anxiety', sort_order: 1 },
      { title: 'Doomscrolling and Stress', sort_order: 2 },
      { title: 'Outrage Addiction Cycle', sort_order: 3 },
      { title: 'Choosing Reliable Information', sort_order: 4 },
      { title: 'Preventing Fear-Based Living', sort_order: 5 },
      { title: 'Limits for News Intake', sort_order: 6 },
      { title: 'Module 14 Calm Check', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Minimalism Lifestyle', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Decluttering and building offline joy.',
    lessons: [
      { title: 'Minimalism as Freedom', sort_order: 1 },
      { title: 'Decluttering Apps and Accounts', sort_order: 2 },
      { title: 'One-Screen Rule Strategy', sort_order: 3 },
      { title: 'Deep Work Digital Setup', sort_order: 4 },
      { title: 'Long-Term Habit Reinforcement', sort_order: 5 },
      { title: 'Building Offline Joy', sort_order: 6 },
      { title: 'Module 15 Minimalism Score', sort_order: 7 },
    ]
  },
  // WEEK 4 — Learning, Productivity & AI Era Skills
  {
    title: 'Learning Online Without Chaos', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Note systems and avoiding tutorial hell.',
    lessons: [
      { title: 'Learning Online Without Chaos', sort_order: 1 },
      { title: 'Course Overload Problem', sort_order: 2 },
      { title: 'Note Systems That Stick', sort_order: 3 },
      { title: 'Turning Notes Into Action', sort_order: 4 },
      { title: 'Avoiding Tutorial Hell', sort_order: 5 },
      { title: 'Learning With Weekly Projects', sort_order: 6 },
      { title: 'Module 16 Learning Check', sort_order: 7 },
    ]
  },
  {
    title: 'Focus & Output Systems', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Notification management and deep focus sessions.',
    lessons: [
      { title: 'Multi-Tasking Myth', sort_order: 1 },
      { title: 'Single-Task Productivity Design', sort_order: 2 },
      { title: 'Managing Notifications', sort_order: 3 },
      { title: 'Deep Focus Sessions', sort_order: 4 },
      { title: 'Recovering From Distraction', sort_order: 5 },
      { title: 'Daily Output Targets', sort_order: 6 },
      { title: 'Module 17 Output Score', sort_order: 7 },
    ]
  },
  {
    title: 'AI for Content and Work', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: AI writing rules and quality control.',
    lessons: [
      { title: 'AI Writing Assist Guidelines', sort_order: 1 },
      { title: 'AI for Planning and Summaries', sort_order: 2 },
      { title: 'AI for Brainstorming Safely', sort_order: 3 },
      { title: 'AI for Career Tasks', sort_order: 4 },
      { title: 'Avoiding Plagiarism Mistakes', sort_order: 5 },
      { title: 'Quality Control Checklist', sort_order: 6 },
      { title: 'Module 18 AI Use Score', sort_order: 7 },
    ]
  },
  {
    title: 'Information Verification', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Deepfakes, misinformation, and cross-checking.',
    lessons: [
      { title: 'Misinformation Tactics', sort_order: 1 },
      { title: 'Fake Images and Deepfakes', sort_order: 2 },
      { title: 'Cross-Checking Methods', sort_order: 3 },
      { title: 'Confirmation Bias Defense', sort_order: 4 },
      { title: 'Building a Verification Habit', sort_order: 5 },
      { title: 'Sharing Responsibly', sort_order: 6 },
      { title: 'Module 19 Verification Test', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Skill Portfolio', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Proof-of-work and measuring content impact.',
    lessons: [
      { title: 'Proof-of-Work Online', sort_order: 1 },
      { title: 'Sharing Without Ego', sort_order: 2 },
      { title: 'Publishing With Consistency', sort_order: 3 },
      { title: 'Building a Personal Knowledge Hub', sort_order: 4 },
      { title: 'Creating a “Useful Content” System', sort_order: 5 },
      { title: 'Measuring Content Impact', sort_order: 6 },
      { title: 'Module 20 Portfolio Check', sort_order: 7 },
    ]
  },
  // WEEK 5 — Community, Family & Faith Online
  {
    title: 'Healthy Online Communities', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Benefical spaces and building real friendships.',
    lessons: [
      { title: 'Finding Beneficial Communities', sort_order: 1 },
      { title: 'Avoiding Toxic Spaces', sort_order: 2 },
      { title: 'Handling Group Conflicts', sort_order: 3 },
      { title: 'Building Real Friendships', sort_order: 4 },
      { title: 'Community Contribution Habits', sort_order: 5 },
      { title: 'Leaving Spaces Gracefully', sort_order: 6 },
      { title: 'Module 21 Community Score', sort_order: 7 },
    ]
  },
  {
    title: 'Family Life and Devices', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Screen agreements and device-free rituals.',
    lessons: [
      { title: 'Family Screen Agreements', sort_order: 1 },
      { title: 'Protecting Children Online', sort_order: 2 },
      { title: 'Teen Social Media Boundaries', sort_order: 3 },
      { title: 'Device-Free Family Rituals', sort_order: 4 },
      { title: 'Handling Family WhatsApp Drama', sort_order: 5 },
      { title: 'Building Peaceful Communication', sort_order: 6 },
      { title: 'Module 22 Family Check', sort_order: 7 },
    ]
  },
  {
    title: 'Faith Learning Online Wisely', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Choosing teachers and managing online doubts.',
    lessons: [
      { title: 'Avoiding Confusion From Random Clips', sort_order: 1 },
      { title: 'How to Choose Reliable Teachers', sort_order: 2 },
      { title: 'Building a Structured Learning Path', sort_order: 3 },
      { title: 'Not Fighting Over Differences', sort_order: 4 },
      { title: 'Managing Doubts From Content', sort_order: 5 },
      { title: 'Protecting Spiritual Focus', sort_order: 6 },
      { title: 'Module 23 Learning Safety Test', sort_order: 7 },
    ]
  },
  {
    title: 'Online Charity and Projects', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Scam-free giving and promote causes with wisdom.',
    lessons: [
      { title: 'Supporting Good Work Online', sort_order: 1 },
      { title: 'Avoiding Scam Donations', sort_order: 2 },
      { title: 'Building Transparent Fundraising', sort_order: 3 },
      { title: 'Promoting Causes With Wisdom', sort_order: 4 },
      { title: 'Volunteering Digitally', sort_order: 5 },
      { title: 'Long-Term Impact Planning', sort_order: 6 },
      { title: 'Module 24 Impact Check', sort_order: 7 },
    ]
  },
  {
    title: 'Digital Manners Excellence', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Reply timing and building a gentle presence.',
    lessons: [
      { title: 'Respectful Messaging Habits', sort_order: 1 },
      { title: 'Reply Timing and Courtesy', sort_order: 2 },
      { title: 'Avoiding Public Shaming', sort_order: 3 },
      { title: 'Giving Advice Privately', sort_order: 4 },
      { title: 'Handling Mistakes With Humility', sort_order: 5 },
      { title: 'Building a Gentle Presence', sort_order: 6 },
      { title: 'Module 25 Manners Score', sort_order: 7 },
    ]
  },
  // WEEK 6 — Final Digital Blueprint
  {
    title: 'Personal Digital Constitution', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Screen time targets and accountability setup.',
    lessons: [
      { title: 'Writing Your Online Rules', sort_order: 1 },
      { title: 'Apps You Keep vs Remove', sort_order: 2 },
      { title: 'Content You Allow vs Block', sort_order: 3 },
      { title: 'Your Screen Time Targets', sort_order: 4 },
      { title: 'Accountability Setup', sort_order: 5 },
      { title: 'Monthly Reset Plan', sort_order: 6 },
      { title: 'Module 26 Blueprint Review', sort_order: 7 },
    ]
  },
  {
    title: 'Crisis Protocols Online', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Harassment, leaking, and legal awareness.',
    lessons: [
      { title: 'Handling Harassment', sort_order: 1 },
      { title: 'Handling Leaks and Doxing', sort_order: 2 },
      { title: 'Emotional Recovery After Attacks', sort_order: 3 },
      { title: 'Reporting and Evidence Keeping', sort_order: 4 },
      { title: 'Legal Awareness Basics', sort_order: 5 },
      { title: 'Support Network Activation', sort_order: 6 },
      { title: 'Module 27 Crisis Drill', sort_order: 7 },
    ]
  },
  {
    title: 'AI Era Identity Strength', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Meaning in a synthetic world and guarding self-worth.',
    lessons: [
      { title: 'Meaning in a Synthetic World', sort_order: 1 },
      { title: 'Guarding Self-Worth From Machines', sort_order: 2 },
      { title: 'Staying Human in AI Workflows', sort_order: 3 },
      { title: 'Building Real Skills, Not Shortcuts', sort_order: 4 },
      { title: 'Ethical Personal Standards', sort_order: 5 },
      { title: 'Life Mission Reinforcement', sort_order: 6 },
      { title: 'Module 28 Identity Review', sort_order: 7 },
    ]
  },
  {
    title: 'Productivity Lifestyle Upgrade', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: 90-day sprints and removing hidden distractions.',
    lessons: [
      { title: '90-Day Skill Sprint Plan', sort_order: 1 },
      { title: 'Building Focused Weekly Cycles', sort_order: 2 },
      { title: 'Measuring Growth Metrics', sort_order: 3 },
      { title: 'Removing Hidden Distractions', sort_order: 4 },
      { title: 'Reinforcing Healthy Rewards', sort_order: 5 },
      { title: 'Long-Term Discipline Systems', sort_order: 6 },
      { title: 'Module 29 Upgrade Check', sort_order: 7 },
    ]
  },
  {
    title: 'Graduation & Verification', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Final audit and accountability contracts.',
    lessons: [
      { title: 'Final Digital Audit', sort_order: 1 },
      { title: 'Screen Discipline Certification Test', sort_order: 2 },
      { title: 'Personal Presentation: My Digital Plan', sort_order: 3 },
      { title: 'Community Contribution Commitment', sort_order: 4 },
      { title: 'Long-Term Accountability Contract', sort_order: 5 },
      { title: 'Maintenance Strategy Setup', sort_order: 6 },
      { title: 'Course 9 Completion Evaluation', sort_order: 7 },
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
          `Recognize the behavioral mechanics of ${lessonTitle}.`,
          `Identify security and identity risks related to ${lessonTitle}.`,
          `Implement a practical 'Digital Shield' for ${lessonTitle}.`,
          `Align your digital habits with Islamic principles of focus and manners.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: Navigating the modern digital landscape with wisdom and technological literacy.`,
        arabic: 'الإتقان الرقمي'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nIn this lesson, we master **${lessonTitle}**. The digital world is designed to extract your attention and shape your identity. To thrive in the AI era, you must move from being a passive consumer to an intentional master of your digital tools.\n\n> "A person's Islam is good when he leaves that which does not concern him." (Prophetic Narrative)\n\nThis module provides the tactical defense system for ${lessonTitle} in an age of constant distraction and technological shifts.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Awareness', description: `Spotting the 'trap' in ${lessonTitle}.`, icon: 'Eye' },
          { title: 'Defense', description: 'Immediate technical and mental shields.', icon: 'Lock' },
          { title: 'Optimization', description: 'Using tools for real growth.', icon: 'Cpu' },
          { title: 'Flow', description: 'Returning to deep, focused work.', icon: 'Zap' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'And follow not that of which you have no knowledge. Verily, the hearing, and the sight, and the heart, of each of those you will be questioned. (Surah Al-Isra 17:36)',
        arabic: 'وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'It is enough of a lie for a person to speak of everything that he hears. (Muslim)',
        arabic: 'كَفَى بِالْمَرْءِ كَذِبًا أَنْ يُحَدِّثَ بِكُلِّ مَا سَمِعَ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Digital Mastery Lab: ${lessonTitle}\n\nTo master **${moduleName}**, you must understand the 'Attention Tax.' Every time you engage with ${lessonTitle} without intent, you pay with your focus.\n\n1. **The Click-Bait Loop** — Why you feel compelled to check.\n2. **Security Protocols** — Technical steps to protect your data.\n3. **AI Integration** — Using machines as assistants, not replacements.\n4. **Public Persona** — Your digital footprint is your legacy.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Digital Discipline Task:\n- Perform a 2-minute "Notification Audit" for ${lessonTitle} apps.\n- Enable 2FA on one high-value account related to this topic.\n- Practice 1 hour of "Deep Single-Tasking" with no other tabs open.\n- Record one way AI can *help* you with this specific task today.`,
      author: 'Digital Mastery Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `Why does ${lessonTitle} often lead to "Mental Fog" in the digital age?`,
        options: [
          'The screen light is too bright',
          'Dopamine spikes and constant context switching',
          'Lack of internet speed',
          'It is purely a physical health issue'
        ],
        correctIndex: 1,
        hint: 'Switching focus cost energy.'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `What is the best way to maintain "Faith-Consistent Identity" during ${lessonTitle}?`,
        options: [
          'Deleting all social media permanently',
          'Validating self-worth through likes',
          'Aligning online behavior with Prophetic adab (manners)',
          'Ignoring all online interactions'
        ],
        correctIndex: 2,
        hint: 'Adab is universal, online and offline.'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'How do platforms monetise the topic of ${lessonTitle}?',
        options: [
          'By selling your private secrets directly',
          'By keeping you on the app as long as possible for ad revenue',
          'By charging a monthly fee for every post',
          'They do not monetize it at all'
        ],
        correctIndex: 1,
        hint: 'Your attention is the product.'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `If you deleted all distractions related to ${lessonTitle}, what would you do with the extra 3 hours of focus per day? Who would you become if your mind was truly your own?`,
        arabic: 'تزكية العقل الرقمي'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'Cal Newport — Digital Minimalism',
        description: 'Elite strategies for focused life in a noisy world.',
        url: 'https://www.calnewport.com/books/digital-minimalism/',
        platform: 'CalNewport.com'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'OWASP — Personal Security Guide',
        description: 'Global standards for protecting your digital identity.',
        url: 'https://owasp.org/www-project-personal-security-framework/',
        platform: 'OWASP'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `Mastering ${lessonTitle} is a prerequisite for success in the AI age. By completing this session within ${moduleName}, you are reclaiming your time and protecting your dignity. Stay intentional, stay secure, and keep your focus on the high-value work of your life.`
    },
  ];
}

async function masterReseedCourse9() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Digital Mastery (Course 9)');
  console.log('============================================\n');

  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week digital lifestyle and identity protection program. Master your attention, secure your privacy, and gain technological literacy for the AI era.',
    course_level: 'advanced',
    subject_area: 'Digital Mastery & AI Literacy',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 45,
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

masterReseedCourse9().catch(e => { console.error('Fatal:', e); process.exit(1); });
