# Assets Directory

This directory contains static assets for FlashFusion.

## Required Assets

### 1. Grain Texture (`grain.png`)

Create a seamless grain texture image:
- **Size**: 200x200px (will be repeated)
- **Format**: PNG with transparency
- **Style**: Subtle noise/grain pattern
- **Usage**: Overlaid at 5% opacity on gradient background

You can generate grain textures using:
- Photoshop: Filter > Noise > Add Noise
- GIMP: Filters > Render > Clouds > Solid Noise
- Online tools: NoiseTexture Generator

### 2. Open Graph Image (`og/default.png`)

Create a social media preview image:
- **Size**: 1200x630px
- **Format**: PNG or JPG
- **Content**: 
  - FlashFusion logo/branding
  - Tagline: "Build Apps 10× Faster with AI"
  - Gradient background matching brand colors
  - Clear, readable text

Design tips:
- Keep text large and centered
- Use brand colors (orange, cyan, magenta)
- Ensure good contrast for readability
- Safe area: Avoid text near edges

## Current Placeholders

Since actual images are not yet created:
1. Grain effect will not show (graceful degradation)
2. OG images will use fallback meta tags

## Next Steps

1. Design grain.png using the specifications above
2. Create og/default.png with brand guidelines
3. Optimize images:
   - Compress PNG files (TinyPNG, ImageOptim)
   - Use WebP format for better compression
   - Generate responsive sizes if needed
