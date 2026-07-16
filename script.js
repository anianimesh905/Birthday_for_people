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
const leafImg = new Image();
leafImg.onerror = () => console.warn('herbivicus_leaf.png missing');
leafImg.src = 'herbivicus_leaf.png';

const pebbleImg = new Image();
pebbleImg.onerror = () => console.warn('duro_pebble.png missing');
pebbleImg.src = 'duro_pebble.png';

const DEFAULT_SIZES = {
  "gryffindor.mp4": 2716980,
  "slytherin.mp4"  : 4421700,
  "ravenclaw.mp4"  : 2403039,
  "hufflepuff.mp4" : 7582169,
  "birthday.mp3"   : 4824920
};


/* ── Keyboard Focus Trap Helper ── */
function trapFocus(modalEl) {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  modalEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    const focusables = Array.from(modalEl.querySelectorAll(focusableSelectors))
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
      
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

/* ── Simple random number helper ── */
function rand(min, max) { 
  return min + Math.random() * (max - min); 
}

/* ── MODULE LEVEL STATE & CACHES ── */
let _sharedAudioCtx = null;
let _patronusInterval = null;
let _aguamentiTimeout1 = null;
let _aguamentiTimeout2 = null;
let _confettiBurstActive = false;
let _sealBurstActive = false;
let _lastSpellCastTime = 0;

function getAudioCtx() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!_sharedAudioCtx || _sharedAudioCtx.state === 'closed') {
      _sharedAudioCtx = new AudioContextClass();
    }
    if (_sharedAudioCtx.state === 'suspended') {
      _sharedAudioCtx.resume().catch(() => {});
    }
    return _sharedAudioCtx;
  } catch (e) {
    return null;
  }
}

/* ── Procedural Web Audio Synthesis: Seal Crack Sound ── */
function playCrackSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    
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
  } catch (e) {
    // Fail silently in case browser blocks context
  }
}

/* ── Procedural Web Audio Synthesis: Scroll Paper Sound ── */
function playScrollSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

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
  } catch (e) {
    // Fail silently
  }
}

/* ── Procedural Web Audio Synthesis: House-Specific Ambient Soundscapes (Disabled) ── */
function startAmbientWaves() {
  // Ambient sounds disabled per user request
}

function stopAmbientWaves() {
  // Ambient sounds disabled per user request
}

function startHouseAmbience(house) {
  // Ambient sounds disabled per user request
}

function stopHouseAmbience() {
  // Ambient sounds disabled per user request
}

/* ── Paragraph-Aware Stagger Reveal & Drop Cap ── */
function _injectDropCapAndRender(el, text) {
  if (!el || !text) return;
  el.innerHTML = '';

  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  const dropCapParaIdx = paragraphs.length > 2 ? 1 : 0;
  const pElements = [];

  paragraphs.forEach((para, pIdx) => {
    const pEl = document.createElement('p');
    pEl.className = 'magic-paragraph fade-phantom';

    // Highlight signature blocks
    const isSignatureBlock = (pIdx === paragraphs.length - 1);
    const isClosingSalutation = (pIdx === paragraphs.length - 2 && para.trim().startsWith('With') && para.length < 80);

    if (isSignatureBlock || isClosingSalutation) {
      pEl.style.textAlign = 'right';
      pEl.style.paddingRight = '8%';
      pEl.style.marginTop = isSignatureBlock ? '0.4em' : '1.5em';
    }

    if (isSignatureBlock) {
      const cleanName = para.trim().toLowerCase();
      if (cleanName.includes("mcgonagall") || cleanName.includes("minerva")) {
        pEl.innerHTML = `
          <svg class="sig-svg" viewBox="0 0 220 50" width="165" height="38">
            <path class="sig-path" d="M 12 36 C 22 22, 28 8, 32 15 C 38 28, 44 26, 50 36 C 56 12, 62 20, 68 34 Q 74 24, 82 28 Q 90 22, 98 32 Q 106 20, 114 28 T 130 25 T 142 30 T 154 22 L 168 36 L 175 14 L 180 38 L 186 28 Q 192 20, 198 34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>`;
      } else if (cleanName.includes("ani")) {
        pEl.innerHTML = `
          <svg class="sig-svg" viewBox="0 0 100 40" width="90" height="36">
            <path class="sig-path" d="M 12 32 C 22 8, 30 22, 38 28 T 54 18 T 72 26 Q 84 20, 92 34" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>`;
      } else {
        pEl.style.fontFamily = "'Dancing Script', cursive";
        pEl.style.fontSize = "1.5rem";
        pEl.style.fontWeight = "bold";
        
        para.split('').forEach(ch => {
          const span = document.createElement('span');
          span.className = 'magic-char';
          span.textContent = ch;
          pEl.appendChild(span);
        });
      }
    } else {
      if (pIdx === dropCapParaIdx) {
        const words = para.split(/\s+/).filter(Boolean);
        if (words[0] && words[0].length > 0) {
          const capEl = document.createElement('span');
          capEl.className = 'drop-cap magic-char';
          capEl.textContent = words[0][0];
          pEl.appendChild(capEl);

          const restOfFirst = words[0].slice(1);
          if (restOfFirst) {
            restOfFirst.split('').forEach(ch => {
              const span = document.createElement('span');
              span.className = 'magic-char';
              span.textContent = ch;
              pEl.appendChild(span);
            });
          }

          if (words.length > 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'magic-char';
            spaceSpan.textContent = ' ';
            pEl.appendChild(spaceSpan);
          }

          for (let i = 1; i < words.length; i++) {
            words[i].split('').forEach(ch => {
              const span = document.createElement('span');
              span.className = 'magic-char';
              span.textContent = ch;
              pEl.appendChild(span);
            });
            if (i < words.length - 1) {
              const spaceSpan = document.createElement('span');
              spaceSpan.className = 'magic-char';
              spaceSpan.textContent = ' ';
              pEl.appendChild(spaceSpan);
            }
          }
        }
      } else {
        para.split('').forEach(ch => {
          const span = document.createElement('span');
          span.className = 'magic-char';
          span.textContent = ch;
          pEl.appendChild(span);
        });
      }
    }

    el.appendChild(pEl);
    pElements.push(pEl);
  });

  // Start sequential typewriter printing ticks
  let currentPIdx = 0;
  
  function writeParagraph() {
    if (currentPIdx >= pElements.length) {
      // golden magical glow on document completion
      const paper = document.getElementById("scroll-paper");
      if (paper) {
        paper.classList.add("magic-glow-pulse");
        setTimeout(() => paper.classList.remove("magic-glow-pulse"), 1200);
      }
      return;
    }

    const pEl = pElements[currentPIdx];
    pEl.classList.remove('fade-phantom');
    pEl.classList.add('writing');

    const chars = pEl.querySelectorAll('.magic-char');
    const sigPath = pEl.querySelector('.sig-path');

    if (sigPath) {
      setTimeout(() => {
        sigPath.style.animation = 'writeSignature 2.2s cubic-bezier(0.42, 0, 0.58, 1) forwards';
        pEl.classList.remove('writing');
        pEl.classList.add('finished');
        currentPIdx++;
        setTimeout(writeParagraph, 1200);
      }, 350);
      return;
    }

    if (chars.length === 0) {
      pEl.classList.remove('writing');
      pEl.classList.add('finished');
      currentPIdx++;
      setTimeout(writeParagraph, 350);
      return;
    }

    let charIdx = 0;
    const isMobile = window.innerWidth < 768;
    const writeSpeed = isMobile ? 22 : 18;

    function writeChar() {
      if (charIdx >= chars.length) {
        pEl.classList.remove('writing');
        pEl.classList.add('finished');
        currentPIdx++;
        setTimeout(writeParagraph, 450); // stagger paragraphs
        return;
      }

      const span = chars[charIdx];
      span.classList.add('written');

      // 5% chance to spawn gold sparkles from characters
      if (Math.random() < 0.05 && window.spawnSparkCluster) {
        const rect = span.getBoundingClientRect();
        window.spawnSparkCluster(rect.left + rect.width / 2, rect.top + rect.height / 2, 1, false);
      }

      charIdx++;
      setTimeout(writeChar, writeSpeed);
    }

    writeChar();
  }

  setTimeout(writeParagraph, 400);
}

function revealHogwartsLetter(msgEl, text, sigEl) {
  if (!msgEl) return;
  
  msgEl.style.animation = 'none';
  void msgEl.offsetHeight; 
  msgEl.style.animation = 'letterFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';

  _injectDropCapAndRender(msgEl, text || '');

  if (sigEl) {
    sigEl.style.display = 'none';
  }

  const inner = document.getElementById('scroll-inner');
  const paper = document.getElementById('scroll-paper');
  if (inner && paper) {
    inner.scrollTop = 0;

    // Detect scroll to bottom trigger glow pulse
    let glowTriggered = false;
    inner.addEventListener("scroll", () => {
      const reachedBottom = inner.scrollHeight - inner.scrollTop - inner.clientHeight <= 15;
      if (reachedBottom) {
        if (!glowTriggered) {
          glowTriggered = true;
          paper.classList.add("magic-glow-pulse");
          setTimeout(() => paper.classList.remove("magic-glow-pulse"), 1000);
        }
      } else {
        glowTriggered = false;
      }
    }, { passive: true });
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
  window.bgMusic = audio;

  let playing = false;
  let started = false;
  let gainNode = null;
  let fadeInterval = null;

  try {
    const ctx = getAudioCtx();
    if (ctx) {
      const source = ctx.createMediaElementSource(audio);
      gainNode = ctx.createGain();
      window.bgMusicGain = gainNode;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    }
  } catch (e) {
    // Fail silently, fallback to standard HTML5 audio volume
  }

  function fadeInVolume() {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }

    if (gainNode) {
      try {
        const ctx = getAudioCtx();
        if (ctx) {
          gainNode.gain.cancelScheduledValues(ctx.currentTime);
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
          audio.volume = 1;
          return;
        }
      } catch (e) {}
    }

    // Fallback: low-frequency timer fade-in
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
    }, 50);
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

