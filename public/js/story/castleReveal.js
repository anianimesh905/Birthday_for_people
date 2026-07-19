import { revealHogwartsLetter } from './narrative.js';
import { state } from '../core/state.js';
import { triggerAwakeningOwls } from '../environment/ambienceManager.js';

let _choirOscillators = [];
let _choirGainNode = null;
let _choirAudioCtx = null;

export function playCastleBell() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    const freqs = [105, 212, 324.5, 480, 680];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      
      osc.frequency.linearRampToValueAtTime(f * 0.985, ctx.currentTime + 5.5);

      const oscGain = ctx.createGain();
      oscGain.gain.value = i === 0 ? 0.08 : 0.035;

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      osc.stop(ctx.currentTime + 6.0);
    });

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.05);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.8);

    filter.connect(mainGain);
    mainGain.connect(ctx.destination);
  } catch (e) {
    console.log("Bell synth failed:", e);
  }
}

export function startChoirDrone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    _choirAudioCtx = ctx;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 3.0);

    _choirGainNode = gain;
    _choirOscillators = [];

    const chords = [220, 221.4, 330, 440];
    chords.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(filter);
      osc.start();
      _choirOscillators.push(osc);
    });

    filter.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {
    console.log("Choir synth failed:", e);
  }
}

export function stopChoirDrone() {
  if (_choirGainNode && _choirAudioCtx) {
    try {
      _choirGainNode.gain.exponentialRampToValueAtTime(0.0001, _choirAudioCtx.currentTime + 2.5);
      setTimeout(() => {
        _choirOscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        _choirOscillators = [];
      }, 2600);
    } catch (e) {}
  }
}

export function startCastleAwakeningSequence(msgEl, msg, sigEl) {
  const paper = document.getElementById("scroll-paper");
  const closeBtn = document.getElementById("scroll-close");
  const castleWrapper = document.getElementById("ambient-castle-wrapper");
  const flames = document.querySelectorAll(".candle-flame");
  const windows = [".cw1", ".cw2", ".cw3", ".cw4", ".cw5", ".cw6"];

  if (!paper) {
    revealHogwartsLetter(msgEl, msg, sigEl);
    return;
  }

  paper.classList.add("cinematic-dim");
  if (closeBtn) closeBtn.style.display = "none";

  if (castleWrapper) castleWrapper.classList.add("zoomed-in");

  if (state.audio.music) {
    state.audio.music.volume = 0.05;
  }

  playCastleBell();
  startChoirDrone();

  flames.forEach((flame, idx) => {
    setTimeout(() => {
      flame.style.opacity = "1";
    }, 1500 + idx * 1200);
  });

  windows.forEach((winCls, idx) => {
    setTimeout(() => {
      const winEl = document.querySelector(winCls);
      if (winEl) winEl.classList.add("active");
    }, 2000 + idx * 1400);
  });

  state.castle.zoomingActive = true;
  triggerAwakeningOwls();

  setTimeout(() => {
    if (castleWrapper) castleWrapper.classList.remove("zoomed-in");
    if (paper) paper.classList.remove("cinematic-dim");
    if (closeBtn) closeBtn.style.display = "block";
    
    stopChoirDrone();
    if (state.audio.music) {
      state.audio.music.volume = 0.5;
    }

    state.castle.zoomingActive = false;

    revealHogwartsLetter(msgEl, msg, sigEl);
  }, 12500);
}
