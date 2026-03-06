const fs = require('fs');

function fixScript(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Remove the hardcoded IDs from LESSON_DATA
    content = content.replace(/id: \"[a-z0-9-]+\",\n\s+/g, '');
    
    // Replace the specific update query
    content = content.replace(
        /\.update\(\{ content_blocks: finalBlocks, title: item\.title \}\)\s*\.eq\('id', item\.id\)/g,
        `.update({ content_blocks: finalBlocks })\n            .eq('module_id', 'c5727a8e-ef64-4ce3-a075-2cf4d2bac2a4')\n            .eq('title', item.title === 'Major and Minor Shirk' ? 'Types of Shirk' : item.title)`
    );

    // Replace undefined error in console log
    content = content.replace(
        /console\.log\(\`DONE! Seeded to \$\{data\[0\]\.id\}\`\);/g,
        `console.log(\`DONE! Seeded \${item.title}\`);`
    );

    fs.writeFileSync(filename, content, 'utf8');
    console.log('Fixed', filename);
}

fixScript('seed-module-3-part1.js');
fixScript('seed-module-3-part2.js');
