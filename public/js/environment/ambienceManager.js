import { getSeason, Petal, Leaf, Snowflake } from './seasons.js';
import { Firefly } from '../effects/fireflies.js';
import { MagicalDust } from '../effects/magicalDust.js';
import { Feather } from '../effects/feathers.js';
import { ShootingStar } from '../effects/shootingStars.js';
import { Bird } from './birds.js';
import { CuriousOwl } from './owl.js';
import { GlowingButterfly } from '../effects/butterflies.js';
import { WhiteStag } from './creatures.js';
import { updateTimeOfDayOverlay } from './weather.js';
import { updateMoonPhase } from './moon.js';
import { SmokeParticle } from '../effects/smoke.js';
import { state } from '../core/state.js';

let _triggerAmbientUpdateFn = null;

export function triggerAmbientUpdate() {
  if (_triggerAmbientUpdateFn) {
    _triggerAmbientUpdateFn();
  }
}

const circlingOwls = [];

export function triggerAwakeningOwls() {
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
}

export function initAmbientAtmosphere() {
  if (state.system.reducedMotion) return;

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

  const smokeParticles = [];

  let _ambientLoopRunning = false;

  function triggerAmbientUpdateFn() {
    if (!_ambientLoopRunning) {
      _ambientLoopRunning = true;
      requestAnimationFrame(loop);
    }
  }

  _triggerAmbientUpdateFn = triggerAmbientUpdateFn;

  updateTimeOfDayOverlay();
  setInterval(updateTimeOfDayOverlay, 900000);

  updateMoonPhase();

  let currentWindTilt = 0;
  let targetWindTilt = 0;
  setInterval(() => {
    if (document.hidden || !state.system.isVisible) return;
    targetWindTilt = (Math.random() - 0.5) * 5.2;
  }, 1600);

  let lastFrameTime = 0;
  const fpsInterval = 1000 / 30; // 30 FPS target for low power

  function loop(now) {
    if (document.hidden || (state.system && !state.system.isVisible)) {
      _ambientLoopRunning = false;
      return;
    }

    if (state.system && state.system.isLowPowerDevice) {
      const elapsed = now - lastFrameTime;
      if (elapsed < fpsInterval) {
        requestAnimationFrame(loop);
        return;
      }
      lastFrameTime = now - (elapsed % fpsInterval);
    }

    currentWindTilt += (targetWindTilt - currentWindTilt) * 0.045;
    document.documentElement.style.setProperty("--wind-tilt", `${currentWindTilt.toFixed(2)}deg`);
    ctx.clearRect(0, 0, width, height);

    const mx = state.pointer.x;
    const my = state.pointer.y;

    let needsLoop = false;

    if (state.castle.zoomingActive) {
      needsLoop = true;
      const towerX = width * (300 / 800) + (mx - width/2) * -0.03;
      const towerY = height - (height * 0.15 * 1.65) + (40 / 400 * height * 0.15 * 1.65) - 32 + (my - height/2) * -0.01;
      
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
    }

    if (state.environment.ceremonyConstellationActive) {
      needsLoop = true;
      const towerX = width / 2 + (mx - width/2) * -0.01;
      const towerY = height * 0.42 + (my - height/2) * -0.01;
      
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
      ctx.setLineDash([]);

      if (!state.environment.constellationProgress) state.environment.constellationProgress = 0;
      if (state.environment.constellationProgress < 1.0) state.environment.constellationProgress += 0.005;

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#ffd54f';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      
      const totalLen = p.length;
      const currentLimit = state.environment.constellationProgress * totalLen;
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
      ctx.shadowBlur = 0;

      p.forEach((pt, idx) => {
        const starTimeLimit = state.environment.constellationProgress * totalLen;
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

    if (smokeParticles.length > 0) {
      needsLoop = true;
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.y < 0) {
          smokeParticles.splice(i, 1);
        }
      }
    }

    if (!needsLoop) {
      _ambientLoopRunning = false;
      return;
    }

    requestAnimationFrame(loop);
  }
}
