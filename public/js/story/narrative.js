import { spawnSparkCluster } from '../animation/particles.js';

export function makeMsgLiving(rawMsg) {
  if (!rawMsg) return rawMsg;
  
  const hour = new Date().getHours();
  let timeGreeting = "";
  if (hour >= 5 && hour < 12) {
    timeGreeting = "A quiet morning greeting.\n\n";
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = "Good afternoon.\n\n";
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = "Good evening, as the shadows lengthen over the towers.\n\n";
  } else {
    timeGreeting = "A quiet night greeting, under the silver moon.\n\n";
  }

  let visits = parseInt(localStorage.getItem("visitCount") || "0");
  let welcomeBackLine = "";
  let psFragment = "";
  
  if (visits > 1) {
    welcomeBackLine = "The castle walls seem warmer, remembering your presence here. ";
    
    const psOptions = [
      "P.S. The owls in the west tower were whispering about your return today.",
      "P.S. I left a small spark of Lumos on the observatory railing for you.",
      "P.S. A stray silver feather landed on the desk, glowing faintly with your name.",
      "P.S. The Great Hall candles bobbed twice in welcome as you crossed the threshold."
    ];
    const optionIdx = (visits - 2) % psOptions.length;
    psFragment = `\n\n_${psOptions[optionIdx]}_`;
  }
  
  let paragraphs = rawMsg.split('\n').filter(p => p.trim() !== '');
  
  if (paragraphs[0]) {
    paragraphs[0] = timeGreeting + paragraphs[0];
  }
  
  if (paragraphs[1] && welcomeBackLine) {
    paragraphs[1] = welcomeBackLine + paragraphs[1];
  }
  
  if (psFragment && paragraphs.length >= 2) {
    paragraphs.splice(paragraphs.length - 2, 0, psFragment.trim());
  }
  
  return paragraphs.join('\n\n');
}

export function _injectDropCapAndRender(el, text) {
  if (!el || !text) return;
  el.innerHTML = '';

  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  const dropCapParaIdx = paragraphs.length > 2 ? 1 : 0;
  const pElements = [];

  paragraphs.forEach((para, pIdx) => {
    const pEl = document.createElement('p');
    pEl.className = 'magic-paragraph fade-phantom';

    const isSignatureBlock = (pIdx === paragraphs.length - 1);
    const isClosingSalutation = (pIdx === paragraphs.length - 2 && para.trim().startsWith('With') && para.length < 80);

    if (isSignatureBlock || isClosingSalutation) {
      pEl.style.textAlign = 'right';
      pEl.style.paddingRight = '8%';
      pEl.style.marginTop = isSignatureBlock ? '0.4em' : '1.5em';
    }

    if (isSignatureBlock) {
      // Keep signature as a rendered SVG path animation (it's elegant and fast)
      const cleanName = para.trim().toLowerCase();
      if (cleanName.includes("mcgonagall") || cleanName.includes("minerva")) {
        pEl.innerHTML = `
          <svg class="sig-svg" viewBox="0 0 220 50" width="165" height="38">
            <path class="sig-path" d="M 12 36 C 22 22, 28 8, 32 15 C 38 28, 44 26, 50 36 C 56 12, 62 20, 68 34 Q 74 24, 82 28 Q 90 22, 98 32 Q 106 20, 114 28 T 130 25 T 142 30 T 154 22 L 168 36 L 175 14 L 180 38 L 186 28 Q 192 20, 198 34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>`;
      } else if (cleanName.includes("ani")) {
        pEl.innerHTML = `
          <svg class="sig-svg" viewBox="0 0 100 40" width="90" height="36">
            <path class="sig-path" d="M 12 32 C 22 8, 30 22, 38 28 T 54 18 T 72 26 Q 84 20, 92 34" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>`;
      } else {
        // Render short plain-text signature with Dancing Script
        pEl.style.fontFamily = "'Dancing Script', cursive";
        pEl.style.fontSize = "1.5rem";
        pEl.style.fontWeight = "bold";
        pEl.textContent = para;
      }
    } else if (pIdx === dropCapParaIdx) {
      // Drop-cap paragraph: first letter gets a styled span, rest is plain text
      const words = para.split(/\s+/).filter(Boolean);
      if (words[0] && words[0].length > 0) {
        const capEl = document.createElement('span');
        capEl.className = 'drop-cap';
        capEl.textContent = words[0][0];
        pEl.appendChild(capEl);
        // Append the rest of the paragraph as a plain text node
        const restText = (words[0].slice(1) + (words.length > 1 ? ' ' + words.slice(1).join(' ') : ''));
        pEl.appendChild(document.createTextNode(restText));
      } else {
        pEl.textContent = para;
      }
    } else {
      // All other paragraphs: plain text — renders instantly, no per-char loop
      pEl.textContent = para;
    }

    el.appendChild(pEl);
    pElements.push(pEl);
  });

  // Staggered paragraph fade-in: each paragraph appears ~120ms after the previous.
  // Total reveal time: ~120ms × paragraph count ≈ 0.5–1.0s for a full letter.
  const STAGGER_MS   = 120;   // delay between each paragraph appearing
  const FIRST_DELAY  = 80;    // initial pause after overlay opens

  pElements.forEach((pEl, idx) => {
    const delay = FIRST_DELAY + idx * STAGGER_MS;
    setTimeout(() => {
      pEl.classList.remove('fade-phantom');
      pEl.classList.add('writing');

      // Signature SVG: trigger stroke-dashoffset animation after fade-in starts
      const sigPath = pEl.querySelector('.sig-path');
      if (sigPath) {
        setTimeout(() => {
          sigPath.style.animation = 'writeSignature 1.6s cubic-bezier(0.42, 0, 0.58, 1) forwards';
        }, 120);
      }

      // Emit a small spark cluster on the drop-cap letter for magic feel
      if (pEl.querySelector('.drop-cap') && idx === 0) {
        const capEl = pEl.querySelector('.drop-cap');
        requestAnimationFrame(() => {
          const rect = capEl.getBoundingClientRect();
          if (rect.width > 0) {
            spawnSparkCluster(rect.left + rect.width / 2, rect.top + rect.height / 2, 2, false);
          }
        });
      }

      setTimeout(() => {
        pEl.classList.remove('writing');
        pEl.classList.add('finished');
      }, 500); // matches the CSS fade-in transition duration

    }, delay);
  });

  // After all paragraphs are shown, fire the subtle warmth pulse on the paper
  const totalRevealTime = FIRST_DELAY + pElements.length * STAGGER_MS + 520;
  setTimeout(() => {
    const paper = document.getElementById("scroll-paper");
    if (paper) {
      paper.classList.add("magic-glow-pulse");
      setTimeout(() => paper.classList.remove("magic-glow-pulse"), 1200);
    }
  }, totalRevealTime);
}

export function revealHogwartsLetter(msgEl, text, sigEl) {
  if (!msgEl) return;
  
  const livingText = makeMsgLiving(text || '');

  msgEl.style.animation = 'none';
  void msgEl.offsetHeight; 
  msgEl.style.animation = 'letterFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';

  _injectDropCapAndRender(msgEl, livingText);

  if (sigEl) {
    sigEl.style.display = 'none';
  }

  const inner = document.getElementById('scroll-inner');
  const paper = document.getElementById('scroll-paper');
  if (inner && paper) {
    inner.scrollTop = 0;
  }
}
