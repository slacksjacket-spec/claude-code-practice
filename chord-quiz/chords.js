const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const CHORD_LIBRARY = {
  triad: [
    { name: "メジャー", symbol: "", intervals: [0,4,7] },
    { name: "マイナー", symbol: "m", intervals: [0,3,7] },
    { name: "ディミニッシュ", symbol: "dim", intervals: [0,3,6] },
    { name: "オーグメント", symbol: "aug", intervals: [0,4,8] },
  ],
  sixthSus: [
    { name: "サスペンデッド2", symbol: "sus2", intervals: [0,2,7] },
    { name: "サスペンデッド4", symbol: "sus4", intervals: [0,5,7] },
    { name: "シックス", symbol: "6", intervals: [0,4,7,9] },
    { name: "マイナーシックス", symbol: "m6", intervals: [0,3,7,9] },
  ],
  seventh: [
    { name: "ドミナント7th", symbol: "7", intervals: [0,4,7,10] },
    { name: "メジャー7th", symbol: "maj7", intervals: [0,4,7,11] },
    { name: "マイナー7th", symbol: "m7", intervals: [0,3,7,10] },
    { name: "ハーフディミニッシュ(m7-5)", symbol: "m7-5", intervals: [0,3,6,10] },
    { name: "ディミニッシュ7th", symbol: "dim7", intervals: [0,3,6,9] },
    { name: "マイナーメジャー7th", symbol: "mM7", intervals: [0,3,7,11] },
  ],
  tension: [
    { name: "オーグメント7th", symbol: "7#5", intervals: [0,4,8,10] },
    { name: "ドミナント7sus4", symbol: "7sus4", intervals: [0,5,7,10] },
    { name: "アド9", symbol: "add9", intervals: [0,4,7,14] },
    { name: "ナインス", symbol: "9", intervals: [0,4,7,10,14] },
    { name: "マイナーナインス", symbol: "m9", intervals: [0,3,7,10,14] },
    { name: "メジャーナインス", symbol: "maj9", intervals: [0,4,7,11,14] },
  ],
};
CHORD_LIBRARY.mix = [
  ...CHORD_LIBRARY.triad,
  ...CHORD_LIBRARY.sixthSus,
  ...CHORD_LIBRARY.seventh,
  ...CHORD_LIBRARY.tension,
];
