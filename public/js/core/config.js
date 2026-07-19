import { PRELOADED_ASSETS, DEFAULT_SIZES } from './constants.js';

let _activeVideo = null;
let _bufferVideo = null;

export function unlockVideoAutoplay() {
  const tryPlay = () => {
    if (_activeVideo && _activeVideo.paused) {
      _activeVideo.play()
        .then(() => {
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
        })
        .catch(err => console.log("Gesture play failed:", err));
    }
  };
  document.addEventListener('click', tryPlay, { once: true });
  document.addEventListener('touchstart', tryPlay, { once: true });
}

export function loadHouseVideo(houseName, animate) {
  const key = (houseName || '').toLowerCase();
  const c = window._bdContent || (typeof BIRTHDAY_CONTENT !== 'undefined' ? BIRTHDAY_CONTENT : {});
  if (!c) return;

  const houseKeys = {
    gryffindor: { video: 'gryffindorVideo', fallback: 'gryffindorFallbackColor' },
    slytherin:  { video: 'slytherinVideo',  fallback: 'slytherinFallbackColor'  },
    ravenclaw:  { video: 'ravenclawVideo',  fallback: 'ravenclawFallbackColor'  },
    hufflepuff: { video: 'hufflepuffVideo', fallback: 'hufflepuffFallbackColor' }
  };

  const currentTheme = houseKeys[key];
  if (!currentTheme) return;

  const videoFile = c[currentTheme.video];
  const videoSrc = videoFile ? videoFile : null;
  const fallbackColor = c[currentTheme.fallback] || '#0d1b2a';
  const videoBg = document.getElementById('video-bg');

  if (videoBg) {
    videoBg.classList.remove('fallback-gryffindor', 'fallback-slytherin', 'fallback-ravenclaw', 'fallback-hufflepuff');
  }

  function applyFallback() {
    document.body.style.backgroundColor = fallbackColor;
    if (videoBg) videoBg.classList.add(`fallback-${key}`);
    if (_activeVideo) _activeVideo.style.opacity = '0';
    if (_bufferVideo) _bufferVideo.style.opacity = '0';
  }

  if (!videoSrc) {
    applyFallback();
    return;
  }

  if (!animate) {
    _activeVideo.src = videoSrc;
    _activeVideo.muted = true;
    _activeVideo.load();
    _activeVideo.oncanplay = () => {
      _activeVideo.oncanplay = null;
      _activeVideo.play()
        .then(() => {
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
        })
        .catch(err => {
          _activeVideo.classList.add('loaded');
          _activeVideo.style.opacity = '1';
          unlockVideoAutoplay();
        });
    };
    _activeVideo.onerror = applyFallback;
    return;
  }

  _activeVideo.style.opacity = '0';
  setTimeout(() => {
    _bufferVideo.src = videoSrc;
    _bufferVideo.muted = true;
    _bufferVideo.load();
    _bufferVideo.onerror = applyFallback;
    _bufferVideo.oncanplay = () => {
      _bufferVideo.oncanplay = null;
      _bufferVideo.play()
        .then(() => {
          _bufferVideo.classList.add('loaded');
          _bufferVideo.style.opacity = '1';
          setTimeout(() => {
            _activeVideo.pause();
            _activeVideo.style.opacity = '0';
            const temp = _activeVideo;
            _activeVideo = _bufferVideo;
            _bufferVideo = temp;
          }, 600);
        })
        .catch(err => {
          _bufferVideo.classList.add('loaded');
          _bufferVideo.style.opacity = '1';
          setTimeout(() => {
            _activeVideo.pause();
            _activeVideo.style.opacity = '0';
            const temp = _activeVideo;
            _activeVideo = _bufferVideo;
            _bufferVideo = temp;
            unlockVideoAutoplay();
          }, 600);
        });
    };
  }, 400);
}

export function initVideoBackground(cfg) {
  const videoBg = document.getElementById('video-bg');
  if (!videoBg) return;

  _activeVideo = document.getElementById('bg-video');
  if (!_activeVideo) return;

  _activeVideo.muted = true;
  _activeVideo.loop = true;
  _activeVideo.playsInline = true;
  _activeVideo.setAttribute('playsinline', '');
  _activeVideo.setAttribute('disablePictureInPicture', '');
  _activeVideo.style.opacity = '0';

  _bufferVideo = document.createElement('video');
  _bufferVideo.className = 'bg-video';
  _bufferVideo.muted = true;
  _bufferVideo.loop = true;
  _bufferVideo.playsInline = true;
  _bufferVideo.setAttribute('playsinline', '');
  _bufferVideo.setAttribute('disablePictureInPicture', '');
  _bufferVideo.style.opacity = '0';
  _activeVideo.parentNode.insertBefore(_bufferVideo, _activeVideo.nextSibling);

  window.addEventListener('houseChanged', (e) => {
    const key = (e.detail && e.detail.house) || '';
    loadHouseVideo(key, true);
  });

  const defaultHouse = window.currentHouse || ((cfg && cfg.defaultHouse) || 'Slytherin').toLowerCase();
  loadHouseVideo(defaultHouse, false);
}
