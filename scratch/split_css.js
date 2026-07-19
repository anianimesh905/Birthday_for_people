const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'style.css');
if (!fs.existsSync(srcPath)) {
  console.error("style.css not found!");
  process.exit(1);
}

const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split('\n');

console.log("Analyzing style.css structure...");
const sections = {};
let currentSection = 'default';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('Reset & Core Defaults')) {
    currentSection = 'public/css/base/reset.css';
  } else if (line.includes('CSS Custom Properties & House Tokens')) {
    currentSection = 'public/css/base/variables.css';
  } else if (line.includes('Immersive Video Background')) {
    currentSection = 'public/css/layout/landing.css';
  } else if (line.includes('Immersive Scroll Reveals') || line.includes('Layout & Viewport Configuration')) {
    currentSection = 'public/css/layout/app.css';
  } else if (line.includes('HOGWARTS OWL POST ENVELOPE')) {
    currentSection = 'public/css/layout/envelope.css';
  } else if (line.includes('HOGWARTS PARCHMENT SCROLL MODAL') || line.includes('SCROLLBAR FOR PARCHMENT SCROLL') || line.includes('ENVELOPE OPEN CONFETTI') || line.includes('SEAL CRACK FLYING DUST')) {
    currentSection = 'public/css/layout/parchment.css';
  } else if (line.includes('CENTER GLASSMORPHIC HOUSE SELECTOR OVERLAY') || line.includes('BOTTOM SHEET ACCESSIBLE SPELLS SELECTOR') || line.includes('TREASURE CHEST')) {
    currentSection = 'public/css/layout/modal.css';
  } else if (line.includes('HOUSE TOAST NOTIFICATION') || line.includes('MUSIC TOGGLE BUTTON')) {
    currentSection = 'public/css/layout/landing.css';
  } else if (line.includes('DYNAMIC SPARKLE CANVAS')) {
    currentSection = 'public/css/ambience/particles.css';
  } else if (line.includes('ACCESSIBILITY FOCUS INDICATORS')) {
    currentSection = 'public/css/base/utilities.css';
  } else if (line.includes('PRELOADING SCREEN')) {
    currentSection = 'public/css/layout/landing.css';
  } else if (line.includes('MOBILE & SCREEN ORIENTATION MEDIA QUERIES') || line.includes('MOBILE & ANDROID PERFORMANCE OPTIMIZATIONS')) {
    currentSection = 'public/css/layout/responsive.css';
  } else if (line.includes('MARAUDER\'S MAP FOOTSTEPS')) {
    currentSection = 'public/css/layout/landing.css';
  } else if (line.includes('CINEMATIC FLASH & SHAKE ON UNSEAL')) {
    currentSection = 'public/css/layout/app.css';
  } else if (line.includes('LUMOS SPELL FLASHLIGHT EFFECT') || line.includes('ELEMENTAL SPELLS OVERLAYS') || line.includes('🚪 BOTTOM SHEET ACCESSIBLE SPELLS') || line.includes('EXSPECTO PATRONUM') || line.includes('PRISMA RAINBOW') || line.includes('STELLARIS STAR SYSTEM') || line.includes('Android Optimized Spells Styling')) {
    currentSection = 'public/css/layout/modal.css';
  } else if (line.includes('Mist Canvas') || line.includes('Ice Canvas') || line.includes('Botanical Border') || line.includes('Stone Border') || line.includes('Fire Strip') || line.includes('Accio Card Summon') || line.includes('Ventus Cyclone') || line.includes('Prisma Flying Box')) {
    currentSection = 'public/css/layout/modal.css';
  } else if (line.includes('Ambient Atmosphere Styling')) {
    currentSection = 'public/css/ambience/weather.css';
  } else if (line.includes('Cinematic Sequence Styling')) {
    currentSection = 'public/css/layout/landing.css';
  } else if (line.includes('Living Magical Scroll Styles')) {
    currentSection = 'public/css/layout/parchment.css';
  } else if (line.includes('Birthday Wish Ceremony Styles')) {
    currentSection = 'public/css/layout/parchment.css';
  }
  
  if (!sections[currentSection]) {
    sections[currentSection] = [];
  }
  sections[currentSection].push(line);
}

for (const [file, fileLines] of Object.entries(sections)) {
  if (file === 'default') continue;
  
  const destPath = path.join(__dirname, '..', file);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  console.log(`Writing ${file} (${fileLines.length} lines)...`);
  fs.writeFileSync(destPath, fileLines.join('\n'), 'utf8');
}

const requiredFiles = {
  'public/css/base/typography.css': `/* Typography styles */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Dancing+Script:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Jost:wght@200;300;400&display=swap');
body {
  font-family: 'Jost', sans-serif;
}`,
  'public/css/base/animations.css': `/* Keyframe animations */
@keyframes letterFadeIn {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes writeSignature {
  to { stroke-dashoffset: 0; }
}
@keyframes magic-glow-pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.28); }
  50% { box-shadow: 0 0 35px rgba(212, 175, 55, 0.72); }
}`,
  'public/css/layout/castle.css': `/* Castle layout styles */
#ambient-castle-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  pointer-events: none;
  z-index: 3;
}
#ambient-castle {
  width: 100%;
  height: 100%;
  fill: #050814;
}
.castle-window {
  fill: rgba(255, 235, 59, 0);
  transition: fill 2.5s ease-in-out;
}
.castle-window.active {
  fill: rgba(255, 215, 0, 0.95);
  filter: drop-shadow(0 0 4px #ffd54f);
}`,
  'public/css/ambience/fog.css': `/* Volumetric fog */
#volumetric-fog-1, #volumetric-fog-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 120px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.35;
  background: linear-gradient(to top, rgba(20, 25, 45, 0.48), transparent);
}`,
  'public/css/ambience/moon.css': `/* Moon glow styling */
#ambient-moon-glow {
  position: absolute;
  top: 5%;
  right: 8%;
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 1;
}`,
  'public/css/ambience/candles.css': `/* Floating candles */
#ambient-candles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}
.ambient-candle {
  position: absolute;
  width: 8px;
  height: 25px;
  background: rgba(255, 255, 245, 0.88);
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(255,255,240,0.5);
}`,
  'public/css/ambience/clouds.css': `/* Parallax clouds */
.bg-cloud {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  opacity: 0.15;
}`,
  'public/css/ambience/creatures.css': `/* Creatures styling */
.curious-owl {
  pointer-events: none;
}`,
  'public/css/ambience/weather.css': `/* Weather layers */
#time-of-day-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}`
};

for (const [file, defaultContent] of Object.entries(requiredFiles)) {
  const destPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(destPath)) {
    console.log(`Creating required file ${file}...`);
    fs.writeFileSync(destPath, defaultContent, 'utf8');
  }
}

console.log("CSS split finished successfully!");
