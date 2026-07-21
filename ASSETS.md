# Assets & Media System Manual

This document details the file directories, guidelines, formats, sizes, and preloading parameters for all audio, video, and image assets.

---

## 📂 Assets Directory Structure

All media assets are stored under `public/assets/`:

```
public/assets/
├── audio/                  ← Background music and wave loops
├── video/                  ← House background loops (MP4)
├── textures/               ← Surface textures (parchment, wood board)
│   ├── wood-table.png          Desktop board (in use)
│   ├── wood-table-mobile.png   ← DROP IN to activate portrait board
│   ├── parchments.png          Scroll paper texture (in use)
│   └── parchment-mobile.png    ← DROP IN to activate portrait parchment
└── ui/                     ← Icons, crests, dividers, seals
    ├── wax-seal.png
    ├── divider.png
    └── envelope-mobile.png     ← DROP IN to activate portrait envelope face
```

> `content.js` references primary background music and house video filenames dynamically.

---

## 📱 Mobile Asset Slots

The project has three prepared drop-in slots for portrait-specific assets. When you add the file, it activates automatically — **no code changes needed**.

| Asset | File Path | Breakpoint |
|---|---|---|
| Portrait wood board | `assets/textures/wood-table-mobile.png` | `≤ 767px + portrait` |
| Portrait parchment | `assets/textures/parchment-mobile.png` | `≤ 767px + portrait` |
| Portrait envelope face | `assets/ui/envelope-mobile.png` | `≤ 767px + portrait` |

### To activate a slot:
1. Drop the file into the path above.
2. Open `public/css/base/variables.css`.
3. For the board: update `--body-bg-image-mobile` to the new filename.
4. For parchment or envelope: uncomment `--parchment-bg-mobile` or `--envelope-bg-mobile`.

### Recommended specs for mobile assets:
- **wood-table-mobile.png**: Portrait crop of the wood grain texture. Ideal ratio: 9:16 (e.g. 1080×1920px). Show the natural vertical grain.
- **parchment-mobile.png**: Seamless parchment tile that looks correct at narrow widths. Ideal: 800×1200px or seamlessly tileable.
- **envelope-mobile.png**: Illustration of the envelope face optimised for portrait viewing. Ideal: 600×415px (same aspect ratio as the CSS-drawn envelope).

---

## 📹 Video Asset Guidelines

House background videos play behind the letter. They must meet these requirements to prevent mobile crashes and layout delays:

- **Format**: MP4 (H.264 video, no audio track or muted).
- **Resolution**: Max 1280×720px. Do not use 1080p or 4K — extreme overhead on low-end phones.
- **FPS**: 24fps or 30fps.
- **File Size**: Under 8 MB per file. Compressed for instant loading on mobile data.
- **Looping**: Videos must loop seamlessly. Use `loop` and `muted` HTML attributes.
- **Streaming**: Videos stream directly from relative paths — not preloaded into memory blobs — to prevent iOS Safari byte-range crashes.
- **Darkening**: A `rgba(0,0,0,0.22)` overlay is applied to ensure text readability on all house themes.

---

## 🎵 Audio Asset Guidelines

- **Format**: MP3, constant bitrate 128kbps or 192kbps.
- **Preloading**: The primary background song is preloaded concurrently during startup.
- **Preload Safeguard**: `DEFAULT_SIZES` in `public/js/core/constants.js` stores exact byte counts to keep the progress bar accurate when web hosts omit `Content-Length` headers.
- **Autoplay Unlock**: The Web Audio engine stays suspended until the user triggers a click or touch gesture. This satisfies browser autoplay policies on Android and iOS.

---

## 🖼️ Image & Vector Guidelines

- **Format**: SVGs preferred for borders, dividers, icons, and signatures — pixel-perfect at any density.
- **House Crests**: PNGs with transparent alpha at 256×256px.
- **Textures**: PNGs. Must be seamless tiles or large enough to `background-size: cover` without visible seams.
- **Spell overlays** (Glacius, Incendio, Herbivicus): Handled by procedural CSS or inline SVG — no external image dependencies.
