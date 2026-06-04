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

/* ── Procedural Web Audio Synthesis: House-Specific Ambient Soundscapes ── */
let ambientContext = null;
let ambientNodes = [];
let ambientInterval = null;
let ambientCleanupTimeoutId = null;

function startAmbientWaves() {
  startHouseAmbience(_currentHouse);
}

function stopAmbientWaves() {
  stopHouseAmbience();
}

function startHouseAmbience(house) {
  stopHouseAmbience();
  if (ambientCleanupTimeoutId) {
    clearTimeout(ambientCleanupTimeoutId);
    ambientCleanupTimeoutId = null;
  }
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    ambientContext = new AudioContextClass();
    
    const h = (house || 'gryffindor').toLowerCase();
    
    // Main output gain node
    const mainGain = ambientContext.createGain();
    mainGain.gain.setValueAtTime(0, ambientContext.currentTime);
    mainGain.connect(ambientContext.destination);
    
    // Smooth fade in to prevent clicks
    mainGain.gain.linearRampToValueAtTime(0.35, ambientContext.currentTime + 2.0);
    ambientNodes.push(mainGain);
    
    if (h === 'gryffindor') {
      // 1. Gryffindor: Crackling fireplace (low rumble + random pops)
      const bufferSize = ambientContext.sampleRate * 2;
      const buffer = ambientContext.createBuffer(1, bufferSize, ambientContext.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.015 * white)) / 1.015;
        lastOut = data[i];
        data[i] *= 4.0;
      }
      
      const rumbleSrc = ambientContext.createBufferSource();
      rumbleSrc.buffer = buffer;
      rumbleSrc.loop = true;
      
      const lp = ambientContext.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(95, ambientContext.currentTime);
      
      rumbleSrc.connect(lp);
      lp.connect(mainGain);
      rumbleSrc.start(0);
      ambientNodes.push(rumbleSrc);
      
      // Fire crackle generator
      ambientInterval = setInterval(() => {
        if (!ambientContext || ambientContext.state === "suspended") return;
        
        if (Math.random() < 0.28) {
          const crackle = ambientContext.createOscillator();
          const crackleGain = ambientContext.createGain();
          
          crackle.type = "triangle";
          crackle.frequency.setValueAtTime(700 + Math.random() * 1400, ambientContext.currentTime);
          
          crackleGain.gain.setValueAtTime(0.06 * Math.random(), ambientContext.currentTime);
          crackleGain.gain.exponentialRampToValueAtTime(0.001, ambientContext.currentTime + 0.005 + Math.random() * 0.02);
          
          crackle.connect(crackleGain);
          crackleGain.connect(mainGain);
          crackle.start(0);
          crackle.stop(ambientContext.currentTime + 0.05);
        }
      }, 55);
      
    } else if (h === 'slytherin') {
      // 2. Slytherin: Deep dungeon echoes (low drone + cave water drips)
      const osc1 = ambientContext.createOscillator();
      const osc2 = ambientContext.createOscillator();
      const droneGain = ambientContext.createGain();
      
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ambientContext.currentTime); // A1 note
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110.3, ambientContext.currentTime); // detuned octave
      
      droneGain.gain.setValueAtTime(0.2, ambientContext.currentTime);
      
      // Modulate drone volume for organic pulsing
      const droneLfo = ambientContext.createOscillator();
      const lfoGain = ambientContext.createGain();
      droneLfo.frequency.setValueAtTime(0.07, ambientContext.currentTime);
      lfoGain.gain.setValueAtTime(0.06, ambientContext.currentTime);
      droneLfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      
      osc1.connect(droneGain);
      osc2.connect(droneGain);
      droneGain.connect(mainGain);
      
      osc1.start(0);
      osc2.start(0);
      droneLfo.start(0);
      ambientNodes.push(osc1, osc2, droneLfo);
      
      // Water drips echo generator
      ambientInterval = setInterval(() => {
        if (!ambientContext || ambientContext.state === "suspended") return;
        
        if (Math.random() < 0.22) {
          const dripOsc = ambientContext.createOscillator();
          const dripGain = ambientContext.createGain();
          const delay = ambientContext.createDelay();
          const feedback = ambientContext.createGain();
          
          dripOsc.type = "sine";
          const now = ambientContext.currentTime;
          dripOsc.frequency.setValueAtTime(650, now);
          dripOsc.frequency.exponentialRampToValueAtTime(1450, now + 0.06);
          
          dripGain.gain.setValueAtTime(0.0, now);
          dripGain.gain.linearRampToValueAtTime(0.09, now + 0.01);
          dripGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          
          delay.delayTime.setValueAtTime(0.38, now);
          feedback.gain.setValueAtTime(0.58, now);
          
          dripOsc.connect(dripGain);
          dripGain.connect(mainGain);
          
          // Feedback Delay loop
          dripGain.connect(delay);
          delay.connect(feedback);
          feedback.connect(delay);
          delay.connect(mainGain);
          
          dripOsc.start(now);
          dripOsc.stop(now + 1.8);
        }
      }, 2200);
      
    } else if (h === 'ravenclaw') {
      // 3. Ravenclaw: Windy towers (howling wind noise filter + celestial chimes)
      const bufferSize = ambientContext.sampleRate * 3;
      const buffer = ambientContext.createBuffer(1, bufferSize, ambientContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ambientContext.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      const filter = ambientContext.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.setValueAtTime(2.2, ambientContext.currentTime);
      filter.frequency.setValueAtTime(380, ambientContext.currentTime);
      
      const windLfo = ambientContext.createOscillator();
      const lfoGain = ambientContext.createGain();
      windLfo.frequency.setValueAtTime(0.06, ambientContext.currentTime);
      lfoGain.gain.setValueAtTime(190, ambientContext.currentTime);
      
      windLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      noise.connect(filter);
      filter.connect(mainGain);
      
      noise.start(0);
      windLfo.start(0);
      ambientNodes.push(noise, windLfo);
      
      // Astronomy Tower chimes
      ambientInterval = setInterval(() => {
        if (!ambientContext || ambientContext.state === "suspended") return;
        
        if (Math.random() < 0.16) {
          const chime = ambientContext.createOscillator();
          const chimeGain = ambientContext.createGain();
          chime.type = "sine";
          chime.frequency.setValueAtTime(1800 + Math.random() * 1100, ambientContext.currentTime);
          
          const now = ambientContext.currentTime;
          chimeGain.gain.setValueAtTime(0.025, now);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
          
          chime.connect(chimeGain);
          chimeGain.connect(mainGain);
          chime.start(now);
          chime.stop(now + 2.0);
        }
      }, 3500);
      
    } else if (h === 'hufflepuff') {
      // 4. Hufflepuff: Sunny meadows (ambient pink noise breeze + buzzing bees)
      const bufferSize = ambientContext.sampleRate * 2.5;
      const buffer = ambientContext.createBuffer(1, bufferSize, ambientContext.sampleRate);
      const data = buffer.getChannelData(0);
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        data[i] *= 0.04;
      }
      
      const noise = ambientContext.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      const lp = ambientContext.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(220, ambientContext.currentTime);
      
      noise.connect(lp);
      lp.connect(mainGain);
      noise.start(0);
      ambientNodes.push(noise);
      
      // Bumblebee stereophonic pan flying paths
      ambientInterval = setInterval(() => {
        if (!ambientContext || ambientContext.state === "suspended") return;
        
        if (Math.random() < 0.22) {
          const bee = ambientContext.createOscillator();
          const beeGain = ambientContext.createGain();
          const panner = ambientContext.createStereoPanner ? ambientContext.createStereoPanner() : null;
          
          bee.type = "sawtooth";
          bee.frequency.setValueAtTime(170 + Math.random() * 50, ambientContext.currentTime);
          
          const flutter = ambientContext.createOscillator();
          const flutterGain = ambientContext.createGain();
          flutter.frequency.setValueAtTime(32, ambientContext.currentTime); // wing flapping frequency
          flutterGain.gain.setValueAtTime(0.5, ambientContext.currentTime);
          
          flutter.connect(flutterGain);
          
          const now = ambientContext.currentTime;
          beeGain.gain.setValueAtTime(0, now);
          beeGain.gain.linearRampToValueAtTime(0.035, now + 0.4);
          beeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
          
          if (panner) {
            const startPan = Math.random() < 0.5 ? -1 : 1;
            panner.pan.setValueAtTime(startPan, now);
            panner.pan.linearRampToValueAtTime(-startPan, now + 2.8);
            
            bee.connect(beeGain);
            beeGain.connect(panner);
            panner.connect(mainGain);
          } else {
            bee.connect(beeGain);
            beeGain.connect(mainGain);
          }
          
          bee.start(now);
          flutter.start(now);
          bee.stop(now + 3.0);
          flutter.stop(now + 3.0);
        }
      }, 3000);
    }
  } catch (e) {
    // Fail silently in case browser policy restricts AudioContext creation
  }
}

