// auto-populate-courses.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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

// A list of general, highly authentic YouTube embeds to fallback on if AI hallucinates
const fallbackVideos = [
  "https://www.youtube.com/embed/Q0A2v3f6vYw", // Omar Suleiman
  "https://www.youtube.com/embed/q6C_G8E38xU", // Abdul Nasir Jangda
  "https://www.youtube.com/embed/5D2eH45W4H0", // Haifaa Younis
  "https://www.youtube.com/embed/T6k6JpWkP-g", // Yasir Qadhi
  "https://www.youtube.com/embed/1B4t1cE3Xow"  // Nouman Ali Khan
];

async function generateLessonContent(courseTitle, moduleTitle, lessonTitle, isIntegration) {
  const integrationInstructions = isIntegration ? `
THIS IS A LESSON 10 "WEEKLY INTEGRATION TASK". The structure must strictly be:
Page 1 (overview): Task Title, Task Goal, Time Required, Materials Needed.
Page 2 (video): Step-by-step instructions for the 7-day task. NO VIDEO. Use a text block.
Page 3 (companion_guide): Provide a daily tracker or checklist description and a document download block.
Page 4 (reflection_journal): 5 deep reflection questions to answer after completing the 7 days.
Page 5 (knowledge_check): A pledge/submission quiz asking if they completed it. No other questions.
  ` : `
THIS IS A STANDARD LESSON.
Page 1 (overview): Title, Lesson Goal, Key Questions, Time Estimate, Key Terms.
Page 2 (video): Video introduction text, ONE YouTube embed url (try to use a real ID of Nouman Ali Khan, Omar Suleiman, Mufti Menk, or Yasir Qadhi if you know it, otherwise leave blank and we will use fallback).
Page 3 (companion_guide): A deep dive guide. Include authentic Quranic Verses (with Surah:Verse citation), Hadith references (with book), Key Takeaways.
Page 4 (reflection_journal): 5 deep reflection questions with reflection input blocks.
Page 5 (knowledge_check): 5 multiple-choice questions with 4 options and correctIndex (0-3).
  `;

  const systemPrompt = `
You are an expert Islamic curriculum developer. You only cite authentic sources (Quran, Sahih Bukari/Muslim).
You return a strict JSON object with a single "pages" array containing exactly 5 pages.
Generate appropriate visually descriptive AI image prompts for Pollinations.ai when an image is needed.
These prompts must be: "Realistic, natural, photographic, horizontal, Islamic architecture or nature, no faces, high quality".

Return JSON in this EXACT structure:
{
  "pages": [
    {
      "page_number": 1,
      "page_type": "overview",
      "completion_required": true,
      "content": [
        { "id": "uuid", "type": "image", "content": { "url": "https://image.pollinations.ai/prompt/realistic%20islamic%20architecture%20sunset?width=1200&height=600&nologo=true" } },
        { "id": "uuid", "type": "text", "content": "# Overview \\n ..." }
      ]
    },
    ...
  ]
}

Use the 'type': 'video', 'document', 'quiz', 'reflection', 'image', 'text', 'quran', 'hadith', 'infographic' where appropriate according to the specifications.
Ensure 5 pages exactly.
Ensure accurate citations.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast and economical
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate content for:\nCourse: ${courseTitle}\nModule: ${moduleTitle}\nLesson: ${lessonTitle}\n\n${integrationInstructions}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    
    // Safety processing to ensure IDs are unique and videos aren't blank
    if (parsed.pages) {
      parsed.pages.forEach(p => {
        p.content.forEach(c => {
          c.id = genId();
          if (c.type === 'video' && (!c.content.url || c.content.url.trim() === '')) {
            c.content.url = fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)];
          }
        });
      });
    }

    return parsed.pages;
  } catch (err) {
    console.error(`AI Generation failed for ${lessonTitle}:`, err.message);
    return null;
  }
}

async function runPopulation() {
  console.log('--- STARTING AI POPULATION DAEMON ---');
  
  const { data: courses, error: errC } = await supabase.from('jobs').select('id, title').eq('status', 'published');
  if (errC) return console.error(errC);

  let populatedCount = 0;

  for (const course of courses) {
    console.log(`\n📚 Scanning Course: ${course.title}`);
    
    const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', course.id).order('sort_order', { ascending: true });
    
    for (const mod of modules || []) {
      const { data: lessons } = await supabase.from('course_lessons').select('id, title, content_data').eq('module_id', mod.id).order('sort_order', { ascending: true });
      
      for (const lesson of lessons || []) {
        const isIntegration = lesson.title.includes('Weekly Integration Task');
        
        // Skip check: Use an indicator. The previous restructure set video URL to "" or "dQw4..."
        // Or we check if the overview text is basic filler.
        let needsPopulation = false;
        
        const pages = lesson.content_data?.pages || [];
        if (pages.length === 0) {
            needsPopulation = true;
        } else {
            // Check for filler placeholders
            const hasEmptyVideo = pages.some(p => p.page_type === 'video' && p.content.some(c => c.type === 'video' && (c.content.url === '' || c.content.url.includes('dQw4'))));
            const hasBasicOverview = pages.some(p => p.page_type === 'overview' && p.content.some(c => c.type === 'text' && c.content.includes("Expand on the foundational concepts introduced")));
            
            if (hasEmptyVideo || hasBasicOverview) {
                needsPopulation = true;
            }
        }

        if (needsPopulation) {
          process.stdout.write(`  ⏳ Generating: ${lesson.title.substring(0,40)}... `);
          const aiPages = await generateLessonContent(course.title, mod.title, lesson.title, isIntegration);
          
          if (aiPages) {
             const newContentData = { page_count: 5, is_time_gated: isIntegration, pages: aiPages };
             const { error: updErr } = await supabase.from('course_lessons').update({ content_data: newContentData }).eq('id', lesson.id);
             
             if (updErr) {
               console.log(`❌ Update failed`);
             } else {
               populatedCount++;
               console.log(`✅ Success`);
             }
          } else {
             console.log(`❌ AI failed`);
          }
          
          // Anti-rate-limit sleep
          await sleep(1500); 
        } else {
           console.log(`  ⏩ Skipping (Already Populated): ${lesson.title.substring(0,40)}`);
        }
      }
    }
  }
  console.log(`\n--- ✨ DAEMON FINISHED. Populated ${populatedCount} lessons. ---`);
}

runPopulation().catch(console.error);
