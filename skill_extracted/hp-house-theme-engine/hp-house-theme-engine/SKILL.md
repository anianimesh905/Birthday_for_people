---
name: hp-house-theme-engine
description: >
  Generates a ready-to-append CSS patch converting the birthday/Sanctuary website
  into a four-house Hogwarts theme engine. Replaces .morning/.afternoon/.sunset/.night
  with .theme-gryffindor, .theme-slytherin, .theme-ravenclaw, .theme-hufflepuff —
  each exposing --house-primary, --house-accent, --house-overlay, --house-text,
  --house-glow. Adds HP typography (Cinzel headings, IM Fell English scroll text,
  Lora UI), parchment #scroll-paper texture, gradient #video-overlay, and
  house-accent glow on #env-seal, #music-btn, #scroll-close. Output: one labelled
  CSS block, safe to append to style.css. Trigger on: "Hogwarts theme", "house
  theme", "HP CSS", "add house colors", "Gryffindor/Slytherin/Ravenclaw/Hufflepuff",
  "house theme engine", "Cinzel font birthday site", "apply Hogwarts to style.css",
  or any request to give the birthday / Sanctuary website a Harry Potter aesthetic.
---

# HP House Theme Engine

## What this skill produces

A single, self-contained **CSS patch block** — labelled with `/* === SECTION === */`
comments — that can be:
- **Appended** directly to `style.css`, OR
- **Cherry-picked** section by section for a partial update.

The patch never overwrites existing rules; it overrides them via specificity and
custom properties, so it's safe to apply to any iteration of the birthday website.

---

## How to use this skill

1. **Read** `references/css-patch.md` — it contains the complete, ready-to-use
   CSS patch with every house theme, font import, texture, overlay, and glow rule.

2. **Present the entire content** of `references/css-patch.md` verbatim inside a
   ` ```css ` code block.  Do not summarise or abbreviate — the user needs the full
   copy-pasteable block.

3. **After the code block**, add a short integration guide (see template below).

4. **If the user requests a variation** (e.g. different selector names, adjusting
   glow intensity, adding a fifth theme, swapping a font), apply the modification
   directly to the patch content before presenting it.  Do not ask clarifying
   questions if the request is clear — just apply and show.

---

## Integration guide template

After the CSS block, always include this short note:

```
### How to apply

1. Open `style.css` and scroll to the very bottom.
2. Paste the entire block above.
3. In your JavaScript / HTML, swap the old time-of-day class on <body> or your
   wrapper element:
      - Remove: class="morning"  →  Add: class="theme-gryffindor"
      - Remove: class="afternoon" →  Add: class="theme-slytherin"
      - Remove: class="sunset"   →  Add: class="theme-ravenclaw"
      - Remove: class="night"    →  Add: class="theme-hufflepuff"
4. The Google Fonts @import at the top of the patch replaces any separate
   <link> tags in your HTML — you can keep both, they won't conflict.
5. To toggle themes at runtime:
      document.body.className = 'theme-gryffindor'; // or any other house
```

---

## Custom property reference

| Property          | Purpose                                         |
|-------------------|-------------------------------------------------|
| `--house-primary` | Main background / dominant hue                  |
| `--house-accent`  | Gold / silver / bronze / near-black highlight   |
| `--house-overlay` | Gradient stop for #video-overlay (with alpha)   |
| `--house-text`    | Readable foreground colour for that house       |
| `--house-glow`    | Complete `box-shadow` value for interactive UI  |

---

## Reference file

→ Read **`references/css-patch.md`** for the full CSS output.

The reference is ~280 lines; no internal ToC needed.  Read the entire file and
present it verbatim.
