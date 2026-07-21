# Feature System Manual

This document details the core features and design pipelines of the Hogwarts Birthday project, including the story flow, animation pipeline, audio synthesis engine, environment subsystems, mobile experience design, and accessibility capabilities.

---

## 📖 Story Flow & Narrative Pipeline

The narrative is designed as a three-act linear progression that dynamically updates based on local time and repeat visits:

```
[Act I: Arrival] → [Act II: Reading McGonagall's Letter] → [Act III: Wish Ceremony & Finale]
```

### 1. Act I: Arrival (Cinematic Preloader & Delivery)
- The user is greeted by a parchment preloader. Marauder's Map style footsteps traverse the screen as resources download.
- If it is a repeat visit, the preloader reads the visitor count from `localStorage`.
- Skip buttons allow bypassing the intro instantly.
- The cinematic finishes with the envelope landing in the center, emitting a snap sound and radial dust ring.

### 2. Act II: Reading McGonagall's Letter
- Tapping the wax seal triggers crack particles, a light flash, and unfolds the envelope.
- If it is a first visit, the **Castle Awakening Sequence** begins: the letter dims, the camera zooms toward the castle, windows light up sequentially, and floating candles ignite.
- Once completed, the parchment fades back in and the letter text appears immediately via staggered paragraph fade-in.
- The letter greeting adapts dynamically to the visitor's local hour:
  - `05:00 - 11:59`: "Good morning..."
  - `12:00 - 16:59`: "Good afternoon..."
  - `17:00 - 19:59`: "Good evening..."
  - `20:00 - 04:59`: "Good night..."
- On repeat visits, a unique welcome-back phrase is prepended, and one of four random postscript fragments is appended to the sign-off.
- Paragraphs fade in staggered 120ms apart. The full letter is readable in approximately **0.8 seconds**.
- The signature is rendered as an SVG stroke-dashoffset animation (1.6 seconds).
- The drop-cap first letter receives a small spark cluster on reveal.
- When reading is complete, a subtle warmth pulse (`0 0 14px rgba(212,175,55,0.22)`) briefly highlights the paper edges.

### 3. Act III: Wish Ceremony & Finale
- Closing the letter scroll triggers the **Birthday Wish Ceremony** (Act III) on first read:
  - Interface controls fade to 0 opacity.
  - Floating candles glide into a perfect ring above the castle silhouette.
  - Background music and winds fade to complete silence.
  - Staggered emotional text prompts fade in: *"Before you leave..."*, *"Close your eyes..."*, *"Make one wish."*
  - Tapping the screen triggers a crystal chime, shoots a vertical beam of light from the moon, forms a golden star heart constellation, and rises golden ember sparkles.
  - After 8.5 seconds of quiet reflection, the normal website layout returns and music swells back.

---

## 📱 Mobile-First Design System

The primary experience is designed for Android portrait devices. Desktop is a secondary viewport.

### Target Devices
| Width | Height | Device |
|---|---|---|
| 360px | 640px | Galaxy A series, compact Android |
| 393px | 851px | Pixel 7, Moto G |
| 412px | 915px | Pixel 6 Pro, Galaxy S series |
| 430px | 932px | Large Android flagship |

### Breakpoint Architecture (`responsive.css`)
The responsive system uses three tiers:

| Tier | Breakpoint | Purpose |
|---|---|---|
| 1 | `≤ 768px` | All phones — dock, scroll paper, house grid baseline |
| 2 | `≤ 480px` | Portrait primary — proportions designed for phones, not scaled desktop |
| 3 | `≤ 360px` | Narrowest Android compact phones |

### Mobile-First Decisions
- **`justify-content: space-between`** distributes hero and envelope intentionally across portrait height — no dead space.
- **Decorative ring** (`#hero::after`) hidden on phones — reduces noise on tight screens.
- **Envelope proportions**: `55vw` width — designed for hand grip, not desktop scale.
- **Typography**: All clamp values start from phone widths upward, desktop gets the upper bound.
- **Bottom dock**: Icon-only on mobile (labels/EQ bars hidden). Buttons `48×48px` minimum tap target.
- **Touch**: `touch-action: manipulation` on all interactive elements (eliminates 300ms tap delay).

### Mobile Asset Slots
Three prepared drop-in slots activate automatically on portrait phones:
- `assets/textures/wood-table-mobile.png` → portrait wood board
- `assets/textures/parchment-mobile.png` → portrait parchment texture
- `assets/ui/envelope-mobile.png` → portrait envelope face

See [ASSETS.md](./ASSETS.md) for activation instructions and recommended specs.

---

## 🎬 Letter Reveal System

The letter text reveal was redesigned from character-by-character typewriter to a paragraph fade-in system.

### Previous System (removed)
- `writeChar()` loop: 22ms per character.
- 400 characters × 22ms = ~9 seconds per paragraph.
- 4 paragraphs = 18–25 seconds before the user could read.

