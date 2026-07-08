const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, '..', 'source', 'img');

async function svgToPng(svgName, pngName, width) {
  const svgPath = path.join(imgDir, svgName);
  const pngPath = path.join(imgDir, pngName);
  const svg = fs.readFileSync(svgPath);

  await sharp(svg, { density: 300 })
    .resize({ width, withoutEnlargement: false })
    .png()
    .toFile(pngPath);

  console.log(`Generated ${pngName}`);
}

async function main() {
  await svgToPng('logo.svg', 'logo.png', 336);
  await svgToPng('avatar.svg', 'avatar.png', 256);
  await svgToPng('favicon.svg', 'favicon.png', 64);
  await sharp(path.join(imgDir, 'favicon.png'))
    .resize(32, 32)
    .png()
    .toFile(path.join(imgDir, 'favicon-32.png'));
  console.log('Generated favicon-32.png');
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = main;
