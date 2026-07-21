# Developer Guide — Hogwarts Birthday

This document provides a complete technical guide to the architecture, subsystems, and code patterns of the birthday website. It is designed to give any developer or AI agent immediate, comprehensive understanding of the project.

---

## 📂 File Architecture Overview

A high-performance, vanilla front-end application with no build tools, bundlers, frameworks, or npm runtime dependencies. Purely HTML5, CSS3, and ES6+ JavaScript modules.

```
/
├── index.html              Main document — semantic structure, DOM shell
├── content.js              User-facing configuration (name, message, house, videos, audio)
├── vercel.json             Vercel static hosting config (passthrough routes)
├── public/
│   ├── css/
│   │   ├── main.css        CSS entry point (@import cascade)
│   │   ├── base/
│   │   │   ├── variables.css    Theme tokens, CSS custom properties, background asset slots
│   │   │   ├── fonts.css
│   │   │   └── reset.css
│   │   └── layout/
│   │       ├── app.css          Main layout, hero block, typography (mobile-first)
│   │       ├── responsive.css   3-tier mobile breakpoints (primary design target)
│   │       ├── envelope.css     3D envelope construction
│   │       ├── parchment.css    Scroll modal, letter text, paragraph reveal
│   │       ├── landing.css      Video backgrounds, bottom control dock
│   │       └── ...             (loader, spells, house-selector, etc.)
│   ├── js/
│   │   ├── main.js              ES module entry point
│   │   ├── core/
│   │   │   ├── state.js         Centralized state namespaces
│   │   │   ├── events.js        Normalized event coordinator (resize, pointer, visibility)
│   │   │   └── constants.js     DEFAULT_SIZES registry, magic constants
│   │   ├── story/
│   │   │   ├── narrative.js     Letter reveal — paragraph fade-in system
│   │   │   ├── envelope.js      Envelope open/close sequence and timing
│   │   │   └── parchment.js     Scroll modal open/close event listeners
│   │   ├── audio/
│   │   │   ├── music.js
│   │   │   └── wind.js
│   │   ├── animation/
│   │   │   └── particles.js     Spark cluster engine
│   │   └── ...
│   └── assets/
│       ├── audio/
│       ├── video/               House background MP4 loops
│       ├── textures/            wood-table.png, parchments.png, mobile slots
│       └── ui/                  wax-seal.png, divider.png, envelope mobile slot
└── CHANGELOG.md
└── ASSETS.md
└── FEATURES.md
└── CODEBASE_GUIDE.md (this file)
└── ARCHITECTURE_AUDIT.md
```

---

## ⚙️ Core Subsystems

### 1. Parallel Preloader & Asset Loading
- Fetches house videos and background music concurrently on startup.
- Uses `ReadableStream` (`reader.read()`) to stream chunk-by-chunk and aggregate progress.
- Progress displayed as a 0%–100% glowing bar with a stardust particle tip.
- `DEFAULT_SIZES` lookup in `constants.js` prevents stalling when hosts omit `Content-Length`.
- 15-second timeout fallback: if any download fails, the preloader fades out and experience starts on-demand.

### 2. House Theme System
- Four houses: Gryffindor, Slytherin, Ravenclaw, Hufflepuff.
- CSS custom properties (`--house-primary`, `--house-accent`, `--house-overlay`, `--house-text`, `--house-glow`) defined in OKLCH color space in `variables.css`.
- Theme class (e.g. `.theme-slytherin`) applied to `<body>`. Switching theme cross-fades the house background video.
- Background video transitions: two overlapping `<video>` elements (`#bg-video` + buffer). Buffer fades in over 1.5s once `canplay` fires, then active fades out.

### 3. Letter Reveal — Paragraph Fade-In (`narrative.js`)
Replaces the previous character-by-character typewriter loop.

**How it works:**
1. `revealHogwartsLetter(msgEl, text)` calls `makeMsgLiving()` to inject time-of-day greeting and visit postscripts.
2. `_injectDropCapAndRender(el, text)` splits text by `\n`, creates one `<p class="magic-paragraph fade-phantom">` per paragraph.
3. Each paragraph is set via `pEl.textContent = para` — no span wrapping.
4. A `setTimeout` loop stagers reveal: `delay = 80ms + (index × 120ms)`.
5. On reveal: class `.fade-phantom` removed, `.writing` added → CSS transitions `opacity: 0 → 1` and `translateY(6px) → 0` in `0.5s`.
6. Signature paragraphs render an SVG `<path class="sig-path">` with stroke-dashoffset animation.
7. Drop-cap first letter gets a `<span class="drop-cap">` and a `spawnSparkCluster()` call.

**Total reveal time**: ~0.8s for a 4-paragraph letter.

### 4. Web Audio Procedural Synthesizers
All audio events synthesized via the Web Audio API — no WAV/MP3 sound effects:

