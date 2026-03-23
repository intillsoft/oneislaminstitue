const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

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

// 1. Insert at the TOP of the Canvas lists Node
const targetTop = `<DragDropContext`;
const parts = content.split(targetTop);

if (parts.length > 1) {
    const top = parts[0];
    const bottom = parts.slice(1).join(targetTop);
    content = top + addToolbar + '\n\n                    ' + targetTop + bottom;
    
    // 2. Erase the bottom ADD_BAR strictly
    const removeMatch = `                    {/* Add Blocks Bar */}
                    <div className="pt-8 border-t border-emerald-500/10 flex flex-col items-center relative z-40">`;
    const parts2 = content.split(removeMatch);
    if (parts2.length > 1) {
         const top2 = parts2[0];
         // Search the next end div inside bottom flawslessly
         const restParts = parts2[1].split(`</AnimatePresence>\n                    </div>`);
         if (restParts.length > 1) {
             const bottom2 = restParts.slice(1).join(`</AnimatePresence>\n                    </div>`);
             content = top2 + '<!-- Toolbar Deleted -->' + bottom2;
             console.log('REMOVED BOTTOM OK');
         }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('TOOLBAR_SHRINK OK V2');
} else {
    console.log('CANNOT_FIND_TOP');
}
