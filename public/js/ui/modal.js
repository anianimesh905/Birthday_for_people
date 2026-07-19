import { state } from '../core/state.js';
import { HOUSES } from '../core/constants.js';
import { trapFocus } from '../core/helpers.js';
import { loadHouseVideo } from '../core/config.js';
import { startMusic } from './buttons.js';

let toastTimer = null;

export function showHouseToast(cfg, key) {
  const toast = document.getElementById('house-toast');
  if (!toast) return;

  const emojis = {
    gryffindor: '🦁',
    slytherin: '🐍',
    ravenclaw: '🦅',
    hufflepuff: '🦡'
  };
  const emoji = emojis[key] || '✦';

  toast.textContent = `The Sorting Hat has chosen… ${cfg.label}! ${emoji}`;
  toast.style.background = cfg.toastBg;
  toast.style.color = cfg.toastColor || '#ffffff';
  toast.style.borderColor = cfg.accent + '66';

  clearTimeout(toastTimer);
  toast.classList.remove('visible');
  void toast.offsetWidth;
  toast.classList.add('visible');

  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

export function updateSealForHouse(houseName) {
  const key = (houseName || '').toLowerCase();
  const initials = {
    gryffindor: 'G',
    slytherin:  'S',
    ravenclaw:  'R',
    hufflepuff: 'H'
  };

  const sealLetter = document.getElementById('env-seal-letter');
  if (sealLetter) {
    sealLetter.textContent = initials[key] || 'H';
  }
}

export function triggerOwlDelivery() {
  const owl1 = document.querySelector('.owl-1');
  if (!owl1) return;
  owl1.classList.add('owl-delivering');
  setTimeout(() => owl1.classList.remove('owl-delivering'), 800);
}

export function selectHouse(houseName, opts = {}) {
  const key = (houseName || '').toLowerCase();
  const cfg = HOUSES[key];
  if (!cfg) return;

  const { siteContent, silent } = opts;
  state.ui.currentHouse = key;
  state.ui.currentHousePrimary = cfg.primary;
  state.ui.currentHouseAccent = cfg.accent;

  document.body.className = document.body.className
    .replace(/\btheme-\w+/g, '')
    .trim();
  document.body.classList.add(`theme-${key}`);

  const root = document.documentElement;
  root.style.setProperty('--house-primary', cfg.primary);
  root.style.setProperty('--house-accent',  cfg.accent);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', cfg.primary);
  }

  document.querySelectorAll('.house-badge').forEach(b => {
    const bHouse = b.getAttribute('data-house');
    const isActive = bHouse === key;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-checked', String(isActive));
    
    if (isActive && !silent) {
      b.classList.add('pop-active');
      const bImg = b.querySelector('.badge-img');
      if (bImg) {
        bImg.classList.remove('spinning');
        void bImg.offsetWidth;
        bImg.classList.add('spinning');
        bImg.addEventListener('animationend', () => bImg.classList.remove('spinning'), { once: true });
      }
      setTimeout(() => b.classList.remove('pop-active'), 400);
    }
  });

  updateSealForHouse(key);

  window.dispatchEvent(new CustomEvent('houseChanged', { 
    detail: { house: key, primary: cfg.primary, accent: cfg.accent } 
  }));

  if (!silent) {
    showHouseToast(cfg, key);
  }
}

export function initHouseSelector(siteContent) {
  const overlay = document.getElementById('house-selector-overlay');
  const badges = document.querySelectorAll('.house-badge');
  if (!overlay) return;

  trapFocus(overlay);

  const savedHouse = sessionStorage.getItem('selectedHouse');

  if (savedHouse) {
    overlay.style.display = 'none';
    overlay.classList.add('hidden');
    selectHouse(savedHouse, { siteContent, silent: true });
  } else {
    overlay.style.display = 'flex';
    void overlay.offsetWidth;
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    
    const defaultHouse = ((siteContent && siteContent.defaultHouse) || 'Slytherin').toLowerCase();
    selectHouse(defaultHouse, { siteContent, silent: true });
    
    setTimeout(() => {
      const defaultBadge = Array.from(badges).find(b => b.getAttribute('data-house') === defaultHouse);
      if (defaultBadge) defaultBadge.focus();
    }, 200);
  }

  badges.forEach(badge => {
    const house = badge.getAttribute('data-house');
    
    const handleSelection = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      sessionStorage.setItem('selectedHouse', house);
      selectHouse(house, { siteContent, silent: false });
      
      overlay.classList.add('hidden');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 600);
      
      startMusic();
    };

    badge.addEventListener('click', handleSelection);
  });

  const switcherBtn = document.getElementById('house-switch-btn');
  if (switcherBtn) {
    const handleSwitch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      overlay.style.display = 'flex';
      void overlay.offsetWidth;
      overlay.classList.remove('hidden');
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      
      startMusic();
    };
    
    switcherBtn.addEventListener('click', handleSwitch);
  }
}
