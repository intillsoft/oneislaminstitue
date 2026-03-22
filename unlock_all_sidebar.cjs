const fs = require('fs');
const sidebarFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\UnifiedSidebar.jsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');

const parts = sidebarContent.split('if (!loadingProfile) {');
if (parts.length > 1) {
    const top = parts[0];
    const rest = parts[1].split('} else {');
    const bottom = rest.slice(1).join('} else {'); // we can split better flawslessly
}

// Just search for the complete if/else chain and replace with unconditional push Node absolute flawlessly
const searchChain = `    const roleLower = userRole?.toLowerCase() || '';
    const forceInstructor = localStorage.getItem('forceInstructor') === 'true';
    const forceAdmin = localStorage.getItem('adminBypass') === 'true';

    if (roleLower === 'admin' || roleLower === 'system_admin' || forceAdmin) {
      allNavigationItems.push(...adminItems);
      allNavigationItems.push(...instructorItems);
    } else if (roleLower === 'instructor' || forceInstructor) {
      allNavigationItems.push(...instructorItems);
    } else {
      // Default to student items
      allNavigationItems.push(...mainItems);
      allNavigationItems.push(...studentItems);
    }`;

const replaceChain = `    // UNCONDITIONAL MASTER FEATURES MERGE Node absolute flawlessly
    allNavigationItems.push(...adminItems);
    allNavigationItems.push(...instructorItems);
    allNavigationItems.push(...mainItems);
    allNavigationItems.push(...studentItems);`;

if (sidebarContent.includes(searchChain)) {
    sidebarContent = sidebarContent.replace(searchChain, replaceChain);
    fs.writeFileSync(sidebarFile, sidebarContent, 'utf8');
    console.log('SIDEBAR_UNLOCK OK');
} else {
    console.log('SIDEBAR_UNLOCK FAILL');
}
