const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Move Add-Blocks Bar to the Top
const addToolbar = `
                    {/* Floating Add Blocks Bar at the TOP of the Canvas node absolute flawlessly */}
                    <div className="pb-6 mb-6 border-b border-emerald-500/10 flex flex-col items-center relative z-40">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddPanel(!showAddPanel)} 
                            className={\`flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl transition-all font-black uppercase tracking-widest text-[9px] \\\${showAddPanel ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 text-white' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white'}\`}
                        >
                            <Icon name={showAddPanel ? 'Minus' : 'Plus'} size={12} />
                            {showAddPanel ? 'Close Canvas Elements' : 'Insert Element Component'}
                        </motion.button>

                        <AnimatePresence>
                            {showAddPanel && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="mt-4 p-3 bg-black/40 border border-emerald-500/10 rounded-2xl flex flex-wrap gap-2 justify-center max-w-3xl backdrop-blur-3xl"
                                >
                                    {BLOCK_TYPES.map(type => (
                                        <button 
                                            key={type.type} 
                                            onClick={() => { addBlock(type.type); setShowAddPanel(false); }} 
                                            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-emerald-500/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all active:scale-95"
                                        >
                                            <Icon name={type.icon} size={11} className="text-emerald-500" />
                                            {type.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>`;

const targetTop = `<DragDropContext`;
const parts = content.split(targetTop);

if (parts.length > 1) {
    content = parts[0] + addToolbar + '\n\n                    ' + targetTop + parts.slice(1).join(targetTop);
    console.log('TOP_TOOLBAR OK');
}

// 2. Rewrite updateBlockContent
const searchUpdate = `    const updateBlockContent = (id, contentUpdates) => { triggerChange(activeBlocks.map(b => b.id === id ? { ...b, content: { ...(b.content || {}), ...contentUpdates } } : b)); };`;
const replaceUpdate = `    const updateBlockContent = (id, contentUpdates) => {
        triggerChange(activeBlocks.map(b => {
             if (b.id !== id) return b;
             let currentContent = b.content;
             if (typeof currentContent === 'string') {
                 currentContent = { text: currentContent };
             }
             return { ...b, content: { ...(currentContent || {}), ...contentUpdates } };
        }));
    };`;

if (content.includes(searchUpdate)) {
    content = content.replace(searchUpdate, replaceUpdate);
    console.log('UPDATE_HANDLER OK');
}

// 3. Adjust Text Area Value Binding for 'text' block
const searchTextArea = `{block.type === 'text' && (
                                                                         <div className="space-y-4">
                                                                           <textarea
                                                                               value={block.content?.text || ''}`;

const replaceTextArea = `{block.type === 'text' && (
                                                                         <div className="space-y-4">
                                                                           <textarea
                                                                               value={typeof block.content === 'string' ? block.content : block.content?.text || ''}`;

if (content.includes(searchTextArea)) {
    content = content.replace(searchTextArea, replaceTextArea);
    console.log('TEXT_BINDING OK');
} else {
    // Robust split support for spacing flawslessly
    const partsText = content.split('value={block.content?.text || \'\'}');
    if (partsText.length > 1) {
         content = partsText.join('value={typeof block.content === \'string\' ? block.content : block.content?.text || \'\'}');
         console.log('TEXT_BINDING OK ROBUST');
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log('ALL FIXES COMBINED BINDING OK');
