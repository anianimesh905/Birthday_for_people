---
name: hp-video-background
description: >
  Updates the video background system of a Harry Potter birthday website, replacing the
  time-of-day getHours() switch statement with a Hogwarts house-based video loader.
  Outputs: a complete initVideoBackground() JS function (reads house video filenames from
  BIRTHDAY_CONTENT, crossfades on houseChanged event with 400ms fade-out / 600ms fade-in),
  CSS @keyframes gradient fallbacks for all 4 houses (animated background-size shift through
  2–3 house-toned hues, triggered by video onerror), and a video sourcing guide comment block
  with exact Pexels/Pixabay search terms and file-saving instructions.
  Use whenever the user asks to: "update the video background", "replace time-based video logic",
  "add house video switching", "add video crossfade", "house gradient fallback", "video onerror
  fallback", "hp-video-background", "remove getHours switch", "animated gradient background",
  "Hogwarts video background", or any request to modernise the birthday site video system for
  Harry Potter house theming.
---

# hp-video-background Skill

## Purpose

Replace the time-of-day video switching logic with a clean house-based system.
Output is **three clearly labeled sections** plus one comment block, all in one code response.

---

## Output Structure

Produce **exactly these four labeled blocks** in this order:

```
// ═══ 1. JavaScript — initVideoBackground() ═══
```
```
/* ═══ 2. CSS — House gradient fallbacks ═══ */
```
```
/* ═══ 3. CSS — Apply fallback on video error ═══ */
```
```
/* ═══════════════════════════════════════════════
   4. VIDEO SOURCING GUIDE
   ═══════════════════════════════════════════════ */
```

After the four blocks, add an **Integration Notes** section.

---

## 1. JavaScript Specification

### What to remove

The original code contains a block like this — remove it entirely:

```js
// REMOVE THIS ENTIRE BLOCK:
const hour = new Date().getHours();
switch(true) {
  case (hour >= 6 && hour < 12):  videoSrc = BIRTHDAY_CONTENT.morningVideo; break;
  case (hour >= 12 && hour < 17): videoSrc = BIRTHDAY_CONTENT.afternoonVideo; break;
  case (hour >= 17 && hour < 20): videoSrc = BIRTHDAY_CONTENT.sunsetVideo; break;
  default:                        videoSrc = BIRTHDAY_CONTENT.nightVideo; break;
}
```

### `initVideoBackground(cfg)` — the replacement

```js
function initVideoBackground(cfg = {}) {
  const video = document.getElementById('bg-video');
  if (!video) return;

  // Ensure CSS transition is set for crossfade (safe to set programmatically)
  video.style.transition = 'opacity 0.4s ease';

  // Build house → filename map from config
  const VIDEO_MAP = {
    gryffindor: cfg.gryffindorVideo ? `videos/${cfg.gryffindorVideo}` : null,
    slytherin:  cfg.slytherinVideo  ? `videos/${cfg.slytherinVideo}`  : null,
    ravenclaw:  cfg.ravenclawVideo  ? `videos/${cfg.ravenclawVideo}`  : null,
    hufflepuff: cfg.hufflepuffVideo ? `videos/${cfg.hufflepuffVideo}` : null,
  };

  // Track currently playing house to avoid redundant swaps
  let currentHouse = null;

  /**
   * Load and play a house video with crossfade.
   * @param {string} houseName - lowercase house name
   * @param {boolean} animate  - whether to crossfade (false on initial load)
   */
  function loadHouseVideo(houseName, animate = true) {
    if (houseName === currentHouse) return;
    currentHouse = houseName;

    const src = VIDEO_MAP[houseName];

    // Clear any fallback gradient class before attempting video
    video.classList.remove(
      'fallback-gryffindor', 'fallback-slytherin',
      'fallback-ravenclaw', 'fallback-hufflepuff'
    );

    // Attach onerror handler for this specific source
    video.onerror = () => applyFallback(houseName);

    if (!src) {
      // No video configured — go straight to fallback
      applyFallback(houseName);
      return;
    }

    if (animate) {
      // Step 1: fade out
      video.style.opacity = '0';
      setTimeout(() => {
        // Step 2: swap source and load
        video.src = src;
        video.load();
        video.play().catch(() => applyFallback(houseName));
        // Step 3: fade in (transition CSS handles the curve)
        video.style.transition = 'opacity 0.6s ease';
        video.style.opacity = '1';
        // Restore 400ms transition for next swap
        video.addEventListener('canplay', () => {
          video.style.transition = 'opacity 0.4s ease';
        }, { once: true });
      }, 400); // matches 0.4s fade-out duration
    } else {
      // Initial load — no animation, just play
      video.src = src;
      video.load();
      video.play().catch(() => applyFallback(houseName));
      video.style.opacity = '1';
    }
  }

  /**
   * Apply the house-specific animated gradient fallback.
   * Called when video fails to load or no src is configured.
   */
  function applyFallback(houseName) {
    video.style.opacity = '0'; // hide the broken video element
    const container = document.getElementById('bg-video-container') ||
                      document.getElementById('video-container') ||
                      document.body; // fallback: apply to body
    container.classList.remove(
      'fallback-gryffindor', 'fallback-slytherin',
      'fallback-ravenclaw', 'fallback-hufflepuff'
    );
    container.classList.add(`fallback-${houseName}`);
  }

  // ── Listen for house changes ───────────────────────────
  document.addEventListener('houseChanged', (e) => {
    loadHouseVideo(e.detail.house, true);
  });

  // ── Initial load ───────────────────────────────────────
  const defaultHouse = (cfg.defaultHouse || 'gryffindor').toLowerCase();
  loadHouseVideo(defaultHouse, false);
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  initVideoBackground(window.siteContent || {});
});
```

