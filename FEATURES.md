# Feature System Manual

This document details the core features and design pipelines of the Hogwarts Birthday project, including the story flow, animation pipeline, audio synthesis engine, environment subsystems, and accessibility capabilities.

---

## 📖 Story Flow & Narrative Pipeline

The narrative is designed as a three-act linear progression that dynamically updates based on local time and repeat visits:

```
[Act I: Arrival] -> [Act II: Reading McGonagall's Letter] -> [Act III: Wish Ceremony & Finale]
```

### 1. Act I: Arrival (Cinematic Preloader & Delivery)
- The user is greeted by a parchment preloader. Marauder's Map style footsteps traverse the screen as resources download.
- If it is a repeat visit, the preloader reads the visitor count from `localStorage`.
- Skip buttons allow bypassing the intro instantly.
- The cinematic finishes with the envelope landing in the center, emitting a snap sound and radial dust ring.

### 2. Act II: Reading McGonagall's Letter
- Tapping the wax seal triggers crack particles, a light flash, and unfolds the envelope.
- If it is a first visit, the **Castle Awakening Sequence** begins: the letter dims, the camera zooms toward the castle, windows light up sequentially, and floating candles ignite.
- Once completed, the parchment fades back in and the typewriter reveal writes out the text paragraph-by-paragraph.
- The letter greeting adapts dynamically to the visitor's local hour:
  - `05:00 - 11:59`: "Good morning..."
  - `12:00 - 16:59`: "Good afternoon..."
  - `17:00 - 19:59`: "Good evening..."
  - `20:00 - 04:59`: "Good night..."
- On repeat visits, a unique welcome-back phrase is prepended ("*The castle walls seem warmer, remembering your presence here.*"), and one of four random postscript fragments is appended to the sign-off.
- The text is written character-by-character using a wet-ink simulation (starting blurred and sepia, slowly drying to dark charcoal-gray).
- When the reader reaches the bottom of the letter, the paper boundary pulses with a warm golden glow.

### 3. Act III: Wish Ceremony & Finale
- Closing the letter scroll triggers the **Birthday Wish Ceremony** (Act III) on first read:
  - Interface controls fade to 0 opacity.
  - Floating candles glide into a perfect ring above the castle silhouette.
  - Background music and winds fade to complete silence.
  - Staggered emotional text prompts fade in: *"Before you leave..."*, *"Close your eyes..."*, *"Make one wish."*
  - Tapping the screen triggers a crystal chime, shoots a vertical beam of light from the moon, forms a golden star heart constellation, and rises golden ember sparkles.
  - After 8.5 seconds of quiet reflection, the normal website layout returns and music swells back.

---

## 🌀 Animation Pipeline

The animation engine is optimized for 60fps mobile execution by relying on GPU-accelerated CSS transformations and low-overhead canvas loops:

- **GPU Acceleration**: Heavy visual operations (like preloader progress bar scales, envelope folds, and scroll tilts) use CSS `transform` (e.g. `scaleX`, `translate3d`, `rotateX`) and are promoted to dedicated GPU compositor layers via `will-change: transform`. This avoids browser layout reflow storms.
- **Sparkle Canvas Trail**: The pointer-tracking canvas sparkle engine processes coordinates via a single `<canvas>` element. Particles are updated and drawn using the canvas 2D context in a simple requestAnimationFrame loop, avoiding layout calculations.
- **Typewriter Wet-to-Dry Ink**: Runs via a character-span animation. As each character is injected, it receives a class that scales and filters it (`filter: sepia(0.8) blur(0.4px)`), transition-easing to default sharp rendering over 900ms.

---

## 🎵 Web Audio Synthesis Engine

The project synthesizes high-quality audio events procedurally using the browser's Web Audio API, avoiding heavy WAV/MP3 sound effects:

```
[White/Pink Noise Buffer] -> [BiquadFilterNode (Bandpass)] -> [GainNode] -> [Destination]
```

### 1. Procedural Synthesizers
- **Wax Seal Fracture (`playCrackSound`)**: Spawns short filtered white noise (0.15s) with a high-Q bandpass filter (1200Hz) and exponential decay gain envelope.
- **Scroll Unfolding (`playScrollSound`)**: Sweeps a bandpass filter from 600Hz down to 350Hz over 0.8s on a combined Pink/Brown noise buffer to simulate physical friction.
- **Weather Wind Synthesizer (`wind.js`)**: Generates white noise modulated by a low-frequency oscillator (LFO) running at 0.04Hz–0.12Hz to produce organic rising and falling wind.
- **Crystal Wish Bell (`ceremony.js`)**: Synthesizes a chord sequence using detuned sine oscillators with long exponential decay gain values (5s).

### 2. Adaptive Soundtrack
- An adaptive gain-control and filter node chain links the background music elements.
- When the envelope is closed, the music plays unfiltered at normal volume.
- When the letter is opened, a warm lowpass filter (900Hz–1300Hz) cuts high-frequencies and drops the volume, giving the typewriter typing sound effect center stage.
- When the wish ceremony triggers, the music fades out completely to establish silent reflection.

---

## 🌍 Living Environment System

The Hogwarts landscape exists as an independent, continuously living system:

- **Time-Aware Overlays**: The background shifts color overlays dynamically: Sunrise (warm gold-red), Afternoon (clear sky), Sunset (deep violet-purple), and Night (OLED dark gradient).
- **Moon Phase Calculator**: Automatically computes the lunar phase from a reference date and draws the SVG moon mask dynamically.
- **Seasonal Particles**:
  - *Spring*: Fluttering cherry blossom petals.
  - *Summer*: Organic glowing green-gold fireflies and golden dust.
  - *Autumn*: Drifting orange/brown leaves.
  - *Winter*: Fluttering snowflakes.
- **Castle Glow**: Tower windows fade in and out slowly over 3.5 seconds to simulate internal candlelight.
- **Creature AI**:
  - *Curious Owl*: Perches on the central tower; flies away if the cursor moves within 45px.
  - *Glowing Butterflies*: Flutter near bottom flowers; scatter rapidly if the cursor approaches within 65px.
  - *White Stag*: Walk cycle behind the castle tower z-index masks, leaving a trailing path of blue-white sparkles.

---

## ♿ Accessibility & Compatibility

Accessibility (A11y) and mobile compatibility are baked into the design system:

- **Focus Trapping**: Any open modal card (Sorting Hat house choices, Spell input modal, Letter scroll modal, Treasure modal) traps focus within its boundaries to support keyboard tab navigation.
- **Screen Reader Support**: Semantic landmarks, `aria-live` regions for typewriter narratives, and clean text description equivalents on icon badges.
- **OKLCH Color Contrast**: All house palettes are calculated using modern OKLCH models to guarantee WCAG AA compliant contrast (4.5:1 minimum) against dark backgrounds.
- **PWA Status Bar Mappings**: Updates the theme meta tag (`<meta name="theme-color">`) in real time to match the active house background, integrating the browser status bar on Android/iOS.
- **Reduced Motion Support**: Bypasses heavy animations, tilts, and filters when `prefers-reduced-motion: reduce` is active.
