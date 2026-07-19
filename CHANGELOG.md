# Changelog

All notable changes to the Hogwarts Birthday project are documented here.

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
  - `Fumos`: SWirling light-gray mist scratch canvas.
  - `Accio`: Summoms 3D tilt-responsive image card.
  - `Amoris`: Floating vector heart drift simulation.
  - `Aguamenti`: Interactive SVG wave deforming on touch.

---

## [1.0.0] - 2026-07-11
### Added
- Initial project release with double-bezel card layouts.
- Dynamic theme variables mapped to Gryffindor, Slytherin, Ravenclaw, and Hufflepuff.
- Scroll typewriter typing animation.
- Translucent glassmorphic control dock.
