const fs = require('fs');
const path = require('path');

function getHexFrequencies(dir) {
  const frequencies = {};
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Match things like bg-[#1a5a96], text-[#333]
        const regex = /\[#([0-9a-fA-F]{3,6})\]/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const hex = match[1].toLowerCase();
          const fullHex = hex.length === 3 ? hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2] : hex;
          frequencies['#' + fullHex] = (frequencies['#' + fullHex] || 0) + 1;
        }
      }
    }
  }
  
  scanDir(dir);
  
  return Object.entries(frequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
}

const dir = 'c:\\Users\\Gtel-Ict\\Desktop\\demo-hctp-main\\app';
const result = getHexFrequencies(dir);
console.log(result);
