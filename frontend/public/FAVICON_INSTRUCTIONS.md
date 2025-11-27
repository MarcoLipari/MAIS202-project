# Adding a Favicon (Website Tab Icon)

## Quick Setup

1. **Create or find your favicon image** (recommended: 32x32px or 64x64px, square format)

2. **Save it to the `frontend/public/` folder** with one of these names:
   - `favicon.ico` (recommended - works everywhere)
   - `favicon-32x32.png` (32x32 pixels)
   - `favicon-16x16.png` (16x16 pixels)
   - `apple-touch-icon.png` (180x180 pixels for iOS devices)

## Recommended Sizes

- **favicon.ico**: 16x16, 32x32, 48x48 (multi-size ICO file)
- **favicon-32x32.png**: 32x32 pixels
- **favicon-16x16.png**: 16x16 pixels
- **apple-touch-icon.png**: 180x180 pixels

## Tools to Create Favicons

1. **Online generators:**
   - https://favicon.io/ (free, easy to use)
   - https://realfavicongenerator.net/ (comprehensive)
   - https://www.favicon-generator.org/

2. **From an image:**
   - Upload your logo/image to any of the above tools
   - They'll generate all the sizes you need

## What to Use

For this project, you could use:
- The McGill logo (simplified/icon version)
- A Reddit-themed icon
- A linguistic/NLP-themed icon
- A combination icon

## After Adding

Once you place the favicon files in `frontend/public/`, they will automatically appear in:
- Browser tabs
- Bookmarks
- Browser history
- Mobile home screen (if saved)

The layout.tsx is already configured to use these files!

