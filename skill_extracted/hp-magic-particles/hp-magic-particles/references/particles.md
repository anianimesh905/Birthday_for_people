# HP Magic Particles — Complete JS Reference
# Drop the block below into script.js, replacing the existing sparkle/canvas code.

```javascript
/* ============================================================
   HP MAGIC PARTICLES  —  initMagicParticles()
   Self-contained canvas particle system for the birthday website.
   Replaces the existing sparkle canvas entirely.

   Particle types
     A  Wand sparks  ✦   40%  gold,  fast burst clusters,  1.5–2.5 s
     B  Lumos orbs   ●   30%  glow,  slow drift + sine pulse, 4–6 s
     C  Lightning    ⚡  15%  flash, stationary, 0.3–0.6 s
     D  House stars  ★   15%  drift upward slowly,  3 s

   Custom events (fire on window)
     houseChanged   { detail: { house: 'gryffindor' } }
     envelopeTapped { detail: { x: Number, y: Number } }

   Options (pass to initMagicParticles)
     canvasId  — id attribute for the canvas (default: 'magic-canvas')
     parent    — DOM node to append the canvas to (default: document.body)
   ============================================================ */

function initMagicParticles(opts = {}) {

  /* ── SECTION 1 : SETUP & CANVAS ───────────────────────────────────────── */

  const CANVAS_ID   = opts.canvasId || 'magic-canvas';
  const parent      = opts.parent   || document.body;

  // Remove any previous instance cleanly
  const old = document.getElementById(CANVAS_ID);
  if (old) old.remove();

  const canvas = document.createElement('canvas');
  canvas.id    = CANVAS_ID;
  Object.assign(canvas.style, {
    position       : 'fixed',
    top            : '0',
    left           : '0',
    width          : '100%',
    height         : '100%',
    pointerEvents  : 'none',
    zIndex         : '0',
  });
  parent.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);


  /* ── SECTION 2 : MOBILE PARTICLE CAP ─────────────────────────────────── */

  const IS_MOBILE      = window.innerWidth < 768;
  const MAX_PARTICLES  = IS_MOBILE ? 20 : 80;   // live particle ceiling
  const SPAWN_INTERVAL = IS_MOBILE ? 400 : 180;  // ms between ambient spawns


  /* ── SECTION 3 : HOUSE COLOUR PALETTES ───────────────────────────────── */

  const PALETTES = {
    gryffindor : {
      spark : '#D3A625',                     // gold
      orb   : 'rgba(116, 0, 1, 0.60)',       // deep red glow
      star  : '#D3A625',
      bolt  : '#FFD700',
    },
    slytherin  : {
      spark : '#AAAAAA',                     // silver
      orb   : 'rgba(26, 71, 42, 0.50)',      // dark green glow
      star  : '#AAAAAA',
      bolt  : '#C0C0C0',
    },
    ravenclaw  : {
      spark : '#946B2D',                     // bronze
      orb   : 'rgba(14, 26, 64, 0.60)',      // navy glow
      star  : '#946B2D',
      bolt  : '#B8A060',
    },
    hufflepuff : {
      spark : '#ECB939',                     // yellow
      orb   : 'rgba(255, 255, 200, 0.50)',   // cream glow
      star  : '#ECB939',
      bolt  : '#FFE066',
    },
  };

  // Current palette — default Gryffindor; overridden by houseChanged event
  let palette = { ...PALETTES.gryffindor };

  window.addEventListener('houseChanged', (e) => {
    const key = (e.detail && e.detail.house || '').toLowerCase();
    if (PALETTES[key]) palette = { ...PALETTES[key] };
  });

  // Also honour a pre-existing window.currentHouse if set before init
  if (window.currentHouse && PALETTES[window.currentHouse]) {
    palette = { ...PALETTES[window.currentHouse] };
  }


  /* ── SECTION 4 : PARTICLE POOL ───────────────────────────────────────── */

  const particles = [];

  /**
   * Shared particle shape.
   * All values are initialised by the factory functions below.
   */
  function Particle() {
    this.active = false;
  }

  // Pre-allocate the pool
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new Particle());
  }

  function getFreeParticle() {
    for (let i = 0; i < particles.length; i++) {
      if (!particles[i].active) return particles[i];
    }
    return null; // pool exhausted — skip spawn
  }


  /* ── SECTION 5 : PARTICLE FACTORIES ──────────────────────────────────── */

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* --- Type A : Wand Sparks ✦ --- */
  function spawnSparkCluster(cx, cy, count, radial) {
    count = count || Math.floor(rand(3, 7));
    cx    = cx    !== undefined ? cx : rand(0, canvas.width);
    cy    = cy    !== undefined ? cy : rand(0, canvas.height);

    for (let i = 0; i < count; i++) {
      const p = getFreeParticle();
      if (!p) return;

      let vx, vy;
      if (radial) {
        // Burst: radiate outward from center
        const angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
        const speed = rand(2.5, 6.0);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        vx = rand(-2.0, 2.0);
        vy = rand(-3.5, -0.8);
      }

      p.active   = true;
      p.type     = 'A';
      p.x        = cx + rand(-12, 12);
      p.y        = cy + rand(-12, 12);
      p.vx       = vx;
      p.vy       = vy;
      p.life     = rand(1.5, 2.5);     // seconds
      p.age      = 0;
      p.size     = rand(8, 14);        // font-size px for ✦
      p.color    = palette.spark;
      p.rotation = rand(0, Math.PI * 2);
      p.spin     = rand(-0.12, 0.12);
    }
  }

  /* --- Type B : Lumos Orbs ● --- */
  function spawnOrb() {
    const p = getFreeParticle();
    if (!p) return;

    p.active    = true;
    p.type      = 'B';
    p.x         = rand(0, canvas.width);
    p.y         = rand(0, canvas.height);
    p.vx        = rand(-0.35, 0.35);
    p.vy        = rand(-0.35, 0.35);
    p.life      = rand(4, 6);
    p.age       = 0;
    p.radius    = rand(3, 8);
    p.baseAlpha = rand(0.25, 0.55);
    p.pulseFreq = rand(1.2, 2.2);    // Hz
    p.color     = palette.orb;
    p.glowColor = palette.spark;
  }

  /* --- Type C : Lightning Bolts ⚡ --- */
  function spawnBolt() {
    const p = getFreeParticle();
    if (!p) return;

    p.active = true;
    p.type   = 'C';
    p.x      = rand(40, canvas.width  - 40);
    p.y      = rand(40, canvas.height - 40);
    p.vx     = 0;
    p.vy     = 0;
    p.life   = rand(0.3, 0.6);
    p.age    = 0;
    p.size   = rand(10, 18);
    p.color  = palette.bolt;
  }

  /* --- Type D : House Stars ★ --- */
  function spawnStar() {
    const p = getFreeParticle();
    if (!p) return;

    p.active = true;
    p.type   = 'D';
    p.x      = rand(0, canvas.width);
    p.y      = rand(canvas.height * 0.3, canvas.height);
    p.vx     = rand(-0.25, 0.25);
    p.vy     = rand(-1.1, -0.5);   // upward
    p.life   = 3.0;
    p.age    = 0;
    p.size   = rand(8, 16);
    p.color  = palette.star;
  }


  /* ── SECTION 6 : AMBIENT SPAWN SCHEDULER ─────────────────────────────── */

  const TYPE_WEIGHTS = [
    { fn: () => spawnSparkCluster(), weight: 40 },
    { fn: () => spawnOrb(),          weight: 30 },
    { fn: () => spawnBolt(),         weight: 15 },
    { fn: () => spawnStar(),         weight: 15 },
  ];

  function pickWeighted() {
    const roll = Math.random() * 100;
    let acc = 0;
    for (const entry of TYPE_WEIGHTS) {
      acc += entry.weight;
      if (roll < acc) { entry.fn(); return; }
    }
  }

  let lastSpawn = 0;

  function tickSpawner(now) {
    const alive = particles.filter(p => p.active).length;
    if (alive >= MAX_PARTICLES) return;
    if (now - lastSpawn > SPAWN_INTERVAL) {
      pickWeighted();
      lastSpawn = now;
    }
  }


  /* ── SECTION 7 : PARTICLE UPDATE ─────────────────────────────────────── */

  function updateParticle(p, dt) {
    p.age += dt;
    if (p.age >= p.life) { p.active = false; return; }

    const progress = p.age / p.life;   // 0 → 1

    switch (p.type) {

      case 'A': // Wand sparks — fast, fade out in last 30%
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;                  // slight gravity
        p.vx *= 0.97;                  // gentle drag
        p.rotation += p.spin;
        p.alpha = progress > 0.70
          ? 1 - (progress - 0.70) / 0.30
          : 1;
        // Re-tint if palette changed since spawn
        p.color = palette.spark;
        break;

      case 'B': // Lumos orbs — slow drift, sine pulse opacity
        p.x += p.vx;
        p.y += p.vy;
        // Soft sine wave on opacity
        p.alpha = p.baseAlpha
          * (0.55 + 0.45 * Math.sin(p.age * p.pulseFreq * Math.PI * 2));
        // Fade edges of lifespan
        if (progress < 0.15) p.alpha *= progress / 0.15;
        if (progress > 0.80) p.alpha *= 1 - (progress - 0.80) / 0.20;
        p.color     = palette.orb;
        p.glowColor = palette.spark;
        break;

      case 'C': // Lightning bolt — stationary, instant pop then fade
        p.alpha = progress < 0.25
          ? 1
          : 1 - (progress - 0.25) / 0.75;
        p.color = palette.bolt;
        break;

      case 'D': // House stars — upward drift, fade at top
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = progress < 0.15
          ? progress / 0.15
          : progress > 0.70
            ? 1 - (progress - 0.70) / 0.30
            : 1;
        p.color = palette.star;
        break;
    }
  }


  /* ── SECTION 8 : PARTICLE DRAW ───────────────────────────────────────── */

  function drawParticle(p) {
    if (!p.active) return;
    const alpha = Math.max(0, Math.min(1, p.alpha ?? 1));
    if (alpha <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = alpha;

    switch (p.type) {

      case 'A': { // ✦ rotated text
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font        = `${p.size}px serif`;
        ctx.fillStyle   = p.color;
        ctx.textAlign   = 'center';
        ctx.textBaseline= 'middle';
        ctx.fillText('✦', 0, 0);
        break;
      }

      case 'B': { // glowing arc circle
        const r = p.radius;
        // outer glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
        grad.addColorStop(0,   p.glowColor.replace(')', ', 0.30)').replace('rgba(', 'rgba(').replace('rgb(', 'rgba('));
        grad.addColorStop(0.4, p.color);
        grad.addColorStop(1,   'rgba(0,0,0,0)');

        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur  = r * 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright core
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,240,0.85)';
        ctx.fill();
        break;
      }

      case 'C': { // ⚡ text — no movement, centred
        ctx.font         = `bold ${p.size}px sans-serif`;
        ctx.fillStyle    = p.color;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor  = p.color;
        ctx.shadowBlur   = 8;
        ctx.fillText('⚡', p.x, p.y);
        break;
      }

      case 'D': { // ★ text
        ctx.font         = `${p.size}px serif`;
        ctx.fillStyle    = p.color;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', p.x, p.y);
        break;
      }
    }

    ctx.restore();
  }


  /* ── SECTION 9 : ENVELOPE BURST ──────────────────────────────────────── */

  window.addEventListener('envelopeTapped', (e) => {
    const detail = e.detail || {};
    const bx = typeof detail.x === 'number' ? detail.x : canvas.width  / 2;
    const by = typeof detail.y === 'number' ? detail.y : canvas.height / 2;
    const BURST_COUNT = IS_MOBILE ? 20 : 40;

    // Temporarily expand pool if needed, or recycle oldest sparks
    let emitted = 0;
    for (let i = 0; i < particles.length && emitted < BURST_COUNT; i++) {
      if (!particles[i].active) {
        // Spawn radial spark using the factory, but we need direct control
        const angle = (emitted / BURST_COUNT) * Math.PI * 2
                    + rand(-0.15, 0.15);
        const speed = rand(3.0, 7.5);
        const p        = particles[i];
        p.active       = true;
        p.type         = 'A';
        p.x            = bx;
        p.y            = by;
        p.vx           = Math.cos(angle) * speed;
        p.vy           = Math.sin(angle) * speed;
        p.life         = rand(1.2, 2.2);
        p.age          = 0;
        p.size         = rand(10, 18);
        p.color        = palette.spark;
        p.rotation     = angle;
        p.spin         = rand(-0.18, 0.18);
        p.alpha        = 1;
        emitted++;
      }
    }
  });


  /* ── SECTION 10 : ANIMATION LOOP ─────────────────────────────────────── */

  let lastTime = 0;
  let rafId    = null;

  function loop(now) {
    rafId = requestAnimationFrame(loop);

    const dt = Math.min((now - lastTime) / 1000, 0.1); // seconds, capped
    lastTime = now;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn ambient particles
    tickSpawner(now);

    // Update + draw
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].active) {
        updateParticle(particles[i], dt);
        drawParticle(particles[i]);
      }
    }
  }

  rafId = requestAnimationFrame((now) => { lastTime = now; loop(now); });


  /* ── SECTION 11 : CLEANUP / DESTROY ──────────────────────────────────── */

  /**
   * Call window._destroyMagicParticles() to stop the loop and remove
   * the canvas (useful for SPA navigation or hot-reload).
   */
  window._destroyMagicParticles = function () {
    if (rafId) cancelAnimationFrame(rafId);
    canvas.remove();
    window.removeEventListener('resize', resizeCanvas);
    delete window._destroyMagicParticles;
  };

} // end initMagicParticles
```
