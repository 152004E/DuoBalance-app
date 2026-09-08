const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const assetsPnpmDir = path.join(distDir, 'assets/node_modules/.pnpm');
const assetsNewDir = path.join(distDir, 'assets/node_modules/pnpm-modules');

// 1. Rename the .pnpm folder if it exists
if (fs.existsSync(assetsPnpmDir)) {
  fs.renameSync(assetsPnpmDir, assetsNewDir);
  console.log('Renamed .pnpm to pnpm-modules in dist/assets/node_modules/');
}

// 2. Search and replace in all HTML and CSS files
function replaceInFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      replaceInFiles(filePath);
    } else if (filePath.endsWith('.html') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('.pnpm')) {
        content = content.replace(/\/\.pnpm\//g, '/pnpm-modules/');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched paths in ${file}`);
      }
    }
  }
}

replaceInFiles(distDir);
console.log('Fixed pnpm asset paths for production!');
