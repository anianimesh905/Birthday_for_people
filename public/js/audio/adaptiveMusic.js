import { getAudioCtx } from './audioEngine.js';
import { state } from '../core/state.js';

export function adjustAudioToState(targetState) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const filter = state.audio.filter;
  const gain = state.audio.gain;
  const hour = new Date().getHours();
  const isNight = (hour >= 20 || hour < 5);

  if (filter && gain) {
    try {
      filter.frequency.cancelScheduledValues(now);
      gain.gain.cancelScheduledValues(now);
      
      if (targetState === 'closed') {
        filter.frequency.exponentialRampToValueAtTime(20000, now + 2.5);
        gain.gain.linearRampToValueAtTime(0.5, now + 2.0);
        
        if (state.audio.windGain) {
          state.audio.windGain.gain.cancelScheduledValues(now);
          state.audio.windGain.gain.linearRampToValueAtTime(0.05, now + 2.0);
        }
      } else if (targetState === 'letter-open') {
        const targetFreq = isNight ? 900 : 1300;
        filter.frequency.exponentialRampToValueAtTime(targetFreq, now + 3.0);
        gain.gain.linearRampToValueAtTime(0.24, now + 2.5);
        
        if (state.audio.windGain) {
          state.audio.windGain.gain.cancelScheduledValues(now);
          state.audio.windGain.gain.linearRampToValueAtTime(0.015, now + 3.0);
        }
      } else if (targetState === 'ceremony') {
        filter.frequency.exponentialRampToValueAtTime(800, now + 4.0);
        gain.gain.linearRampToValueAtTime(0.0001, now + 4.0);
        
        if (state.audio.windGain) {
          state.audio.windGain.gain.cancelScheduledValues(now);
          state.audio.windGain.gain.linearRampToValueAtTime(0.002, now + 4.0);
        }
      }
    } catch(e) {
      console.log("Audio scale adjustment failed:", e);
    }
  }
}
