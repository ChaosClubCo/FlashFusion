# PWA Icons

## Current Status: Development Placeholders (SVG)

The current icons are **SVG placeholders** for development and testing. While SVG icons work in the manifest and for basic PWA functionality, **PNG icons are required for full PWA compliance** and install prompts on all platforms (especially Android, iOS, and Windows).

## Why PNG is Required

- **Platform Requirements**: Most platforms (Android, iOS) require bitmap icons (PNG/JPG) for install prompts
- **Maskable Icons**: Android adaptive icons need PNG with `maskable` purpose
- **Splash Screens**: iOS and Android use bitmap icons for splash screens
- **Install Banners**: Browser install prompts validate icon format and may reject SVG

## Production Requirements

For production deployment, convert these SVG files to PNG format at the specified sizes:

### Required Sizes:
- **72x72** - Android legacy
- **96x96** - Android, shortcuts
- **128x128** - Android, Chrome
- **144x144** - Windows tile
- **152x152** - iOS legacy
- **192x192** - Android, Chrome (standard)
- **384x384** - Android high-DPI
- **512x512** - Android high-res, splash screen

### Conversion Options:

#### Option 1: ImageMagick (Command Line)
```bash
for size in 72 96 128 144 152 192 384 512; do
  convert icon-${size}x${size}.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

#### Option 2: Sharp (Node.js)
```javascript
const sharp = require('sharp');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp(`icon-${size}x${size}.svg`)
    .resize(size, size)
    .png()
    .toFile(`icon-${size}x${size}.png`);
});
```

#### Option 3: Online Tools (Easiest)
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Generates all sizes + manifest
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator) - PWA-specific
- [Favicon.io](https://favicon.io/) - Simple converter

### After Conversion:

1. **Update manifest.json**:
   ```json
   "icons": [{
     "src": "/icons/icon-192x192.png",
     "sizes": "192x192",
     "type": "image/png",
     "purpose": "any maskable"
   }]
   ```

2. **Update index.html**:
   ```html
   <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
   ```

3. **Update shortcuts** in manifest.json to use PNG icons

4. **Test** install prompts on:
   - Android Chrome (install banner)
   - iOS Safari (Add to Home Screen)
   - Desktop Chrome (install button)
   - Edge (install prompt)

## Design Specifications:
- **Gradient**: Orange #f97316 → #fb923c
- **Text**: White "FF" centered, bold, Inter font
- **Border Radius**: 15% (rounded corners)
- **Safe Area**: For maskable icons, keep important content in center 80%
- **Background**: Match app background (#0e0e10) or use gradient

## Current SVG Template:
The generated SVG uses:
- Linear gradient background
- Centered "FF" text at 40% font size
- 15% border radius
- Matches FlashFusion brand colors
