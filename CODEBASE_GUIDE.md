# Antigravity Developer Guide: Golden Summer Sunset Birthday Scrapbook

This document provides a complete technical guide to the architecture, subsystems, and code patterns of the birthday website. It is designed to give the Antigravity coding agent (or any developer) immediate, comprehensive understanding of the project.

---

## 📂 File Architecture Overview

The codebase is a high-performance, vanilla front-end application with no external dependencies (no bundlers, frameworks, or npm modules). It relies purely on native HTML5, CSS3, and ES6+ JavaScript.

1. **[index.html](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/index.html)**: Defines the semantic structure of the document. Contains the preloader screen overlays, background video nodes (active & buffer), envelope structure, 3D scroll container, audio EQ button, and theme switcher.
2. **[content.js](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/content.js)**: Configures user-facing variables (friend's name, message scroll text, background video filenames, theme colors, and audio path) as a single global configuration object `BIRTHDAY_CONTENT`.
3. **[style.css](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/style.css)**: Implements the premium design system, including layout structures, glassmorphism filters, deckle-edge SVGs, transitions, device orientation responsive media queries, and keyframe animations.
4. **[script.js](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/script.js)**: Orchestrates the parallel asset preloader, local memory media caching, theme cross-fading, mouse/accelerometer parallax math, interactive event handlers, and synthesized procedural audio.

---

## ⚙️ Core Subsystems

### 1. Parallel Preloader & Blob URL Caching
* **Purpose**: Since the background video files total **~54 MB** and the audio is **~4.8 MB**, on-demand loading would cause lag and stuttering. The preloader downloads all files concurrently at startup.
* **Mechanism**:
  - The script fetches the list of assets defined in `content.js` concurrently.
  - Using the Fetch API's `ReadableStream` interface (`reader.read()`), the engine streams chunk-by-chunk and aggregates the total bytes loaded.
  - Progress is displayed as a 0%–100% glowing progress bar with a floating "stardust" particle tip.
  - **Asset Sizing**: To circumvent issues where web hosts omit the `Content-Length` header, a `DEFAULT_SIZES` lookup is defined with exact byte counts.
  - **Caching**: Once fully downloaded, chunks are compiled into a `Blob` and converted to memory Object URLs (`URL.createObjectURL(blob)`), which are cached in the `PRELOADED_ASSETS` registry.
  - **Timeout Safeguard**: If any download fails or the loader takes longer than **15 seconds** (e.g. on slow connections), the preloader initiates a fallback recovery, fading the loader out and sliding into on-demand loading so the user is never blocked.

### 2. Time-Aware Cross-fading Themes
* **Purpose**: The background video transitions smoothly between four local time-of-day phases: Morning, Afternoon, Sunset, and Night.
* **Mechanism**:
  - On first load, the script gets `new Date().getHours()` to set the initial theme.
  - **Smooth Transitions**: To prevent video flickering or blank frames, the DOM includes two overlapping video elements: `#bg-video` (active) and a dynamically created sibling `bufferVideo`.
  - When switching themes, the new video (using the preloaded Blob URL) loads into `bufferVideo`. Once it reaches the `oncanplay` state, `bufferVideo` plays and transitions its opacity from `0` to `1` over `1.5s`, while the active video fades to `0` and pauses.

### 3. Web Audio Procedural Synthesizers
The project avoids static sound files for UI transitions, instead synthesizing realistic, high-quality audio events procedurally using the browser's Web Audio API.

* **Wax Seal Cracking Sound (`playCrackSound`)**:
  - Generates a short (0.15s) buffer of filtered noise.
  - Applies a rapid exponential gain ramp to simulate a physical snap.
  - Uses a `bandpass` filter centered at `1200Hz` with a high Q factor (`4`) to match wax fracturing.
* **Scroll Paper Rustling Sound (`playScrollSound`)**:
  - Blends Pink noise (deep fiber rustle) and Brown noise (integral of white noise) to form a thick paper texture.
  - Spawns random high-frequency crackle events to simulate folding parchment fibers.
  - Employs a dynamic `bandpass` filter that sweeps from `600Hz` down to `350Hz` in sync with the visual unfolding duration.
* **Ambient Ocean Wave Loop (`startAmbientWaves`)**:
  - Generates 4 seconds of deep looping Brown noise.
  - Routes the signal through a lowpass filter modulated by an LFO (low-frequency oscillator) running at `0.12Hz` (~8.3-second wave cycle).
  - An interval slowly updates the gain between `0.03` and `0.08` in sync with the LFO, matching the breathing swell of physical waves.

### 4. Parallax & Device Orientation Math
* **Purpose**: Elements (the scroll and the background) tilt slightly in response to user movements to create a 3D glass depth effect.
* **Mechanism**:
  - Tracks client mouse positioning on desktops (`mousemove`) and gyroscope tilt coordinates on mobile (`deviceorientation`).
  - Standardizes coordinates into normalized offsets and computes a linear interpolation (Lerp) algorithm running inside a `requestAnimationFrame` loop.
  - Updates the CSS custom variables `--mx` and `--my` globally on the document root.

### 5. Sparkle Particle Trail (`initSparkleTrail`)
* **Purpose**: Drags a trail of glowing, 4-pointed stars behind the user's cursor or touch point.
* **Mechanism**:
  - An overlay `<canvas id="sparkle-canvas">` spans the screen.
  - Spawns `Sparkle` instances (storing position, angle, spin velocity, size decay, and alpha parameters) on pointer movements.
  - The canvas render loop rotates and scales the coordinates of each particle to draw a custom 4-pointed star, cleaning up old instances once their life spans hit 0.

### 6. Interactive 3D Scroll Modal
* **Purpose**: Houses the main birthday text in an elegant unfolding container.
* **Mechanism**:
  - Uses CSS perspective (`perspective: 1000px`) and 3D transforms (`transform-style: preserve-3d`).
  - Unrolls using top and bottom flaps (#`scroll-flap-top` and #`scroll-flap-bottom`) that rotate 115 degrees outwards (`rotateX(115deg)`) when the `.unfolded` class is added.
  - Text is animated into view using a typewriter typing loop.

---

## 🎨 Styling Architecture (CSS Design System)

* **Theme Tokens**: Variable tokens are defined inside `:root` for text, wax seal reds, and envelope colors. Component theme variants (`.theme-morning`, `.theme-night`, etc.) re-assign background glass values dynamically.
* **Deckle Edges**: The scroll background shape is distorted organically using an inline SVG fractal noise filter (`feTurbulence` and `feDisplacementMap` under filter ID `#deckle-edge`).
* **Fluid Layouts & Safe Areas**: Layout sizes employ fluid scaling variables (`clamp()`) and standard mobile layout variables (`--sat`, `--sab`, `--sar`, `--sal`) to account for notched iOS/Android display bezels.

---

## 🛠️ Code Maintenance & Extension Patterns

* **Updating Assets**: Background videos and music files can be replaced by editing `content.js` and saving files locally.
* **Content Customization**: The recipient's name, message body, date, and sender signatures can be tweaked directly in `content.js`.
* **CSS Additions**: Loading styles reside at the bottom of `style.css` in a dedicated `PRELOADING SCREEN` section. Focus outlines and EQ visualizers are organized under `ACCESSIBILITY & INTERACTIVE UPGRADES`.
