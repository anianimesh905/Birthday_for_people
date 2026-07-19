export function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export function trapFocus(modalEl) {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  modalEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    const focusables = Array.from(modalEl.querySelectorAll(focusableSelectors))
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
      
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

export function rand(min, max) { 
  return min + Math.random() * (max - min); 
}
