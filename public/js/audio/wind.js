import { state } from '../core/state.js';

let _windAudioCtx = null;
let _windGainNode = null;
let _windOscillatorNode = null;

export function startWindAmbient() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    _windAudioCtx = ctx;

    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const month = new Date().getMonth();
    const season = (month >= 2 && month <= 4) ? 'spring' :
                   (month >= 5 && month <= 7) ? 'summer' :
                   (month >= 8 && month <= 10) ? 'autumn' : 'winter';

    let oscFreq = 0.07;
    let baseFreq = 420;
    let oscGainVal = 200;
    let windVol = 0.05;

    if (season === 'winter') {
      oscFreq = 0.12; 
      baseFreq = 380;
      oscGainVal = 260;
      windVol = 0.07;
    } else if (season === 'autumn') {
      oscFreq = 0.05;
      baseFreq = 340;
      oscGainVal = 180;
      windVol = 0.04;
    } else if (season === 'spring' || season === 'summer') {
      oscFreq = 0.04;
      baseFreq = 480;
      oscGainVal = 140;
      windVol = 0.03;
    }

    const hour = new Date().getHours();
    if (hour >= 20 || hour < 5) {
      baseFreq -= 60;
      oscGainVal += 40;
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = oscFreq;

    const oscGain = ctx.createGain();
    oscGain.gain.value = oscGainVal;

    filter.frequency.value = baseFreq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(windVol, ctx.currentTime + 2.5);

    _windGainNode = gain;
    state.audio.windGain = gain;
    _windOscillatorNode = osc;

    osc.connect(oscGain);
    oscGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    noise.start();
  } catch (e) {
    console.log("Wind synth failed:", e);
  }
}
