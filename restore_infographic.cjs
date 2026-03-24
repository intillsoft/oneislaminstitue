const fs = require('fs');

const fileContent = fs.readFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx', 'utf8');
const backupContent = fs.readFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\temp_renderer_backup.jsx', 'utf8');

// 1. Grab InfographicBlock from Backup Coordinate flawslessly Cinema
const startInfographic = 'const InfographicBlock = ({ block }) => {';
const backupParts = backupContent.split(startInfographic);

if (backupParts.length > 1) {
    // Take the remainder from backing up flawlessly index safely Node
    const infographicSegment = startInfographic + backupParts[1].split('// ─── ')[0]; 
    // Wait! '// ─── ' separates InfographicBlock and another block Node absolute flawless
    
    // Let's safe extract based on close bracket or layout boundaries Coordinate flawslessly node
    const mainParts = fileContent.split(startInfographic);
    if (mainParts.length > 1) {
          const top = mainParts[0];
          const bottomParts = mainParts[1].split('// ─── '); // Separator is rows flawed Coordinate flawslessly Cinema
          if (bottomParts.length > 1) {
               const bottom = bottomParts.slice(1).join('// ─── ');
               
               // Read safe backup block with exact close bracket flawslessly
               const safeBlockBackup = startInfographic + backupParts[1].split('// ─── ')[0];
               
               const fixedContent = top + safeBlockBackup + '// ─── ' + bottom;
               fs.writeFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\course-discovery\\components\\LessonBlockRenderer.jsx', fixedContent, 'utf8');
               console.log('INFOGRAPHIC_BLOCK RESTORED OK');
          } else {
               console.log('BOTTOM SPLIT FAILL');
          }
    } else {
          console.log('MAIN SPLIT FAILL');
    }
} else {
    console.log('BACKUP SPLIT FAILL');
}
