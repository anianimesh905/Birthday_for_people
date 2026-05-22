# Complete Design Token Reference

## Full CSS Variables Block (copy-paste starter)

```css
:root {
  /* ── Typography ───────────────────────────────── */
  --font-display: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  --text-xs:   clamp(0.75rem,  0.72rem + 0.18vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.84rem + 0.22vw, 1rem);
  --text-base: clamp(1rem,     0.96rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1.05rem + 0.45vw, 1.375rem);
  --text-xl:   clamp(1.375rem, 1.15rem + 1.2vw,  2rem);
  --text-2xl:  clamp(2rem,     1.6rem  + 2vw,    3rem);
  --text-3xl:  clamp(2.5rem,   1.9rem  + 3vw,    5rem);

  --tracking-tighter: -0.04em;
  --tracking-tight:   -0.02em;
  --tracking-normal:   0em;
  --tracking-wide:     0.05em;
  --tracking-wider:    0.1em;
  --tracking-widest:   0.15em;

  --leading-none:     1;
  --leading-tight:    1.15;
  --leading-snug:     1.35;
  --leading-normal:   1.6;
  --leading-relaxed:  1.75;
  --leading-loose:    2;

  /* ── Spacing (8px grid) ─────────────────────── */
  --space-px:  1px;
  --space-0:   0;
  --space-1:   0.25rem;
  --space-2:   0.5rem;
  --space-3:   0.75rem;
  --space-4:   1rem;
  --space-5:   1.25rem;
  --space-6:   1.5rem;
  --space-8:   2rem;
  --space-10:  2.5rem;
  --space-12:  3rem;
  --space-16:  4rem;
  --space-20:  5rem;
  --space-24:  6rem;
  --space-32:  8rem;
  --section-y: clamp(5rem, 10vw, 10rem);

  /* ── Sizing ─────────────────────────────────── */
  --width-prose:   65ch;
  --width-sm:      640px;
  --width-md:      768px;
  --width-lg:      1024px;
  --width-xl:      1280px;
  --width-content: 1152px;
  --width-wide:    1440px;

  /* ── Border Radius ──────────────────────────── */
  --radius-none: 0;
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-2xl:  32px;
  --radius-3xl:  48px;
  --radius-full: 9999px;

  /* ── Shadows ────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
  --shadow-xl: 0 24px 80px rgba(0,0,0,0.24), 0 8px 24px rgba(0,0,0,0.1);
  --shadow-inner: inset 0 2px 8px rgba(0,0,0,0.12);

  /* ── Transitions ────────────────────────────── */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:    cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-enter:  cubic-bezier(0.16, 1, 0.3, 1);

  --transition-fast:   150ms var(--ease-in-out);
  --transition-base:   250ms var(--ease-in-out);
  --transition-slow:   400ms var(--ease-in-out);
  --transition-spring: 500ms var(--ease-spring);
  --transition-enter:  600ms var(--ease-enter);

  /* ── Dark Theme Colors ──────────────────────── */
  --color-ink-50:   #f5f5fa;
  --color-ink-100:  #e8e8f0;
  --color-ink-200:  #c8c8d4;
  --color-ink-300:  #9898aa;
  --color-ink-400:  #6b6b80;
  --color-ink-500:  #4a4a5c;
  --color-ink-600:  #323244;
  --color-ink-700:  #1a1a24;
  --color-ink-800:  #111118;
  --color-ink-900:  #0a0a0f;

  /* Purple accent (change to match brand) */
  --color-accent:       #7c6af4;
  --color-accent-hover: #6b59e8;
  --color-accent-light: #a78bfa;
  --color-accent-muted: rgba(124, 106, 244, 0.12);
  --color-accent-glow:  rgba(124, 106, 244, 0.35);
  --accent-rgb: 124, 106, 244;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger:  #ef4444;
  --color-info:    #38bdf8;

  --surface-base:         var(--color-ink-900);
  --surface-raised:       var(--color-ink-800);
  --surface-elevated:     var(--color-ink-700);
  --surface-glass:        rgba(255, 255, 255, 0.04);
  --surface-glass-hover:  rgba(255, 255, 255, 0.06);
  --surface-glass-border: rgba(255, 255, 255, 0.08);
}

/* ── Light Theme Override ──────────────────────── */
[data-theme="light"] {
  --surface-base:         var(--color-ink-50);
  --surface-raised:       #ffffff;
  --surface-elevated:     var(--color-ink-100);
  --surface-glass:        rgba(0, 0, 0, 0.02);
  --surface-glass-border: rgba(0, 0, 0, 0.08);
}

/* ── Reduced Motion ──────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Google Fonts Preload Snippet
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
```
