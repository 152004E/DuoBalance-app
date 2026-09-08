const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const assetsNodeModulesDir = path.join(distDir, 'assets/node_modules');
const assetsNewDir = path.join(distDir, 'assets/vendor_modules');

// 1. Rename node_modules to vendor_modules
if (fs.existsSync(assetsNodeModulesDir)) {
  fs.renameSync(assetsNodeModulesDir, assetsNewDir);
  console.log('Renamed node_modules to vendor_modules in dist/assets/');
}

// 2. Search and replace in all HTML, CSS and JS files
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
      
      // Replace node_modules with vendor_modules
      if (content.includes('node_modules')) {
        content = content.replace(/\/node_modules\//g, '/vendor_modules/');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched paths in ${file}`);
      }
    }
  }
}

replaceInFiles(distDir);
console.log('Fixed asset paths for Cloudflare Pages (node_modules -> vendor_modules)!');