/* ── Autoplay unlocker helper for mobile/Safari compliance ── */
function unlockVideoAutoplay() {
  const tryPlay = () => {
    if (_activeVideo && _activeVideo.paused) {
      _activeVideo.play()
        .then(() => {
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
        })
        .catch(err => console.log("Gesture play failed:", err));
    }
  };
  document.addEventListener('click', tryPlay, { once: true });
  document.addEventListener('touchstart', tryPlay, { once: true });
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
  // ALWAYS bypass PRELOADED_ASSETS Blob for videos to avoid iOS Safari byte-range / memory Blob autoplay crashes.
  const videoSrc = videoFile ? videoFile : null;
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
    _activeVideo.muted = true;
    _activeVideo.load();
    _activeVideo.oncanplay = () => {
      _activeVideo.oncanplay = null;
      _activeVideo.play()
        .then(() => {
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
        })
        .catch(err => {
          // Playback blocked by browser policy; keep video element visible and try on first click/touch
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
          unlockVideoAutoplay();
        });
    };
    _activeVideo.onerror = applyFallback;
    return;
  }

  // Crossfade transition timing sequence
  _activeVideo.style.opacity = '0';
  setTimeout(() => {
    _bufferVideo.src = videoSrc;
    _bufferVideo.muted = true;
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
        .catch(err => {
          // Playback blocked by browser policy; fade the first frame in and try on first click/touch
          _bufferVideo.classList.add('loaded');
          _bufferVideo.style.opacity = '1';
          setTimeout(() => {
            _activeVideo.pause();
            _activeVideo.style.opacity = '0';
            const temp = _activeVideo;
            _activeVideo = _bufferVideo;
            _bufferVideo = temp;
            unlockVideoAutoplay();
          }, 600);
        });
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
  if (!ctx) return;

  let isMobile = window.innerWidth < 768;
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset before scaling to prevent accumulation on orientation change
    ctx.scale(dpr, dpr);
    
    // Dynamically update isMobile
    isMobile = window.innerWidth < 768;
    window.maxParticlesLimit = isMobile ? 60 : 120;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const SPAWN_INTERVAL = isMobile ? 180 : 100;

  const PALETTES = {
    gryffindor: { spark: '#D3A625', orb: 'rgba(116, 0, 1, 0.60)',   star: '#D3A625', bolt: '#FFD700' },
    slytherin:  { spark: '#E4F0E7', orb: 'rgba(26, 71, 42, 0.50)',  star: '#E4F0E7', bolt: '#E4F0E7' },
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
  for (let i = 0; i < 250; i++) { 
    particles.push(new Particle()); 
  }

  function getFreeParticle() {
    for (let i = 0; i < particles.length; i++) {
      if (!particles[i].active) return particles[i];
    }
    return null;
  }

  function spawnSparkCluster(cx, cy, count, radial) {
    const isLumos = window.isLumosActive;
    count = count || Math.floor(rand(3, 7));
    
    if (cx === undefined && isLumos) cx = window.lastLumosX;
    if (cy === undefined && isLumos) cy = window.lastLumosY;
    
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
      
      // Spell physics customizations
      if (window.activeSpellMode === 'incendio') {
        vy = rand(-4.8, -2.0);
        vx = rand(-1.5, 1.5);
      } else if (window.activeSpellMode === 'aguamenti') {
        vy = rand(3.5, 6.5);
        vx = rand(-0.4, 0.4);
      } else if (window.activeSpellMode === 'glacius') {
        vy = rand(0.5, 1.8);
        vx = rand(-0.8, 0.8);
      } else if (window.activeSpellMode === 'patronus') {
        vy = rand(-0.6, 0.6);
        vx = rand(-3.0, -1.0); // Drift backward to the left
      } else if (window.activeSpellMode === 'ventus') {
        vy = rand(-0.6, 0.6);
        vx = rand(3.5, 6.5); // Fast blow to the right
      } else if (window.activeSpellMode === 'duro') {
        vy = rand(3.0, 5.0); // Heavy falling rocks
        vx = rand(-0.5, 0.5);
      } else if (window.activeSpellMode === 'fulgur') {
        vy = rand(-2.0, 2.0); // Erratic lightning moves
        vx = rand(-2.0, 2.0);
      } else if (window.activeSpellMode === 'pyra') {
        vy = rand(-1.5, -3.2); // Embers floating up
        vx = rand(-0.8, 0.8);
      } else if (window.activeSpellMode === 'herbivicus') {
        vy = rand(-0.8, -1.8); // Leaves floating up slowly
        vx = rand(-1.2, 1.2);
      } else if (window.activeSpellMode === 'fumos') {
        vy = rand(-0.5, -1.2); // Mist expands/drifts up
        vx = rand(-0.8, 0.8);
      } else if (window.activeSpellMode === 'prisma') {
        vy = rand(-1.2, 1.2); // Rainbow sparkles float around
        vx = rand(-1.2, 1.2);
      } else if (window.activeSpellMode === 'chronos') {
        vy = rand(-0.25, 0.25); // Extremely slow time distortion
        vx = rand(-0.25, 0.25);
      }
      
      p.vx = vx; 
      p.vy = vy;
      
      // Dynamic particle lifetime
      if (window.activeSpellMode === 'glacius') {
        p.life = rand(5.0, 7.5);
      } else if (window.activeSpellMode === 'chronos') {
        p.life = rand(8.0, 11.0);
      } else if (window.activeSpellMode === 'aguamenti' || window.activeSpellMode === 'fumos') {
        p.life = rand(4.0, 5.5);
      } else {
        p.life = rand(1.5, 2.5);
      }
      
      p.age = 0;
      
      // Dynamic particle size
      if (window.activeSpellMode === 'incendio' || window.activeSpellMode === 'fumos') {
        p.size = rand(22, 36);
      } else if (window.activeSpellMode === 'glacius' || window.activeSpellMode === 'herbivicus') {
        p.size = rand(16, 26);
      } else {
        p.size = rand(8, 14);
      }
      p.isFlower = false;
      
      // Spell color customizations
      let color = isLumos ? '#FFF3CD' : palette.spark;
      if (window.activeSpellMode === 'incendio') {
        const fireColors = ['#FF4500', '#FF3000', '#FF6347', '#FF8C00', '#FFD700'];
        color = fireColors[Math.floor(Math.random() * fireColors.length)];
      } else if (window.activeSpellMode === 'aguamenti') {
        const rainColors = ['#1E90FF', '#00BFFF', '#87CEFA', '#4682B4'];
        color = rainColors[Math.floor(Math.random() * rainColors.length)];
      } else if (window.activeSpellMode === 'glacius') {
        const iceColors = ['#E0FFFF', '#B0E0E6', '#AFEEEE', '#FFFFFF'];
        color = iceColors[Math.floor(Math.random() * iceColors.length)];
      } else if (window.activeSpellMode === 'patronus') {
        const silverColors = ['#F5F5F7', '#E8E8F0', '#D0D8F0', '#FFFFFF'];
        color = silverColors[Math.floor(Math.random() * silverColors.length)];
      } else if (window.activeSpellMode === 'ventus') {
        const windColors = ['#A3E4D7', '#E8F8F5', '#76D7C4', '#48C9B0'];
        color = windColors[Math.floor(Math.random() * windColors.length)];
      } else if (window.activeSpellMode === 'duro') {
        const stoneColors = ['#8D6E63', '#A1887F', '#6D4C41', '#5D4037'];
        color = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      } else if (window.activeSpellMode === 'fulgur') {
        const lightColors = ['#FFF59D', '#FFEB3B', '#FDD835', '#FFFFFF'];
        color = lightColors[Math.floor(Math.random() * lightColors.length)];
      } else if (window.activeSpellMode === 'pyra') {
        const emberColors = ['#FF5722', '#FF7043', '#FF8A65', '#FF3D00'];
        color = emberColors[Math.floor(Math.random() * emberColors.length)];
      } else if (window.activeSpellMode === 'herbivicus') {
        const herbColors = ['#81C784', '#66BB6A', '#4CAF50', '#A5D6A7', '#C8E6C9'];
        color = herbColors[Math.floor(Math.random() * herbColors.length)];
      } else if (window.activeSpellMode === 'fumos') {
        const mistColors = ['rgba(220, 220, 220, 0.25)', 'rgba(245, 245, 245, 0.2)', 'rgba(200, 200, 200, 0.25)'];
        color = mistColors[Math.floor(Math.random() * mistColors.length)];
      } else if (window.activeSpellMode === 'prisma') {
        color = 'hsl(0, 95%, 70%)'; // Will cycle dynamically in updateParticle
      } else if (window.activeSpellMode === 'chronos') {
        const timeColors = ['#D4AF37', '#CD7F32', '#B8860B', '#AA7C11'];
        color = timeColors[Math.floor(Math.random() * timeColors.length)];
      }
      p.color = color;
      
      p.rotation = rand(0, Math.PI * 2); 
      p.spin = rand(-0.12, 0.12);
    }
    if (typeof startLoop === 'function') {
      startLoop();
    }
  }
  window.spawnSparkCluster = spawnSparkCluster;

  function spawnOrb() {
    const p = getFreeParticle(); 
    if (!p) return;
    const isLumos = window.isLumosActive;
    p.active = true; 
    p.type = 'B';
    p.x = isLumos ? window.lastLumosX + rand(-18, 18) : rand(0, canvas.width); 
    p.y = isLumos ? window.lastLumosY + rand(-18, 18) : rand(0, canvas.height);
    p.vx = isLumos ? rand(-0.8, 0.8) : rand(-0.35, 0.35); 
    p.vy = isLumos ? rand(-0.8, 0.8) : rand(-0.35, 0.35);
    p.life = isLumos ? rand(1.5, 3.5) : rand(4, 6); 
    p.age = 0;
    p.radius = isLumos ? rand(2, 6) : rand(3, 8); 
    p.baseAlpha = rand(0.25, 0.55);
    p.pulseFreq = rand(1.2, 2.2);
    p.color = isLumos ? 'rgba(255, 244, 200, 0.5)' : palette.orb; 
    p.glowColor = isLumos ? '#FFFFFF' : palette.spark;
  }

  function spawnBolt() {
    const p = getFreeParticle(); 
    if (!p) return;
    const isLumos = window.isLumosActive;
    p.active = true; 
    p.type = 'C';
    p.x = isLumos ? window.lastLumosX + rand(-25, 25) : rand(40, canvas.width - 40); 
    p.y = isLumos ? window.lastLumosY + rand(-25, 25) : rand(40, canvas.height - 40);
    p.vx = 0; 
    p.vy = 0;
    p.life = rand(0.3, 0.6); 
    p.age = 0;
    p.size = rand(10, 18); 
    p.color = isLumos ? '#FFFFAA' : palette.bolt;
  }

  function spawnStar() {
    const p = getFreeParticle(); 
    if (!p) return;
    const isLumos = window.isLumosActive;
    p.active = true; 
    p.type = 'D';
    p.x = isLumos ? window.lastLumosX + rand(-20, 20) : rand(0, canvas.width); 
    p.y = isLumos ? window.lastLumosY + rand(-20, 20) : rand(canvas.height * 0.3, canvas.height);
    p.vx = isLumos ? rand(-0.5, 0.5) : rand(-0.25, 0.25); 
    p.vy = isLumos ? rand(-1.2, -0.6) : rand(-1.1, -0.5);
    p.life = 3.0; 
    p.age = 0;
    p.size = rand(8, 16); 
    p.color = isLumos ? '#FFFFD0' : palette.star;
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
    let alive = 0;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].active) alive++;
    }
    // Override spell limits to at least 60 on mobile Android to ensure high-performance density
    const currentMax = isMobile ? Math.max(window.maxParticlesLimit, 60) : window.maxParticlesLimit;
    if (alive >= currentMax) return;
    
    let currentInterval = SPAWN_INTERVAL;
    if (window.activeSpellMode === 'incendio' || window.activeSpellMode === 'aguamenti' || window.activeSpellMode === 'glacius') {
      currentInterval = isMobile ? 35 : 20;
    }
    
    if (now - lastSpawn > currentInterval) { 
      if (window.activeSpellMode && window.activeSpellMode !== 'none') {
        if (window.activeSpellMode === 'incendio') {
          const cx = rand(0, canvas.width);
          const cy = canvas.height + 10;
          spawnSparkCluster(cx, cy, Math.floor(rand(2, 5)), false);

          if (window.cachedSpellTargets && window.cachedSpellTargets.length > 0) {
            window.cachedSpellTargets.forEach(rect => {
              if (Math.random() < 0.25) {
                const cx2 = rect.left + Math.random() * rect.width;
                const cy2 = rect.top + Math.random() * rect.height;
                spawnSparkCluster(cx2, cy2, 1, false);
              }
            });
          }
        } else if (window.activeSpellMode === 'aguamenti') {
          const cx = rand(0, canvas.width);
          const cy = -10;
          spawnSparkCluster(cx, cy, Math.floor(rand(2, 5)), false);
        } else if (window.activeSpellMode === 'glacius') {
          // Spawn snowflakes falling from the top
          const cx = rand(0, canvas.width);
          const cy = -10;
          spawnSparkCluster(cx, cy, 1, false);

          // Spawn ice frosting sparks on cached targets
          if (window.cachedSpellTargets && window.cachedSpellTargets.length > 0) {
            window.cachedSpellTargets.forEach(rect => {
              if (Math.random() < 0.3) {
                const cx2 = rect.left + Math.random() * rect.width;
                const cy2 = rect.top + Math.random() * rect.height;
                spawnSparkCluster(cx2, cy2, 1, false);
              }
            });
          }
        } else {
          const cx = window.isLumosActive ? window.lastLumosX : (window.innerWidth / 2);
          const cy = window.isLumosActive ? window.lastLumosY : (window.innerHeight / 2);
          spawnSparkCluster(cx + rand(-80, 80), cy + rand(-80, 80), 2, false);
        }
      } else {
        pickWeighted(); 
      }
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
        if (window.activeSpellMode === 'glacius') {
          p.x += p.vx * 0.22;
          p.y += p.vy * 0.22;
        } else if (window.activeSpellMode === 'aguamenti' || window.activeSpellMode === 'duro') {
          p.x += p.vx;
          p.y += p.vy;
        } else if (window.activeSpellMode === 'incendio') {
          p.x += p.vx + Math.sin(p.age * 6.0) * 0.45;
          p.y += p.vy;
        } else if (window.activeSpellMode === 'ventus') {
          p.x += p.vx;
          p.y += p.vy + Math.sin(p.age * 4.5) * 1.3;
        } else if (window.activeSpellMode === 'herbivicus') {
          p.x += p.vx + Math.sin(p.age * 3.0) * 0.35;
          p.y += p.vy;
        } else if (window.activeSpellMode === 'fumos') {
          p.x += p.vx;
          p.y += p.vy;
        } else if (window.activeSpellMode === 'prisma') {
          const hue = (p.age * 160) % 360;
          p.color = `hsl(${hue}, 95%, 70%)`;
          p.x += p.vx;
          p.y += p.vy;
        } else if (window.activeSpellMode === 'chronos') {
          p.x += p.vx * 0.08;
          p.y += p.vy * 0.08;
        } else if (window.activeSpellMode === 'patronus') {
          // Helical/spiral fluid wisp trajectory
          p.x += p.vx + Math.sin(p.age * 9.0) * 2.8;
          p.y += p.vy + Math.cos(p.age * 9.0) * 2.8;
        } else {
          p.x += p.vx; 
          p.y += p.vy;
          p.vy += 0.06; 
          p.vx *= 0.97; 
        }
        p.rotation += p.spin;
        p.alpha = progress > 0.70 ? 1 - (progress - 0.70) / 0.30 : 1;
        if (!window.activeSpellMode && !window.isLumosActive) {
          p.color = palette.spark;
        }
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
        if (window.activeSpellMode === 'aguamenti') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.75);
          ctx.lineTo(0, p.size * 0.75);
          ctx.stroke();
        } else if (window.activeSpellMode === 'incendio') {
          const r = p.size * 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFF90';
          ctx.fill();
        } else if (window.activeSpellMode === 'glacius') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          const r = p.size * 0.55;
          ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI) / 3;
            const x1 = Math.cos(angle) * r;
            const y1 = Math.sin(angle) * r;
            ctx.moveTo(-x1, -y1);
            ctx.lineTo(x1, y1);
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else if (window.activeSpellMode === 'ventus') {
          // Draw a leaf vector path
          const r = p.size * 0.55;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(r * 0.55, 0, 0, r);
          ctx.quadraticCurveTo(-r * 0.55, 0, 0, -r);
          ctx.fill();
        } else if (window.activeSpellMode === 'duro') {
          // Draw real pebble image particle!
          const r = p.size * 0.65;
          ctx.drawImage(pebbleImg, -r, -r, r * 2, r * 2);
        } else if (window.activeSpellMode === 'fulgur') {
          // Draw lightning zig-zag
          const r = p.size * 0.6;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(-r * 0.2, -r);
          ctx.lineTo(r * 0.35, -r * 0.1);
          ctx.lineTo(-r * 0.35, r * 0.1);
          ctx.lineTo(r * 0.1, r);
          ctx.stroke();
        } else if (window.activeSpellMode === 'pyra') {
          // Draw glowing fire ember
          const r = p.size * 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#FFF59D'; // bright hot core
          ctx.fill();
        } else if (window.activeSpellMode === 'herbivicus') {
          // Draw real leaf image particle!
          const r = p.size * 0.75;
          ctx.drawImage(leafImg, -r, -r, r * 2, r * 2);
        } else if (window.activeSpellMode === 'fumos') {
          // Draw expanding mist cloud (fuzzy circle using low opacity fill)
          const progressF = p.age / p.life;
          const rF = p.size * 0.55 * (1.0 + progressF * 1.5);
          ctx.beginPath();
          ctx.arc(0, 0, rF, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (window.activeSpellMode === 'prisma') {
          // Draw a beautiful glowing mini-rainbow arc
          const r = p.size * 0.7;
          ctx.lineWidth = 2.5;
          const colors = ['#ff5252', '#ff9800', '#ffeb3b', '#69f0ae', '#40c4ff', '#e040fb'];
          for (let i = 0; i < colors.length; i++) {
            ctx.strokeStyle = colors[i];
            ctx.beginPath();
            ctx.arc(0, r * 0.3, r - i * 1.5, Math.PI, 2 * Math.PI, false);
            ctx.stroke();
          }
        } else if (window.activeSpellMode === 'chronos') {
          // Draw clock inspired Roman cross vector
          const r = p.size * 0.45;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -r); ctx.lineTo(0, r);
          ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
          ctx.stroke();
        } else {
          ctx.font = `${p.size}px serif`; 
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center'; 
          ctx.textBaseline = 'middle';
          ctx.fillText('✦', 0, 0);
        }
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

  let isLoopRunning = false;
  function startLoop() {
    if (isLoopRunning) return;
    isLoopRunning = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  window.startMagicParticlesLoop = startLoop;

  window.addEventListener('envelopeTapped', (e) => {
    const detail = e.detail || {};
    const bx = typeof detail.x === 'number' ? detail.x : canvas.width / 2;
    const by = typeof detail.y === 'number' ? detail.y : canvas.height / 2;
    const BURST_COUNT = isMobile ? 20 : 40;
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
    startLoop();
  });

  // Removed global click and touch spark spawn animations to optimize Android/mobile scrolling performance

  let lastTime = 0;
  let rafId = null;

  function drawLargeRainbowOverlay() {
    ctx.save();
    const time = performance.now() * 0.001;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Use layout coordinates (device independent)
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const centerX = cw / 2;
    const centerY = ch * 1.1;
    const baseRadius = Math.min(cw, ch) * 0.58;
    const pulse = Math.sin(time * 2.2) * 15;
    const radius = baseRadius + pulse;
    
    ctx.lineWidth = 12;
    ctx.globalAlpha = 0.18;
    
    const colors = ['#ff5252', '#ff9800', '#ffeb3b', '#69f0ae', '#40c4ff', '#e040fb'];
    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i];
      ctx.shadowColor = colors[i];
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - i * 12, Math.PI, 2 * Math.PI, false);
      ctx.stroke();
    }
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (window.activeSpellMode === 'prisma') {
      drawLargeRainbowOverlay();
      
      const pBox = document.getElementById('prisma-box');
      if (pBox) {
        const rect = pBox.getBoundingClientRect();
        if (rect.right > 0 && rect.bottom > 0 && rect.left < window.innerWidth && rect.top < window.innerHeight) {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          spawnSparkCluster(cx, cy, 1, false);
        }
      }
    }
    
    // Allow spawner on: desktop always, mobile during Lumos or active spell mode
    if (!isMobile || window.isLumosActive || (window.activeSpellMode && window.activeSpellMode !== 'none')) {
      tickSpawner(now);
    }
    
    let activeCount = 0;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].active) {
        updateParticle(particles[i], dt);
        drawParticle(particles[i]);
        activeCount++;
      }
    }

    if (activeCount === 0 && (isMobile || !document.hasFocus()) && !window.isLumosActive) {
      isLoopRunning = false;
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(loop);
  }

  if (!isMobile) {
    startLoop();
  }

  window._destroyMagicParticles = function () {
    if (rafId) cancelAnimationFrame(rafId);
    isLoopRunning = false;
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
    let gamma = e.gamma;
    let beta = e.beta;
    if (gamma === null || beta === null || !isFinite(gamma) || !isFinite(beta)) return;

    if (beta < -30) beta = -30;
    if (beta > 60) beta = 60;
    
    const normGamma = gamma / 45;
    const normBeta = (beta - 15) / 45;

    targetMx = normGamma * 100;
    targetMy = normBeta * 100;
  }, { passive: true });

  function updateParallax() {
    if (document.hidden) {
      requestAnimationFrame(updateParallax);
      return;
    }
    const dx = targetMx - currentMx;
    const dy = targetMy - currentMy;
    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      currentMx += dx * 0.08;
      currentMy += dy * 0.08;
      document.documentElement.style.setProperty("--mx", currentMx.toFixed(2));
      document.documentElement.style.setProperty("--my", currentMy.toFixed(2));
    }
    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}

