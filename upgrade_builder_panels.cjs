const fs = require('fs');

const filePath = `c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx`;

let content = fs.readFileSync(filePath, 'utf8');

// 1. Add State activeBlockId
const stateOld = `const [isAiExpanded, setIsAiExpanded] = useState(false);`;
const stateNew = `const [isAiExpanded, setIsAiExpanded] = useState(false); \n    const [activeBlockId, setActiveBlockId] = useState(null);`;

if (content.includes(stateOld)) {
    content = content.replace(stateOld, stateNew);
    console.log("State updated.");
}

// 2. Add Settings Cog Button into Absolute Floating bar (Line 296-300 range)
const floatingBarOld = `<div {...provided.dragHandleProps} className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-grab active:cursor-grabbing">`;
const floatingBarNew = `<button onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)} className={\`p-1.5 \${activeBlockId === block.id ? 'text-sky-500' : 'text-slate-400 hover:text-sky-400'} transition-colors\`}>\n                                                                           <Icon name="Settings" size={12} />\n                                                                       </button>\n                                                                      <div {...provided.dragHandleProps} className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-grab active:cursor-grabbing">`;

if (content.includes(floatingBarOld)) {
    content = content.replace(floatingBarOld, floatingBarNew);
    console.log("Settings Cog added.");
}

// 3. Update activeBlock container to map padding/margins dynamically
const draggableOld = `                                                            <motion.div 
                                                                layout 
                                                                className={\`bg-white/[0.03] border border-emerald-500/10 rounded-[1.5rem] `;

const draggableNew = `                                                            <motion.div 
                                                                layout 
                                                                className={\`bg-white/[0.03] \${activeBlockId === block.id ? 'ring-2 ring-sky-500 bg-sky-500/5' : 'border border-emerald-500/10'} rounded-[1.5rem] `;

if (content.includes(draggableOld)) {
    content = content.replace(draggableOld, draggableNew);
    console.log("Draggable visual highlight added.");
}


