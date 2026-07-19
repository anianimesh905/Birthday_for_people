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
        pEl.style.fontFamily = "'Dancing Script', cursive";
        pEl.style.fontSize = "1.5rem";
        pEl.style.fontWeight = "bold";
        
        para.split('').forEach(ch => {
          const span = document.createElement('span');
          span.className = 'magic-char';
          span.textContent = ch;
          pEl.appendChild(span);
        });
      }
    } else {
      if (pIdx === dropCapParaIdx) {
        const words = para.split(/\s+/).filter(Boolean);
        if (words[0] && words[0].length > 0) {
          const capEl = document.createElement('span');
          capEl.className = 'drop-cap magic-char';
          capEl.textContent = words[0][0];
          pEl.appendChild(capEl);

          const restOfFirst = words[0].slice(1);
          if (restOfFirst) {
            restOfFirst.split('').forEach(ch => {
              const span = document.createElement('span');
              span.className = 'magic-char';
              span.textContent = ch;
              pEl.appendChild(span);
            });
          }

          if (words.length > 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'magic-char';
            spaceSpan.textContent = ' ';
            pEl.appendChild(spaceSpan);
          }

          for (let i = 1; i < words.length; i++) {
            words[i].split('').forEach(ch => {
              const span = document.createElement('span');
              span.className = 'magic-char';
              span.textContent = ch;
              pEl.appendChild(span);
            });
            if (i < words.length - 1) {
              const spaceSpan = document.createElement('span');
              spaceSpan.className = 'magic-char';
              spaceSpan.textContent = ' ';
              pEl.appendChild(spaceSpan);
            }
          }
        }
      } else {
        para.split('').forEach(ch => {
          const span = document.createElement('span');
          span.className = 'magic-char';
          span.textContent = ch;
          pEl.appendChild(span);
        });
      }
    }

    el.appendChild(pEl);
    pElements.push(pEl);
  });

  let currentPIdx = 0;
  
  function writeParagraph() {
    if (currentPIdx >= pElements.length) {
      const paper = document.getElementById("scroll-paper");
      if (paper) {
        paper.classList.add("magic-glow-pulse");
        setTimeout(() => paper.classList.remove("magic-glow-pulse"), 1200);
      }
      return;
    }

    const pEl = pElements[currentPIdx];
    pEl.classList.remove('fade-phantom');
    pEl.classList.add('writing');

    const chars = pEl.querySelectorAll('.magic-char');
    const sigPath = pEl.querySelector('.sig-path');

    if (sigPath) {
      setTimeout(() => {
        sigPath.style.animation = 'writeSignature 2.2s cubic-bezier(0.42, 0, 0.58, 1) forwards';
        pEl.classList.remove('writing');
        pEl.classList.add('finished');
        currentPIdx++;
        setTimeout(writeParagraph, 1200);
      }, 350);
      return;
    }

    if (chars.length === 0) {
      pEl.classList.remove('writing');
      pEl.classList.add('finished');
      currentPIdx++;
      setTimeout(writeParagraph, 350);
      return;
    }

    let charIdx = 0;
    const isMobile = window.innerWidth < 768;
    const writeSpeed = isMobile ? 22 : 18;

    function writeChar() {
      if (charIdx >= chars.length) {
        pEl.classList.remove('writing');
        pEl.classList.add('finished');
        currentPIdx++;
        setTimeout(writeParagraph, 450);
        return;
      }

      const span = chars[charIdx];
      span.classList.add('written');

      if (Math.random() < 0.05) {
        const rect = span.getBoundingClientRect();
        spawnSparkCluster(rect.left + rect.width / 2, rect.top + rect.height / 2, 1, false);
      }

      charIdx++;
      setTimeout(writeChar, writeSpeed);
    }

    writeChar();
  }

  setTimeout(writeParagraph, 400);
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
