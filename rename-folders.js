const fs = require('fs');
const path = require('path');
const root = path.join(__dirname);
const results = [];
[
  { oldName: 'client', newName: 'frontend' },
  { oldName: 'server', newName: 'backend' }
].forEach(({ oldName, newName }) => {
  const oldPath = path.join(root, oldName);
  const newPath = path.join(root, newName);
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      results.push(`${oldName} -> ${newName}`);
    } catch (err) {
      results.push(`ERROR renaming ${oldName}: ${err.message}`);
    }
  } else if (fs.existsSync(newPath)) {
    results.push(`${newName} already exists`);
  } else {
    results.push(`${oldName} not found`);
  }
});
fs.writeFileSync(path.join(root, 'rename-result.txt'), results.join('\n'));
console.log(results.join('\n'));
