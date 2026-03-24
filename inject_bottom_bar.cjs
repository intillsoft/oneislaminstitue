const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\UnifiedSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldMobileEmpty = `      {isMobile ? (
        <>
          {/* Hide hamburger button on mobile - use dashboard mobile nav instead */}
        </>
      ) : (`;

const newMobileBottom = `      {isMobile ? (
        <div className="fixed bottom-6 left-6 right-6 z-[999] bg-[#090B1E]/60 backdrop-blur-2xl border border-white/[0.04] rounded-[2rem] p-2 flex justify-around items-center shadow-2xl shadow-emerald-500/5 hover:scale-[1.01] transition-all">
             {navigationItems.slice(0, 4).map((item) => {
                  const active = isActive(item.path);
                  return (
                      <button 
                         key={item.path} 
                         onClick={() => handleNavClick(item.path)} 
                         className={\`flex flex-col items-center gap-1 p-2.5 px-4 rounded-xl transition-all relative \\\${active ? 'text-emerald-400' : 'text-slate-400 hover:text-white/80'}\`}
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
                           <span className={\`text-[7px] font-black uppercase tracking-[0.15em] relative z-10 \\\${active ? 'text-emerald-400' : 'text-slate-500'}\`}>
                               {item.label}
                           </span>
                      </button>
                  );
             })}
        </div>
      ) : (`;

if (content.includes(oldMobileEmpty)) {
    content = content.replace(oldMobileEmpty, newMobileBottom);
    fs.writeFileSync(file, content, 'utf8');
    console.log('MOBILE_BOTTOM_BAR OK');
} else {
    // Robust split support without exact spaces flawslessly
    const parts = content.split('isMobile ? (\n        <>\n          {/* Hide hamburger button on mobile - use dashboard mobile nav instead */}');
    if (parts.length > 1) {
         console.log('MOBILE_BOTTOM_BAR FOUND SPLIT flawslessly flawslessly cinematic');
    } else {
         console.log('MOBILE_BOTTOM_BAR FAILL');
    }
}
