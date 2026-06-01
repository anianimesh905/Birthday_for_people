# HP Hogwarts Letter — Full Patch Reference
# Three coordinated code blocks to append / replace in your birthday website.

---

## BLOCK 1 — HTML  (replace contents of #scroll-inner and update #scroll-close)

```html
<!-- ============================================================
     HP HOGWARTS LETTER — HTML patch
     Replace the inner contents of #scroll-paper / #scroll-inner
     with this structure. Keep any wrapper divs your site already
     has outside #scroll-inner (e.g. #scroll-paper, #scroll-paper-bg).
     ============================================================ -->

<!--
  SVG FILTER GUARD — paste this once, anywhere above #scroll-paper-bg.
  Skip if <filter id="deckle-edge"> already exists in your HTML.
-->
<svg aria-hidden="true" focusable="false"
     style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
    <filter id="deckle-edge" x="-4%" y="-4%" width="108%" height="108%"
            color-interpolation-filters="linearRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="4"
                    seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise"
                         scale="9" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

<!-- #scroll-inner — full replacement contents -->
<div id="scroll-inner">

  <!-- [1] Hogwarts institutional header -->
  <header id="hogwarts-header" aria-label="Hogwarts letterhead">
    <p class="hogwarts-school-name">
      Hogwarts School of Witchcraft and Wizardry
    </p>
    <p class="hogwarts-headmistress">
      <em>Headmistress: Prof. Minerva McGonagall</em>
    </p>
    <div class="hogwarts-divider" role="presentation" aria-hidden="true">
      · · · ⚡ · · ·
    </div>
    <p class="hogwarts-motto-sub">
      <em>Draco Dormiens Nunquam Titillandus</em>
    </p>
  </header>

  <!-- [2] Personal salutation — #friend-name is populated by content.js -->
  <div id="scroll-title">
    Dear <span id="friend-name"></span>,
  </div>

  <!-- [3] Letter body — populated by content.js; JS stagger runs after -->
  <div id="scroll-message" aria-live="polite"></div>

  <!-- [4] Closing signature — populated by content.js -->
  <div id="scroll-signature"></div>

</div><!-- /#scroll-inner -->

<!--
  WAX SEAL CLOSE BUTTON — replace your existing #scroll-close element.
  Place this wherever the close button currently lives (often just outside
  or just inside #scroll-paper).
-->
<button id="scroll-close" aria-label="Close letter" title="Close">✕</button>
```

---

## BLOCK 2 — CSS  (append to bottom of style.css)

