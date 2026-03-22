const fs = require('fs');

const dispatcherFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\DashboardDispatcher.jsx';
let dispatcherContent = fs.readFileSync(dispatcherFile, 'utf8');

const targetStr = `      const role = userRole;`;
const replaceStr = `      const role = userRole?.toLowerCase();`;

if (dispatcherContent.includes(targetStr)) {
    dispatcherContent = dispatcherContent.replace(targetStr, replaceStr);
    fs.writeFileSync(dispatcherFile, dispatcherContent, 'utf8');
    console.log('DISPATCHER OK');
} else {
    console.log('DISPATCHER FAILL');
}

const sidebarFile = 'c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\components\\ui\\UnifiedSidebar.jsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');

const targetSides = `  /* Role-based Navigation Logic (Active Role Based) */
  if (!loadingProfile) {
    if (userRole === 'admin') {
      allNavigationItems.push(...adminItems);
    } else if (userRole === 'instructor') {
      allNavigationItems.push(...instructorItems);
    } else {`;

const replaceSides = `  /* Role-based Navigation Logic (Active Role Based) */
  if (!loadingProfile) {
    const roleLower = userRole?.toLowerCase() || '';
    if (roleLower === 'admin' || roleLower === 'system_admin') {
      allNavigationItems.push(...adminItems);
    } else if (roleLower === 'instructor') {
      allNavigationItems.push(...instructorItems);
    } else {`;

if (sidebarContent.includes(targetSides)) {
    sidebarContent = sidebarContent.replace(targetSides, replaceSides);
    fs.writeFileSync(sidebarFile, sidebarContent, 'utf8');
    console.log('SIDEBAR OK');
} else {
    console.log('SIDEBAR FAILL');
}
