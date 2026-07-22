import { state } from '../core/state.js';
import { HOUSES } from '../core/constants.js';
import { trapFocus } from '../core/helpers.js';
import { playCrackSound, playScrollSound, startAmbientWaves, stopAmbientWaves } from '../audio/ambience.js';
import { adjustAudioToState } from '../audio/adaptiveMusic.js';
import { startWishCeremony } from './wishCeremony.js';
import { startCastleAwakeningSequence } from './castleReveal.js';
import { revealHogwartsLetter } from './narrative.js';
import { startMusic } from '../ui/buttons.js';
import { triggerOwlDelivery } from '../ui/modal.js';

let _sealBurstActive = false;
let _confettiBurstActive = false;

export function burstSealParticles(cx, cy) {
  if (_sealBurstActive) return;
  _sealBurstActive = true;
  setTimeout(() => { _sealBurstActive = false; }, 800);

  const count = 18;
  const houseColor = state.ui.currentHouseAccent || "#D3A625";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "seal-crack";
    const angle = (i / count) * 360 + Math.random() * 20;
    const dist = Math.random() * 55 + 25;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    const dur = (Math.random() * 0.35 + 0.55).toFixed(2);
    const size = Math.random() * 5 + 3;

    p.style.cssText = `
      left: ${cx}px;
      top:  ${cy}px;
      width: ${size}px;
      height: ${size}px;
      background: ${houseColor};
      box-shadow: 0 0 8px ${houseColor};
      --sc-tx: ${tx.toFixed(0)}px;
      --sc-ty: ${ty.toFixed(0)}px;
      --sc-dur: ${dur}s;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), parseFloat(dur) * 1000 + 100);
  }
}

export function spawnConfetti() {
  if (_confettiBurstActive) return;
  _confettiBurstActive = true;
  setTimeout(() => { _confettiBurstActive = false; }, 3200);

  const housePrimary = state.ui.currentHousePrimary || "#740001";
  const houseAccent = state.ui.currentHouseAccent || "#D3A625";
  const colors = [
    housePrimary,
    houseAccent,
    "#ffd700",
    "#ffffff",
    "#e8643a",
    "#ffffffcc",
    "#f5c842",
  ];
  const shapes = ["50%", "3px", "2px"];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 45; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = Math.random() * 9 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const radius = shapes[Math.floor(Math.random() * shapes.length)];
    const angle = Math.random() * 360;
    const dist = Math.random() * 230 + 70;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist + Math.random() * 180;
    const dur = (Math.random() * 1.4 + 1.7).toFixed(2);
    const delay = (Math.random() * 0.35).toFixed(2);
    const rot = Math.random() * 640 - 320;

    piece.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      width: ${size}px;
      height: ${size * (Math.random() * 0.5 + 0.5)}px;
      background: ${color};
      --cf-tx: ${tx.toFixed(0)}px;
      --cf-ty: ${ty.toFixed(0)}px;
      --cf-dur: ${dur}s;
      --cf-delay: ${delay}s;
      --cf-rot: ${rot}deg;
      --cf-radius: ${radius};
    `;
    document.body.appendChild(piece);
    setTimeout(
      () => piece.remove(),
      (parseFloat(dur) + parseFloat(delay) + 0.2) * 1000
    );
  }
}

