// 効果音。Web Audio の短いビープ（試作と同じ音色・音量）
let ac: AudioContext | null = null;
let on = true;

export const isSoundOn = () => on;
export const toggleSound = () => (on = !on);

export function beep(f = 660, d = 0.12, type: OscillatorType = "square", vol = 0.06, slide?: number) {
  if (!on) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = ac || new AC();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + d + 0.02);
  } catch {
    /* 音が出なくても遊べる */
  }
}
/** 大きな達成：ファンファーレ */
export const yay = () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.14, "square", 0.05), i * 80));
/** 正解：短い上昇音 */
export const ding = () => {
  beep(880, 0.08, "square", 0.05);
  setTimeout(() => beep(1320, 0.1, "square", 0.04), 70);
};
/** 不正解：低いブザー */
export const boo = () => beep(180, 0.3, "sawtooth", 0.06, 110);
