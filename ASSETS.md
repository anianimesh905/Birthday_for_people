# Assets & Media System Manual

This document details the file directories, guidelines, formats, sizes, and preloading parameters for all audio, video, and image assets.

---

## 📂 Assets Directory Structure

To keep the repository clean and maintainable, all media assets are stored inside the `public/assets/` structure:

```
public/assets/
├── audio/          <- Background music and wave loops
├── images/         <- Vector graphics, house crests, border backgrounds
└── video/          <- Time of day background loops (MP4)
```

*Note: For backward compatibility, editable/overridable configuration media assets (like the primary background song `birthday.mp3` or house background videos `videos/slytherin.mp4`) are referenced in `content.js` and loaded dynamically.*

---

## 📹 Video Asset Guidelines

The house background videos stream behind the Hogwarts letter. Because they autoplay and loop continuously, they must meet strict guidelines to prevent mobile Safari crashes and layout delays:

- **Format**: MP4 (H.264 video codec, AAC audio codec).
- **Audio**: Videos **must** be encoded with no audio track (or fully muted) to comply with browser autoplay security constraints.
- **Resolution**: Max $1280 \times 720$ pixels. Do not use 1080p or 4K streams as they cause extreme rendering overhead and lag on low-end mobile devices.
- **FPS**: 24fps or 30fps.
- **File Sizes**: Maintain under **8 MB** per file. Highly compressed videos ensure instant loading and save mobile data.
- **Cross-Platform Streaming**: All background video nodes stream directly from their relative file paths instead of loading into browser memory blobs. This prevents memory bloat crashes on iOS Safari byte-range requests.

---

## 🎵 Audio Asset Guidelines

Audio assets must be optimized for browser preloading and Web Audio routing compatibility:

- **Format**: MP3 (Constant Bitrate 128kbps or 192kbps).
- **Preloading**: The primary background song is preloaded concurrently during the startup steps.
- **Preload Safeguard**: To prevent download locks on slow networks, a `DEFAULT_SIZES` registry is stored in `public/js/core/constants.js`. If a web server fails to supply a `Content-Length` header, this lookup prevents the loading screen progress bar from stalling.
- **Autoplay Unlock**: Since browsers block programmatic audio playback, the Web Audio engine stays in a suspended state until the user triggers a click/touch gesture anywhere on the preloader screen. This gesture resumes the context.

---

## 🖼️ Image & Vector Guidelines

Images must load instantly and adapt to varying screen densities:

- **Format**: SVGs are preferred for borders, signature lines, icons, and frames. This eliminates layout loading latency and guarantees pixel-perfect rendering at any screen zoom level.
- **House Crests**: PNGs (with transparent alpha channels) at $256 \times 256$ pixels. Smaller resolution files prevent memory bloating while maintaining high visual quality.
- **Vector Borders (Glacius/Herbivicus/Incendio)**: Handled using procedural CSS backgrounds or inline SVG vector tags to eliminate external asset dependencies.
