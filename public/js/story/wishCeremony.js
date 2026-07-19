import { adjustAudioToState } from '../audio/adaptiveMusic.js';
import { playWishChime } from '../audio/ceremony.js';
import { state } from '../core/state.js';
import { spawnSparkCluster } from '../animation/particles.js';

export function startWishCeremony() {
  const overlayText = document.getElementById("ceremony-text-container");
  const textContent = document.getElementById("ceremony-text-content");
  const moonBeam = document.getElementById("moon-beam");
  const candles = document.querySelectorAll(".ambient-candle");

  if (!overlayText || !textContent) return;

  document.body.classList.add("ceremony-active");
  overlayText.classList.remove("hidden");
  overlayText.style.opacity = "1";

  adjustAudioToState('ceremony');
  setTimeout(() => {
    if (state.audio.music && document.body.classList.contains("ceremony-active")) {
      state.audio.music.pause();
    }
  }, 4200);

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

  const prompts = [
    { text: "Before you leave...", delay: 2000, duration: 4000 },
    { text: "Close your eyes...", delay: 7500, duration: 4000 },
    { text: "Make one wish.", delay: 13000, duration: -1 }
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
        setTimeout(() => {
          overlayText.classList.add("active");
        }, 1200);
      }
    }, p.delay);
  });

  function handleWishTap(e) {
    e.preventDefault();
    e.stopPropagation();

    overlayText.classList.remove("active");
    overlayText.removeEventListener("click", handleWishTap);
    overlayText.removeEventListener("touchend", handleWishTap);

    textContent.classList.remove("visible");

    playWishChime();

    if (moonBeam) moonBeam.classList.add("active");

    document.body.classList.add("ceremony-tapped");

    state.environment.constellationProgress = 0;
    state.environment.ceremonyConstellationActive = true;

    for (let i = 0; i < 90; i++) {
      setTimeout(() => {
        const rx = Math.random() * window.innerWidth;
        const ry = window.innerHeight - 30 - Math.random() * 50;
        spawnSparkCluster(rx, ry, 1, false);
      }, i * 35);
    }

    setTimeout(() => {
      if (moonBeam) moonBeam.classList.remove("active");
      state.environment.ceremonyConstellationActive = false;

      overlayText.style.opacity = "0";

      setTimeout(() => {
        overlayText.classList.add("hidden");
        document.body.classList.remove("ceremony-active", "ceremony-tapped");

        candles.forEach(candle => {
          candle.style.left = "";
          candle.style.top = "";
          candle.style.animation = "";
          candle.style.transition = "";
        });

        if (state.audio.music) {
          state.audio.music.play().then(() => {
            adjustAudioToState('closed');
          }).catch(() => {});
        } else {
          adjustAudioToState('closed');
        }
      }, 2000);

    }, 8500);
  }

  overlayText.addEventListener("click", handleWishTap);
  overlayText.addEventListener("touchend", handleWishTap);
}
