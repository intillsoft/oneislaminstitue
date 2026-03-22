const fs = require('fs');

try {
  // Try both encodings
  const contentUtf8 = fs.readFileSync('all-lessons.txt', 'utf8');
  console.log('--- UTF8 Content Length ---', contentUtf8.length);
  if (contentUtf8.includes('Lesson') || contentUtf8.includes('Compass')) {
     console.log('UTF8 matched keywords!');
     console.log(contentUtf8.substring(0, 500));
  } else {
     const contentUtf16 = fs.readFileSync('all-lessons.txt', 'utf16le');
     console.log('--- UTF16LE Content Length ---', contentUtf16.length);
     console.log(contentUtf16.substring(0, 500));
  }
} catch (err) {
  console.error('Error reading file:', err);
}
