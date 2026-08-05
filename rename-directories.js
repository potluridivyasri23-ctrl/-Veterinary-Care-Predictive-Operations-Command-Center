const fs = require('fs');
const path = require('path');
const root = path.join('c:', 'Users', 'Kavyasri', 'OneDrive', 'Desktop', 'nxtwave project');
const dirs = [
  { oldName: 'client', newName: 'frontend' },
  { oldName: 'server', newName: 'backend' }
];
for (const { oldName, newName } of dirs) {
  const oldPath = path.join(root, oldName);
  const newPath = path.join(root, newName);
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${oldName} to ${newName}`);
    } catch (err) {
      console.error(`Failed to rename ${oldName}: ${err.message}`);
    }
  } else if (fs.existsSync(newPath)) {
    console.log(`${newName} already exists`);
  } else {
    console.log(`${oldName} does not exist`);
  }
}
