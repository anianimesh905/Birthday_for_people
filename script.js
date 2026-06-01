/* ============================================================
   HOGWARTS BIRTHDAY EXPERIENCE — GOD-TIER JAVASCRIPT
   ============================================================ */

/* ── Screen height utility fix (Android address bar lock) ── */
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
setVh();
window.addEventListener("resize", setVh, { passive: true });
window.addEventListener("orientationchange", () => setTimeout(setVh, 300), { passive: true });

/* ── PRELOADED ASSET REGISTRY ── */
const PRELOADED_ASSETS = {};

const DEFAULT_SIZES = {
  "gryffindor.mp4": 2716980,
  "slytherin.mp4"  : 4421700,
  "ravenclaw.mp4"  : 2403039,
  "hufflepuff.mp4" : 7582169,
  "birthday.mp3"   : 4824920
};

/* ── HTML escaping helper ── */
function _escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Simple random number helper ── */
function rand(min, max) { 
  return min + Math.random() * (max - min); 
}

/* ── Procedural Web Audio Synthesis: Seal Crack Sound ── */
function playCrackSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const noise = Math.random() * 2 - 1;
      const decay = Math.exp(-i / (ctx.sampleRate * 0.025));
      data[i] = noise * decay;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(4, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noiseNode.start();
    
    setTimeout(() => {
      try {
        ctx.close();
      } catch (err) {}
    }, 300);
  } catch (e) {
    // Fail silently in case browser blocks context
  }
}

/* ── Procedural Web Audio Synthesis: Scroll Paper Sound ── */
function playScrollSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const duration = 0.8;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let brown = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      brown = (brown + 0.02 * white) / 1.02;

      let noise = (pink * 0.6 + brown * 12.0) * 0.5;

      const t = i / bufferSize;
      const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.5);

      let crackle = 0;
      if (Math.random() < 0.003) {
        crackle = (Math.random() * 2 - 1) * 0.4;
      }

      data[i] = (noise * 0.08 + crackle) * envelope;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseNode.start();

    setTimeout(() => {
      try { ctx.close(); } catch (err) {}
    }, duration * 1000 + 100);
  } catch (e) {
    // Fail silently
  }
}

/* ── Procedural Web Audio Synthesis: Ambient Wind/Waves Synthesizer ── */
let waveAudioCtx = null;
let waveNoiseSource = null;
let waveFilterNode = null;
let waveMainGain = null;
let waveLfoOsc = null;
let waveModInterval = null;
let waveCleanupTimeoutId = null;

function startAmbientWaves() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (waveCleanupTimeoutId) {
      clearTimeout(waveCleanupTimeoutId);
      waveCleanupTimeoutId = null;
    }

    if (!waveAudioCtx) {
      waveAudioCtx = new AudioContextClass();
    }

    if (waveAudioCtx.state === "suspended") {
      waveAudioCtx.resume();
    }

    const bufferSize = waveAudioCtx.sampleRate * 4;
    const buffer = waveAudioCtx.createBuffer(1, bufferSize, waveAudioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    if (waveNoiseSource) {
      try { waveNoiseSource.stop(); } catch(e) {}
      waveNoiseSource.disconnect();
    }
    if (waveLfoOsc) {
      try { waveLfoOsc.stop(); } catch(e) {}
      waveLfoOsc.disconnect();
    }
    if (waveModInterval) {
      clearInterval(waveModInterval);
    }

    waveNoiseSource = waveAudioCtx.createBufferSource();
    waveNoiseSource.buffer = buffer;
    waveNoiseSource.loop = true;

    waveFilterNode = waveAudioCtx.createBiquadFilter();
    waveFilterNode.type = "lowpass";
    waveFilterNode.Q.value = 1.2;

    waveMainGain = waveAudioCtx.createGain();
    waveMainGain.gain.setValueAtTime(0, waveAudioCtx.currentTime);

    waveLfoOsc = waveAudioCtx.createOscillator();
    waveLfoOsc.type = "sine";
    waveLfoOsc.frequency.value = 0.12;

    const lfoGain = waveAudioCtx.createGain();
    lfoGain.gain.value = 220;

    waveLfoOsc.connect(lfoGain);
    lfoGain.connect(waveFilterNode.frequency);

    waveFilterNode.frequency.setValueAtTime(320, waveAudioCtx.currentTime);

    waveNoiseSource.connect(waveFilterNode);
    waveFilterNode.connect(waveMainGain);
    waveMainGain.connect(waveAudioCtx.destination);

    waveNoiseSource.start(0);
    waveLfoOsc.start(0);

    waveMainGain.gain.linearRampToValueAtTime(0.08, waveAudioCtx.currentTime + 3.0);

    let angle = 0;
    waveModInterval = setInterval(() => {
      if (!waveAudioCtx || waveAudioCtx.state === "suspended") return;
      angle += 0.05;
      const sinVal = Math.sin(angle);
      const targetGain = 0.055 + sinVal * 0.025;
      if (waveMainGain) {
        waveMainGain.gain.setTargetAtTime(targetGain, waveAudioCtx.currentTime, 0.1);
      }
    }, 100);

  } catch (e) {
    // Fail silently
  }
}

function stopAmbientWaves() {
  if (waveModInterval) {
    clearInterval(waveModInterval);
    waveModInterval = null;
  }
  if (waveMainGain && waveAudioCtx) {
    try {
      waveMainGain.gain.cancelScheduledValues(waveAudioCtx.currentTime);
      waveMainGain.gain.linearRampToValueAtTime(0, waveAudioCtx.currentTime + 2.0);
    } catch(e) {}
  }
  
  if (waveCleanupTimeoutId) {
    clearTimeout(waveCleanupTimeoutId);
  }
  
  waveCleanupTimeoutId = setTimeout(() => {
    try {
      if (waveNoiseSource) {
        waveNoiseSource.stop();
        waveNoiseSource.disconnect();
        waveNoiseSource = null;
      }
      if (waveLfoOsc) {
        waveLfoOsc.stop();
        waveLfoOsc.disconnect();
        waveLfoOsc = null;
      }
      if (waveFilterNode) {
        waveFilterNode.disconnect();
        waveFilterNode = null;
      }
      if (waveMainGain) {
        waveMainGain.disconnect();
        waveMainGain = null;
      }
      waveCleanupTimeoutId = null;
    } catch (e) {
      // Fail silently
    }
  }, 2100);
}

