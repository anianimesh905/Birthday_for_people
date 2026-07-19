export function updateTimeOfDayOverlay() {
  const overlay = document.getElementById("time-of-day-overlay");
  const moonEl = document.getElementById("ambient-moon-glow");
  if (!overlay) return;
  
  const h = new Date().getHours();
  let bg = "";
  let moonOpacity = "0";
  
  if (h >= 5 && h < 8) {
    // Sunrise
    bg = "linear-gradient(185deg, rgba(255, 110, 64, 0.25), rgba(93, 64, 55, 0.16), transparent 75%)";
  } else if (h >= 8 && h < 17) {
    // Afternoon
    bg = "linear-gradient(180deg, rgba(144, 202, 249, 0.06), transparent)";
  } else if (h >= 17 && h < 20) {
    // Sunset
    bg = "linear-gradient(185deg, rgba(230, 81, 0, 0.28), rgba(49, 27, 146, 0.15), transparent 70%)";
    moonOpacity = "0.45";
  } else {
    // Night
    bg = "rgba(4, 8, 20, 0.36)";
    moonOpacity = "1.0";
  }
  
  overlay.style.background = bg;
  if (moonEl) {
    moonEl.style.transition = "opacity 4s ease-in-out";
    moonEl.style.opacity = moonOpacity;
  }
}