function stopHouseAmbience() {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  
  const currentNodes = [...ambientNodes];
  ambientNodes = [];
  const ctx = ambientContext;
  ambientContext = null;
  
  if (ctx) {
    try {
      const now = ctx.currentTime;
      if (currentNodes.length > 0) {
        const mainGain = currentNodes[0];
        mainGain.gain.cancelScheduledValues(now);
        mainGain.gain.linearRampToValueAtTime(0, now + 0.8);
      }
      
      ambientCleanupTimeoutId = setTimeout(() => {
        currentNodes.forEach(node => {
          try {
            node.stop();
            node.disconnect();
          } catch(e) {}
        });
        try {
          ctx.close();
        } catch(e) {}
        ambientCleanupTimeoutId = null;
      }, 950);
    } catch(e) {
      ambientContext = null;
    }
  }
}

/* ── Paragraph-Aware Stagger Reveal & Drop Cap ── */
function _injectDropCapAndRender(el, text) {
  if (!el || !text) return;
  el.innerHTML = '';

  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  const dropCapParaIdx = paragraphs.length > 1 ? 1 : 0;

  paragraphs.forEach((para, pIdx) => {
    const pEl = document.createElement('p');

    // Right-align the closing and signature lines at the end of the letter
    if (pIdx === paragraphs.length - 1) {
      pEl.style.textAlign = 'right';
      pEl.style.marginTop = '1.2em';
      pEl.style.fontStyle = 'italic';
      pEl.style.paddingRight = '5%';
      pEl.textContent = para;
      el.appendChild(pEl);
      return;
    } else if (pIdx === paragraphs.length - 2 && para.trim().startsWith('With') && para.length < 80) {
      pEl.style.textAlign = 'right';
      pEl.style.fontStyle = 'italic';
      pEl.style.paddingRight = '5%';
      pEl.textContent = para;
      el.appendChild(pEl);
      return;
    }

    // Apply drop cap to the first body paragraph
    if (pIdx === dropCapParaIdx) {
      const words = para.split(/\s+/).filter(Boolean);
      if (words[0] && words[0].length > 0) {
        const capEl = document.createElement('span');
        capEl.className = 'drop-cap';
        capEl.textContent = words[0][0];
        pEl.appendChild(capEl);

        const restOfFirst = words[0].slice(1);
        if (restOfFirst) {
          const rSpan = document.createElement('span');
          rSpan.textContent = restOfFirst;
          pEl.appendChild(rSpan);
        }

        if (words.length > 1) {
          pEl.appendChild(document.createTextNode(' '));
        }

        for (let i = 1; i < words.length; i++) {
          pEl.appendChild(document.createTextNode(words[i] + (i < words.length - 1 ? ' ' : '')));
        }
      }
    } else {
      pEl.textContent = para;
    }

    el.appendChild(pEl);
  });
}