export function initEnvelope() {
  const wrapper = document.getElementById("envelope-wrapper");
  const envelope = document.getElementById("envelope");
  const overlay = document.getElementById("scroll-overlay");
  const paper = document.getElementById("scroll-paper");
  const closeBtn = document.getElementById("scroll-close");
  const msgEl = document.getElementById("scroll-message");
  const sigEl = document.getElementById("scroll-signature");
  const hint = document.getElementById("envelope-hint");
  const seal = document.getElementById("env-seal");

  if (!wrapper || !envelope || !overlay) return;

  function triggerCinematicUnseal() {
    document.body.classList.add("screen-shake");
    setTimeout(() => {
      document.body.classList.remove("screen-shake");
    }, 280);

    const flash = document.createElement("div");
    flash.id = "spell-flash";
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = "0.95";
      setTimeout(() => {
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 250);
      }, 40);
    });
  }

  function triggerEnvelopeMorph() {
    const envArea = document.getElementById("envelope-area");
    const envelope = document.getElementById("envelope");
    const wrapper = document.getElementById("envelope-wrapper");
    const hint = document.getElementById("envelope-hint");
    const sealLetter = document.getElementById("env-seal-letter");
    
    if (!envArea || !envelope || !wrapper) return;
    
    wrapper.style.pointerEvents = "none";
    
    setTimeout(() => {
      envArea.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      envArea.style.opacity = "0";
      envArea.style.transform = "scale(0.95)";
      
      setTimeout(() => {
        envelope.classList.add("eyes-only");
        wrapper.classList.add("eyes-only");
        
        const addrTo = document.querySelector(".env-address-to");
        const addrName = document.querySelector(".env-address-name");
        const addrLine2 = document.querySelector(".env-address-line2");
        
        if (addrTo) addrTo.textContent = "Personal:";
        if (addrName) addrName.textContent = window._bdContent?.friendName || "Ayushi Mishra";
        if (addrLine2) addrLine2.textContent = "For Your Eyes Only";
        
        if (sealLetter) sealLetter.textContent = "❤";
        
        if (hint) {
          hint.textContent = "A secret letter has appeared... Tap to unseal ✦";
          hint.style.opacity = "1";
        }
        
        envelope.classList.remove("open");
        state.story.opened = false;
        
        envArea.style.opacity = "1";
        envArea.style.transform = "scale(1)";
        
        setTimeout(() => {
          const areaRect = envArea.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: {
              x: areaRect.left + areaRect.width / 2,
              y: areaRect.top + areaRect.height / 2
            }
          }));
          wrapper.style.pointerEvents = "auto";
        }, 500);
        
      }, 850);
    }, 900);
  }

  function openEnvelope(e) {
    const savedHouse = sessionStorage.getItem('selectedHouse');
    const houseOverlay = document.getElementById('house-selector-overlay');

    if (!savedHouse && houseOverlay) {
      houseOverlay.style.display = 'flex';
      void houseOverlay.offsetWidth;
      houseOverlay.classList.remove('hidden');
      houseOverlay.style.opacity = '1';
      houseOverlay.style.visibility = 'visible';
      startMusic();
      return;
    }

    startMusic();
    
    const isPersonal = envelope.classList.contains("eyes-only");
    const closeBtn = document.getElementById("scroll-close");
    
    if (state.story.opened) {
      overlay.classList.add("open");
      document.body.classList.add("letter-open", "modal-open");
      startAmbientWaves();
      setTimeout(() => {
        if (closeBtn) closeBtn.focus();
      }, 150);
      setTimeout(() => {
        if (paper) {
          paper.classList.add("unfolded");
          playScrollSound();
          
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2
            }
          }));
        }
      }, 200);
      return;
    }
    state.story.opened = true;

    let sealCx = window.innerWidth / 2;
    let sealCy = window.innerHeight / 2;
    if (seal) {
      const sealRect = seal.getBoundingClientRect();
      if (sealRect.width > 0) {
        sealCx = sealRect.left + sealRect.width / 2;
        sealCy = sealRect.top + sealRect.height / 2;
      }
    }

    burstSealParticles(sealCx, sealCy);
    playCrackSound();

    setTimeout(() => {
      envelope.classList.add("open");
    }, 40);

    if (hint) {
      hint.style.transition = "opacity 0.4s ease";
      hint.style.opacity = "0";
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('envelopeTapped', {
      detail: {
        x: wrapperRect.left + wrapperRect.width / 2,
        y: wrapperRect.top + wrapperRect.height / 2
      }
    }));

    setTimeout(() => {
      overlay.classList.add("open");
      document.body.classList.add("letter-open");
      adjustAudioToState('letter-open');
      startAmbientWaves();
      setTimeout(() => {
        if (closeBtn) closeBtn.focus();
      }, 100);

      setTimeout(() => {
        if (paper) {
          paper.classList.add("unfolded");
          playScrollSound();
          
          window.dispatchEvent(new CustomEvent('envelopeTapped', {
            detail: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2
            }
          }));
        }
      }, 80);

      spawnConfetti();

      const titleEl = document.getElementById('scroll-title');
      if (titleEl) {
        titleEl.style.display = 'none';
      }

      const c2 = window._bdContent || {};
      let msg = "";
      
      if (isPersonal) {
        msg = c2.eyesOnlyMessage || `Dear ${c2.friendName || "Ayushi"}, Happy Birthday!`;
        overlay.classList.add("eyes-only-modal");
        
        const schoolNameEl = overlay.querySelector(".hogwarts-school-name");
        const headmistressEl = overlay.querySelector(".hogwarts-headmistress");
        const dividerEl = overlay.querySelector(".hogwarts-divider");
        const mottoEl = overlay.querySelector(".hogwarts-motto-sub");
        
        if (schoolNameEl) schoolNameEl.textContent = "A Message For Your Eyes Only";
        if (headmistressEl) headmistressEl.innerHTML = "<em>Confidential & Private</em>";
        if (dividerEl) dividerEl.textContent = "· · · ❤️ · · ·";
        if (mottoEl) mottoEl.innerHTML = "<em>Amor Vincit Omnia</em>";
      } else {
        const currentHouseKey = (state.ui.currentHouse || 'slytherin').toLowerCase();
        const houseMsgKey = `${currentHouseKey}Message`;
        msg = c2[houseMsgKey] || c2.slytherinMessage || '';
        overlay.classList.remove("eyes-only-modal");
      }

      // Fast, immediate letter reveal — no long delays
      revealHogwartsLetter(msgEl, msg, sigEl);
    }, 250);
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.classList.remove("letter-open", "modal-open");
    stopAmbientWaves();
    if (paper) paper.classList.remove("unfolded");
    
    if (wrapper) wrapper.focus();
    
    state.story.firstLetterRead = true;

    if (!state.system.reducedMotion && !state.story.ceremonyRun) {
      state.story.ceremonyRun = true;
      setTimeout(startWishCeremony, 500);
    } else {
      adjustAudioToState('closed');
    }
  }

  trapFocus(overlay);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  wrapper.addEventListener("touchend", (e) => {
    e.preventDefault();
    openEnvelope(e);
  });
  wrapper.addEventListener("click", openEnvelope);
  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope(e);
    }
  });

  overlay.addEventListener("touchend", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      closeModal();
    }
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  window.addEventListener('houseChanged', (e) => {
    if (state.story.opened && msgEl) {
      const c2 = window._bdContent || {};
      const newHouse = e.detail.house;
      const houseCfg = HOUSES[newHouse] || HOUSES.gryffindor;
      const msg = c2[houseCfg.message] || c2.slytherinMessage || '';
      
      const titleEl = document.getElementById('scroll-title');
      if (titleEl) {
        titleEl.style.display = 'none';
      }
      
      revealHogwartsLetter(msgEl, msg, sigEl);
      startAmbientWaves();
    }
  });
}
