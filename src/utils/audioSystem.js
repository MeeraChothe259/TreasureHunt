// src/utils/audioSystem.js

let audioCtx = null;
let bgDroneNode = null;

export const initAudio = () => {
  if (!window.AudioContext && !window.webkitAudioContext) return false;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return true;
};

// Deep, mysterious ambient drone (starts when user first interacts)
export const playAmbientDrone = () => {
  if (!initAudio()) return;
  if (bgDroneNode) return; // already playing

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc1.type = 'sine';
  osc2.type = 'triangle';
  
  // D minor moody mystery
  osc1.frequency.setValueAtTime(73.42, audioCtx.currentTime); // D2
  osc2.frequency.setValueAtTime(110, audioCtx.currentTime);   // A2
  osc2.detune.setValueAtTime(15, audioCtx.currentTime);       // Subtle out of tune phasing

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(150, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 15);
  
  // Fade in very slowly (Cinematic)
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 8);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc1.start();
  osc2.start();
  
  bgDroneNode = { osc1, osc2, gain };
};

export const stopAmbientDrone = () => {
  if (bgDroneNode && audioCtx) {
    bgDroneNode.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3);
    setTimeout(() => {
      bgDroneNode.osc1.stop();
      bgDroneNode.osc2.stop();
      bgDroneNode = null;
    }, 3000);
  }
};

// Subtle tech UI tick for hovering cards
export const playHoverSound = () => {
  if (!initAudio()) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.05);

  filter.type = 'highpass';
  filter.frequency.value = 800;
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

// Ancient artifact heavy thud with digital click
export const playClickSound = () => {
  if (!initAudio()) return;
  
  // Thud part
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.25);
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  
  // Dig click
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
  gain2.gain.setValueAtTime(0, audioCtx.currentTime);
  gain2.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.connect(gain);
  osc2.connect(gain2);
  gain.connect(audioCtx.destination);
  gain2.connect(audioCtx.destination);
  
  osc.start();
  osc2.start();
  osc.stop(audioCtx.currentTime + 0.3);
  osc2.stop(audioCtx.currentTime + 0.1);
};

// Magical sweep for activating / unlocking a level
export const playLevelActivate = () => {
  if (!initAudio()) return;
  const freqs = [329.63, 415.30, 493.88, 659.25, 830.61]; // E Major pentatonic mystique
  
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1);
  masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
  masterGain.connect(audioCtx.destination);
  
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    osc.connect(masterGain);
    
    const startTime = audioCtx.currentTime + (i * 0.06);
    osc.start(startTime);
    osc.stop(audioCtx.currentTime + 1.5);
  });
};

// Massive cinematic opening BOOM
export const playBoomSound = () => {
  if (!initAudio()) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.4);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(2.0, audioCtx.currentTime + 0.05); // Heavy attack
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.0); // Long decay

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 4.0);
};
