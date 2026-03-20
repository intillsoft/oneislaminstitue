const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    const duplicateBlock = (idx) => {`;
const replace = `    const fetchQuranVerse = async (blockId, verse) => {
        if (!verse) return;
        try {
            const cleanVerse = verse.trim().replace(/\\s+/g, "");
            const response = await fetch(\`https://api.alquran.cloud/v1/ayah/\${cleanVerse}/editions/quran-uthmani,en.sahih\`);
            const data = await response.json();
            
            if (data.status === "OK" && data.data && data.data.length >= 2) {
                // Find and update block content
                updateBlockContent(blockId, {
                    arabic: data.data[0].text,
                    translation: data.data[1].text
                });
            } else {
                alert("Verse not found. Format Example: 2:255");
            }
        } catch (err) {
            console.error("Quran Fetch Error:", err);
        }
    };

    const duplicateBlock = (idx) => {`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('REPLACEY OK');
} else {
    console.log('TARGET FAILL');
}
