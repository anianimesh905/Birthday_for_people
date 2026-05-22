---
name: web-premium
description: >
  Transforms ordinary websites and web UIs into premium, high-end digital experiences. Use this skill
  whenever the user wants to upgrade, elevate, or make a website look more professional, luxurious,
  polished, or high-quality. Triggers include: "make this look premium", "upgrade the design",
  "make it look expensive", "high-end UI", "luxury feel", "polish the site", "make it look
  professional", "elevate the design", "modernize this", "make this look like a top-tier product",
  "better UX", "improve aesthetics", "redesign", or any request to improve the visual quality of
  a website. Also triggers when the user pastes HTML/CSS and asks for improvements, or shares a
  screenshot/description of a site and wants it to look better. Apply this skill proactively
  whenever creating any web UI from scratch to ensure premium output from the start.
---

# Web Premium Skill

## Overview

This skill transforms average web interfaces into premium, high-end digital products. It covers
design principles, code patterns, micro-interactions, typography, color systems, and the subtle
details that separate a $10 template from a $100K product.

---

## Decision Tree: What Kind of Upgrade?

```
User wants to upgrade a website
│
├── Existing code provided?
│   ├── YES → Audit → Apply Premium Layers (see: Audit Checklist below)
│   └── NO  → Build premium from scratch (see: Premium Foundations)
│
├── Type of site?
│   ├── Landing/Marketing → Conversion-focused premium (see: references/landing-premium.md)
│   ├── App/Dashboard     → UX-focused premium (see: references/app-premium.md)
│   ├── Portfolio/Personal → Aesthetic-focused premium (see: references/portfolio-premium.md)
│   └── E-commerce        → Trust-focused premium (see: references/ecommerce-premium.md)
│
└── Vibe/Tone?
    ├── Corporate/Serious  → Clean, dark navy, sharp typography
    ├── Creative/Artistic  → Bold contrast, editorial layout, expressive type
    ├── Soft/Emotional     → Pastel palette, rounded, warm serif fonts
    └── Minimal/Zen        → Maximum whitespace, single accent, restraint
```

---

## Premium Foundations

### 1. Typography Hierarchy (the #1 differentiator)

Premium sites use 2–3 type faces maximum with clear hierarchy:

```css
/* Premium Type Scale — always use this or a custom variant */
:root {
  --font-display: 'Playfair Display', 'Cormorant Garamond', serif;   /* Hero headlines */
  --font-body: 'Inter', 'DM Sans', 'Plus Jakarta Sans', sans-serif;  /* Body text */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;            /* Code / labels */

  /* Fluid type scale — responsive without breakpoints */
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.2vw,  0.875rem);
  --text-sm:   clamp(0.875rem, 0.83rem + 0.25vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.3vw,  1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.6vw,  1.375rem);
  --text-xl:   clamp(1.375rem, 1.1rem  + 1.4vw,  2rem);
  --text-2xl:  clamp(2rem,     1.5rem  + 2.5vw,  3.5rem);
  --text-3xl:  clamp(2.5rem,   1.8rem  + 3.5vw,  5rem);

  /* Tracking (letter-spacing) rules */
  --tracking-tight:  -0.03em;   /* Large display text */
  --tracking-normal:  0em;      /* Body */
  --tracking-wide:    0.08em;   /* Labels, captions, badges */
  --tracking-widest:  0.15em;   /* All-caps micro text */

  /* Line height */
  --leading-none:    1;
  --leading-tight:   1.15;    /* Headlines */
  --leading-snug:    1.35;    /* Sub-headlines */
  --leading-normal:  1.6;     /* Body copy */
  --leading-relaxed: 1.75;    /* Long-form reading */
}
```

**Typography rules for premium feel:**
- Negative letter-spacing on large headings (`-0.02em` to `-0.04em`)
- Never set body text smaller than `clamp(1rem, ...)` 
- Use `font-feature-settings: "kern" 1, "liga" 1, "calt" 1` for optical refinement
- Limit line length: `max-width: 65ch` for readable paragraphs

---

### 2. Color System (not a palette — a system)

