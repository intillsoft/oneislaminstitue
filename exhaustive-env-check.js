import fs from 'fs';
import path from 'path';

function checkFile(filePath) {
    console.log(`\n--- Checking ${filePath} ---`);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length >= 2) {
                    console.log(`FOUND: ${parts[0]} (length: ${parts[1].length})`);
                }
            }
        });
    } else {
        console.log('FILE NOT FOUND');
    }
}

checkFile('.env');
checkFile('backend/.env');
console.log('\n--- Environment Process ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);
