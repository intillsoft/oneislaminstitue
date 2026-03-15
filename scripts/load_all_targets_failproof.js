import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;

const courseIds = [
  'd240b5c5-449e-43de-804f-5880f634d19e',
  '5bdf783f-b42b-4e25-bef1-d707c632df42'
];

const lessonsToLoad = [
  {
    title: "Lesson 1.1: Who Am I? The Human Search for Identity",
    pages: [
      {
        page_number: 1,
        page_type: "overview",
        content: [
          { id: genId(), type: "image", content: { url: "https://image.pollinations.ai/prompt/realistic%20silhouette%20person%20stars%20spark%20horizontal?width=1200&height=600&nologo=true" } },
          { id: genId(), type: "text", content: "# Who Am I? The Human Search for Identity" },
          { id: genId(), type: "text", content: "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
          { id: genId(), type: "text", content: "### Key Questions\n• What does it mean to be human?\n• How do different worldviews define human identity?\n• What does Islam say about our origin and purpose?" },
          { id: genId(), type: "text", content: "### Time Estimate\n⏱️ 30 minutes" },
          { id: genId(), type: "text", content: "### Key Terms\n• **Fitrah** – the innate, natural disposition to believe in God and do good.\n• **Ruh** – the soul or spirit breathed into humans by Allah.\n• **Nafs** – the self, ego, or soul." }
        ]
      },
      {
        page_number: 2,
        page_type: "video",
        content: [
          { id: genId(), type: "video", content: { url: "https://www.youtube.com/embed/4K6xYv8P7Hw" } },
          { id: genId(), type: "text", content: "**Nouman Ali Khan – \"The Purpose of Life\"**\nExplores the human search for meaning and the fitrah." }
        ]
      },
      {
        page_number: 3,
        page_type: "companion_guide",
        content: [
          { id: genId(), type: "text", content: "### Summary of Key Points\n• Humans ask deep questions about existence.\n• Identity is more than just physical." },
          { id: genId(), type: "quran", content: { reference: "Surah Al-Isra 17:70", translation: "And We have certainly honored the children of Adam." } },
          { id: genId(), type: "hadith", content: { reference: "Bukhari", translation: "Every child is born upon the fitrah..." } }
        ]
      },
      {
        page_number: 4,
        page_type: "reflection_journal",
        content: [
          { id: genId(), type: "reflection", content: { prompt: "1. Before this lesson, how did you define your identity?" } }
        ]
      },
      {
        page_number: 5,
        page_type: "knowledge_check",
        content: [
          { id: genId(), type: "quiz", content: { question: "What is fitrah?", options: ["The soul after death", "Innate human nature inclined toward God", "A type of prayer"], correctIndex: 1 } }
        ]
      }
    ]
  },
  {
    title: "Lesson 1.2: Why Am I Here? The Purpose of Existence",
    pages: [
      {
        page_number: 1,
        page_type: "overview",
        content: [
          { id: genId(), type: "text", content: "# Why Am I Here? The Purpose of Existence" },
          { id: genId(), type: "text", content: "**Goal:** Understand the Islamic answer to life’s ultimate question." },
          { id: genId(), type: "text", content: "### Key Questions\n• How does the Quran define our purpose?\n• What does 'worship' mean in a broad sense?" }
        ]
      },
      {
        page_number: 2,
        page_type: "video",
        content: [
          { id: genId(), type: "video", content: { url: "https://www.youtube.com/embed/OmarSuleimanPurpose" } }
        ]
      },
      {
        page_number: 3,
        page_type: "companion_guide",
        content: [
          { id: genId(), type: "quran", content: { reference: "Surah Adh-Dhariyat 51:56", translation: "And I did not create the jinn and mankind except to worship Me." } }
        ]
      },
      {
        page_number: 5,
        page_type: "knowledge_check",
        content: [
          { id: genId(), type: "quiz", content: { question: "According to Surah Adh-Dhariyat, why did Allah create humans and jinn?", options: ["To enjoy life", "To worship", "To populate the earth"], correctIndex: 1 } }
        ]
      }
    ]
  }
];

async function start() {
    for (const id of courseIds) {
        console.log(`\n🔍 Processing Course ID: ${id}`);
        const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', id).order('sort_order');
        if (!modules || modules.length === 0) {
            console.log(`Skipping Course ${id} - Zero modules found.`);
            continue;
        }
        const mod1Id = modules[0].id;
        console.log(`Using Module: "${modules[0].title}" (${mod1Id})`);

        const { data: dbLessons } = await supabase.from('course_lessons').select('id, title, sort_order').eq('module_id', mod1Id).order('sort_order');
        console.log(`Found ${dbLessons.length} lessons in Module 1.`);

        for (let i = 0; i < lessonsToLoad.length; i++) {
             const l = lessonsToLoad[i];
             const dbL = dbLessons[i];
             if (!dbL) {
                  console.log(`Position ${i} is empty in DB, skipping.`);
                  continue;
             }
             const { error } = await supabase.from('course_lessons').update({ title: l.title, content_data: { page_count: l.pages.length, is_time_gated: false, pages: l.pages } }).eq('id', dbL.id);
             if (error) console.error(`Error loading ${l.title}:`, error.message);
             else console.log(`✅ Loaded ${l.title}`);
        }
    }
}

start();
