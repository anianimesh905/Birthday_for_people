import { getAudioCtx } from './audioEngine.js';

export function playCrackSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const noise = Math.random() * 2 - 1;
      const decay = Math.exp(-i / (ctx.sampleRate * 0.025));
      data[i] = noise * decay;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(4, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noiseNode.start();
  } catch (e) {}
}

export function playScrollSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const duration = 0.8;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let brown = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      brown = (brown + 0.02 * white) / 1.02;

      let noise = (pink * 0.6 + brown * 12.0) * 0.5;

      const t = i / bufferSize;
      const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.5);

      let crackle = 0;
      if (Math.random() < 0.003) {
        crackle = (Math.random() * 2 - 1) * 0.4;
      }

      data[i] = (noise * 0.08 + crackle) * envelope;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseNode.start();
  } catch (e) {}
}

export function startAmbientWaves() {}
export function stopAmbientWaves() {}

export function playAmbientBirdChirp(ctx, dest) {
  if (!ctx || !dest) return;
  const now = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    const start = now + i * 0.14;
    osc.frequency.setValueAtTime(900 + Math.random() * 200, start);
    osc.frequency.exponentialRampToValueAtTime(2300 + Math.random() * 300, start + 0.07);
    
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.008, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.09);
  }
}

export function playAmbientOwlHoot(ctx, dest) {
  if (!ctx || !dest) return;
  const now = ctx.currentTime;
  const playNode = (delay, dur, f1, f2) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f1, now + delay);
    osc.frequency.exponentialRampToValueAtTime(f2, now + delay + dur);
    
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.006, now + delay + dur * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + dur);
  };
  playNode(0, 0.42, 330, 350);
  playNode(0.55, 0.32, 310, 330);
  playNode(0.9, 0.45, 320, 340);
}

export function playOwlHoot() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    
    const playNode = (delay, dur, freqStart, freqEnd) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + delay + dur * 0.45);
      osc.frequency.exponentialRampToValueAtTime(freqStart * 0.88, ctx.currentTime + delay + dur);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + delay + dur * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    };
    
    playNode(0, 0.48, 330, 350);
    playNode(0.6, 0.38, 310, 330);
    playNode(0.95, 0.52, 320, 340);
  } catch (e) {
    console.log("AudioContext blocked or unsupported:", e);
  }
}

export function transitionWindToAmbient() {
  const windGain = window._windGainNode;
  const windCtx = window._windGainNode?.context; // Retrieve wind synth context
  if (windGain && windCtx) {
    try {
      const hour = new Date().getHours();
      let targetVol = 0.012;
      if (hour >= 20 || hour < 5) targetVol = 0.025;
      else if (hour >= 5 && hour < 8) targetVol = 0.022;
      else if (hour >= 17 && hour < 20) targetVol = 0.018;
      
      windGain.gain.cancelScheduledValues(windCtx.currentTime);
      windGain.gain.setValueAtTime(windGain.gain.value, windCtx.currentTime);
      windGain.gain.linearRampToValueAtTime(targetVol, windCtx.currentTime + 3.0);
      
      if (!window._ambientSoundTimer) {
        window._ambientSoundTimer = setInterval(() => {
          if (document.hidden || !windCtx || windCtx.state === 'suspended') return;
          const h = new Date().getHours();
          const isNight = (h >= 20 || h < 5);
          const isMorning = (h >= 5 && h < 9);
          
          if (isNight && Math.random() < 0.18) {
            playAmbientOwlHoot(windCtx, windGain);
          } else if (isMorning && Math.random() < 0.22) {
            playAmbientBirdChirp(windCtx, windGain);
          }
        }, 12000);
      }
    } catch (e) {
      console.log("transitionWindToAmbient failed:", e);
    }
  }
}
