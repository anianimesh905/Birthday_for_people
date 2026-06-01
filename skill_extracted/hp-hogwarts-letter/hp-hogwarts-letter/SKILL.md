---
name: hp-hogwarts-letter
description: >
  Redesigns the birthday website letter modal into authentic Hogwarts
  correspondence. Produces three coordinated patches — HTML, CSS, JS — covering:
  aged parchment #scroll-paper, deckle torn edges via SVG filter, Hogwarts motto
  faded watermark replacing the compass rose, letter header (Cinzel small-caps
  school name, headmistress line, ⚡ divider, motto), "Dear [name]," salutation
  in IM Fell English, body text with JS-injected drop cap (float left, 3.5×,
  house-accent), 80 ms per-word stagger reveal, and #scroll-close as a 44 px
  wax-seal circle. Pairs with hp-house-theme-engine.
  Trigger on: "Hogwarts letter", "parchment letter modal", "HP letter redesign",
  "drop cap birthday letter", "wax seal close", "word stagger reveal",
  "deckle edge scroll", "scroll modal Hogwarts", "birthday letter HP style", or
  any request to make the birthday/Sanctuary letter look like a Hogwarts letter.
---

# HP Hogwarts Letter Skill

## What this skill produces

Three clearly-labelled code blocks that work together as a single feature:

| Block | File to update | What it changes |
|-------|---------------|-----------------|
| **HTML patch** | your main `.html` file | `#scroll-inner` layout, wax-seal `#scroll-close`, SVG filter guard |
| **CSS patch** | `style.css` (append) | parchment, deckle edges, watermark, header, drop cap, wax seal |
| **JS patch** | `main.js` / `scroll.js` | word-stagger reveal, drop cap injection, integration hook |

---

## How to use this skill

1. **Read** `references/letter-patch.md` in full. It is the authoritative source for
   all code. Present it verbatim — do not abbreviate or paraphrase.

2. **Output the three blocks** in order, each in its own fenced code block, with a
   one-line heading per block explaining where it goes.

3. **After the blocks**, include the **Integration Checklist** (see below).

4. **If the user asks for a variation** (e.g. different headmistress name, different
   divider glyph, adjusting drop cap size, a specific house colour override), apply
   the change directly to the relevant block before presenting. Do not ask for
   clarification on small tweaks — just apply them and note what changed.

---

## Integration checklist template

After the three code blocks, always include:

```
### Integration checklist

HTML
  [ ] Paste the `#scroll-inner` HTML block, replacing the existing inner contents.
  [ ] Make sure `<button id="scroll-close">✕</button>` replaces the old close control.
  [ ] The SVG filter guard block can go anywhere above `#scroll-paper-bg`; skip it
      if `<filter id="deckle-edge">` already exists in your HTML.

CSS  (append to bottom of style.css — safe to merge with hp-house-theme-engine patch)
  [ ] Verify that `--house-primary`, `--house-accent`, and `--house-glow` are
      already defined by a house theme class on <body>. If not, install the
      hp-house-theme-engine skill first.

JS  (add to main.js / scroll.js)
  [ ] Find the function that populates `#scroll-message` from content.js.
  [ ] Call `revealHogwartsLetter()` immediately after setting the text — not on
      page load, but on scroll-open.
  [ ] The existing animation or transition on `#scroll-paper` can stay — the JS
      stagger fires after DOM insertion and doesn't conflict.

Deckle edges
  [ ] `filter: url(#deckle-edge)` on `#scroll-paper-bg` only works when the
      SVG filter definition lives in the same HTML document (not a linked .svg).
      If edges look un-ragged, bump the `scale` attribute in `feDisplacementMap`
      from 9 → 14 in the SVG filter.
```

---

## Design rationale (for adaptation guidance)

- **Drop cap via JS, not CSS `::first-letter`** — because the word-stagger
  animation wraps each word in `<span>`, `::first-letter` would target the span
  tag itself. Injecting `.drop-cap` before the word spans avoids that.

- **`::after` for watermark** — `::before` is already used for the parchment
  vignette in hp-house-theme-engine. `::after` keeps both pseudo-elements clean.

- **`pointer-events: none` on all decorative overlays** — lets the user scroll
  and interact with the letter text unobstructed.

- **80 ms stagger interval** — chosen so a ~200-word letter finishes revealing
  in ~16 s; feel free to decrease to 50 ms for snappier feel.

---

## Reference file

→ Read **`references/letter-patch.md`** for all three code blocks.
  Present its full contents, verbatim, in your response.
