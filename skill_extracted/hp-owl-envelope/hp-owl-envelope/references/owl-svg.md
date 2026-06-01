# Owl SVG Specification

## Design Brief

The owl silhouette is intentionally **simple and abstract** — it reads as an owl in
flight but is small (14–22px rendered), so detail would be invisible. The goal is
a recognisable "tiny flying owl" shape, not a realistic illustration.

## ViewBox

```
viewBox="0 0 40 24"
```

Width 40, height 24. This gives a naturally wide aspect ratio (flying pose).

## SVG Path — Canonical

```svg
<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
  <path d="
    M 20 14
    C 17 10, 10 6, 2 8
    C 6 10, 8 12, 10 14
    C 12 16, 14 18, 16 17
    C 17 19, 18 21, 20 20
    C 22 21, 23 19, 24 17
    C 26 18, 28 16, 30 14
    C 32 12, 34 10, 38 8
    C 30 6, 23 10, 20 14
    Z
  " fill="#5a3e2b"/>
</svg>
```

### Shape breakdown

| Segment | What it draws |
|---|---|
| `M 20 14` | Start at body centre |
| `C 17 10, 10 6, 2 8` | Left wing sweeping out and up |
| `C 6 10, 8 12, 10 14` | Left wing tip curling down |
| `C 12 16, 14 18, 16 17` | Left body side |
| `C 17 19, 18 21, 20 20` | Tail/body bottom left |
| `C 22 21, 23 19, 24 17` | Tail/body bottom right |
| `C 26 18, 28 16, 30 14` | Right body side |
| `C 32 12, 34 10, 38 8` | Right wing tip curling down |
| `C 30 6, 23 10, 20 14` | Right wing sweeping back to centre |
| `Z` | Close path |

The result is a double-wing W-shape with a small oval body in the centre — instantly
reads as "flying bird/owl" at small sizes.

## Alternative Minimal Path (even simpler, for tiny sizes ≤ 16px)

For `owl-4` (14px), use this simpler W-path which renders cleaner at very small sizes:

```svg
<svg viewBox="0 0 36 20" xmlns="http://www.w3.org/2000/svg">
  <path d="
    M 18 12
    Q 10 4, 1 7
    Q 7 10, 10 13
    Q 14 17, 18 16
    Q 22 17, 26 13
    Q 29 10, 35 7
    Q 26 4, 18 12
    Z
  " fill="#5a3e2b"/>
</svg>
```

## Usage in HTML

Each `.env-owl` div gets an inline SVG. The `class="owl-svg"` on the `<svg>` tag
is used by CSS to set `display: block` and `fill: #5a3e2b`.

```html
<div class="env-owl owl-1" aria-hidden="true">
  <svg class="owl-svg" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 14 C 17 10, 10 6, 2 8 C 6 10, 8 12, 10 14 C 12 16, 14 18, 16 17 C 17 19, 18 21, 20 20 C 22 21, 23 19, 24 17 C 26 18, 28 16, 30 14 C 32 12, 34 10, 38 8 C 30 6, 23 10, 20 14 Z" fill="#5a3e2b"/>
  </svg>
</div>
```

Use the **minimal path** for `owl-4` (14px wide).
Use the **canonical path** for `owl-1`, `owl-2`, `owl-3`.

## Colour Notes

- Fill: `#5a3e2b` (dark sepia brown)
- The `.env-owl` parent has `opacity: 0.5` — do NOT set opacity on the SVG itself
- The `.owl-delivering` class raises parent opacity to `0.85` (set in CSS, not SVG)

## Accessibility

All `.env-owl` wrappers must have `aria-hidden="true"` — they are decorative.
Do not add `role` or `title` elements inside the SVG.
