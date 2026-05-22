# Cinematic Landing Page Generator

A skill for generating production-ready, deeply atmospheric landing pages with parallax depth, editorial typography, glassmorphism, and scroll-triggered animations.

## When to Use

Use this skill when the user wants:
- A **premium, art-directed landing page** (travel, hospitality, fashion, lifestyle brands)
- **Cinematic scroll experiences** with layered parallax, viewport-triggered reveals, and considered pacing
- **Editorial aesthetics** — asymmetric layouts, scrapbook photo clusters, hairline rules, tracked-out small caps
- **Glassmorphism cards** with proper backdrop-blur and semi-transparent backgrounds
- **Custom cursor interactions** and smooth scroll (Lenis)

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Mist Black | `#0A0A0A` | Primary background |
| Mountain Cream | `#F5E8D3` | Warm accent backgrounds |
| Kimono White | `#FAFAFA` | Primary text |
| Lime Accent | `#D4F87A` | Emphasis text, focus states, hover |
| Sakura Pink | `#FFB7C5` | Decorative glows only |
| Mouse Gray | `#888888` | Captions, fine print |
| Glass Border | `rgba(255,255,255,0.1)` | Card borders |

### Typography
- **Display headings**: `Bebas Neue` or `Oswald` — thin condensed sans-serif, oversized
- **Body text**: `Inter` 400 weight
- **Small caps / nav**: `Inter` +180 letter-spacing, uppercase, 12px
- **Editorial serif**: `Cormorant Garamond` or `Playfair Display` light weight

### Motion System
- **Easing standard**: `cubic-bezier(0.16, 1, 0.3, 1)` — confident, exhaled
- **Card hover**: lift 4-6px, 300ms
- **Timeline reveal**: `useInView` with 200ms stagger, fade + slide-up from y=40px
- **Parallax speeds**: background 0.3x, mid-ground 0.5x, foreground fixed
- **Smooth scroll**: Lenis with `duration: 1.2`

### Glassmorphism Requirements
Every glass panel MUST have:
1. `backdrop-filter: blur(20px)` or higher
2. Semi-transparent background (`rgba(255,255,255,0.04)` or `rgba(20,20,20,0.5)`)
3. 1px border in `rgba(255,255,255,0.1)`

## Component Patterns

### 1. Hero with Z-Index Layering
```tsx
// Three distinct planes: background image, outlined typography, foreground figure
// Typography sits BEHIND the mountain image — only top portion visible
<section className="relative h-screen overflow-hidden">
  <motion.div style={{ y: mountainsY }} className="absolute inset-0 z-0">...</motion.div>
  <motion.div style={{ y: textY }} className="absolute inset-0 z-10">...</motion.div>
  <div className="absolute right-0 bottom-0 z-20">...</div>
</section>
```

### 2. Polaroid Card Strip
```tsx
// Cards drift at 0.4x scroll speed
// On hover: lift 6px, video plays, warm glow behind
<motion.div style={{ x: polaroidX }} className="flex gap-4">
  {polaroids.map((p, i) => (
    <motion.div
      whileHover={{ y: -6 }}
      className="polaroid bg-[#1a1a1a] p-2 pb-8 rounded shadow-lg"
    >
      <Image src={p.img} ... />
      <p className="text-[10px] text-gray-500">{p.caption}</p>
    </motion.div>
  ))}
</motion.div>
```

### 3. Timeline with Photo Clusters
```tsx
// Vertical hairline rule with filled circle nodes
// Photo clusters rotated ±2-4 degrees for editorial scrapbook feel
// On hover: photos separate with subtle rotation
<div className="flex items-start gap-6">
  <div className="w-3 h-3 rounded-full bg-lime-accent" />
  <div>
    <h3>City Name</h3>
    <motion.div whileHover="hover">
      {images.map((img, i) => (
        <motion.div
          variants={{ hover: { rotate: i===0 ? -4 : 4, x: i===0 ? -6 : 6 } }}
          style={{ transform: `rotate(${i===0 ? -2 : 2}deg)` }}
        >
          <Image src={img} ... />
        </motion.div>
      ))}
    </motion.div>
  </div>
</div>
```

### 4. Glassmorphism Bento Grid
```tsx
// Four-up grid of glass cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {cards.map((card) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 
                 rounded-xl p-8 hover:border-lime-accent/50"
    >
      <Icon className="text-lime-accent" />
      <h3 className="tracking-[0.12em] uppercase text-sm">{card.title}</h3>
      <p className="text-white/60 text-sm">{card.description}</p>
    </motion.div>
  ))}
</div>
```

### 5. Frosted Glass Form Panel
```tsx
// Heavy backdrop-blur over cinematic background image
<div className="relative min-h-screen">
  <Image src="/bg.jpg" fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/60" />
  <div className="relative z-10">
    <div className="bg-[rgba(20,20,20,0.5)] backdrop-blur-xl 
                    border border-white/10 rounded-2xl p-12 max-w-md">
      <h2 className="font-serif text-3xl">Heading</h2>
      <input className="bg-transparent border-b border-white/20 
                        focus:border-lime-accent outline-none w-full py-3" />
    </div>
  </div>
</div>
```

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (arbitrary values for glassmorphism)
- Framer Motion (`useScroll`, `useTransform`, `useInView`, `whileHover`)
- Lenis (`@studio-freight/lenis`) for smooth scroll
- Lucide React for monoline icons

## Critical Implementation Notes

1. **Z-index layering in hero is non-negotiable.** The display typography MUST sit behind the mountain image. Use `position: absolute` with negative z-index and carefully cropped background image.

2. **The timeline stagger reveal is the centerpiece animation.** Use `useInView` with 200ms stagger between nodes. `whileInView` triggers fade + slide-up from `y=40px`.

3. **Glassmorphism only works with proper backdrop-blur.** Ensure all glass panels have both `backdrop-filter: blur()` AND a semi-transparent background. Missing either breaks the effect.

4. **Every image should lazy-load with a 0.4s fade-in.** Use Next.js `Image` with `loading="lazy"` and CSS transition on opacity.

5. **Generous whitespace is essential.** This is not a dense marketing page. It should feel like flipping through a leather-bound travel journal.

## Example Usage

```
Create a cinematic landing page for a [BRAND] — a premium [PRODUCT/SERVICE]. 
The aesthetic blends [REFERENCE A], [REFERENCE B], and [REFERENCE C]. 

Hero: [describe 3-plane composition]
Sections: [list sections with specific content]
Colors: [primary palette]
Images needed: [list specific visual requirements]
```