```css
:root {
  /* ── Neutrals ─────────────────────────────── */
  --color-ink-900: #0a0a0f;     /* Near-black background (dark mode) */
  --color-ink-800: #111118;     /* Card backgrounds */
  --color-ink-700: #1a1a24;     /* Elevated surfaces */
  --color-ink-400: #6b6b80;     /* Muted text */
  --color-ink-200: #c8c8d4;     /* Secondary text */
  --color-ink-50:  #f5f5fa;     /* Near-white (light mode bg) */

  /* ── Accent (single hero color — pick ONE) ── */
  --color-accent:       #7c6af4;   /* Primary CTA */
  --color-accent-hover: #6b59e8;
  --color-accent-muted: rgba(124, 106, 244, 0.12);  /* Subtle fills */
  --color-accent-glow:  rgba(124, 106, 244, 0.35);  /* Glow effects */

  /* ── Semantic ─────────────────────────────── */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger:  #ef4444;

  /* ── Surfaces ─────────────────────────────── */
  --surface-glass: rgba(255, 255, 255, 0.04);
  --surface-glass-border: rgba(255, 255, 255, 0.08);
}
```

**Color rules:**
- Use ONE primary accent color + neutrals (80% of premium sites)
- Add subtle color through gradients and glows, not flat fills
- Never use pure `#000000` or `#ffffff` — use near-black/near-white
- Test contrast ratios: body text ≥ 4.5:1, large text ≥ 3:1

---

### 3. Spacing & Layout (the "breathing room" principle)

```css
:root {
  /* 8px base grid */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */

  /* Section padding — generous on premium sites */
  --section-y: clamp(5rem, 10vw, 10rem);
  
  /* Max content widths */
  --width-prose: 65ch;
  --width-content: 72rem;   /* 1152px */
  --width-wide: 90rem;      /* 1440px */
}
```

**Spacing rules:**
- Premium sites have 40–60% more vertical whitespace than average sites
- Section padding: minimum `5rem` top/bottom, prefer `8–12rem`
- Never cram — when in doubt, add more space

---

### 4. Visual Depth System

Premium UIs layer depth through light, shadow, and subtle texture:

```css
/* ── Glassmorphism ─────────────────────── */
.glass {
  background: var(--surface-glass);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-xl);
}

/* ── Shadow Scale ──────────────────────── */
:root {
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
  --shadow-xl: 0 24px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.1);
  
  /* Colored glow shadows for CTAs */
  --shadow-glow: 0 8px 32px var(--color-accent-glow),
                 0 2px 8px rgba(0,0,0,0.15);
}

/* ── Border Radius ─────────────────────── */
:root {
  --radius-sm:   6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;
}

/* ── Gradient Toolkit ──────────────────── */
:root {
  /* Mesh gradient overlay */
  --gradient-mesh: radial-gradient(at 20% 50%, var(--color-accent-muted) 0px, transparent 60%),
                   radial-gradient(at 80% 20%, rgba(var(--accent-rgb), 0.08) 0px, transparent 60%);
  
  /* Premium card gradient border */
  --gradient-border: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));
}
```

---

### 5. Micro-Interactions (the "feel" layer)

```css
/* ── Base Transitions ──────────────────── */
:root {
  --transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base:   250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);  /* Bouncy */
  --transition-enter:  600ms cubic-bezier(0.16, 1, 0.3, 1);      /* Smooth enter */
}

/* ── Premium Button ────────────────────── */
.btn-primary {
  background: var(--color-accent);
  color: #fff;
  padding: 0.75em 1.75em;
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: var(--text-sm);
  letter-spacing: 0.01em;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform var(--transition-fast),
              box-shadow var(--transition-fast),
              background var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
  background: var(--color-accent-hover);
}

.btn-primary:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: var(--shadow-xs);
}

/* Shimmer effect on hover */
.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transform: translateX(-100%);
  transition: transform 400ms ease;
}

.btn-primary:hover::after {
  transform: translateX(100%);
}

/* ── Premium Card ──────────────────────── */
.card-premium {
  background: var(--surface-glass);
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: transform var(--transition-base),
              box-shadow var(--transition-base),
              border-color var(--transition-base);
}

.card-premium:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(255,255,255,0.14);
}
```

---

### 6. Animation Patterns

```css
/* ── Scroll-Triggered Fade Up ──────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--transition-enter),
              transform var(--transition-enter);
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.reveal-group > * { transition-delay: calc(var(--i, 0) * 80ms); }
```

```javascript
// Intersection Observer for scroll reveals
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Auto-assign stagger index
document.querySelectorAll('.reveal-group > *').forEach((el, i) => {
  el.style.setProperty('--i', i);
});
```

---

### 7. Premium Hero Section Pattern