### Key implementation details

- `currentHouse` guard prevents re-loading the same video if the user re-clicks the active house badge
- `video.onerror` is reassigned on each load (not `addEventListener`) to avoid stacking listeners
- `applyFallback()` targets `#bg-video-container` first — output a note if this ID differs in their site
- Crossfade timing: 400ms fade-out → swap → 600ms fade-in (achieved by changing `transition` value mid-sequence)
- `video.play()` always `.catch()`-ed — autoplay policy blocks are silently handled by fallback

---

## 2. CSS Specification — Animated Gradient Fallbacks

### Design rules

- Applied to the **container** element (not `#bg-video` itself, which becomes `opacity: 0`)
- `background-size: 300% 300%` + `background-position` keyframe = smooth colour wash effect
- Each house cycles through 3 hues (start → mid → start) at 8 seconds, `ease-in-out`, `infinite`
- Fallback class names: `.fallback-gryffindor`, `.fallback-slytherin`, `.fallback-ravenclaw`, `.fallback-hufflepuff`

### Keyframe and class template

```css
/* Gryffindor: deep red → dark gold → deep red */
@keyframes gradGryffindor {
  0%   { background-position: 0% 50%;   }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%;   }
}
.fallback-gryffindor {
  background-image: linear-gradient(135deg, #3d0000, #740001, #8B4513, #D3A625, #8B4513, #740001, #3d0000);
  background-size: 300% 300%;
  animation: gradGryffindor 8s ease-in-out infinite;
}
```

Apply this pattern for all four houses using the colour tables below.

### House colour tables

| House | Colour 1 | Colour 2 (mid) | Colour 3 |
|---|---|---|---|
| Gryffindor | `#3d0000` dark red | `#D3A625` gold | `#8B4513` saddle brown |
| Slytherin  | `#0a1a0f` near black | `#1A472A` forest green | `#2a3a2a` dark sage |
| Ravenclaw  | `#060d1f` near black | `#0E1A40` navy | `#1a1a4a` indigo |
| Hufflepuff | `#7a5c00` dark amber | `#ECB939` golden yellow | `#c49a2a` warm amber |

Generate all 4 `@keyframes` + `.fallback-*` rule pairs.

---

## 3. CSS — Apply Fallback Context

The `.fallback-*` classes must also set `position: relative` and fill their container.
If the site uses `#bg-video-container`:

```css
#bg-video-container {
  position: fixed;
  inset: 0;
  z-index: -1;
  transition: background-image 0.4s ease;
}

#bg-video-container.fallback-gryffindor,
#bg-video-container.fallback-slytherin,
#bg-video-container.fallback-ravenclaw,
#bg-video-container.fallback-hufflepuff {
  /* animation already defined per class above */
}
```

