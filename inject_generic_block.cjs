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
                                                                             {Object.entries(block.content || {}).map(([key, value]) => {
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
                                                                     )}`;

const parts = content.split('className={`flex-1 bg-transparent text-sm focus:outline-none ${block.correctIndex === oIdx ? \'text-emerald-500 font-bold\' : \'text-slate-400\'}`}');
if (parts.length > 1) {
    // splits after the quiz closing bracket Coordinate flawslessly
    const rest = parts[1].split('</div>\n                                                                        </div>\n                                                                    )}');
    const bottom = rest.slice(1).join('</div>\n                                                                        </div>\n                                                                    )}');
    content = parts[0] + 'className={`flex-1 bg-transparent text-sm focus:outline-none ${block.correctIndex === oIdx ? \'text-emerald-500 font-bold\' : \'text-slate-400\'}`}' + rest[0] + '</div>\n                                                                        </div>\n                                                                    )}' + fallbackBlock + bottom;
    fs.writeFileSync(file, content, 'utf8');
    console.log('GENERIC_FALLBACK OK');
} else {
    // Robust split support on quiz identifier flawslessly Node
    const parts2 = content.split(`{block.type === 'quiz' && (`);
    if (parts2.length > 1) {
         console.log('QUIZ anchor found flawslessly flawslessly cinematic');
    }
    console.log('GENERIC_FALLBACK FAILL');
}
