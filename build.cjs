const fs = require('fs');
const path = require('path');

const files = ['index.html'];
fs.copyFileSync(path.join(srcDir, 'SavedReplyManager.js'), path.join(buildDir, srcDir, 'SavedReplyManager.js'));
const srcDir = 'src';
const buildDir = 'build';

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(__dirname, file), path.join(buildDir, file));
}

fs.mkdirSync(path.join(buildDir, srcDir), { recursive: true });
fs.copyFileSync(path.join(srcDir, 'App.js'), path.join(buildDir, srcDir, 'App.js'));
fs.copyFileSync(path.join(srcDir, 'index.js'), path.join(buildDir, srcDir, 'index.js'));
fs.copyFileSync(path.join(srcDir, 'SavedReplyManager.jsx'), path.join(buildDir, srcDir, 'SavedReplyManager.jsx'));

