// fix-and-populate-courses.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// We will use native fetch to call Groq API
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fallbackVideos = [
  "https://www.youtube.com/embed/Q0A2v3f6vYw", 
  "https://www.youtube.com/embed/q6C_G8E38xU", 
  "https://www.youtube.com/embed/5D2eH45W4H0", 
  "https://www.youtube.com/embed/T6k6JpWkP-g", 
  "https://www.youtube.com/embed/1B4t1cE3Xow"
];

async function generateAndFixLesson(courseTitle, moduleTitle, currentLessonTitle, isIntegration, allModuleLessonTitles) {
  const needsRenaming = currentLessonTitle.includes('Deep Dive - Expanding');
  
  const systemPrompt = `
You are an expert Islamic curriculum developer. You only cite authentic sources (Quran, Sahih Bukhari/Muslim) with exact Book/Verse references.
You are tasked with generating EXACTLY 5 pages of engaging, non-repetitive content for ONE specific lesson.

${needsRenaming 
  ? `CRITICAL REQUIREMENT: The current title "${currentLessonTitle}" is a generic placeholder. You MUST generate a BRAND NEW, unique, and logical lesson title that fits the progression of the module theme: "${moduleTitle}". Do NOT repeat previous lessons. Return the new title in the JSON under the key "new_lesson_title".` 
  : `The lesson title is: "${currentLessonTitle}". It is already fine, return it as "new_lesson_title".`
}

IMAGE REQUIREMENT: Generate unique, context-aware image URL prompts for pollinations.ai in the content. 
Format: https://image.pollinations.ai/prompt/[highly_descriptive_prompt]?width=1200&height=600&nologo=true
The prompt MUST specify: generic, realistic, natural, photography, horizontal landscape, high quality. Example: "realistic architecture of an ancient mosque at sunset horizontal landscape". NEVER depict faces or specific scholars.

${isIntegration ? `
THIS IS LESSON 10 - A WEEKLY INTEGRATION TASK.
Page 1 (overview): Task Title, Task Goal, Time Required, Materials Needed.
Page 2 (video): Text ONLY instructions for a 7-day task. NO VIDEO embeds.
Page 3 (companion_guide): A tracking template or daily checklist format. Add a document download block.
Page 4 (reflection_journal): 5 deep reflection questions to answer after completing the 7 days.
Page 5 (knowledge_check): 1 single quiz question checking if they completed it.
` : `
THIS IS A STANDARD LESSON.
Page 1 (overview): Title, Lesson Goal, Key Questions, Time Estimate, Key Terms. Include 1 image block.
Page 2 (video): Introductory text, ONE YouTube embed url (try to use a real ID of Nouman Ali Khan, Omar Suleiman, Mufti Menk, or Yasir Qadhi if you know an exact one on this topic, otherwise leave blank).
Page 3 (companion_guide): Deep dive guide. Include authentic Quranic Verses (Surah:Verse), Hadith references, Key Takeaways. Include 1 image block.
Page 4 (reflection_journal): 5 deep reflection questions with input blocks. Background image.
Page 5 (knowledge_check): 5 multiple-choice questions with 4 options and correctIndex.
`}

Return JSON strictly:
{
  "new_lesson_title": "Lesson X: [Unique Descriptive Title]",
  "pages": [
    {
      "page_number": 1,
      "page_type": "overview",
      "completion_required": true,
      "content": [ ... ]
    },
    ...
  ]
}

DO NOT output markdown enclosing the JSON. Raw JSON only.
`;

  try {
    const rawResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate content for:\nCourse: ${courseTitle}\nModule: ${moduleTitle}\nLesson: ${currentLessonTitle}\nOther existing lesson titles in this module: ${JSON.stringify(allModuleLessonTitles)}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      })
    });

    if (!rawResponse.ok) {
       console.error(`Status ${rawResponse.status}: ${await rawResponse.text()}`);
       return null;
    }

    const completion = await rawResponse.json();
    const parsed = JSON.parse(completion.choices[0].message.content);
    
    // Safety processing
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

    return { title: parsed.new_lesson_title, pages: parsed.pages };
  } catch (err) {
    console.error(`AI Generation failed for ${currentLessonTitle}: ${err.message}`);
    return null;
  }
}

