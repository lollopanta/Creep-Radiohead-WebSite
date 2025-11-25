# Creep (Radiohead) - Interactive Web App

A single-page, production-ready React web app about the song "Creep" by Radiohead, featuring rich animations, modern UX, and comprehensive content analysis.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
Creep/
├── data/
│   ├── content.json          # All site content (lorem ipsum placeholders)
│   └── sources.json          # Sources and citations (empty, ready for content)
├── public/
│   └── assets/
│       ├── audio/
│       │   └── creep.mp3     # TODO: Add audio file here
│       └── images/
│           ├── hero.jpg      # TODO: Add hero image
│           ├── band.jpg      # TODO: Add band image
│           ├── album-cover.jpg # TODO: Add album cover
│           └── diagram-meter.svg # TODO: Add structure diagram
├── src/
│   ├── components/
│   │   ├── AboutBand.tsx
│   │   ├── Album.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── LyricsExplorer.tsx
│   │   ├── MusicalAnalysis.tsx
│   │   ├── PoeticDevices.tsx
│   │   ├── Refrain.tsx
│   │   ├── Structure.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Timeline.tsx
│   │   └── Visualizer.tsx
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## ✏️ How to Replace Content

### 1. Replace Lorem Ipsum Text

All visible text content is stored in `data/content.json`. Simply edit this file to replace lorem ipsum placeholders with real content. Each section has clear TODO comments indicating what should be replaced:

- **Hero section**: Title, subtitle, description
- **Band section**: Band name, description
- **Album section**: Album name, year, label, description
- **Song History**: Timeline events (year, title, description)
- **Structure**: Stanza count, meter information, descriptions
- **Refrain**: Chorus lyrics and analysis (⚠️ **IMPORTANT**: Replace all placeholder lyrics)
- **Poetic Devices**: Metaphor, assonance, and alliteration examples
- **Musical Analysis**: Tempo, chord progression, key
- **Lyrics**: All stanza lyrics (⚠️ **IMPORTANT**: Replace all placeholder lyrics)

### 2. Add Images

Add your images to the `public/assets/images/` directory:

- `hero.jpg` - Hero section background/landing image
- `band.jpg` - Band photo
- `album-cover.jpg` - Album cover artwork
- `diagram-meter.svg` - Song structure diagram (SVG format preferred)

The app will automatically reference these paths. If images are missing, placeholder SVG graphics will be displayed.

### 3. Add Audio File

1. Place your audio file at `public/assets/audio/creep.mp3`
2. Update the path in `data/content.json` under `audio.path` if using a different filename
3. Update the chorus start time in `data/content.json` under `refrain.startTime` (format: "M:SS", e.g., "0:57")

### 4. Update SEO Meta Tags

Edit `index.html` to replace placeholder meta tags:

- `<title>` tag
- `meta name="description"`
- `meta name="keywords"`
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter Card tags

### 5. Add Sources

Edit `data/sources.json` to add real sources and citations. Each source should include:

- `title`: Source title
- `url`: Source URL
- `author`: Author name (optional)
- `date`: Publication date (optional)
- `type`: Source type (article, book, interview, etc.)

## 🎨 Features

### Animations & Interactions

- **Hero Section**: Parallax particle field that reacts to mouse movement
- **Scroll-Linked Animations**: Sections reveal as you scroll using Framer Motion
- **Timeline Component**: Animated vertical timeline with scroll-triggered reveals
- **Audio Visualizer**: Real-time waveform visualization using Web Audio API
- **Theme Toggle**: Animated dark/light mode switch
- **Micro-Interactions**: Hover effects, button ripples, card flips, and more

### Accessibility

- Semantic HTML structure (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels for custom controls
- Keyboard navigation support (Space, Arrow keys)
- Respects `prefers-reduced-motion` media query
- High contrast text for readability

### Performance

- Code splitting for heavy components (Timeline lazy-loaded)
- Optimized animations with hardware acceleration
- Lazy image loading
- Production build optimization via Vite

## ⌨️ Keyboard Shortcuts

- **Space**: Play/pause audio (when audio player is open)
- **← (Left Arrow)**: Skip backward 10 seconds
- **→ (Right Arrow)**: Skip forward 10 seconds
- **↑ ↓ (Up/Down Arrow)**: Navigate stanzas in Lyrics Explorer (when focused)

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations (available but not required)
- **Web Audio API** - Audio visualization
- **Vite** - Build tool and dev server

## 📝 TODO Comments in Code

Throughout the codebase, you'll find `TODO:` comments indicating where to:

- Replace lorem ipsum with real content
- Add actual song lyrics (currently all placeholders)
- Insert real factual data (years, names, analyses)
- Configure actual audio timing for chorus

Search for `TODO:` in your code editor to find all locations that need content replacement.

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

TODO: Add your license information here.

---

**Note**: This app uses placeholder content (lorem ipsum) throughout. All real lyrics, facts, and analysis must be replaced before publishing. See the "How to Replace Content" section above for detailed instructions.
