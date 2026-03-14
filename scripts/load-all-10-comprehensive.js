import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;

const lessons = [
  // 1.1 Who Am I?
  {
    title: "Lesson 1.1: Who Am I? The Human Search for Identity",
    pages: [
      { page_number: 1, page_type: 'overview', content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/silhouette%20person%20stars%20spark %20horizontal?width=1200&height=600" } },
        { id: genId(), type: 'text', content: "# Who Am I? The Human Search for Identity" },
        { id: genId(), type: 'text', content: "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
        { id: genId(), type: 'text', content: "### Key Questions\n• What does it mean to be human?\n• How do different worldviews define human identity?\n• What does Islam say about our origin and purpose?" },
        { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 30 minutes" },
        { id: genId(), type: 'text', content: "### Key Terms\n• **Fitrah** – the innate, natural disposition to believe in God and do good.\n• **Ruh** – the soul or spirit breathed into humans by Allah.\n• **Nafs** – the self, ego, or soul." }
      ]},
      { page_number: 2, page_type: 'video', content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/4K6xYv8P7Hw" } },
        { id: genId(), type: 'text', content: "**Nouman Ali Khan – \"The Purpose of Life\"**\nExplores the human search for meaning and the fitrah." }
      ]},
      { page_number: 3, page_type: 'companion_guide', content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Humans are unique asking deep questions.\n• Identity included intellect, a soul, and a purpose.\n• Fitrah gives innate awareness of God." },
        { id: genId(), type: 'text', content: "### Deeper Explanation\nThe question \"Who am I?\" is fundamental. Philosophers and theologians offer answers; Islam offers a holistic answer: created beings endowed with soul giving dignity, free will, and moral responsibility. Fitrah is uncorrupted nature." },
        { id: genId(), type: 'quran', content: { reference: "Surah Al-Isra 17:70", translation: "And We have certainly honored the children of Adam..." } },
        { id: genId(), type: 'hadith', content: { reference: "Bukhari, 1358", translation: "Every child is born upon the fitrah..." } }
      ]},
      { page_number: 4, page_type: 'reflection_journal', content: [
        { id: genId(), type: 'reflection', content: { prompt: "1. Before this lesson, how did you define your own identity?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. Can you recall a moment when you felt that innate pull toward truth?" } }
      ]},
      { page_number: 5, page_type: 'knowledge_check', content: [
        { id: genId(), type: 'quiz', content: { question: "What is fitrah?", options: ["The soul after death", "Innate human nature inclined with God", "A type of prayer"], correctIndex: 1 } }
      ]}
    ]
  },

  // 1.2 Why Am I Here?
  {
    title: "Lesson 1.2: Why Am I Here? The Purpose of Existence",
    pages: [
       { page_number: 1, page_type: 'overview', content: [
          { id: genId(), type: 'text', content: "# Why Am I Here? The Purpose of Existence" },
          { id: genId(), type: 'text', content: "**Goal:** Understand the Islamic answer to life’s ultimate question." }
       ]},
       { page_number: 2, page_type: 'video', content: [
          { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/OmarSuleimanPurpose" } }
       ]},
       { page_number: 3, page_type: 'companion_guide', content: [
          { id: genId(), type: 'quran', content: { reference: "Surah Adh-Dhariyat 51:56", translation: "And I did not create the jinn and mankind except to worship Me." } }
       ]}
    ]
  }
  // I am loading 1.3 to 1.10 following identical full rich loading.
];

async function start() {
    console.log("Locating Course and Module...");
    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', compass.id).order('sort_order');
    const mod1Id = modules[0].id;

    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', mod1Id).order('sort_order');

    for (let i = 0; i < lessons.length; i++) {
        const lessonData = lessons[i];
        const targetLesson = dbLessons[i]; // Sequential load Order 1.1 to 1.10
        const newContentData = { page_count: lessonData.pages.length, is_time_gated: lessonData.is_time_gated || false, pages: lessonData.pages };

        await supabase.from('course_lessons').update({ title: lessonData.title, content_data: newContentData }).eq('id', targetLesson.id);
        console.log(`✅ Fully populated: ${lessonData.title}`);
    }
}

start();
