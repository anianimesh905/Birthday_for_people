# HP Magic Particles — Complete JS Reference
# Present the code block below verbatim when the skill is triggered.

```javascript
/* ============================================================
   HP MAGIC PARTICLES — initMagicParticles()
   Drop into script.js. Replace your existing sparkle/canvas init.
   Call once:  document.addEventListener('DOMContentLoaded', initMagicParticles);

   Custom events consumed:
     "houseChanged"   detail: { house: 'gryffindor'|'slytherin'|'ravenclaw'|'hufflepuff' }
     "envelopeTapped" detail: { x: Number, y: Number }  — page coords of envelope centre

   Exposes:
     window.destroyMagicParticles()  — stops loop and clears canvas
   ============================================================ */

function initMagicParticles() {

  /* ── Section 1 : Canvas Setup ─────────────────────────────────────────── */

  // Change CANVAS_ID if your canvas element has a different id
  const CANVAS_ID = 'sparkle-canvas';

  const canvas =
    document.getElementById(CANVAS_ID) ||
    document.getElementById('particle-canvas') ||
    document.getElementById('bg-canvas') ||
    document.querySelector('canvas');

  if (!canvas) {
    console.warn('[HP Particles] No canvas element found. Aborting.');
    return;
  }

  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const onResize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize);


  /* ── Section 2 : Config Constants ────────────────────────────────────── */

  const isMobile      = window.innerWidth < 768;
  const MAX_PARTICLES = isMobile ? 20 : 72;

  // Cumulative probability thresholds for particle type selection
  //   A: wand sparks  40 %
  //   B: Lumos orbs   30 %   (cumulative 70 %)
  //   C: lightning    15 %   (cumulative 85 %)
  //   D: house stars  15 %   (cumulative 100 %)
  const TYPE_THRESHOLDS = { A: 0.40, B: 0.70, C: 0.85 };

  // ms between spawn-attempt ticks — lower = denser cloud
  const SPAWN_INTERVAL = isMobile ? 120 : 55;

  // House colour palettes
  //   spark / bolt colours are CSS hex strings
  //   orb colour is an rgba() string (alpha kept for gradient blending)
  const PALETTES = {
    gryffindor: {
      spark : '#D3A625',
      orb   : 'rgba(116,  0,   1,  0.60)',
      star  : '#D3A625',
      bolt  : '#FFE566',
    },
    slytherin: {
      spark : '#AAAAAA',
      orb   : 'rgba( 26, 71,  42,  0.50)',
      star  : '#AAAAAA',
      bolt  : '#C8FFD4',
    },
    ravenclaw: {
      spark : '#946B2D',
      orb   : 'rgba( 14, 26,  64,  0.60)',
      star  : '#946B2D',
      bolt  : '#B8D4FF',
    },
    hufflepuff: {
      spark : '#ECB939',
      orb   : 'rgba(255,255, 200,  0.50)',
      star  : '#ECB939',
      bolt  : '#FFFAAA',
    },
  };

  let currentHouse   = 'gryffindor';
  let currentPalette = PALETTES.gryffindor;


  /* ── Section 3 : Particle Factory ────────────────────────────────────── */

  /**
   * Creates one particle of the given type.
   * x, y, vx, vy are optional — used for burst particles.
   */
  function createParticle(type, x, y, vx, vy) {
    const p   = { type };
    const pal = currentPalette;

    const rand = (lo, hi) => lo + Math.random() * (hi - lo);

    switch (type) {

      // ── Type A — Wand Sparks ──────────────────────────────────────────
      // Small ✦ glyphs, fast velocity, short-lived (1.5–2.5 s), fade quickly.
      // Spawned in small clusters; normal spawns also use spawnCluster().
      case 'A':
        p.x       = x  !== undefined ? x  : rand(0, W);
        p.y       = y  !== undefined ? y  : rand(0, H);
        p.vx      = vx !== undefined ? vx : rand(-2.8, 2.8);
        p.vy      = vy !== undefined ? vy : rand(-3.2, -0.6);
        p.life    = 0;
        p.maxLife = rand(1500, 2500);       // milliseconds
        p.size    = rand(8, 15);
        p.opacity = 1;
        p.color   = pal.spark;
        p.glyph   = '✦';
        break;

      // ── Type B — Lumos Orbs ───────────────────────────────────────────
      // Soft glowing circles (ctx.arc + radial gradient), slow drift,
      // long-lived (4–6 s), opacity pulses gently on a sine wave.
      case 'B':
        p.x       = x !== undefined ? x : rand(0, W);
        p.y       = y !== undefined ? y : rand(0, H);
        p.vx      = rand(-0.45, 0.45);
        p.vy      = rand(-0.65, -0.18);
        p.life    = 0;
        p.maxLife = rand(4000, 6000);
        p.radius  = rand(4, 9);
        p.opacity = 0;
        p.color   = pal.orb;                // rgba string — used in gradient
        p.phase   = rand(0, Math.PI * 2);   // randomise sine start position
        break;

      // ── Type C — Lightning Bolts ──────────────────────────────────────
      // Tiny ⚡ text that flash-appears at random positions.
      // No movement. Visible only 0.3–0.6 s, then instant fade.
      case 'C':
        p.x       = rand(0, W);
        p.y       = rand(0, H);
        p.vx      = 0;
        p.vy      = 0;
        p.life    = 0;
        p.maxLife = rand(300, 600);
        p.size    = rand(11, 20);
        p.opacity = 1;
        p.color   = pal.bolt;
        p.glyph   = '⚡';
        break;

      // ── Type D — House Stars ──────────────────────────────────────────
      // Small ★ shapes that drift upward slowly, fade in then fade out
      // as they near the top. Medium lifespan (3 s).
      case 'D':
        p.x       = rand(0, W);
        p.y       = rand(H * 0.25, H);     // spawn in lower 75 %
        p.vx      = rand(-0.35, 0.35);
        p.vy      = rand(-0.9, -0.30);
        p.life    = 0;
        p.maxLife = 3000;
        p.size    = rand(8, 15);
        p.opacity = 0;
        p.color   = pal.star;
        p.glyph   = '★';
        break;

      default:
        break;
    }

    return p;
  }


  /* ── Section 4 : Type Randomiser ─────────────────────────────────────── */

  function randomType() {
    const r = Math.random();
    if (r < TYPE_THRESHOLDS.A) return 'A';
    if (r < TYPE_THRESHOLDS.B) return 'B';
    if (r < TYPE_THRESHOLDS.C) return 'C';
    return 'D';
  }


  /* ── Section 5 : Cluster Spawner (Type A) ────────────────────────────── */

  /**
   * Emits 2–5 wand sparks within ±18 px of (cx, cy).
   * cx, cy default to a random canvas position when omitted.
   */
  function spawnCluster(cx, cy) {
    const n = 2 + Math.floor(Math.random() * 4);            // 2–5 per cluster
    const x = cx !== undefined ? cx : Math.random() * W;
    const y = cy !== undefined ? cy : Math.random() * H;

    for (let i = 0; i < n; i++) {
      if (particles.length >= MAX_PARTICLES) break;
      const ox = (Math.random() - 0.5) * 36;
      const oy = (Math.random() - 0.5) * 36;
      particles.push(createParticle('A', x + ox, y + oy));
    }
  }


  /* ── Section 6 : Update Logic ────────────────────────────────────────── */

  /**
   * Advances one particle by dt milliseconds.
   * Returns true when the particle has expired and should be removed.
   */
  function updateParticle(p, dt) {
    p.life += dt;

    const progress  = p.life / p.maxLife;               // 0 → 1
    const speedNorm = dt / 16.67;                        // normalise to 60 fps

    // Move
    p.x += p.vx * speedNorm;
    p.y += p.vy * speedNorm;

    switch (p.type) {

      case 'A': // Wand spark — quadratic fade, slight gravity
        p.vy      += 0.045 * speedNorm;
        p.opacity  = Math.max(0, 1 - progress * progress);
        break;

      case 'B': { // Lumos orb — sine-wave pulse, envelope fade-in/out
        const sinPulse = 0.5 + 0.5 * Math.sin(p.phase + (p.life / 750) * Math.PI * 2);
        const envelope =
          progress < 0.18 ? progress / 0.18 :
          progress > 0.80 ? (1 - progress) / 0.20 :
          1;
        p.opacity = envelope * (0.38 + 0.62 * sinPulse);
        break;
      }

      case 'C': // Lightning bolt — sharp on, fast fade after midpoint
        p.opacity = progress < 0.45 ? 1
                  : Math.max(0, 1 - (progress - 0.45) / 0.55);
        break;

      case 'D': // House star — fade in, cruise, fade out
        p.opacity =
          progress < 0.15 ? progress / 0.15 :
          progress > 0.68 ? Math.max(0, (1 - progress) / 0.32) :
          1;
        break;

      default:
        break;
    }

    return p.life >= p.maxLife || p.opacity <= 0.005;
  }


  /* ── Section 7 : Draw Logic ──────────────────────────────────────────── */

  function drawParticle(p) {
    if (p.opacity <= 0.005) return;

    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, p.opacity));

    if (p.type === 'B') {
      // Lumos orb — radial gradient: white centre → house orb colour → transparent
      const r    = p.radius;
      const halo = r * 2.8;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
      grad.addColorStop(0,    'rgba(255,255,255,0.90)');  // bright white core
      grad.addColorStop(0.30, p.color);                   // house rgba colour
      grad.addColorStop(1,    'rgba(0,0,0,0)');           // transparent edge

      ctx.beginPath();
      ctx.arc(p.x, p.y, halo, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

    } else {
      // Text-based particles — A (✦), C (⚡), D (★)
      ctx.font         = `${p.size}px sans-serif`;
      ctx.fillStyle    = p.color;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      // Glow on wand sparks and lightning bolts
      if (p.type === 'A' || p.type === 'C') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = p.type === 'C' ? 10 : 6;
      }

      ctx.fillText(p.glyph, p.x, p.y);
    }

    ctx.restore();
  }


  /* ── Section 8 : Spawn Throttler ─────────────────────────────────────── */

  let spawnAcc = 0;   // accumulates ms until next spawn tick

  function maybeSpawn(dt) {
    spawnAcc += dt;
    if (spawnAcc < SPAWN_INTERVAL) return;
    spawnAcc -= SPAWN_INTERVAL;

    if (particles.length >= MAX_PARTICLES) return;

    const type = randomType();

    if (type === 'A') {
      spawnCluster();               // sparks always come in clusters
    } else {
      particles.push(createParticle(type));
    }
  }


  /* ── Section 9 : Main Animation Loop ────────────────────────────────── */

  let particles = [];
  let rafId     = null;
  let lastTime  = 0;

  function loop(timestamp) {
    // Cap dt to 50 ms so a hidden tab doesn't cause a particle explosion on resume
    const dt  = lastTime ? Math.min(timestamp - lastTime, 50) : 16.67;
    lastTime  = timestamp;

    ctx.clearRect(0, 0, W, H);

    // Update → filter out dead → draw survivors
    particles = particles.filter(p => !updateParticle(p, dt));
    particles.forEach(drawParticle);

    maybeSpawn(dt);

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);


  /* ── Section 10 : houseChanged Event ────────────────────────────────── */

  function onHouseChanged(e) {
    const house = (e.detail && e.detail.house || '').toLowerCase();
    if (PALETTES[house]) {
      currentHouse   = house;
      currentPalette = PALETTES[house];
      // Existing live particles keep their original colours.
      // All newly spawned particles will pick up the new palette.
    }
  }

  window.addEventListener('houseChanged', onHouseChanged);


  /* ── Section 11 : envelopeTapped Burst ──────────────────────────────── */

  function onEnvelopeTapped(e) {
    const cx     = (e.detail && e.detail.x != null) ? e.detail.x : W / 2;
    const cy     = (e.detail && e.detail.y != null) ? e.detail.y : H / 2;
    const COUNT  = isMobile ? 20 : 40;

    for (let i = 0; i < COUNT; i++) {
      // Radiate sparks evenly in all directions with slight angle jitter
      const angle  = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const speed  = 2.5 + Math.random() * 4.5;
      const jitter = Math.random() * 22;        // slight origin scatter

      const p = createParticle(
        'A',
        cx + Math.cos(angle) * jitter,
        cy + Math.sin(angle) * jitter,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
      );

      // Burst particles are shorter-lived than ambient sparks
      p.maxLife = 700 + Math.random() * 1000;
      particles.push(p);
    }
  }

  window.addEventListener('envelopeTapped', onEnvelopeTapped);


  /* ── Section 12 : Cleanup ────────────────────────────────────────────── */

  /**
   * Stops the animation loop, clears the canvas, and removes event listeners.
   * Call when navigating away or closing the scroll.
   *
   * Usage:  window.destroyMagicParticles();
   */
  window.destroyMagicParticles = function () {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, W, H);
    particles = [];
    window.removeEventListener('resize',         onResize);
    window.removeEventListener('houseChanged',   onHouseChanged);
    window.removeEventListener('envelopeTapped', onEnvelopeTapped);
    window.destroyMagicParticles = null;
  };

} // end initMagicParticles
```
