import { stopAmbientWaves } from '../audio/ambience.js';

export function initSwipeDismiss() {
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
