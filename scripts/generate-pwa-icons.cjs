#!/usr/bin/env node

/**
 * Generate placeholder PWA icons with SVG
 * This creates simple placeholder icons for development/testing
 * In production, replace with proper branded icons
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../client/public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon for each size
sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text 
    x="50%" 
    y="50%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-family="Inter, system-ui, sans-serif" 
    font-size="${size * 0.4}" 
    font-weight="bold" 
    fill="white"
  >FF</text>
</svg>`;

  // For now, just save as SVG
  // In production, these should be converted to PNG
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`Generated ${filename}`);
});

// Create a note about converting to PNG
const readme = `# PWA Icons

These are placeholder SVG icons for development.

## For Production

Convert these SVG files to PNG format at the specified sizes:
- Use a tool like ImageMagick, Sharp, or an online converter
- Ensure icons have transparent backgrounds if needed
- Optimize PNGs for size

Example with ImageMagick:
\`\`\`bash
for size in 72 96 128 144 152 192 384 512; do
  convert icon-\${size}x\${size}.svg -resize \${size}x\${size} icon-\${size}x\${size}.png
done
\`\`\`

Or use an online tool like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), readme);
console.log('Generated icons README');

console.log('\nPWA icons generated successfully!');
console.log('Note: In production, replace SVG placeholders with optimized PNG icons.');
