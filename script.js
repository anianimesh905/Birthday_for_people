/* ============================================================
   BIRTHDAY — Sealed Envelope — Script
   ============================================================ */

/* ── --vh fix (Android address bar lock) ── */
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`,
  );
}
setVh();
window.addEventListener("orientationchange", () => setTimeout(setVh, 300));

/* ════════════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof BIRTHDAY_CONTENT !== "undefined") {
    const c = BIRTHDAY_CONTENT;
    document.getElementById("friend-name").textContent = c.friendName;
    document.getElementById("birthday-date").textContent = c.birthdayDate;
    document.getElementById("tagline").textContent = c.tagline;
    document.getElementById("scroll-title").textContent =
      `Happy Birthday, ${c.friendName}! 🎂`;
    document.getElementById("scroll-signature").textContent = c.senderName;
    window._bdMsg = c.message;

    initThemeSwitcher();

    if (c.musicFile) setupMusic(c.musicFile, c.musicLabel);
    else document.getElementById("music-btn").style.display = "none";
  }

  initEnvelope();
  initScrollReveal();
  initParallax();
  initSwipeDismiss();
  initSparkleTrail();

  // Prevent context menu on long-press (Android)
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Prevent double-tap zoom
  let lastTap = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTap < 300) e.preventDefault();
      lastTap = now;
    },
    { passive: false },
  );
});

/* ══════════════════════════════════════════
   THEME MANAGER & SWITCHER (4-Phase)
   ══════════════════════════════════════════ */
const THEME_CONFIG = {
  morning: { video: 'morningVideo', color: 'morningFallbackColor', name: 'morning' },
  afternoon: { video: 'afternoonVideo', color: 'afternoonFallbackColor', name: 'afternoon' },
  sunset: { video: 'sunsetVideo', color: 'sunsetFallbackColor', name: 'sunset' },
  night: { video: 'nightVideo', color: 'nightFallbackColor', name: 'night' }
};

let currentTheme = null;
let activeVideo = null;
let bufferVideo = null;

function initThemeSwitcher() {
  const panel = document.getElementById("theme-switcher-panel");
  const buttons = document.querySelectorAll(".theme-btn");
  
  // Set up the primary video element
  activeVideo = document.getElementById("bg-video");
  if (!activeVideo) return;
  activeVideo.classList.add("bg-video");
  
  // Create buffer video element dynamically for smooth cross-fading
  bufferVideo = document.createElement("video");
  bufferVideo.className = "bg-video";
  bufferVideo.muted = true;
  bufferVideo.loop = true;
  bufferVideo.playsInline = true;
  bufferVideo.setAttribute("playsinline", "");
  bufferVideo.setAttribute("disablePictureInPicture", "");
  bufferVideo.setAttribute("disableRemotePlayback", "");
  bufferVideo.setAttribute("x-webkit-airplay", "deny");
  bufferVideo.style.opacity = "0";
  activeVideo.parentNode.insertBefore(bufferVideo, activeVideo.nextSibling);

  // Determine initial theme based on local hour
  const hour = new Date().getHours();
  let initialTheme = "sunset"; // default
  if (hour >= 6 && hour < 12) initialTheme = "morning";
  else if (hour >= 12 && hour < 17) initialTheme = "afternoon";
  else if (hour >= 17 && hour < 20) initialTheme = "sunset";
  else initialTheme = "night";

  // Activate initial theme
  setTheme(initialTheme);

  // Bind click & touch events to theme buttons
  buttons.forEach(btn => {
    const themeName = btn.getAttribute("data-theme");
    btn.addEventListener("click", () => setTheme(themeName));
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setTheme(themeName);
    });
  });
}

function setTheme(themeName) {
  if (currentTheme === themeName) return;
  
  const oldTheme = currentTheme;
  currentTheme = themeName;

  const paper = document.getElementById("scroll-paper");
  if (paper) {
    paper.classList.remove("theme-morning", "theme-afternoon", "theme-sunset", "theme-night");
    paper.classList.add(`theme-${themeName}`);
  }
  
  // Update button active states in panel
  const buttons = document.querySelectorAll(".theme-btn");
  buttons.forEach(btn => {
    const btnTheme = btn.getAttribute("data-theme");
    if (btnTheme === themeName) {
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-checked", "false");
    }
  });

  const c = BIRTHDAY_CONTENT;
  const config = THEME_CONFIG[themeName];
  if (!config) return;

  const videoFile = c[config.video];
  const fallbackColor = c[config.color] || "#0d1b2a";

  // Transition the fallback background color immediately
  document.body.style.background = fallbackColor;

  if (!videoFile) {
    activeVideo.style.opacity = "0";
    bufferVideo.style.opacity = "0";
    return;
  }

  // Handle first load vs subsequent cross-fading
  if (!oldTheme) {
    activeVideo.src = videoFile;
    activeVideo.load();
    activeVideo.oncanplay = () => {
      activeVideo.oncanplay = null;
      activeVideo.play().then(() => {
        activeVideo.classList.add("loaded");
        activeVideo.style.opacity = "1";
      }).catch(err => {
        console.warn("Initial play failed, falling back to gradient:", err);
      });
    };
    return;
  }

  // Setup buffer video to load the new theme video
  bufferVideo.src = videoFile;
  bufferVideo.load();
  
  const playBuffer = () => {
    bufferVideo.play().then(() => {
      bufferVideo.classList.add("loaded");
      // Cross-fade opacity
      bufferVideo.style.opacity = "1";
      activeVideo.style.opacity = "0";

      // Swap the active and buffer references after transition (1.5s as in CSS)
      setTimeout(() => {
        activeVideo.pause();
        const temp = activeVideo;
        activeVideo = bufferVideo;
        bufferVideo = temp;
      }, 1500);
    }).catch(err => {
      console.warn("Buffer play failed:", err);
      // Fallback: Swap instantly
      bufferVideo.classList.add("loaded");
      bufferVideo.style.opacity = "1";
      activeVideo.style.opacity = "0";
      activeVideo.pause();
      const temp = activeVideo;
      activeVideo = bufferVideo;
      bufferVideo = temp;
    });
  };

  bufferVideo.oncanplay = () => {
    bufferVideo.oncanplay = null;
    playBuffer();
  };
}

/* ══════════════════════════════════════════
   WEB AUDIO SYNTHESIZED SOUNDS
   ══════════════════════════════════════════ */
function playCrackSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const bufferSize = ctx.sampleRate * 0.15; // 0.15 seconds of sound
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate organic waxy crack character using filtered decay noise
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
    
    // Close the audio context after the sound finishes to free resources
    setTimeout(() => {
      try {
        ctx.close();
      } catch (err) {}
    }, 300);
  } catch (e) {
    console.warn("Audio synthesis failed:", e);
  }
}

/* Procedural Parchment Scroll Unfolding Sound */
function playScrollSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const duration = 0.8;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink / Brown noise filter variables
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let brown = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      // Pink noise filter
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      // Brown noise (integral of white noise)
      brown = (brown + 0.02 * white) / 1.02;

      // Mix pink and brown noise for paper friction texture
      let noise = (pink * 0.6 + brown * 12.0) * 0.5;

      // Scroll unfolding profile: quiet start, swelling, then fading
      const t = i / bufferSize;
      const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.5);

      // Add high-frequency organic crackles (simulating paper fiber flexing)
      let crackle = 0;
      if (Math.random() < 0.003) {
        crackle = (Math.random() * 2 - 1) * 0.4;
      }

      data[i] = (noise * 0.08 + crackle) * envelope;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to sweeten the paper sound
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
    console.warn("Paper scroll sound failed:", e);
  }
}

/* ── Procedural Ocean Wave Synthesizer ── */
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

    // Generate brown noise for a deeper, organic wave character
    const bufferSize = waveAudioCtx.sampleRate * 4; // 4s of looping noise
    const buffer = waveAudioCtx.createBuffer(1, bufferSize, waveAudioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Boost noise amplitude
    }

    // Stop current source if active
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

    // LFO to modulate filter frequency (slow wave swell cycle)
    waveLfoOsc = waveAudioCtx.createOscillator();
    waveLfoOsc.type = "sine";
    waveLfoOsc.frequency.value = 0.12; // 0.12Hz = ~8.3 seconds per wave cycle

    const lfoGain = waveAudioCtx.createGain();
    lfoGain.gain.value = 220; // Cutoff sweep range

    // Connect LFO
    waveLfoOsc.connect(lfoGain);
    lfoGain.connect(waveFilterNode.frequency);

    // Base filter frequency
    waveFilterNode.frequency.setValueAtTime(320, waveAudioCtx.currentTime);

    // Audio Graph routing
    waveNoiseSource.connect(waveFilterNode);
    waveFilterNode.connect(waveMainGain);
    waveMainGain.connect(waveAudioCtx.destination);

    // Start playback
    waveNoiseSource.start(0);
    waveLfoOsc.start(0);

    // Smoothly fade in ambient volume from 0 to 0.08 over 3 seconds
    waveMainGain.gain.linearRampToValueAtTime(0.08, waveAudioCtx.currentTime + 3.0);

    // Modulate gain slightly in sync with the wave swells
    let angle = 0;
    waveModInterval = setInterval(() => {
      if (!waveAudioCtx || waveAudioCtx.state === "suspended") return;
      angle += 0.05;
      const sinVal = Math.sin(angle);
      // Map sin (-1 to 1) to volume range (0.03 to 0.08)
      const targetGain = 0.055 + sinVal * 0.025;
      if (waveMainGain) {
        waveMainGain.gain.setTargetAtTime(targetGain, waveAudioCtx.currentTime, 0.1);
      }
    }, 100);

  } catch (e) {
    console.warn("Wave synthesizer starting failed:", e);
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
      waveMainGain.gain.linearRampToValueAtTime(0, waveAudioCtx.currentTime + 2.0); // Fade out over 2 seconds
    } catch(e) {}
  }
  
  if (waveCleanupTimeoutId) {
    clearTimeout(waveCleanupTimeoutId);
  }
  
  // Clean up nodes after fade out completes
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
      console.warn("Error stopping wave synth nodes:", e);
    }
  }, 2100);
}

/* ══════════════════════════════════════════
   PARALLAX EFFECTS (Mouse & Device Tilt)
   ══════════════════════════════════════════ */
function initParallax() {
  let targetMx = 0;
  let targetMy = 0;
  let currentMx = 0;
  let currentMy = 0;

  // Track mouse coordinates on desktop
  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    targetMx = (dx / cx) * 100;
    targetMy = (dy / cy) * 100;
  }, { passive: true });

  // Track accelerometer / gyroscope on mobile
  window.addEventListener("deviceorientation", (e) => {
    let gamma = e.gamma || 0; // left/right tilt (-90 to 90)
    let beta = e.beta || 0;   // front/back tilt (-180 to 180)

    if (beta < -30) beta = -30;
    if (beta > 60) beta = 60;
    
    const normGamma = gamma / 45;
    const normBeta = (beta - 15) / 45;

    targetMx = normGamma * 100;
    targetMy = normBeta * 100;
  }, { passive: true });

  // Lerping animation loop
  function updateParallax() {
    currentMx += (targetMx - currentMx) * 0.08;
    currentMy += (targetMy - currentMy) * 0.08;
    
    document.documentElement.style.setProperty("--mx", currentMx.toFixed(2));
    document.documentElement.style.setProperty("--my", currentMy.toFixed(2));
    
    requestAnimationFrame(updateParallax);
  }
  
  requestAnimationFrame(updateParallax);
}

/* ══════════════════════════════════════════
   GESTURAL SWIPE TO DISMISS MODAL
   ══════════════════════════════════════════ */
function initSwipeDismiss() {
  const paper = document.getElementById("scroll-paper");
  const overlay = document.getElementById("scroll-overlay");
  const inner = document.getElementById("scroll-inner");
  if (!paper || !overlay) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  paper.addEventListener("touchstart", (e) => {
    if (inner && inner.scrollTop > 0) return; // scroll standard content if not at top
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
      // Elastic spring effect
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

/* ══════════════════════════════════════════
   SPARKLE CANVAS PARTICLE TRAIL
   ══════════════════════════════════════════ */
function initSparkleTrail() {
  const canvas = document.getElementById("sparkle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.4;
      this.size = Math.random() * 6 + 4;
      this.maxLife = Math.random() * 25 + 15;
      this.life = this.maxLife;
      this.color = Math.random() > 0.4 ? "#f5c842" : "#ffd770";
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.spin;
      this.life--;
    }

    draw(ctx) {
      const alpha = this.life / this.maxLife;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      
      // Render 4-pointed star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -this.size * 0.5);
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, -this.size * 0.15);
        ctx.rotate(Math.PI / 4);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  function spawn(x, y, count = 1) {
    for (let i = 0; i < count; i++) {
      particles.push(new Sparkle(x, y));
    }
    if (particles.length > 150) {
      particles.shift();
    }
  }

  window.addEventListener("mousemove", (e) => {
    spawn(e.clientX, e.clientY, 1);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      spawn(e.touches[0].clientX, e.touches[0].clientY, 1);
    }
  }, { passive: true });

  window.addEventListener("click", (e) => {
    spawn(e.clientX, e.clientY, 8);
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw(ctx);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
}

/* ════════════════════════════════════════════════════════════
   SCROLL-REVEAL
   ════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".reveal, .reveal-glow, .reveal-scale",
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("revealed"));
  }
}

/* ════════════════════════════════════════════════════════════
   ENVELOPE — The full opening sequence:

   1. Tap/click wrapper
   2. Wax seal cracks — red particles burst outward
   3. Top flap rotates back (CSS class "open" on #envelope)
   4. Letter peeks up from inside
   5. Short pause, then modal slides in
   6. Typewriter writes the message
   7. Confetti burst
   ════════════════════════════════════════════════════════════ */
function initEnvelope() {
  const wrapper = document.getElementById("envelope-wrapper");
  const envelope = document.getElementById("envelope");
  const overlay = document.getElementById("scroll-overlay");
  const paper = document.getElementById("scroll-paper");
  const closeBtn = document.getElementById("scroll-close");
  const msgEl = document.getElementById("scroll-message");
  const sigEl = document.getElementById("scroll-signature");
  const hint = document.getElementById("envelope-hint");

  let opened = false;

  function openEnvelope(e) {
    if (opened) {
      // Already opened — just show the modal again
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

    // Get position of seal for crack particles
    const seal = document.getElementById("env-seal");
    const sealRect = seal.getBoundingClientRect();
    const sealCx = sealRect.left + sealRect.width / 2;
    const sealCy = sealRect.top + sealRect.height / 2;

    // Step 1 — crack the seal
    burstSealParticles(sealCx, sealCy);
    playCrackSound();
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      try {
        window.navigator.vibrate([50, 30, 50]);
      } catch (err) {
        console.warn("Haptic feedback failed:", err);
      }
    }

    // Step 2 — open the envelope flap + letter rises
    setTimeout(() => {
      envelope.classList.add("open");
    }, 120);

    // Step 3 — fade hint out
    if (hint) {
      hint.style.transition = "opacity 0.5s ease";
      hint.style.opacity = "0";
    }

    // Step 4 — open modal, start typewriter, confetti
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
      setTimeout(
        () => typewriterEffect(msgEl, window._bdMsg || "", sigEl),
        600,
      );
    }, 900);
  }

  function closeModal() {
    overlay.classList.remove("open");
    stopAmbientWaves();
    if (paper) paper.classList.remove("unfolded");
  }

  // Touch (instant) + click (fallback)
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

  closeBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    closeModal();
  });
  closeBtn.addEventListener("click", closeModal);
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
}

/* ── Seal crack particles ── */
function burstSealParticles(cx, cy) {
  const count = 18;
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
      --sc-tx: ${tx.toFixed(0)}px;
      --sc-ty: ${ty.toFixed(0)}px;
      --sc-dur: ${dur}s;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), parseFloat(dur) * 1000 + 100);
  }
}

/* ── Typewriter ── */
function typewriterEffect(el, text, sigEl) {
  el.classList.add("typing");
  el.innerHTML = "";
  if (!text) {
    el.classList.remove("typing");
    el.classList.add("done");
    setTimeout(() => sigEl.classList.add("show"), 400);
    return;
  }

  // Create drop cap span
  const dropCap = document.createElement("span");
  dropCap.className = "drop-cap";
  dropCap.style.opacity = "0";
  dropCap.style.transition = "opacity 0.5s ease";
  dropCap.textContent = text[0];
  el.appendChild(dropCap);

  // Trigger reflow & fade in drop cap
  setTimeout(() => {
    dropCap.style.opacity = "1";
  }, 50);

  // Create a span to append the rest of the typing text
  const bodySpan = document.createElement("span");
  el.appendChild(bodySpan);

  let i = 1;
  function tick() {
    if (i < text.length) {
      bodySpan.textContent += text[i];
      i++;
      const inner = document.getElementById("scroll-inner");
      if (inner) inner.scrollTop = inner.scrollHeight;
      setTimeout(tick, 18 + (text[i - 1] === "\n" ? 180 : 0));
    } else {
      el.classList.remove("typing");
      el.classList.add("done");
      setTimeout(() => sigEl.classList.add("show"), 400);
    }
  }

  // Start typing after a short delay for drop cap impact
  setTimeout(tick, 300);
}

/* ── Confetti burst ── */
function spawnConfetti() {
  const colors = [
    "#f5c842",
    "#e8643a",
    "#ff9a5c",
    "#5bc8ef",
    "#e86060",
    "#a0e080",
    "#ffd700",
    "#ff6eb4",
    "#c8935a",
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
      (parseFloat(dur) + parseFloat(delay) + 0.2) * 1000,
    );
  }
}

/* ════════════════════════════════════════════════════════════
   MUSIC
   ─────────────────────────────────────────────────────────
   Android (and all modern browsers) block audio autoplay
   until the user interacts with the page. So we:

   1. Prepare the Audio object immediately on setup.
   2. On the VERY FIRST touch or click anywhere on the page,
      start playing — feels like autoplay to the user.
   3. The music button lets them pause/resume after that.
   ════════════════════════════════════════════════════════════ */
function setupMusic(file, label) {
  const btn = document.getElementById("music-btn");
  const btnText = document.getElementById("music-btn-text");

  // Clean up label if it contains the emoji, to avoid double emojis next to the music icon
  let cleanLabel = label || "Play Birthday Song";
  if (cleanLabel.startsWith("🎵")) {
    cleanLabel = cleanLabel.replace(/^🎵\s*/, "");
  }

  if (btnText) {
    btnText.textContent = cleanLabel;
  }

  const audio = new Audio(file);
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
        // Autoplay blocked — reset started so it can be retried on interaction
        started = false;
        if (btnText) btnText.textContent = cleanLabel;
      });
  }

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
        .catch((err) => {
          console.warn("Play failed on button tap:", err);
        });
    }
  }

  // Try autoplay after 5 seconds.
  // If browser blocks it (no interaction yet), fall back to first-touch.
  setTimeout(() => {
    startMusic();
  }, 5000);

  // Also start on first interaction as fallback (in case 5s autoplay was blocked)
  function onFirstInteraction() {
    startMusic();
    document.removeEventListener("touchend", onFirstInteraction);
    document.removeEventListener("click", onFirstInteraction);
  }

  document.addEventListener("touchend", onFirstInteraction, {
    once: true,
    passive: true,
  });
  document.addEventListener("click", onFirstInteraction, { once: true });

  // Button toggles pause/resume
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


