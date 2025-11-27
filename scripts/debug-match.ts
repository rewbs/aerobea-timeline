
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Create a map of lowercase filename -> actual filename
const fileMap = new Map<string, string>();
if (fs.existsSync(PUBLIC_DIR)) {
    fs.readdirSync(PUBLIC_DIR).forEach(file => {
        console.log(`File: '${file}' -> Lower: '${file.toLowerCase()}'`);
        fileMap.set(file.toLowerCase(), file);
    });
}

function findLocalImage(name: string) {
    const cleanName = name.trim().toLowerCase();
    console.log(`Searching for: '${name}' -> Clean: '${cleanName}'`);
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

    for (const ext of extensions) {
        const candidate = `${cleanName}.${ext}`;
        console.log(`  Checking candidate: '${candidate}'`);
        if (fileMap.has(candidate)) {
            console.log(`  MATCH FOUND: ${fileMap.get(candidate)}`);
            return fileMap.get(candidate)!;
        }
    }
    console.log('  NO MATCH');
    return null;
}

findLocalImage('Baahram Edward Lincoln the Elder');
findLocalImage('Robert Crumbleton');
