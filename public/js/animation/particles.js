import { rand } from '../core/helpers.js';
import { state } from '../core/state.js';

const leafImg = new Image();
leafImg.onerror = () => console.warn('leaf.png missing');
leafImg.src = 'public/assets/particles/leaf.png';

const pebbleImg = new Image();
pebbleImg.onerror = () => console.warn('duro_pebble.png missing');
pebbleImg.src = 'public/assets/images/duro_pebble.png';

let canvas = null;
let ctx = null;
let isMobile = false;
let palette = null;
const particles = [];
let lastTime = 0;
let isLoopRunning = false;
let rafId = null;
let SPAWN_INTERVAL = 100;

const PALETTES = {
  gryffindor: { spark: '#D3A625', orb: 'rgba(116, 0, 1, 0.60)',   star: '#D3A625', bolt: '#FFD700' },
  slytherin:  { spark: '#E4F0E7', orb: 'rgba(26, 71, 42, 0.50)',  star: '#E4F0E7', bolt: '#E4F0E7' },
  ravenclaw:  { spark: '#946B2D', orb: 'rgba(14, 26, 64, 0.60)',  star: '#946B2D', bolt: '#B8A060' },
  hufflepuff: { spark: '#ECB939', orb: 'rgba(255, 255, 200, 0.50)', star: '#ECB939', bolt: '#FFE066' },
};

function Particle() { 
  this.active = false; 
}

function getFreeParticle() {
  for (let i = 0; i < particles.length; i++) {
    if (!particles[i].active) return particles[i];
  }
  return null;
}

export function startParticlesLoop() {
  if (!isLoopRunning) {
    isLoopRunning = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }
}

