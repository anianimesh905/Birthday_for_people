# HP House Theme Engine — CSS Patch
# Append this entire block to the bottom of style.css

```css
/* ============================================================
   HP HOUSE THEME ENGINE — css patch
   Append to style.css  |  safe to merge or cherry-pick
   ============================================================ */


/* === SECTION 1 : GOOGLE FONTS IMPORT === */

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');


/* === SECTION 2 : HOUSE THEME TOKENS === */
/*
   Apply one of these classes to <body> (or your top-level wrapper):
     .theme-gryffindor  |  .theme-slytherin
     .theme-ravenclaw   |  .theme-hufflepuff
   They expose five custom properties consumed by every rule below.
*/

.theme-gryffindor {
  --house-primary   : #740001;           /* deep scarlet              */
  --house-accent    : #D3A625;           /* Gryffindor gold           */
  --house-overlay   : rgba(116, 0, 1, 0.78);   /* for gradient stops  */
  --house-text      : #F5E6C8;           /* warm parchment cream      */
  --house-glow      : 0 0 10px #D3A625,
                      0 0 28px rgba(211, 166, 37, 0.45),
                      0 0 6px  rgba(211, 166, 37, 0.25) inset;
}

.theme-slytherin {
  --house-primary   : #1A472A;           /* deep forest green         */
  --house-accent    : #AAAAAA;           /* Slytherin silver          */
  --house-overlay   : rgba(26, 71, 42, 0.80);
  --house-text      : #E4F0E7;           /* pale mint-white           */
  --house-glow      : 0 0 10px #AAAAAA,
                      0 0 28px rgba(170, 170, 170, 0.40),
                      0 0 6px  rgba(170, 170, 170, 0.20) inset;
}

.theme-ravenclaw {
  --house-primary   : #0E1A40;           /* Ravenclaw navy            */
  --house-accent    : #946B2D;           /* antique bronze            */
  --house-overlay   : rgba(14, 26, 64, 0.82);
  --house-text      : #CDD8F5;           /* pale periwinkle           */
  --house-glow      : 0 0 10px #946B2D,
                      0 0 28px rgba(148, 107, 45, 0.45),
                      0 0 6px  rgba(148, 107, 45, 0.25) inset;
}

.theme-hufflepuff {
  --house-primary   : #ECB939;           /* Hufflepuff yellow         */
  --house-accent    : #372E29;           /* near-black badger brown   */
  --house-overlay   : rgba(190, 140, 20, 0.72);
  --house-text      : #1A1510;           /* very dark brown — legible */
  --house-glow      : 0 0 10px #372E29,
                      0 0 28px rgba(55, 46, 41, 0.45),
                      0 0 6px  rgba(55, 46, 41, 0.20) inset;
}


/* === SECTION 3 : BACKGROUND & BODY COLOUR === */

.theme-gryffindor,
.theme-slytherin,
.theme-ravenclaw,
.theme-hufflepuff {
  background-color : var(--house-primary);
  color            : var(--house-text);
  transition       : background-color 0.6s ease, color 0.4s ease;
}


/* === SECTION 4 : HARRY POTTER TYPOGRAPHY === */

/* -- Headings: friend name banner + scroll title -- */
#friend-name,
#scroll-title {
  font-family  : 'Cinzel', 'Palatino Linotype', 'Book Antiqua', serif;
  font-weight  : 600;
  letter-spacing: 0.04em;
  color        : var(--house-accent);
  text-shadow  : 0 2px 8px rgba(0,0,0,0.55);
}

/* -- Scroll / letter body text -- */
#scroll-message,
#scroll-signature {
  font-family  : 'IM Fell English', 'Garamond', 'Georgia', serif;
  font-style   : italic;
  font-size    : 1.08em;
  line-height  : 1.75;
  color        : #3A2A14;   /* deep ink — readable on parchment */
}

#scroll-signature {
  font-size    : 1em;
  text-align   : right;
  margin-top   : 1.4em;
}

/* -- Loading screen + general UI chrome -- */
#loading-screen,
#loading-screen *,
#music-btn,
#scroll-close,
.env-label,
.room-btn {
  font-family  : 'Lora', 'Georgia', serif;
}

/* -- Accent colour on interactive text -- */
.theme-gryffindor a,
.theme-slytherin  a,
.theme-ravenclaw  a,
.theme-hufflepuff a {
  color       : var(--house-accent);
  transition  : opacity 0.25s;
}
.theme-gryffindor a:hover,
.theme-slytherin  a:hover,
.theme-ravenclaw  a:hover,
.theme-hufflepuff a:hover {
  opacity : 0.8;
}


/* === SECTION 5 : VIDEO OVERLAY GRADIENT === */

#video-overlay {
  background : linear-gradient(
    180deg,
    transparent                      0%,
    var(--house-overlay)             55%,
    rgba(0, 0, 0, 0.93)            100%
  );
  transition  : background 0.6s ease;
}


/* === SECTION 6 : PARCHMENT TEXTURE — #scroll-paper === */
/*
   Cream (#F5E6C8) base with a CSS fractal-noise SVG data-URI overlay.
   The SVG feTurbulence filter produces a subtle paper-grain without any
   external assets or extra HTTP requests.
*/

#scroll-paper {
  background-color : #F5E6C8;
  background-image :
    /* faint ruled-line hint */
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent          26px,
      rgba(139,101,55,0.07) 27px
    ),
    /* SVG fractal-noise parchment grain */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='parch'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23parch)' opacity='0.09'/%3E%3C/svg%3E");

  /* aged-paper border */
  border        : 1px solid rgba(139, 101, 55, 0.35);
  box-shadow    : 0 2px 18px rgba(80, 50, 10, 0.25),
                  inset 0 0 40px rgba(200, 160, 90, 0.10);

  /* gentle warm tint over vignette edges */
  position      : relative;
  border-radius : 3px;
}

/* Inner parchment vignette via pseudo-element */
#scroll-paper::before {
  content        : '';
  position       : absolute;
  inset          : 0;
  border-radius  : inherit;
  background     : radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(160, 100, 30, 0.10) 100%
  );
  pointer-events : none;
}


/* === SECTION 7 : HOUSE-ACCENT GLOW — interactive elements === */
/*
   Uses the --house-glow token (set per theme in Section 2).
   The inset layer adds a subtle inner halo so the effect reads
   on both light and dark house backgrounds.
*/

#env-seal {
  box-shadow : var(--house-glow);
  border     : 2px solid var(--house-accent);
  transition : box-shadow 0.4s ease, border-color 0.4s ease,
               transform  0.25s ease;
}

#env-seal:hover {
  transform  : scale(1.04) rotate(-1deg);
  box-shadow : var(--house-glow),
               0 6px 20px rgba(0,0,0,0.4);
}

#music-btn {
  box-shadow       : var(--house-glow);
  border           : 1.5px solid var(--house-accent);
  color            : var(--house-accent);
  background-color : rgba(0, 0, 0, 0.28);
  transition       : box-shadow 0.4s ease, background-color 0.3s ease,
                     transform  0.2s ease;
}

#music-btn:hover,
#music-btn:focus {
  background-color : rgba(0, 0, 0, 0.50);
  transform        : scale(1.06);
}

#scroll-close {
  box-shadow  : var(--house-glow);
  border      : 1.5px solid var(--house-accent);
  color       : var(--house-accent);
  transition  : box-shadow 0.4s ease, transform 0.2s ease;
}

#scroll-close:hover,
#scroll-close:focus {
  transform   : scale(1.08) rotate(6deg);
  box-shadow  : var(--house-glow),
                0 4px 14px rgba(0,0,0,0.35);
}


/* === SECTION 8 : LEGACY CLASS ALIASES === */
/*
   If older JS still sets .morning / .afternoon / .sunset / .night,
   these aliases silently forward them to the correct house theme.
   Remove once JS is updated.
*/

.morning   { --house-primary: #740001; --house-accent: #D3A625;
             --house-overlay: rgba(116,0,1,.78); --house-text: #F5E6C8;
             --house-glow: 0 0 10px #D3A625, 0 0 28px rgba(211,166,37,.45); }

.afternoon { --house-primary: #1A472A; --house-accent: #AAAAAA;
             --house-overlay: rgba(26,71,42,.80); --house-text: #E4F0E7;
             --house-glow: 0 0 10px #AAAAAA, 0 0 28px rgba(170,170,170,.40); }

.sunset    { --house-primary: #0E1A40; --house-accent: #946B2D;
             --house-overlay: rgba(14,26,64,.82); --house-text: #CDD8F5;
             --house-glow: 0 0 10px #946B2D, 0 0 28px rgba(148,107,45,.45); }

.night     { --house-primary: #ECB939; --house-accent: #372E29;
             --house-overlay: rgba(190,140,20,.72); --house-text: #1A1510;
             --house-glow: 0 0 10px #372E29, 0 0 28px rgba(55,46,41,.45); }


/* === END OF HP HOUSE THEME ENGINE PATCH === */
```
