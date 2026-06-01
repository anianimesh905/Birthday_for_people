---
name: hp-owl-envelope
description: >
  Redesigns the envelope section of a Harry Potter birthday website with Hogwarts owl-post
  aesthetics: aged-parchment background (#E8D5A3), cursive "To:" address block (Dancing Script),
  faint house crest watermark, 4 animated sepia owl SVG silhouettes drifting left-to-right
  (replacing shimmer particles), wax seal redesigned as a 58px circle with CSS drip pseudo-element
  and dynamic house initial letter, and owl delivery burst on envelope tap. Output: HTML, CSS, JS.
  Use whenever the user asks to: "redesign the envelope", "Harry Potter envelope", "wax seal
  redesign", "Hogwarts letter envelope", "replace particles with owls", "animated owls",
  "owl delivery animation", "parchment envelope", "cursive address block", "hp-owl-envelope",
  or any request to style a birthday site envelope with HP / wizarding world aesthetics.
---

# hp-owl-envelope Skill

## Purpose

Produce a **complete three-section code output** (HTML → CSS → JS) that transforms the
birthday website envelope scene into a Hogwarts owl-post letter. The code must be drop-in
ready — no build step, no external libraries beyond a Google Font.

---

## Output Structure

Always output **exactly three fenced code blocks** labeled in this order:

```
<!-- ═══ 1. HTML ═══ -->
```
```
/* ═══ 2. CSS ═══ */
```
```
// ═══ 3. JavaScript ═══
```

Then append an **Integration Notes** section in plain English.

---

## 1. HTML Specification

### Envelope wrapper structure

```html
<div id="envelope-scene">

  <!-- Envelope back flap -->
  <div id="env-back"></div>

  <!-- Main envelope body -->
  <div id="envelope">

    <!-- Faint watermark crest — behind everything else -->
    <div class="env-watermark" aria-hidden="true">⚡</div>

    <!-- Cursive address block -->
    <div class="env-address" aria-label="Addressed to [friendName]">
      <span class="env-address-to">To:</span>
      <span class="env-address-name">[friendName from siteContent]</span>
      <span class="env-address-line2">The Bedroom</span>
    </div>

    <!-- Wax seal — sits on the envelope flap join -->
    <div id="env-seal">
      <span id="env-seal-letter">G</span>
    </div>

    <!-- 4 owl silhouettes (replace .env-particle divs) -->
    <div class="env-owl owl-1" aria-hidden="true">
      <!-- inline SVG — see SVG spec in references/owl-svg.md -->
    </div>
    <div class="env-owl owl-2" aria-hidden="true"><!-- SVG --></div>
    <div class="env-owl owl-3" aria-hidden="true"><!-- SVG --></div>
    <div class="env-owl owl-4" aria-hidden="true"><!-- SVG --></div>

  </div><!-- /#envelope -->

  <!-- Tap hint -->
  <p id="envelope-hint">Tap to unseal — an owl delivered this just for you ✦</p>

</div><!-- /#envelope-scene -->
```

**Key rules:**
- Remove all 8 `.env-particle` divs — replace entirely with `.env-owl` divs
- `#env-seal-letter` is a `<span>` inside `#env-seal` — updated by JS on house change
- `aria-hidden="true"` on decorative owls and watermark

### Inline SVG for each owl

See `references/owl-svg.md` for the exact path. Use this structure per owl:

```html
<svg class="owl-svg" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
  <path d="[owl path from reference]" fill="#5a3e2b" />
</svg>
```

---

## 2. CSS Specification

### Envelope base reskin

```css
#envelope,
#env-back {
  background-color: #E8D5A3;
  /* keep existing sizing/positioning from original site */
}
```

### Watermark crest

```css
.env-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 160px;
  opacity: 0.04;
  color: #5a3e2b;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  line-height: 1;
}
```

### Address block

```css
.env-address {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.env-address-to {
  font-family: 'Dancing Script', cursive;
  font-size: 0.85rem;
  color: #3d2b1f;
  opacity: 0.7;
}

.env-address-name {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2a1a0e;
  line-height: 1.2;
}

.env-address-line2 {
  font-family: 'Dancing Script', cursive;
  font-size: 0.95rem;
  color: #3d2b1f;
  opacity: 0.8;
}
```

### Wax seal redesign

```css
#env-seal {
  position: absolute;
  /* keep existing centering — just override size and appearance */
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--house-primary, #740001);
  border: 2px solid var(--house-accent, #D3A625);
  box-shadow:
    inset 0 0 0 3px rgba(0,0,0,0.2),   /* inner ring */
    0 4px 12px rgba(0,0,0,0.5),         /* depth shadow */
    0 2px 4px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
}

/* Wax drip blob behind the seal circle */
#env-seal::before {
  content: '';
  position: absolute;
  width: 72px;
  height: 68px;
  background: var(--house-primary, #740001);
  opacity: 0.55;
  border-radius: 48% 52% 60% 40% / 45% 55% 45% 55%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -46%);
  z-index: -1;
  filter: blur(2px);
}

#env-seal-letter {
  font-family: 'Cinzel', 'Palatino Linotype', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--house-accent, #D3A625);
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
  user-select: none;
  position: relative;
  z-index: 1;
}
```

### Owl animations

Each owl drifts left→right across the envelope, wraps back to left when complete.

```css
/* ── Owl base ────────────────────────────────────────────── */
.env-owl {
  position: absolute;
  pointer-events: none;
  opacity: 0.5;
  z-index: 3;
}

.owl-svg {
  fill: #5a3e2b;
  display: block;
}

/* ── Per-owl sizing, speed, vertical position, delay ──────── */
.owl-1 { width: 22px; top: 18%; animation: owlDrift 10s linear infinite; }
.owl-2 { width: 16px; top: 55%; animation: owlDrift 13s linear infinite 3s; }
.owl-3 { width: 19px; top: 30%; animation: owlDrift  8s linear infinite 1.5s; }
.owl-4 { width: 14px; top: 72%; animation: owlDrift 14s linear infinite 6s; }

/* ── Drift keyframe ───────────────────────────────────────── */
@keyframes owlDrift {
  0%   { transform: translateX(-30px); opacity: 0;   }
  5%   { opacity: 0.5; }
  95%  { opacity: 0.5; }
  100% { transform: translateX(calc(100% + 60px)); opacity: 0; }
}

/* 
   The translateX end value must cover the full envelope width.
   Use a generous calc() or vw unit relative to the envelope container.
   A safe value: translateX(min(400px, 100vw))
   Adjust if envelope width is known.
*/
@keyframes owlDrift {
  0%   { left: -30px;  opacity: 0;   }
  5%   { opacity: 0.5; }
  90%  { opacity: 0.5; }
  100% { left: calc(100% + 40px); opacity: 0; }
}

/* ── Delivery burst — triggered on envelope tap ───────────── */
.owl-delivering {
  animation-duration: 0.8s !important;
  opacity: 0.85 !important;
}
```

**Note:** Use `left` animation (not `transform: translateX`) so the owls drift
relative to the envelope container width naturally. Make sure `#envelope` has
`position: relative` and `overflow: hidden`.

---

## 3. JavaScript Specification

### House initial map

```js
const HOUSE_INITIALS = {
  gryffindor: 'G',
  slytherin:  'S',
  ravenclaw:  'R',
  hufflepuff: 'H',
};
```

### `updateSealForHouse(houseName)`

Called when a house is selected. Updates the seal letter and CSS custom properties
so the seal color tracks the active house:

```js
function updateSealForHouse(houseName) {
  // Update seal letter
  const letter = document.getElementById('env-seal-letter');
  if (letter) {
    letter.textContent = HOUSE_INITIALS[houseName] || 'H';
  }

  // CSS custom properties are set on :root by the house switcher (hp-house-selector-ui).
  // If they're not already being set there, set them here:
  // document.documentElement.style.setProperty('--house-primary', HOUSES[houseName].primary);
  // document.documentElement.style.setProperty('--house-accent',  HOUSES[houseName].accent);
}
```

### Listen for `houseChanged` event

Integrates with the `hp-house-selector-ui` skill's custom event:

```js
document.addEventListener('houseChanged', (e) => {
  const { house, primary, accent } = e.detail;
  updateSealForHouse(house);

  // Also update CSS vars so seal ::before drip changes color too
  document.documentElement.style.setProperty('--house-primary', primary);
  document.documentElement.style.setProperty('--house-accent',  accent);
});
```

### Owl delivery animation on envelope tap

```js
function triggerOwlDelivery() {
  // Pick owl-1 (largest, most visible) as the delivery owl
  const deliveryOwl = document.querySelector('.owl-1');
  if (!deliveryOwl) return;

  deliveryOwl.classList.add('owl-delivering');
  setTimeout(() => deliveryOwl.classList.remove('owl-delivering'), 800);
}

// Attach to the envelope tap — works with both click and touchstart
const envelope = document.getElementById('envelope');
if (envelope) {
  envelope.addEventListener('click', triggerOwlDelivery, { once: false });
}
```

**Note:** `{ once: false }` — the delivery burst can trigger every time the
envelope is tapped, not just once. If the original site has a single-open
behaviour, the host page can remove this listener after the envelope opens.

### Init on DOMContentLoaded

```js
document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.siteContent || {};

  // Set address name from config
  const nameEl = document.querySelector('.env-address-name');
  if (nameEl && cfg.friendName) nameEl.textContent = cfg.friendName;

  // Set initial seal letter from defaultHouse
  const defaultHouse = (cfg.defaultHouse || 'gryffindor').toLowerCase();
  updateSealForHouse(defaultHouse);
});
```

---

## House CSS Variables

The seal colors depend on `--house-primary` and `--house-accent` being set on `:root`.
If `hp-house-selector-ui` is also installed it sets these automatically. If not, set defaults:

```css
:root {
  --house-primary: #740001; /* Gryffindor default */
  --house-accent:  #D3A625;
}
```

---

## Quality Checklist

Before outputting, verify:

- [ ] 4 `.env-owl` divs present with correct class names (`owl-1` … `owl-4`)
- [ ] Inline SVG inside each owl div (from references/owl-svg.md spec)
- [ ] `.env-watermark` present with opacity 0.04
- [ ] `.env-address` block with `env-address-to`, `env-address-name`, `env-address-line2`
- [ ] `#env-seal` has `::before` drip pseudo-element
- [ ] `#env-seal-letter` is inside `#env-seal`
- [ ] `owlDrift` keyframe uses `left` property
- [ ] `.owl-delivering` overrides `animation-duration` to `0.8s`
- [ ] `houseChanged` event listener updates seal letter AND CSS vars
- [ ] `DOMContentLoaded` sets `friendName` from siteContent
- [ ] Integration notes included

---

## Read Before Generating

→ **`references/owl-svg.md`** — the exact SVG `<path>` for the owl silhouette,
  plus the `viewBox` and sizing rationale. Read this before writing any owl HTML.
