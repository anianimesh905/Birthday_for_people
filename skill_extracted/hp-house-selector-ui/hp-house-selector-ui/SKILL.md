---
name: hp-house-selector-ui
description: >
  Redesigns the #theme-switcher-panel from a beach/time-based birthday website into an animated
  Hogwarts House Selector UI component. Replaces 4 emoji time-buttons with 4 animated house badge
  buttons (Gryffindor 🦁, Slytherin 🐍, Ravenclaw 🦅, Hufflepuff 🦡), each with house-colored
  glow animations, shimmer-on-hover borders, emoji spin-on-select, crossfade video switching,
  colored toast notifications ("The Sorting Hat has chosen…"), and a custom "houseChanged" event
  for particle system integration. Panel is repositioned to top-right as a dark glass panel.
  Output is three clearly separated sections: HTML snippet, CSS block, and JavaScript module.
  Use this skill whenever the user asks to: "redesign the theme switcher", "add Hogwarts house
  badges", "replace time buttons with house selector", "hp house selector UI", "add house badge
  buttons", "sorting hat panel", "animated house switcher", "Hogwarts theme panel", or any request
  to build an interactive house-selection UI for a Harry Potter birthday website.
---

# hp-house-selector-ui Skill

## Purpose

Generate a complete, production-ready Hogwarts House Selector UI that replaces the
`#theme-switcher-panel` on a Harry Potter birthday website. Output is **three labeled code
sections** (HTML → CSS → JS) that drop into the existing site with no build step.

---

## House Design Tokens

Use these exact values throughout — they are canonical and must not be approximated:

| House | Primary | Accent | Shadow Glow | Emoji |
|---|---|---|---|---|
| Gryffindor | `#740001` | `#D3A625` | `rgba(211,166,37,0.7)` | 🦁 |
| Slytherin | `#1A472A` | `#AAAAAA` | `rgba(170,170,170,0.6)` | 🐍 |
| Ravenclaw | `#0E1A40` | `#946B2D` | `rgba(148,107,45,0.7)` | 🦅 |
| Hufflepuff | `#ECB939` | `#2A2A2A` | `rgba(236,185,57,0.8)` | 🦡 |

---

## Output Structure

Always output **exactly three fenced code blocks** with these labels, in this order:

```
<!-- ═══ 1. HTML ═══ -->
```
```
/* ═══ 2. CSS ═══ */
```
```
// ═══ 3. JavaScript ═══
```

After the three blocks, add a **"Integration Notes"** section in plain English explaining
where each block goes and what dependencies are assumed.

---

## 1. HTML Specification

Replace the existing `#theme-switcher-panel` contents entirely. The new structure:

```html
<div id="theme-switcher-panel">
  <button class="house-badge" data-house="gryffindor" aria-label="Select Gryffindor">
    <span class="badge-emoji">🦁</span>
    <span class="badge-name">Gryffindor</span>
  </button>
  <!-- repeat for slytherin, ravenclaw, hufflepuff -->

  <!-- Toast lives outside the panel but inside body -->
</div>
<div id="house-toast" aria-live="polite" aria-atomic="true"></div>
```

Rules:
- `data-house` values are always lowercase: `gryffindor`, `slytherin`, `ravenclaw`, `hufflepuff`
- `aria-label` for screen readers
- Toast `#house-toast` is a sibling of the panel, NOT nested inside it

---

## 2. CSS Specification

### Panel

```css
#theme-switcher-panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(10, 8, 20, 0.75);
  border: 1px solid rgba(211, 166, 37, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
}
```

### Badge Buttons

Base state — each badge is a flex column (emoji on top, name below):

```css
.house-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 0.5rem 0.75rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  position: relative;
  overflow: hidden;
}

.badge-emoji {
  font-size: 1.6rem;
  display: block;
  /* spin animation applied via JS class */
}

.badge-name {
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  font-family: 'Cinzel', 'Palatino Linotype', serif;
}
```

### House-specific active states (use CSS custom properties)

Generate one block per house. Active badge gets border color + glow box-shadow:

