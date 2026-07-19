import { rand, trapFocus } from '../core/helpers.js';
import { getAudioCtx } from '../audio/audioEngine.js';
import { playCrackSound } from '../audio/ambience.js';
import { state } from '../core/state.js';
import { HOUSES } from '../core/constants.js';
import { revealHogwartsLetter } from '../story/narrative.js';
import { startCastleAwakeningSequence } from '../story/castleReveal.js';
import { triggerOwlDelivery } from '../ui/modal.js';
import { spawnSparkCluster, startParticlesLoop } from '../animation/particles.js';

let lumosVignette = null;
let lumosGlow = null;
let toastTimer = null;
let _patronusInterval = null;
let _aguamentiTimeout1 = null;
let _aguamentiTimeout2 = null;

let _glaciusCanvas = null;
let _glaciusCtx = null;
let _fumosCanvas = null;
let _fumosCtx = null;
let _fumosRAF = null;

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
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.85);
      
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      
      osc.start(now);
      osc.stop(now + 0.9);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.65);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      
      osc.start(now);
      osc.stop(now + 0.7);
    }
  } catch (e) {}
}

export function showSpellToast(text) {
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

export function toggleLumosSpell(activate) {
  if (activate === state.spells.isLumosActive) return;
  state.spells.isLumosActive = activate;
  
  if (activate) {
    lumosVignette = document.createElement("div");
    lumosVignette.id = "lumos-vignette";
    
    lumosGlow = document.createElement("div");
    lumosGlow.id = "lumos-glow";
    
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
    
    document.documentElement.style.setProperty("--x", `${state.pointer.x}px`);
    document.documentElement.style.setProperty("--y", `${state.pointer.y}px`);
    
    requestAnimationFrame(() => {
      lumosVignette.classList.add("active");
      lumosGlow.classList.add("active");
    });
    
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
    
    playSpellSound(false);
    showSpellToast("Nox. 🌙");
  }
}

window.cachedSpellTargets = [];
export function cacheSpellTargets(selector) {
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

export function triggerPatronusFlight() {
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
        spawnSparkCluster(x + 90, y + 90, 1, false);
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

export function triggerRevelioSweep() {
  const sweep = document.createElement("div");
  sweep.id = "revelio-sweep";
  const x = state.pointer.x;
  const y = state.pointer.y;
  document.documentElement.style.setProperty("--x", `${x}px`);
  document.documentElement.style.setProperty("--y", `${y}px`);
  document.body.appendChild(sweep);
  
  document.body.classList.add("revelio-active");
  setTimeout(() => {
    sweep.remove();
    document.body.classList.remove("revelio-active");
  }, 1600);
}

export function resetChestToEnvelope() {
  const envWrapper = document.getElementById("envelope-wrapper");
  const envHint = document.getElementById("envelope-hint");
  const chestWrapper = document.getElementById("treasure-chest-wrapper");
  const chest = document.getElementById("treasure-chest");
  
  state.story.revelioCast = false;
  state.story.chestUnlocked = false;
  
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

export function initTreasureBox() {
  const overlay = document.getElementById("treasure-overlay");
  const closeBtn = document.getElementById("treasure-close");
  const chestWrapper = document.getElementById("treasure-chest-wrapper");
  if (!overlay || !closeBtn || !chestWrapper) return;
  
  trapFocus(overlay);

  const closeTreasure = () => {
    overlay.classList.add("hidden");
    if (window.location.hash === "#treasure-overlay") {
      history.back();
    }
    if (state.story.chestUnlocked) {
      resetChestToEnvelope();
    }
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
    if (!state.story.chestUnlocked) {
      chestWrapper.classList.add("shake");
      playCrackSound();
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

  chestWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      chestWrapper.click();
    }
  });
}

export function activateGlaciusCanvas() {
  const canvas = document.getElementById('glacius-canvas');
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  ctx.fillStyle = 'rgba(212, 242, 255, 0.94)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  
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
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
  for (let c = 0; c < 6; c++) {
    const fx = rand(50, window.innerWidth - 50);
    const fy = rand(50, window.innerHeight - 50);
    ctx.lineWidth = 1.0;
    
    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      let rx = fx, ry = fy;
      for (let segment = 0; segment < 4; segment++) {
        rx += Math.cos(angle) * rand(8, 16);
        ry += Math.sin(angle) * rand(8, 16);
        ctx.lineTo(rx, ry);
        
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
  
  function eraseIce(e) {
    if (state.spells.activeMode !== 'glacius') return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const r = 45;
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

export function deactivateGlaciusCanvas() {
  const canvas = document.getElementById('glacius-canvas');
  if (!canvas) return;
  if (canvas._eraseIce) {
    canvas.removeEventListener('touchmove', canvas._eraseIce);
    canvas.removeEventListener('mousemove', canvas._eraseIce);
    canvas._eraseIce = null;
  }
  canvas.style.transition = 'opacity 1s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    canvas.style.display = 'none';
    canvas.style.opacity = '1';
    canvas.style.transition = '';
    canvas.style.pointerEvents = 'none';
    canvas.width = 0;
    canvas.height = 0;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1000);
  _glaciusCanvas = null;
  _glaciusCtx = null;
}

export function activateFumosCanvas() {
  const canvas = document.getElementById('fumos-canvas');
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  ctx.fillStyle = 'rgba(235, 238, 245, 0.94)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  
  let mistAge = 0;
  function animateMist() {
    if (state.spells.activeMode !== 'fumos') return;
    mistAge += 0.01;
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
    _fumosRAF = requestAnimationFrame(animateMist);
  }
  animateMist();
  
  _fumosCanvas = canvas;
  _fumosCtx = ctx;
  
  function eraseMist(e) {
    if (state.spells.activeMode !== 'fumos') return;
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

export function deactivateFumosCanvas() {
  if (_fumosRAF) { cancelAnimationFrame(_fumosRAF); _fumosRAF = null; }
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
    canvas.width = 0;
    canvas.height = 0;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1500);
  _fumosCanvas = null;
  _fumosCtx = null;
}

export function castSpellText(spellText) {
  const txt = (spellText || "").trim().toLowerCase();
  
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

    const water = document.getElementById("water-level");
    if (water) water.remove();
    const ice = document.getElementById("ice-overlay");
    if (ice) ice.classList.remove("frozen");
    const accioCard = document.getElementById("accio-card");
    if (accioCard) accioCard.classList.remove("accio-fly-in");
    const prismaBox = document.getElementById("prisma-box");
    if (prismaBox) document.body.classList.remove("prisma-running");
    
    const amorisOverlay = document.getElementById("amoris-overlay");
    if (amorisOverlay) { amorisOverlay.innerHTML = ''; amorisOverlay.style.display = 'none'; }
    
    const stellarisOverlay = document.getElementById("stellaris-overlay");
    if (stellarisOverlay) { stellarisOverlay.innerHTML = ''; stellarisOverlay.style.display = 'none'; }
    
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
    if (!state.story.revelioCast) {
      showSpellToast("Reveal the chest first using 'Revelio' before trying to open it!");
    } else if (state.story.revelioCast && !state.story.chestUnlocked) {
      const chest = document.getElementById("treasure-chest");
      const overlay = document.getElementById("treasure-overlay");
      const scroll = document.getElementById("treasure-scroll");
      const msgContent = document.getElementById("treasure-message-content");
      const chestWrapper = document.getElementById("treasure-chest-wrapper");
      
      if (chest && overlay && scroll && msgContent) {
        state.story.chestUnlocked = true;
        chest.classList.remove("locked");
        chest.classList.add("unlocked");
        
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
        
        playCrackSound();
        
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
    state.story.revelioCast = true;
    triggerRevelioSweep();
    
    const envWrapper = document.getElementById("envelope-wrapper");
    const envHint = document.getElementById("envelope-hint");
    const chestWrapper = document.getElementById("treasure-chest-wrapper");
    
    playCrackSound();
    
    if (envWrapper) envWrapper.classList.add("hidden");
    if (envHint) envHint.classList.add("hidden");
    if (chestWrapper) {
      chestWrapper.classList.remove("hidden");
      setTimeout(() => {
        const rect = chestWrapper.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent('envelopeTapped', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        }));
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
          const rx = rect.left + rect.width / 2 + Math.cos(angle) * 90;
          const ry = rect.top + rect.height / 2 + Math.sin(angle) * 70;
          spawnSparkCluster(rx, ry, 1, true);
        }
      }, 300);
    }
    showSpellToast("Revelio! The hidden chest is revealed.");
  } 
  else if (txt === "expecto patronum") {
    state.spells.activeMode = "patronus";
    document.body.classList.add("patronus-active");
    triggerPatronusFlight();
    showSpellToast("Expecto Patronum! ⚡");
    setTimeout(() => {
      if (state.spells.activeMode === "patronus") state.spells.activeMode = "";
      document.body.classList.remove("patronus-active");
    }, 12500);
  } 
  else if (txt === "wingardium leviosa") {
    state.spells.activeMode = "levitation";
    document.body.classList.add("levitation-running");
    showSpellToast("Wingardium Leviosa! 💫");
    setTimeout(() => {
      if (state.spells.activeMode === "levitation") state.spells.activeMode = "";
      document.body.classList.remove("levitation-running");
    }, 8000);
  } 
  else if (txt === "aguamenti") {
    if (_aguamentiTimeout1) clearTimeout(_aguamentiTimeout1);
    if (_aguamentiTimeout2) clearTimeout(_aguamentiTimeout2);
 
    const oldWater = document.getElementById("water-level");
    if (oldWater) oldWater.remove();
 
    state.spells.activeMode = "aguamenti";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 90;
    startParticlesLoop();
    document.body.classList.add("aguamenti-running");
    showSpellToast("Aguamenti! 💧");
    
    const water = document.createElement("div");
    water.id = "water-level";
    
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
      if (state.spells.activeMode !== "aguamenti") return;
      waveTime += 0.08;
      
      const path = document.getElementById("water-wave-path");
      if (path) {
        const px = state.pointer.x;
        const py = state.pointer.y;
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
      if (state.spells.activeMode === "aguamenti") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
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
  else if (txt === "confundo") {
    state.spells.activeMode = "confundo";
    document.body.classList.add("confundo-running");
    showSpellToast("Confundo! 🌀");
    setTimeout(() => {
      if (state.spells.activeMode === "confundo") {
        state.spells.activeMode = "";
      }
      document.body.classList.remove("confundo-running");
    }, 6000);
  }
  else if (txt === "specialis revelio") {
    state.spells.activeMode = "revelio";
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
        if (state.spells.activeMode === "revelio") {
          item.element.classList.add("revelio-pulse");
          setTimeout(() => {
            item.element.classList.remove("revelio-pulse");
          }, 800);
        }
      }, delay);
    });
    
    setTimeout(() => {
      if (state.spells.activeMode === "revelio") {
        state.spells.activeMode = "";
      }
      if (scanLine && scanLine.parentNode) {
        scanLine.remove();
      }
    }, 2800);
  }
  else if (txt === "depulso") {
    state.spells.activeMode = "depulso";
    document.body.classList.add("depulso-running");
    showSpellToast("Depulso! 💨");
    setTimeout(() => {
      if (state.spells.activeMode === "depulso") {
        state.spells.activeMode = "";
      }
      document.body.classList.remove("depulso-running");
    }, 5000);
  }
  else if (txt === "accio") {
    showSpellToast("Accio! 🧲");
    
    const accioCard = document.getElementById('accio-card');
    if (accioCard) {
      const c = window._bdContent || {};
      const imgSrc = c.accioImage || 'public/assets/images/accio_card.png';
      
      accioCard.innerHTML = `
        <div class="accio-gold-sheen"></div>
        <img src="${imgSrc}" alt="Accio card" id="accio-card-img">
      `;
      
      accioCard.style.display = 'block';
      accioCard.style.opacity = '0';
      accioCard.className = '';
      void accioCard.offsetWidth;
      accioCard.classList.add('accio-fly-in');
      
      const handleAccioTilt = (pe) => {
        const cx = pe.touches ? pe.touches[0].clientX : pe.clientX;
        const cy = pe.touches ? pe.touches[0].clientY : pe.clientY;
        const rx = (cx - window.innerWidth / 2) / (window.innerWidth / 2) * 16;
        const ry = (cy - window.innerHeight / 2) / (window.innerHeight / 2) * -16;
        accioCard.style.transform = `translate3d(-50%, -50%, 0) rotateY(${rx}deg) rotateX(${ry}deg) scale(1.05)`;
      };
      
      setTimeout(() => {
        accioCard.classList.remove('accio-fly-in');
        accioCard.style.opacity = '1';
        accioCard.style.filter = 'none';
        
        window.addEventListener('mousemove', handleAccioTilt, { passive: true });
        window.addEventListener('touchmove', handleAccioTilt, { passive: true });
        
        for (let i = 0; i < 5; i++) {
          spawnSparkCluster(
            window.innerWidth / 2 + rand(-60, 60),
            window.innerHeight / 2 + rand(-80, 80),
            3, true
          );
        }
      }, 900);
      
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
  else if (txt === "herbivicus" || txt === "flora") {
    state.spells.activeMode = "herbivicus";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 50;
    startParticlesLoop();
    document.body.classList.add("herbivicus-running");
    showSpellToast("Herbivicus! 🌿");
    
    const herBorder = document.getElementById('herbivicus-border');
    if (herBorder) {
      herBorder.style.display = 'block';
      void herBorder.offsetWidth;
      herBorder.classList.add('active');
    }
    
    setTimeout(() => {
      if (state.spells.activeMode === "herbivicus") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("herbivicus-running");
      if (herBorder) {
        herBorder.classList.remove('active');
        setTimeout(() => { herBorder.style.display = 'none'; }, 800);
      }
    }, 10000);
  }
  else if (txt === "duro" || txt === "terram") {
    state.spells.activeMode = "duro";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 50;
    startParticlesLoop();
    document.body.classList.add("duro-running");
    playCrackSound();
    document.body.classList.add("shake-screen");
    if (window.navigator && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(180);
    }
    setTimeout(() => document.body.classList.remove("shake-screen"), 300);
    showSpellToast("Duro! 🪨");
    
    const duroBorder = document.getElementById('duro-border');
    if (duroBorder) {
      duroBorder.style.display = 'block';
      void duroBorder.offsetWidth;
      duroBorder.classList.add('active');
    }
    
    setTimeout(() => {
      if (state.spells.activeMode === "duro") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("duro-running");
      if (duroBorder) {
        duroBorder.classList.remove('active');
        setTimeout(() => { duroBorder.style.display = 'none'; }, 800);
      }
    }, 10000);
  }
  else if (txt === "incendio") {
    state.spells.activeMode = "incendio";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 70;
    startParticlesLoop();
    cacheSpellTargets('#envelope-wrapper, #treasure-chest-wrapper, h1, button:not(#spell-touch-blocker)');
    document.body.classList.add("incendio-running");
    showSpellToast("Incendio! 🔥");
    
    const strip = document.getElementById('incendio-strip');
    if (strip) {
      strip.style.display = 'block';
      void strip.offsetWidth;
      strip.classList.add('active');
    }
    
    setTimeout(() => {
      if (state.spells.activeMode === "incendio") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
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
    state.spells.activeMode = "ventus";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 60;
    startParticlesLoop();
    document.body.classList.add("ventus-running");
    showSpellToast("Ventus! 🍃");
    setTimeout(() => {
      if (state.spells.activeMode === "ventus") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("ventus-running");
    }, 10000);
  }
  else if (txt === "glacius") {
    state.spells.activeMode = "glacius";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 55;
    startParticlesLoop();
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
    playCrackSound();
    showSpellToast("Glacius! ❄️");
    
    activateGlaciusCanvas();
    
    setTimeout(() => {
      if (state.spells.activeMode === "glacius") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
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
    state.spells.activeMode = "fumos";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 60;
    startParticlesLoop();
    document.body.classList.add("fumos-running");
    showSpellToast("Fumos! 💨");
    activateFumosCanvas();
    
    setTimeout(() => {
      if (state.spells.activeMode === "fumos") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("fumos-running");
      deactivateFumosCanvas();
    }, 12000);
  }
  else if (txt === "prisma") {
    state.spells.activeMode = "prisma";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 35 : 95;
    startParticlesLoop();
    document.body.classList.add("prisma-running");
    showSpellToast("Prisma! 🌈");
    
    setTimeout(() => {
      if (state.spells.activeMode === "prisma") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("prisma-running");
      const canvas = document.getElementById('sparkle-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 12000);
  }
  else if (txt === "chronos") {
    state.spells.activeMode = "chronos";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 15 : 50;
    startParticlesLoop();
    document.body.classList.add("chronos-running");
    const overlay = document.getElementById("chronos-overlay");
    if (overlay) {
      overlay.classList.add("active");
    }
    showSpellToast("Chronos! ⏳");
    
    setTimeout(() => {
      if (state.spells.activeMode === "chronos") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("chronos-running");
      if (overlay) {
        overlay.classList.remove("active");
      }
    }, 12000);
  }
  else if (txt === "amoris") {
    state.spells.activeMode = "amoris";
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
        if (state.spells.activeMode !== "amoris") return;
        const pointerX = state.pointer.x;
        const pointerY = state.pointer.y;
        
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
      
      for (let i = 0; i < 6; i++) {
        spawnSparkCluster(
          window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.6,
          window.innerHeight * (0.3 + Math.random() * 0.5),
          3, true
        );
      }

      setTimeout(() => {
        if (state.spells.activeMode === "amoris") state.spells.activeMode = "";
        document.body.classList.remove("amoris-running");
        cancelAnimationFrame(amorisRAF);
        overlay.innerHTML = '';
        overlay.style.display = 'none';
      }, 10000);
    }
  }
  else if (txt === "stellaris") {
    state.spells.activeMode = "stellaris";
    state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 25 : 70;
    startParticlesLoop();
    document.body.classList.add("stellaris-running");
    showSpellToast("Stellaris! ✨ The stars descend!");

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
      if (state.spells.activeMode === "stellaris") {
        state.spells.activeMode = "";
        state.spells.maxParticlesLimit = (window.innerWidth < 768) ? 20 : 80;
      }
      document.body.classList.remove("stellaris-running");
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
