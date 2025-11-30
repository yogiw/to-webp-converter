# WebP Converter

A fast, privacy-focused image converter that transforms JPG, PNG, GIF, and other formats to WebP — entirely in your browser.

🔗 **Live**: [webp.giw.app](https://webp.giw.app)

![WebP Converter](https://webp.giw.app/opengraph-image)

## Features

- **🖼️ Multiple Format Support** - Convert JPG, PNG, GIF, BMP, and more to WebP
- **🔒 100% Client-Side** - No uploads, no servers. Your images never leave your device
- **📦 Batch Processing** - Convert multiple images at once
- **⚙️ Quality Control** - Adjust output quality from 1-100%
- **📐 Resize Option** - Scale images down from 10-100%
- **💾 Flexible Downloads** - Download individually or as a ZIP archive
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🌙 Dark Theme** - Easy on the eyes

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [JSZip](https://stuk.github.io/jszip/) - ZIP file generation
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Image conversion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/to-webp-converter.git
cd to-webp-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production:

```env
NEXT_PUBLIC_SITE_URL=https://webp.giw.app
```

## Usage

1. **Drop or select images** - Drag and drop images into the drop zone, or click to browse
2. **Adjust settings** - Set quality (1-100%) and scale (10-100%)
3. **Convert** - Click "Convert to WebP" to process all images
4. **Download** - Download individually or all at once as a ZIP file

## How It Works

The conversion happens entirely in your browser using the HTML5 Canvas API:

1. Images are loaded into an `<img>` element
2. The image is drawn onto a canvas (with optional scaling)
3. The canvas is exported as WebP using `canvas.toBlob()` with the specified quality
4. The resulting blob is made available for download

No image data is ever sent to a server — everything stays on your device.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
app/
├── components/
│   └── image-converter.tsx   # Main converter component
├── globals.css               # Global styles
├── layout.tsx                # Root layout with SEO
├── page.tsx                  # Home page
├── sitemap.ts                # Dynamic sitemap
├── robots.ts                 # Robots.txt
├── opengraph-image.tsx       # OG image generation
├── twitter-image.tsx         # Twitter card image
├── icon.tsx                  # Favicon
└── apple-icon.tsx            # Apple touch icon
public/
└── manifest.json             # PWA manifest
```

## Browser Support

WebP encoding is supported in all modern browsers:

- Chrome 17+
- Firefox 65+
- Safari 14+
- Edge 18+

## License

MIT

## Author

Built by [Yogi Wisesa](https://giw.app)
