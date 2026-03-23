const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\DashboardMobileNav.jsx';
let content = fs.readFileSync(file, 'utf8');

const anchorClass = `className="fixed bottom-0 left-0 right-0 z-50 bg-bg/85 backdrop-blur-2xl border-t border-border dark:border-white/5 pb-[var(--safe-area-bottom)]"`;
const floatClass = `className="fixed bottom-3 left-3 right-3 z-50 bg-slate-900/40 dark:bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[28px] px-2 flex items-center h-16 pointer-events-auto max-w-md mx-auto"`;

if (content.includes(anchorClass)) {
    content = content.replace(anchorClass, floatClass);
} else {
    // Robust split coordinate flawslessly
    const parts = content.split(`className="fixed bottom-0 left-0 right-0 z-50`);
    if (parts.length > 1) {
         content = parts.join(`className="fixed bottom-3 left-3 right-3 z-50 bg-slate-900/40 dark:bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[28px] px-2 flex`);
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log('FLOATING_DOCK OK');
