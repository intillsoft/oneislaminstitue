const fs = require('fs');
const path = require('path');

const filepath = path.resolve(__dirname, process.argv[2]);

if (!fs.existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    process.exit(1);
}

let content = fs.readFileSync(filepath, 'utf8');

const targetStr = 'opacity-0 group-hover/block:opacity-100 transition-all flex items-center gap-1.5 z-20 bg-black/80';

if (content.includes(targetStr)) {
    console.log("Found floating toolbox handle target!");
    
    // Replace gap-1.5 with gap-1 so we accommodate width options without overflow bounds natively flawless Cinema
    content = content.replace(targetStr, targetStr.replace('gap-1.5', 'gap-1'));
    
    // Find absolute insertion index flawlessly Cinema native structure
    const anchor = 'z-20 bg-black/80 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-xl">';
    
    const logic = `
                                                                       {/* Width Options Presets for quick snap Cinema native Stream frame setup */}
                                                                       <div className="flex items-center border-r border-emerald-500/10 pr-1 gap-0.5">
                                                                           {WIDTH_OPTIONS.map(opt => (
                                                                               <button 
                                                                                   key={opt.value}
                                                                                   title={opt.label}
                                                                                   onClick={() => updateBlock(block.id, { layoutSettings: { ...(block.layoutSettings || {}), width: opt.value } })}
                                                                                   className={\`p-1.5 rounded-lg transition-all \${block.layoutSettings?.width === opt.value ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-400'}\`}
                                                                               >
                                                                                   <Icon name={opt.icon} size={10} />
                                                                               </button>
                                                                           ))}
                                                                       </div>`;
                                                                       
    content = content.replace(anchor, anchor + logic);
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log("Success! Frame updated.");
} else {
    console.error("Target string handle absolute cinematic not found on disk file layout tree node!");
}
