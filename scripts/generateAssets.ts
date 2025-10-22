import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');

// Generate grain texture (200x200)
async function generateGrain() {
  const size = 200;
  const buffer = Buffer.alloc(size * size * 4);

  // Create random grain pattern
  for (let i = 0; i < buffer.length; i += 4) {
    const gray = Math.floor(Math.random() * 100) + 100; // 100-200 gray range
    buffer[i] = gray;     // R
    buffer[i + 1] = gray; // G
    buffer[i + 2] = gray; // B
    buffer[i + 3] = 255;  // A
  }

  await sharp(buffer, {
    raw: {
      width: size,
      height: size,
      channels: 4
    }
  })
    .png()
    .toFile(join(publicDir, 'grain.png'));

  console.log('✅ Created grain.png');
}

// Generate OpenGraph image (1200x630)
async function generateOGImage() {
  mkdirSync(join(publicDir, 'og'), { recursive: true });

  // Create gradient background
  const width = 1200;
  const height = 630;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(255,119,0);stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgb(0,229,255);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,255);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
      <rect width="100%" height="100%" fill="rgba(14,14,16,0.7)" />

      <!-- FlashFusion Logo/Title -->
      <text x="600" y="250" font-family="Arial, sans-serif" font-size="80" font-weight="900" fill="white" text-anchor="middle">
        ⚡ FlashFusion
      </text>

      <!-- Tagline -->
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="40" font-weight="600" fill="rgba(255,255,255,0.9)" text-anchor="middle">
        Build Apps 10× Faster with AI
      </text>

      <!-- Subtitle -->
      <text x="600" y="420" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.7)" text-anchor="middle">
        Production-Ready • Cinematic UI • AI-Powered
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, 'og', 'default.png'));

  console.log('✅ Created og/default.png');
}

// Generate favicon and PWA icons
async function generateIcons() {
  // Create base icon with gradient
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(255,119,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(0,229,255);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#iconGrad)" rx="100" />
      <text x="256" y="380" font-family="Arial, sans-serif" font-size="320" font-weight="900" fill="white" text-anchor="middle">
        ⚡
      </text>
    </svg>
  `;

  const baseIcon = await sharp(Buffer.from(svg)).png().toBuffer();

  // Generate various sizes
  const sizes = [16, 32, 48, 64, 128, 192, 256, 512];

  for (const size of sizes) {
    await sharp(baseIcon)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, `icon-${size}.png`));
    console.log(`✅ Created icon-${size}.png`);
  }

  // Generate favicon.ico (32x32)
  await sharp(baseIcon)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.png'));

  console.log('✅ Created favicon.png');

  // Generate apple-touch-icon (180x180)
  await sharp(baseIcon)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));

  console.log('✅ Created apple-touch-icon.png');
}

// Run all generators
async function main() {
  console.log('🎨 Generating visual assets...\n');

  try {
    await generateGrain();
    await generateOGImage();
    await generateIcons();

    console.log('\n✨ All assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
}

main();
