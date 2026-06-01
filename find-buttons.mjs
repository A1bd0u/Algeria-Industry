import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const buttonRegex = /<button[^>]*>/g;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const btn = match[0];
    if (!btn.includes('onClick') && !btn.includes('type="submit"')) {
      console.log(`Unlinked button in ${file}: ${btn.replace('\n', ' ')}`);
    }
  }
}