/* ── Magnetic Hover Physics on Controls ── */
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".bottom-control-dock button");
  
  buttons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return; // Disable on touch screen widths
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0) scale(1.06)`;
    }, { passive: true });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    }, { passive: true });
  });
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
  if (_sealBurstActive) return;
  _sealBurstActive = true;
  setTimeout(() => { _sealBurstActive = false; }, 800);

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
  if (_confettiBurstActive) return;
  _confettiBurstActive = true;
  setTimeout(() => { _confettiBurstActive = false; }, 3200);

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
    accent: '#E4F0E7',
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

  // Trap keyboard focus inside house selector
  trapFocus(overlay);

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
    
    // Focus default badge
    setTimeout(() => {
      const defaultBadge = Array.from(badges).find(b => b.getAttribute('data-house') === defaultHouse);
      if (defaultBadge) defaultBadge.focus();
    }, 200);
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
  let firstLetterRead = false;
  let secondLetterRead = false;

  function triggerCinematicUnseal() {
    // 1. Shake viewport
    document.body.classList.add("screen-shake");
    setTimeout(() => {
      document.body.classList.remove("screen-shake");
    }, 280);

    // 2. White Spell Flash
    const flash = document.createElement("div");
    flash.id = "spell-flash";
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = "0.95";
      setTimeout(() => {
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 250);
      }, 40);
    });
  }

  function triggerEnvelopeMorph() {
    const envArea = document.getElementById("envelope-area");
    const envelope = document.getElementById("envelope");
    const wrapper = document.getElementById("envelope-wrapper");
    const hint = document.getElementById("envelope-hint");
    const sealLetter = document.getElementById("env-seal-letter");
    
    if (!envArea || !envelope || !wrapper) return;
    
    // Disable interactions temporarily
    wrapper.style.pointerEvents = "none";
    
    setTimeout(() => {
      // Fade out envelope area smoothly
      envArea.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      envArea.style.opacity = "0";
      envArea.style.transform = "scale(0.95)";
      
      setTimeout(() => {
        // Morph layout styles to crimson private letter theme
        envelope.classList.add("eyes-only");
        wrapper.classList.add("eyes-only");
        
        // Swap cursive salutation names
        const addrTo = document.querySelector(".env-address-to");
        const addrName = document.querySelector(".env-address-name");
        const addrLine2 = document.querySelector(".env-address-line2");
        
        if (addrTo) addrTo.textContent = "Personal:";
        if (addrName) addrName.textContent = window._bdContent?.friendName || "Ayushi Mishra";
        if (addrLine2) addrLine2.textContent = "For Your Eyes Only";
        
        // Change wax seal to Heart
        if (sealLetter) sealLetter.textContent = "❤";
        
        // Change text hints
        if (hint) {
          hint.textContent = "A secret letter has appeared... Tap to unseal ✦";
          hint.style.opacity = "1";
        }
        
        // Reset envelope open status
        envelope.classList.remove("open");
        opened = false;
        
        // Fade back in
        envArea.style.opacity = "1";
        envArea.style.transform = "scale(1)";
        
        // Spawn a magical pink/gold burst centered on the morphed envelope
        setTimeout(() => {
          const areaRect = envArea.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: {
              x: areaRect.left + areaRect.width / 2,
              y: areaRect.top + areaRect.height / 2
            }
          }));
          wrapper.style.pointerEvents = "auto";
        }, 500);
        
      }, 850);
    }, 900); // Trigger 900ms after closing letter scroll
  }

  function openEnvelope(e) {
    if (typeof window.startMusic === 'function') {
      window.startMusic();
    }
    
    const isPersonal = envelope.classList.contains("eyes-only");
    const closeBtn = document.getElementById("scroll-close");
    
    if (opened) {
      overlay.classList.add("open");
      document.body.classList.add("letter-open");
      startAmbientWaves();
      setTimeout(() => {
        if (closeBtn) closeBtn.focus();
      }, 150);
      setTimeout(() => {
        if (paper) {
          paper.classList.add("unfolded");
          playScrollSound();
          
          // Trigger a dynamic sparkle burst centered on screen "with a bang" when paper unfolds
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2
            }
          }));
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
    triggerCinematicUnseal();



    // Top flap rotates open, letter rises (40ms response delay)
    setTimeout(() => {
      envelope.classList.add("open");
    }, 40);

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

    // Scroll open modal sequence (snappy 450ms transition instead of 900ms)
    setTimeout(() => {
      overlay.classList.add("open");
      document.body.classList.add("letter-open");
      startAmbientWaves();
      setTimeout(() => {
        if (closeBtn) closeBtn.focus();
      }, 150);

      setTimeout(() => {
        if (paper) {
          paper.classList.add("unfolded");
          playScrollSound();
          
          // Trigger a dynamic sparkle burst centered on screen "with a bang" when paper unfolds
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2
            }
          }));
        }
      }, 100);

      spawnConfetti();

      // Hide duplicate scroll-title
      const titleEl = document.getElementById('scroll-title');
      if (titleEl) {
        titleEl.style.display = 'none';
      }

      const c2 = window._bdContent || {};
      let msg = "";
      
      if (isPersonal) {
        msg = c2.eyesOnlyMessage || `Dear ${c2.friendName || "Ayushi"}, Happy Birthday!`;
        overlay.classList.add("eyes-only-modal");
        
        // Update headers to personal private context
        const schoolNameEl = overlay.querySelector(".hogwarts-school-name");
        const headmistressEl = overlay.querySelector(".hogwarts-headmistress");
        const dividerEl = overlay.querySelector(".hogwarts-divider");
        const mottoEl = overlay.querySelector(".hogwarts-motto-sub");
        
        if (schoolNameEl) schoolNameEl.textContent = "A Message For Your Eyes Only";
        if (headmistressEl) headmistressEl.innerHTML = "<em>Confidential & Private</em>";
        if (dividerEl) dividerEl.textContent = "· · · ❤️ · · ·";
        if (mottoEl) mottoEl.innerHTML = "<em>Amor Vincit Omnia</em>";
      } else {
        const houseCfg = HOUSES[_currentHouse] || HOUSES.gryffindor;
        msg = c2[houseCfg.message] || c2.slytherinMessage || '';
        overlay.classList.remove("eyes-only-modal");
      }

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window._castleAwakened) {
        window._castleAwakened = true;
        setTimeout(() => startCastleAwakeningSequence(msgEl, msg, sigEl), 200);
      } else {
        setTimeout(() => revealHogwartsLetter(msgEl, msg, sigEl), 200);
      }
    }, 450);
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.classList.remove("letter-open");
    stopAmbientWaves();
    if (paper) paper.classList.remove("unfolded");
    
    // Restore focus to envelope wrapper
    if (wrapper) wrapper.focus();
    
    firstLetterRead = true;

    // Trigger peaceful Birthday Wish Ceremony if not already run
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window._ceremonyRun) {
      window._ceremonyRun = true;
      setTimeout(startWishCeremony, 500);
    }
  }

  // Trap keyboard focus inside scroll overlay
  trapFocus(overlay);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      closeModal();
    });
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
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  // Live update of scroll content if house changes when scroll is already open
  window.addEventListener('houseChanged', (e) => {
    if (opened && msgEl) {
      const c2 = window._bdContent || {};
      const newHouse = e.detail.house;
      const houseCfg = HOUSES[newHouse] || HOUSES.gryffindor;
      const msg = c2[houseCfg.message] || c2.slytherinMessage || '';
      
      // Ensure duplicate scroll-title remains hidden
      const titleEl = document.getElementById('scroll-title');
      if (titleEl) {
        titleEl.style.display = 'none';
      }
      
      revealHogwartsLetter(msgEl, msg, sigEl);
      startAmbientWaves(); // Dynamically shift synthesized ambient soundscape
    }
  });
}

/* ── Core Main Application Bootstrap Sequence ── */
function initializeMainApp() {
  const c = typeof BIRTHDAY_CONTENT !== "undefined" ? BIRTHDAY_CONTENT : {};

  // Setup dynamic content details
  if (c.friendName) {
    document.title = `Happy Birthday, ${c.friendName}! ⚡ A Letter from Hogwarts`;
    const heroName = document.getElementById("hero-friend-name");
    if (heroName) heroName.textContent = c.friendName;
    const heroDate = document.getElementById("birthday-date");
    if (heroDate) heroDate.textContent = c.birthdayDate || "";
    const heroTagline = document.getElementById("tagline");
    if (heroTagline && c.tagline) heroTagline.textContent = c.tagline;

    const addrName = document.querySelector(".env-address-name");
    if (addrName) addrName.textContent = c.friendName;

    const addrLine2 = document.querySelector(".env-address-line2");
    if (addrLine2) addrLine2.textContent = c.friendAddressLine || "The Bedroom";

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
  initMagneticButtons();
  initSwipeDismiss();
  initMagicParticles({ canvasId: 'sparkle-canvas' });
  initAmbientAtmosphere();

  // Hide envelope initially and disable interactivity for the cinematic intro sequence
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const wrapper = document.getElementById("envelope-wrapper");
    if (wrapper) wrapper.style.pointerEvents = "none";
    const envArea = document.getElementById("envelope-area");
    if (envArea) envArea.style.opacity = "0";
  }

  // 🪄 Spell Caster Popup Overlay Listeners
  const spellBtn = document.getElementById("spell-btn");
  const spellModal = document.getElementById("spell-modal");
  const spellClose = document.getElementById("spell-modal-close");
  const spellInput = document.getElementById("spell-input-field");
  const spellCast = document.getElementById("spell-cast-action");
  const spellBg = document.getElementById("spell-modal-bg");

  if (spellBtn && spellModal) {
    // Trap keyboard focus inside spell modal
    trapFocus(spellModal);

    const openSpellModal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      spellModal.classList.add("open");
      if (window.location.hash !== "#spell-modal") {
        history.pushState({ modalOpen: true }, "", "#spell-modal");
      }
      if (spellInput) {
        spellInput.value = "";
        setTimeout(() => spellInput.focus(), 150);
      }
    };

    const closeSpellModal = () => {
      spellModal.classList.remove("open");
      if (window.location.hash === "#spell-modal") {
        history.back();
      }
      // Restore focus to spell button
      if (spellBtn) spellBtn.focus();
    };

    spellBtn.addEventListener("click", openSpellModal);
    spellBtn.addEventListener("touchend", openSpellModal);

    if (spellClose) {
      spellClose.addEventListener("click", closeSpellModal);
      spellClose.addEventListener("touchend", (e) => {
        e.preventDefault();
        closeSpellModal();
      });
    }

    if (spellBg) {
      spellBg.addEventListener("click", closeSpellModal);
      spellBg.addEventListener("touchend", (e) => {
        e.preventDefault();
        closeSpellModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && spellModal.classList.contains("open")) {
        closeSpellModal();
      }
    });

    const executeSpell = () => {
      if (spellInput) {
        const val = spellInput.value;
        castSpellText(val);
        closeSpellModal();
      }
    };

    if (spellCast) {
      spellCast.addEventListener("click", executeSpell);
      spellCast.addEventListener("touchend", (e) => {
        e.preventDefault();
        executeSpell();
      });
    }

    if (spellInput) {
      spellInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          executeSpell();
        }
      });
    }
  }

  // Disallow long presses triggering context menus, except on inputs to allow paste
  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
      return;
    }
    e.preventDefault();
  });

  // Prevent double tap zooms, except on inputs to allow word selection
  let lastTap = 0;
  document.addEventListener("touchend", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
      return;
    }
    const now = Date.now();
    if (now - lastTap < 300) e.preventDefault();
    lastTap = now;
  }, { passive: false });

  initTreasureBox();
}

/* ── fillSpell: used by spell-tag onclick handlers to populate the input ── */
function fillSpell(el) {
  const field = document.getElementById('spell-input-field');
  if (field && el) {
    // Use data-spell attribute for clean spell name, strip any trailing emojis as fallback
    field.value = (el.dataset && el.dataset.spell) || el.textContent.trim().replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();
    field.focus();
  }
}

/* ── Preloader File Downloads ── */
async function startPreloader() {
  const c = typeof BIRTHDAY_CONTENT !== "undefined" ? BIRTHDAY_CONTENT : {};

  const friendName = c.friendName || "Sofia";
  document.title = `Happy Birthday, ${friendName}! ⚡ A Letter from Hogwarts`;
  const loadingTitle = document.getElementById("loading-title");
  if (loadingTitle) {
    loadingTitle.textContent = `For ${friendName}`;
  }

  // Setup solemn swear calligraphy display
  const solemnSwear = document.getElementById("loading-solemn-swear");
  if (solemnSwear) {
    solemnSwear.style.opacity = "0.85";
  }

  // 👣 Marauder's Map preloader footstep walker simulation
  let footstepInterval = null;
  let currentX = 15;
  let currentY = 85;
  let currentAngle = -30;
  let isLeft = true;
  let preloadCompleted = false;
  let loadedCount = 0;

  function spawnPreloaderFootstep() {
    const container = document.getElementById("footsteps-container");
    if (!container || preloadCompleted) return;

    currentAngle += (Math.random() * 40 - 20); // jitter angle
    if (currentAngle < -75) currentAngle = -75;
    if (currentAngle > 15) currentAngle = 15;

    const rad = currentAngle * Math.PI / 180;
    const stepDist = 8.5; // distance per step (percentage)
    const sideOffset = 2.4;
    const offsetRad = (currentAngle + 90) * Math.PI / 180;
    const sideSign = isLeft ? -1 : 1;

    let spawnX = currentX + Math.cos(rad) * stepDist + Math.cos(offsetRad) * sideOffset * sideSign;
    let spawnY = currentY + Math.sin(rad) * stepDist + Math.sin(offsetRad) * sideOffset * sideSign;

    // Reset walkers path if they wander off boundaries
    if (spawnX < 4 || spawnX > 96 || spawnY < 4 || spawnY > 96) {
      currentX = 10 + Math.random() * 15;
      currentY = 80 + Math.random() * 15;
      currentAngle = -30;
      spawnX = currentX;
      spawnY = currentY;
    } else {
      currentX = spawnX;
      currentY = spawnY;
    }

    const footprint = document.createElement("div");
    footprint.className = `map-footprint ${isLeft ? 'left' : 'right'}`;
    footprint.style.left = `${spawnX}%`;
    footprint.style.top = `${spawnY}%`;
    footprint.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
    
    footprint.innerHTML = `
      <svg viewBox="0 0 30 14" fill="rgba(62, 39, 20, 0.55)" width="100%" height="100%">
        <path d="M12 2 C16 2, 22 4, 24 7 C26 9, 23 12, 19 12 C15 12, 13 9, 11 7 C9 5, 8 2, 12 2 Z" />
        <path d="M4 5 C6 5, 8 6, 8 8 C 8 10, 6 11, 4 11 C2 11, 1 10, 1 8 C1 6, 2 5, 4 5 Z" />
      </svg>
    `;
    container.appendChild(footprint);

    // Fade in
    requestAnimationFrame(() => {
      footprint.style.opacity = "0.7";
    });

    // Fade out and remove
    setTimeout(() => {
      footprint.style.transition = "opacity 1.2s ease";
      footprint.style.opacity = "0";
      setTimeout(() => footprint.remove(), 1200);
    }, 1800);

    isLeft = !isLeft;
  }

  // Alternate footprint timer
  spawnPreloaderFootstep();
  footstepInterval = setInterval(spawnPreloaderFootstep, 580);

  // Identify active house to only preload its video on startup (others load on demand)
  const savedHouse = sessionStorage.getItem('selectedHouse');
  const defaultHouse = ((c && c.defaultHouse) || 'Slytherin').toLowerCase();
  const activeHouse = (savedHouse || defaultHouse).toLowerCase();

  const houseVideoMap = {
    gryffindor: 'gryffindorVideo',
    slytherin:  'slytherinVideo',
    ravenclaw:  'ravenclawVideo',
    hufflepuff: 'hufflepuffVideo'
  };
  const activeVideoId = houseVideoMap[activeHouse] || 'slytherinVideo';
  const activeVideoUrl = c[activeVideoId] || `videos/${activeHouse}.mp4`;

  const assets = [
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



  const abortCtrl = new AbortController();

  const fallbackTimeout = setTimeout(() => {
    if (!preloadCompleted) {
      abortCtrl.abort();
      completePreloading();
    }
  }, 15000);

  function updateProgressUI() {
    const currentTotal = Object.values(bytesLoaded).reduce((a, b) => a + b, 0);
    const ratio = totalBytes > 0 ? (currentTotal / totalBytes) : 1;
    const percent = Math.min(99, Math.floor(ratio * 100));
    
    const progressBar = document.getElementById("loading-progress-bar");
    const percentageLabel = document.getElementById("loading-percentage");
    
    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(0.99, ratio)})`;
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

    if (footstepInterval) {
      clearInterval(footstepInterval);
      footstepInterval = null;
    }

    const progressBar = document.getElementById("loading-progress-bar");
    const percentageLabel = document.getElementById("loading-percentage");
    const statusLabel = document.getElementById("loading-status");
    const subtitle = document.getElementById("loading-subtitle");

    if (progressBar) progressBar.style.transform = "scaleX(1)";
    if (percentageLabel) percentageLabel.textContent = "100%";
    
    if (statusLabel) {
      statusLabel.style.opacity = "0";
      setTimeout(() => {
        statusLabel.textContent = "Sealing the envelope with wax\u2026";
        statusLabel.style.opacity = "1";
      }, 150);
    }

    // Calligraphy morph to "Mischief Managed"
    if (subtitle) {
      subtitle.style.transition = "opacity 0.3s ease";
      subtitle.style.opacity = "0";
      setTimeout(() => {
        subtitle.textContent = "Mischief Managed.";
        subtitle.style.opacity = "1";
      }, 300);
    }

    // Fade out progressive preloader details
    if (solemnSwear) {
      solemnSwear.style.transition = "opacity 0.4s ease";
      solemnSwear.style.opacity = "0";
    }
    const progressContainer = document.getElementById("loading-progress-container");
    if (progressContainer) {
      progressContainer.style.transition = "opacity 0.4s ease";
      progressContainer.style.opacity = "0";
    }
    if (percentageLabel) {
      percentageLabel.style.transition = "opacity 0.4s ease";
      percentageLabel.style.opacity = "0";
    }

    setTimeout(() => {
      const loader = document.getElementById("loading-screen");
      if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none";
          initializeMainApp();
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startCinematicSequence();
          } else {
            const wrapper = document.getElementById("envelope-wrapper");
            if (wrapper) wrapper.style.pointerEvents = "auto";
            const envArea = document.getElementById("envelope-area");
            if (envArea) envArea.style.opacity = "1";
          }
        }, 800);
      } else {
        initializeMainApp();
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          startCinematicSequence();
        } else {
          const wrapper = document.getElementById("envelope-wrapper");
          if (wrapper) wrapper.style.pointerEvents = "auto";
          const envArea = document.getElementById("envelope-area");
          if (envArea) envArea.style.opacity = "1";
        }
      }
    }, 950);
  }

  assets.forEach(async (asset) => {
    try {
      const response = await fetch(asset.url, { signal: abortCtrl.signal });
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
      
      let contentType = response.headers.get("content-type");
      if (!contentType) {
        if (asset.url.endsWith(".mp4")) {
          contentType = "video/mp4";
        } else if (asset.url.endsWith(".mp3")) {
          contentType = "audio/mp3";
        }
      }
      const blob = new Blob(chunks, contentType ? { type: contentType } : {});
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

/* ============================================================
   💡 LUMOS SPELL INTERACTION & EASTER EGG
   ============================================================ */
let lumosActive = false;
let lumosVignette = null;
let lumosGlow = null;

// New spell states
window.revelioCast = false;
window.chestUnlocked = false;
window.activeSpellMode = "";

// Standard center position for initial render
let lastLumosX = window.innerWidth / 2;
let lastLumosY = window.innerHeight / 2;

// Set global values for particles coordinates
window.lastLumosX = lastLumosX;
window.lastLumosY = lastLumosY;

function updateLumosCoords(clientX, clientY) {
  lastLumosX = clientX;
  lastLumosY = clientY;
  window.lastLumosX = clientX;
  window.lastLumosY = clientY;
  
  document.documentElement.style.setProperty("--x", `${clientX}px`);
  document.documentElement.style.setProperty("--y", `${clientY}px`);
  
  // Fire periodic magic wand sparkles centered on cursor coordinates
  if (lumosActive && Math.random() < 0.14) {
    window.dispatchEvent(new CustomEvent('envelopeTapped', {
      detail: { x: clientX, y: clientY }
    }));
  }
}

function handleLumosMove(e) {
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  updateLumosCoords(x, y);
}

function playSpellSound(isLumos) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    if (isLumos) {
      // Lumos: Uplifting magic frequency sweep
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.85);
      
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      
      osc.start(now);
      osc.stop(now + 0.9);
    } else {
      // Nox: Falling shadow frequency sweep
      osc.type = "sine";
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.65);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      
      osc.start(now);
      osc.stop(now + 0.7);
    }
  } catch (e) {
    // Fail silently
  }
}

