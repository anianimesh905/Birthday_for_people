# Changelog

All notable changes to the Hogwarts Birthday project are documented here.

---

## [4.0.0] - 2026-07-21
### Changed — Mobile-First Direction
- **Primary target** shifted to Android portrait devices (360×640 → 430×932). Desktop is now secondary.
- Completely rewrote `responsive.css` as a **3-tier mobile-first breakpoint system**:
  - Tier 1 (`≤ 768px`): shared mobile base — dock, scroll paper, house grid
  - Tier 2 (`≤ 480px`): portrait primary — all layout proportions designed for hand-held phones
  - Tier 3 (`≤ 360px`): narrowest Android compact phones
- Refactored `app.css` layout to use `justify-content: space-between` (from `space-evenly`) and `max()` padding so content fills portrait screens intentionally.
- Made all typography in `app.css` (`#greeting-label`, `#hero-friend-name`, `#birthday-date`, `#tagline`) mobile-first with clamp values starting from phone widths.
- Removed desktop-inherited decorative ring (`#hero::after`) on all phone viewports — reduces visual noise on small screens.
- Updated `envelope.css` envelope proportions to `55vw / 38vw` — designed for hand grip rather than scaled-down desktop.
- Updated `parchment.css` `#scroll-inner` base padding from `2.8rem 2.2rem 2.8rem 3.4rem` → `2.2rem 1.4rem 2.2rem 2.2rem` (mobile-first).
- Letter body text (`#scroll-message p`) set to left-aligned on narrow screens for easier narrow-width reading.

### Added — Mobile Asset Slots
Three drop-in asset slots prepared — adding the file automatically activates it with zero code changes:
- `assets/textures/wood-table-mobile.png` → activates via `--body-bg-image-mobile` CSS variable in `variables.css`
- `assets/textures/parchment-mobile.png` → activates via `--parchment-bg-mobile` CSS variable (uncomment in `variables.css`)
- `assets/ui/envelope-mobile.png` → activates via `--envelope-bg-mobile` CSS variable (uncomment in `variables.css`)

All slots trigger on `@media (max-width: 767px) and (orientation: portrait)`.

### Fixed — Bottom Control Dock
- Buttons now use `background: rgba(30, 22, 12, 0.65)` — warm dark translucent, never pure black.
- Border changed to `1.5px solid var(--house-accent)` — visually matches the active house color.
- All 5 interaction states (default, hover, active, focus-visible, disabled) fully declared for mobile.
- Icon font-size raised from `1.15rem` → `1.25rem` for cleaner rendering.

### Fixed — Letter Glow Removed
- `#scroll-paper-bg` `box-shadow` replaced from heavy `0 35px 80px rgba(0,0,0,0.6)` → `0 10px 32px rgba(40,22,5,0.32)`.
- `magic-glow-pulse` reduced from `0 0 35px rgba(212,175,55,0.82)` → `0 0 14px rgba(212,175,55,0.22)`.
- Parchment now reads as paper resting on a table, not a glowing container.

---

## [3.5.0] - 2026-07-21
### Changed — Letter Opening Speed
- **Replaced per-character typewriter loop** with a staggered **paragraph fade-in** system.
  - Before: 22ms per character × full letter = 18–25 seconds before readable.
  - After: Each `<p>` fades from `opacity: 0, translateY(6px)` → fully visible with `0.5s` CSS transition, staggered `120ms` apart. Full letter visible in ~0.8 seconds.
- Removed `.magic-char` span wrapping from regular text paragraphs — plain `textContent` sets now.
- Kept the signature SVG stroke-dashoffset animation (elegant) — now plays at `1.6s` instead of `2.2s`.
- Kept drop-cap `<span class="drop-cap">` with a spark cluster on reveal.
- Updated `.magic-paragraph` CSS: now uses `transform: translateY(6px)` → `0` with `0.5s cubic-bezier(0.16, 1, 0.3, 1)`.

### Added
- `vercel.json` at project root — passthrough route for static hosting; fixes Vercel `NOT_FOUND` 404 errors on sub-paths.

---

## [3.0.0] - 2026-07-17
### Added
- Created a standard `public/` directory separating assets and source components.
- Introduced `public/js/ARCHITECTURE.md` and `MIGRATION_REPORT.md` documenting file splits.
- Exported global window helpers like `window.fillSpell` to preserve HTML event mappings.
### Changed
- Refactored monolithic `script.js` into **23 ES6 JavaScript modules** organized under `public/js/` (divided into core, audio, environment, animation, story, ui, and effects layers).
- Decoupled particle loops from global canvas scopes by introducing dynamic sizing parameters.
- Restructured `style.css` into **16 modular CSS stylesheets** under `public/css/` loaded via `@import` cascades.
- Updated `index.html` at the workspace root to use modular styles and the main entry script module.
### Removed
- Deleted legacy monolithic `script.js` and `style.css` files from the root to eliminate duplicate source codes.

---

## [2.5.0] - 2026-07-16
### Added
- Developed Act I: **Interactive Owl Post Cinematic Sequence** with LFO-modulated background whistling winds and synthesized hooting.
- Developed Act II: **Castle Awakening Cinematic Sequence** that scales down scroll sheets, pans the camera, flickers windows, and ignites candle flames sequentially.
- Developed Act III: **Birthday Wish Ceremony** (Circular candle gathering, staggered text prompts, glass harp chimes, vertical moonbeam overlays, and heart-shaped constellations).
- Integrated **Living Environment Simulation** overlays for morning, afternoon, sunset, and night.
- Added **Visit Count Recognition** and whispered postscript fragments based on visit logs in LocalStorage.
- Added rare creature behaviors (startled tower owl, flower-perching glowing butterflies, and walking Patronus stag behind castle layers).
### Changed
- Bypassed video blob preloading to stream background video relative files directly, eliminating mobile Safari memory crashes.
- Throttled trail spawn rates to 60ms to prevent browser lag on Android devices.

---

## [2.0.0] - 2026-07-14
### Added
- Integrated the interactive **Spell Caster Overlay** bottom sheet.
- Implemented spell effects:
  - `Lumos/Nox`: Dynamic vignette overlay with cursor-following sparkles.
  - `Revelio`: Radial sparkle shockwave revealing hidden chests.
  - `Expecto Patronum`: Multi-animal canvas flight loops.
  - `Glacius`: Frosted blue-white scratch overlay canvas.
  - `Fumos`: Swirling light-gray mist scratch canvas.
  - `Accio`: Summons 3D tilt-responsive image card.
  - `Amoris`: Floating vector heart drift simulation.
  - `Aguamenti`: Interactive SVG wave deforming on touch.

---

## [1.0.0] - 2026-07-11
### Added
- Initial project release with double-bezel card layouts.
- Dynamic theme variables mapped to Gryffindor, Slytherin, Ravenclaw, and Hufflepuff.
- Scroll typewriter typing animation.
- Translucent glassmorphic control dock.
