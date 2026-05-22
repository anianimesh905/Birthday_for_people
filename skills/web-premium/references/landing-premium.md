# Premium Landing Page Patterns

## Above-the-Fold Checklist
- Ambient gradient background (2 blurred radial glows, slow drift animation)
- Eyebrow badge (small pill with brand accent color)
- Display font headline with gradient text on key word
- One-sentence value prop (≤ 12 words)
- CTA pair: primary button + ghost/text secondary
- Social proof bar below hero: logos or "X companies trust us"

## Features Grid
Three-column card grid, each card:
- Icon (24–32px, accent color, inside small accent-tinted circle)
- Short title (3–5 words)
- 1–2 sentence description
- Subtle glass card + hover lift

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

## Testimonials
- Large quote marks (accent color, decorative)
- Avatar + name + title on same line
- Star rating if applicable
- Subtle card background with left border accent

## Pricing Cards
- Most popular card: elevated shadow + accent border + "Popular" badge
- Feature list with checkmarks (SVG, not emoji)
- CTA button full-width inside card

## Footer
- 4-column grid: logo/description, links x2, newsletter
- Muted text (`var(--color-ink-400)`) with hover to `var(--color-ink-200)`
- Thin border-top separator

## Performance Tips
- Preload hero font: `<link rel="preload" as="font">`
- Preconnect Google Fonts: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- Hero background: CSS only (no image) = instant render
- Defer non-hero animations