function toggleLumosSpell(activate) {
  if (activate === lumosActive) return;
  lumosActive = activate;
  window.isLumosActive = activate;
  
  if (activate) {
    lumosVignette = document.createElement("div");
    lumosVignette.id = "lumos-vignette";
    
    lumosGlow = document.createElement("div");
    lumosGlow.id = "lumos-glow";
    
    // Inject floating dust particles container
    const dustContainer = document.createElement("div");
    dustContainer.id = "lumos-dust-container";
    lumosGlow.appendChild(dustContainer);
    
    for (let i = 0; i < 35; i++) {
      const p = document.createElement("div");
      p.className = "lumos-dust";
      p.style.left = Math.random() * 100 + "vw";
      p.style.top = Math.random() * 100 + "vh";
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
      p.style.setProperty("--dy", `${-Math.random() * 100 - 40}px`);
      p.style.animationDelay = `${Math.random() * 4}s`;
      p.style.animationDuration = `${3 + Math.random() * 3}s`;
      dustContainer.appendChild(p);
    }
    
    document.body.appendChild(lumosVignette);
    document.body.appendChild(lumosGlow);
    
    updateLumosCoords(lastLumosX, lastLumosY);
    
    requestAnimationFrame(() => {
      lumosVignette.classList.add("active");
      lumosGlow.classList.add("active");
    });
    
    window.addEventListener("mousemove", handleLumosMove);
    window.addEventListener("touchmove", handleLumosMove, { passive: true });
    
    playSpellSound(true);
    showSpellToast("Lumos Maxima! ⚡");
  } else {
    if (lumosVignette && lumosGlow) {
      lumosVignette.classList.add("cooling");
      lumosGlow.classList.add("cooling");
      lumosVignette.classList.remove("active");
      lumosGlow.classList.remove("active");
      
      const v = lumosVignette;
      const g = lumosGlow;
      setTimeout(() => {
        v.remove();
        g.remove();
      }, 850);
    }
    
    window.removeEventListener("mousemove", handleLumosMove);
    window.removeEventListener("touchmove", handleLumosMove);
    
    playSpellSound(false);
    showSpellToast("Nox. 🌙");
  }
}

function showSpellToast(text) {
  const toast = document.getElementById("house-toast");
  if (!toast) return;
  toast.style.background = "";
  toast.style.color = "";
  toast.style.borderColor = "";

  clearTimeout(toastTimer);
  toast.classList.remove("visible");
  void toast.offsetWidth;
  toast.textContent = text;
  toast.classList.add("visible");

  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

function activateTouchBlocker(durationMs) {
  let blocker = document.getElementById("spell-touch-blocker");
  if (!blocker) {
    blocker = document.createElement("div");
    blocker.id = "spell-touch-blocker";
    document.body.appendChild(blocker);
  }
  setTimeout(() => {
    if (blocker && blocker.parentNode) {
      blocker.remove();
    }
  }, durationMs);
}

window.cachedSpellTargets = [];
function cacheSpellTargets(selector) {
  window.cachedSpellTargets = [];
  const targets = document.querySelectorAll(selector);
  targets.forEach(el => {
    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
      const rect = el.getBoundingClientRect();
      window.cachedSpellTargets.push({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
  });
}



function triggerPatronusFlight() {
  if (_patronusInterval) {
    clearInterval(_patronusInterval);
    _patronusInterval = null;
  }
  document.querySelectorAll(".patronus-element").forEach(el => el.remove());

  const animals = [
    { type: 'stag', delay: 0, top: 0.24, amp: 30 },
    { type: 'otter', delay: 1200, top: 0.48, amp: -20 },
    { type: 'owl', delay: 2400, top: 0.10, amp: 50 },
    { type: 'wolf', delay: 3600, top: 0.35, amp: -10 },
    { type: 'fox', delay: 4800, top: 0.18, amp: 30 },
    { type: 'cat', delay: 6000, top: 0.55, amp: -30 }
  ];

  animals.forEach(anim => {
    const el = document.createElement("div");
    el.className = `patronus-element ${anim.type}`;
    document.body.appendChild(el);
  });

  let startTime = Date.now();
  _patronusInterval = setInterval(() => {
    let elapsed = Date.now() - startTime;
    if (elapsed > 13000) {
      clearInterval(_patronusInterval);
      _patronusInterval = null;
      return;
    }
    
    const w = window.innerWidth;
    animals.forEach(anim => {
      let t = (elapsed - anim.delay) / 6500;
      if (t >= 0 && t <= 1) {
        let x = -200 + (w + 200) * t;
        let y = window.innerHeight * anim.top - anim.amp * Math.sin(t * Math.PI);
        if (typeof window.spawnSparkCluster === 'function') {
          window.spawnSparkCluster(x + 90, y + 90, 1, false);
        }
      }
    });
  }, 40);

  setTimeout(() => {
    if (_patronusInterval) {
      clearInterval(_patronusInterval);
      _patronusInterval = null;
    }
    document.querySelectorAll(".patronus-element").forEach(el => el.remove());
  }, 13000);
}



function triggerRevelioSweep() {
  const sweep = document.createElement("div");
  sweep.id = "revelio-sweep";
  const x = lastLumosX || window.innerWidth / 2;
  const y = lastLumosY || window.innerHeight / 2;
  document.documentElement.style.setProperty("--x", `${x}px`);
  document.documentElement.style.setProperty("--y", `${y}px`);
  document.body.appendChild(sweep);
  
  document.body.classList.add("revelio-active");
  setTimeout(() => {
    sweep.remove();
    document.body.classList.remove("revelio-active");
  }, 1600);
}

function resetChestToEnvelope() {
  const envWrapper = document.getElementById("envelope-wrapper");
  const envHint = document.getElementById("envelope-hint");
  const chestWrapper = document.getElementById("treasure-chest-wrapper");
  const chest = document.getElementById("treasure-chest");
  
  window.revelioCast = false;
  window.chestUnlocked = false;
  
  if (chest) {
    chest.classList.remove("unlocked");
    chest.classList.add("locked");
  }
  
  if (chestWrapper) {
    chestWrapper.classList.add("hidden");
  }
  
  if (envWrapper) {
    envWrapper.classList.remove("hidden");
  }
  if (envHint) {
    envHint.classList.remove("hidden");
    envHint.style.opacity = "1";
  }
}

function initTreasureBox() {
  const overlay = document.getElementById("treasure-overlay");
  const closeBtn = document.getElementById("treasure-close");
  const chestWrapper = document.getElementById("treasure-chest-wrapper");
  if (!overlay || !closeBtn || !chestWrapper) return;
  
  // Focus trapping for treasure overlay
  trapFocus(overlay);

  const closeTreasure = () => {
    overlay.classList.add("hidden");
    if (window.location.hash === "#treasure-overlay") {
      history.back();
    }
    if (window.chestUnlocked) {
      resetChestToEnvelope();
    }
    // Return focus to chest
    if (chestWrapper) chestWrapper.focus();
  };

  closeBtn.addEventListener("click", closeTreasure);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeTreasure();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeTreasure();
    }
  });
  
  chestWrapper.addEventListener("click", (e) => {
    if (!window.chestUnlocked) {
      chestWrapper.classList.add("shake");
      if (typeof playCrackSound === "function") playCrackSound();
      showSpellToast("It's locked with a powerful spell! Cast 'Alohomora' to unlock it.");
      setTimeout(() => chestWrapper.classList.remove("shake"), 450);
    } else {
      const scroll = document.getElementById("treasure-scroll");
      if (overlay && scroll) {
        overlay.classList.remove("hidden");
        if (window.location.hash !== "#treasure-overlay") {
          history.pushState({ treasureOpen: true }, "", "#treasure-overlay");
        }
        scroll.classList.remove("hidden-scroll");
        scroll.classList.add("show-scroll");
        setTimeout(() => {
          if (closeBtn) closeBtn.focus();
        }, 100);
      }
    }
  });

  // Keyboard support for activating the chest
  chestWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      chestWrapper.click();
    }
  });
}