```css
.house-badge[data-house="gryffindor"].active {
  border-color: #D3A625;
  box-shadow: 0 0 12px rgba(211,166,37,0.7), inset 0 0 8px rgba(116,0,1,0.4);
  background: rgba(116,0,1,0.3);
}
/* repeat pattern for slytherin, ravenclaw, hufflepuff using tokens above */
```

### Keyframe animations

**Shimmer on hover** — sweeping highlight across the badge border:

```css
@keyframes badgeShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.house-badge:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255,255,255,0.15) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: badgeShimmer 0.8s ease-in-out;
  pointer-events: none;
}
```

**Emoji spin on select** — applied via `.spinning` class added/removed by JS:

```css
@keyframes emojiSpin {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.3); }
  100% { transform: rotate(360deg) scale(1); }
}

.badge-emoji.spinning {
  animation: emojiSpin 0.4s ease-out forwards;
}
```

**Pulse glow on active badge** — continuous subtle breathing:

```css
@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

.house-badge.active {
  animation: glowPulse 2.5s ease-in-out infinite;
}
```

### Toast

```css
#house-toast {
  position: fixed;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.7rem 1.4rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-family: 'Cinzel', serif;
  color: #fff;
  white-space: nowrap;
  z-index: 10000;
  transition: bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
  opacity: 0;
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  pointer-events: none;
}

#house-toast.visible {
  bottom: 2rem;
  opacity: 1;
}
```

House-specific toast background colors (set inline via JS using the token table):

```css
/* Applied via JS: toast.style.background = 'rgba(116,0,1,0.9)' etc. */
```

---

## 3. JavaScript Specification

### House Config Object

Define at top of the module — single source of truth:

```js
const HOUSES = {
  gryffindor: {
    emoji: '🦁',
    label: 'Gryffindor',
    primary: '#740001',
    accent: '#D3A625',
    toastBg: 'rgba(116,0,1,0.92)',
    videoSrc: null, // populated from siteContent.gryffindorVideo
  },
  slytherin: { emoji:'🐍', label:'Slytherin', primary:'#1A472A', accent:'#AAAAAA', toastBg:'rgba(26,71,42,0.92)', videoSrc:null },
  ravenclaw: { emoji:'🦅', label:'Ravenclaw', primary:'#0E1A40', accent:'#946B2D', toastBg:'rgba(14,26,64,0.92)', videoSrc:null },
  hufflepuff: { emoji:'🦡', label:'Hufflepuff', primary:'#ECB939', accent:'#2A2A2A', toastBg:'rgba(236,185,57,0.95)', toastColor:'#1a1a1a', videoSrc:null },
};
```

Note: Hufflepuff toast uses dark text (`toastColor: '#1a1a1a'`) because its background is light gold.

### `initHouseSelector(siteContent)` function

The main export. Called once on DOMContentLoaded, receives the `siteContent` config object:

```js
function initHouseSelector(siteContent) {
  // 1. Populate videoSrc from siteContent
  // 2. Attach click listeners to all .house-badge buttons
  // 3. Activate defaultHouse on load (no toast, no spin on initial load)
}
```

### `selectHouse(houseName, { showToast = true, spin = true } = {})` function

Core switching logic — always called when a badge is clicked AND on initial load:

```js
function selectHouse(houseName, { showToast = true, spin = true } = {}) {
  const house = HOUSES[houseName];
  if (!house) return;

  // 1. Update .active class on badges
  document.querySelectorAll('.house-badge').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.house === houseName);
  });

  // 2. Spin the selected emoji
  if (spin) {
    const emoji = document.querySelector(`.house-badge[data-house="${houseName}"] .badge-emoji`);
    emoji.classList.remove('spinning');
    void emoji.offsetWidth; // force reflow to restart animation
    emoji.classList.add('spinning');
    emoji.addEventListener('animationend', () => emoji.classList.remove('spinning'), { once: true });
  }

  // 3. Crossfade video
  const video = document.getElementById('bg-video');
  if (video && house.videoSrc) {
    video.style.opacity = '0';
    setTimeout(() => {
      video.src = house.videoSrc;
      video.load();
      video.play().catch(() => {}); // ignore autoplay policy errors
      video.style.opacity = '1';
    }, 300);
    // Note: #bg-video needs CSS transition: opacity 0.3s on it
  }

  // 4. Update #env-seal background
  const seal = document.getElementById('env-seal');
  if (seal) seal.style.backgroundColor = house.primary;

  // 5. Update body class
  document.body.className = document.body.className
    .replace(/\btheme-\w+/g, '')
    .trim();
  document.body.classList.add(`theme-${houseName}`);

  // 6. Show toast
  if (showToast) showHouseToast(house);

  // 7. Dispatch custom event for particle system
  document.dispatchEvent(new CustomEvent('houseChanged', {
    detail: { house: houseName, primary: house.primary, accent: house.accent }
  }));
}
```

