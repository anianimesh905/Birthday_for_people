import { onDOMReady } from './core/bootstrap.js';
import { incrementVisitCount } from './core/storage.js';
import { startPreloader } from './core/preloader.js';
import { resetChestToEnvelope, initTreasureBox, castSpellText } from './effects/spells.js';

window.fillSpell = function(el) {
  if (el) {
    const spellName = (el.dataset && el.dataset.spell) || el.textContent.trim().replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();
    castSpellText(spellName);
    
    const spellModal = document.getElementById("spell-modal");
    if (spellModal && spellModal.classList.contains("open")) {
      spellModal.classList.remove("open");
      if (window.location.hash === "#spell-modal") {
        history.back();
      }
      const spellBtn = document.getElementById("spell-btn");
      if (spellBtn) spellBtn.focus();
    }
  }
};

function init() {
  incrementVisitCount();
  startPreloader();
  initTreasureBox();

  const spellBtn = document.getElementById("spell-btn");
  const spellModal = document.getElementById("spell-modal");
  const spellClose = document.getElementById("spell-modal-close");
  const spellBg = document.getElementById("spell-modal-bg");

  if (spellBtn && spellModal) {
    const openSpellModal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      spellModal.classList.add("open");
      if (window.location.hash !== "#spell-modal") {
        history.pushState({ modalOpen: true }, "", "#spell-modal");
      }
    };

    const closeSpellModal = () => {
      spellModal.classList.remove("open");
      if (window.location.hash === "#spell-modal") {
        history.back();
      }
      if (spellBtn) spellBtn.focus();
    };

    spellBtn.addEventListener("click", openSpellModal);
    spellBtn.addEventListener("touchend", openSpellModal);

    if (spellClose) {
      spellClose.addEventListener("click", closeSpellModal);
      spellClose.addEventListener("touchend", (e) => {
        e.preventDefault();
        closeSpellModal();
      });
    }

    if (spellBg) {
      spellBg.addEventListener("click", closeSpellModal);
      spellBg.addEventListener("touchend", (e) => {
        e.preventDefault();
        closeSpellModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && spellModal.classList.contains("open")) {
        closeSpellModal();
      }
    });
  }

  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
      return;
    }
    e.preventDefault();
  });

  document.addEventListener("touchend", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
      return;
    }
  });
}

onDOMReady(init);

window.addEventListener("popstate", (e) => {
  const spellModal = document.getElementById("spell-modal");
  if (spellModal && spellModal.classList.contains("open") && window.location.hash !== "#spell-modal") {
    spellModal.classList.remove("open");
    const spellBtn = document.getElementById("spell-btn");
    if (spellBtn) spellBtn.focus();
  }

  const treasureOverlay = document.getElementById("treasure-overlay");
  if (treasureOverlay && !treasureOverlay.classList.contains("hidden") && window.location.hash !== "#treasure-overlay") {
    treasureOverlay.classList.add("hidden");
    resetChestToEnvelope();
    const chestWrapper = document.getElementById("treasure-chest-wrapper");
    if (chestWrapper) chestWrapper.focus();
  }
});