```html
<!-- Hero with ambient gradient + clean layout -->
<section class="hero">
  <div class="hero-bg">
    <div class="hero-glow hero-glow--1"></div>
    <div class="hero-glow hero-glow--2"></div>
    <div class="hero-noise"></div>
  </div>
  <div class="hero-content">
    <span class="hero-eyebrow">Label / Tag</span>
    <h1 class="hero-title">Headline That <em>Stands Out</em></h1>
    <p class="hero-subtitle">One clear sentence that explains the value.</p>
    <div class="hero-cta">
      <button class="btn-primary">Primary Action</button>
      <button class="btn-ghost">Secondary Link →</button>
    </div>
  </div>
</section>
```

```css
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: var(--section-y) var(--space-8);
}

.hero-bg { position: absolute; inset: 0; z-index: 0; }

.hero-glow {
  position: absolute;
  width: clamp(400px, 50vw, 800px);
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: drift 12s ease-in-out infinite alternate;
}
.hero-glow--1 {
  background: var(--color-accent);
  top: -20%; left: -10%;
  animation-delay: 0s;
}
.hero-glow--2 {
  background: var(--color-accent-hover);
  bottom: -20%; right: -10%;
  animation-delay: -6s;
}

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(5%, 3%) scale(1.05); }
}

/* Subtle noise overlay for texture */
.hero-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: 0.4;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 56rem;
}

.hero-eyebrow {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-4);
  padding: 0.4em 1em;
  border: 1px solid var(--color-accent-muted);
  border-radius: var(--radius-full);
  background: var(--color-accent-muted);
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-6);
}

.hero-title em {
  font-style: italic;
  /* Optional: gradient text */
  background: linear-gradient(135deg, var(--color-accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-ink-200);
  max-width: 46ch;
  margin: 0 auto var(--space-10);
}

.hero-cta {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}
```

---

## Audit Checklist (for upgrading existing sites)

When handed existing code, run through this list and fix each failing item:

### Typography
- [ ] Using a display font for headings? (not just a bold sans-serif)
- [ ] Negative letter-spacing on h1/h2? (`-0.02em` to `-0.04em`)
- [ ] Fluid type sizes? (clamp-based, not fixed px)
- [ ] Line length capped? (`max-width: 65ch` on body text)
- [ ] Font rendering: `text-rendering: optimizeLegibility`?

### Color & Contrast
- [ ] Using a proper CSS variable system, not scattered hex values?
- [ ] Pure black/white replaced with near-black/near-white?
- [ ] Single accent color (not 3–4 competing brand colors)?
- [ ] Contrast ratios pass WCAG AA?

### Spacing
- [ ] Section padding ≥ `5rem` vertical?
- [ ] Consistent 8px grid spacing?
- [ ] Sufficient whitespace around headlines?

### Components
- [ ] Buttons have hover + active states with transitions?
- [ ] Cards have hover lift effect?
- [ ] Inputs have proper focus ring (not default browser outline)?
- [ ] Icons are SVG, sized consistently?

### Motion
- [ ] Transitions use easing curves (not `linear`)?
- [ ] Hover transitions < 300ms?
- [ ] `prefers-reduced-motion` respected?

### Layout
- [ ] Max-width constraint on content? (not edge-to-edge on wide screens)
- [ ] CSS Grid or Flexbox (not floats/positioning hacks)?
- [ ] Mobile-first responsive?

---

## Common Anti-Patterns to Fix

| ❌ Non-Premium | ✅ Premium Fix |
|---|---|
| `font-size: 14px` body text | `font-size: clamp(1rem, 0.95rem + 0.3vw, 1.125rem)` |
| `background: #f0f0f0` | `background: #f5f5fa` with subtle gradient |
| `border-radius: 4px` everywhere | Radius scale: 6/10/16/24/32/9999 |
| `transition: all 0.3s` | `transition: transform 200ms cubic-bezier(0.4,0,0.2,1)` |
| `box-shadow: 0 2px 4px black` | Multi-layer shadow with opacity |
| `color: #333333` on body | CSS var with visual scale |
| `padding: 20px` on sections | `padding: clamp(5rem, 10vw, 10rem) 0` |
| Flat buttons (no depth) | Hover lift + glow shadow + shimmer |
| Google Fonts loaded slowly | Preconnect + `font-display: swap` |
| No scroll animations | Intersection Observer reveal |

---

## Reference Files

For domain-specific premium patterns, read the relevant reference:

- `references/landing-premium.md` — Marketing/landing pages (hero, features grid, testimonials, CTA)
- `references/app-premium.md` — Dashboards and web applications (sidebar, data tables, modals)
- `references/portfolio-premium.md` — Personal/creative portfolios (case studies, grid, about)
- `references/tokens.md` — Full design token system copy-paste reference