### `showHouseToast(house)` function

```js
let toastTimer = null;

function showHouseToast(house) {
  const toast = document.getElementById('house-toast');
  if (!toast) return;

  toast.textContent = `The Sorting Hat has chosen… ${house.label}! ${house.emoji}`;
  toast.style.background = house.toastBg;
  toast.style.color = house.toastColor || '#ffffff';
  toast.style.borderColor = house.accent + '66'; // 40% opacity border

  clearTimeout(toastTimer);
  toast.classList.remove('visible');
  void toast.offsetWidth; // reflow
  toast.classList.add('visible');

  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2000);
}
```

### DOMContentLoaded bootstrap

```js
document.addEventListener('DOMContentLoaded', () => {
  // siteContent assumed to be available as an ES module import or window global
  const cfg = window.siteContent || {};

  // Hydrate videoSrc from config
  HOUSES.gryffindor.videoSrc = cfg.gryffindorVideo ? `videos/${cfg.gryffindorVideo}` : null;
  HOUSES.slytherin.videoSrc  = cfg.slytherinVideo  ? `videos/${cfg.slytherinVideo}`  : null;
  HOUSES.ravenclaw.videoSrc  = cfg.ravenclawVideo  ? `videos/${cfg.ravenclawVideo}`  : null;
  HOUSES.hufflepuff.videoSrc = cfg.hufflepuffVideo ? `videos/${cfg.hufflepuffVideo}` : null;

  // Wire up badge click listeners
  document.querySelectorAll('.house-badge').forEach(btn => {
    btn.addEventListener('click', () => selectHouse(btn.dataset.house));
  });

  // Activate default house silently (no toast on load)
  const defaultHouse = (cfg.defaultHouse || 'gryffindor').toLowerCase();
  selectHouse(defaultHouse, { showToast: false, spin: false });
});
```

---

## Integration Notes Template

Always append this section after the three code blocks:

```
## Integration Notes

**HTML** — Replace the contents of your existing `#theme-switcher-panel` div with
the HTML snippet above. Add the `<div id="house-toast">` as a direct child of `<body>`.

**CSS** — Paste into your main stylesheet (or a new `house-selector.css` file linked
in `<head>`). If you want to use the Cinzel font, add this to `<head>`:
  <link href="https://fonts.googleapis.com/css2?family=Cinzel&display=swap" rel="stylesheet">

**JavaScript** — Paste into a new `house-selector.js` file and link it before `</body>`:
  <script src="house-selector.js"></script>
Make sure this loads AFTER your content.js so `window.siteContent` is available.

**Video crossfade** — Add `transition: opacity 0.3s ease;` to your `#bg-video` CSS rule
so the fade between house videos is smooth.

**Particle integration** — Your particle script should listen for:
  document.addEventListener('houseChanged', (e) => {
    const { house, primary, accent } = e.detail;
    // update particle colors here
  });
```

---

## Quality Checklist

Before outputting, verify:

- [ ] All 4 house badge buttons present with correct `data-house` lowercase values
- [ ] All 4 active state CSS blocks use correct token colors from the table above
- [ ] `badgeShimmer`, `emojiSpin`, `glowPulse` keyframes all present
- [ ] Toast has house-specific background + handles Hufflepuff dark text
- [ ] `selectHouse()` handles: active class, spin, video crossfade, seal color, body class, toast, event
- [ ] `showToast: false, spin: false` on initial load (no animation on page load)
- [ ] `houseChanged` custom event dispatched with `{ house, primary, accent }`
- [ ] Integration notes included after code blocks
- [ ] Three labeled sections in correct order (HTML → CSS → JS)
