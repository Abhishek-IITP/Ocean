const fs = require('fs');
const path = require('path');

const filesToDelete = [
  path.join(__dirname, 'run-graphql-fix.js'),
];

const dirsToDelete = [
  path.join(__dirname, 'app', 'api', 'temp-migrate'),
];

console.log("Starting repository cleanup...");

// Delete files
filesToDelete.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted file: ${path.basename(file)}`);
    } catch (e) {
      console.error(`Error deleting file ${path.basename(file)}:`, e.message);
    }
  }
});

// Delete directories
dirsToDelete.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmdirSync(dir);
      console.log(`Deleted directory: ${path.relative(__dirname, dir)}`);
    } catch (e) {
      console.error(`Error deleting directory ${path.relative(__dirname, dir)}:`, e.message);
    }
  }
});

// Self-delete
try {
  process.nextTick(() => {
    fs.unlinkSync(__filename);
    console.log("Cleanup script self-deleted. Codebase is now clean!");
  });
} catch (e) {
  console.error("Error self-deleting cleanup script:", e.message);
}
