import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;

const lessonsToLoad = [
  {
    title: "Lesson 1.1: Who Am I? The Human Search for Identity",
    pages: [
      {
        page_number: 1,
        page_type: "overview",
        completion_required: true,
        content: [
          { id: genId(), type: "image", content: { url: "https://image.pollinations.ai/prompt/realistic%20silhouette%20person%20stars%20spark%20horizontal?width=1200&height=600&nologo=true" } },
          { id: genId(), type: "text", content: "# Who Am I? The Human Search for Identity" },
          { id: genId(), type: "text", content: "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
          { id: genId(), type: "text", content: "### Key Questions\n• What does it mean to be human?\n• How do different worldviews define human identity?\n• What does Islam say about our origin and purpose?" },
          { id: genId(), type: "text", content: "### Time Estimate\n⏱️ 30 minutes" },
          { id: genId(), type: "text", content: "### Key Terms\n• **Fitrah** – the innate, natural disposition to believe in God and do good.\n• **Ruh** – the soul or spirit breathed into humans by Allah." }
        ]
      },
      {
        page_number: 2,
        page_type: "video",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "## Core Video" },
          { id: genId(), type: "video", content: { url: "https://www.youtube.com/embed/4K6xYv8P7Hw" } },
          { id: genId(), type: "text", content: "**Nouman Ali Khan – \"The Purpose of Life\"**\nIn this talk, Nouman Ali Khan explores the human search for meaning and fitrah that inclines us to connect with the Creator." }
        ]
      },
      {
        page_number: 3,
        page_type: "companion_guide",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "### Summary of Key Points\n• Humans are unique asking deep questions.\n• Identity included intellect, soul, and purpose.\n• Fitrah gives innate awareness of God." },
          { id: genId(), type: "quran", content: { reference: "Surah Al-Isra 17:70", translation: "And We have certainly honored the children of Adam..." } },
          { id: genId(), type: "hadith", content: { reference: "Bukhari", translation: "Every child is born upon the fitrah..." } }
        ]
      },
      {
        page_number: 4,
        page_type: "reflection_journal",
        completion_required: true,
        content: [
          { id: genId(), type: "reflection", content: { prompt: "1. Before this lesson, how did you define your own identity?" } }
        ]
      },
      {
        page_number: 5,
        page_type: "knowledge_check",
        completion_required: true,
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
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "# Why Am I Here? The Purpose of Existence" },
          { id: genId(), type: "text", content: "**Goal:** Understand the Islamic answer to life’s ultimate question." }
        ]
      },
      {
        page_number: 2,
        page_type: "video",
        completion_required: true,
        content: [
          { id: genId(), type: "video", content: { url: "https://www.youtube.com/embed/OmarSuleimanPurpose" } }
        ]
      },
      {
        page_number: 3,
        page_type: "companion_guide",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "### Summary of Key Points\n• Purpose give by Creator." },
          { id: genId(), type: "quran", content: { reference: "Surah Adh-Dhariyat 51:56", translation: "And I did not create the jinn and mankind except to worship Me." } }
        ]
      },
      {
        page_number: 4,
        page_type: "reflection_journal",
        completion_required: true,
        content: [
          { id: genId(), type: "reflection", content: { prompt: "1. Before learning about Islam, what did you think was the purpose of life?" } }
        ]
      },
      {
        page_number: 5,
        page_type: "knowledge_check",
        completion_required: true,
        content: [
          { id: genId(), type: "quiz", content: { question: "According to Surah Adh-Dhariyat, why did Allah create humans and jinn?", options: ["To enjoy life", "To worship Him", "To populate the earth"], correctIndex: 1 } }
        ]
      }
    ]
  }
];

async function start() {
    console.log("Locating orphaned module 'Module 1: The Big Questions'...");
    const { data: mods } = await supabase.from('course_modules').select('id, title, course_id').ilike('title', '%Big Questions%');
    
    if (!mods || mods.length === 0) {
        console.error("Module 'The Big Questions' not found!");
        return;
    }
    const targetMod = mods[0];
    console.log(`Found Module: ${targetMod.title} (ID: ${targetMod.id}) linked to phantom Course ID: ${targetMod.course_id}`);

    console.log("Finding target active course 'Introduction to Aqidah'...");
    const { data: courses } = await supabase.from('courses').select('id, title').ilike('title', '%Introduction to Aqidah%');
    if (!courses || courses.length === 0) {
        console.error("Course 'Introduction to Aqidah' not found!");
        return;
    }
    const targetCourse = courses[0];
    console.log(`Found Target Course: ${targetCourse.title} (ID: ${targetCourse.id})`);

    console.log(`Linking Module ${targetMod.id} to Course ${targetCourse.id}...`);
    const { error: linkError } = await supabase.from('course_modules').update({ course_id: targetCourse.id }).eq('id', targetMod.id);
    if (linkError) {
         console.error("Linking error:", linkError.message);
         return;
    }
    console.log("✅ Successfully linked Module to active Course perfectly!");

    console.log("Fetching Lessons inside Module...");
    const { data: dbLessons } = await supabase.from('course_lessons').select('id, title, sort_order').eq('module_id', targetMod.id).order('sort_order');
    console.log(`Found ${dbLessons.length} lessons inside that module.`);

    for (let i = 0; i < lessonsToLoad.length; i++) {
         const lesson = lessonsToLoad[i];
         const targetDbLesson = dbLessons[i];
         if (!targetDbLesson) {
              console.log(`No Db item found at position ${i}, skipping.`);
              continue;
         }
         const newContentData = { page_count: lesson.pages.length, is_time_gated: false, pages: lesson.pages };

         const { error: updError } = await supabase.from('course_lessons').update({ title: lesson.title, content_data: newContentData }).eq('id', targetDbLesson.id);
         if (updError) {
              console.error(`Error loading ${lesson.title}:`, updError.message);
         } else {
              console.log(`✅ Fully Loaded: ${lesson.title}`);
         }
    }
}

start();
