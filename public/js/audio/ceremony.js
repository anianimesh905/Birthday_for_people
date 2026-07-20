import { getAudioCtx } from './audioEngine.js';

export function playWishChime() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const filter = ctx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = 1200;
    filter.Q.value = 1.5;
    filter.gain.value = 6;

    // Peaceful crystal glass harp arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.22;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(startTime);
      osc.stop(startTime + 2.6);
    });

    filter.connect(ctx.destination);
  } catch (e) {
    console.log("Chime synth failed:", e);
  }
}
