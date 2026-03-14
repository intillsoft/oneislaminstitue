import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import OpenAI from 'openai';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Exactly as requested by user
const lesson1 = [
  {
    page_number: 1, page_type: 'overview', completion_required: true,
    content: [
      { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20silhouette%20person%20sunset?width=1200&height=600&nologo=true" } },
      { id: genId(), type: 'text', content: "# Who Am I? The Human Search for Identity" },
      { id: genId(), type: 'text', content: "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
      { id: genId(), type: 'text', content: "### Key Questions\n- What does it mean to be human?\n- How do different worldviews define human identity?\n- What does Islam say about our origin and purpose?" },
      { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 25 minutes" },
      { id: genId(), type: 'text', content: "### Key Terms\n- **Fitrah** – innate human nature inclined toward God\n- **Ruh** – soul/spirit breathed into humans\n- **Nafs** – self, ego, or soul" }
    ]
  },
  {
    page_number: 2, page_type: 'video', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## In this talk, Nouman Ali Khan explores the human search for meaning and how the Quran addresses it." },
      { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/1B4t1cE3Xow" } }, // Fallback real URL
      { id: genId(), type: 'document', content: { title: "Download Transcript", description: "Transcript of the video.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 3, page_type: 'companion_guide', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "### Summary of Key Points\n- Humans are unique among creation – we ask \"why?\"\n- Identity is not just physical; it includes soul and purpose.\n- Islamic view: we are servants of God, created with dignity." },
      { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20beautiful%20islamic%20geometry%20horizontal?width=1200&height=600&nologo=true" } },
      { id: genId(), type: 'text', content: "### Deeper Explanation\nHumans are uniquely positioned in creation. God honored humanity, as confirmed by the Quran (95:4) stating we were created 'in the best of stature'. When asking \"Who am I?\", we cannot merely look at our physical bodies or societal roles. Our true identity stems from the Ruh (soul) that gives us life and the Fitrah (innate nature) that constantly seeks connection with the Creator.\n\nFrom the moment God breathed life into Adam and commanded the angels to prostrate, the profound worth of human existence was established. We are not cosmic accidents; we are deliberate, honored creations bearing a profound responsibility." },
      { id: genId(), type: 'quran', content: { reference: "Surah Al-Isra [17:70]", translation: "And We have certainly honored the children of Adam...", arabic: "وَلَقَدْ كَرَّمْنَا بَنِىٓ ءَادَمَ" } },
      { id: genId(), type: 'quran', content: { reference: "Surah Adh-Dhariyat [51:56]", translation: "I did not create jinn and mankind except to worship Me.", arabic: "وَمَا خَلَقْتُ ٱلْجِنَّ وَٱلْإِنسَ إِلَّا لِيَعْبُدُونِ" } },
      { id: genId(), type: 'hadith', content: { reference: "Sahih Bukhari", translation: "Every child is born upon fitrah...", arabic: "كُلُّ مَوْلُودٍ يُولَدُ عَلَى الْفِطْرَةِ" } },
      { id: genId(), type: 'text', content: "**Stories/Examples:** The story of Adam's creation and the prostration of angels (Quran) illustrates the immense honor embedded into the human soul." },
      { id: genId(), type: 'text', content: "### Key Takeaways\n1. Our identity includes body, mind, and soul.\n2. We are born with a natural inclination to know God.\n3. True fulfillment comes from living according to our purpose." },
      { id: genId(), type: 'document', content: { title: "Full Guide PDF", description: "Download for offline study.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 4, page_type: 'reflection_journal', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Reflection Journal\nAnswer these questions honestly." },
      { id: genId(), type: 'reflection', content: { prompt: "1. Before this lesson, how did you define your own identity?" } },
      { id: genId(), type: 'reflection', content: { prompt: "2. What does it mean to you that you were created with a fitrah?" } },
      { id: genId(), type: 'reflection', content: { prompt: "3. How does knowing you are 'honored' by God affect your self-worth?" } },
      { id: genId(), type: 'reflection', content: { prompt: "4. Write one sentence describing your purpose based on this lesson." } },
      { id: genId(), type: 'reflection', content: { prompt: "5. What is one question about identity you still have?" } }
    ]
  },
  {
    page_number: 5, page_type: 'knowledge_check', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Knowledge Check" },
      { id: genId(), type: 'quiz', content: { question: "According to the Quran, how did Allah describe the creation of humans?", options: ["A) Evolved from apes", "B) Created in the best of stature", "C) Created from clay only", "D) Created as accidental beings"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "What is fitrah?", options: ["A) The soul after death", "B) Innate human nature inclined toward God", "C) The physical body", "D) A type of prayer"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "Which Surah states that humans were created to worship?", options: ["A) Al-Fatiha", "B) Al-Ikhlas", "C) Adh-Dhariyat", "D) Al-Baqarah"], correctIndex: 2 } },
      { id: genId(), type: 'quiz', content: { question: "The story of which prophet's creation illustrates human honor?", options: ["A) Nuh", "B) Ibrahim", "C) Adam", "D) Musa"], correctIndex: 2 } },
      { id: genId(), type: 'quiz', content: { question: "True or False: According to Islam, humans are purely physical beings with no spiritual component.", options: ["A) True", "B) False", "What does it?", "Maybe"], correctIndex: 1 } }
    ]
  }
];

const lesson2 = [
  {
    page_number: 1, page_type: 'overview', completion_required: true,
    content: [
      { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20vast%20beautiful%20desert%20stars%20horizontal?width=1200&height=600&nologo=true" } },
      { id: genId(), type: 'text', content: "# Why Am I Here? The Purpose of Existence" },
      { id: genId(), type: 'text', content: "**Goal:** Understand the Islamic answer to life's ultimate question." },
      { id: genId(), type: 'text', content: "### Key Questions\n- What do other philosophies say about purpose?\n- How does the Quran define our purpose?\n- What does \"worship\" mean in a broad sense?" },
      { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 25 minutes" },
      { id: genId(), type: 'text', content: "### Key Terms\n- **'Ibadah** – worship, service, everything pleasing to God\n- **Khalifah** – vicegerent, steward on earth\n- **Dunya** – this world\n- **Akhirah** – the hereafter" }
    ]
  },
  {
    page_number: 2, page_type: 'video', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Omar Suleiman explains the purpose of creation from the Quran and Sunnah." },
      { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/Q0A2v3f6vYw" } },
      { id: genId(), type: 'document', content: { title: "Download Transcript", description: "Transcript of the video.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 3, page_type: 'companion_guide', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "### Summary\n- Purpose is not random; it is given by the Creator.\n- Primary purpose: to know and worship God.\n- Secondary purpose: to be a caretaker (khalifah) on earth." },
      { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20quran%20book%20on%20stand%20horizontal%20lighting?width=1200&height=600&nologo=true" } },
      { id: genId(), type: 'text', content: "### Deeper Explanation\nThe concept of worship ('Ibadah) in Islam is far broader than formal rituals. While prayers and fasting form the foundation, any permissible action performed with the conscious intention of pleasing God becomes an act of worship. Whether you are earning an honest living, raising a family, or studying, you are fulfilling your purpose.\nMoreover, humans were assigned the incredibly dignified role of 'Khalifah' – stewards – on Earth. God did not place humanity here as an afterthought, but as caretakers meant to establish justice, mercy, and civilization under His laws." },
      { id: genId(), type: 'quran', content: { reference: "Surah Adh-Dhariyat [51:56]", translation: "I did not create jinn and mankind except to worship Me.", arabic: "وَمَا خَلَقْتُ ٱلْجِنَّ وَٱلْإِنسَ إِلَّا لِيَعْبُدُونِ" } },
      { id: genId(), type: 'quran', content: { reference: "Surah Al-Baqarah [2:30]", translation: "Indeed, I will make upon the earth a successive authority (khalifah).", arabic: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً" } },
      { id: genId(), type: 'hadith', content: { reference: "Sahih Muslim", translation: "The world is a prison for the believer and a paradise for the disbeliever.", arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ" } },
      { id: genId(), type: 'text', content: "**Stories:** The story of the universe's incredible tuning pointing undeniably to a Creator emphasizes our teleological purpose." },
      { id: genId(), type: 'text', content: "### Takeaways\n1. Life has meaning – it is a test and an opportunity.\n2. Worship includes every good action with right intention.\n3. We are here to build and care for the earth." },
      { id: genId(), type: 'document', content: { title: "Full Guide PDF", description: "Download for offline study.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 4, page_type: 'reflection_journal', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Reflection Journal" },
      { id: genId(), type: 'reflection', content: { prompt: "1. Before Islam, what did you think was the purpose of life?" } },
      { id: genId(), type: 'reflection', content: { prompt: "2. How does the concept of being a khalifah change how you view your daily work?" } },
      { id: genId(), type: 'reflection', content: { prompt: "3. Name one activity you usually don't consider worship that could become worship with intention." } },
      { id: genId(), type: 'reflection', content: { prompt: "4. Write a short intention for tomorrow morning." } },
      { id: genId(), type: 'reflection', content: { prompt: "5. What distracts you most from remembering your purpose?" } }
    ]
  },
  {
    page_number: 5, page_type: 'knowledge_check', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Knowledge Check" },
      { id: genId(), type: 'quiz', content: { question: "What is the primary purpose of human creation according to Surah Adh-Dhariyat?", options: ["A) To enjoy life", "B) To worship Allah", "C) To populate the earth", "D) To gain knowledge"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "The term \"khalifah\" refers to:", options: ["A) A prophet", "B) A vicegerent or steward on earth", "C) A type of prayer", "D) The Day of Judgment"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "Which of the following can be considered worship?", options: ["A) Praying", "B) Working with honesty to support family", "C) Smiling at others", "D) All of the above"], correctIndex: 3 } },
      { id: genId(), type: 'quiz', content: { question: "The hadith \"The world is a prison for the believer\" means:", options: ["A) Believers should be sad all the time", "B) This life is a restriction compared to the freedom of Jannah", "C) Believers are imprisoned in dunya", "D) Dunya is evil"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "True/False: Worship in Islam is limited to rituals like prayer and fasting.", options: ["A) True", "B) False", "What", "No"], correctIndex: 1 } }
    ]
  }
];

const lesson3 = [
  {
    page_number: 1, page_type: 'overview', completion_required: true,
    content: [
      { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20light%20at%20the%20end%20of%20a%20tunnel%20path%20horizontal?width=1200&height=600&nologo=true" } },
      { id: genId(), type: 'text', content: "# Where Am I Going? The Journey Ahead" },
      { id: genId(), type: 'text', content: "**Goal:** Understand the Islamic concept of life as a journey toward the Hereafter." },
      { id: genId(), type: 'text', content: "### Key Questions\n- What happens after death?\n- What is the purpose of this temporary world?\n- How should we prepare for the next life?" },
      { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 25 minutes" },
      { id: genId(), type: 'text', content: "### Key Terms\n- **Barzakh** – intermediate stage after death\n- **Qiyamah** – Day of Judgment\n- **Jannah** – Paradise\n- **Jahannam** – Hellfire" }
    ]
  },
  {
    page_number: 2, page_type: 'video', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## A visual lecture on the stages after death. (Yaqeen Institute)" },
      { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/q6C_G8E38xU" } },
      { id: genId(), type: 'document', content: { title: "Download Transcript", description: "Transcript of the video.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 3, page_type: 'companion_guide', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "### Summary\nLife is a test; death is not the end. The journey transcends through three main stages: dunya (the worldly life), barzakh (the intermediate state in the grave), and akhirat (the eternal Hereafter)." },
      { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20serene%20path%20into%20light%20mountains%20horizontal?width=1200&height=600&nologo=true" } },
      { id: genId(), type: 'text', content: "### Deeper Explanation\nThe ultimate answer given by Islam regarding our destination is absolute certainty in the Hereafter. The grave is not a resting place of non-existence, but the first station of the Akhirah. To recognize that this world is temporary prevents believers from despair when facing injustice, and prevents arrogance when gifted with success." },
      { id: genId(), type: 'quran', content: { reference: "Surah Al-Mulk [67:2]", translation: "[He] who created death and life to test you [as to] which of you is best in deed.", arabic: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا" } },
      { id: genId(), type: 'quran', content: { reference: "Surah Aal-e-Imran [3:185]", translation: "Every soul will taste death, and you will only be given your [full] compensation on the Day of Resurrection.", arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ" } },
      { id: genId(), type: 'hadith', content: { reference: "Jami` at-Tirmidhi", translation: "The grave is the first stage of the Hereafter.", arabic: "إِنَّ الْقَبْرَ أَوَّلُ مَنَازِلِ الآخِرَةِ" } },
      { id: genId(), type: 'text', content: "### Takeaways\n1. Prepare continuously for the inevitable reality of death.\n2. Repent frequently because nobody is guaranteed tomorrow.\n3. Do good as a deposit for your eternal home." },
      { id: genId(), type: 'document', content: { title: "Full Guide PDF", description: "Download for offline study.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 4, page_type: 'reflection_journal', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Reflection Journal" },
      { id: genId(), type: 'reflection', content: { prompt: "1. How does believing in an afterlife change your daily choices?" } },
      { id: genId(), type: 'reflection', content: { prompt: "2. What is one thing you would do differently if you remembered death more often?" } },
      { id: genId(), type: 'reflection', content: { prompt: "3. What legacy do you want to leave behind when your time comes?" } },
      { id: genId(), type: 'reflection', content: { prompt: "4. Imagine standing on the Day of Judgment. What deed would you pray is accepted?" } },
      { id: genId(), type: 'reflection', content: { prompt: "5. Write down a short prayer for a peaceful passing." } }
    ]
  },
  {
    page_number: 5, page_type: 'knowledge_check', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Knowledge Check" },
      { id: genId(), type: 'quiz', content: { question: "What is 'Barzakh'?", options: ["The day of judgment", "The intermediate stage after death", "Hellfire", "Paradise"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "What does Surah Al-Mulk 67:2 state is the purpose of life and death?", options: ["To suffer", "To test who is best in deed", "To build wealth", "To evolve"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "According to the Hadith, what is the 'first stage of the Hereafter'?", options: ["The bridge over Hell", "The grave", "The scale of deeds", "The gathering"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "Which Surah states that 'Every soul will taste death'?", options: ["Al-Fatiha", "Aal-e-Imran", "Al-Asr", "Al-Kauthar"], correctIndex: 1 } },
      { id: genId(), type: 'quiz', content: { question: "What should the reality of death motivate a believer to do?", options: ["Give up on life", "Chase as much pleasure as possible", "Prepare, repent, and do good", "Ignoret it"], correctIndex: 2 } }
    ]
  }
];

const lesson10 = [
  {
    page_number: 1, page_type: 'overview', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "# Weekly Integration Task: The Big Questions" },
      { id: genId(), type: 'text', content: "**Task Goal:** Synthesize the knowledge from this module and connect these foundational truths deeply into your personal worldview." },
      { id: genId(), type: 'text', content: "### Time Required\nAllow 20-30 minutes per day spread over 7 days." },
      { id: genId(), type: 'text', content: "### Materials Needed\n- A dedicated journal or digital document.\n- 15 minutes of uninterrupted silence daily.\n- The downloadable Tracking Template." }
    ]
  },
  {
    page_number: 2, page_type: 'video', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Task Instructions\nOver the next 7 days, you will mindfully apply the reality of \"The Big Questions\" to your life." },
      { id: genId(), type: 'text', content: "### Daily Breakdown\n- **Day 1-2: Audit your Purpose.** Review your daily choices. Which ones are serving your ultimate purpose (Ibadah)?\n- **Day 3-4: The Akhirah lens.** Mentally fast-forward to the end of your life. Will current stresses matter then?\n- **Day 5-6: Searching for Truth.** Identify one doubt or question you've had, and trace the steps you need to authenticate the answer.\n- **Day 7: Finalize your insights.** Write down a cohesive reflection." },
      { id: genId(), type: 'text', content: "**Tips for Success:** Keep your intention pure. This isn't about impressing anyone; it's about establishing a clear compass between you and God." }
    ]
  },
  {
    page_number: 3, page_type: 'companion_guide', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Tracking Template\nDownload the daily tracker to organize your thoughts as you complete this week-long task." },
      { id: genId(), type: 'document', content: { title: "Week 1 Integration Tracker", description: "Daily prompts for The Big Questions.", url: "#", platform: "PDF" } }
    ]
  },
  {
    page_number: 4, page_type: 'reflection_journal', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Weekly Reflection\n*Complete this ONLY after your 7 days are finished.*" },
      { id: genId(), type: 'reflection', content: { prompt: "1. What was the most difficult paradigm shift you experienced this week?" } },
      { id: genId(), type: 'reflection', content: { prompt: "2. How has your definition of 'success' changed since beginning this module?" } },
      { id: genId(), type: 'reflection', content: { prompt: "3. Looking at your answers regarding death, did it evoke fear, peace, or a mix of both?" } },
      { id: genId(), type: 'reflection', content: { prompt: "4. What is one specific, practical change you must make to your daily routine immediately?" } },
      { id: genId(), type: 'reflection', content: { prompt: "5. How will you remind yourself of these 'Big Questions' when daily life distracts you?" } }
    ]
  },
  {
    page_number: 5, page_type: 'knowledge_check', completion_required: true,
    content: [
      { id: genId(), type: 'text', content: "## Final Submission & Pledge" },
      { id: genId(), type: 'quiz', content: { question: "Have you completed the 7-day integration task to the best of your ability?", options: ["Yes, I have completed the task with a sincere intention.", "No, not yet."], correctIndex: 0 } }
    ]
  }
];

// Re-generate using AI for lessons 4-9 based on exact titles.
async function generateAIFor(title) {
  const prompt = `
You are an expert Islamic curriculum developer. You only cite authentic sources (Quran, Sahih Bukhari/Muslim) with exact Book/Verse references.
Generate exactly 5 pages of engaging, non-repetitive content for ONE lesson titled: "${title}".

REQUIREMENTS:
- Use authentic sources.
- Include pollinations.ai horizontal image prompts.
- Format strictly as JSON.
- THIS IS A STANDARD LESSON:
  Page 1 (overview): Title, Goal, Key Questions, Time Estimate, Key Terms. Include 1 image.
  Page 2 (video): Intro text, ONE real YouTube embed URL (Nouman Ali Khan, Omar Suleiman, Mufti Menk, Yasir Qadhi - use fallback if unknown).
  Page 3 (companion_guide): Deep dive guide. Include authentic Quran verses, Hadith, Key Takeaways. Include 1 image.
  Page 4 (reflection_journal): 5 reflection questions with input blocks.
  Page 5 (knowledge_check): 5 quiz questions with 4 options and correctIndex.

JSON structure:
{
  "pages": [
    {
      "page_number": 1,
      "page_type": "overview",
      "completion_required": true,
      "content": [ ... ]
    }
  ]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Generate JSON for exactly this lesson title: "${title}". NO markdown wrappers.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    
    if (parsed.pages) {
      parsed.pages.forEach(p => {
        p.content.forEach(c => c.id = genId());
      });
    }

    return parsed.pages;
  } catch(e) {
    console.error(e);
    return null;
  }
}

async function start() {
    const titlesWeWant = [
        "Lesson 1.1: Who Am I? The Human Search for Identity",
        "Lesson 1.2: Why Am I Here? The Purpose of Existence",
        "Lesson 1.3: Where Am I Going? The Journey Ahead",
        "Lesson 1.4: What is Truth? How Do We Know?",
        "Lesson 1.5: Is There a God? The Human Intuition",
        "Lesson 1.6: Why Do People Believe Differently?",
        "Lesson 1.7: What is Success in This Life?",
        "Lesson 1.8: What Happens After Death?",
        "Lesson 1.9: How Do I Find Answers?",
        "Lesson 1.10: Weekly Integration Task – The Big Questions"
    ];

    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    
    const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', compass.id).order('sort_order');
    const mod1Id = modules[0].id;

    // Fix existing lesson titles and payloads
    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', mod1Id).order('sort_order');

    for (let i = 0; i < 10; i++) {
        const sortedLesson = dbLessons[i];
        const intendedTitle = titlesWeWant[i];
        
        let targetPages = null;

        if (i === 0) targetPages = lesson1;
        else if (i === 1) targetPages = lesson2;
        else if (i === 2) targetPages = lesson3;
        else if (i === 9) targetPages = lesson10;

        if (targetPages) {
            console.log(`Working on: ${intendedTitle}`);
            const newContentData = { page_count: 5, is_time_gated: (i === 9), pages: targetPages };
            
            await supabase.from('course_lessons').update({
                title: intendedTitle,
                content_data: newContentData
            }).eq('id', sortedLesson.id);
            console.log(`Saved ${intendedTitle} to DB.`);
        }
    }
}

start();