async function runFixAndPopulate() {
  console.log('--- STARTING SUPERIOR AI FIX & POPULATION DAEMON ---');
  
  const { data: courses, error: errC } = await supabase.from('jobs').select('id, title').eq('status', 'published');
  if (errC) return console.error(errC);

  let populatedCount = 0;
  let renamedCount = 0;

  for (const course of courses) {
    console.log(`\n📚 Scanning Course: ${course.title}`);
    
    const { data: modules } = await supabase.from('course_modules')
      .select('id, title')
      .eq('course_id', course.id)
      .order('sort_order', { ascending: true });
    
    for (const mod of modules || []) {
      const { data: lessons } = await supabase.from('course_lessons')
        .select('id, title, content_data, sort_order')
        .eq('module_id', mod.id)
        .order('sort_order', { ascending: true });
        
      const allTitles = (lessons || []).map(l => l.title);
      
      for (const lesson of lessons || []) {
        const isIntegration = lesson.title.includes('Weekly Integration Task') || lesson.title.includes('Lesson 10');
        const needsRenaming = lesson.title.includes('Deep Dive - Expanding');
        
        let isFillerContent = false;
        const pages = lesson.content_data?.pages || [];
        if (pages.length === 0) {
            isFillerContent = true;
        } else {
            const hasEmptyVideo = pages.some(p => p.page_type === 'video' && p.content.some(c => c.type === 'video' && (c.content.url === '' || c.content.url.includes('dQw4'))));
            const hasBasicOverview = pages.some(p => p.page_type === 'overview' && p.content.some(c => c.type === 'text' && c.content.includes("Expand on the foundational concepts")));
            if (hasEmptyVideo || hasBasicOverview) isFillerContent = true;
        }

        // If it was already manually populated (like Lesson 1-3 in Compass, or Lesson 10), we only skip if it doesn't need renaming
        if (isFillerContent || needsRenaming) {
          process.stdout.write(`  ⏳ Generating: [${lesson.sort_order}] ${lesson.title.substring(0,35)}... `);
          
          let retryCount = 0;
          let result = null;
          while (retryCount < 3 && !result) {
              result = await generateAndFixLesson(course.title, mod.title, lesson.title, isIntegration, allTitles);
              retryCount++;
              if (!result) await sleep(2000);
          }
          
          if (result && result.pages) {
             const newContentData = { page_count: 5, is_time_gated: isIntegration, pages: result.pages };
             
             let updatePayload = { content_data: newContentData };
             
             // Extract lesson number format so we don't mess up "Lesson 4: ..."
             const oldPrefixMatch = lesson.title.match(/^(Lesson \d+:)/);
             let finalTitle = result.title || lesson.title;
             
             if (needsRenaming) {
                 if (oldPrefixMatch && !finalTitle.startsWith('Lesson')) {
                     finalTitle = `${oldPrefixMatch[1]} ${finalTitle}`;
                 }
                 updatePayload.title = finalTitle;
                 renamedCount++;
             }

             const { error: updErr } = await supabase.from('course_lessons').update(updatePayload).eq('id', lesson.id);
             
             if (updErr) {
               console.log(`❌ Update failed: ${updErr.message}`);
             } else {
               populatedCount++;
               if (needsRenaming) {
                 console.log(`✅ Success! Renamed to -> "${finalTitle.substring(0, 40)}..."`);
               } else {
                 console.log(`✅ Success! Populated content.`);
               }
             }
          } else {
             console.log(`❌ AI completely failed after retries`);
          }
          
          await sleep(1500); 
        } else {
           console.log(`  ⏩ Skipping (Already Unique & Populated): ${lesson.title.substring(0, 40)}`);
        }
      }
    }
  }
  console.log(`\n--- ✨ DAEMON FINISHED. Populated ${populatedCount} lessons, renamed ${renamedCount}. ---`);
}

runFixAndPopulate().catch(console.error);
