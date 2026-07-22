let audioCtx = null;
let masterBus = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(audioCtx.destination);
    masterBus = compressor;
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function rootName(rootMidi) {
  return NOTE_NAMES[((rootMidi % 12) + 12) % 12];
}

function fullChordSymbol(chordType, rootMidi) {
  return `${rootName(rootMidi)}${chordType.symbol}`;
}

const PIANO_HARMONICS = [
  { mult: 1, gain: 1.00, decayMul: 1.00 },
  { mult: 2, gain: 0.55, decayMul: 0.85 },
  { mult: 3, gain: 0.32, decayMul: 0.70 },
  { mult: 4, gain: 0.18, decayMul: 0.55 },
  { mult: 5, gain: 0.11, decayMul: 0.45 },
  { mult: 6, gain: 0.07, decayMul: 0.35 },
  { mult: 7, gain: 0.04, decayMul: 0.30 },
];

function playNote(freq, startTime, duration) {
  const noteGain = audioCtx.createGain();
  noteGain.gain.value = 0.16;

  const brightness = audioCtx.createBiquadFilter();
  brightness.type = "lowpass";
  brightness.Q.value = 0.3;
  brightness.frequency.setValueAtTime(freq * 9, startTime);
  brightness.frequency.exponentialRampToValueAtTime(Math.max(freq * 2.2, 200), startTime + duration * 0.6);

  noteGain.connect(brightness).connect(masterBus);

  PIANO_HARMONICS.forEach(h => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * h.mult;

    const g = audioCtx.createGain();
    const decayTime = Math.max(duration * h.decayMul, 0.15);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(h.gain, startTime + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + decayTime);

    osc.connect(g).connect(noteGain);
    osc.start(startTime);
    osc.stop(startTime + decayTime + 0.05);
  });

  const hammerDuration = 0.035;
  const bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * hammerDuration));
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = Math.min(freq * 3.5, 6000);
  noiseFilter.Q.value = 0.6;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0.12;

  noise.connect(noiseFilter).connect(noiseGain).connect(masterBus);
  noise.start(startTime);
}

function playChord(intervals, rootMidi, arpeggio) {
  ensureAudio();
  const now = audioCtx.currentTime;
  const duration = arpeggio ? 1.3 : 2.2;
  intervals.forEach((interval, i) => {
    const freq = midiToFreq(rootMidi + interval);
    const startTime = arpeggio ? now + i * 0.35 : now;
    playNote(freq, startTime, duration);
  });
}
