#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../client/public/icons');

async function convertSvgToPng() {
  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    if (!fs.existsSync(svgPath)) {
      console.error(`SVG not found: ${svgPath}`);
      continue;
    }

    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`✓ Converted icon-${size}x${size}.svg → icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to convert ${svgPath}:`, error.message);
    }
  }

  console.log('\n✅ PNG conversion complete!');
  console.log('Next steps:');
  console.log('1. Update manifest.json to use .png icons with type: image/png');
  console.log('2. Update index.html apple-touch-icon to use .png');
  console.log('3. Restart the application');
}

convertSvgToPng().catch(console.error);
