const fs = require('fs');

const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const blockTypesTarget = `{ type: 'quiz', icon: 'HelpCircle', label: 'Knowledge Quiz', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }`;
const blockTypesReplace = `{ type: 'quiz', icon: 'HelpCircle', label: 'Knowledge Quiz', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },\n    { type: 'accordion', icon: 'ChevronDown', label: 'Collapsible', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }`;

const addBlockTarget = `else if (type === 'quiz') { newBlock.question = ''; newBlock.options = ['', '', '', '']; newBlock.correctIndex = 0; }`;
const addBlockReplace = `else if (type === 'quiz') { newBlock.question = ''; newBlock.options = ['', '', '', '']; newBlock.correctIndex = 0; }\n        else if (type === 'accordion') newBlock.content = { title: '', text: '' };`;

const uiTarget = `{block.type === 'text' && (`;
const uiReplace = `{block.type === 'accordion' && (
                                                                         <div className="space-y-4">
                                                                           <input 
                                                                             value={block.content?.title || ''}
                                                                             onChange={e => updateBlockContent(block.id, { title: e.target.value })}
                                                                             className="w-full bg-black/20 border border-emerald-500/10 rounded-xl px-4 py-2 text-sm font-black focus:outline-none text-white"
                                                                             placeholder="Collapsible Title..."
                                                                           />
                                                                           <textarea 
                                                                             value={block.content?.text || ''}
                                                                             onChange={e => updateBlockContent(block.id, { text: e.target.value })}
                                                                             className="w-full h-32 bg-black/20 border border-emerald-500/10 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none text-white"
                                                                             placeholder="Hidden content text (Markdown)..."
                                                                           />
                                                                         </div>
                                                                     )}

                                                                     {block.type === 'text' && (`;

if (content.includes(blockTypesTarget) && content.includes(addBlockTarget) && content.includes(uiTarget)) {
    content = content.replace(blockTypesTarget, blockTypesReplace);
    content = content.replace(addBlockTarget, addBlockReplace);
    content = content.replace(uiTarget, uiReplace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('ACCORDION_BUILDER OK');
} else {
    console.log('TARGET_ACCORDION FAILL');
}

// ------ RENDERER ------
const fileR = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let contentR = fs.readFileSync(fileR, 'utf8');

const rTarget = `        case 'text':`;
const rReplace = `        case 'accordion':
            return (
                <div className="rounded-[1.25rem] bg-white/[0.03] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden group/accordion w-full">
                    <details className="group">
                        <summary className="flex items-center justify-between p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {b.title || 'Accordion Item'}
                            </h3>
                            <div className="text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                <span className="text-xl">↓</span>
                            </div>
                        </summary>
                        <div className="px-5 pb-5 border-t border-slate-100 dark:border-white/[0.03] pt-4">
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {b.text || 'Hidden details.'}
                            </p>
                        </div>
                    </details>
                </div>
            );
        case 'text':`;

if (contentR.includes(rTarget)) {
    contentR = contentR.replace(rTarget, rReplace);
    fs.writeFileSync(fileR, contentR, 'utf8');
    console.log('ACCORDION_RENDERER OK');
} else {
    console.log('TARGET_ACCORDION_RENDERER FAILL');
}
