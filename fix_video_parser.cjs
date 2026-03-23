const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `else videoId = inputUrl.split('?')[0].trim();`;
const replace = `else videoId = '';`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('GET_EMBED_URL_FALLBACK OK');
} else {
    // Robust regex support Coordinate flawslessly
    const regex = /else videoId = inputUrl\.split\('\?'\)\[0\]\.trim\(\);/;
    if (regex.test(content)) {
         content = content.replace(regex, `else videoId = '';`);
         fs.writeFileSync(file, content, 'utf8');
         console.log('GET_EMBED_URL_FALLBACK OK REGEX');
    } else {
         console.log('GET_EMBED_URL_FALLBACK FAILL');
    }
}
