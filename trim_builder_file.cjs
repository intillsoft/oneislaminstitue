const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = 'export default LessonBlockBuilder;';
const parts = content.split(target);

if (parts.length > 1) {
    const cleanContent = parts[0] + target + '\n';
    fs.writeFileSync(file, cleanContent, 'utf8');
    console.log('FILE_TRIMMED_CLEAN OK');
} else {
    console.log('TARGET_EXPORT_NOT_FOUND');
}
