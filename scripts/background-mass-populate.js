// background-mass-populate.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getGroqContent(prompt) {
  let attempts = 0;
  let delay = 3000; 

  while (attempts < 5) {
    try {
      const rawResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.6,
        })
      });

      if (rawResponse.status === 429) {
         console.log(`\n  ⚠️ Rate Limited (429). Sleeping ${delay/1000}s and retrying...`);
         await sleep(delay);
         attempts++;
         delay *= 2; // Exponential backoff
         continue;
      }

      if (!rawResponse.ok) {
         console.error(`Status ${rawResponse.status}`);
         return null;
      }

      const completion = await rawResponse.json();
      return JSON.parse(completion.choices[0].message.content);
    } catch (err) {
      console.error(`Groq error: ${err.message}`);
      await sleep(delay);
      attempts++;
    }
  }
  return null;
}

async function fixLesson(courseTitle, moduleTitle, lesson, allLessonTitles) {
  const needsTitleFix = lesson.title.includes('Deep Dive') || 
                        lesson.title.includes('Attributes of Allah') || 
                        lesson.title.includes('Cultivating Mindfulness');

  const isIntegration = lesson.title.includes('Weekly Integration Task');

  const systemInstructions = `
You are an expert Islamic curriculum developer. Cite authentic Quranic Verses (Surah:Verse) and Sahih Hadith.
You must generate a strict JSON object containing a FULL 5-page curriculum for this specific lesson.

${needsTitleFix ? `CRITICAL: The current title "${lesson.title}" is a generic placeholder. You MUST invent a BRAND NEW, unique, educational lesson title following the sequence of previous topics in "${moduleTitle}". List previous lessons for context: ${JSON.stringify(allLessonTitles)}. Return the new title in "new_lesson_title".` : `Return "${lesson.title}" as "new_lesson_title".`}

Image URL structure MUST use Pollinations.ai horizontal banner limits:
https://image.pollinations.ai/prompt/[prompt_no_spaces_or_special]?width=1200&height=600&nologo=true
The prompt MUST be "realistic, photographic, natural, horizontal banner, landscape, no people/faces".

5 Pages:
Page 1: Overview (Title, Goal, Key Questions, Time, Terms).
Page 2: Video (Intro text, placeholder empty video is fine, NO real link required if layout sets generic).
Page 3: Guide (Summary, Deeper Explanations, authenticated Quran with citations, authentic Hadith).
Page 4: Reflection (5 unique prompts with empty inputs).
Page 5: Quiz (5 MCQ with 4 options and correctIndex 0-3).

JSON Layout:
{
  "new_lesson_title": "Lesson X: [Title]",
  "pages": [
    {
       "page_number": 1, "page_type": "overview", "completion_required": true,
       "content": [ { "type": "text", "content": "# ..." } ]
    }
  ]
}
`;

  const parsed = await getGroqContent(systemInstructions);
  if (!parsed || !parsed.pages) return null;

  // Set randomized unique IDs
  parsed.pages.forEach(p => {
    p.content.forEach(c => c.id = genId());
  });

  return parsed;
}

async function run() {
  console.log('--- DAEMON RUNNING: SWEEPING FOR GENERIC PLACEHOLDERS ---');

  const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');

  for (const course of courses) {
    console.log(`Course: ${course.title}`);
    const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', course.id).order('sort_order');

    for (const mod of modules) {
      const { data: lessons } = await supabase.from('course_lessons').select('id, title, sort_order, content_data').eq('module_id', mod.id).order('sort_order');
      const allTitles = (lessons || []).map(l => l.title);

      for (const les of lessons) {
        const needsPopulating = les.title.includes('Deep Dive') || les.title.includes('Attributes of Allah') || les.title.includes('Social Justice') || (les.content_data?.pages || []).length === 0;

        if (needsPopulating && les.sort_order > 3 && les.sort_order < 10) {
          process.stdout.write(`  [${mod.title.substring(0, 15)}] Fix ${les.sort_order}...`);
          
          let result = await fixLesson(course.title, mod.title, les, allTitles);
          
          if (result && result.pages) {
            const updData = { page_count: 5, is_time_gated: false, pages: result.pages };
            const payload = { content_data: updData };

            const oldPrefixMatch = les.title.match(/^(Lesson \d+:)/);
            let finalTitle = result.new_lesson_title || les.title;
            if (oldPrefixMatch && !finalTitle.startsWith('Lesson')) {
                finalTitle = `${oldPrefixMatch[1]} ${finalTitle}`;
            }
            if (result.new_lesson_title) {
                payload.title = finalTitle;
            }

            const { error } = await supabase.from('course_lessons').update(payload).eq('id', les.id);
            if (!error) console.log(` ✅ Populated -> "${finalTitle.substring(0, 30)}"`);
            else console.log(` ❌ Update error`);
          } else {
             console.log(` ❌ Failed`);
          }
          await sleep(2000);
        }
      }
    }
  }
}

run().catch(console.error);
