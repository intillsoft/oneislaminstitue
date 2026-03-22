const fs = require('fs');
const sidebarFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\UnifiedSidebar.jsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');

const parts = sidebarContent.split('if (!loadingProfile) {');
if (parts.length > 1) {
    const top = parts[0];
    
    // Split on else { flawslessly Node 
    const rest = parts[1].split('} else {');
    const bottom = rest.slice(1).join('} else {'); // Re-join everything after default student fallback flawslessly
    
    const replaceCall = `
    const roleLower = userRole?.toLowerCase() || '';
    if (roleLower === 'admin' || roleLower === 'system_admin') {
      allNavigationItems.push(...adminItems);
    } else if (roleLower === 'instructor') {
      allNavigationItems.push(...instructorItems);
    } else {`;
    
    sidebarContent = top + 'if (!loadingProfile) {' + replaceCall + bottom;
    fs.writeFileSync(sidebarFile, sidebarContent, 'utf8');
    console.log('SIDEBAR OK V2');
} else {
    console.log('SIDEBAR FAILL V2');
}