---

## 4. Video Sourcing Guide Format

Produce this as a large comment block at the end of the JS output.
Use these **exact search queries** and notes:

```
/* ═══════════════════════════════════════════════════════
   VIDEO SOURCING GUIDE
   ═══════════════════════════════════════════════════════

   All videos should be:
   - Duration:    15–30 seconds (loops seamlessly)
   - Resolution:  1920×1080 or 1280×720
   - Format:      MP4 (H.264)
   - File size:   under 20MB for fast loading
   - Style:       slow/atmospheric, minimal motion — it plays behind text

   Save all files to:  /videos/  (same folder as your HTML file)

   ── GRYFFINDOR ──────────────────────────────────────────
   Filename: gryffindor.mp4  (must match gryffindorVideo in content.js)
   Mood: warm, fiery, golden

   Pexels search terms (try each):
     "fireplace crackling close up"
     "candles flickering dark background"
     "fire embers glowing slow motion"
     "golden light bokeh particles"
   Pixabay search terms:
     "fireplace loop"
     "burning fire dark"
     "candlelight ambient"

   ── SLYTHERIN ───────────────────────────────────────────
   Filename: slytherin.mp4  (must match slytherinVideo in content.js)
   Mood: dark, cool, mysterious, underwater or misty

   Pexels search terms (try each):
     "green underwater dark"
     "dark forest mist atmospheric"
     "smoke tendrils black background"
     "green particles dark loop"
   Pixabay search terms:
     "underwater green loop"
     "dark forest fog"
     "mystical smoke green"

   ── RAVENCLAW ───────────────────────────────────────────
   Filename: ravenclaw.mp4  (must match ravenclawVideo in content.js)
   Mood: celestial, deep space, starry night, cosmic

   Pexels search terms (try each):
     "stars night sky timelapse"
     "galaxy milky way slow"
     "blue nebula space loop"
     "aurora borealis night"
   Pixabay search terms:
     "starfield loop"
     "night sky stars timelapse"
     "blue galaxy space"

   ── HUFFLEPUFF ──────────────────────────────────────────
   Filename: hufflepuff.mp4  (must match hufflepuffVideo in content.js)
   Mood: warm, earthy, cosy, autumnal, nature

   Pexels search terms (try each):
     "autumn leaves falling slow motion"
     "golden wheat field breeze"
     "sunlight through trees bokeh"
     "honey bees flower close up"
   Pixabay search terms:
     "autumn forest warm loop"
     "golden nature bokeh"
     "sunbeams forest slow"

   ── HOW TO DOWNLOAD FROM PEXELS ─────────────────────────
   1. Go to pexels.com/videos and search the terms above
   2. Click a video → click "Free Download" → choose 1080p or 720p
   3. Rename the file to match the filename above (e.g. gryffindor.mp4)
   4. Move it into your /videos/ folder

   ── HOW TO DOWNLOAD FROM PIXABAY ────────────────────────
   1. Go to pixabay.com/videos and search the terms above
   2. Click a video → click "Free Download" → choose 1920×1080
   3. Rename and save to /videos/ as above

   Both sites are free for personal use — no attribution required
   for Pexels; Pixabay also requires no attribution but it's kind
   to credit the creator.

   ═══════════════════════════════════════════════════════ */
```

---

## Quality Checklist

Before outputting, verify:

- [ ] `getHours()` / time switch block is explicitly noted as removed
- [ ] `VIDEO_MAP` built from all 4 config keys
- [ ] `currentHouse` guard present
- [ ] `video.onerror` reassigned (not stacked with addEventListener)
- [ ] Crossfade: 400ms out → swap → 600ms in, with transition value change
- [ ] `video.play().catch()` on every play() call
- [ ] `applyFallback()` targets container, hides video element
- [ ] `houseChanged` listener present
- [ ] Initial load uses `animate: false`
- [ ] All 4 `@keyframes` + `.fallback-*` rules present
- [ ] Each keyframe uses correct house colours from the table
- [ ] `background-size: 300% 300%` on all fallback classes
- [ ] Video sourcing guide comment block present with all 4 houses
- [ ] Integration notes included
