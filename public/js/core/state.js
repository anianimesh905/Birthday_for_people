export const state = {
  audio: {
    context: null,
    music: null,
    gain: null,
    filter: null,
    windGain: null,
    isMuted: false
  },
  story: {
    firstLetterRead: false,
    opened: false,
    chestUnlocked: false,
    revelioCast: false,
    castleAwakened: false,
    ceremonyRun: false
  },
  pointer: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2
  },
  spells: {
    activeMode: '',
    isLumosActive: false,
    maxParticlesLimit: 80
  },
  castle: {
    zoomingActive: false
  },
  environment: {
    ceremonyConstellationActive: false,
    constellationProgress: 0,
    currentWindTilt: 0,
    targetWindTilt: 0
  },
  ui: {
    currentHouse: 'slytherin',
    currentHouseAccent: '#D3A625',
    currentHousePrimary: '#740001'
  },
  system: {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isOnline: navigator.onLine,
    isVisible: !document.hidden,
    isFocused: document.hasFocus(),
    width: window.innerWidth,
    height: window.innerHeight
  }
};
