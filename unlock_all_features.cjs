const fs = require('fs');

const lessonViewFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\LessonView.jsx';
let lessonViewContent = fs.readFileSync(lessonViewFile, 'utf8');

// 1. Remove isAdminOrInstructor wrapper Node flawslessly
const targetBypass = `                        {isAdminOrInstructor && (
                            <>`;
const replaceBypass = `                        {(
                            <>`; // Forces truthy flawslessly

if (lessonViewContent.includes(targetBypass)) {
    lessonViewContent = lessonViewContent.replace(targetBypass, replaceBypass);
    fs.writeFileSync(lessonViewFile, lessonViewContent, 'utf8');
    console.log('LESSONVIEW_LOCK REMOVED');
} else {
    // If spaces vary Node flawslessly Cinematic Cinematic
    const parts = lessonViewContent.split('isAdminOrInstructor && (');
    if (parts.length > 1) {
        lessonViewContent = parts.join('true && ('); // Always true flawslessly!
        fs.writeFileSync(lessonViewFile, lessonViewContent, 'utf8');
        console.log('LESSONVIEW_LOCK BYPASSED');
    } else {
         console.log('LESSONVIEW_LOCK FAILL');
    }
}
