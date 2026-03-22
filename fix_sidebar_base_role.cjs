const fs = require('fs');
const sidebarFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\UnifiedSidebar.jsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');

const parts = sidebarContent.split('/* Role-based Navigation Logic (Active Role Based) */');
if (parts.length > 1) {
    const top = parts[0];
    
    // Split on else { flawslessly Node 
    const rest = parts[1].split('} else {');
    const bottom = rest.slice(1).join('} else {'); // Re-join everything after default student fallback flawslessly
    
    const replaceCall = `
  if (!loadingProfile) {
    const roleLower = baseRole?.toLowerCase() || ''; // Use baseRole to lock Admin access unconditionally
    if (roleLower === 'admin' || roleLower === 'system_admin') {
      allNavigationItems.push(...adminItems);
      allNavigationItems.push(...instructorItems);
      allNavigationItems.push(...mainItems);
    } else if (roleLower === 'instructor') {
      allNavigationItems.push(...instructorItems);
    } else {`;
            
    sidebarContent = top + `/* Role-based Navigation Logic (Active Role Based) */` + replaceCall + bottom;
    fs.writeFileSync(sidebarFile, sidebarContent, 'utf8');
    console.log('SIDEBAR_BASE_ROLE OK');
} else {
    console.log('SIDEBAR_BASE_ROLE FAILL');
}
