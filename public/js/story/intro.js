import { DEFAULT_SIZES, PRELOADED_ASSETS } from '../core/constants.js';
import { playCrackSound, transitionWindToAmbient, playOwlHoot } from '../audio/ambience.js';
import { startWindAmbient } from '../audio/wind.js';

const owlImg = new Image();
owlImg.src = 'public/assets/creatures/owl.png';

let _cinematicActive = false;

export async function startPreloader() {
  const c = typeof BIRTHDAY_CONTENT !== "undefined" ? BIRTHDAY_CONTENT : {};

  const friendName = c.friendName || "Sofia";
  document.title = `Happy Birthday, ${friendName}! ⚡ A Letter from Hogwarts`;
  const loadingTitle = document.getElementById("loading-title");
  if (loadingTitle) {
    loadingTitle.textContent = `For ${friendName}`;
  }

  const solemnSwear = document.getElementById("loading-solemn-swear");
  if (solemnSwear) {
    solemnSwear.style.opacity = "0.85";
  }

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

    currentAngle += (Math.random() * 40 - 20);
    if (currentAngle < -75) currentAngle = -75;
    if (currentAngle > 15) currentAngle = 15;

    const rad = currentAngle * Math.PI / 180;
    const stepDist = 8.5;
    const sideOffset = 2.4;
    const offsetRad = (currentAngle + 90) * Math.PI / 180;
    const sideSign = isLeft ? -1 : 1;

    let spawnX = currentX + Math.cos(rad) * stepDist + Math.cos(offsetRad) * sideOffset * sideSign;
    let spawnY = currentY + Math.sin(rad) * stepDist + Math.sin(offsetRad) * sideOffset * sideSign;

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

    requestAnimationFrame(() => {
      footprint.style.opacity = "0.7";
    });

    setTimeout(() => {
      footprint.style.transition = "opacity 1.2s ease";
      footprint.style.opacity = "0";
      setTimeout(() => footprint.remove(), 1200);
    }, 1800);

    isLeft = !isLeft;
  }

  spawnPreloaderFootstep();
  footstepInterval = setInterval(spawnPreloaderFootstep, 580);

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
  const activeVideoUrl = c[activeVideoId] || `assets/video/${activeHouse}.mp4`;

  const assets = [
    { id: 'musicFile',       url: c.musicFile       || 'public/assets/audio/music/birthday.mp3' }
  ].filter(asset => asset.url);

  assets.forEach(asset => {
    const basename = asset.url.split('/').pop();
    asset.size = DEFAULT_SIZES[basename] || 15000000;
  });

  const totalBytes = assets.reduce((sum, asset) => sum + asset.size, 0);
  let bytesLoaded = {};
  assets.forEach(asset => bytesLoaded[asset.id] = 0);

  const statusMessages = {
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

    if (subtitle) {
      subtitle.style.transition = "opacity 0.3s ease";
      subtitle.style.opacity = "0";
      setTimeout(() => {
        subtitle.textContent = "Mischief Managed.";
        subtitle.style.opacity = "1";
      }, 300);
    }

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
          if (typeof window.initializeMainApp === "function") {
            window.initializeMainApp();
          }
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
        if (typeof window.initializeMainApp === "function") {
          window.initializeMainApp();
        }
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

export function startCinematicSequence() {
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

  startWindAmbient();
  setTimeout(() => {
    if (_cinematicActive) playOwlHoot();
  }, 2500);

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

  let tick = 0;
  let owlX = -100;
  let owlY = h * 0.2;
  let owlScale = 1;
  let owlFlap = 0;

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

  const landingDust = [];

  function drawOwlSilhouette(x, y, scale, wingFlap, isRight) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(isRight ? scale : -scale, scale);
    
    // Draw the high-res owl image centered
    const w = 48;
    const h = 48;
    ctx.drawImage(owlImg, -w / 2, -h / 2, w, h);
    
    ctx.restore();
  }

  function drawEnvelopeSilhouette(x, y, width, height, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-width / 2 + 5, -height / 2 + 5, width, height);

    ctx.fillStyle = '#ebdeb7';
    ctx.strokeStyle = '#cbbb93';
    ctx.lineWidth = 2;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeRect(-width / 2, -height / 2, width, height);

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

    ctx.fillStyle = '#060812';
    ctx.fillRect(0, 0, w, h);

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

    if (tick < 500) {
      owlScale = 0.4;
      owlFlap += 0.12;
      owlX = moonX + 220 - (tick * 0.7);
      owlY = moonY - 30 + Math.sin(tick * 0.04) * 15;
      drawOwlSilhouette(owlX, owlY, owlScale, owlFlap, false);

      if (Math.random() < 0.08) {
        owlFeathers.push(new MiniFeather(owlX, owlY));
      }
    }
    else if (tick >= 500 && tick < 780) {
      const prog = (tick - 500) / 280;
      owlScale = 0.4 + prog * 1.6;
      owlFlap += 0.18;
      
      const sweepAngle = Math.PI * 1.5 - prog * Math.PI;
      owlX = w / 2 + Math.cos(sweepAngle) * (w * 0.35 * (1 - prog * 0.5));
      owlY = h / 2 - 100 + Math.sin(sweepAngle) * (h * 0.22);
      
      drawOwlSilhouette(owlX, owlY, owlScale, owlFlap, true);

      if (Math.random() < 0.12) {
        owlFeathers.push(new MiniFeather(owlX, owlY));
      }
    }
    else if (tick >= 780 && !envLanded) {
      if (!envReleased) {
        envReleased = true;
        envX = owlX;
        envY = owlY;
        envAngle = 0.2;
      }

      const owlProg = (tick - 780);
      owlFlap += 0.2;
      owlX -= 3.2;
      owlY -= 0.6;
      owlScale = Math.max(0.3, 2.0 - owlProg * 0.02);
      drawOwlSilhouette(owlX, owlY, owlScale, owlFlap, false);

      envVy += 0.18;
      envY += envVy;
      
      envX += (targetX - envX) * 0.06;
      envAngle += Math.sin(tick * 0.06) * 0.015;

      if (envY >= targetY) {
        envY = targetY;
        envLanded = true;
        
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

        playCrackSound();

        setTimeout(() => {
          endCinematic();
        }, 1600);
      }

      drawEnvelopeSilhouette(envX, envY, envW, envH, envAngle);
    }
    else if (envLanded) {
      drawEnvelopeSilhouette(envX, envY, envW, envH, envAngle);

      const pulseProg = (tick % 60) / 60;
      ctx.strokeStyle = `rgba(212, 175, 55, ${1 - pulseProg})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(envX, envY, 15 + pulseProg * 45, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = owlFeathers.length - 1; i >= 0; i--) {
      const f = owlFeathers[i];
      f.update();
      f.draw();
      if (f.y > h + 20) {
        owlFeathers.splice(i, 1);
      }
    }

    landingDust.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.08;
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

  overlay.addEventListener("click", () => {
    endCinematic();
  }, { once: true });

  skipBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    endCinematic();
  }, { once: true });

  requestAnimationFrame(tickCinematic);
}

export function endCinematic() {
  if (!_cinematicActive) return;
  _cinematicActive = false;

  transitionWindToAmbient();

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