export function spawnSparkCluster(cx, cy, count, radial) {
  if (!canvas) return;
  const isLumos = state.spells.isLumosActive;
  count = count || Math.floor(rand(3, 7));
  
  if (cx === undefined && isLumos) cx = state.pointer.x;
  if (cy === undefined && isLumos) cy = state.pointer.y;
  
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
    
    if (state.spells.activeMode === 'incendio') {
      vy = rand(-4.8, -2.0);
      vx = rand(-1.5, 1.5);
    } else if (state.spells.activeMode === 'aguamenti') {
      vy = rand(3.5, 6.5);
      vx = rand(-0.4, 0.4);
    } else if (state.spells.activeMode === 'glacius') {
      vy = rand(0.5, 1.8);
      vx = rand(-0.8, 0.8);
    } else if (state.spells.activeMode === 'patronus') {
      vy = rand(-0.6, 0.6);
      vx = rand(-3.0, -1.0);
    } else if (state.spells.activeMode === 'ventus') {
      vy = rand(-0.6, 0.6);
      vx = rand(3.5, 6.5);
    } else if (state.spells.activeMode === 'duro') {
      vy = rand(3.0, 5.0);
      vx = rand(-0.5, 0.5);
    } else if (state.spells.activeMode === 'fulgur') {
      vy = rand(-2.0, 2.0);
      vx = rand(-2.0, 2.0);
    } else if (state.spells.activeMode === 'pyra') {
      vy = rand(-1.5, -3.2);
      vx = rand(-0.8, 0.8);
    } else if (state.spells.activeMode === 'herbivicus') {
      vy = rand(-0.8, -1.8);
      vx = rand(-1.2, 1.2);
    } else if (state.spells.activeMode === 'fumos') {
      vy = rand(-0.5, -1.2);
      vx = rand(-0.8, 0.8);
    } else if (state.spells.activeMode === 'prisma') {
      vy = rand(-1.2, 1.2);
      vx = rand(-1.2, 1.2);
    } else if (state.spells.activeMode === 'chronos') {
      vy = rand(-0.25, 0.25);
      vx = rand(-0.25, 0.25);
    }
    
    p.vx = vx; 
    p.vy = vy;
    
    if (state.spells.activeMode === 'glacius') {
      p.life = rand(5.0, 7.5);
    } else if (state.spells.activeMode === 'chronos') {
      p.life = rand(8.0, 11.0);
    } else if (state.spells.activeMode === 'aguamenti' || state.spells.activeMode === 'fumos') {
      p.life = rand(4.0, 5.5);
    } else {
      p.life = rand(1.5, 2.5);
    }
    
    p.age = 0;
    
    if (state.spells.activeMode === 'incendio' || state.spells.activeMode === 'fumos') {
      p.size = rand(22, 36);
    } else if (state.spells.activeMode === 'glacius' || state.spells.activeMode === 'herbivicus') {
      p.size = rand(16, 26);
    } else {
      p.size = rand(8, 14);
    }
    p.isFlower = false;
    
    let color = isLumos ? '#FFF3CD' : palette.spark;
    if (state.spells.activeMode === 'incendio') {
      const fireColors = ['#FF4500', '#FF3000', '#FF6347', '#FF8C00', '#FFD700'];
      color = fireColors[Math.floor(Math.random() * fireColors.length)];
    } else if (state.spells.activeMode === 'aguamenti') {
      const rainColors = ['#1E90FF', '#00BFFF', '#87CEFA', '#4682B4'];
      color = rainColors[Math.floor(Math.random() * rainColors.length)];
    } else if (state.spells.activeMode === 'glacius') {
      const iceColors = ['#E0FFFF', '#B0E0E6', '#AFEEEE', '#FFFFFF'];
      color = iceColors[Math.floor(Math.random() * iceColors.length)];
    } else if (state.spells.activeMode === 'patronus') {
      const silverColors = ['#F5F5F7', '#E8E8F0', '#D0D8F0', '#FFFFFF'];
      color = silverColors[Math.floor(Math.random() * silverColors.length)];
    } else if (state.spells.activeMode === 'ventus') {
      const windColors = ['#A3E4D7', '#E8F8F5', '#76D7C4', '#48C9B0'];
      color = windColors[Math.floor(Math.random() * windColors.length)];
    } else if (state.spells.activeMode === 'duro') {
      const stoneColors = ['#8D6E63', '#A1887F', '#6D4C41', '#5D4037'];
      color = stoneColors[Math.floor(Math.random() * stoneColors.length)];
    } else if (state.spells.activeMode === 'fulgur') {
      const lightColors = ['#FFF59D', '#FFEB3B', '#FDD835', '#FFFFFF'];
      color = lightColors[Math.floor(Math.random() * lightColors.length)];
    } else if (state.spells.activeMode === 'pyra') {
      const emberColors = ['#FF5722', '#FF7043', '#FF8A65', '#FF3D00'];
      color = emberColors[Math.floor(Math.random() * emberColors.length)];
    } else if (state.spells.activeMode === 'herbivicus') {
      const herbColors = ['#81C784', '#66BB6A', '#4CAF50', '#A5D6A7', '#C8E6C9'];
      color = herbColors[Math.floor(Math.random() * herbColors.length)];
    } else if (state.spells.activeMode === 'fumos') {
      const mistColors = ['rgba(220, 220, 220, 0.25)', 'rgba(245, 245, 245, 0.2)', 'rgba(200, 200, 200, 0.25)'];
      color = mistColors[Math.floor(Math.random() * mistColors.length)];
    } else if (state.spells.activeMode === 'prisma') {
      color = 'hsl(0, 95%, 70%)';
    } else if (state.spells.activeMode === 'chronos') {
      const timeColors = ['#D4AF37', '#CD7F32', '#B8860B', '#AA7C11'];
      color = timeColors[Math.floor(Math.random() * timeColors.length)];
    }
    p.color = color;
    
    p.rotation = rand(0, Math.PI * 2); 
    p.spin = rand(-0.12, 0.12);
  }
  startParticlesLoop();
}

