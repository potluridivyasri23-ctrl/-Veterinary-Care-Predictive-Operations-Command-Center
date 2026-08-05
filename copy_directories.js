const fs = require('fs');
const path = require('path');
const root = path.join('c:', 'Users', 'Kavyasri', 'OneDrive', 'Desktop', 'nxtwave project');
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};
const removeDir = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removeDir(entryPath);
    } else {
      fs.unlinkSync(entryPath);
    }
  }
  fs.rmdirSync(dir);
};
const dirs = [
  { oldName: 'client', newName: 'frontend' },
  { oldName: 'server', newName: 'backend' }
];
for (const { oldName, newName } of dirs) {
  const oldPath = path.join(root, oldName);
  const newPath = path.join(root, newName);
  if (fs.existsSync(oldPath)) {
    copyDir(oldPath, newPath);
    removeDir(oldPath);
    console.log(`Copied and removed ${oldName} -> ${newName}`);
  } else {
    console.log(`${oldName} not found`);
  }
}
