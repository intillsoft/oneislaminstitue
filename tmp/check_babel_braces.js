const fs = require('fs');
const parser = require('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\node_modules\\@babel\\parser');

const code = fs.readFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\src\\pages\\instructor-dashboard\\index.jsx', 'utf-8');

try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  fs.writeFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\tmp\\res.txt', '✅ OK - Parse Success');
} catch (err) {
  fs.writeFileSync('c:\\Users\\USER\\OneDrive\\Documents\\new workflow\\-workflow\\tmp\\res.txt', `❌ Error: ${err.message} at line ${err.loc.line}, column ${err.loc.column}`);
}
