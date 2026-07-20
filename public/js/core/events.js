import { state } from './state.js';
import { rand } from './helpers.js';
import { spawnSparkCluster } from '../animation/particles.js';

let _lastTrailSpawnTime = 0;
let _lastTrailX = 0;
let _lastTrailY = 0;
let _lerpRunning = false;

function handlePointerMove(e) {
  const touch = e.touches ? e.touches[0] : e;
  const x = touch.clientX;
  const y = touch.clientY;

  state.pointer.targetX = x;
  state.pointer.targetY = y;

  if (state.story.opened && Math.random() < 0.14 && state.spells.isLumosActive) {
    window.dispatchEvent(new CustomEvent('envelopeTapped', {
      detail: { x: x, y: y }
    }));
  }

  // Trigger immediate trail checks on pointer move
  const now = performance.now();
  const timeDelta = now - _lastTrailSpawnTime;
  const dx = x - _lastTrailX;
  const dy = y - _lastTrailY;
  const distance = Math.sqrt(dx*dx + dy*dy);

  if (state.spells.activeMode && state.spells.activeMode !== 'none' && state.spells.activeMode !== 'patronus') {
    if (timeDelta > 60 || distance > 25) {
      spawnSparkCluster(x, y, Math.floor(rand(1, 3)), false);
      _lastTrailSpawnTime = now;
      _lastTrailX = x;
      _lastTrailY = y;
    }
  }
}

function handleResize() {
  state.system.width = window.innerWidth;
  state.system.height = window.innerHeight;
}

function handleVisibilityChange() {
  state.system.isVisible = !document.hidden;
  const isHidden = document.hidden;
  
  const videos = document.querySelectorAll('video');
  videos.forEach(v => {
    if (isHidden) {
      if (v.play && !v.paused) v.pause();
    } else {
      const isLetterOpen = document.body && document.body.classList.contains('letter-open');
      const isLowPower = state.system && state.system.isLowPowerDevice;
      const shouldPlay = !(isLetterOpen && isLowPower);
      if (shouldPlay && v.play && v.paused) {
        v.play().catch(() => {});
      }
    }
  });
}

function handleFocus() {
  state.system.isFocused = true;
}

function handleBlur() {
  state.system.isFocused = false;
}

function handleNetworkOnline() {
  state.system.isOnline = true;
}

function handleNetworkOffline() {
  state.system.isOnline = false;
}

// Single continuous LERP execution loop for pointer position smoothing
function startPointerLerpLoop() {
  if (_lerpRunning) return;
  _lerpRunning = true;
  
  function update() {
    if (document.hidden) {
      requestAnimationFrame(update);
      return;
    }
    const ease = 0.16; // Standard delay LERP parameter
    state.pointer.x += (state.pointer.targetX - state.pointer.x) * ease;
    state.pointer.y += (state.pointer.targetY - state.pointer.y) * ease;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

export function initCentralEvents() {
  window.addEventListener("mousemove", handlePointerMove, { passive: true });
  window.addEventListener("touchmove", handlePointerMove, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
  window.addEventListener("focus", handleFocus, { passive: true });
  window.addEventListener("blur", handleBlur, { passive: true });
  window.addEventListener("online", handleNetworkOnline, { passive: true });
  window.addEventListener("offline", handleNetworkOffline, { passive: true });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  state.system.reducedMotion = motionQuery.matches;
  
  // Safe listener for prefers-reduced-motion checks
  try {
    motionQuery.addEventListener('change', (e) => {
      state.system.reducedMotion = e.matches;
    });
  } catch (err) {
    // Older Safari fallback
    motionQuery.addListener((e) => {
      state.system.reducedMotion = e.matches;
    });
  }

  // MutationObserver to pause videos when the letter is open on low-power devices
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isLetterOpen = document.body && document.body.classList.contains('letter-open');
          const isLowPower = state.system && state.system.isLowPowerDevice;
          if (isLetterOpen && isLowPower) {
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
              if (v.play && !v.paused) v.pause();
            });
          } else if (!isLetterOpen && !document.hidden && state.system.isVisible) {
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
              if (v.play && v.paused) {
                v.play().catch(() => {});
              }
            });
          }
        }
      });
    });
    if (document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      });
    }
  }

  startPointerLerpLoop();
}
