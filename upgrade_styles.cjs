const fs = require('fs');

const filePath = `c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx`;

let content = fs.readFileSync(filePath, 'utf8');

const targetOld = `                                                                 style={{
                                                                     height: block.layoutSettings?.height || 'auto'
                                                                 }}`;

const targetNew = `                                                                 style={{
                                                                     height: block.layoutSettings?.height || 'auto',
                                                                     padding: block.layoutSettings?.padding ? \`\${block.layoutSettings.padding}px\` : undefined,
                                                                     marginBottom: block.layoutSettings?.marginBottom ? \`\${block.layoutSettings.marginBottom}px\` : undefined,
                                                                     borderRadius: block.layoutSettings?.borderRadius ? \`\${block.layoutSettings.borderRadius}px\` : undefined
                                                                 }}`;

if (content.includes(targetOld)) {
    content = content.replace(targetOld, targetNew);
    console.log("Styles applied.");
} else {
    console.log("Target block not found precisely, trying index matching.");
    
    // Fallback split logic
    let idx = content.indexOf(`height: block.layoutSettings?.height || 'auto'`);
    if (idx !== -1) {
         let sub = content.substring(0, idx + `height: block.layoutSettings?.height || 'auto'`.length);
         let tail = content.substring(idx + `height: block.layoutSettings?.height || 'auto'`.length);
         content = sub + `,\n                                                                     padding: block.layoutSettings?.padding ? \`\${block.layoutSettings.padding}px\` : undefined,\n                                                                     marginBottom: block.layoutSettings?.marginBottom ? \`\${block.layoutSettings.marginBottom}px\` : undefined,\n                                                                     borderRadius: block.layoutSettings?.borderRadius ? \`\${block.layoutSettings.borderRadius}px\` : undefined` + tail;
         console.log("Styles applied with fallback index.");
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved.");
