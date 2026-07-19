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

  const season = getSeason();
  const ambientParticles = [];
  if (season === 'spring') {
    for (let i = 0; i < 35; i++) ambientParticles.push(new Petal());
  } else if (season === 'summer') {
    for (let i = 0; i < 18; i++) ambientParticles.push(new Firefly());
    for (let i = 0; i < 20; i++) ambientParticles.push(new MagicalDust());
  } else if (season === 'autumn') {
    for (let i = 0; i < 30; i++) ambientParticles.push(new Leaf());
  } else {
    for (let i = 0; i < 50; i++) ambientParticles.push(new Snowflake());
  }

  const feathersCount = 3;
  const feathers = Array.from({ length: feathersCount }, () => new Feather());

  const smokeParticles = [];
  const shootingStars = Array.from({ length: 2 }, () => new ShootingStar());

  const hour = new Date().getHours();
  let birdsCount = 2;
  if (hour >= 5 && hour < 8) birdsCount = 5;
  else if (hour >= 17 && hour < 20) birdsCount = 3;
  else if (hour >= 20 || hour < 5) birdsCount = 1;

  const activeBirds = Array.from({ length: birdsCount }, () => new Bird(hour >= 20 || hour < 5));

  const curiousOwl = new CuriousOwl();
  const butterflies = Array.from({ length: 3 }, () => new GlowingButterfly(season));
  const whiteStag = new WhiteStag();

  updateTimeOfDayOverlay();
  setInterval(updateTimeOfDayOverlay, 900000);

  updateMoonPhase();

  const castleWindows = document.querySelectorAll(".castle-window");
  setInterval(() => {
    if (document.hidden) return;
    castleWindows.forEach(win => {
      if (Math.random() < 0.15) {
        win.classList.toggle("active");
      }
    });
  }, 2200);

  let currentWindTilt = 0;
  let targetWindTilt = 0;
  setInterval(() => {
    if (document.hidden) return;
    targetWindTilt = (Math.random() - 0.5) * 5.2;
  }, 1600);

  function loop() {
    if (document.hidden) {
      requestAnimationFrame(loop);
      return;
    }
    currentWindTilt += (targetWindTilt - currentWindTilt) * 0.045;
    document.documentElement.style.setProperty("--wind-tilt", `${currentWindTilt.toFixed(2)}deg`);
    ctx.clearRect(0, 0, width, height);

    const env = document.getElementById("envelope-area");
    const avoidRect = env ? env.getBoundingClientRect() : null;

    const mx = state.pointer.x;
    const my = state.pointer.y;

    shootingStars.forEach(s => {
      s.update(width, height);
      s.draw(ctx);
    });

    activeBirds.forEach(b => {
      b.update(width, height);
      b.draw(ctx);
    });

    if (state.castle.zoomingActive) {
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
    }

    if (state.environment.ceremonyConstellationActive) {
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
      p.draw(ctx);
      if (p.life <= 0 || p.y < 0) {
        smokeParticles.splice(i, 1);
      }
    }

    whiteStag.update(width, height);
    whiteStag.draw(ctx);

    curiousOwl.update(mx, my, width, height);
    curiousOwl.draw(ctx);

    butterflies.forEach(b => {
      b.update(mx, my, width, height);
      b.draw(ctx);
    });

    ambientParticles.forEach(p => {
      p.update(mx, my, avoidRect, width, height);
      p.draw(ctx);
    });

    feathers.forEach(f => {
      f.update(width, height);
      f.draw(ctx);
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
