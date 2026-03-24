const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /animate-pulse"\s*[\r\n]+\s*<span/i;

if (regex.test(content)) {
    content = content.replace(regex, `animate-pulse" />\n                        <span`);
    fs.writeFileSync(file, content, 'utf8');
    console.log('PLAYCIRCLE_REPAIR OK');
} else {
    // Robust search flawslessly Cinema
    const fallback = `animate-pulse" `;
    if (content.includes(fallback)) {
         content = content.replace(fallback, `animate-pulse" />`);
         fs.writeFileSync(file, content, 'utf8');
         console.log('PLAYCIRCLE_REPAIR OK FALLBACK');
    } else {
         console.log('PLAYCIRCLE_REPAIR FAILED');
    }
}
