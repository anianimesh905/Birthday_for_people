import { PRELOADED_ASSETS } from '../core/constants.js';
import { getAudioCtx } from '../audio/audioEngine.js';
import { state } from '../core/state.js';

let _startMusicCallback = null;

export function startMusic() {
  if (_startMusicCallback) {
    _startMusicCallback();
  }
}

export function setupMusic(file, label) {
  const btn = document.getElementById("music-btn");
  if (!btn) return;
  const btnText = document.getElementById("music-btn-text");

  let cleanLabel = label || "Wingardium Leviosa";
  cleanLabel = cleanLabel.replace(/^[🎵🎶🎧📻🎹🎷🎺🎸🎻]\s*/g, "").trim();

  if (btnText) {
    btnText.textContent = cleanLabel;
  }

  const audioSrc = PRELOADED_ASSETS['musicFile'] || file;
  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.volume = 0.5;
  audio.preload = "auto";
  state.audio.music = audio;

  let playing = false;
  let started = false;
  let gainNode = null;
  let fadeInterval = null;

  try {
    const ctx = getAudioCtx();
    if (ctx) {
      const source = ctx.createMediaElementSource(audio);
      gainNode = ctx.createGain();
      state.audio.gain = gainNode;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(20000, ctx.currentTime);
      state.audio.filter = filter;
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    }
  } catch (e) {}

  function fadeInVolume() {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }

    if (gainNode) {
      try {
        const ctx = getAudioCtx();
        if (ctx) {
          gainNode.gain.cancelScheduledValues(ctx.currentTime);
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
          audio.volume = 1;
          return;
        }
      } catch (e) {}
    }

    audio.volume = 0;
    const startTime = Date.now();
    const duration = 1500;
    const targetVolume = 0.5;
    fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
        fadeInterval = null;
      } else {
        audio.volume = (elapsed / duration) * targetVolume;
      }
    }, 50);
  }

  function triggerStartMusic() {
    if (started) return;
    started = true;
    
    audio.play()
      .then(() => {
        playing = true;
        if (btnText) btnText.textContent = "Now Playing";
        btn.classList.add("playing");
        btn.setAttribute("aria-label", "Pause background music (Now Playing)");
        fadeInVolume();
      })
      .catch(() => {
        started = false;
        if (btnText) btnText.textContent = cleanLabel;
      });
  }
  _startMusicCallback = triggerStartMusic;

  function toggleMusic() {
    if (playing) {
      audio.pause();
      playing = false;
      if (btnText) btnText.textContent = cleanLabel;
      btn.classList.remove("playing");
      btn.setAttribute("aria-label", "Play background music");
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    } else {
      audio.play()
        .then(() => {
          playing = true;
          started = true;
          if (btnText) btnText.textContent = "Now Playing";
          btn.classList.add("playing");
          btn.setAttribute("aria-label", "Pause background music (Now Playing)");
          fadeInVolume();
        })
        .catch(() => {});
    }
  }

  triggerStartMusic();
  setTimeout(triggerStartMusic, 1200);

  function onFirstInteraction() {
    triggerStartMusic();
    document.removeEventListener("touchend", onFirstInteraction);
    document.removeEventListener("click", onFirstInteraction);
  }

  document.addEventListener("touchend", onFirstInteraction, { once: true, passive: true });
  document.addEventListener("click", onFirstInteraction, { once: true });

  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMusic();
  });
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}