/* ── Paragraph-Aware Stagger Reveal & Drop Cap ── */
function _injectDropCapAndStagger(el, text, intervalMs) {
  if (!el || !text) return;
  el.innerHTML = '';

  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  let globalDelay = 0;
  const BASE_DELAY_MS = intervalMs || 80;

  paragraphs.forEach((para, pIdx) => {
    const pEl = document.createElement('p');
    pEl.style.marginBottom = '0.9em';
    pEl.style.position = 'relative';
    pEl.style.zIndex  = '1';

    const words  = para.split(/\s+/).filter(Boolean);
    let startIdx = 0;

    // Inject drop cap only on the very first paragraph
    if (pIdx === 0 && words[0] && words[0].length > 0) {
      const capEl = document.createElement('span');
      capEl.className = 'drop-cap';
      capEl.textContent = words[0][0];
      pEl.appendChild(capEl);

      const restOfFirst = words[0].slice(1);
      if (restOfFirst) {
        const rSpan = document.createElement('span');
        rSpan.className = 'word-reveal';
        rSpan.style.animationDelay = `${globalDelay * BASE_DELAY_MS}ms`;
        rSpan.innerHTML = _escapeHtml(restOfFirst);
        pEl.appendChild(rSpan);
        globalDelay++;
      }
      
      if (words.length > 1) {
        pEl.appendChild(document.createTextNode(' '));
      }
      startIdx = 1;
    }

    for (let i = startIdx; i < words.length; i++) {
      const wSpan = document.createElement('span');
      wSpan.className = 'word-reveal';
      wSpan.style.animationDelay = `${globalDelay * BASE_DELAY_MS}ms`;
      wSpan.innerHTML = _escapeHtml(words[i]);
      pEl.appendChild(wSpan);
      
      if (i < words.length - 1) {
        pEl.appendChild(document.createTextNode(' '));
      }
      globalDelay++;
    }

    el.appendChild(pEl);
  });
}

function revealHogwartsLetter(msgEl, text, sigEl) {
  if (!msgEl) return;
  _injectDropCapAndStagger(msgEl, text || '', 80);

  const wordCount = (text || '').split(/\s+/).length;
  const totalDuration = wordCount * 80 + 400;

  if (sigEl) {
    sigEl.style.opacity = '0';
    sigEl.style.transition = 'opacity 0.6s ease';
    sigEl.textContent = window._bdSender || '';
    setTimeout(() => { sigEl.style.opacity = '1'; }, totalDuration);
  }

  // Handle auto-scroll down for long letters as they print
  const inner = document.getElementById('scroll-inner');
  if (inner) {
    const scrollInterval = setInterval(() => {
      inner.scrollTop = inner.scrollHeight;
    }, 120);
    setTimeout(() => clearInterval(scrollInterval), totalDuration + 200);
  }
}

/* ── Background Music Management ── */
function setupMusic(file, label) {
  const btn = document.getElementById("music-btn");
  if (!btn) return;
  const btnText = document.getElementById("music-btn-text");

  // Format label string (strip out emoji icons to avoid duplicate layouts)
  let cleanLabel = label || "Wingardium Leviosa";
  cleanLabel = cleanLabel.replace(/^[🎵🎶🎧📻🎹🎷🎺🎸🎻]\s*/g, "").trim();

  if (btnText) {
    btnText.textContent = cleanLabel;
  }

  const audioSrc = PRELOADED_ASSETS['musicFile'] || file;
  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.volume = 0.5;
  audio.preload = "auto";

  let playing = false;
  let started = false;
  let fadeInterval = null;

  function fadeInVolume() {
    if (fadeInterval) clearInterval(fadeInterval);
    audio.volume = 0;
    const startTime = Date.now();
    const duration = 1500;
    const targetVolume = 0.5;
    
    fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
        fadeInterval = null;
      } else {
        audio.volume = (elapsed / duration) * targetVolume;
      }
    }, 30);
  }

  function startMusic() {
    if (started) return;
    started = true;
    
    audio.play()
      .then(() => {
        playing = true;
        if (btnText) btnText.textContent = "Now Playing";
        btn.classList.add("playing");
        fadeInVolume();
      })
      .catch(() => {
        started = false;
        if (btnText) btnText.textContent = cleanLabel;
      });
  }
  window.startMusic = startMusic;

  function toggleMusic() {
    if (playing) {
      audio.pause();
      playing = false;
      if (btnText) btnText.textContent = cleanLabel;
      btn.classList.remove("playing");
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    } else {
      audio.play()
        .then(() => {
          playing = true;
          started = true;
          if (btnText) btnText.textContent = "Now Playing";
          btn.classList.add("playing");
          fadeInVolume();
        })
        .catch(() => {});
    }
  }

  // Attempt autoplay immediately
  startMusic();

  // Also attempt after a short delay in case loading wasn't complete
  setTimeout(startMusic, 1200);

  function onFirstInteraction() {
    startMusic();
    document.removeEventListener("touchend", onFirstInteraction);
    document.removeEventListener("click", onFirstInteraction);
  }

  document.addEventListener("touchend", onFirstInteraction, { once: true, passive: true });
  document.addEventListener("click", onFirstInteraction, { once: true });

  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMusic();
  });
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

/* ── Crossfading Video Background Engine ── */
let _activeVideo = null;
let _bufferVideo = null;

