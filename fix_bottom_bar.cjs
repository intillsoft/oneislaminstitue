const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\UnifiedSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{isMobile\s*\?\s*\(\s*<>\s*\{\/\*\s*Hide\s*hamburger[^*]*\*\/\}\s*<\/>\s*\)\s*:\s*\(/i;

const newMobileBottom = `{isMobile ? (
        <div className="fixed bottom-6 left-5 right-5 z-[999] bg-[#090B1E]/60 backdrop-blur-2xl border border-white/[0.04] rounded-[1.8rem] p-2 flex justify-around items-center shadow-2xl shadow-emerald-500/5 hover:scale-[1.01] transition-all">
             {navigationItems.slice(0, 4).map((item, i) => {
                  const active = isActive(item.path);
                  return (
                      <button 
                         key={i} 
                         onClick={() => handleNavClick(item.path)} 
                         className={\`flex flex-col items-center gap-1 p-2.5 px-3.5 rounded-xl transition-all relative \\\${active ? 'text-emerald-400' : 'text-slate-400 hover:text-white/80'}\`}
                      >
                           {active && (
                               <motion.div 
                                  layoutId="mobileNav" 
                                  className="absolute inset-0 bg-emerald-500/5 rounded-xl border border-emerald-500/10 shadow-sm" 
                                  transition={{ duration: 0.2 }}
                               />
                           )}
                           <div className={\`relative z-10 \\\${active ? 'scale-110' : ''} transition-transform\`}>
                               <Icon name={item.icon} size={18} className={active ? 'animate-pulse-elite text-emerald-500' : 'text-slate-400'} />
                           </div>
                           <span className={\`text-[7px] font-black uppercase tracking-[0.14em] relative z-10 \\\${active ? 'text-emerald-400' : 'text-slate-500'}\`}>
                               {item.label}
                           </span>
                      </button>
                  );
             })}
        </div>
      ) : (`;

if (regex.test(content)) {
    content = content.replace(regex, newMobileBottom);
    fs.writeFileSync(file, content, 'utf8');
    console.log('MOBILE_BOTTOM_BAR OK REGEX');
} else {
    // Robust split support on DndProvider flawslessly
    const parts = content.split('<DndProvider');
    if (parts.length > 1) {
         console.log('DndProvider Found coordinate coordinate flawslessly flawslessly cinematic');
         const top = parts[0];
         const rest = parts[1];
         // Safe split-replace on the exact index flawlessly
         const splitRegex = /\{isMobile\s*\?\s*\(\s*<>\s*\{\/\*/i;
         if (splitRegex.test(rest)) {
              console.log('INNER_MATCHED OK flawslessly');
         }
    }
    console.log('MOBILE_BOTTOM_BAR FAILL REGEX');
}
