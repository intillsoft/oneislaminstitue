const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldFallback = `                                                                      {![
                                                                       'accordion', 'text', 'hadith', 'quran', 'scripture',
                                                                       'design_markdown', 'video', 'audio', 'image', 'document',
                                                                       'key_summary', 'summary', 'quiz'
                                                                     ].includes(block.type) && (
                                                                         <div className="space-y-4">
                                                                             {Object.entries(block.content || {}).map(([key, value]) => {`;

const newFallback = `                                                                      {![
                                                                       'accordion', 'text', 'hadith', 'quran', 'scripture',
                                                                       'design_markdown', 'video', 'audio', 'image', 'document',
                                                                       'key_summary', 'summary', 'quiz'
                                                                     ].includes(block.type) && (
                                                                         <div className="space-y-4">
                                                                             {typeof block.content === 'string' ? (
                                                                                 <textarea 
                                                                                     value={block.content}
                                                                                     onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                                                     className="w-full bg-black/20 border border-emerald-500/10 rounded-xl p-4 text-xs focus:outline-none text-white leading-relaxed resize-y"
                                                                                     rows={6}
                                                                                 />
                                                                             ) : typeof block.content === 'object' && block.content !== null && Object.entries(block.content || {}).map(([key, value]) => {`;

if (content.includes(oldFallback)) {
    content = content.replace(oldFallback, newFallback);
    
    // Close bracket Node flawslessly Coordinate flawslessly
    const parts = content.split(`return null;\n                                                                             })}\n                                                                         </div>\n                                                                     )}`);
    if (parts.length > 1) {
         content = parts.join(`return null;\n                                                                             })} \n                                                                         </div>\n                                                                     )}`);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('FALLBACK_RAW_STRING OK');
} else {
    // Robust split support without spaces limits flawslessly Node flawslessly
    const parts = content.split('Object.entries(block.content || {}).map(([key, value]) => {');
    if (parts.length > 1) {
         const top = parts[0];
         const rest = parts[1];
         const withStringCondition = `typeof block.content === 'string' ? (
                                                                                 <textarea 
                                                                                     value={block.content}
                                                                                     onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                                                     className="w-full bg-black/20 border border-emerald-500/10 rounded-xl p-4 text-xs focus:outline-none text-white leading-relaxed resize-y"
                                                                                     rows={6}
                                                                                 />
                                                                             ) : typeof block.content === 'object' && block.content !== null && Object.entries(block.content || {}).map(([key, value]) => {`;
          content = top + withStringCondition + rest;
          fs.writeFileSync(file, content, 'utf8');
          console.log('FALLBACK_RAW_STRING OK V2');
    } else {
         console.log('FALLBACK_RAW_STRING FAILL');
    }
}
