const fs = require('fs');
const file = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\LessonBlockBuilder.jsx';
let content = fs.readFileSync(file, 'utf8');

const parts = content.split('if (pages.length > 0 && !pages[0].hasOwnProperty(\'page_number\')) {');
if (parts.length > 1) {
    const top = parts[0];
    
    // Split on completion array trigger flawslessly Node
    const rest = parts[1].split('];');
    const bottom = rest.slice(1).join('];'); // preserve everything after Array flawslessly
    
    const replaceCall = `
              return [
                { page_number: 1, page_type: 'overview', content: pages },
                { page_number: 2, page_type: 'video', content: [] },
                { page_number: 3, page_type: 'companion_guide', content: [] },
                { page_number: 4, page_type: 'reflection_journal', content: [] },
                { page_number: 5, page_type: 'knowledge_check', content: [] }
              ];`;
            
    content = top + `if (pages.length > 0 && !pages[0].hasOwnProperty('page_number')) {` + replaceCall + bottom;
    fs.writeFileSync(file, content, 'utf8');
    console.log('FALLBACK_SHIFT OK V2');
} else {
    console.log('FALLBACK_SHIFT FAILL V2');
}
