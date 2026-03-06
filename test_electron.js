console.log('Node arch:', process.arch);
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Check electron dist
const path = require('path');
const fs = require('fs');
const distDir = path.join(__dirname, 'node_modules', 'electron', 'dist');
const files = fs.readdirSync(distDir).slice(0, 20);
console.log('Electron dist files (first 20):', files);
console.log('electron.exe size:', fs.statSync(path.join(distDir, 'electron.exe')).size);