```css
/* ============================================================
   HP HOGWARTS LETTER — CSS patch
   Append to style.css. Requires --house-primary, --house-accent,
   --house-glow to be defined by a house theme class (e.g. via the
   hp-house-theme-engine patch). Safe to merge with that patch.
   ============================================================ */


/* === SECTION L1 : DECKLE TORN EDGES — #scroll-paper-bg === */

#scroll-paper-bg {
  filter          : url(#deckle-edge);
  background-color: #F5E6C8;            /* warm cream baseline */
  border-radius   : 4px;                /* filter will soften this */
  overflow        : visible;            /* let displaced edges breathe */
  position        : relative;
  z-index         : 0;
}


/* === SECTION L2 : AGED PARCHMENT — #scroll-paper === */

#scroll-paper {
  /* Warm cream base */
  background-color : #F5E6C8;

  /* Subtle horizontal ruled-line texture */
  background-image :
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent           27px,
      rgba(139, 101, 55, 0.08) 28px
    ),
    /* SVG fractal-noise grain — no external assets */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='parch'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.18'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23parch)' opacity='0.09'/%3E%3C/svg%3E");

  border        : 1px solid rgba(139, 101, 55, 0.30);
  box-shadow    : 0 3px 20px rgba(80, 50, 10, 0.22),
                  inset 0 0 50px rgba(200, 160, 90, 0.09);
  position      : relative;
  overflow      : hidden;              /* contain watermark pseudo-element */
}


/* === SECTION L3 : COMPASS ROSE REMOVAL === */
/*
  Removes any existing compass / mandala watermark.
  Adjust the selector(s) to match your actual class name if different.
*/
.compass-rose,
.scroll-watermark,
[class*="compass"],
[class*="watermark"],
#scroll-paper > .bg-ornament,
#scroll-paper > [aria-hidden="true"]:not(.drop-cap) {
  display : none !important;
}

/* Reset ::before if it was previously used for the compass rose */
#scroll-paper::before {
  content    : '';
  display    : block;
  position   : absolute;
  inset      : 0;
  background : radial-gradient(
    ellipse at center,
    transparent 58%,
    rgba(160, 100, 30, 0.09) 100%
  );
  pointer-events : none;
  z-index        : 0;
}


/* === SECTION L4 : HOGWARTS MOTTO WATERMARK === */
/*
  Replaces the compass rose. Faint italic diagonal text behind the letter body.
*/
#scroll-paper::after {
  content         : 'Draco Dormiens Nunquam Titillandus';
  position        : absolute;
  left            : 50%;
  top             : 52%;
  transform       : translate(-50%, -50%) rotate(-28deg);
  font-family     : 'IM Fell English', 'Garamond', 'Georgia', serif;
  font-style      : italic;
  font-size       : clamp(0.9rem, 2.2vw, 1.35rem);
  letter-spacing  : 0.06em;
  color           : #5C3D11;
  opacity         : 0.06;
  white-space     : nowrap;
  pointer-events  : none;
  user-select     : none;
  z-index         : 0;
}


/* === SECTION L5 : HOGWARTS LETTER HEADER === */

#hogwarts-header {
  text-align    : center;
  margin-bottom : 1.5rem;
  padding-bottom: 0.6rem;
  border-bottom : 1px solid rgba(139, 101, 55, 0.25);
  position      : relative;
  z-index       : 1;
}

/* Line 1 — school name */
.hogwarts-school-name {
  font-family     : 'Cinzel', 'Palatino Linotype', 'Book Antiqua', serif;
  font-variant    : small-caps;
  font-size       : clamp(0.7rem, 1.6vw, 0.92rem);
  font-weight     : 600;
  letter-spacing  : 0.12em;
  color           : var(--house-accent, #740001);
  text-shadow     : 0 1px 3px rgba(0,0,0,0.15);
  margin          : 0 0 0.25rem;
  line-height     : 1.4;
}

/* Line 2 — headmistress */
.hogwarts-headmistress {
  font-family   : 'IM Fell English', 'Garamond', 'Georgia', serif;
  font-size     : 0.78rem;
  color         : #6B4A1E;
  margin        : 0 0 0.55rem;
  line-height   : 1.5;
}
.hogwarts-headmistress em {
  font-style : italic;
}

/* Decorative ⚡ divider */
.hogwarts-divider {
  font-size     : 0.78rem;
  letter-spacing: 0.18em;
  color         : var(--house-accent, #D3A625);
  margin        : 0.1rem 0 0.45rem;
  line-height   : 1;
  user-select   : none;
}

/* Line 4 — motto below divider */
.hogwarts-motto-sub {
  font-family  : 'IM Fell English', 'Garamond', serif;
  font-style   : italic;
  font-size    : 0.68rem;
  color        : #7A5C2E;
  letter-spacing: 0.04em;
  margin       : 0;
  opacity      : 0.78;
}


/* === SECTION L6 : SALUTATION — #scroll-title === */

#scroll-title {
  font-family   : 'IM Fell English', 'Garamond', 'Georgia', serif;
  font-size     : clamp(1.3rem, 3.2vw, 1.65rem);
  font-style    : italic;
  color         : #3A2210;
  margin        : 0 0 1.1rem;
  line-height   : 1.4;
  position      : relative;
  z-index       : 1;
}

/* friend-name inherits but in normal weight, house accent colour */
#scroll-title #friend-name {
  font-style  : normal;
  font-weight : 700;
  color       : var(--house-accent, #740001);
}


/* === SECTION L7 : LETTER BODY — #scroll-message === */

#scroll-message {
  font-family   : 'IM Fell English', 'Garamond', 'Georgia', serif;
  font-size     : 1.05rem;
  line-height   : 1.9;
  color         : #2E1B0A;
  position      : relative;
  z-index       : 1;
  /* clearfix so drop cap float doesn't overflow */
  overflow      : hidden;
}


/* === SECTION L8 : DROP CAP (JS-injected .drop-cap span) === */
/*
  The JS word-stagger wraps every word in a <span class="word-reveal">.
  CSS ::first-letter can't target inside spans, so we inject .drop-cap
  programmatically (see JS block). This class styles that span.
*/
.drop-cap {
  float           : left;
  font-family     : 'Cinzel', 'Palatino Linotype', serif;
  font-size       : 3.5em;
  font-weight     : 700;
  line-height     : 0.72;
  margin          : 0.05em 0.1em -0.05em 0;
  color           : var(--house-accent, #D3A625);
  text-shadow     : 1px 2px 5px rgba(0, 0, 0, 0.22);
  /* drop cap is always visible — no stagger delay */
  opacity         : 1 !important;
  animation       : none !important;
  padding-right   : 0.04em;
}


/* === SECTION L9 : WORD STAGGER ANIMATION === */

@keyframes wordFadeUp {
  from {
    opacity   : 0;
    transform : translateY(5px);
  }
  to {
    opacity   : 1;
    transform : translateY(0);
  }
}

.word-reveal {
  display            : inline-block;  /* needed for transform */
  opacity            : 0;
  animation          : wordFadeUp 0.42s ease forwards;
  /* animation-delay set inline by JS per word */
}


/* === SECTION L10 : WAX SEAL CLOSE BUTTON — #scroll-close === */

#scroll-close {
  /* Geometry */
  width            : 44px;
  height           : 44px;
  border-radius    : 50%;
  flex-shrink      : 0;

  /* Wax-seal colouring */
  background-color : var(--house-primary, #740001);
  color            : #FFFFFF;
  border           : 2px solid var(--house-accent, #D3A625);

  /* Centred ✕ */
  display          : flex;
  align-items      : center;
  justify-content  : center;
  font-size        : 1.05rem;
  line-height      : 1;
  font-family      : 'Cinzel', serif;

  /* Wax-seal highlight + glow */
  background-image : radial-gradient(
    circle at 38% 36%,
    rgba(255, 255, 255, 0.18) 0%,
    transparent 62%
  );
  box-shadow       : var(--house-glow, 0 0 10px rgba(211,166,37,.5)),
                     0 3px 10px rgba(0, 0, 0, 0.45),
                     inset 0 1px 3px rgba(255, 255, 255, 0.15);

  cursor           : pointer;
  transition       : transform 0.22s ease, box-shadow 0.3s ease;
}

#scroll-close:hover,
#scroll-close:focus-visible {
  transform  : scale(1.10) rotate(8deg);
  box-shadow : var(--house-glow, 0 0 14px rgba(211,166,37,.6)),
               0 5px 16px rgba(0, 0, 0, 0.50),
               inset 0 1px 3px rgba(255, 255, 255, 0.15);
  outline    : none;
}

#scroll-close:active {
  transform  : scale(0.95) rotate(4deg);
}


/* === END OF HP HOGWARTS LETTER CSS PATCH === */
```