### Current System
- Each `<p>` has `opacity: 0; transform: translateY(6px)` by default.
- JavaScript adds the `.writing` class after a staggered delay (`80ms + 120ms × index`).
- CSS transitions the paragraph to `opacity: 1; transform: translateY(0)` in `0.5s cubic-bezier(0.16, 1, 0.3, 1)`.
- A 4-paragraph letter is fully visible in **~0.8 seconds**.
- The SVG signature stroke animation plays independently after its paragraph fades in.

---

## 🌀 Animation Pipeline

The animation engine is optimized for 60fps mobile execution using GPU-accelerated CSS transforms and low-overhead canvas loops:

- **GPU Acceleration**: Heavy visual operations use CSS `transform` (`translate3d`, `rotateX`, `scaleX`) promoted to GPU compositor layers via `will-change: transform`.
- **Sparkle Canvas Trail**: A pointer-tracking `<canvas>` spawns 4-pointed star particles on pointer movement. Processed entirely in a `requestAnimationFrame` loop with no layout calculations.
- **SVG Signature**: Stroke-dashoffset animation on `<path>` elements simulates a quill writing signature at `1.6s`.

### Simplified Background (current)
The background has been simplified to reduce GPU load on mobile:

| Layer | Status |
|---|---|
| House background video | ✅ Active — primary visual element |
| Volumetric fog | ✅ Active — very subtle |
| Static light rays | ✅ Active |
| Static castle silhouette | ✅ Active |
| Moon glow | ✅ Active — very slow pulse |
| Ambient canvas particles | ❌ Removed |
| Floating feathers | ❌ Removed |
| Decorative birds / butterflies | ❌ Removed |
| Film grain | ❌ Removed |
| Decorative floating candles | ❌ Removed (event-driven only) |

---

## 🎵 Web Audio Synthesis Engine

The project synthesizes high-quality audio events procedurally using the browser's Web Audio API:

```
[White/Pink Noise Buffer] → [BiquadFilterNode (Bandpass)] → [GainNode] → [Destination]
```

### Procedural Synthesizers
- **Wax Seal Fracture (`playCrackSound`)**: Short filtered white noise (0.15s), high-Q bandpass (1200Hz), exponential decay gain.
- **Scroll Unfolding (`playScrollSound`)**: Sweeps bandpass from 600Hz → 350Hz over 0.8s on Pink/Brown noise to simulate paper friction.
- **Weather Wind (`wind.js`)**: White noise modulated by an LFO at 0.04Hz–0.12Hz to produce organic wind.
- **Crystal Wish Bell (`ceremony.js`)**: Detuned sine oscillator chord with 5-second exponential decay gain.

### Adaptive Soundtrack
- Normal playback: music at full volume, unfiltered.
- Letter open: warm lowpass filter (900Hz–1300Hz) cuts high-frequencies and drops volume — keeps the letter reading atmosphere quiet.
- Wish ceremony: music fades out completely for silent reflection.

---

## 🌍 Living Environment System

- **Time-Aware Overlays**: Background shifts color: Sunrise (warm gold-red), Afternoon (clear sky), Sunset (deep violet), Night (OLED dark gradient).
- **Moon Phase Calculator**: Automatically computes the lunar phase from a reference date and draws the SVG moon mask.
- **Seasonal Particles** (event-driven, not continuous): Spring: cherry blossom petals. Summer: fireflies and golden dust. Autumn: orange/brown leaves. Winter: snowflakes.
- **Castle Glow**: Tower windows fade in and out slowly (3.5s cycle) to simulate candlelight.
- **Creature AI** (event-driven):
  - *Curious Owl*: Perches on the central tower; flies away if cursor moves within 45px.
  - *Glowing Butterflies*: Flutter near flowers; scatter if cursor approaches within 65px.
  - *White Stag*: Walk cycle behind the castle, leaving blue-white sparkle trail.

---

## ♿ Accessibility & Compatibility

- **Focus Trapping**: Any open modal (house selector, spell modal, letter scroll, treasure modal) traps focus within its boundaries for keyboard navigation.
- **Keyboard Access**:
  - Wish ceremony overlay: `tabindex="0"`, `role="button"`, Enter/Space trigger.
  - Spell tags: replaced `<span>` with `<button type="button">` with `focus-visible` styling.
  - Music toggle: `aria-label` updates dynamically ("Play background music" / "Pause background music — Now Playing").
  - Escape key closes all modals and overlays.
- **Screen Reader Support**: `aria-live` regions, semantic landmarks, text-equivalent descriptions on icon badges.
- **OKLCH Color Contrast**: All house palettes calculated in OKLCH — WCAG AA (4.5:1 minimum) guaranteed against dark backgrounds.
- **PWA Status Bar**: `<meta name="theme-color">` updates in real time to match the active house, integrating with Android Chrome's status bar.
- **Reduced Motion**: `prefers-reduced-motion: reduce` disables all heavy animations, tilts, and filters.
- **Low Power Mode**: `.low-power` class (applied automatically) reduces glow intensity, disables fog, grain, and EQ bar animations.
