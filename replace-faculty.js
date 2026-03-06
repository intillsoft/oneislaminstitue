import fs from 'fs';
import path from 'path';

const searchRegex = /faculty/gi;
const excludeDirs = ['.git', 'node_modules', '.gemini', 'dist', 'build'];

const walkAndReplace = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!excludeDirs.includes(file)) {
                walkAndReplace(fullPath);
            }
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (searchRegex.test(content)) {
                
                // Specific manual replacements for casing
                content = content.replace(/Faculty/g, 'Curator Team');
                content = content.replace(/faculty/g, 'curator team');
                content = content.replace(/FACULTY/g, 'CURATOR TEAM');
                
                // Fix specific variables/methods that might break
                content = content.replace(/Curator TeamService/g, 'teamService');
                content = content.replace(/curator teamService/g, 'teamService');
                content = content.replace(/applyCurator Team/g, 'applyTeam');
                content = content.replace(/joinCurator Team/g, 'joinTeam');
                content = content.replace(/JoinCurator Team/g, 'JoinTeam');
                content = content.replace(/ApplyCurator Team/g, 'ApplyTeam');
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
};

walkAndReplace('./src');
console.log('Done');
