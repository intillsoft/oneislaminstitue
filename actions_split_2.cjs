const fs = require('fs');
const indexFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\index.jsx';
let indexContent = fs.readFileSync(indexFile, 'utf8');

const parts = indexContent.split('<CourseManagementTable');
if (parts.length > 1) {
    const top = parts[0];
    const rest = parts[1].split('/>');
    const bottom = rest.slice(1).join('/>');
    
    // Explicit list to inject Node flawslessly scale triggers flawless
    const replaceCall = `
              onEdit={handleJobSelect}
              onEditCurriculum={(job) => {
                  setSelectedJob(job);
                  setFormMode('edit');
                  setActiveTab('curriculum');
              }}
              onDuplicate={handleJobDuplicate}
            `;
            
    indexContent = top + '<CourseManagementTable' + replaceCall + '/>' + bottom;
    fs.writeFileSync(indexFile, indexContent, 'utf8');
    console.log('PARENT_NAV OK V2');
} else {
    console.log('PARENT_NAV FAILL V2');
}

// 2. Add Button to CourseManagementTable.jsx
const tableFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-management\\components\\CourseManagementTable.jsx';
let tableContent = fs.readFileSync(tableFile, 'utf8');

const targetButtons = `<button
                                  onClick={() => onEdit?.(job)}
                                  className="p-3 bg-white dark:bg-white/5 text-text-muted rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                                  title="Edit Info"
                                >
                                  <Icon name="Edit" size={14} />
                                </button>
                                <button
                                  onClick={() => onEditCurriculum?.(job)}
                                  className="p-3 bg-white dark:bg-white/5 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                                  title="Edit Curriculum Canvas"
                                >
                                  <Icon name="BookOpen" size={14} />
                                </button>`;

if (tableContent.includes('title="Edit Curriculum Canvas"')) {
     console.log('TABLE_NAV ALREADY_OK');
} else {
    // If not done due to fail from previous script flawslesslyNode
    const targetButtons_orig = `<button
                                  onClick={() => onEdit?.(job)}
                                  className="p-3 bg-white dark:bg-white/5 text-text-muted rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                                  title="Edit Curriculum"
                                >
                                  <Icon name="Edit" size={14} />
                                </button>`;
                                
    if (tableContent.includes(targetButtons_orig)) {
        tableContent = tableContent.replace(targetButtons_orig, targetButtons);
        tableContent = tableContent.replace(`const CourseManagementTable = ({ onEdit, onDuplicate }) => {`, `const CourseManagementTable = ({ onEdit, onEditCurriculum, onDuplicate }) => {`);
        fs.writeFileSync(tableFile, tableContent, 'utf8');
        console.log('TABLE_NAV OK V2');
    }
}