// 4. Upgrade Sidebar Control Drawer (Line 707)
const sidebarRegex = /\{\/\* Right Side Frame[\s\S]*?className=\{`transition-all duration-300 grow-0 \$\{isAiExpanded [\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>\s*<\/div>/;

const sidebarNew = `{/* Right Side Frame: Design Controls Drawer Section Cinema frame flawless sets setup */}
            <div className={\`transition-all duration-300 shrink-0 \${activeBlockId || isAiExpanded ? 'w-full xl:w-80 opacity-100' : 'w-full xl:w-12 h-12 xl:h-auto overflow-hidden xl:opacity-60'} top-6 sticky space-y-4\`}>
                <motion.div layout className="p-5 bg-white/2 rounded-3xl border border-emerald-500/10 backdrop-blur-3xl h-full flex flex-col space-y-4">
                    {activeBlockId ? (
                        /* Design Controls sidebar Elementor framing flawless layout stream natively Cinema */
                        <div className="flex flex-col space-y-5 flex-1">
                            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                                <div className="flex items-center gap-2 text-sky-400">
                                    <Icon name="Sliders" size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Style Panel</span>
                                </div>
                                <button onClick={() => setActiveBlockId(null)} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5"><Icon name="X" size={12} /></button>
                            </div>

                            {/* Options Tabs structure natively flawlessly Setup Cinema flawed streamlines support Cinema flaws flawlessly */}
                            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                                {/* Spacing Section Layout coordinates */}
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase text-slate-500">Spacing & Margin</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-black/20 rounded-xl border border-white/5">
                                            <span className="text-[7px] font-black text-slate-600 block">Padding (Px)</span>
                                            <input 
                                                type="number" 
                                                value={(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings?.padding) || 16}
                                                onChange={e => updateBlock(activeBlockId, { layoutSettings: { ...(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings || {}), padding: parseInt(e.target.value) || 0 } })}
                                                className="bg-transparent text-white font-bold text-xs w-full focus:outline-none focus:text-sky-400"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/20 rounded-xl border border-white/5">
                                            <span className="text-[7px] font-black text-slate-600 block">Margin Botm (Px)</span>
                                            <input 
                                                type="number" 
                                                value={(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings?.marginBottom) || 0}
                                                onChange={e => updateBlock(activeBlockId, { layoutSettings: { ...(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings || {}), marginBottom: parseInt(e.target.value) || 0 } })}
                                                className="bg-transparent text-white font-bold text-xs w-full focus:outline-none focus:text-sky-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Borders setup frame flawed Cinema flawless streamlined structure Cinema */}
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase text-slate-500">Border Styling</span>
                                    <div className="p-2 bg-black/20 rounded-xl border border-white/5">
                                        <span className="text-[7px] font-black text-slate-600 block">Border Radius (Px)</span>
                                        <input 
                                            type="number" 
                                            value={(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings?.borderRadius) || 24}
                                            onChange={e => updateBlock(activeBlockId, { layoutSettings: { ...(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings || {}), borderRadius: parseInt(e.target.value) || 0 } })}
                                            className="bg-transparent text-white font-bold text-xs w-full focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Background overlays structure natively flawless native stream support Cinema flaws flawlessly setup */}
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase text-slate-500">Background Overlay</span>
                                    <div className="flex items-center gap-3 p-2 bg-black/20 rounded-xl border border-white/5">
                                        <input 
                                            type="color" 
                                            value={(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings?.bgColor) || '#ffffff'}
                                            onChange={e => updateBlock(activeBlockId, { layoutSettings: { ...(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings || {}), bgColor: e.target.value } })}
                                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                                        />
                                        <div className="flex-1">
                                            <span className="text-[7px] font-black text-slate-400 block">Tint Fill</span>
                                            <input 
                                                type="range" min="0" max="100" 
                                                value={(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings?.bgOpacity) || 3}
                                                onChange={e => updateBlock(activeBlockId, { layoutSettings: { ...(activeBlocks.find(b => b.id === activeBlockId)?.layoutSettings || {}), bgOpacity: parseInt(e.target.value) } })}
                                                className="w-full accent-emerald-500 h-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* AI Copilot View fallback frame stream flawlessly */
                        <>
                            {!isAiExpanded ? (
                                <button onClick={() => setIsAiExpanded(true)} className="flex items-center justify-center h-full xl:min-h-[300px] w-full text-emerald-500 hover:text-emerald-400 transition-all flex-row xl:flex-col gap-2">
                                     <Icon name="Zap" size={16} className="animate-pulse" />
                                     <span className="text-[8px] font-black uppercase tracking-widest xl:[writing-mode:vertical-lr] xl:rotate-180">Expand AI</span>
                                </button>
                            ) : (
                                <>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                             <div className="flex items-center gap-2 text-emerald-400">
                                                  <Icon name="Zap" size={16} />
                                                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Copilot</span>
                                             </div>
                                             <button onClick={() => setIsAiExpanded(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                                                  <Icon name="X" size={12} />
                                             </button>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed">Auto-generate cinematic content scripts effortlessly based on your overview context triggers sidebar stream.</p>
                                        
                                        <div className="mt-4 space-y-3">
                                             <textarea 
                                                  className="w-full bg-black/30 border border-emerald-500/10 rounded-2xl p-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30 resize-none h-28"
                                                  placeholder={\`Ask AI to generate rich items for this \${PAGE_TEMPLATES[selectedPageIdx]?.label.split('. ')[1]} setup...\`}
                                             />
                                             <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                                                  <Icon name="Sparkles" size={12} /> Generate Content
                                             </button>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-emerald-500/10 space-y-3 mt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-500 uppercase">Page Blocks</span>
                                            <span className="text-xs font-black text-white">{activeBlocks.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-500 uppercase">Est. Minutes</span>
                                            <span className="text-xs font-black text-emerald-500">{activeBlocks.length * 2} m</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </motion.div>
            </div>`;

if (sidebarRegex.test(content)) {
    content = content.replace(sidebarRegex, sidebarNew);
    console.log("Sidebar updated and replaced with Regex.");
} else {
    console.log("Sidebar Regex match FRUSTRATINGLY failed, trying split match.");
    // Split strategy fallback
    const startString = `{/* Right Side Frame: AI Workspace`;
    const endString = `</motion.div>\n            </div>`;
    
    let idx = content.indexOf(startString);
    if (idx !== -1) {
         let sub = content.substring(idx);
         let endIdx = sub.indexOf(endString);
         if (endIdx !== -1) {
              content = content.substring(0, idx) + sidebarNew + sub.substring(endIdx + endString.length);
              console.log("Sidebar updated with manual string lookup.");
         }
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved.");
