const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

if (content.includes('placeholder="2:153"')) {
    content = content.replace('placeholder="2:153"', 'placeholder="e.g. 2:255"');
    
    // Inject Flex wrapping and Button pre-emptively flawslessly Cinematic Cinematic
    const oldLabel = `<span className="text-[10px] font-black uppercase text-emerald-600">Verse Number</span>`;
    const newLabel = `<div className="flex items-center justify-between">
                                                                                 <span className="text-[10px] font-black uppercase text-emerald-600">Verse Number</span>
                                                                                 <button 
                                                                                     onClick={() => fetchQuranVerse(block.id, block.content?.verse)}
                                                                                     className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-500/20 transition-all active:scale-95"
                                                                                 >
                                                                                     <Icon name="Zap" size={10} /> Fetch
                                                                                 </button>
                                                                               </div>`;
                                                                               
    // Replace only once inside the Quran area
    // Find the exact line range around Quran block
    content = content.replace(oldLabel, newLabel);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('UI_INJECT OK');
} else {
    console.log('TARGET FAILL');
}
