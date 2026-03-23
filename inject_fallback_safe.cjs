const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const fallbackBlock = `
                                                                     {![
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
                                                                             ) : typeof block.content === 'object' && block.content !== null && Object.entries(block.content || {}).map(([key, value]) => {
                                                                                 if (typeof value === 'string') {
                                                                                     return (
                                                                                         <div key={key} className="space-y-1">
                                                                                             <span className="text-[9px] font-black uppercase text-emerald-500">{key}</span>
                                                                                             <textarea 
                                                                                                 value={value}
                                                                                                 onChange={e => updateBlockContent(block.id, { [key]: e.target.value })}
                                                                                                 className="w-full bg-black/20 border border-emerald-500/10 rounded-xl p-3 text-xs focus:outline-none text-white leading-relaxed resize-y"
                                                                                                 rows={Math.min(10, Math.max(2, value.length / 50))}
                                                                                             />
                                                                                         </div>
                                                                                     );
                                                                                 }
                                                                                 if (Array.isArray(value) && typeof value[0] === 'string') {
                                                                                     return (
                                                                                         <div key={key} className="space-y-1">
                                                                                             <span className="text-[9px] font-black uppercase text-emerald-500">{key}</span>
                                                                                             <div className="space-y-2">
                                                                                                 {value.map((item, i) => (
                                                                                                     <input 
                                                                                                         key={i}
                                                                                                         value={item}
                                                                                                         onChange={e => {
                                                                                                             const newArr = [...value];
                                                                                                             newArr[i] = e.target.value;
                                                                                                             updateBlockContent(block.id, { [key]: newArr });
                                                                                                         }}
                                                                                                         className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
                                                                                                     />
                                                                                                 ))}
                                                                                             </div>
                                                                                         </div>
                                                                                     );
                                                                                 }
                                                                                 return null;
                                                                             })}
                                                                         </div>
                                                                     )}
`;

const targetAnchor = `{block.type === 'quiz' && (`;
const parts = content.split(targetAnchor);

if (parts.length > 1) {
    const top = parts[0];
    const rest = parts.slice(1).join(targetAnchor);
    content = top + fallbackBlock + '\n                                                                     ' + targetAnchor + rest;
    fs.writeFileSync(file, content, 'utf8');
    console.log('GENERIC_FALLBACK_APPENDED OK');
} else {
    console.log('QUIZ_ANCHOR_NOT_FOUND');
}
