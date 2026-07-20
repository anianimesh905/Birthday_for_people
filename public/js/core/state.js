// Heuristic to detect low-power / older mobile devices
function checkIsLowPower() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobileOrTablet) {
    // Underpowered CPU cores (<= 4) or low RAM (< 4GB)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      return true;
    }
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return true;
    }
  }
  return false;
}

const isLowPowerHeuristic = checkIsLowPower();
if (isLowPowerHeuristic) {
  document.documentElement.classList.add('low-power');
  if (document.body) {
    document.body.classList.add('low-power');
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('low-power');
    });
  }
}

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
    maxParticlesLimit: isLowPowerHeuristic ? 30 : 80
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
    height: window.innerHeight,
    isLowPowerDevice: isLowPowerHeuristic,
    isBatterySaver: false
  }
};

if (navigator.getBattery) {
  navigator.getBattery().then(battery => {
    const updateBatteryStatus = () => {
      const isLow = battery.level < 0.20 && !battery.charging;
      state.system.isBatterySaver = isLow;
      if (isLow) {
        state.system.isLowPowerDevice = true;
        document.documentElement.classList.add('low-power');
        if (document.body) document.body.classList.add('low-power');
        state.spells.maxParticlesLimit = Math.min(state.spells.maxParticlesLimit, 30);
      } else {
        if (!isLowPowerHeuristic) {
          state.system.isLowPowerDevice = false;
          document.documentElement.classList.remove('low-power');
          if (document.body) document.body.classList.remove('low-power');
          state.spells.maxParticlesLimit = window.innerWidth < 768 ? 60 : 120;
        }
      }
    };
    updateBatteryStatus();
    battery.addEventListener('levelchange', updateBatteryStatus);
    battery.addEventListener('chargingchange', updateBatteryStatus);
  }).catch(() => {});
}

