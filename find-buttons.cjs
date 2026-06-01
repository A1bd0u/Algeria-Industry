const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{tsx,jsx}');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // very simple heuristic
  const buttonRegex = /<button[^>]*>/g;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const btn = match[0];
    if (!btn.includes('onClick') && !btn.includes('type="submit"')) {
      console.log(`Found unhandled button in ${file}: ${btn}`);
    }
  }
}
