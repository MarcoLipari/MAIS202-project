# Adding the McGill Logo

## Steps:

1. **Save the logo image** to this folder (`frontend/public/`) with one of these names:
   - `mcgill-logo.png` (recommended)
   - `mcgill-logo.svg` (if it's a vector file)
   - `mcgill-logo.jpg` (if it's a JPEG)

2. **The logo will automatically appear in:**
   - **Footer**: Large logo (height: 80px)
   - **Navbar**: Small logo on desktop (height: 32px, hidden on mobile)

3. **If the logo doesn't appear:**
   - Make sure the file is named exactly `mcgill-logo.png` (or `.svg`/`.jpg`)
   - Check that the file is in the `frontend/public/` folder
   - The website will show a placeholder if the logo is missing

## File Format Recommendations:

- **PNG**: Best for logos with transparency
- **SVG**: Best for scalable vector logos (crisp at any size)
- **JPG**: Works but no transparency support

## Current Setup:

The components are already configured to use `/mcgill-logo.png`. 
Just add your logo file to this folder and it will work automatically!

