// scripts/populate-compass-mod1-verbatim-parsed.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;

async function run() {
    const rawContent = fs.readFileSync('scripts/mod1-verbatim-input.txt', 'utf-8');


    const sections = rawContent.split('## LESSON').filter(s => s.trim().length > 10);
    const lessonsData = [];

    for (const section of sections) {
        // Parse Title
        const titleMatch = section.match(/^ ([\d\.]+): (.*?)(\r|\n)/);
        const titleText = titleMatch ? `Lesson ${titleMatch[1]}: ${titleMatch[2]}` : "Untitled";
        const isIntegration = titleText.includes('Weekly Integration Task');

        const pages = [];
        const pageChunks = section.split(/\*\*Page \d+ –/); // Split by Page 1 -, Page 2 -
        
        // chunk[0] is usually the header/title spacer
        for (let i = 1; i < pageChunks.length; i++) {
             const chunk = pageChunks[i];
             const header = chunk.split('\n')[0].trim();
             const body = chunk.substring(chunk.indexOf('\n')).trim();

             let type = 'overview';
             if (header.includes('Video')) type = 'video';
             if (header.includes('Companion')) type = 'companion_guide';
             if (header.includes('Reflection')) type = 'reflection_journal';
             if (header.includes('Knowledge')) type = 'knowledge_check';

             const content = [];
             
             if (type === 'overview') {
                 content.push({ id: genId(), type: 'image', content: { url: `https://image.pollinations.ai/prompt/realistic%20islamic%20horizontal%20concept%20banner?width=1200&height=600&nologo=true` } });
                 content.push({ id: genId(), type: 'text', content: `# ${titleText}\n\n${body}` });
             } else if (type === 'video') {
                 const embedMatch = body.match(/URL: `(.*?)`/);
                 const embedUrl = embedMatch ? embedMatch[1] : "#";
                 content.push({ id: genId(), type: 'video', content: { url: embedUrl } });
                 content.push({ id: genId(), type: 'text', content: body });
             } else if (type === 'companion_guide') {
                 // Split into sections by trigger words
                 const guideParts = body.split(/\n- \*\*/);
                 for (const p of guideParts) {
                    if (p.trim().length < 5) continue;
                    const cleaned = p.startsWith('**') ? p : `**${p}`;
                    if (cleaned.includes('Quranic Verses')) {
                         const verses = cleaned.split('•').filter(v => v.trim().length > 10);
                         verses.forEach(v => {
                              const match = v.match(/(?:Surah)\s+(.*?)\s+–\s+“(.*?)”/);
                              if (match) content.push({ id: genId(), type: 'quran', content: { reference: match[1].trim(), translation: match[2].trim() } });
                              else content.push({ id: genId(), type: 'text', content: `• ${v.trim()}` });
                         });
                    } else if (cleaned.includes('Hadith References')) {
                         const references = cleaned.split('•').filter(r => r.trim().length > 10);
                         references.forEach(r => {
                              const match = r.match(/“(.*?)”\s+\((.*?)\)/);
                              if (match) content.push({ id: genId(), type: 'hadith', content: { reference: match[2].trim(), translation: match[1].trim() } });
                              else content.push({ id: genId(), type: 'text', content: `• ${r.trim()}` });
                         });
                    } else {
                         content.push({ id: genId(), type: 'text', content: cleaned.trim() });
                    }
                 }
             } else if (type === 'reflection_journal') {
                 content.push({ id: genId(), type: 'text', content: "## Reflection Journal" });
                 const prompts = body.split(/\d+\.\s+/).filter(p => p.trim().length > 2);
                 prompts.forEach(p => {
                     content.push({ id: genId(), type: 'reflection', content: { prompt: p.trim() } });
                 });
             } else if (type === 'knowledge_check') {
                 content.push({ id: genId(), type: 'text', content: "## Knowledge Check" });
                 const questions = body.split(/\d+\.\s+/).filter(q => q.trim().length > 10);
                 questions.forEach(q => {
                      const lines = q.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                      const quesText = lines[0];
                      const options = [];
                      let correctIndex = 0;
                      lines.forEach((l, idx) => {
                          if (l.startsWith('A)') || l.startsWith('B)') || l.startsWith('C)') || l.startsWith('D)')) {
                              options.push(l.substring(2).trim());
                          }
                          if (l.includes('Correct:')) {
                              const ansChar = l.split(':')[1].trim();
                              if (ansChar === 'B') correctIndex = 1;
                              if (ansChar === 'C') correctIndex = 2;
                              if (ansChar === 'D') correctIndex = 3;
                          }
                      });
                      content.push({ id: genId(), type: 'quiz', content: { question: quesText, options, correctIndex } });
                 });
             } else {
                 content.push({ id: genId(), type: 'text', content: body });
             }

             // Map Quran citations
             if (type === 'companion_guide') {
                 // Double check and split into Quran or Hadith blocks if keywords found
             }

             pages.push({
                 page_number: i,
                 page_type: type,
                 completion_required: true,
                 content
             });
        }

        lessonsData.push({
            title: titleText,
            is_time_gated: isIntegration,
            pages
        });
    }

    // Push to Supabase
    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', compass.id).order('sort_order');
    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', modules[0].id).order('sort_order');

    for (let i = 0; i < lessonsData.length; i++) {
        const l = lessonsData[i];
        const target = dbLessons[i];
        if (!target) continue;

        console.log(`Verbatim Populating: ${l.title}`);
        await supabase.from('course_lessons').update({
            title: l.title,
            content_data: { page_count: 5, is_time_gated: l.is_time_gated, pages: l.pages }
        }).eq('id', target.id);
        console.log(`✅ Saved ${l.title}`);
    }
}

run().catch(console.error);
