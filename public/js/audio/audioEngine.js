import { state } from '../core/state.js';

export function getAudioCtx() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!state.audio.context || state.audio.context.state === 'closed') {
      state.audio.context = new AudioContextClass();
    }
    if (state.audio.context.state === 'suspended') {
      state.audio.context.resume().catch(() => {});
    }
    return state.audio.context;
  } catch (e) {
    return null;
  }
}
