const fs = require('fs');
const path = require('path');

const TARGETS = [
    { regex: /Hope Dawah Institute/g, replacement: 'Hope Dawah Institute' },
    { regex: /Hope Dawah/g, replacement: 'Hope Dawah Institute' },
    { regex: /Hope Dawah/gi, replacement: 'Hope Dawah Institute' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile()) {
            if (!fullPath.match(/\.(js|jsx|ts|tsx|html|css|json|md|txt|sql)$/)) continue;
            // Also skip this script itself
            if (fullPath.endsWith('rename.js')) continue;

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
    }
}

processDirectory(__dirname);
console.log("Done");