---

## BLOCK 3 — JS  (add to main.js or scroll.js)

```javascript
/* ============================================================
   HP HOGWARTS LETTER — word-stagger reveal + drop cap
   ============================================================
   Call revealHogwartsLetter() once, immediately after your code
   sets the text content of #scroll-message from content.js.

   Typical integration:

     // Your existing scroll-open function (example):
     function openScroll() {
       document.getElementById('friend-name').textContent = FRIEND_NAME;
       document.getElementById('scroll-message').textContent = LETTER_BODY;
       document.getElementById('scroll-signature').textContent = SIGNATURE;
       // ↓ Add this one line:
       revealHogwartsLetter();
       // ... then show #scroll-paper, play sound, etc.
     }
   ============================================================ */

/**
 * Entry point. Call after populating #scroll-message.
 */
function revealHogwartsLetter() {
  _injectDropCapAndStagger('scroll-message', 80);
}

/**
 * Wraps every word in an animated span and injects a .drop-cap
 * span for the very first character.
 *
 * @param {string} elementId   - ID of the text container element
 * @param {number} intervalMs  - delay increment per word in milliseconds
 */
function _injectDropCapAndStagger(elementId, intervalMs) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const raw = el.textContent.trim();
  if (!raw.length) return;

  // ── Drop cap: first character as its own injected span ──
  const firstChar = raw.charAt(0);
  const remaining = raw.slice(1);

  // ── Word spans: each word gets an animation-delay ──
  // We split on whitespace; nbsp and multi-space collapses naturally.
  const words = remaining.split(/\s+/).filter(Boolean);

  const dropCapHtml =
    `<span class="drop-cap" aria-hidden="true">${_escapeHtml(firstChar)}</span>`;

  const wordSpansHtml = words
    .map((word, index) => {
      const delay = (index + 1) * intervalMs; // +1 so first word isn't instant
      return `<span class="word-reveal" style="animation-delay:${delay}ms">`
           + `${_escapeHtml(word)}</span>`;
    })
    .join(' ');

  el.innerHTML = dropCapHtml + wordSpansHtml;
}

/**
 * Minimal HTML escaping for safe innerHTML injection.
 * (Your content.js strings should already be safe, but belt-and-suspenders.)
 */
function _escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Optional: re-run if the letter is closed and re-opened ────────────── */
/*
   If your site hides and re-shows the scroll without reloading the page,
   the word-spans persist from the first open. Call resetScrollMessage()
   before re-populating, then call revealHogwartsLetter() again.

   function resetScrollMessage() {
     const el = document.getElementById('scroll-message');
     if (el) el.textContent = '';   // clears spans; content.js refills it
   }
*/
```
