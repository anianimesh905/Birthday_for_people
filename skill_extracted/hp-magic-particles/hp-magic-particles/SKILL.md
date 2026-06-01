---
name: hp-magic-particles
description: >
  Replaces the birthday website's sparkle canvas with a Harry Potter themed
  particle system. Produces a complete, drop-in initMagicParticles() function
  with four particle types: wand sparks (gold ✦, fast clusters), Lumos orbs
  (glowing sine-pulsed circles), lightning bolts (⚡ flash-appear, 0.3–0.6s),
  and house stars (★ drifting upward). Colors shift on "houseChanged" custom
  event across Gryffindor/Slytherin/Ravenclaw/Hufflepuff palettes. Includes an
  "envelopeTapped" burst emitting 40 radial sparks from envelope center.
  Mobile: particle count capped at 20 for screens under 768px.
  Trigger on: "magic particles", "HP particles", "canvas sparkle HP", "Hogwarts
  particles", "wand sparks canvas", "Lumos orbs animation", "house particle
  colors", "replace sparkle script", "envelopeTapped burst", "birthday canvas
  Harry Potter", or any request to add/replace magical particle effects on the
  birthday or Sanctuary website with a Harry Potter theme.
---

# HP Magic Particles Skill

## What this skill produces

A single **self-contained JS block** — `initMagicParticles()` — that replaces
whatever sparkle/canvas code currently lives in `script.js`. The function
manages its own canvas, animation loop, particle pool, event listeners, and
house-colour state. Nothing else needs to change in the HTML.

---

## How to use this skill

1. **Read** `references/particles.md` in full — it contains the complete
   annotated JS. Present it **verbatim** in a single ```javascript
   fenced block. Do not summarise, truncate, or restructure it.

2. **After the code block**, include the **Integration Guide** below.

3. **For variations** (different particle counts, tweak velocities, add a
   fifth type, change a colour, alter burst size): apply the edit directly
   to the code before presenting. State what was changed in one sentence.
   Never ask for clarification on straightforward numeric or colour tweaks.

---

## Integration guide template

After the code block always include:

```
### How to drop in

1. In script.js, delete the existing sparkle/canvas init function and its
   call site entirely (commonly initSparkles(), initCanvas(), or similar).

2. Paste the full initMagicParticles() block in its place.

3. At the bottom of script.js (inside DOMContentLoaded or equivalent) call:
       initMagicParticles();

4. Dispatch house changes from your house-selector logic:
       window.dispatchEvent(new CustomEvent('houseChanged', {
         detail: { house: 'gryffindor' }  // slytherin / ravenclaw / hufflepuff
       }));

5. Dispatch the envelope burst when the user taps the envelope:
       window.dispatchEvent(new CustomEvent('envelopeTapped', {
         detail: { x: envelopeCenterX, y: envelopeCenterY }
       }));
   x/y are viewport-level pixel coordinates from getBoundingClientRect().

6. The canvas appends to document.body with position:fixed, z-index:0,
   pointer-events:none — it won't block clicks. Pass options to override:
       initMagicParticles({ canvasId: 'sparkle-canvas' });
```

---

## Particle type quick-reference

| Type | Shape  | Freq | Lifespan  | Motion              | Special         |
|------|--------|------|-----------|---------------------|-----------------|
| A    | ✦ text | 40 % | 1.5–2.5 s | fast burst cluster  | radial on burst |
| B    | arc()  | 30 % | 4–6 s     | slow drift + sine   | glow shadow     |
| C    | ⚡ text | 15 % | 0.3–0.6 s | stationary          | instant flash   |
| D    | ★ text | 15 % | 3 s       | slow upward drift   | top fade-out    |

---

## Event contract

| Event           | Payload                    | Effect                          |
|-----------------|----------------------------|---------------------------------|
| `houseChanged`  | `{ house: 'gryffindor' }` | swap colour palette, no restart |
| `envelopeTapped`| `{ x: Number, y: Number }` | emit 40 Type-A sparks radially  |

---

## Reference file

→ Read **`references/particles.md`** for the complete JS.
  Present its entire contents verbatim. Do not omit any section.