function spawnOrb() {
  const p = getFreeParticle(); 
  if (!p) return;
  const isLumos = state.spells.isLumosActive;
  p.active = true; 
  p.type = 'B';
  p.x = isLumos ? state.pointer.x + rand(-18, 18) : rand(0, canvas.width); 
  p.y = isLumos ? state.pointer.y + rand(-18, 18) : rand(0, canvas.height);
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
  const isLumos = state.spells.isLumosActive;
  p.active = true; 
  p.type = 'C';
  p.x = isLumos ? state.pointer.x + rand(-25, 25) : rand(40, canvas.width - 40); 
  p.y = isLumos ? state.pointer.y + rand(-25, 25) : rand(40, canvas.height - 40);
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
  const isLumos = state.spells.isLumosActive;
  p.active = true; 
  p.type = 'D';
  p.x = isLumos ? state.pointer.x + rand(-20, 20) : rand(0, canvas.width); 
  p.y = isLumos ? state.pointer.y + rand(-20, 20) : rand(canvas.height * 0.3, canvas.height);
  p.vx = isLumos ? rand(-0.5, 0.5) : rand(-0.25, 0.25); 
  p.vy = isLumos ? rand(-1.2, -0.6) : rand(-1.1, -0.5);
  p.life = 3.0; 
  p.age = 0;
  p.size = rand(4, 9); 
  p.color = isLumos ? '#FFFFAA' : palette.spark;
}

function updateParticle(p, dt) {
  p.age += dt;
  if (p.age >= p.life) {
    p.active = false;
    return;
  }
  
  if (p.type === 'A') {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    
    if (state.spells.activeMode === 'incendio') {
      p.vy += 0.08;
    } else if (state.spells.activeMode === 'aguamenti') {
      p.vy += 0.16;
    } else if (state.spells.activeMode === 'glacius') {
      p.vx *= 0.98;
      p.vy += 0.015;
    } else if (state.spells.activeMode === 'patronus') {
      p.vx += rand(-0.3, 0.3);
      p.vy += rand(-0.35, 0.35);
    } else if (state.spells.activeMode === 'duro') {
      p.vy += 0.14;
    } else if (state.spells.activeMode === 'chronos') {
      p.vx *= 0.96;
      p.vy *= 0.96;
    } else {
      p.vy += 0.04;
    }
  } else if (p.type === 'B') {
    p.x += p.vx;
    p.y += p.vy;
  } else if (p.type === 'D') {
    p.x += p.vx;
    p.y += p.vy;
    if (state.spells.activeMode === 'stellaris') {
      p.vy += 0.012;
    }
  }
}

