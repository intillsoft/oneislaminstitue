import fs from 'fs';
import path from 'path';

const TARGET_DIRS = ['src'];

const REPLACEMENTS = [
    { regex: /bg-\[#059669\]/g, replacement: 'bg-workflow-primary' },
    { regex: /text-\[#059669\]/g, replacement: 'text-workflow-primary' },
    { regex: /border-\[#059669\]/g, replacement: 'border-workflow-primary' },
    { regex: /from-\[#059669\]/g, replacement: 'from-workflow-primary' },
    { regex: /to-\[#059669\]/g, replacement: 'to-workflow-primary' },
    { regex: /ring-\[#059669\]/g, replacement: 'ring-workflow-primary' },
    // Replace hex in JS/CSS files where inline styles or objects are used
    { regex: /#059669/gi, replacement: '#0046FF' }
];

function processFile(fullPath) {
    if (!fullPath.match(/\.(js|jsx|ts|tsx|html|css|json|md|txt|cjs|mjs)$/)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    for (const { regex, replacement } of REPLACEMENTS) {
        content = content.replace(regex, replacement);
    }
    
    if (content !== originalContent) {
        console.log(`Updated colors: ${fullPath}`);
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

console.log("Done replacing hardcoded green colors.");
