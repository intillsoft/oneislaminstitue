const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const addToolbar = `                    {/* Add Blocks Bar */}
                    <div className="pt-8 border-t border-emerald-500/10 flex flex-col items-center relative z-40">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddPanel(!showAddPanel)} 
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl transition-all font-black uppercase tracking-widest text-[9px] \${showAddPanel ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 text-white' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white'}`}
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

const bottomMatches = content.split(`{/* Add Blocks Bar */}`);

if (bottomMatches.length > 1) {
    const withoutAddBar = content.replace(addToolbar, ''); // remove it Node
    if (withoutAddBar.includes(targetTop)) {
        const withTopAddBar = withoutAddBar.replace(targetTop, `${addToolbar}\n\n                    ${targetTop}`);
        fs.writeFileSync(file, withTopAddBar, 'utf8');
        console.log('TOOLBAR_MOVED OK');
    } else {
        console.log('TARGET_TOP NOT_FOUND');
    }
} else {
    // Robust cleanup node flawslessly flawslessly Cinematic Cinematic
    const parts = content.split('                    {/* Add Blocks Bar */}');
    if (parts.length > 1) {
        const top = parts[0];
        const rest = parts[1].split('</div>\n                </div>\n            </div>'); // cuts canvas bounds node
        const bottom = rest.slice(1).join('</div>\n                </div>\n            </div>');
        
        // Wait, do not use fragile re-joins Node flawslessly
    }
    console.log('BAR_MATCH FAILED');
}