function initVideoBackground(cfg) {
  const videoBg = document.getElementById('video-bg');
  if (!videoBg) return;

  _activeVideo = document.getElementById('bg-video');
  if (!_activeVideo) return;

  _activeVideo.muted = true;
  _activeVideo.loop = true;
  _activeVideo.playsInline = true;
  _activeVideo.setAttribute('playsinline', '');
  _activeVideo.setAttribute('disablePictureInPicture', '');
  _activeVideo.style.opacity = '0';

  // Instantiate buffer element for smooth transitions
  _bufferVideo = document.createElement('video');
  _bufferVideo.className = 'bg-video';
  _bufferVideo.muted = true;
  _bufferVideo.loop = true;
  _bufferVideo.playsInline = true;
  _bufferVideo.setAttribute('playsinline', '');
  _bufferVideo.setAttribute('disablePictureInPicture', '');
  _bufferVideo.style.opacity = '0';
  _activeVideo.parentNode.insertBefore(_bufferVideo, _activeVideo.nextSibling);

  // Hook background shifts to Custom Event
  window.addEventListener('houseChanged', (e) => {
    const key = (e.detail && e.detail.house) || '';
    loadHouseVideo(key, true);
  });

  const defaultHouse = window.currentHouse || ((cfg && cfg.defaultHouse) || 'Slytherin').toLowerCase();
  loadHouseVideo(defaultHouse, false);
}

function loadHouseVideo(houseName, animate) {
  const key = (houseName || '').toLowerCase();
  const c = window._bdContent || (typeof BIRTHDAY_CONTENT !== 'undefined' ? BIRTHDAY_CONTENT : {});
  if (!c) return;

  const houseKeys = {
    gryffindor: { video: 'gryffindorVideo', fallback: 'gryffindorFallbackColor' },
    slytherin:  { video: 'slytherinVideo',  fallback: 'slytherinFallbackColor'  },
    ravenclaw:  { video: 'ravenclawVideo',  fallback: 'ravenclawFallbackColor'  },
    hufflepuff: { video: 'hufflepuffVideo', fallback: 'hufflepuffFallbackColor' }
  };

  const currentTheme = houseKeys[key];
  if (!currentTheme) return;

  const videoFile = c[currentTheme.video];
  const videoSrc = PRELOADED_ASSETS[currentTheme.video] || (videoFile ? videoFile : null);
  const fallbackColor = c[currentTheme.fallback] || '#0d1b2a';
  const videoBg = document.getElementById('video-bg');

  if (videoBg) {
    videoBg.classList.remove('fallback-gryffindor', 'fallback-slytherin', 'fallback-ravenclaw', 'fallback-hufflepuff');
  }

  function applyFallback() {
    document.body.style.backgroundColor = fallbackColor;
    if (videoBg) videoBg.classList.add(`fallback-${key}`);
    if (_activeVideo) _activeVideo.style.opacity = '0';
    if (_bufferVideo) _bufferVideo.style.opacity = '0';
  }

  if (!videoSrc) {
    applyFallback();
    return;
  }

  if (!animate) {
    // Initial display setup
    _activeVideo.src = videoSrc;
    _activeVideo.load();
    _activeVideo.oncanplay = () => {
      _activeVideo.oncanplay = null;
      _activeVideo.play()
        .then(() => {
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
        })
        .catch(applyFallback);
    };
    _activeVideo.onerror = applyFallback;
    return;
  }

  // Crossfade transition timing sequence
  _activeVideo.style.opacity = '0';
  setTimeout(() => {
    _bufferVideo.src = videoSrc;
    _bufferVideo.load();
    _bufferVideo.onerror = applyFallback;
    _bufferVideo.oncanplay = () => {
      _bufferVideo.oncanplay = null;
      _bufferVideo.play()
        .then(() => {
          _bufferVideo.classList.add('loaded');
          _bufferVideo.style.opacity = '1';
          setTimeout(() => {
            _activeVideo.pause();
            _activeVideo.style.opacity = '0';
            const temp = _activeVideo;
            _activeVideo = _bufferVideo;
            _bufferVideo = temp;
          }, 600);
        })
        .catch(applyFallback);
    };
  }, 400);
}

