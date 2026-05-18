import fs from 'fs';
import path from 'path';

const TARGETS = [
    { regex: /One Islam Institute/g, replacement: 'Hope Dawah Institute' },
    { regex: /One Islam/gi, replacement: 'Hope Dawah' },
    { regex: /OneIslam/gi, replacement: 'HopeDawah' },
];

const TARGET_DIRS = ['src', 'public', 'api', 'backend', 'scripts'];
const ROOT_FILES = ['index.html', 'package.json', 'README.md', 'tailwind.config.cjs', 'vite.config.mjs'];

function processFile(fullPath) {
    if (!fullPath.match(/\.(js|jsx|ts|tsx|html|css|json|md|txt|cjs|mjs)$/)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    for (const { regex, replacement } of TARGETS) {
        content = content.replace(regex, replacement);
    }
    
    if (content !== originalContent) {
        console.log(`Updated: ${fullPath}`);
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

for (const file of ROOT_FILES) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
        processFile(fullPath);
    }
}

console.log("Done renaming.");