| Synthesizer | Function | Technique |
|---|---|---|
| Wax seal crack | `playCrackSound` | Filtered white noise, 0.15s, bandpass 1200Hz |
| Scroll unfolding | `playScrollSound` | Pink+Brown noise, bandpass sweep 600→350Hz, 0.8s |
| Wind ambience | `wind.js` | White noise + LFO at 0.04–0.12Hz |
| Crystal wish bell | `ceremony.js` | Detuned sine chord, 5s exponential decay |

### 5. Parallax & Device Orientation
- Desktop: tracks `mousemove` → normalizes to `--mx`, `--my` CSS custom properties.
- Mobile: tracks `deviceorientation` (gyroscope) → same normalized offsets.
- Single `requestAnimationFrame` LERP loop at 60fps. All consuming modules read from `state.pointer`.
- Parallax disabled on the envelope scene on phones (`transform: none`) — gyro parallax feels erratic during portrait use.

### 6. Sparkle Particle Trail
- Overlay `<canvas id="sparkle-canvas">` spans the screen.
- Spawns `Sparkle` instances (position, angle, spin velocity, size decay, alpha) on pointer movement.
- Draws custom 4-pointed stars via canvas 2D context in a `requestAnimationFrame` loop.
- `spawnSparkCluster(x, y, intensity, burst)` API used by letter reveal and spell effects.

### 7. Interactive 3D Scroll Modal
- CSS `perspective: 1000px` + `transform-style: preserve-3d`.
- Flaps (`#scroll-flap-top`, `#scroll-flap-bottom`) rotate `115deg` outward on `.unfolded` class.
- Tilt on mouse/gyro: `rotateX(calc(var(--my) * -0.02deg)) rotateY(calc(var(--mx) * 0.02deg))`.
- Scroll paper uses deckle-edge SVG filter (`feTurbulence` + `feDisplacementMap`) for torn-paper border — disabled on `≤ 480px` for performance.
- Letter text shadow: `0 10px 32px rgba(40,22,5,0.32)` — natural cast shadow. No glow effects.

---

## 📱 Mobile-First Architecture

### Primary Design Targets
Android portrait phones: `360×640`, `393×851`, `412×915`, `430×932`.

### Breakpoint Tiers (`responsive.css`)
| Tier | Query | Role |
|---|---|---|
| Base (no query) | All | Desktop defaults |
| Tier 1 | `≤ 768px` | All phones — dock, scroll, house grid |
| Tier 2 | `≤ 480px` | Portrait primary — all component proportions |
| Tier 3 | `≤ 360px` | Narrowest compact Android |
| Landscape | `max-height: 500px + landscape` | Short landscape override |

### Mobile Asset Slot System
CSS variables in `variables.css` provide hot-swappable asset slots:
```css
/* Activate by updating these variables */
--body-bg-image-mobile      /* wood-table-mobile.png */
--parchment-bg-mobile       /* parchment-mobile.png */
--envelope-bg-mobile        /* envelope-mobile.png */
```
All slots fire on `@media (max-width: 767px) and (orientation: portrait)`.

---

## 🎨 CSS Design System

- **Theme tokens**: All house colors in OKLCH in `variables.css`. WCAG AA compliant.
- **Mobile-first clamp typography**: Values start from phone widths and scale up — desktop gets the upper bound of `clamp()`.
- **Deckle edges**: `feTurbulence + feDisplacementMap` inline SVG filter on scroll paper. Disabled on `≤ 480px` for GPU savings.
- **Safe areas**: `--sat`, `--sab`, `--sar`, `--sal` (env safe-area-inset) used in all paddings.
- **Dynamic height**: `100dvh` + `calc(var(--vh) * 100)` fallback for iOS Safari `dvh` timing bugs.
- **No external CSS frameworks** — all styling is custom, no Tailwind, no Bootstrap.

---

## 🛠️ Code Maintenance & Extension Patterns

### Updating content
- Edit `content.js` to change the recipient's name, message, house, video paths, or music path.
- No rebuild needed — the browser reads `content.js` as a global `BIRTHDAY_CONTENT` object.

### Swapping mobile assets
- Drop the PNG into `public/assets/textures/` or `public/assets/ui/`.
- Update the corresponding CSS variable in `variables.css`. (See [ASSETS.md](./ASSETS.md).)

### Adding a new spell
1. Add the spell to the spell selector in `index.html`.
2. Create a handler in `public/js/effects/spells.js`.
3. Register cleanup in the deactivation routine (set canvas `width = 0; height = 0`).
4. Follow the existing `fillSpell(name)` API pattern.

### Adding a CSS rule
- For mobile-specific: add to the appropriate tier in `responsive.css`.
- For global: add to the relevant layout file under `public/css/layout/`.
- Never add rules to `main.css` directly — it is an `@import` entry point only.

### Deployment
- Static host: drop the project folder (no build step).
- Vercel: `vercel.json` is present and configures passthrough routes for `index.html`.
- GitHub Pages, Netlify, or any CDN: works out of the box.
