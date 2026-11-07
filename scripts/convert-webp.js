const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dirs = [
  'public/images',
  'public/images/ars',
  'public/images/gallery',
  'public/images/students'
];

async function convertAll() {
  let totalOrig = 0;
  let totalWebp = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const inputPath = path.join(dir, file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const outputPath = path.join(dir, baseName + '.webp');

        const originalStats = fs.statSync(inputPath);
        totalOrig += originalStats.size;

        const pipeline = sharp(inputPath);
        if (file.startsWith('logo')) {
          await pipeline.webp({ quality: 85, effort: 6 }).toFile(outputPath);
        } else {
          await pipeline.webp({ quality: 80, effort: 5 }).toFile(outputPath);
        }

        const newStats = fs.statSync(outputPath);
        totalWebp += newStats.size;
        const percent = Math.round((1 - newStats.size / originalStats.size) * 100);
        console.log(`${file} (${(originalStats.size / 1024).toFixed(1)} KB) -> ${baseName}.webp (${(newStats.size / 1024).toFixed(1)} KB) [${percent}% smaller]`);
      }
    }
  }

  const overallPercent = Math.round((1 - totalWebp / totalOrig) * 100);
  console.log(`\nTOTAL: ${(totalOrig / 1024 / 1024).toFixed(2)} MB -> ${(totalWebp / 1024 / 1024).toFixed(2)} MB (${overallPercent}% saved!)`);
}

convertAll().catch(console.error);
