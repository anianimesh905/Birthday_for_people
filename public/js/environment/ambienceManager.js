import { getSeason, Petal, Leaf, Snowflake } from './seasons.js';
import { Firefly } from '../effects/fireflies.js';
import { MagicalDust } from '../effects/magicalDust.js';
import { Feather } from '../effects/feathers.js';
import { ShootingStar } from '../effects/shootingStars.js';
import { Bird } from './birds.js';
import { CuriousOwl } from './owl.js';
import { GlowingButterfly } from '../effects/butterflies.js';
import { WhiteStag } from './creatures.js';
import { updateTimeOfDayOverlay } from './weather.js';
import { updateMoonPhase } from './moon.js';
import { SmokeParticle } from '../effects/smoke.js';
import { state } from '../core/state.js';

let _triggerAmbientUpdateFn = null;

export function triggerAmbientUpdate() {
  if (_triggerAmbientUpdateFn) {
    _triggerAmbientUpdateFn();
  }
}

const circlingOwls = [];

export function triggerAwakeningOwls() {
  circlingOwls.length = 0;
  for (let i = 0; i < 3; i++) {
    circlingOwls.push({
      angle: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.012,
      radiusX: 30 + Math.random() * 25,
      radiusY: 8 + Math.random() * 6,
      flapSpeed: 0.12 + Math.random() * 0.08,
      flap: Math.random() * 5
    });
  }
}

export function initAmbientAtmosphere() {
  // Background video is the ONLY background — all atmospheric JS loops disabled
  return;
}