function revealHogwartsLetter(msgEl, text, sigEl) {
  if (!msgEl) return;
  
  // Re-trigger fade-in animation by removing and adding class/animation
  msgEl.style.animation = 'none';
  void msgEl.offsetHeight; // trigger reflow
  msgEl.style.animation = 'letterFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';

  // Render letter text immediately with drop cap
  _injectDropCapAndRender(msgEl, text || '');

  // Hide duplicate signature element
  if (sigEl) {
    sigEl.style.display = 'none';
  }

  // Reset scroll position to top
  const inner = document.getElementById('scroll-inner');
  if (inner) {
    inner.scrollTop = 0;
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
      p.vx = vx; 
      p.vy = vy;
      p.life = rand(1.5, 2.5); 
      p.age = 0;
      p.size = rand(8, 14); 
      p.color = isLumos ? '#FFF3CD' : palette.spark;
      p.rotation = rand(0, Math.PI * 2); 
      p.spin = rand(-0.12, 0.12);
    }
    if (typeof startLoop === 'function') {
      startLoop();
    }
  }

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

  let isLoopRunning = false;
  function startLoop() {
    if (isLoopRunning) return;
    isLoopRunning = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
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
    startLoop();
  });

  // Removed global click and touch spark spawn animations to optimize Android/mobile scrolling performance

  let lastTime = 0;
  let rafId = null;

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!IS_MOBILE || window.isLumosActive) {
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

    if (activeCount === 0 && (IS_MOBILE || !document.hasFocus()) && !window.isLumosActive) {
      isLoopRunning = false;
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(loop);
  }

  if (!IS_MOBILE) {
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
        if (addrName) addrName.textContent = "Vanshika Singh";
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
    
    if (opened) {
      overlay.classList.add("open");
      startAmbientWaves();
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

    if (window.navigator && typeof window.navigator.vibrate === "function") {
      try {
        window.navigator.vibrate([50, 30, 50]);
      } catch (err) {}
    }

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
      startAmbientWaves();

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
        msg = c2.eyesOnlyMessage || "Dear Vanshika, Happy Birthday!";
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

      setTimeout(() => revealHogwartsLetter(msgEl, msg, sigEl), 200);
    }, 450);
  }

  function closeModal() {
    overlay.classList.remove("open");
    stopAmbientWaves();
    if (paper) paper.classList.remove("unfolded");
    
    // Handle sequential letter morphing
    const isPersonal = envelope.classList.contains("eyes-only");
    if (!isPersonal && !firstLetterRead) {
      firstLetterRead = true;
      triggerEnvelopeMorph();
    } else if (isPersonal && !secondLetterRead) {
      secondLetterRead = true;
    }
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
    { id: activeVideoId, url: activeVideoUrl },
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

    if (footstepInterval) {
      clearInterval(footstepInterval);
      footstepInterval = null;
    }

    const progressBar = document.getElementById("loading-progress-bar");
    const percentageLabel = document.getElementById("loading-percentage");
    const statusLabel = document.getElementById("loading-status");
    const subtitle = document.getElementById("loading-subtitle");

    if (progressBar) progressBar.style.width = "100%";
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
        }, 800);
      } else {
        initializeMainApp();
      }
    }, 950);
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

