const fs = require('fs');

const filePath = `c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx`;

let content = fs.readFileSync(filePath, 'utf8');

const targetOld = `                                    style={{ 
                                        width: block.layoutSettings?.width?.includes('px') ? block.layoutSettings.width : undefined,
                                        height: block.layoutSettings?.height || undefined,
                                    }}`;

const targetNew = `                                    style={{ 
                                        width: block.layoutSettings?.width?.includes('px') ? block.layoutSettings.width : undefined,
                                        height: block.layoutSettings?.height || undefined,
                                        padding: block.layoutSettings?.padding ? \`\${block.layoutSettings.padding}px\` : undefined,
                                        marginBottom: block.layoutSettings?.marginBottom ? \`\${block.layoutSettings.marginBottom}px\` : undefined,
                                        borderRadius: block.layoutSettings?.borderRadius ? \`\${block.layoutSettings.borderRadius}px\` : undefined
                                    }}`;

if (content.includes(targetOld)) {
    content = content.replace(targetOld, targetNew);
    console.log("Renderer Styles applied with string lookup.");
} else {
    console.log("Target block not found precisely, trying index matching.");
    
    // Fallback split logic
    let idx = content.indexOf(`height: block.layoutSettings?.height || undefined,`);
    if (idx !== -1) {
         let sub = content.substring(0, idx + `height: block.layoutSettings?.height || undefined,`.length);
         let tail = content.substring(idx + `height: block.layoutSettings?.height || undefined,`.length);
         content = sub + `\n                                        padding: block.layoutSettings?.padding ? \`\${block.layoutSettings.padding}px\` : undefined,\n                                        marginBottom: block.layoutSettings?.marginBottom ? \`\${block.layoutSettings.marginBottom}px\` : undefined,\n                                        borderRadius: block.layoutSettings?.borderRadius ? \`\${block.layoutSettings.borderRadius}px\` : undefined` + tail;
         console.log("Renderer Styles applied with fallback index.");
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved.");
