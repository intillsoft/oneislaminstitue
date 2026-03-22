const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// PAGE 1: LESSON OVERVIEW
// ==========================================
const page1 = `**Goal:** To reflect on the nature of human identity from an Islamic perspective, understanding that our true identity is rooted in our relationship with our Creator.

**Key Questions:**
- What does it mean to be human beyond physical existence?
- How do different worldviews define human identity?
- What does Islam say about our origin, purpose, and ultimate worth?
- How does understanding our identity transform the way we live?

**Time Estimate:** 35 minutes

**Key Terms:**
- **Fitrah** — The innate, natural disposition upon which every human is created; a primordial inclination toward recognizing Allah and knowing truth.
- **Ruh** — The soul or spirit breathed into humans by Allah; the non‑material essence that gives life, consciousness, and moral capacity.
- **Nafs** — The self, ego, or soul.
- **'Abd** — Servant or slave of Allah.
- **Khalifah** — Vicegerent, steward, or trustee on earth.

**Visual Icon:** A silhouette of a person with a light emanating from the chest, symbolizing the soul.`;

// ==========================================
// PAGE 2: CORE VIDEO
// ==========================================
const page2 = `**Embed:** Nouman Ali Khan – "The Purpose of Life & Human Identity"
**Video URL:** https://www.youtube.com/watch?v=4K6xYv8P7Hw

**Video Description:**
In this profound talk, Ustadh Nouman Ali Khan explores the deepest questions of human existence: Who are we? Why are we here? He unpacks the Quranic concept of fitrah, the nature of the soul, and how understanding our true identity liberates us from the false identities that society imposes.

**Video Chapters:**
- 0:00 – Introduction: The universal search for meaning
- 3:20 – The question "Who am I?" across civilizations
- 7:45 – The Quranic answer: Fitrah and the soul
- 12:30 – The honor of being human
- 16:50 – False identities and how we lose ourselves
- 22:10 – Living authentically as a servant of Allah
- 27:00 – Conclusion and reflection`;

// ==========================================
// PAGE 3: COMPANION GUIDE
// ==========================================
const page3 = `### Summary of Key Points
- Humans are unique among creation because we ask deep questions about existence, meaning, and identity.
- Our identity is not limited to the physical body; it includes an intellect, a soul (ruh), and a purpose given by our Creator.
- The Islamic concept of fitrah teaches that every human is born with an innate awareness of God and a natural inclination toward truth and goodness.
- The Quran affirms the dignity of human beings: "And We have certainly honored the children of Adam." (17:70)
- Our ultimate identity is as servants ('abd) of Allah, and this gives life meaning, purpose, and direction.

---
### Deeper Explanation
The question "Who am I?" is perhaps the most fundamental question of human existence. It is not a luxury but a necessity. Without an answer, we drift through life, adopting identities given to us by society, culture, or circumstance. We become defined by our job, our wealth, our relationships, our failures, or our successes. An identity built on shifting sand cannot provide stability.

---
### Quranic Verses
> "And We have certainly honored the children of Adam and carried them on the land and sea and provided for them of the good things and preferred them over much of what We have created, with [definite] preference." (Quran 17:70)

> "And [mention] when your Lord said to the angels, 'I will create a human being from clay of altered black mud. And when I have proportioned him and breathed into him of My [created] soul, then fall down to him in prostration.'" (Quran 15:28-29)

---
### Key Takeaways
1. **Your identity is not defined by the world.** You are not your job, your wealth, your appearance, or your social status.
2. **You were created with a soul (ruh).** This soul gives you consciousness, moral capacity, and the ability to know and love your Creator.
3. **You are born with a fitrah.** Your default state is to incline toward God and truth. This compass is always within you.
4. **You are honored by Allah.** Regardless of your circumstances, you carry a dignity that cannot be taken away.`;