/* ============================================================
   💡 LUMOS SPELL INTERACTION & EASTER EGG
   ============================================================ */
let typedKeys = "";
let lumosActive = false;
let lumosVignette = null;
let lumosGlow = null;

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
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
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
    
    setTimeout(() => {
      try { ctx.close(); } catch(e) {}
    }, 1100);
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
      lumosVignette.classList.remove("active");
      lumosGlow.classList.remove("active");
      
      const v = lumosVignette;
      const g = lumosGlow;
      setTimeout(() => {
        v.remove();
        g.remove();
      }, 800);
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
  toast.textContent = text;
  toast.className = "show";
  setTimeout(() => {
    if (toast.textContent === text) {
      toast.className = "";
    }
  }, 2200);
}

// Global keystroke listener to unlock Easter egg
document.addEventListener("keydown", (e) => {
  if (e.key && e.key.length === 1) {
    typedKeys += e.key.toLowerCase();
    typedKeys = typedKeys.slice(-12);
    
    if (typedKeys.endsWith("lumos")) {
      toggleLumosSpell(true);
    } else if (typedKeys.endsWith("nox")) {
      toggleLumosSpell(false);
    }
  }
});

/* ── DOM Init ── */
document.addEventListener("DOMContentLoaded", () => {
  startPreloader();
});