/* ── Interactive Particle Canvas Engine ── */
function initMagicParticles(opts = {}) {
  const CANVAS_ID = opts.canvasId || 'sparkle-canvas';
  const parent = opts.parent || document.body;

  const canvas = document.getElementById(CANVAS_ID);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const IS_MOBILE = window.innerWidth < 768;
  const MAX_PARTICLES = IS_MOBILE ? 20 : 80;
  const SPAWN_INTERVAL = IS_MOBILE ? 400 : 180;

  const PALETTES = {
    gryffindor: { spark: '#D3A625', orb: 'rgba(116, 0, 1, 0.60)',   star: '#D3A625', bolt: '#FFD700' },
    slytherin:  { spark: '#AAAAAA', orb: 'rgba(26, 71, 42, 0.50)',  star: '#AAAAAA', bolt: '#C0C0C0' },
    ravenclaw:  { spark: '#946B2D', orb: 'rgba(14, 26, 64, 0.60)',  star: '#946B2D', bolt: '#B8A060' },
    hufflepuff: { spark: '#ECB939', orb: 'rgba(255, 255, 200, 0.50)', star: '#ECB939', bolt: '#FFE066' },
  };

  let palette = { ...PALETTES.gryffindor };

  window.addEventListener('houseChanged', (e) => {
    const key = (e.detail && e.detail.house || '').toLowerCase();
    if (PALETTES[key]) palette = { ...PALETTES[key] };
  });

  if (window.currentHouse && PALETTES[window.currentHouse]) {
    palette = { ...PALETTES[window.currentHouse] };
  }

  const particles = [];
  function Particle() { 
    this.active = false; 
  }
  for (let i = 0; i < MAX_PARTICLES; i++) { 
    particles.push(new Particle()); 
  }

  function getFreeParticle() {
    for (let i = 0; i < particles.length; i++) {
      if (!particles[i].active) return particles[i];
    }
    return null;
  }

  function spawnSparkCluster(cx, cy, count, radial) {
    count = count || Math.floor(rand(3, 7));
    cx = cx !== undefined ? cx : rand(0, canvas.width);
    cy = cy !== undefined ? cy : rand(0, canvas.height);
    for (let i = 0; i < count; i++) {
      const p = getFreeParticle();
      if (!p) return;
      let vx, vy;
      if (radial) {
        const angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
        const speed = rand(2.5, 6.0);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        vx = rand(-2.0, 2.0);
        vy = rand(-3.5, -0.8);
      }
      p.active = true; 
      p.type = 'A';
      p.x = cx + rand(-12, 12); 
      p.y = cy + rand(-12, 12);
      p.vx = vx; 
      p.vy = vy;
      p.life = rand(1.5, 2.5); 
      p.age = 0;
      p.size = rand(8, 14); 
      p.color = palette.spark;
      p.rotation = rand(0, Math.PI * 2); 
      p.spin = rand(-0.12, 0.12);
    }
  }

  function spawnOrb() {
    const p = getFreeParticle(); 
    if (!p) return;
    p.active = true; 
    p.type = 'B';
    p.x = rand(0, canvas.width); 
    p.y = rand(0, canvas.height);
    p.vx = rand(-0.35, 0.35); 
    p.vy = rand(-0.35, 0.35);
    p.life = rand(4, 6); 
    p.age = 0;
    p.radius = rand(3, 8); 
    p.baseAlpha = rand(0.25, 0.55);
    p.pulseFreq = rand(1.2, 2.2);
    p.color = palette.orb; 
    p.glowColor = palette.spark;
  }

  function spawnBolt() {
    const p = getFreeParticle(); 
    if (!p) return;
    p.active = true; 
    p.type = 'C';
    p.x = rand(40, canvas.width - 40); 
    p.y = rand(40, canvas.height - 40);
    p.vx = 0; 
    p.vy = 0;
    p.life = rand(0.3, 0.6); 
    p.age = 0;
    p.size = rand(10, 18); 
    p.color = palette.bolt;
  }

  function spawnStar() {
    const p = getFreeParticle(); 
    if (!p) return;
    p.active = true; 
    p.type = 'D';
    p.x = rand(0, canvas.width); 
    p.y = rand(canvas.height * 0.3, canvas.height);
    p.vx = rand(-0.25, 0.25); 
    p.vy = rand(-1.1, -0.5);
    p.life = 3.0; 
    p.age = 0;
    p.size = rand(8, 16); 
    p.color = palette.star;
  }

  const TYPE_WEIGHTS = [
    { fn: spawnSparkCluster, weight: 40 },
    { fn: spawnOrb,          weight: 30 },
    { fn: spawnBolt,         weight: 15 },
    { fn: spawnStar,         weight: 15 },
  ];

  function pickWeighted() {
    const roll = Math.random() * 100;
    let acc = 0;
    for (const entry of TYPE_WEIGHTS) {
      acc += entry.weight;
      if (roll < acc) { 
        entry.fn(); 
        return; 
      }
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

  function updateParticle(p, dt) {
    p.age += dt;
    if (p.age >= p.life) { 
      p.active = false; 
      return; 
    }
    const progress = p.age / p.life;
    switch (p.type) {
      case 'A':
        p.x += p.vx; 
        p.y += p.vy;
        p.vy += 0.06; 
        p.vx *= 0.97; 
        p.rotation += p.spin;
        p.alpha = progress > 0.70 ? 1 - (progress - 0.70) / 0.30 : 1;
        p.color = palette.spark;
        break;
      case 'B':
        p.x += p.vx; 
        p.y += p.vy;
        p.alpha = p.baseAlpha * (0.55 + 0.45 * Math.sin(p.age * p.pulseFreq * Math.PI * 2));
        if (progress < 0.15) p.alpha *= progress / 0.15;
        if (progress > 0.80) p.alpha *= 1 - (progress - 0.80) / 0.20;
        p.color = palette.orb; 
        p.glowColor = palette.spark;
        break;
      case 'C':
        p.alpha = progress < 0.25 ? 1 : 1 - (progress - 0.25) / 0.75;
        p.color = palette.bolt;
        break;
      case 'D':
        p.x += p.vx; 
        p.y += p.vy;
        p.alpha = progress < 0.15 ? progress / 0.15
                : progress > 0.70 ? 1 - (progress - 0.70) / 0.30 : 1;
        p.color = palette.star;
        break;
    }
  }

  function drawParticle(p) {
    if (!p.active) return;
    const alpha = Math.max(0, Math.min(1, p.alpha ?? 1));
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    switch (p.type) {
      case 'A': {
        ctx.translate(p.x, p.y); 
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px serif`; 
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle';
        ctx.fillText('✦', 0, 0);
        break;
      }
      case 'B': {
        const r = p.radius;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
        grad.addColorStop(0, p.glowColor.replace(')', ', 0.30)').replace('rgba(', 'rgba(').replace('rgb(', 'rgba('));
        grad.addColorStop(0.4, p.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.shadowColor = p.glowColor; 
        ctx.shadowBlur = r * 4;
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad; 
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,240,0.85)'; 
        ctx.fill();
        break;
      }
      case 'C': {
        ctx.font = `bold ${p.size}px sans-serif`; 
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle';
        ctx.shadowColor = p.color; 
        ctx.shadowBlur = 8;
        ctx.fillText('⚡', p.x, p.y);
        break;
      }
      case 'D': {
        ctx.font = `${p.size}px serif`; 
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle';
        ctx.fillText('★', p.x, p.y);
        break;
      }
    }
    ctx.restore();
  }

  window.addEventListener('envelopeTapped', (e) => {
    const detail = e.detail || {};
    const bx = typeof detail.x === 'number' ? detail.x : canvas.width / 2;
    const by = typeof detail.y === 'number' ? detail.y : canvas.height / 2;
    const BURST_COUNT = IS_MOBILE ? 20 : 40;
    let emitted = 0;
    for (let i = 0; i < particles.length && emitted < BURST_COUNT; i++) {
      if (!particles[i].active) {
        const angle = (emitted / BURST_COUNT) * Math.PI * 2 + rand(-0.15, 0.15);
        const speed = rand(3.0, 7.5);
        const p = particles[i];
        p.active = true; 
        p.type = 'A';
        p.x = bx; 
        p.y = by;
        p.vx = Math.cos(angle) * speed; 
        p.vy = Math.sin(angle) * speed;
        p.life = rand(1.2, 2.2); 
        p.age = 0;
        p.size = rand(10, 18); 
        p.color = palette.spark;
        p.rotation = angle; 
        p.spin = rand(-0.18, 0.18); 
        p.alpha = 1;
        emitted++;
      }
    }
  });

  window.addEventListener('click', (e) => {
    spawnSparkCluster(e.clientX, e.clientY, 5, true);
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      spawnSparkCluster(e.changedTouches[0].clientX, e.changedTouches[0].clientY, 4, true);
    }
  }, { passive: true });

  let lastTime = 0;
  let rafId = null;

  function loop(now) {
    rafId = requestAnimationFrame(loop);
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tickSpawner(now);
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].active) {
        updateParticle(particles[i], dt);
        drawParticle(particles[i]);
      }
    }
  }

  rafId = requestAnimationFrame((now) => { 
    lastTime = now; 
    loop(now); 
  });

  window._destroyMagicParticles = function () {
    if (rafId) cancelAnimationFrame(rafId);
    canvas.remove();
    window.removeEventListener('resize', resizeCanvas);
    delete window._destroyMagicParticles;
  };
}

/* ── Drag/Swipe Modal Dismiss gesture triggers ── */
function initSwipeDismiss() {
  const paper = document.getElementById("scroll-paper");
  const overlay = document.getElementById("scroll-overlay");
  const inner = document.getElementById("scroll-inner");
  if (!paper || !overlay) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  paper.addEventListener("touchstart", (e) => {
    if (inner && inner.scrollTop > 0) return;
    startY = e.touches[0].clientY;
    isDragging = true;
    paper.style.transition = "none";
  }, { passive: true });

  paper.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      if (e.cancelable) e.preventDefault();
      currentY = deltaY;
      const dampedY = Math.pow(currentY, 0.85); 
      paper.style.transform = `scale(1) translateY(${dampedY}px) rotate(0deg)`;
      
      const opacity = 1 - Math.min(dampedY / 300, 0.5);
      overlay.style.backgroundColor = `rgba(6, 3, 1, ${opacity * 0.72})`;
    } else {
      paper.style.transform = "";
      overlay.style.backgroundColor = "";
      isDragging = false;
    }
  }, { passive: false });

  paper.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    paper.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    overlay.style.transition = "opacity 0.55s ease, background-color 0.55s ease";

    const deltaY = currentY;
    currentY = 0;

    if (deltaY > 150) {
      overlay.classList.remove("open");
      stopAmbientWaves();
      paper.classList.remove("unfolded");
      setTimeout(() => {
        paper.style.transform = "";
        overlay.style.backgroundColor = "";
        overlay.style.transition = "";
        paper.style.transition = "";
      }, 600);
    } else {
      paper.style.transform = "scale(1) translateY(0px) rotate(0deg)";
      overlay.style.backgroundColor = "";
    }
  });
}

/* ── Mouse & Gyroscope Parallax Tilting ── */
function initParallax() {
  let targetMx = 0;
  let targetMy = 0;
  let currentMx = 0;
  let currentMy = 0;

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    targetMx = (dx / cx) * 100;
    targetMy = (dy / cy) * 100;
  }, { passive: true });

  window.addEventListener("deviceorientation", (e) => {
    let gamma = e.gamma || 0;
    let beta = e.beta || 0;

    if (beta < -30) beta = -30;
    if (beta > 60) beta = 60;
    
    const normGamma = gamma / 45;
    const normBeta = (beta - 15) / 45;

    targetMx = normGamma * 100;
    targetMy = normBeta * 100;
  }, { passive: true });

  function updateParallax() {
    currentMx += (targetMx - currentMx) * 0.08;
    currentMy += (targetMy - currentMy) * 0.08;
    
    document.documentElement.style.setProperty("--mx", currentMx.toFixed(2));
    document.documentElement.style.setProperty("--my", currentMy.toFixed(2));
    
    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}

/* ── Scroll elements reveals ── */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-glow, .reveal-scale");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("revealed"));
  }
}

/* ── Dynamic Seal Crack Particle Burst ── */
function burstSealParticles(cx, cy) {
  const count = 18;
  const houseColor = window.currentHouseAccent || "#D3A625";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "seal-crack";
    const angle = (i / count) * 360 + Math.random() * 20;
    const dist = Math.random() * 55 + 25;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    const dur = (Math.random() * 0.35 + 0.55).toFixed(2);
    const size = Math.random() * 5 + 3;

    p.style.cssText = `
      left: ${cx}px;
      top:  ${cy}px;
      width: ${size}px;
      height: ${size}px;
      background: ${houseColor};
      box-shadow: 0 0 8px ${houseColor};
      --sc-tx: ${tx.toFixed(0)}px;
      --sc-ty: ${ty.toFixed(0)}px;
      --sc-dur: ${dur}s;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), parseFloat(dur) * 1000 + 100);
  }
}

/* ── Confetti Particle Burst ── */
function spawnConfetti() {
  const housePrimary = window.currentHousePrimary || "#740001";
  const houseAccent = window.currentHouseAccent || "#D3A625";
  const colors = [
    housePrimary,
    houseAccent,
    "#ffd700",
    "#ffffff",
    "#e8643a",
    "#ffffffcc",
    "#f5c842",
  ];
  const shapes = ["50%", "3px", "2px"];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 45; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = Math.random() * 9 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const radius = shapes[Math.floor(Math.random() * shapes.length)];
    const angle = Math.random() * 360;
    const dist = Math.random() * 230 + 70;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist + Math.random() * 180;
    const dur = (Math.random() * 1.4 + 1.7).toFixed(2);
    const delay = (Math.random() * 0.35).toFixed(2);
    const rot = Math.random() * 640 - 320;

    piece.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      width: ${size}px;
      height: ${size * (Math.random() * 0.5 + 0.5)}px;
      background: ${color};
      --cf-tx: ${tx.toFixed(0)}px;
      --cf-ty: ${ty.toFixed(0)}px;
      --cf-dur: ${dur}s;
      --cf-delay: ${delay}s;
      --cf-rot: ${rot}deg;
      --cf-radius: ${radius};
    `;
    document.body.appendChild(piece);
    setTimeout(
      () => piece.remove(),
      (parseFloat(dur) + parseFloat(delay) + 0.2) * 1000
    );
  }
}

/* ── Sorting Hat House Selector Toast ── */
let toastTimer = null;
function showHouseToast(cfg, key) {
  const toast = document.getElementById('house-toast');
  if (!toast) return;

  const emojis = {
    gryffindor: '🦁',
    slytherin: '🐍',
    ravenclaw: '🦅',
    hufflepuff: '🦡'
  };
  const emoji = emojis[key] || '✦';

  toast.textContent = `The Sorting Hat has chosen… ${cfg.label}! ${emoji}`;
  toast.style.background = cfg.toastBg;
  toast.style.color = cfg.toastColor || '#ffffff';
  toast.style.borderColor = cfg.accent + '66';

  clearTimeout(toastTimer);
  toast.classList.remove('visible');
  void toast.offsetWidth;
  toast.classList.add('visible');

  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

/* ── House Seal Letter Initial Setup ── */
function updateSealForHouse(houseName) {
  const key = (houseName || '').toLowerCase();
  const initials = {
    gryffindor: 'G',
    slytherin:  'S',
    ravenclaw:  'R',
    hufflepuff: 'H'
  };

  const sealLetter = document.getElementById('env-seal-letter');
  if (sealLetter) {
    sealLetter.textContent = initials[key] || 'H';
  }
}

/* ── Delivery Owl Animation Trigger ── */
function triggerOwlDelivery() {
  const owl1 = document.querySelector('.owl-1');
  if (!owl1) return;
  owl1.classList.add('owl-delivering');
  setTimeout(() => owl1.classList.remove('owl-delivering'), 800);
}

/* ── Central Selection logic ── */
const HOUSES = {
  gryffindor: {
    label: 'Gryffindor',
    primary: '#740001',
    accent: '#D3A625',
    toastBg: 'rgba(116,0,1,0.92)',
    message: 'gryffindorMessage',
    video: 'gryffindorVideo',
    fallback: 'gryffindorFallbackColor'
  },
  slytherin: {
    label: 'Slytherin',
    primary: '#1A472A',
    accent: '#AAAAAA',
    toastBg: 'rgba(26,71,42,0.92)',
    message: 'slytherinMessage',
    video: 'slytherinVideo',
    fallback: 'slytherinFallbackColor'
  },
  ravenclaw: {
    label: 'Ravenclaw',
    primary: '#0E1A40',
    accent: '#946B2D',
    toastBg: 'rgba(14,26,64,0.92)',
    message: 'ravenclawMessage',
    video: 'ravenclawVideo',
    fallback: 'ravenclawFallbackColor'
  },
  hufflepuff: {
    label: 'Hufflepuff',
    primary: '#ECB939',
    accent: '#2A2A2A',
    toastBg: 'rgba(236,185,57,0.95)',
    toastColor: '#1a1a1a',
    message: 'hufflepuffMessage',
    video: 'hufflepuffVideo',
    fallback: 'hufflepuffFallbackColor'
  }
};

let _currentHouse = 'gryffindor';

function selectHouse(houseName, opts = {}) {
  const key = (houseName || '').toLowerCase();
  const cfg = HOUSES[key];
  if (!cfg) return;

  const { siteContent, silent } = opts;
  _currentHouse = key;
  window.currentHouse = key;
  window.currentHousePrimary = cfg.primary;
  window.currentHouseAccent = cfg.accent;

  // 1. Update body class list matching tokens
  document.body.className = document.body.className
    .replace(/\btheme-\w+/g, '')
    .trim();
  document.body.classList.add(`theme-${key}`);

  // 2. Set dynamic theme property variables
  const root = document.documentElement;
  root.style.setProperty('--house-primary', cfg.primary);
  root.style.setProperty('--house-accent',  cfg.accent);

  // 2b. Update Android theme-color meta tag for native status bar integration
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', cfg.primary);
  }

  // 3. Update badges selection status attributes
  document.querySelectorAll('.house-badge').forEach(b => {
    const bHouse = b.getAttribute('data-house');
    const isActive = bHouse === key;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-checked', String(isActive));
    
    // Animate badge image spin
    if (isActive && !silent) {
      b.classList.add('pop-active');
      const bImg = b.querySelector('.badge-img');
      if (bImg) {
        bImg.classList.remove('spinning');
        void bImg.offsetWidth;
        bImg.classList.add('spinning');
        bImg.addEventListener('animationend', () => bImg.classList.remove('spinning'), { once: true });
      }
      setTimeout(() => b.classList.remove('pop-active'), 400);
    }
  });

  // 4. Update letter wax seal
  updateSealForHouse(key);

  // 5. Fire global shift trigger
  window.dispatchEvent(new CustomEvent('houseChanged', { 
    detail: { house: key, primary: cfg.primary, accent: cfg.accent } 
  }));

  // 6. Present selection toast
  if (!silent) {
    showHouseToast(cfg, key);
  }
}

/* ── House Selector UI Initializer ── */
function initHouseSelector(siteContent) {
  const overlay = document.getElementById('house-selector-overlay');
  const badges = document.querySelectorAll('.house-badge');
  if (!overlay) return;

  const savedHouse = sessionStorage.getItem('selectedHouse');

  if (savedHouse) {
    overlay.style.display = 'none';
    overlay.classList.add('hidden');
    selectHouse(savedHouse, { siteContent, silent: true });
  } else {
    // Show overlay centered, hiding components behind
    overlay.style.display = 'flex';
    void overlay.offsetWidth;
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    
    const defaultHouse = ((siteContent && siteContent.defaultHouse) || 'Slytherin').toLowerCase();
    selectHouse(defaultHouse, { siteContent, silent: true });
  }

  badges.forEach(badge => {
    const house = badge.getAttribute('data-house');
    
    const handleSelection = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      sessionStorage.setItem('selectedHouse', house);
      selectHouse(house, { siteContent, silent: false });
      
      overlay.classList.add('hidden');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 600);
      
      if (typeof window.startMusic === 'function') {
        window.startMusic();
      }
    };

    badge.addEventListener('click', handleSelection);
    badge.addEventListener('touchend', handleSelection);
  });

  // Handle bottom-left house selector re-trigger
  const switcherBtn = document.getElementById('house-switch-btn');
  if (switcherBtn) {
    const handleSwitch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Open selector overlay
      overlay.style.display = 'flex';
      void overlay.offsetWidth;
      overlay.classList.remove('hidden');
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      
      if (typeof window.startMusic === 'function') {
        window.startMusic();
      }
    };
    
    switcherBtn.addEventListener('click', handleSwitch);
    switcherBtn.addEventListener('touchend', handleSwitch);
  }
}

/* ── Sealed Envelope Interaction Sequences ── */
function initEnvelope() {
  const wrapper = document.getElementById("envelope-wrapper");
  const envelope = document.getElementById("envelope");
  const overlay = document.getElementById("scroll-overlay");
  const paper = document.getElementById("scroll-paper");
  const closeBtn = document.getElementById("scroll-close");
  const msgEl = document.getElementById("scroll-message");
  const sigEl = document.getElementById("scroll-signature");
  const hint = document.getElementById("envelope-hint");
  const seal = document.getElementById("env-seal");

  if (!wrapper || !envelope || !overlay) return;

  let opened = false;

  function openEnvelope(e) {
    if (typeof window.startMusic === 'function') {
      window.startMusic();
    }
    if (opened) {
      overlay.classList.add("open");
      startAmbientWaves();
      setTimeout(() => {
        if (paper) {
          paper.classList.add("unfolded");
          playScrollSound();
        }
      }, 300);
      return;
    }
    opened = true;

    // Guard seal positions cleanly
    let sealCx = window.innerWidth / 2;
    let sealCy = window.innerHeight / 2;
    if (seal) {
      const sealRect = seal.getBoundingClientRect();
      if (sealRect.width > 0) {
        sealCx = sealRect.left + sealRect.width / 2;
        sealCy = sealRect.top + sealRect.height / 2;
      }
    }

    // Unseal interactions
    burstSealParticles(sealCx, sealCy);
    playCrackSound();

    if (window.navigator && typeof window.navigator.vibrate === "function") {
      try {
        window.navigator.vibrate([50, 30, 50]);
      } catch (err) {}
    }

    // Top flap rotates open, letter rises
    setTimeout(() => {
      envelope.classList.add("open");
    }, 120);

    if (hint) {
      hint.style.transition = "opacity 0.5s ease";
      hint.style.opacity = "0";
    }

    triggerOwlDelivery();

    const wrapperRect = wrapper.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('envelopeTapped', {
      detail: {
        x: wrapperRect.left + wrapperRect.width / 2,
        y: wrapperRect.top + wrapperRect.height / 2
      }
    }));

    // Scroll open modal sequence
    setTimeout(() => {
      overlay.classList.add("open");
      startAmbientWaves();

      setTimeout(() => {
        if (paper) {
          paper.classList.add("unfolded");
          playScrollSound();
        }
      }, 300);

      spawnConfetti();

      // Salutation mapping
      const titleEl = document.getElementById('scroll-title');
      if (titleEl) {
        const nameSpan = titleEl.querySelector('#friend-name');
        const c = window._bdContent || {};
        if (nameSpan) nameSpan.textContent = c.friendName || '';
      }

      const c2 = window._bdContent || {};
      const houseCfg = HOUSES[_currentHouse] || HOUSES.gryffindor;
      const msg = c2[houseCfg.message] || c2.slytherinMessage || '';

      setTimeout(() => revealHogwartsLetter(msgEl, msg, sigEl), 600);
    }, 900);
  }

  function closeModal() {
    overlay.classList.remove("open");
    stopAmbientWaves();
    if (paper) paper.classList.remove("unfolded");
  }

  wrapper.addEventListener("touchend", (e) => {
    e.preventDefault();
    openEnvelope(e);
  });
  wrapper.addEventListener("click", openEnvelope);
  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope(e);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      closeModal();
    });
    closeBtn.addEventListener("click", closeModal);
  }

  overlay.addEventListener("touchend", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      closeModal();
    }
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Live update of scroll content if house changes when scroll is already open
  window.addEventListener('houseChanged', (e) => {
    if (opened && msgEl) {
      const c2 = window._bdContent || {};
      const newHouse = e.detail.house;
      const houseCfg = HOUSES[newHouse] || HOUSES.gryffindor;
      const msg = c2[houseCfg.message] || c2.slytherinMessage || '';
      
      // Update friend name salutation
      const titleEl = document.getElementById('scroll-title');
      if (titleEl) {
        const nameSpan = titleEl.querySelector('#friend-name');
        if (nameSpan) nameSpan.textContent = c2.friendName || '';
      }
      
      revealHogwartsLetter(msgEl, msg, sigEl);
    }
  });
}

/* ── Core Main Application Bootstrap Sequence ── */
function initializeMainApp() {
  const c = typeof BIRTHDAY_CONTENT !== "undefined" ? BIRTHDAY_CONTENT : {};

  // Setup dynamic content details
  if (c.friendName) {
    const heroName = document.getElementById("hero-friend-name");
    if (heroName) heroName.textContent = c.friendName;
    const heroDate = document.getElementById("birthday-date");
    if (heroDate) heroDate.textContent = c.birthdayDate || "";
    const heroTagline = document.getElementById("tagline");
    if (heroTagline && c.tagline) heroTagline.textContent = c.tagline;

    const addrName = document.querySelector(".env-address-name");
    if (addrName) addrName.textContent = c.friendName;

    const hint = document.getElementById("envelope-hint");
    if (hint && c.openingCharm) hint.textContent = c.openingCharm;

    window._bdSender = c.senderName || "";
    window._bdContent = c;

    if (c.musicFile) {
      setupMusic(c.musicFile, c.musicLabel || c.spellLabel || "Play Song");
    } else {
      const mb = document.getElementById("music-btn");
      if (mb) mb.style.display = "none";
    }

    initHouseSelector(c);
    initVideoBackground(c);
  }

  initEnvelope();
  initScrollReveal();
  initParallax();
  initSwipeDismiss();
  initMagicParticles({ canvasId: 'sparkle-canvas' });

  // Disallow long presses triggering context menus
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Prevent double tap zooms
  let lastTap = 0;
  document.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTap < 300) e.preventDefault();
    lastTap = now;
  }, { passive: false });
}

/* ── Preloader File Downloads ── */
async function startPreloader() {
  const c = typeof BIRTHDAY_CONTENT !== "undefined" ? BIRTHDAY_CONTENT : {};

  const friendName = c.friendName || "Sofia";
  const loadingTitle = document.getElementById("loading-title");
  if (loadingTitle) {
    loadingTitle.textContent = `For ${friendName}`;
  }

  const assets = [
    { id: 'gryffindorVideo', url: c.gryffindorVideo || 'videos/gryffindor.mp4' },
    { id: 'slytherinVideo',  url: c.slytherinVideo  || 'videos/slytherin.mp4'  },
    { id: 'ravenclawVideo',  url: c.ravenclawVideo  || 'videos/ravenclaw.mp4'  },
    { id: 'hufflepuffVideo', url: c.hufflepuffVideo || 'videos/hufflepuff.mp4' },
    { id: 'musicFile',       url: c.musicFile       || 'birthday.mp3'         }
  ].filter(asset => asset.url);

  assets.forEach(asset => {
    const basename = asset.url.split('/').pop();
    asset.size = DEFAULT_SIZES[basename] || 15000000;
  });

  const totalBytes = assets.reduce((sum, asset) => sum + asset.size, 0);
  let bytesLoaded = {};
  assets.forEach(asset => bytesLoaded[asset.id] = 0);

  const statusMessages = {
    gryffindorVideo: "Summoning the Gryffindor common room\u2026",
    slytherinVideo : "Descending to the Slytherin dungeons\u2026",
    ravenclawVideo : "Climbing the stairs to Ravenclaw Tower\u2026",
    hufflepuffVideo: "Finding the Hufflepuff burrow\u2026",
    musicFile      : "Tuning the enchanted phonograph\u2026"
  };

  let loadedCount = 0;
  let preloadCompleted = false;

  const fallbackTimeout = setTimeout(() => {
    if (!preloadCompleted) {
      completePreloading();
    }
  }, 15000);

  function updateProgressUI() {
    const currentTotal = Object.values(bytesLoaded).reduce((a, b) => a + b, 0);
    const ratio = totalBytes > 0 ? (currentTotal / totalBytes) : 1;
    const percent = Math.min(99, Math.floor(ratio * 100));
    
    const progressBar = document.getElementById("loading-progress-bar");
    const percentageLabel = document.getElementById("loading-percentage");
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (percentageLabel) percentageLabel.textContent = `${percent}%`;

    let currentLoadingAsset = null;
    for (const asset of assets) {
      if (bytesLoaded[asset.id] < asset.size) {
        currentLoadingAsset = asset;
        break;
      }
    }
    
    const statusLabel = document.getElementById("loading-status");
    if (statusLabel && currentLoadingAsset) {
      const msg = statusMessages[currentLoadingAsset.id] || "Summoning Hogwarts owl post\u2026";
      if (statusLabel.textContent !== msg) {
        statusLabel.style.opacity = "0";
        setTimeout(() => {
          statusLabel.textContent = msg;
          statusLabel.style.opacity = "1";
        }, 150);
      }
    }
  }

  function completePreloading() {
    if (preloadCompleted) return;
    preloadCompleted = true;
    clearTimeout(fallbackTimeout);

    const progressBar = document.getElementById("loading-progress-bar");
    const percentageLabel = document.getElementById("loading-percentage");
    const statusLabel = document.getElementById("loading-status");

    if (progressBar) progressBar.style.width = "100%";
    if (percentageLabel) percentageLabel.textContent = "100%";
    if (statusLabel) {
      statusLabel.style.opacity = "0";
      setTimeout(() => {
        statusLabel.textContent = "Sealing the envelope with wax\u2026";
        statusLabel.style.opacity = "1";
      }, 150);
    }

    setTimeout(() => {
      const loader = document.getElementById("loading-screen");
      if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none";
          initializeMainApp();
        }, 800);
      } else {
        initializeMainApp();
      }
    }, 800);
  }

  assets.forEach(async (asset) => {
    try {
      const response = await fetch(asset.url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      
      const reader = response.body.getReader();
      const chunks = [];
      let loaded = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        bytesLoaded[asset.id] = loaded;
        updateProgressUI();
      }
      
      const blob = new Blob(chunks);
      const objectUrl = URL.createObjectURL(blob);
      PRELOADED_ASSETS[asset.id] = objectUrl;
    } catch (err) {
      bytesLoaded[asset.id] = asset.size;
      updateProgressUI();
    }
    
    loadedCount++;
    if (loadedCount === assets.length) {
      completePreloading();
    }
  });

  if (assets.length === 0) {
    completePreloading();
  }
}

/* ── DOM Init ── */
document.addEventListener("DOMContentLoaded", () => {
  startPreloader();
});