// ==========================================
// PAGE 4: REFLECTION JOURNAL
// ==========================================
const page4 = `1. **Before this lesson, how did you define your own identity?** What factors (family, culture, career, relationships) most shaped that definition?
2. **What does it mean to you personally that you were created with a fitrah?** Can you recall a moment in your life when you felt that innate pull toward truth, goodness, or the Divine?
3. **The Quran states that humans are "honored" by Allah.** How does this knowledge affect your self‑worth? Does it change how you treat others?
4. **Iblis (Satan) defined himself by his origin (fire vs. clay).** Are there ways in which you define yourself by things that are ultimately superficial or temporary?
5. **Write a one‑sentence declaration of your identity based on this lesson.**`;

// ==========================================
// PAGE 5: KNOWLEDGE CHECK
// ==========================================
const page5 = `### Knowledge Check

**Question 1:** According to the Quran, how did Allah describe the creation of humans in Surah At-Tin (95:4)?
- A) Created from clay
- B) Created in the best of stature
- C) Created to struggle
- **Correct: B**

**Question 2:** What is the meaning of "fitrah" in Islamic terminology?
- A) The soul after death
- B) The innate human nature inclined toward God and truth
- **Correct: B**

**Question 3:** Which Surah states that humans are honored by Allah?
- A) Al-Isra (17:70)
- B) Al-Baqarah
- **Correct: A**

**Question 4:** The story of Iblis refusing to prostrate to Adam teaches us that:
- A) Identity based on pride and superficial differences leads to destruction
- B) Angels are better than humans
- **Correct: A**

**Question 5:** What is the ruh?
- A) The physical heart
- B) The soul breathed into humans by Allah
- **Correct: B**`;

async function seed() {
  console.log("--- Starting Seeding script ---");

  // 1. Get Course ID from 'courses' table
  let { data: course, error: cErr } = await supabase
    .from('courses')
    .select('id')
    .ilike('title', '%The Compass%')
    .single();

  if (cErr || !course) {
    console.log("Course not found in 'courses' table, trying 'jobs' table...");
    const { data: jobCourse, error: jErr } = await supabase
      .from('jobs')
      .select('id')
      .ilike('title', '%The Compass%')
      .single();

    if (jErr || !jobCourse) {
      console.error("Course 'The Compass' not found in either 'courses' or 'jobs' tables!");
      process.exit(1);
    }
    course = jobCourse;
  }

  console.log(`Course Found with ID: ${course.id}`);

  // 2. Get Module ID (Assuming Position 1 based on Lesson 1.1 structure tier)
  const { data: module, error: mErr } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', course.id)
    .eq('position', 1)
    .single();

  if (mErr || !module) {
    console.error("Module 1 not found for this course!");
    process.exit(1);
  }

  console.log(`Module Found: ${module.id}`);

  // 3. Check for Existing Lesson to prevent duplication
  const { data: existingLesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('module_id', module.id)
    .eq('title', 'Who Am I? The Human Search for Identity')
    .maybeSingle();

  if (existingLesson) {
    console.log("Skipping insertion: Lesson already exists with ID:", existingLesson.id);
    return;
  }

  // 4. Insert Lesson
  const { data: lesson, error: lErr } = await supabase
    .from('lessons')
    .insert([{
      module_id: module.id,
      title: 'Who Am I? The Human Search for Identity',
      position: 1,
      duration: '35 mins'
    }])
    .select('id')
    .single();

  if (lErr || !lesson) {
    console.error("Failed to insert lesson:", lErr?.message);
    process.exit(1);
  }

  console.log(`Lesson Inserted Successfully with ID: ${lesson.id}`);

  // 5. Batch Insert Lesson Pages
  const { error: pErr } = await supabase
    .from('lesson_pages')
    .insert([
      { lesson_id: lesson.id, title: 'Lesson Overview', content: page1, position: 1, type: 'overview' },
      { lesson_id: lesson.id, title: 'Core Video', content: page2, position: 2, type: 'video' },
      { lesson_id: lesson.id, title: 'Companion Guide', content: page3, position: 3, type: 'guide' },
      { lesson_id: lesson.id, title: 'Reflection Journal', content: page4, position: 4, type: 'journal' },
      { lesson_id: lesson.id, title: 'Knowledge Check', content: page5, position: 5, type: 'quiz' }
    ]);

  if (pErr) {
    console.error("Failed to insert pages:", pErr.message);
  } else {
    console.log("Seeding Completed Successfully!");
  }
}

seed();