function castSpellText(spellText) {
  const txt = (spellText || "").trim().toLowerCase();
  
  // Clean up previous visual spell states if casting a new visual spell
  const visualSpells = [
    "expecto patronum", "wingardium leviosa", "incendio", "aguamenti",
    "herbivicus", "glacius", "prisma", "amoris", "stellaris"
  ];
  
  if (visualSpells.includes(txt)) {
    const spellClasses = [
      "patronus-active", "levitation-running", "incendio-running",
      "aguamenti-running", "herbivicus-running",
      "frozen-lock", "prisma-running", "amoris-running", "stellaris-running"
    ];
    document.body.classList.remove(...spellClasses);

    // Clean up spell overlay nodes
    const water = document.getElementById("water-level");
    if (water) water.remove();
    const ice = document.getElementById("ice-overlay");
    if (ice) ice.classList.remove("frozen");
    const accioCard = document.getElementById("accio-card");
    if (accioCard) accioCard.classList.remove("accio-fly-in");
    const prismaBox = document.getElementById("prisma-box");
    if (prismaBox) document.body.classList.remove("prisma-running");
    // Clean amoris hearts
    const amorisOverlay = document.getElementById("amoris-overlay");
    if (amorisOverlay) { amorisOverlay.innerHTML = ''; amorisOverlay.style.display = 'none'; }
    // Clean stellaris stars
    const stellarisOverlay = document.getElementById("stellaris-overlay");
    if (stellarisOverlay) { stellarisOverlay.innerHTML = ''; stellarisOverlay.style.display = 'none'; }
    // Reset filter applied by stellaris
    document.getElementById('main-content') && (document.getElementById('main-content').style.filter = '');
    document.getElementById('envelope-wrapper') && (document.getElementById('envelope-wrapper').style.filter = '');
  }
  
  if (txt === "lumos") {
    toggleLumosSpell(true);
  } 
  else if (txt === "nox") {
    toggleLumosSpell(false);
  } 
  else if (txt === "alohomora") {
    if (!window.revelioCast) {
      showSpellToast("Reveal the chest first using 'Revelio' before trying to open it!");
    } else if (window.revelioCast && !window.chestUnlocked) {
      const chest = document.getElementById("treasure-chest");
      const overlay = document.getElementById("treasure-overlay");
      const scroll = document.getElementById("treasure-scroll");
      const msgContent = document.getElementById("treasure-message-content");
      const chestWrapper = document.getElementById("treasure-chest-wrapper");
      
      if (chest && overlay && scroll && msgContent) {
        window.chestUnlocked = true;
        chest.classList.remove("locked");
        chest.classList.add("unlocked");
        
        // Haptic double-tap vibration for Android
        if (window.navigator && typeof window.navigator.vibrate === 'function') {
          window.navigator.vibrate([100, 50, 100]);
        }
        
        if (chestWrapper) {
          const rect = chestWrapper.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          }));
        }
        
        const c = window._bdContent || {};
        const msg = c.eyesOnlyMessage || `Dear ${c.friendName || "Ayushi"}, wishing you the most magical and beautiful birthday yet! ✦`;
        msgContent.innerHTML = `<p>${msg.replace(/\n/g, "</p><p>")}</p>`;
        
        if (typeof playCrackSound === "function") playCrackSound();
        
        setTimeout(() => {
          overlay.classList.remove("hidden");
          if (window.location.hash !== "#treasure-overlay") {
            history.pushState({ treasureOpen: true }, "", "#treasure-overlay");
          }
          scroll.classList.remove("hidden-scroll");
          scroll.classList.add("show-scroll");
        }, 1200);
        
        showSpellToast("Alohomora! The chest has unlocked.");
      }
    } else {
      showSpellToast("The chest is already open!");
    }
  } 
  else if (txt === "revelio") {
    window.revelioCast = true;
    triggerRevelioSweep();
    
    const envWrapper = document.getElementById("envelope-wrapper");
    const envHint = document.getElementById("envelope-hint");
    const chestWrapper = document.getElementById("treasure-chest-wrapper");
    
    if (typeof playCrackSound === "function") playCrackSound();
    
    if (envWrapper) envWrapper.classList.add("hidden");
    if (envHint) envHint.classList.add("hidden");
    if (chestWrapper) {
      chestWrapper.classList.remove("hidden");
      setTimeout(() => {
        const rect = chestWrapper.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent('envelopeTapped', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        }));
        
        // Spawn gold dust radial shockwave sparks
        if (typeof window.spawnSparkCluster === 'function') {
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
            const rx = rect.left + rect.width / 2 + Math.cos(angle) * 90;
            const ry = rect.top + rect.height / 2 + Math.sin(angle) * 70;
            window.spawnSparkCluster(rx, ry, 1, true);
          }
        }
      }, 300);
    }
    showSpellToast("Revelio! The hidden chest is revealed.");
  } 
  else if (txt === "expecto patronum") {
    window.activeSpellMode = "patronus";
    document.body.classList.add("patronus-active");
    triggerPatronusFlight();
    showSpellToast("Expecto Patronum! ⚡");
    setTimeout(() => {
      if (window.activeSpellMode === "patronus") window.activeSpellMode = "";
      document.body.classList.remove("patronus-active");
    }, 12500);
  } 
  else if (txt === "wingardium leviosa") {
    window.activeSpellMode = "levitation";
    document.body.classList.add("levitation-running");
    showSpellToast("Wingardium Leviosa! 💫");
    setTimeout(() => {
      if (window.activeSpellMode === "levitation") window.activeSpellMode = "";
      document.body.classList.remove("levitation-running");
    }, 8000);
  } 
  /* Incendio legacy check removed */ 
  else if (txt === "aguamenti") {
    if (_aguamentiTimeout1) clearTimeout(_aguamentiTimeout1);
    if (_aguamentiTimeout2) clearTimeout(_aguamentiTimeout2);
 
    const oldWater = document.getElementById("water-level");
    if (oldWater) oldWater.remove();
 
    window.activeSpellMode = "aguamenti";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 90;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("aguamenti-running");
    showSpellToast("Aguamenti! 💧");
    
    const water = document.createElement("div");
    water.id = "water-level";
    
    // Inject dynamic waves SVG path
    water.innerHTML = `
      <svg id="water-waves" viewBox="0 0 100 20" preserveAspectRatio="none" style="position:absolute; top:-19px; left:0; width:100%; height:20px; fill:rgba(30, 144, 255, 0.45); pointer-events:none; z-index:181;">
        <path id="water-wave-path" d="M 0 20 L 0 10 Q 25 10 50 10 Q 75 10 100 10 L 100 20 Z"></path>
      </svg>
    `;
    document.body.appendChild(water);
    
    water.className = "";
    void water.offsetWidth;
    water.classList.add("rising");
    
    let waveRAF;
    let waveTime = 0;
    let rippleX = -1;
    let rippleForce = 0;
    
    const updateWaves = () => {
      if (window.activeSpellMode !== "aguamenti") return;
      waveTime += 0.08;
      
      const path = document.getElementById("water-wave-path");
      if (path) {
        const px = window.lastLumosX || 0;
        const py = window.lastLumosY || 0;
        const waterLevelRect = water.getBoundingClientRect();
        const surfaceY = waterLevelRect.top;
        
        if (px && py && Math.abs(py - surfaceY) < 120) {
          rippleX = px / window.innerWidth * 100;
          rippleForce = Math.min(6, (120 - Math.abs(py - surfaceY)) / 120 * 5);
        } else {
          rippleForce *= 0.92;
        }
        
        const pts = [];
        for (let i = 0; i <= 4; i++) {
          const xPercent = i * 25;
          let waveHeight = 10 + Math.sin(waveTime + i * 1.5) * 2.8;
          
          if (rippleForce > 0.1 && rippleX >= 0) {
            const dist = Math.abs(xPercent - rippleX);
            if (dist < 30) {
              const push = (30 - dist) / 30 * rippleForce * 1.8;
              waveHeight += push;
            }
          }
          pts.push(waveHeight.toFixed(1));
        }
        
        const d = `M 0 20 L 0 ${pts[0]} Q 25 ${pts[1]} 50 ${pts[2]} Q 75 ${pts[3]} 100 ${pts[4]} L 100 20 Z`;
        path.setAttribute("d", d);
      }
      
      waveRAF = requestAnimationFrame(updateWaves);
    };
    
    updateWaves();
    
    _aguamentiTimeout1 = setTimeout(() => {
      if (window.activeSpellMode === "aguamenti") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      if (water) {
        water.classList.remove("rising");
        water.classList.add("falling");
      }
    }, 8000);
 
    _aguamentiTimeout2 = setTimeout(() => {
      document.body.classList.remove("aguamenti-running");
      cancelAnimationFrame(waveRAF);
      if (water && water.parentNode) {
        water.remove();
      }
      _aguamentiTimeout1 = null;
      _aguamentiTimeout2 = null;
    }, 10000);
  } 
  /* Glacius legacy check removed */ 
  else if (txt === "confundo") {
    window.activeSpellMode = "confundo";
    document.body.classList.add("confundo-running");
    showSpellToast("Confundo! 🌀");
    setTimeout(() => {
      if (window.activeSpellMode === "confundo") {
        window.activeSpellMode = "";
      }
      document.body.classList.remove("confundo-running");
    }, 6000);
  }
  else if (txt === "specialis revelio") {
    window.activeSpellMode = "revelio";
    showSpellToast("Specialis Revelio! 🔍");
    
    let scanLine = document.getElementById("revelio-scan-line");
    if (!scanLine) {
      scanLine = document.createElement("div");
      scanLine.id = "revelio-scan-line";
      document.body.appendChild(scanLine);
    }
    
    const selectors = [
      "h1", "h2", "h3", 
      "#envelope-wrapper", "#treasure-chest-wrapper", 
      "p", "button:not(#spell-touch-blocker)", ".badge-img", "#scroll-paper"
    ];
    const targetElements = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.offsetWidth > 0 && el.offsetHeight > 0) {
          const rect = el.getBoundingClientRect();
          targetElements.push({ element: el, top: rect.top + window.scrollY });
        }
      });
    });
    
    targetElements.sort((a, b) => a.top - b.top);
    
    const viewportHeight = window.innerHeight;
    targetElements.forEach(item => {
      const fraction = Math.min(1, Math.max(0, item.top / (viewportHeight || 1)));
      const delay = fraction * 2200;
      setTimeout(() => {
        if (window.activeSpellMode === "revelio") {
          item.element.classList.add("revelio-pulse");
          setTimeout(() => {
            item.element.classList.remove("revelio-pulse");
          }, 800);
        }
      }, delay);
    });
    
    setTimeout(() => {
      if (window.activeSpellMode === "revelio") {
        window.activeSpellMode = "";
      }
      if (scanLine && scanLine.parentNode) {
        scanLine.remove();
      }
    }, 2800);
  }
  else if (txt === "depulso") {
    window.activeSpellMode = "depulso";
    document.body.classList.add("depulso-running");
    showSpellToast("Depulso! 💨");
    setTimeout(() => {
      if (window.activeSpellMode === "depulso") {
        window.activeSpellMode = "";
      }
      document.body.classList.remove("depulso-running");
    }, 5000);
  }
  else if (txt === "accio") {
    showSpellToast("Accio! 🧲");
    
    const accioCard = document.getElementById('accio-card');
    if (accioCard) {
      const c = window._bdContent || {};
      const imgSrc = c.accioImage || 'accio_card.png';
      
      // Inject gold-sheen overlay wrapper and image
      accioCard.innerHTML = `
        <div class="accio-gold-sheen"></div>
        <img src="${imgSrc}" alt="Accio card" id="accio-card-img">
      `;
      
      accioCard.style.display = 'block';
      accioCard.style.opacity = '0';
      accioCard.className = '';
      void accioCard.offsetWidth;
      accioCard.classList.add('accio-fly-in');
      
      // Dynamic pointer tilt listener
      const handleAccioTilt = (pe) => {
        const cx = pe.touches ? pe.touches[0].clientX : pe.clientX;
        const cy = pe.touches ? pe.touches[0].clientY : pe.clientY;
        const rx = (cx - window.innerWidth / 2) / (window.innerWidth / 2) * 16;
        const ry = (cy - window.innerHeight / 2) / (window.innerHeight / 2) * -16;
        accioCard.style.transform = `translate3d(-50%, -50%, 0) rotateY(${rx}deg) rotateX(${ry}deg) scale(1.05)`;
      };
      
      // Summon sparkles on arrival
      setTimeout(() => {
        accioCard.classList.remove('accio-fly-in');
        accioCard.style.opacity = '1';
        accioCard.style.filter = 'none';
        
        window.addEventListener('mousemove', handleAccioTilt, { passive: true });
        window.addEventListener('touchmove', handleAccioTilt, { passive: true });
        
        if (typeof window.spawnSparkCluster === 'function') {
          for (let i = 0; i < 5; i++) {
            window.spawnSparkCluster(
              window.innerWidth / 2 + rand(-60, 60),
              window.innerHeight / 2 + rand(-80, 80),
              3, true
            );
          }
        }
      }, 900);
      
      // Hold then fall
      setTimeout(() => {
        window.removeEventListener('mousemove', handleAccioTilt);
        window.removeEventListener('touchmove', handleAccioTilt);
        
        accioCard.style.opacity = '';
        accioCard.style.filter = '';
        accioCard.style.transform = '';
        
        void accioCard.offsetWidth;
        accioCard.classList.add('accio-fall');
        
        setTimeout(() => {
          accioCard.style.display = 'none';
          accioCard.className = '';
          accioCard.innerHTML = '';
        }, 900);
      }, 9000);
    }
  } 
  
  /* ==========================================
     Elemental Spells — handled below
     ========================================== */

  else if (txt === "herbivicus" || txt === "flora") {
    window.activeSpellMode = "herbivicus";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 50;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("herbivicus-running");
    showSpellToast("Herbivicus! 🌿");
    
    // Show PNG botanical border overlay
    const herBorder = document.getElementById('herbivicus-border');
    if (herBorder) {
      herBorder.style.display = 'block';
      void herBorder.offsetWidth;
      herBorder.classList.add('active');
    }
    
    setTimeout(() => {
      if (window.activeSpellMode === "herbivicus") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("herbivicus-running");
      if (herBorder) {
        herBorder.classList.remove('active');
        setTimeout(() => { herBorder.style.display = 'none'; }, 800);
      }
    }, 10000);
  }

  else if (txt === "duro" || txt === "terram") {
    window.activeSpellMode = "duro";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 50;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("duro-running");
    if (typeof playCrackSound === "function") playCrackSound();
    document.body.classList.add("shake-screen");
    if (window.navigator && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(180);
    }
    setTimeout(() => document.body.classList.remove("shake-screen"), 300);
    showSpellToast("Duro! 🪨");
    
    // Show PNG stone border overlay
    const duroBorder = document.getElementById('duro-border');
    if (duroBorder) {
      duroBorder.style.display = 'block';
      void duroBorder.offsetWidth;
      duroBorder.classList.add('active');
    }
    
    setTimeout(() => {
      if (window.activeSpellMode === "duro") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("duro-running");
      if (duroBorder) {
        duroBorder.classList.remove('active');
        setTimeout(() => { duroBorder.style.display = 'none'; }, 800);
      }
    }, 10000);
  }

  else if (txt === "incendio") {
    window.activeSpellMode = "incendio";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 70;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    cacheSpellTargets('#envelope-wrapper, #treasure-chest-wrapper, h1, button:not(#spell-touch-blocker)');
    document.body.classList.add("incendio-running");
    showSpellToast("Incendio! 🔥");
    
    // Show fire strip at bottom
    const strip = document.getElementById('incendio-strip');
    if (strip) {
      strip.style.display = 'block';
      void strip.offsetWidth;
      strip.classList.add('active');
    }
    
    setTimeout(() => {
      if (window.activeSpellMode === "incendio") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("incendio-running");
      window.cachedSpellTargets = [];
      if (strip) {
        strip.classList.remove('active');
        setTimeout(() => { strip.style.display = 'none'; }, 800);
      }
    }, 10000);
  }

  else if (txt === "ventus") {
    window.activeSpellMode = "ventus";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 60;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("ventus-running");
    showSpellToast("Ventus! 🍃");
    setTimeout(() => {
      if (window.activeSpellMode === "ventus") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("ventus-running");
    }, 10000);
  }

  else if (txt === "glacius") {
    window.activeSpellMode = "glacius";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 55;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    cacheSpellTargets('#envelope-wrapper, #treasure-chest-wrapper, h1, button:not(#spell-touch-blocker), p');
    
    let ice = document.getElementById("ice-overlay");
    if (!ice) {
      ice = document.createElement("div");
      ice.id = "ice-overlay";
      document.body.appendChild(ice);
    }
    void ice.offsetWidth;
    ice.classList.add("frozen");
    document.body.classList.add("frozen-lock");
    if (typeof playCrackSound === "function") playCrackSound();
    showSpellToast("Glacius! ❄️");
    
    // Activate interactive scratch-clear canvas
    activateGlaciusCanvas();
    
    setTimeout(() => {
      if (window.activeSpellMode === "glacius") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("frozen-lock");
      window.cachedSpellTargets = [];
      deactivateGlaciusCanvas();
      if (ice) {
        ice.classList.remove("frozen");
        setTimeout(() => {
          if (ice && ice.parentNode) ice.remove();
        }, 1500);
      }
    }, 12000);
  }
  else if (txt === "fumos") {
    window.activeSpellMode = "fumos";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 60;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("fumos-running");
    showSpellToast("Fumos! 💨");
    activateFumosCanvas();
    
    setTimeout(() => {
      if (window.activeSpellMode === "fumos") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("fumos-running");
      deactivateFumosCanvas();
    }, 12000);
  }
  else if (txt === "prisma") {
    window.activeSpellMode = "prisma";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 35 : 95;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("prisma-running");
    showSpellToast("Prisma! 🌈");
    
    setTimeout(() => {
      if (window.activeSpellMode === "prisma") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("prisma-running");
      // Force clear the sparkle canvas so no static rainbow overlay stays on screen
      const canvas = document.getElementById('sparkle-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 12000);
  }
  else if (txt === "chronos") {
    window.activeSpellMode = "chronos";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 15 : 50;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("chronos-running");
    const overlay = document.getElementById("chronos-overlay");
    if (overlay) {
      overlay.classList.add("active");
    }
    showSpellToast("Chronos! ⏳");
    
    setTimeout(() => {
      if (window.activeSpellMode === "chronos") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("chronos-running");
      if (overlay) {
        overlay.classList.remove("active");
      }
    }, 12000);
  }

  /* ══════════════════════════════════════════
     💕 AMORIS — Floating Hearts
     ══════════════════════════════════════════ */
  else if (txt === "amoris") {
    window.activeSpellMode = "amoris";
    document.body.classList.add("amoris-running");
    showSpellToast("Amoris! 💕 Love is in the air!");

    const overlay = document.getElementById("amoris-overlay");
    if (overlay) {
      overlay.style.display = 'block';
      overlay.innerHTML = '';
      const hearts = ["💕","💗","💖","💓","💞","❤️","🌸","💝"];
      const count = (window.innerWidth < 480) ? 22 : 45;
      const heartData = [];
      
      for (let i = 0; i < count; i++) {
        const h = document.createElement("span");
        h.className = "amoris-heart-dynamic";
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        overlay.appendChild(h);
        
        const size = 16 + Math.random() * 20;
        h.style.fontSize = `${size}px`;
        
        heartData.push({
          element: h,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50 + Math.random() * 150,
          vx: 0,
          vy: -1.2 - Math.random() * 2.2,
          wobbleOffset: Math.random() * 100,
          wobbleSpeed: 0.01 + Math.random() * 0.025,
          scale: 0.8 + Math.random() * 0.5,
          rot: (Math.random() - 0.5) * 20
        });
      }
      
      let amorisRAF;
      const tickAmoris = () => {
        if (window.activeSpellMode !== "amoris") return;
        const pointerX = window.lastLumosX || 0;
        const pointerY = window.lastLumosY || 0;
        
        heartData.forEach(h => {
          h.y += h.vy;
          const drift = Math.sin((h.y + h.wobbleOffset) * h.wobbleSpeed) * 0.85;
          h.x += drift + h.vx;
          h.vx *= 0.94;
          
          if (pointerX && pointerY) {
            const dx = h.x - pointerX;
            const dy = h.y - pointerY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
              const force = (120 - dist) / 120 * 3.8;
              const angle = Math.atan2(dy, dx);
              h.x += Math.cos(angle) * force;
              h.y += Math.sin(angle) * force * 0.5;
            }
          }
          
          if (h.y < -50) {
            h.y = window.innerHeight + 50;
            h.x = Math.random() * window.innerWidth;
            h.vx = 0;
          }
          
          h.element.style.transform = `translate3d(${h.x}px, ${h.y}px, 0) scale(${h.scale}) rotate(${h.rot}deg)`;
        });
        
        amorisRAF = requestAnimationFrame(tickAmoris);
      };
      
      tickAmoris();
      
      // Spawn initial sparkle clusters
      if (typeof window.spawnSparkCluster === 'function') {
        for (let i = 0; i < 6; i++) {
          window.spawnSparkCluster(
            window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.6,
            window.innerHeight * (0.3 + Math.random() * 0.5),
            3, true
          );
        }
      }

      setTimeout(() => {
        if (window.activeSpellMode === "amoris") window.activeSpellMode = "";
        document.body.classList.remove("amoris-running");
        cancelAnimationFrame(amorisRAF);
        overlay.innerHTML = '';
        overlay.style.display = 'none';
      }, 10000);
    }
  }

  /* ══════════════════════════════════════════
     ✨ STELLARIS — Starry Night
     ══════════════════════════════════════════ */
  else if (txt === "stellaris") {
    window.activeSpellMode = "stellaris";
    window.maxParticlesLimit = (window.innerWidth < 768) ? 25 : 70;
    if (typeof window.startMagicParticlesLoop === 'function') {
      window.startMagicParticlesLoop();
    }
    document.body.classList.add("stellaris-running");
    showSpellToast("Stellaris! ✨ The stars descend!");

    // Create a stellaris overlay container
    let stellarisOverlay = document.getElementById("stellaris-overlay");
    if (!stellarisOverlay) {
      stellarisOverlay = document.createElement("div");
      stellarisOverlay.id = "stellaris-overlay";
      Object.assign(stellarisOverlay.style, {
        position: "fixed", inset: "0", pointerEvents: "none",
        zIndex: "154", overflow: "hidden"
      });
      document.body.appendChild(stellarisOverlay);
    }
    stellarisOverlay.style.display = "block";

    // Scatter static twinkle stars
    const starCount = (window.innerWidth < 480) ? 40 : 90;
    for (let i = 0; i < starCount; i++) {
      const s = document.createElement("div");
      s.className = "stellaris-star";
      const size = (1 + Math.random() * 3).toFixed(1);
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = (Math.random() * 100) + "%";
      s.style.top = (Math.random() * 100) + "%";
      const dur = (1.2 + Math.random() * 3).toFixed(2);
      const delay = (Math.random() * 4).toFixed(2);
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = delay + "s";
      stellarisOverlay.appendChild(s);
    }

    // Spawn 3 shooting stars
    for (let i = 0; i < 3; i++) {
      const ss = document.createElement("div");
      ss.className = "stellaris-shooter";
      ss.style.width = (60 + Math.random() * 80) + "px";
      ss.style.left = (Math.random() * 70) + "%";
      ss.style.top = (Math.random() * 50) + "%";
      const delay2 = (i * 1.8 + Math.random()).toFixed(2);
      ss.style.animationDuration = "1.4s";
      ss.style.animationDelay = delay2 + "s";
      stellarisOverlay.appendChild(ss);
    }

    setTimeout(() => {
      if (window.activeSpellMode === "stellaris") {
        window.activeSpellMode = "";
        window.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("stellaris-running");
      // Restore filters
      const mc = document.getElementById('main-content');
      const ew = document.getElementById('envelope-wrapper');
      if (mc) mc.style.filter = '';
      if (ew) ew.style.filter = '';
      if (stellarisOverlay) { stellarisOverlay.innerHTML = ''; stellarisOverlay.style.display = 'none'; }
    }, 12000);
  }

  else if (txt) {
    showSpellToast("Fizzled... Try another spell!");
  }
}

/* ── Android-Optimized Interactive Pointer Trails for Active Spells ── */
let _lastTrailSpawnTime = 0;
let _lastTrailX = 0;
let _lastTrailY = 0;

function handleGeneralPointerMove(e) {
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  
  window.lastLumosX = x;
  window.lastLumosY = y;
  
  // Only spawn drag trails if an active spell mode is running (excluding Lumos/Nox which have custom tracking)
  if (window.activeSpellMode && window.activeSpellMode !== 'none' && window.activeSpellMode !== 'patronus') {
    const now = performance.now();
    const timeDelta = now - _lastTrailSpawnTime;
    
    const dx = x - _lastTrailX;
    const dy = y - _lastTrailY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    // Strict Android throttle: only spawn if 60ms elapsed OR user dragged at least 25px
    if (timeDelta > 60 || distance > 25) {
      if (typeof window.spawnSparkCluster === 'function') {
        window.spawnSparkCluster(x, y, Math.floor(rand(1, 3)), false);
      }
      _lastTrailSpawnTime = now;
      _lastTrailX = x;
      _lastTrailY = y;
    }
  }
}

window.addEventListener("mousemove", handleGeneralPointerMove, { passive: true });
window.addEventListener("touchmove", handleGeneralPointerMove, { passive: true });

/* ── Glacius Interactive Ice-Scratch Canvas ── */
let _glaciusCanvas = null;
let _glaciusCtx = null;
let _glaciusRAF = null;

function activateGlaciusCanvas() {
  const canvas = document.getElementById('glacius-canvas');
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  // Fill with frosted pale blue-white layer
  ctx.fillStyle = 'rgba(212, 242, 255, 0.94)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  
  // Draw primary ice fracture crack lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.lineWidth = 1.0;
  for (let i = 0; i < 15; i++) {
    const sx = rand(0, window.innerWidth);
    const sy = rand(0, window.innerHeight);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    let cx = sx, cy = sy;
    for (let j = 0; j < 4; j++) {
      cx += rand(-50, 50);
      cy += rand(-50, 50);
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Draw 6 procedurally grown crystalline ice stars/snowflakes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
  for (let c = 0; c < 6; c++) {
    const fx = rand(50, window.innerWidth - 50);
    const fy = rand(50, window.innerHeight - 50);
    ctx.lineWidth = 1.0;
    
    // Draw 8 symmetric rays
    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      let rx = fx, ry = fy;
      for (let segment = 0; segment < 4; segment++) {
        rx += Math.cos(angle) * rand(8, 16);
        ry += Math.sin(angle) * rand(8, 16);
        ctx.lineTo(rx, ry);
        
        // draw minor perpendicular crystal branches
        const crossAngle = angle + Math.PI / 2;
        const cx1 = rx + Math.cos(crossAngle) * 4;
        const cy1 = ry + Math.sin(crossAngle) * 4;
        const cx2 = rx - Math.cos(crossAngle) * 4;
        const cy2 = ry - Math.sin(crossAngle) * 4;
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.moveTo(rx, ry);
      }
      ctx.stroke();
    }
  }
  
  _glaciusCanvas = canvas;
  _glaciusCtx = ctx;
  
  // Touch/drag erase handler
  function eraseIce(e) {
    if (window.activeSpellMode !== 'glacius') return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const r = 45; // eraser radius
    _glaciusCtx.save();
    _glaciusCtx.globalCompositeOperation = 'destination-out';
    _glaciusCtx.beginPath();
    _glaciusCtx.arc(x, y, r, 0, Math.PI * 2);
    _glaciusCtx.fill();
    _glaciusCtx.restore();
  }
  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('touchmove', eraseIce, { passive: false });
  canvas.addEventListener('mousemove', eraseIce, { passive: true });
  canvas._eraseIce = eraseIce;
}

function deactivateGlaciusCanvas() {
  const canvas = document.getElementById('glacius-canvas');
  if (!canvas) return;
  if (canvas._eraseIce) {
    canvas.removeEventListener('touchmove', canvas._eraseIce);
    canvas.removeEventListener('mousemove', canvas._eraseIce);
    canvas._eraseIce = null;
  }
  // Fade out then hide
  canvas.style.transition = 'opacity 1s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    canvas.style.display = 'none';
    canvas.style.opacity = '1';
    canvas.style.transition = '';
    canvas.style.pointerEvents = 'none';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1000);
  _glaciusCanvas = null;
  _glaciusCtx = null;
}


/* ── Fumos Interactive Mist-Scratch Canvas ── */
let _fumosCanvas = null;
let _fumosCtx = null;
let _fumosRAF = null; // Dedicated RAF handle for Fumos animation (separate from Glacius)

function activateFumosCanvas() {
  const canvas = document.getElementById('fumos-canvas');
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  // Fill with thick mist layer (solid semi-opaque light gray-blue)
  ctx.fillStyle = 'rgba(235, 238, 245, 0.94)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  
  // Animate mist wisps
  let mistAge = 0;
  function animateMist() {
    if (window.activeSpellMode !== 'fumos') return;
    mistAge += 0.01;
    // Re-draw subtle swirling effect on the mist surface (very light, performance-safe)
    ctx.save();
    ctx.globalAlpha = 0.015;
    ctx.fillStyle = `rgba(200,220,255,0.3)`;
    for (let i = 0; i < 3; i++) {
      const mx = rand(0, window.innerWidth);
      const my = rand(0, window.innerHeight);
      ctx.beginPath();
      ctx.arc(mx, my, rand(40, 100), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    _fumosRAF = requestAnimationFrame(animateMist); // Fixed: use _fumosRAF not _glaciusRAF
  }
  animateMist();
  
  _fumosCanvas = canvas;
  _fumosCtx = ctx;
  
  // Touch/drag erase handler — reveal scene through mist
  function eraseMist(e) {
    if (window.activeSpellMode !== 'fumos') return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const r = 55;
    _fumosCtx.save();
    _fumosCtx.globalCompositeOperation = 'destination-out';
    _fumosCtx.beginPath();
    _fumosCtx.arc(x, y, r, 0, Math.PI * 2);
    _fumosCtx.fill();
    _fumosCtx.restore();
  }
  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('touchmove', eraseMist, { passive: false });
  canvas.addEventListener('mousemove', eraseMist, { passive: true });
  canvas._eraseMist = eraseMist;
}

function deactivateFumosCanvas() {
  if (_fumosRAF) { cancelAnimationFrame(_fumosRAF); _fumosRAF = null; } // Fixed: cancel _fumosRAF not _glaciusRAF
  const canvas = document.getElementById('fumos-canvas');
  if (!canvas) return;
  if (canvas._eraseMist) {
    canvas.removeEventListener('touchmove', canvas._eraseMist);
    canvas.removeEventListener('mousemove', canvas._eraseMist);
    canvas._eraseMist = null;
  }
  canvas.style.transition = 'opacity 1.5s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    canvas.style.display = 'none';
    canvas.style.opacity = '1';
    canvas.style.transition = '';
    canvas.style.pointerEvents = 'none';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1500);
  _fumosCanvas = null;
  _fumosCtx = null;
}

/* ── DOM Init ── */
document.addEventListener("DOMContentLoaded", () => {
  startPreloader();
});

/* ── PWA Android Back Navigation Handler ── */
window.addEventListener("popstate", (e) => {
  // Check if spell modal is open but hash has been popped
  const spellModal = document.getElementById("spell-modal");
  if (spellModal && spellModal.classList.contains("open") && window.location.hash !== "#spell-modal") {
    spellModal.classList.remove("open");
    const spellBtn = document.getElementById("spell-btn");
    if (spellBtn) spellBtn.focus();
  }

  // Check if treasure overlay is open but hash has been popped
  const treasureOverlay = document.getElementById("treasure-overlay");
  if (treasureOverlay && !treasureOverlay.classList.contains("hidden") && window.location.hash !== "#treasure-overlay") {
    treasureOverlay.classList.add("hidden");
    if (window.chestUnlocked) {
      resetChestToEnvelope();
    }
    const chestWrapper = document.getElementById("treasure-chest-wrapper");
    if (chestWrapper) chestWrapper.focus();
  }
});

/* ── Ambient Atmosphere Interactive Subsystems ── */
function initAmbientAtmosphere() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  class Firefly {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1.2;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.4 + 0.2;
      this.wobbleSpeed = Math.random() * 0.05 + 0.02;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.fadeDir = Math.random() > 0.5 ? 0.01 : -0.01;
    }
    update(mouseX, mouseY, avoidRect) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 1.5;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      if (avoidRect) {
        const cx = avoidRect.left + avoidRect.width / 2;
        const cy = avoidRect.top + avoidRect.height / 2;
        if (this.x > avoidRect.left - 40 && this.x < avoidRect.right + 40 &&
            this.y > avoidRect.top - 40 && this.y < avoidRect.bottom + 40) {
          const ex = this.x - cx;
          const ey = this.y - cy;
          const edist = Math.sqrt(ex * ex + ey * ey) || 1;
          this.x += (ex / edist) * 1.2;
          this.y += (ey / edist) * 1.2;
        }
      }

      this.angle += (Math.random() - 0.5) * 0.15;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      this.opacity += this.fadeDir;
      if (this.opacity > 0.85 || this.opacity < 0.25) {
        this.fadeDir = -this.fadeDir;
      }
    }
    draw() {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      grad.addColorStop(0, `rgba(180, 245, 100, ${this.opacity})`);
      grad.addColorStop(0.3, `rgba(180, 245, 100, ${this.opacity * 0.4})`);
      grad.addColorStop(1, 'rgba(180, 245, 100, 0)');
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class MagicalDust {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.2 + 0.5;
      this.vy = Math.random() * 0.3 + 0.15;
      this.vx = (Math.random() * 0.2 + 0.1) * -1;
      this.opacity = Math.random() * 0.4 + 0.2;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      if (this.y > height) {
        this.y = 0;
        this.x = Math.random() * width;
      }
      if (this.x < 0) {
        this.x = width;
        this.y = Math.random() * height;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255, 245, 210, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class SmokeParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = -(Math.random() * 0.4 + 0.3);
      this.size = Math.random() * 4 + 2;
      this.maxLife = Math.random() * 120 + 80;
      this.life = this.maxLife;
      this.opacity = Math.random() * 0.25 + 0.1;
    }
    update() {
      this.x += this.vx + Math.sin(this.y * 0.015) * 0.1;
      this.y += this.vy;
      this.size += 0.08;
      this.life--;
    }
    draw() {
      const alpha = (this.life / this.maxLife) * this.opacity;
      ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.active = false;
      this.delay = Math.random() * 1200 + 400;
    }
    trigger() {
      this.active = true;
      this.x = Math.random() * (width * 0.6) + width * 0.2;
      this.y = Math.random() * (height * 0.3);
      this.speed = Math.random() * 10 + 10;
      this.angle = Math.PI * 0.2 + Math.random() * 0.1;
      this.vx = -Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.life = Math.random() * 25 + 15;
      this.maxLife = this.life;
    }
    update() {
      if (!this.active) {
        this.delay--;
        if (this.delay <= 0) {
          this.trigger();
        }
        return;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      if (this.life <= 0) {
        this.reset();
      }
    }
    draw() {
      if (!this.active) return;
      ctx.strokeStyle = `rgba(255, 255, 235, ${this.life / this.maxLife})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5);
      ctx.stroke();
    }
  }

  class Bird {
    constructor(isOwl = false) {
      this.isOwl = isOwl;
      this.reset();
    }
    reset() {
      this.x = this.isOwl ? width + 50 : -50;
      this.y = Math.random() * (height * 0.4) + 50;
      this.vx = this.isOwl ? -(Math.random() * 0.8 + 0.6) : (Math.random() * 0.6 + 0.4);
      this.vy = (Math.random() - 0.5) * 0.1;
      this.size = this.isOwl ? 8 : 4;
      this.wingCycle = 0;
      this.active = Math.random() > 0.4;
      this.wingSpeed = this.isOwl ? 0.08 : 0.2;
    }
    update() {
      if (!this.active) {
        if (Math.random() < 0.002) this.active = true;
        return;
      }
      this.x += this.vx;
      this.y += this.vy + Math.sin(this.x * 0.02) * 0.1;
      this.wingCycle += this.wingSpeed;

      if ((this.isOwl && this.x < -50) || (!this.isOwl && this.x > width + 50)) {
        this.reset();
        this.active = false;
      }
    }
    draw() {
      if (!this.active) return;
      ctx.strokeStyle = this.isOwl ? 'rgba(10, 15, 30, 0.42)' : 'rgba(80, 90, 100, 0.35)';
      ctx.lineWidth = this.isOwl ? 2 : 1.2;
      ctx.beginPath();

      const wingY = Math.sin(this.wingCycle) * this.size;
      ctx.moveTo(this.x - this.size, this.y - wingY);
      ctx.quadraticCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x, this.y);
      ctx.quadraticCurveTo(this.x + this.size / 2, this.y - this.size / 2, this.x + this.size, this.y - wingY);
      ctx.stroke();

      if (this.isOwl) {
        ctx.fillStyle = 'rgba(10, 15, 30, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  class Feather {
    constructor() {
      this.x = Math.random() * width;
      this.y = -50;
      this.size = Math.random() * 8 + 6;
      this.vy = Math.random() * 0.2 + 0.25;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.wobbleRange = Math.random() * 30 + 10;
      this.angle = Math.random() * Math.PI;
      this.spinSpeed = (Math.random() - 0.5) * 0.015;
      this.opacity = Math.random() * 0.22 + 0.1;
    }
    update() {
      this.y += this.vy;
      this.angle += this.spinSpeed;
      this.xOffset = Math.sin(this.y * this.wobbleSpeed) * this.wobbleRange;
      if (this.y > height + 50) {
        this.y = -50;
        this.x = Math.random() * width;
      }
    }
    draw() {
      const rx = this.x + this.xOffset;
      ctx.save();
      ctx.translate(rx, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = `rgba(240, 240, 240, ${this.opacity})`;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 1.5})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.lineTo(this.size, 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  const firefliesCount = 15;
  const fireflies = Array.from({ length: firefliesCount }, () => new Firefly());

  const dustCount = 20;
  const dust = Array.from({ length: dustCount }, () => new MagicalDust());

  const feathersCount = 3;
  const feathers = Array.from({ length: feathersCount }, () => new Feather());

  const smokeParticles = [];
  const shootingStars = Array.from({ length: 2 }, () => new ShootingStar());

  const isNightTime = () => {
    const hours = new Date().getHours();
    return hours < 6 || hours >= 18;
  };
  const activeBirds = Array.from({ length: 4 }, () => new Bird(isNightTime()));

  // Circling owls population for the castle awakening sequence
  const circlingOwls = [];
  window.triggerAwakeningOwls = () => {
    circlingOwls.length = 0;
    for (let i = 0; i < 3; i++) {
      circlingOwls.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.012,
        radiusX: 30 + Math.random() * 25,
        radiusY: 8 + Math.random() * 6,
        flapSpeed: 0.12 + Math.random() * 0.08,
        flap: Math.random() * 5
      });
    }
  };

  const castleWindows = document.querySelectorAll(".castle-window");
  setInterval(() => {
    if (document.hidden) return;
    castleWindows.forEach(win => {
      if (Math.random() < 0.15) {
        win.classList.toggle("active");
      }
    });
  }, 2200);

  let windJitter = 0;
  setInterval(() => {
    if (document.hidden) return;
    windJitter = (Math.random() - 0.5) * 8;
    document.documentElement.style.setProperty("--wind-tilt", `${windJitter}deg`);
  }, 80);

  function loop() {
    if (document.hidden) {
      requestAnimationFrame(loop);
      return;
    }
    ctx.clearRect(0, 0, width, height);

    const env = document.getElementById("envelope-area");
    const avoidRect = env ? env.getBoundingClientRect() : null;

    const mx = window.lastMouseX || width / 2;
    const my = window.lastMouseY || height / 2;

    shootingStars.forEach(s => {
      s.update();
      s.draw();
    });

    activeBirds.forEach(b => {
      b.update();
      b.draw();
    });

    if (window.castleZoomingActive) {
      const towerX = width * (300 / 800) + (window.lastMouseX - width/2) * -0.03;
      const towerY = height - (height * 0.15 * 1.65) + (40 / 400 * height * 0.15 * 1.65) - 32 + (window.lastMouseY - height/2) * -0.01;
      
      circlingOwls.forEach(o => {
        o.angle += o.speed;
        o.flap += o.flapSpeed;
        const ox = towerX + Math.cos(o.angle) * o.radiusX;
        const oy = towerY + Math.sin(o.angle) * o.radiusY;
        
        ctx.fillStyle = 'rgba(8, 12, 24, 0.55)';
        ctx.beginPath();
        ctx.ellipse(ox, oy, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(8, 12, 24, 0.45)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        const wingY = Math.sin(o.flap) * 4;
        ctx.moveTo(ox - 4, oy - wingY);
        ctx.quadraticCurveTo(ox - 2, oy - 2, ox, oy);
        ctx.quadraticCurveTo(ox + 2, oy - 2, ox + 4, oy - wingY);
        ctx.stroke();
      });
    }

    if (window.ceremonyConstellationActive) {
      const towerX = width / 2 + (window.lastMouseX - width/2) * -0.01;
      const towerY = height * 0.42 + (window.lastMouseY - height/2) * -0.01;
      
      const p = [
        { x: towerX + 0, y: towerY - 50 },
        { x: towerX + 22, y: towerY - 70 },
        { x: towerX + 44, y: towerY - 50 },
        { x: towerX + 32, y: towerY - 20 },
        { x: towerX + 0, y: towerY + 15 },
        { x: towerX - 32, y: towerY - 20 },
        { x: towerX - 44, y: towerY - 50 },
        { x: towerX - 22, y: towerY - 70 }
      ];

      // Draw faint connections
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length; i++) {
        ctx.lineTo(p[i].x, p[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw solid drawing path
      if (!window.constellationProgress) window.constellationProgress = 0;
      if (window.constellationProgress < 1.0) window.constellationProgress += 0.005;

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#ffd54f';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      
      const totalLen = p.length;
      const currentLimit = window.constellationProgress * totalLen;
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i <= totalLen; i++) {
        const pt = p[i % totalLen];
        const prev = p[i - 1];
        if (i <= currentLimit) {
          ctx.lineTo(pt.x, pt.y);
        } else {
          const rem = currentLimit - (i - 1);
          if (rem > 0) {
            const lx = prev.x + (pt.x - prev.x) * rem;
            const ly = prev.y + (pt.y - prev.y) * rem;
            ctx.lineTo(lx, ly);
          }
          break;
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Draw stars at vertices
      p.forEach((pt, idx) => {
        const starTimeLimit = window.constellationProgress * totalLen;
        if (idx <= starTimeLimit) {
          const pulse = 1.0 + Math.sin(Date.now() * 0.005 + idx) * 0.2;
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#ffd54f';
          ctx.shadowBlur = 10 * pulse;
          
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5 * pulse, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.shadowBlur = 0;
        }
      });
    }

    if (Math.random() < 0.08) {
      const castleX = width * (95 / 800);
      const castleY = height - (height * 0.15) + (170 / 400 * (height * 0.15));
      smokeParticles.push(new SmokeParticle(castleX, castleY));
    }
    if (Math.random() < 0.08) {
      const castleX = width * (300 / 800);
      const castleY = height - (height * 0.15) + (40 / 400 * (height * 0.15));
      smokeParticles.push(new SmokeParticle(castleX, castleY));
    }

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      const p = smokeParticles[i];
      p.update();
      p.draw();
      if (p.life <= 0 || p.y < 0) {
        smokeParticles.splice(i, 1);
      }
    }

    dust.forEach(d => {
      d.update();
      d.draw();
    });

    feathers.forEach(f => {
      f.update();
      f.draw();
    });

    fireflies.forEach(f => {
      f.update(mx, my, avoidRect);
      f.draw();
    });

    requestAnimationFrame(loop);
  }

  window.lastMouseX = width / 2;
  window.lastMouseY = height / 2;
  window.addEventListener("mousemove", (e) => {
    window.lastMouseX = e.clientX;
    window.lastMouseY = e.clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      window.lastMouseX = e.touches[0].clientX;
      window.lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  requestAnimationFrame(loop);
}

/* ── Cinematic Introduction Sequence ── */
let _cinematicActive = false;
let _windOscillatorNode = null;
let _windGainNode = null;
let _windAudioCtx = null;

function playOwlHoot() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  try {
    const ctx = new AudioContext();
    const playNode = (delay, dur, freqStart, freqEnd) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + delay + dur * 0.45);
      osc.frequency.exponentialRampToValueAtTime(freqStart * 0.88, ctx.currentTime + delay + dur);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + delay + dur * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    };
    
    // Far hollow hoot rhythm
    playNode(0, 0.48, 330, 350);
    playNode(0.6, 0.38, 310, 330);
    playNode(0.95, 0.52, 320, 340);
  } catch (e) {
    console.log("AudioContext blocked or unsupported:", e);
  }
}

function startWindAmbient() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    _windAudioCtx = ctx;

    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 0.07; // Slow cyclic wind rise and fall

    const oscGain = ctx.createGain();
    oscGain.gain.value = 200;

    filter.frequency.value = 420;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5); // Soft fade-in

    _windGainNode = gain;
    _windOscillatorNode = osc;

    osc.connect(oscGain);
    oscGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    noise.start();
  } catch (e) {
    console.log("Wind synth failed:", e);
  }
}

function stopWindAmbient() {
  if (_windGainNode && _windAudioCtx) {
    try {
      _windGainNode.gain.exponentialRampToValueAtTime(0.0001, _windAudioCtx.currentTime + 2.0);
    } catch (e) {}
  }
}

function startCinematicSequence() {
  _cinematicActive = true;
  
  const overlay = document.getElementById("cinematic-overlay");
  const canvas = document.getElementById("cinematic-canvas");
  const skipBtn = document.getElementById("skip-cinematic-btn");
  
  if (!overlay || !canvas) return;
  
  overlay.style.display = "block";
  overlay.style.opacity = "1";
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  
  window.addEventListener("resize", () => {
    if (!_cinematicActive) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }, { passive: true });

  // Start soundscapes
  startWindAmbient();
  setTimeout(() => {
    if (_cinematicActive) playOwlHoot();
  }, 2500);

  // Setup feather particles emitted by the owl
  const owlFeathers = [];

  class MiniFeather {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.4 - 0.2;
      this.vy = Math.random() * 0.3 + 0.2;
      this.size = Math.random() * 4 + 3;
      this.alpha = Math.random() * 0.3 + 0.2;
      this.angle = Math.random() * Math.PI;
    }
    update() {
      this.x += this.vx + Math.sin(this.y * 0.02) * 0.3;
      this.y += this.vy;
      this.angle += 0.01;
    }
    draw() {
      ctx.fillStyle = `rgba(220, 220, 220, ${this.alpha})`;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Cinematic timeline clock ticks
  let tick = 0;

  // Owl tracking details
  let owlX = -100;
  let owlY = h * 0.2;
  let owlScale = 1;
  let owlFlap = 0;

  // Falling envelope details
  let envX = 0;
  let envY = -200;
  let envAngle = 0;
  let envReleased = false;
  let envLanded = false;
  let envVy = 0;
  
  const targetX = w / 2;
  const targetY = h / 2 + 30;
  const envW = Math.min(260, w * 0.8);
  const envH = envW * (170 / 260);

  // Dust puff particles on landing
  const landingDust = [];

  function drawOwlSilhouette(x, y, scale, wingFlap, isRight) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(isRight ? scale : -scale, scale);
    
    ctx.fillStyle = 'rgba(8, 12, 24, 0.95)';
    // Head & Ears
    ctx.beginPath();
    ctx.arc(12, -6, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(15, -15);
    ctx.lineTo(17, -8);
    ctx.lineTo(11, -8);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flapping Wings
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const wingY = Math.sin(wingFlap) * 30;
    ctx.quadraticCurveTo(-10, -25, -28, wingY);
    ctx.quadraticCurveTo(-12, -4, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  function drawEnvelopeSilhouette(x, y, width, height, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Card shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-width / 2 + 5, -height / 2 + 5, width, height);

    // Parchment base
    ctx.fillStyle = '#ebdeb7';
    ctx.strokeStyle = '#cbbb93';
    ctx.lineWidth = 2;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    // Flaps folding lines
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height / 2);
    ctx.lineTo(0, 0);
    ctx.lineTo(width / 2, -height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-width / 2, height / 2);
    ctx.lineTo(-width / 6, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 6, 0);
    ctx.stroke();

    // Wax seal circle
    ctx.fillStyle = '#a61c1c';
    ctx.beginPath();
    ctx.arc(0, -2, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function tickCinematic() {
    if (!_cinematicActive) return;

    ctx.clearRect(0, 0, w, h);
    tick++;

    // Draw dark night sky background
    ctx.fillStyle = '#060812';
    ctx.fillRect(0, 0, w, h);

    // Draw the moon in the top right
    const moonRadius = 45;
    const moonX = w * 0.75;
    const moonY = h * 0.22;
    
    ctx.beginPath();
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 4);
    moonGlow.addColorStop(0, 'rgba(255, 255, 240, 0.22)');
    moonGlow.addColorStop(0.3, 'rgba(255, 255, 240, 0.06)');
    moonGlow.addColorStop(1, 'rgba(255, 255, 240, 0)');
    ctx.fillStyle = moonGlow;
    ctx.arc(moonX, moonY, moonRadius * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 245, 0.88)';
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Distant castle silhouette (faintly visible)
    ctx.fillStyle = 'rgba(10, 15, 30, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h - 80);
    ctx.lineTo(w * 0.1, h - 80);
    ctx.lineTo(w * 0.13, h - 140);
    ctx.lineTo(w * 0.16, h - 80);
    ctx.lineTo(w * 0.35, h - 80);
    ctx.lineTo(w * 0.38, h - 220);
    ctx.lineTo(w * 0.4, h - 80);
    ctx.lineTo(w * 0.65, h - 80);
    ctx.lineTo(w * 0.68, h - 170);
    ctx.lineTo(w * 0.72, h - 80);
    ctx.lineTo(w, h - 80);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // ── Transition Timeline Stages ──

    // Stage 1 & 2: Owl slowly flies across the moon
    if (tick < 500) {
      owlScale = 0.4;
      owlFlap += 0.12;
      owlX = moonX + 220 - (tick * 0.7);
      owlY = moonY - 30 + Math.sin(tick * 0.04) * 15;
      drawOwlSilhouette(owlX, owlY, owlScale, owlFlap, false);

      // Spawn drifting feathers
      if (Math.random() < 0.08) {
        owlFeathers.push(new MiniFeather(owlX, owlY));
      }
    }
    // Stage 3: Owl approaches viewer, scaling up and sweeping close
    else if (tick >= 500 && tick < 780) {
      const prog = (tick - 500) / 280; // 0 to 1
      owlScale = 0.4 + prog * 1.6;
      owlFlap += 0.18;
      
      // Sweep in a circular arc towards the center
      const sweepAngle = Math.PI * 1.5 - prog * Math.PI;
      owlX = w / 2 + Math.cos(sweepAngle) * (w * 0.35 * (1 - prog * 0.5));
      owlY = h / 2 - 100 + Math.sin(sweepAngle) * (h * 0.22);
      
      drawOwlSilhouette(owlX, owlY, owlScale, owlFlap, true);

      if (Math.random() < 0.12) {
        owlFeathers.push(new MiniFeather(owlX, owlY));
      }
    }
    // Stage 4: Owl releases envelope, flies away
    else if (tick >= 780 && !envLanded) {
      if (!envReleased) {
        envReleased = true;
        envX = owlX;
        envY = owlY;
        envAngle = 0.2;
      }

      // Owl flies off into the top left distance
      const owlProg = (tick - 780);
      owlFlap += 0.2;
      owlX -= 3.2;
      owlY -= 0.6;
      owlScale = Math.max(0.3, 2.0 - owlProg * 0.02);
      drawOwlSilhouette(owlX, owlY, owlScale, owlFlap, false);

      // Envelope falls with gravity physics
      envVy += 0.18;
      envY += envVy;
      
      // Horizontal drift LERP to center landing coords
      envX += (targetX - envX) * 0.06;
      envAngle += Math.sin(tick * 0.06) * 0.015;

      // Detect Landing collision
      if (envY >= targetY) {
        envY = targetY;
        envLanded = true;
        
        // Spawn radial dust landing puff
        for (let i = 0; i < 30; i++) {
          const dustAng = Math.random() * Math.PI * 2;
          const dustSp = Math.random() * 3 + 1.5;
          landingDust.push({
            x: envX,
            y: envY + 20,
            vx: Math.cos(dustAng) * dustSp,
            vy: Math.sin(dustAng) * dustSp * 0.4 - 0.5,
            size: Math.random() * 3 + 1.5,
            alpha: Math.random() * 0.55 + 0.3
          });
        }

        // Play unseal snapping feedback crack sound
        playCrackSound();

        // Initiate fade-out exit sequence
        setTimeout(() => {
          endCinematic();
        }, 1600);
      }

      drawEnvelopeSilhouette(envX, envY, envW, envH, envAngle);
    }
    // Stage 5: Envelope landed, showing seal glow pulse
    else if (envLanded) {
      drawEnvelopeSilhouette(envX, envY, envW, envH, envAngle);

      // Pulse a gold ring centered on the wax seal
      const pulseProg = (tick % 60) / 60; // 0 to 1
      ctx.strokeStyle = `rgba(212, 175, 55, ${1 - pulseProg})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(envX, envY, 15 + pulseProg * 45, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Update & draw feathers
    for (let i = owlFeathers.length - 1; i >= 0; i--) {
      const f = owlFeathers[i];
      f.update();
      f.draw();
      if (f.y > h + 20) {
        owlFeathers.splice(i, 1);
      }
    }

    // Update & draw landing dust
    landingDust.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.08; // fall back down
      d.alpha -= 0.015;
      if (d.alpha > 0) {
        ctx.fillStyle = `rgba(212, 185, 140, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(tickCinematic);
  }

  // Enable click/touch-to-skip gesture anywhere on overlay
  overlay.addEventListener("click", () => {
    endCinematic();
  }, { once: true });

  skipBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    endCinematic();
  }, { once: true });

  // Run tick loop
  requestAnimationFrame(tickCinematic);
}

function endCinematic() {
  if (!_cinematicActive) return;
  _cinematicActive = false;

  stopWindAmbient();

  const overlay = document.getElementById("cinematic-overlay");
  const envArea = document.getElementById("envelope-area");
  const wrapper = document.getElementById("envelope-wrapper");

  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.remove();
    }, 1800);
  }

  if (envArea) {
    envArea.style.opacity = "1";
    envArea.classList.add("envelope-pulse-highlight");
  }
  if (wrapper) {
    wrapper.style.pointerEvents = "auto";
  }
}

/* ── Castle Awakening Cinematic Sequence ── */
let _choirOscillators = [];
let _choirGainNode = null;
let _choirAudioCtx = null;

function playCastleBell() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    const freqs = [105, 212, 324.5, 480, 680];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      
      // Detuned physical vibration decay
      osc.frequency.linearRampToValueAtTime(f * 0.985, ctx.currentTime + 5.5);

      const oscGain = ctx.createGain();
      oscGain.gain.value = i === 0 ? 0.08 : 0.035;

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      osc.stop(ctx.currentTime + 6.0);
    });

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.05);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.8);

    filter.connect(mainGain);
    mainGain.connect(ctx.destination);
  } catch (e) {
    console.log("Bell synth failed:", e);
  }
}

function startChoirDrone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    _choirAudioCtx = ctx;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 3.0); // Soft swelling fade-in

    _choirGainNode = gain;
    _choirOscillators = [];

    // Detuned perfect fifth chord drone (A3 + E4 + A4)
    const chords = [220, 221.4, 330, 440];
    chords.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(filter);
      osc.start();
      _choirOscillators.push(osc);
    });

    filter.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {
    console.log("Choir synth failed:", e);
  }
}

function stopChoirDrone() {
  if (_choirGainNode && _choirAudioCtx) {
    try {
      _choirGainNode.gain.exponentialRampToValueAtTime(0.0001, _choirAudioCtx.currentTime + 2.5);
      setTimeout(() => {
        _choirOscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        _choirOscillators = [];
      }, 2600);
    } catch (e) {}
  }
}

function startCastleAwakeningSequence(msgEl, msg, sigEl) {
  const paper = document.getElementById("scroll-paper");
  const closeBtn = document.getElementById("scroll-close");
  const castleWrapper = document.getElementById("ambient-castle-wrapper");
  const flames = document.querySelectorAll(".candle-flame");
  const windows = [".cw1", ".cw2", ".cw3", ".cw4", ".cw5", ".cw6"];

  if (!paper) {
    // Fail-safe fallbacks
    revealHogwartsLetter(msgEl, msg, sigEl);
    return;
  }

  // 1. Temporarily dim scroll sheet and hide close button
  paper.classList.add("cinematic-dim");
  if (closeBtn) closeBtn.style.display = "none";

  // 2. Trigger slow camera zoom towards distant castle silhouette
  if (castleWrapper) castleWrapper.classList.add("zoomed-in");

  // 3. Fade down background soundtrack volume
  if (window.bgMusic) {
    window.bgMusic.volume = 0.05;
  }

  // 4. Play cathedral bell and start soft choir drone pads
  playCastleBell();
  startChoirDrone();

  // 5. Ignite Great Hall candles sequentially
  flames.forEach((flame, idx) => {
    setTimeout(() => {
      flame.style.opacity = "1";
    }, 1500 + idx * 1200);
  });

  // 6. Turn on castle window lights one by one
  windows.forEach((winCls, idx) => {
    setTimeout(() => {
      const winEl = document.querySelector(winCls);
      if (winEl) winEl.classList.add("active");
    }, 2000 + idx * 1400);
  });

  // 7. Spawn circling owls around castle tower on ambient canvas
  window.castleZoomingActive = true;
  if (typeof window.triggerAwakeningOwls === "function") {
    window.triggerAwakeningOwls();
  }

  // 8. Restore normal interface reading state after 12 seconds
  setTimeout(() => {
    if (castleWrapper) castleWrapper.classList.remove("zoomed-in");
    if (paper) paper.classList.remove("cinematic-dim");
    if (closeBtn) closeBtn.style.display = "block";
    
    stopChoirDrone();
    if (window.bgMusic) {
      window.bgMusic.volume = 0.5; // restore original volume
    }

    window.castleZoomingActive = false;

    // Proceed to text letter rendering typewriter sequence
    revealHogwartsLetter(msgEl, msg, sigEl);
  }, 12500);
}

/* ── Birthday Wish Ceremony ── */
function playWishChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    const filter = ctx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = 1200;
    filter.Q.value = 1.5;
    filter.gain.value = 6;

    // Peaceful crystal glass harp arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.22;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(startTime);
      osc.stop(startTime + 2.6);
    });

    filter.connect(ctx.destination);
  } catch (e) {
    console.log("Chime synth failed:", e);
  }
}

function startWishCeremony() {
  const overlayText = document.getElementById("ceremony-text-container");
  const textContent = document.getElementById("ceremony-text-content");
  const moonBeam = document.getElementById("moon-beam");
  const candles = document.querySelectorAll(".ambient-candle");

  if (!overlayText || !textContent) return;

  // 1. Enter ceremony mode (fades out landing UI, slows fog/clouds, brightens moon)
  document.body.classList.add("ceremony-active");
  overlayText.classList.remove("hidden");
  overlayText.style.opacity = "1";

  // 2. Slow fade out background music soundtrack
  if (window.bgMusic) {
    let vol = window.bgMusic.volume;
    const fade = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0.02) {
        window.bgMusic.volume = 0;
        window.bgMusic.pause();
        clearInterval(fade);
      } else {
        window.bgMusic.volume = vol;
      }
    }, 60);
  }

  // 3. Move floating candles slowly into a glowing circle above the castle
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.42;
  const R = Math.min(window.innerWidth, window.innerHeight) * 0.18;

  candles.forEach((candle, idx) => {
    const angle = (idx / candles.length) * Math.PI * 2;
    const tx = cx + Math.cos(angle) * R - 2;
    const ty = cy + Math.sin(angle) * R - 12;

    candle.style.transition = "left 6.5s cubic-bezier(0.25, 1, 0.5, 1), top 6.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 3s ease";
    candle.style.left = `${tx}px`;
    candle.style.top = `${ty}px`;
    candle.style.animation = "none";
  });

  // 4. Peaceful Text Prompts Sequence
  const prompts = [
    { text: "Before you leave...", delay: 2000, duration: 4000 },
    { text: "Close your eyes...", delay: 7500, duration: 4000 },
    { text: "Make one wish.", delay: 13000, duration: -1 } // stays visible until tapped
  ];

  prompts.forEach(p => {
    setTimeout(() => {
      textContent.textContent = p.text;
      textContent.classList.add("visible");

      if (p.duration > 0) {
        setTimeout(() => {
          textContent.classList.remove("visible");
        }, p.duration);
      } else {
        // Unlock click-to-wish interaction once the final prompt settles
        setTimeout(() => {
          overlayText.classList.add("active");
        }, 1200);
      }
    }, p.delay);
  });

  // 5. Handle Click/Touch to Wish
  function handleWishTap(e) {
    e.preventDefault();
    e.stopPropagation();

    // Disable multiple taps
    overlayText.classList.remove("active");
    overlayText.removeEventListener("click", handleWishTap);
    overlayText.removeEventListener("touchend", handleWishTap);

    // Fade out text prompt
    textContent.classList.remove("visible");

    // Synthesize peaceful crystal arpeggio
    playWishChime();

    // Fade in vertical moon beam of light
    if (moonBeam) moonBeam.classList.add("active");

    // Brighten candle flames
    document.body.classList.add("ceremony-tapped");

    // Animate golden star constellation above castle
    window.constellationProgress = 0;
    window.ceremonyConstellationActive = true;

    // Spawn peaceful slowly rising golden particles from bottom of viewport
    if (window.spawnSparkCluster) {
      for (let i = 0; i < 90; i++) {
        setTimeout(() => {
          const rx = Math.random() * window.innerWidth;
          const ry = window.innerHeight - 30 - Math.random() * 50;
          window.spawnSparkCluster(rx, ry, 1, false);
        }, i * 35);
      }
    }

    // 6. Resolution & Return to normal card layout after 8 seconds
    setTimeout(() => {
      if (moonBeam) moonBeam.classList.remove("active");
      window.ceremonyConstellationActive = false;

      // Smoothly fade out ceremony overlay
      overlayText.style.opacity = "0";

      setTimeout(() => {
        overlayText.classList.add("hidden");
        document.body.classList.remove("ceremony-active", "ceremony-tapped");

        // Restore floating candles to original layout
        candles.forEach(candle => {
          candle.style.left = "";
          candle.style.top = "";
          candle.style.animation = "";
          candle.style.transition = "";
        });

        // Fade soundtrack background music back in
        if (window.bgMusic) {
          window.bgMusic.play().then(() => {
            let vol = 0;
            const fadeIn = setInterval(() => {
              vol += 0.05;
              if (vol >= 0.5) {
                window.bgMusic.volume = 0.5;
                clearInterval(fadeIn);
              } else {
                window.bgMusic.volume = vol;
              }
            }, 60);
          }).catch(() => {});
        }
      }, 2000);

    }, 8500);
  }

  overlayText.addEventListener("click", handleWishTap);
  overlayText.addEventListener("touchend", handleWishTap);
}


