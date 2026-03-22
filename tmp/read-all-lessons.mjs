import fs from 'fs';

try {
  const content = fs.readFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\all-lessons.txt', 'utf16le');
  console.log('--- Content (First 1000 chars) ---');
  console.log(content.substring(0, 1000));
} catch (err) {
  console.error('Error reading file:', err);
}
