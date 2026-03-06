const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('node seed-course-2-structure.js', { encoding: 'utf-8' });
  fs.writeFileSync('seed_output.log', out);
} catch (e) {
  fs.writeFileSync('seed_output.log', e.stdout + '\n\n' + e.stderr);
}
