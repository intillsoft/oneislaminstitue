/**
 * MASTER RESEED — Course 8: Career Acceleration & Halal Wealth Skills for the Modern Muslim
 * 6 Weeks × 5 Modules × 7 Lessons = 210 Lessons
 * 
 * FOCUS: Career Strategy, Wealth Building, and Professional Excellence.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Career Acceleration & Halal Wealth Skills for the Modern Muslim';

const CURRICULUM = [
  // WEEK 1 — Career Direction & Advantage
  {
    title: 'Clarity-Driven Career Choice', week: 1, sort_order: 1,
    description: 'Week 1 - Module 1: Personal strength mapping and skill clusters.',
    lessons: [
      { title: 'Personal Strength Mapping for Career Fit', sort_order: 1 },
      { title: 'High-Value Skill Clusters Explained', sort_order: 2 },
      { title: 'Choosing a Track with Long-Term Demand', sort_order: 3 },
      { title: 'Avoiding “Busy Skills” That Don’t Pay', sort_order: 4 },
      { title: 'Setting a 6-Month Career Target', sort_order: 5 },
      { title: 'Building a Simple Learning Roadmap', sort_order: 6 },
      { title: 'Week 1 Module 1 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Skill Acquisition That Works', week: 1, sort_order: 2,
    description: 'Week 1 - Module 2: 80/20 learning methods and skill stacking.',
    lessons: [
      { title: 'The 80/20 Skill Learning Method', sort_order: 1 },
      { title: 'Building Skill Stacks, Not Single Skills', sort_order: 2 },
      { title: 'Practice Loops for Faster Improvement', sort_order: 3 },
      { title: 'Turning Tutorials into Real Projects', sort_order: 4 },
      { title: 'Learning Without Burnout Systems', sort_order: 5 },
      { title: 'Measuring Real Skill Progress', sort_order: 6 },
      { title: 'Week 1 Module 2 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Portfolio That Sells You', week: 1, sort_order: 3,
    description: 'Week 1 - Module 3: Proof-of-work and packaging projects.',
    lessons: [
      { title: 'What Employers Actually Want to See', sort_order: 1 },
      { title: 'Building a Portfolio with Proof-of-Work', sort_order: 2 },
      { title: 'Writing Case Studies That Convert', sort_order: 3 },
      { title: 'Demo Videos That Look Professional', sort_order: 4 },
      { title: 'Packaging Projects as “Outcomes”', sort_order: 5 },
      { title: 'Portfolio Review Checklist', sort_order: 6 },
      { title: 'Week 1 Module 3 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Job Market Strategy', week: 1, sort_order: 4,
    description: 'Week 1 - Module 4: Hiring pipelines and application systems.',
    lessons: [
      { title: 'Understanding Hiring Pipelines', sort_order: 1 },
      { title: 'Finding Roles Hidden from Job Boards', sort_order: 2 },
      { title: 'Writing a “Targeted Role Map”', sort_order: 3 },
      { title: 'Creating a Weekly Application System', sort_order: 4 },
      { title: 'Getting Referrals Without Begging', sort_order: 5 },
      { title: 'Handling Rejections Like a Pro', sort_order: 6 },
      { title: 'Week 1 Module 4 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Professional Presence', week: 1, sort_order: 5,
    description: 'Week 1 - Module 5: Online profiles and reputation habits.',
    lessons: [
      { title: 'Building a Credible Online Profile', sort_order: 1 },
      { title: 'Personal Brand Without Showing Off', sort_order: 2 },
      { title: 'Social Proof Without Certificates', sort_order: 3 },
      { title: 'Writing a Strong Bio That’s Honest', sort_order: 4 },
      { title: 'Networking Without Being Fake', sort_order: 5 },
      { title: 'Reputation Habits That Build Trust', sort_order: 6 },
      { title: 'Week 1 Module 5 Mastery Check', sort_order: 7 },
    ]
  },
  // WEEK 2 — Interviews, Offers & Negotiation
  {
    title: 'Interview Confidence Systems', week: 2, sort_order: 6,
    description: 'Week 2 - Module 1: Interview psychology and 1-minute story frameworks.',
    lessons: [
      { title: 'Understanding Interview Psychology', sort_order: 1 },
      { title: 'Answering “Tell Me About Yourself” Strongly', sort_order: 2 },
      { title: 'Explaining Projects with Impact', sort_order: 3 },
      { title: 'Handling Weak Spots Without Lying', sort_order: 4 },
      { title: 'Building Calm Under Pressure', sort_order: 5 },
      { title: 'The 1-Minute Story Framework', sort_order: 6 },
      { title: 'Week 2 Module 6 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Technical Interviews Without Fear', week: 2, sort_order: 7,
    description: 'Week 2 - Module 2: Preparation and problem-solving communication.',
    lessons: [
      { title: 'How to Prepare Without Overstudying', sort_order: 1 },
      { title: 'Problem-Solving Communication Skills', sort_order: 2 },
      { title: 'Explaining Your Thinking Clearly', sort_order: 3 },
      { title: 'Debugging Questions Strategy', sort_order: 4 },
      { title: 'System Design for Non-Seniors', sort_order: 5 },
      { title: 'Practice Plan for 14 Days', sort_order: 6 },
      { title: 'Week 2 Module 7 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Negotiation & Salary Growth', week: 2, sort_order: 8,
    description: 'Week 2 - Module 3: Compensation mechanics and negotiation scripts.',
    lessons: [
      { title: 'How Compensation Really Works', sort_order: 1 },
      { title: 'Negotiation Scripts That Stay Respectful', sort_order: 2 },
      { title: 'Handling Low Offers Professionally', sort_order: 3 },
      { title: 'Negotiating Remote and Benefits', sort_order: 4 },
      { title: 'Building Leverage Ethically', sort_order: 5 },
      { title: 'Knowing When to Walk Away', sort_order: 6 },
      { title: 'Week 2 Module 8 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Workplace Excellence', week: 2, sort_order: 9,
    description: 'Week 2 - Module 4: Reliability, feedback, and conflict at work.',
    lessons: [
      { title: 'Becoming Reliable in 30 Days', sort_order: 1 },
      { title: 'Managing Deadlines Like a Leader', sort_order: 2 },
      { title: 'Communicating Updates the Right Way', sort_order: 3 },
      { title: 'Handling Conflict at Work Calmly', sort_order: 4 },
      { title: 'Avoiding Office Politics Traps', sort_order: 5 },
      { title: 'Turning Feedback into Growth', sort_order: 6 },
      { title: 'Week 2 Module 9 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Career Sustainability', week: 2, sort_order: 10,
    description: 'Week 2 - Module 5: Burnout prevention and deep work habits.',
    lessons: [
      { title: 'Burnout Prevention for High Performers', sort_order: 1 },
      { title: 'Sleep, Focus, and Output Connection', sort_order: 2 },
      { title: 'Productivity Without Hustle Addiction', sort_order: 3 },
      { title: 'Time Blocking That Actually Works', sort_order: 4 },
      { title: 'Deep Work Habits for Muslims', sort_order: 5 },
      { title: 'Weekly Reset Routine', sort_order: 6 },
      { title: 'Week 2 Module 10 Mastery Check', sort_order: 7 },
    ]
  },
  // WEEK 3 — Entrepreneurship Without “Freelancing”
  {
    title: 'Starting Small, Winning Fast', week: 3, sort_order: 11,
    description: 'Week 3 - Module 1: Micro-offers and packaging services.',
    lessons: [
      { title: 'Starting Small, Winning Fast', sort_order: 1 },
      { title: 'Micro-Offer Design for Quick Revenue', sort_order: 2 },
      { title: 'Choosing a Problem Businesses Pay For', sort_order: 3 },
      { title: 'Packaging Services as Products', sort_order: 4 },
      { title: 'Pricing Without Feeling Guilty', sort_order: 5 },
      { title: 'Delivering in 72 Hours Systems', sort_order: 6 },
      { title: 'Week 3 Module 11 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Sales Without Begging', week: 3, sort_order: 12,
    description: 'Week 3 - Module 2: Funnels, outreach, and closing deals.',
    lessons: [
      { title: 'How Business Owners Think', sort_order: 1 },
      { title: 'Writing a Strong Outreach Message', sort_order: 2 },
      { title: 'Building a Simple Sales Funnel', sort_order: 3 },
      { title: 'Handling “Let Me Think” Responses', sort_order: 4 },
      { title: 'Follow-Up Systems That Work', sort_order: 5 },
      { title: 'Closing Deals with Confidence', sort_order: 6 },
      { title: 'Week 3 Module 12 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Building Repeat Customers', week: 3, sort_order: 13,
    description: 'Week 3 - Module 3: Retention, upsells, and testimonials.',
    lessons: [
      { title: 'Delivering Results That Get Referrals', sort_order: 1 },
      { title: 'Setting Boundaries with Clients', sort_order: 2 },
      { title: 'Upsell Without Being Pushy', sort_order: 3 },
      { title: 'Monthly Retainer Offers', sort_order: 4 },
      { title: 'Client Retention Systems', sort_order: 5 },
      { title: 'Building Testimonials Fast', sort_order: 6 },
      { title: 'Week 3 Module 13 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Service Operations', week: 3, sort_order: 14,
    description: 'Week 3 - Module 4: SOPs, quality control, and hiring.',
    lessons: [
      { title: 'Simple Project Management for Small Teams', sort_order: 1 },
      { title: 'Quality Control Checklists', sort_order: 2 },
      { title: 'Handling Revisions Efficiently', sort_order: 3 },
      { title: 'Avoiding Scope Creep', sort_order: 4 },
      { title: 'Creating Standard Operating Procedures', sort_order: 5 },
      { title: 'Hiring Your First Helper', sort_order: 6 },
      { title: 'Week 3 Module 14 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Faith-Aligned Business Discipline', week: 3, sort_order: 15,
    description: 'Week 3 - Module 5: Integrity, Barakah habits, and vision building.',
    lessons: [
      { title: 'Integrity in Delivery and Promises', sort_order: 1 },
      { title: 'Avoiding Fraud and Overclaiming', sort_order: 2 },
      { title: 'Barakah Habits for Work', sort_order: 3 },
      { title: 'Balancing Worship and Ambition', sort_order: 4 },
      { title: 'Managing Stress in Business', sort_order: 5 },
      { title: 'Long-Term Vision Building', sort_order: 6 },
      { title: 'Week 3 Module 15 Mastery Check', sort_order: 7 },
    ]
  },
  // WEEK 4 — Personal Finance & Wealth Skills (Non-Fiqh)
  {
    title: 'Money Mindset Rebuild', week: 4, sort_order: 16,
    description: 'Week 4 - Module 1: Breaking poverty patterns and cash flow systems.',
    lessons: [
      { title: 'Breaking Poverty Mentality Patterns', sort_order: 1 },
      { title: 'Financial Confidence Building', sort_order: 2 },
      { title: 'How to Think in Assets', sort_order: 3 },
      { title: 'Building a Simple Budget System', sort_order: 4 },
      { title: 'Tracking Cash Flow Without Stress', sort_order: 5 },
      { title: 'Identifying Spending Leaks', sort_order: 6 },
      { title: 'Week 4 Module 16 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Income Growth Strategy', week: 4, sort_order: 17,
    description: 'Week 4 - Module 2: Multiple streams and leverage over time.',
    lessons: [
      { title: 'Multiple Income Streams Done Right', sort_order: 1 },
      { title: 'Skill-Based Income Ladder', sort_order: 2 },
      { title: 'Positioning for Promotions', sort_order: 3 },
      { title: 'Building High-Value Relationships', sort_order: 4 },
      { title: 'Creating Leverage Over Time', sort_order: 5 },
      { title: 'Scaling Without Chaos', sort_order: 6 },
      { title: 'Week 4 Module 17 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Saving & Emergency Strength', week: 4, sort_order: 18,
    description: 'Week 4 - Module 3: Automation, debt escape, and financial anxiety.',
    lessons: [
      { title: 'Emergency Fund Plan in 30 Days', sort_order: 1 },
      { title: 'Automating Savings Habits', sort_order: 2 },
      { title: 'Debt Escape Strategy Basics', sort_order: 3 },
      { title: 'Handling Family Financial Pressure', sort_order: 4 },
      { title: 'Preventing Financial Anxiety', sort_order: 5 },
      { title: 'Living Below Means with Dignity', sort_order: 6 },
      { title: 'Week 4 Module 18 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Investment Readiness (Principles)', week: 4, sort_order: 19,
    description: 'Week 4 - Module 4: Risk profiles and wealth protection habits.',
    lessons: [
      { title: 'Risk and Reward Understanding', sort_order: 1 },
      { title: 'Long-Term Thinking vs Gambling', sort_order: 2 },
      { title: 'Basic Portfolio Concepts', sort_order: 3 },
      { title: 'Avoiding Scams and Hype', sort_order: 4 },
      { title: 'Building a Personal Risk Profile', sort_order: 5 },
      { title: 'Wealth Protection Habits', sort_order: 6 },
      { title: 'Week 4 Module 19 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Generosity & Impact Wealth', week: 4, sort_order: 20,
    description: 'Week 4 - Module 5: Purposeful giving and legacy projects.',
    lessons: [
      { title: 'Purposeful Giving Systems', sort_order: 1 },
      { title: 'Supporting Family Wisely', sort_order: 2 },
      { title: 'Community Contribution Planning', sort_order: 3 },
      { title: 'Avoiding Showing Off Charity', sort_order: 4 },
      { title: 'Building Legacy Projects', sort_order: 5 },
      { title: 'Wealth as Responsibility', sort_order: 6 },
      { title: 'Week 4 Module 20 Mastery Check', sort_order: 7 },
    ]
  },
  // WEEK 5 — Leadership, Influence & Communication
  {
    title: 'Leadership at Any Level', week: 5, sort_order: 21,
    description: 'Week 5 - Module 1: Decision-making, ownership, and team trust.',
    lessons: [
      { title: 'Leadership Without a Title', sort_order: 1 },
      { title: 'Decision-Making Under Uncertainty', sort_order: 2 },
      { title: 'Accountability and Ownership', sort_order: 3 },
      { title: 'Building Team Trust', sort_order: 4 },
      { title: 'Handling Mistakes Publicly', sort_order: 5 },
      { title: 'Leading with Calm Energy', sort_order: 6 },
      { title: 'Week 5 Module 21 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Communication Power', week: 5, sort_order: 22,
    description: 'Week 5 - Module 2: Clear writing, speaking, and meeting mastery.',
    lessons: [
      { title: 'Clear Writing for Professionals', sort_order: 1 },
      { title: 'Speaking with Structure and Confidence', sort_order: 2 },
      { title: 'Handling Difficult Conversations', sort_order: 3 },
      { title: 'Persuasion Without Manipulation', sort_order: 4 },
      { title: 'Negotiating Internal Stakeholders', sort_order: 5 },
      { title: 'Meeting Mastery Skills', sort_order: 6 },
      { title: 'Week 5 Module 22 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Personal Influence Systems', week: 5, sort_order: 23,
    description: 'Week 5 - Module 3: Credibility, content, and reputation loops.',
    lessons: [
      { title: 'Building Credibility Fast', sort_order: 1 },
      { title: 'Publishing Work Without Ego', sort_order: 2 },
      { title: 'Networking for Opportunities', sort_order: 3 },
      { title: 'Creating Helpful Content Consistently', sort_order: 4 },
      { title: 'Building a Strong Reputation Loop', sort_order: 5 },
      { title: 'Avoiding Attention Traps', sort_order: 6 },
      { title: 'Week 5 Module 23 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Career Risk Management', week: 5, sort_order: 24,
    description: 'Week 5 - Module 4: Backup plans and stress testing your career.',
    lessons: [
      { title: 'Creating Career Backup Plans', sort_order: 1 },
      { title: 'Handling Layoffs and Uncertainty', sort_order: 2 },
      { title: 'Skill Renewal Every Quarter', sort_order: 3 },
      { title: 'Building Financial Cushion', sort_order: 4 },
      { title: 'Stress Testing Your Career Plan', sort_order: 5 },
      { title: 'Staying Relevant Long-Term', sort_order: 6 },
      { title: 'Week 5 Module 24 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'High Performance With Balance', week: 5, sort_order: 25,
    description: 'Week 5 - Module 5: Motivation, family time, and planning rituals.',
    lessons: [
      { title: 'Weekly Planning Ritual', sort_order: 1 },
      { title: 'Avoiding Overwork and Neglect', sort_order: 2 },
      { title: 'Discipline Without Harshness', sort_order: 3 },
      { title: 'Aligning Career with Worship', sort_order: 4 },
      { title: 'Protecting Family Time', sort_order: 5 },
      { title: 'Sustaining Motivation', sort_order: 6 },
      { title: 'Week 5 Module 25 Mastery Check', sort_order: 7 },
    ]
  },
  // WEEK 6 — Integration & Graduation Track
  {
    title: 'Personal Career Blueprint', week: 6, sort_order: 26,
    description: 'Week 6 - Module 1: Ideal roles and 90-day execution plans.',
    lessons: [
      { title: 'Defining Your Ideal Role', sort_order: 1 },
      { title: 'Mapping Skills to Income Goals', sort_order: 2 },
      { title: 'Designing a 90-Day Execution Plan', sort_order: 3 },
      { title: 'Choosing Mentors and Communities', sort_order: 4 },
      { title: 'Measuring Progress Weekly', sort_order: 5 },
      { title: 'Fixing Weak Areas Fast', sort_order: 6 },
      { title: 'Week 6 Module 26 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Building a Professional Network', week: 6, sort_order: 27,
    description: 'Week 6 - Module 2: Connecting, asking, and maintaining value.',
    lessons: [
      { title: 'Creating a Connection Strategy', sort_order: 1 },
      { title: 'How to Ask for Help Correctly', sort_order: 2 },
      { title: 'Becoming Valuable to Others', sort_order: 3 },
      { title: 'Maintaining Relationships Long-Term', sort_order: 4 },
      { title: 'Events and Communities Strategy', sort_order: 5 },
      { title: 'Digital Networking Discipline', sort_order: 6 },
      { title: 'Week 6 Module 27 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Business Launch Sprint', week: 6, sort_order: 28,
    description: 'Week 6 - Module 3: Packaging, pricing, and finding first buyers.',
    lessons: [
      { title: 'Choosing Your Offer', sort_order: 1 },
      { title: 'Packaging and Pricing', sort_order: 2 },
      { title: 'Finding First Buyers', sort_order: 3 },
      { title: 'Delivery System Setup', sort_order: 4 },
      { title: 'Testimonial Collection Sprint', sort_order: 5 },
      { title: 'Improving Offer With Feedback', sort_order: 6 },
      { title: 'Week 6 Module 28 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Wealth & Life Alignment', week: 6, sort_order: 29,
    description: 'Week 6 - Module 4: Financial north stars and status competition.',
    lessons: [
      { title: 'Setting Financial North Star', sort_order: 1 },
      { title: 'Building Responsible Lifestyle Targets', sort_order: 2 },
      { title: 'Giving Strategy With Boundaries', sort_order: 3 },
      { title: 'Avoiding Status Competition', sort_order: 4 },
      { title: 'Family Financial Planning', sort_order: 5 },
      { title: 'Annual Wealth Review', sort_order: 6 },
      { title: 'Week 6 Module 29 Mastery Check', sort_order: 7 },
    ]
  },
  {
    title: 'Final Showcase & Certification', week: 6, sort_order: 30,
    description: 'Week 6 - Module 5: Final polish, roadmap presentation, and skills audit.',
    lessons: [
      { title: 'Portfolio Final Polish', sort_order: 1 },
      { title: 'Career Plan Presentation', sort_order: 2 },
      { title: 'Offer Pitch Recording', sort_order: 3 },
      { title: 'Public Profile Optimization', sort_order: 4 },
      { title: 'Final Skills Audit', sort_order: 5 },
      { title: 'Graduation Interview Simulation', sort_order: 6 },
      { title: 'Course 8 Certification Evaluation', sort_order: 7 },
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
          `Master the tactical skills for ${lessonTitle}.`,
          `Implement high-value career patterns from ${moduleName}.`,
          `Align professional success with Islamic integrity and barakah.`,
          `Apply proven wealth-building principles to ${lessonTitle}.`,
        ]
      }
    },
    {
      id: id(), type: 'concept', order: 1,
      content: {
        translation: `${lessonTitle}: Accelerating your professional path while protecting your values and wealth.`,
        arabic: 'النجاح المهني والمالي'
      }
    },
    {
      id: id(), type: 'text', order: 2,
      content: `## ${lessonTitle}\n\nWelcome to a strategic session on **${lessonTitle}**. In the modern global economy, a Muslim must be twice as skilled and twice as ethical. We don't just seek income; we seek *Halal Tayyib* (Pure and Good) wealth that serves as a tool for our faith and community.\n\n> "Allah loves that when one of you does a job, he does it with excellence (itqan)." (Prophetic Narrative)\n\nThis module provides the tactical roadmap for mastering ${lessonTitle} as part of your larger career and wealth strategy.`
    },
    {
      id: id(), type: 'infographic', order: 3,
      content: {
        layout: 'process',
        items: [
          { title: 'Strategy', description: 'Defining the high-value approach.', icon: 'Target' },
          { title: 'Skill', description: 'Acquiring the necessary proof-of-work.', icon: 'Tool' },
          { title: 'Market', description: 'Positioning yourself for maximum impact.', icon: 'TrendingUp' },
          { title: 'Wealth', description: 'Converting effort into long-term assets.', icon: 'Wallet' },
        ]
      }
    },
    {
      id: id(), type: 'quran', order: 4,
      content: {
        translation: 'And that there is not for man except that [good] for which he strives. (Surah An-Najm 53:39)',
        arabic: 'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ'
      }
    },
    {
      id: id(), type: 'hadith', order: 5,
      content: {
        translation: 'The honest and trustworthy merchant will be with the Prophets, the truthful ones, and the martyrs. (At-Tirmidhi)',
        arabic: 'التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ'
      }
    },
    {
      id: id(), type: 'text', order: 6,
      content: `### Career Lab: ${lessonTitle}\n\nTo master **${moduleName}**, you must think like a producer, not just a consumer. ${lessonTitle} requires moving from passive learning to active proof-of-work.\n\n1. **High-Value Skills** — What is the specific 'Outcome' you provide?\n2. **Leverage** — How can you do more with less time?\n3. **Reputation** — Your word is your most valuable currency.\n4. **Barakah** — The invisible force that multiplies your output.`
    },
    {
      id: id(), type: 'callout', order: 7,
      content: `Success Task:\n- Record one specific goal for ${lessonTitle} today.\n- Identify one "distraction" you will remove from your workflow.\n- Reach out to one person who is 2 steps ahead of you.\n- Dedicate 30 minutes to pure focus on a "Proof of Work" project.`,
      author: 'Career Excellence Lab'
    },
    {
      id: id(), type: 'quiz', order: 8,
      content: {
        question: `Why is "Proof of Work" more valuable than a certificate for ${lessonTitle}?`,
        options: [
          'It is easier to fake',
          'It shows you can actually deliver a result',
          'Certificates are illegal in some countries',
          'Certificates have no value at all'
        ],
        correctIndex: 1,
        hint: 'Evidence of delivery builds immediate trust.'
      }
    },
    {
      id: id(), type: 'quiz', order: 9,
      content: {
        question: `How does "Itqan" (Excellence) impact your career acceleration in ${lessonTitle}?`,
        options: [
          'It makes you work 20 hours a day',
          'It builds an undeniable reputation that brings referrals',
          'It allows you to ignore office politics',
          'It is only relevant for religious activities'
        ],
        correctIndex: 1,
        hint: 'Excellence is the highest form of marketing.'
      }
    },
    {
      id: id(), type: 'quiz', order: 10,
      content: {
        question: 'What is the "Halal Wealth" mindset regarding ${lessonTitle}?',
        options: [
          'Money is evil and should be avoided',
          'Wealth is a tool for responsibility and community impact',
          'Earning as much as possible at any cost',
          'Only working in mosques'
        ],
        correctIndex: 1,
        hint: 'Think of wealth as stewardship.'
      }
    },
    {
      id: id(), type: 'reflection', order: 11,
      content: {
        translation: `How would your contribution to the Ummah change if your income was 10x higher and your time was 2x freer? What is the one thing holding you back from ${lessonTitle} excellence?`,
        arabic: 'الاستثمار في النفس'
      }
    },
    {
      id: id(), type: 'document', order: 12,
      content: {
        title: 'Naval Ravikant — How to Get Rich (Without Being Lucky)',
        description: 'Mental models for wealth, leverage, and judgment.',
        url: 'https://www.youtube.com/watch?v=1-TZqOsVCNM',
        platform: 'YouTube'
      }
    },
    {
      id: id(), type: 'document', order: 13,
      content: {
        title: 'Harvard Business Review — Negotiation Strategy',
        description: 'Elite frameworks for salary and contract negotiation.',
        url: 'https://hbr.org/topic/negotiation',
        platform: 'HBR'
      }
    },
    {
      id: id(), type: 'conclusion', order: 14,
      content: `Accelerating your career in ${lessonTitle} is a path of service and growth. By completing this session within ${moduleName}, you are arming yourself with the tools to be a leader in the modern economy. Pursue excellence, maintain your integrity, and let the Barakah follow.`
    },
  ];
}

async function masterReseedCourse8() {
  console.log('\n============================================');
  console.log('MASTER RESEED — Career & Wealth (Course 8)');
  console.log('============================================\n');

  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor','admin']).limit(1).single();
  
  const { data: nc, error: ce } = await supabase.from('jobs').insert({
    title: COURSE_TITLE,
    company: 'One Islam Institute',
    location: 'Remote / Online',
    description: 'A 6-week career acceleration and wealth-building mastery program. Learn high-value skills, interview systems, entrepreneurship, and halal wealth management.',
    course_level: 'advanced',
    subject_area: 'Career & Wealth Mastery',
    total_modules: 30,
    total_lessons: 210,
    credit_hours: 50,
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

masterReseedCourse8().catch(e => { console.error('Fatal:', e); process.exit(1); });
