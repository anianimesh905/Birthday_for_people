export function updateMoonPhase() {
  const moonEl = document.getElementById("ambient-moon-glow");
  if (!moonEl) return;
  
  const reference = new Date("2000-01-06T18:14:00Z");
  const elapsed = (new Date() - reference) / (1000 * 60 * 60 * 24);
  const phase = (elapsed % 29.530588853) / 29.530588853; // 0.0 to 1.0
  
  let maskPath = "";
  if (phase < 0.5) {
    const pct = phase * 2;
    const rx = 20 * (1 - 2 * pct);
    maskPath = `M 20 0 A 20 20 0 0 1 20 40 A ${Math.abs(rx)} 20 0 0 ${rx < 0 ? 1 : 0} 20 0 Z`;
  } else {
    const pct = (phase - 0.5) * 2;
    const rx = 20 * (-1 + 2 * pct);
    maskPath = `M 20 0 A ${Math.abs(rx)} 20 0 0 ${rx < 0 ? 1 : 0} 20 40 A 20 20 0 0 1 20 0 Z`;
  }
  
  moonEl.innerHTML = `
    <svg viewBox="0 0 40 40" width="100%" height="100%" style="overflow: visible; filter: drop-shadow(0 0 25px rgba(255,255,240,0.85));">
      <circle cx="20" cy="20" r="18.5" fill="rgba(255, 255, 240, 0.04)" stroke="rgba(255,255,240,0.12)" stroke-width="0.5" />
      <circle cx="20" cy="20" r="18" fill="rgba(255, 255, 245, 0.95)" />
      <circle cx="12" cy="14" r="3" fill="rgba(0,0,0,0.06)" />
      <circle cx="28" cy="24" r="4.5" fill="rgba(0,0,0,0.05)" />
      <circle cx="16" cy="28" r="2.5" fill="rgba(0,0,0,0.07)" />
      <path d="${maskPath}" fill="#050814" opacity="0.94" />
    </svg>
  `;
}
