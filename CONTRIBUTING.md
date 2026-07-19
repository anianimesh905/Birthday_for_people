# Developer Contribution Guide

Welcome to the Hogwarts Birthday developer guide! This document explains how to extend and customize the codebase, including adding new scenes, custom soundtracks, and magical creatures.

---

## 🎨 Coding Standards & Rules

To maintain high visual performance and clean code quality:

1. **Zero External Dependencies**: Do not use npm packages, bundlers (like Webpack/Vite), or external JS libraries (like React/jQuery). Keep the project pure vanilla HTML5, CSS3, and ES6 JavaScript.
2. **Strict ES6 Modules**: Group files into logical modules under `public/js/` and load them via `import/export`.
3. **OKLCH Color Space**: Declare all colors using modern OKLCH coordinates (`oklch(L C H)`). This ensures perfect brightness matching across themes.
4. **Performance Pre-flight**: Avoid animating CSS layout properties that trigger layout reflows (like `width`, `height`, `margin`, `top`, `left`). Instead, animate GPU-accelerated CSS variables using `transform: translate3d/scale/rotate` and apply `will-change: transform` hints where needed.
5. **No Placeholders**: Do not check in unfinished templates or mock images.

---

## 🎬 How to Add a New Scene (Act)

To insert a new scene into the narrative timeline (e.g. adding an Act IV "Common Room Visit"):

### Step 1: Create the HTML Markup
Add the scene element inside `index.html` at the bottom of the body. Keep it hidden by default:
```html
<div id="common-room-modal" class="hidden" role="dialog" aria-modal="true">
  <div class="modal-card">
    <h3>Welcome to your House Common Room</h3>
    <button id="common-room-close">Exit</button>
  </div>
</div>
```

### Step 2: Write the Scene Styles
Add structural and keyframe styles inside `public/css/layout/commonRoom.css`:
```css
#common-room-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  z-index: 300;
}
#common-room-modal.hidden {
  display: none;
}
```
Import this new stylesheet inside [public/css/main.css](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/public/css/main.css):
```css
@import "./layout/commonRoom.css";
```

### Step 3: Implement the Scene Logic
Create `public/js/story/commonRoom.js` to manage the scene's interactive state:
```javascript
import { state } from '../core/state.js';
import { trapFocus } from '../core/helpers.js';

export function startCommonRoomScene() {
  const modal = document.getElementById("common-room-modal");
  const closeBtn = document.getElementById("common-room-close");
  if (!modal) return;

  modal.classList.remove("hidden");
  trapFocus(modal);

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  }, { once: true });
}
```

### Step 4: Hook into the Story Timeline
Update [envelope.js](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/public/js/story/envelope.js) (or whichever module completes the previous scene) to trigger your new act:
```javascript
import { startCommonRoomScene } from './commonRoom.js';

function closeModal() {
  // ... previous logic
  setTimeout(startCommonRoomScene, 1200); // trigger scene after closing letter
}
```

---

## 🦄 How to Add a New Magical Creature

All creatures are drawn onto the background canvas in `public/js/environment/ambienceManager.js`. To add a new creature (e.g. a "Golden Snitch"):

### Step 1: Create the Creature Class
Create a class file inside `public/js/effects/snitch.js` (or under `environment/`):
```javascript
import { rand } from '../core/helpers.js';

export class GoldenSnitch {
  constructor() {
    this.x = rand(100, window.innerWidth - 100);
    this.y = rand(100, window.innerHeight - 100);
    this.size = 6;
    this.angle = 0;
  }
  
  update(mx, my, width, height) {
    // Avoid cursor movement physics
    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 80) {
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * 8;
      this.y += Math.sin(angle) * 8;
    }
    this.angle += 0.25; // flap wings
  }
  
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw gold body
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw silver wings
    ctx.strokeStyle = 'rgba(240, 240, 240, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const wingY = Math.sin(this.angle) * 8;
    ctx.moveTo(-this.size, 0);
    ctx.lineTo(-this.size - 8, wingY);
    ctx.moveTo(this.size, 0);
    ctx.lineTo(this.size + 8, wingY);
    ctx.stroke();
    
    ctx.restore();
  }
}
```

### Step 2: Register the Creature in the Loop
Import and instantiate your creature inside [ambienceManager.js](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/public/js/environment/ambienceManager.js):
```javascript
import { GoldenSnitch } from '../effects/snitch.js';

// Inside initAmbientAtmosphere():
const goldenSnitch = new GoldenSnitch();

// Inside the loop() function:
goldenSnitch.update(mx, my, width, height);
goldenSnitch.draw(ctx);
```

---

## 🎵 How to Add a New Soundtrack

To add a new background song that changes based on themes:

### Step 1: Add the Audio File
Place the new audio file inside `public/assets/audio/` (e.g. `public/assets/audio/common_room.mp3`).

### Step 2: Define in Constants
Register the audio path and name inside `public/js/core/constants.js`.

### Step 3: Reference in State Changes
Trigger the track swap in `public/js/audio/adaptiveMusic.js`:
```javascript
export function playTrack(url) {
  if (!window.bgMusic) return;
  
  // Fade out old track
  window.bgMusicGain.gain.linearRampToValueAtTime(0.0001, window.bgMusic.context.currentTime + 1.0);
  
  setTimeout(() => {
    window.bgMusic.src = url;
    window.bgMusic.load();
    window.bgMusic.play().then(() => {
      // Fade in new track
      window.bgMusicGain.gain.linearRampToValueAtTime(0.5, window.bgMusic.context.currentTime + 1.5);
    });
  }, 1000);
}
```
Ensure you handle audio transitions inside user interaction handlers to comply with browser autoplay restrictions.