function drawParticle(p) {
  const lifeRatio = 1.0 - (p.age / p.life);
  
  if (p.type === 'A') {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, lifeRatio);
    
    if (state.spells.activeMode === 'incendio') {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size / 2);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.3, 'rgba(255, 69, 0, 0.8)');
      grad.addColorStop(1, 'rgba(128, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.spells.activeMode === 'aguamenti') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 3.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.spells.activeMode === 'glacius') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(-p.size / 2, 0); ctx.lineTo(p.size / 2, 0);
      ctx.moveTo(0, -p.size / 2); ctx.lineTo(0, p.size / 2);
      ctx.stroke();
    } else if (state.spells.activeMode === 'patronus') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 3.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 1.8, 0, Math.PI * 2);
      ctx.stroke();
    } else if (state.spells.activeMode === 'herbivicus') {
      ctx.drawImage(leafImg, -p.size / 2, -p.size / 2, p.size, p.size);
    } else if (state.spells.activeMode === 'duro') {
      ctx.drawImage(pebbleImg, -p.size / 2, -p.size / 2, p.size, p.size);
    } else if (state.spells.activeMode === 'fumos') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.spells.activeMode === 'prisma') {
      const hue = (p.x + p.y + p.age * 200) % 360;
      ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${lifeRatio})`;
      
      ctx.beginPath();
      const r = p.size / 2;
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const r = p.size / 2;
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.fill();
    }
    ctx.restore();
  } else if (p.type === 'B') {
    ctx.save();
    ctx.globalAlpha = Math.max(0, lifeRatio * p.baseAlpha);
    
    const pulse = 1.0 + Math.sin(p.age * p.pulseFreq) * 0.12;
    const currentRadius = p.radius * pulse;
    
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 3);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.2, p.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, currentRadius * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'C') {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = Math.max(0, lifeRatio * 0.85);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.moveTo(-p.size / 2, -p.size / 2);
    ctx.lineTo(0, p.size / 2);
    ctx.lineTo(p.size / 2, -p.size / 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'D') {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = Math.max(0, lifeRatio * 0.85);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12 * lifeRatio;
    
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let lastSpawn = 0;
let orbSpawnTime = 0;
let boltSpawnTime = 0;
let starSpawnTime = 0;

function tickSpawner(now) {
  if (state.spells.isLumosActive) {
    if (now - lastSpawn > SPAWN_INTERVAL) {
      spawnSparkCluster(state.pointer.x, state.pointer.y, Math.floor(rand(1, 3)), false);
      lastSpawn = now;
    }
    if (now - orbSpawnTime > 800) {
      spawnOrb();
      orbSpawnTime = now;
    }
    if (now - boltSpawnTime > 1400) {
      spawnBolt();
      boltSpawnTime = now;
    }
    if (now - starSpawnTime > 600) {
      spawnStar();
      starSpawnTime = now;
    }
  } else if (state.spells.activeMode === 'incendio') {
    if (now - lastSpawn > 40) {
      const count = isMobile ? 1 : 2;
      for (let i = 0; i < count; i++) {
        spawnSparkCluster(state.pointer.x + rand(-30, 30), state.pointer.y + rand(-30, 30), 1, false);
      }
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'aguamenti') {
    if (now - lastSpawn > 30) {
      const count = isMobile ? 1 : 2;
      for (let i = 0; i < count; i++) {
        spawnSparkCluster(state.pointer.x + rand(-15, 15), state.pointer.y + rand(-15, 15), 1, false);
      }
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'glacius') {
    if (now - lastSpawn > 60) {
      spawnSparkCluster(state.pointer.x + rand(-10, 10), state.pointer.y + rand(-10, 10), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'patronus') {
    // Expecto Patronum path sparks are generated directly in triggerPatronusFlight timer
  } else if (state.spells.activeMode === 'ventus') {
    if (now - lastSpawn > 45) {
      spawnSparkCluster(state.pointer.x + rand(-25, 25), state.pointer.y + rand(-25, 25), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'duro') {
    if (now - lastSpawn > 50) {
      spawnSparkCluster(state.pointer.x + rand(-12, 12), state.pointer.y + rand(-12, 12), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'herbivicus') {
    if (now - lastSpawn > 65) {
      spawnSparkCluster(state.pointer.x + rand(-15, 15), state.pointer.y + rand(-15, 15), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'fumos') {
    if (now - lastSpawn > 40) {
      spawnSparkCluster(state.pointer.x + rand(-25, 25), state.pointer.y + rand(-25, 25), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'prisma') {
    if (now - lastSpawn > 50) {
      spawnSparkCluster(state.pointer.x + rand(-20, 20), state.pointer.y + rand(-20, 20), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'chronos') {
    if (now - lastSpawn > 80) {
      spawnSparkCluster(state.pointer.x + rand(-10, 10), state.pointer.y + rand(-10, 10), 1, false);
      lastSpawn = now;
    }
  } else if (state.spells.activeMode === 'stellaris') {
    if (now - lastSpawn > 55) {
      spawnSparkCluster(state.pointer.x + rand(-30, 30), state.pointer.y + rand(-30, 30), 1, false);
      lastSpawn = now;
    }
    if (now - starSpawnTime > 120) {
      spawnStar();
      starSpawnTime = now;
    }
  }
}

function drawLargeRainbowOverlay() {
  ctx.save();
  const time = performance.now() * 0.001;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
  if (document.hidden || (state.system && !state.system.isVisible)) {
    isLoopRunning = false;
    rafId = null;
    return;
  }
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (state.spells.activeMode === 'prisma') {
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
  
  if (!isMobile || state.spells.isLumosActive || (state.spells.activeMode && state.spells.activeMode !== 'none')) {
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

  if (activeCount === 0 && !state.spells.isLumosActive && !state.spells.activeMode) {
    isLoopRunning = false;
    rafId = null;
    return;
  }

  rafId = requestAnimationFrame(loop);
}

export function initMagicParticles(opts = {}) {
  // Background video is the ONLY background — particle canvas disabled
  return;
}
