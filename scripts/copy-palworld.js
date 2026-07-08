const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'apps', 'palworld', 'dist');
const targetDir = path.join(rootDir, 'source', 'tools', 'palworld');

function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyPalworld() {
  if (!fs.existsSync(distDir)) {
    throw new Error(`Build output not found: ${distDir}`);
  }

  console.log('Copying PalWorld build to source/tools/palworld/...');
  rmDir(targetDir);
  copyDir(distDir, targetDir);
  console.log('PalWorld tool copied successfully.');
}

if (require.main === module) {
  copyPalworld();
}

module.exports = copyPalworld;
