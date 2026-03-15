const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CurriculumBuilder.jsx', 'utf8');
const lines = content.split('\n');
for (let i = 455; i <= 485; i++) {
    if (lines[i]) {
        console.log(`${i + 1}: ${JSON.stringify(lines[i])}`);
    }
}
