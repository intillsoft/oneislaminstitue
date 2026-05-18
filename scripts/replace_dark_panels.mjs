import fs from 'fs';
import path from 'path';

const TARGET_DIRS = ['src'];

// Replace dark blue background classes and arbitrary dark blue colors with white or light counterparts
const REPLACEMENTS = [
    // Remove dark: prefix and turn to white, or just replace the class entirely
    { regex: /bg-slate-900/g, replacement: 'bg-white' },
    { regex: /bg-slate-950/g, replacement: 'bg-white' },
    { regex: /bg-slate-800/g, replacement: 'bg-white' },
    { regex: /border-slate-800/g, replacement: 'border-slate-200' },
    { regex: /border-slate-700/g, replacement: 'border-slate-200' },
    
    // Arbitrary dark blue hex codes used in the theme
    { regex: /bg-\[#0A1120\]/gi, replacement: 'bg-white' },
    { regex: /bg-\[#13182E\]/gi, replacement: 'bg-white' },
    { regex: /bg-\[#0A1628\]/gi, replacement: 'bg-white' },
    { regex: /bg-\[#050714\]/gi, replacement: 'bg-white' },
    { regex: /bg-\[#0B1121\]/gi, replacement: 'bg-white' },
    { regex: /bg-\[#0A0F1D\]/gi, replacement: 'bg-white' },

    // Since bg-white might have opacity like bg-slate-900/40, replacing it yields bg-white/40 which is valid Tailwind.
];

function processFile(fullPath) {
    if (!fullPath.match(/\.(js|jsx|ts|tsx)$/)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    for (const { regex, replacement } of REPLACEMENTS) {
        content = content.replace(regex, replacement);
    }
    
    if (content !== originalContent) {
        console.log(`Updated dark panels: ${fullPath}`);
        fs.writeFileSync(fullPath, content, 'utf8');
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile()) {
            processFile(fullPath);
        }
    }
}

for (const dir of TARGET_DIRS) {
    const fullPath = path.resolve(dir);
    if (fs.existsSync(fullPath)) {
        processDirectory(fullPath);
    }
}

console.log("Done replacing dark panels with white.");
