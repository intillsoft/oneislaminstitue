const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `width: block.layoutSettings?.width?.includes('px') ? block.layoutSettings.width : undefined,`;
const replace = `width: block.layoutSettings?.width?.includes('px') ? block.layoutSettings.width : undefined,
                                                                height: block.layoutSettings?.height || undefined,`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('REPLACEY OK');
} else {
    console.log('TARGET FAILL');
}
