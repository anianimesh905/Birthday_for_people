import { state } from '../core/state.js';

export function initParallax() {
  let targetMx = 0;
  let targetMy = 0;
  let currentMx = 0;
  let currentMy = 0;

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
    
    if (state.system.reducedMotion || state.system.isLowPowerDevice) {
      requestAnimationFrame(updateParallax);
      return;
    }
    
    // Read smoothed central pointer coordinates instead of registering a duplicate mousemove listener
    const cx = state.system.width / 2;
    const cy = state.system.height / 2;
    const dx = state.pointer.x - cx;
    const dy = state.pointer.y - cy;
    
    // If device orientation hasn't taken over, use pointer coordinates
    if (targetMx === 0 && targetMy === 0) {
      targetMx = (dx / cx) * 100;
      targetMy = (dy / cy) * 100;
    }

    const diffX = targetMx - currentMx;
    const diffY = targetMy - currentMy;
    if (Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01) {
      currentMx += diffX * 0.08;
      currentMy += diffY * 0.08;
      document.documentElement.style.setProperty("--mx", currentMx.toFixed(2));
      document.documentElement.style.setProperty("--my", currentMy.toFixed(2));
    }
    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}

export function initMagneticButtons() {
  const buttons = document.querySelectorAll(".bottom-control-dock button");
  
  buttons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;
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

export function initScrollReveal() {
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
