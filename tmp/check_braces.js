const fs = require('fs');
const code = fs.readFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\instructor-dashboard\\index.jsx', 'utf-8');

let braceContext = [];
let line = 1;

for (let i = 0; i < code.length; i++) {
  const char = code[i];
  if (char === '\n') line++;
  if (char === '{') braceContext.push({ type: '{', line });
  if (char === '}') {
    if (braceContext.length === 0) {
       fs.appendFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\tmp\\res.txt', `Extra } found at line ${line}\n`);
    } else {
       braceContext.pop();
    }
  }
}

fs.appendFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\tmp\\res.txt', `Braces left open: ${braceContext.length}\n`);
if (braceContext.length > 0) {
  braceContext.forEach(b => fs.appendFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\tmp\\res.txt', `Open { at line ${b.line}\n`));
}
