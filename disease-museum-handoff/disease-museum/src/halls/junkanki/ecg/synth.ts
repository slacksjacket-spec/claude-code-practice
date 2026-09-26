// 心電図の合成。波形はすべて作りもの（パラメータから計算）で、実在の患者の記録ではない。
// 単位：時間は秒、振幅は mV。描画は render.ts（25 mm/秒、10 mm/mV）。
// 波の形は教育用の模式で、実際の心電図の細かい形までは再現しない。TODO(review) 各調律・所見の見た目が典型像になっているか

/** 1拍ぶんの形（1誘導あたり） */
export interface Morph {
  p: number; pDur: number;               // P波の高さ・幅
  q: number; r: number; s: number; r2: number; // QRS の成分（r2 は R'）
  qrs: number;                           // QRS 幅
  st: number; stShape: "flat" | "down";  // ST の上下（down は J から下がっていく形＝coved）
  t: number; tW: number;                 // T波の高さ（負で陰性）・幅
  qt: number;                            // QRS の始まりから T の終わりまで
  u: number; delta: number; j: number;   // U波、デルタ波、J波（Osborn）
}

export const BASE: Morph = { p: 0.15, pDur: 0.1, q: -0.06, r: 1.2, s: -0.25, r2: 0, qrs: 0.09, st: 0, stShape: "flat", t: 0.35, tW: 0.055, qt: 0.38, u: 0.03, delta: 0, j: 0 };
/** 心室期外収縮・心室頻拍の形（幅広く、T が QRS と逆向き） */
export const WIDE: Partial<Morph> = { q: 0, r: 1.5, s: -0.5, r2: 0, qrs: 0.16, t: -0.5, tW: 0.08, qt: 0.44, u: 0, p: 0 };

export const morph = (...parts: Partial<Morph>[]): Morph => Object.assign({}, BASE, ...parts);

const g = (t: number, c: number, w: number, a: number) => (a ? a * Math.exp(-(((t - c) / w) ** 2)) : 0);
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** P波（始まりが p0） */
export function pWave(t: number, p0: number, amp: number, dur = 0.1) {
  return g(t, p0 + dur / 2, dur / 4, amp);
}

/** QRS〜T〜U（QRS の始まりが t0） */
export function beat(t: number, t0: number, m: Morph) {
  const dt = t - t0;
  if (dt < -0.1 || dt > m.qt + 0.3) return 0;
  // QRS の成分の位置（QRS 幅に対する割合）。R' があるときは rsR' に、デルタ波があるときは R を後ろへずらす
  const pos = m.r2 && m.r2 > 0.2 ? { q: 0.1, r: 0.22, s: 0.48, r2: 0.78 } : m.delta ? { q: 0.1, r: 0.62, s: 0.85, r2: 0.95 } : { q: 0.15, r: 0.45, s: 0.75, r2: 0.92 };
  const w = m.qrs >= 0.12 && !(m.r2 > 0.2) && !m.delta ? m.qrs * 0.22 : m.qrs * (m.r2 > 0.2 ? 0.11 : 0.16);
  let v = g(t, t0 + m.qrs * pos.q, w, m.q) + g(t, t0 + m.qrs * pos.r, w * 1.1, m.r) + g(t, t0 + m.qrs * pos.s, w, m.s) + g(t, t0 + m.qrs * pos.r2, w * 0.9, m.r2);
  // デルタ波：QRS の始まりからゆるく立ち上がり、R に乗り移る
  if (m.delta) v += m.delta * smooth((t - t0) / 0.075) * (1 - smooth((t - (t0 + m.qrs * 0.75)) / 0.03));
  const tj = t0 + m.qrs, tc = t0 + m.qt - 1.7 * m.tW;
  // ST：J点から T の頂点へ。flat は同じ高さのまま T に溶ける、down は J から直線的に下がる
  if (m.st && t > tj - 0.01) {
    const up = smooth((t - (tj - 0.01)) / 0.02);
    const k = m.stShape === "down" ? Math.max(0, 1 - (t - tj) / (tc - tj)) : 1 - smooth((t - tc) / (m.tW * 1.6));
    v += m.st * up * k;
  }
  if (m.j) v += g(t, tj + 0.02, 0.02, m.j); // J波（Osborn波）：QRS の終わりのこぶ
  // T波：立ち上がりがゆるく、下りが急
  v += t < tc ? g(t, tc, m.tW * 1.35, m.t) : g(t, tc, m.tW, m.t);
  if (m.u) v += g(t, tc + 2.1 * m.tW + 0.07, 0.035, m.u);
  return v;
}

/** 心拍などの並び */
export interface Rhythm {
  beats: { t0: number; m: Morph }[];     // QRS の始まりと形
  ps: { t: number; amp: number; dur?: number }[]; // P波（伝導しないものも含む）
  spikes: number[];                      // ペースメーカーのスパイク
  base?: (t: number) => number;          // 基線（f波・F波・VF など）
}

export function signal(r: Rhythm, t: number) {
  let v = r.base ? r.base(t) : 0;
  for (const p of r.ps) if (Math.abs(t - p.t) < 0.2) v += pWave(t, p.t, p.amp, p.dur);
  for (const b of r.beats) v += beat(t, b.t0, b.m);
  for (const s of r.spikes) if (Math.abs(t - s) < 0.004) v += 1.8;
  return v;
}

/* ================= 乱数 ================= */

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export type Rng = () => number;
const between = (R: Rng, a: number, b: number) => a + R() * (b - a);

/* ================= 調律（II誘導） ================= */

export const RHYTHM_IDS = [
  "sinus", "sinusTachy", "sinusBrady", "af", "pvc", "pac", "vf", "asystole",
  "afl", "psvt", "vt", "av1", "wenckebach", "mobitz2", "av3", "sinusArrest", "paced", "wpw",
  "av2to1", "junctional", "aivr", "bigeminy", "tdp", "afCavb", "aberrant", "bradyTachy",
] as const;
export type RhythmId = (typeof RHYTHM_IDS)[number];

/** 規則正しい洞調律の並び（P と QRS がつながる） */
function sinusSeries(R: Rng, from: number, to: number, rr: number, m: Morph, pr = 0.16, jitter = 0.02) {
  const beats: Rhythm["beats"] = [], ps: Rhythm["ps"] = [];
  for (let t = from; t < to; t += rr * (1 + (R() - 0.5) * jitter)) { beats.push({ t0: t, m }); if (m.p) ps.push({ t: t - pr, amp: m.p, dur: m.pDur }); }
  return { beats, ps };
}
/** 心房細動の f 波 */
const fWaves = (R: Rng, amp = 0.06) => {
  const ph = [R() * 6, R() * 6, R() * 6], fr = [between(R, 5, 7), between(R, 6.5, 8.5), between(R, 4, 5.5)];
  return (t: number) => amp * (Math.sin(2 * Math.PI * fr[0] * t + ph[0]) + 0.7 * Math.sin(2 * Math.PI * fr[1] * t + ph[1]) + 0.5 * Math.sin(2 * Math.PI * fr[2] * t + ph[2]));
};

/** II誘導の調律を作る。D は秒数 */
export function makeRhythm(id: RhythmId, seed: number, D = 10): Rhythm {
  const R = rng(seed), N = morph({ p: 0 }), S = morph();
  const empty = (): Rhythm => ({ beats: [], ps: [], spikes: [] });
  const sin = (rate: number, m = S, pr = 0.16) => ({ ...sinusSeries(R, between(R, 0.2, 0.5), D, 60 / rate, m, pr), spikes: [] });
  switch (id) {
    case "sinus": return sin(between(R, 62, 92));
    case "sinusTachy": return sin(between(R, 110, 135), morph({ qt: 0.3 }));
    case "sinusBrady": return sin(between(R, 38, 48), morph({ qt: 0.42 }));
    case "wpw": return sin(between(R, 65, 85), morph({ delta: 0.4, qrs: 0.13, q: 0 }), 0.1);
    case "av1": return sin(between(R, 60, 80), S, between(R, 0.28, 0.34));
    case "af": {
      const r = empty();
      for (let t = between(R, 0.1, 0.4); t < D; t += between(R, 0.42, 1.15)) r.beats.push({ t0: t, m: N });
      r.base = fWaves(R);
      return r;
    }
    case "afl": {
      const r = empty(), F = 0.2, k = R() < 0.5 ? 2 : 4, off = R() * F;
      for (let t = off + F * 0.6; t < D; t += F * k) r.beats.push({ t0: t, m: morph({ p: 0, t: 0.15 }) });
      // 鋸歯状波：ゆっくり下がって、すばやく戻る（II誘導で下向き）
      r.base = (t) => { const x = (((t - off) / F) % 1 + 1) % 1; return x < 0.7 ? -(x / 0.7) * 0.35 : -0.35 + ((x - 0.7) / 0.3) * 0.35; };
      return r;
    }
    case "psvt": {
      const r = empty(), rr = 60 / between(R, 165, 195);
      for (let t = 0.2; t < D; t += rr) r.beats.push({ t0: t, m: morph({ p: 0, qt: 0.26, tW: 0.04 }) });
      return r;
    }
    case "vt": {
      const r = empty(), rr = 60 / between(R, 160, 190), m = morph(WIDE, { qt: 0.32 });
      for (let t = 0.15; t < D; t += rr) r.beats.push({ t0: t, m });
      return r;
    }
    case "vf": {
      // 心室細動：形も高さもばらばらな波
      const r = empty(), ph = [R() * 6, R() * 6, R() * 6, R() * 6], fr = [between(R, 3.5, 4.5), between(R, 5, 6.5), between(R, 7, 8.5)];
      r.base = (t) => (0.3 + 0.18 * Math.sin(t * 1.1 + ph[3]) + 0.1 * Math.sin(t * 2.9)) *
        (Math.sin(2 * Math.PI * fr[0] * t + ph[0] + 0.8 * Math.sin(t * 2.3)) + 0.7 * Math.sin(2 * Math.PI * fr[1] * t + ph[1]) + 0.4 * Math.sin(2 * Math.PI * fr[2] * t + ph[2]));
      return r;
    }
    case "asystole": { const r = empty(); r.base = (t) => 0.02 * Math.sin(t * 1.7); return r; }
    case "tdp": {
      const r = empty(), fr = between(R, 3.6, 4.4), ph = R() * 6;
      r.base = (t) => 0.9 * Math.sin((Math.PI * t) / 2.2 + ph) * Math.sin(2 * Math.PI * fr * t);
      return r;
    }
    case "pvc": case "bigeminy": {
      const rr = 60 / between(R, 68, 82), r = empty(), wide = morph(WIDE);
      let t = 0.3, n = 0;
      const pvcAt = new Set(id === "bigeminy" ? [] : [2 + Math.floor(R() * 3), 7 + Math.floor(R() * 2)]);
      while (t < D) {
        const isPvc = id === "bigeminy" ? n % 2 === 1 : pvcAt.has(n);
        if (isPvc) { r.beats.push({ t0: t - rr * 0.42, m: wide }); r.ps.push({ t: t - 0.16, amp: 0.15 }); }
        else { r.beats.push({ t0: t, m: S }); r.ps.push({ t: t - 0.16, amp: 0.15 }); }
        t += rr; n++;
      }
      // 期外収縮のところは、洞のP波が QRS に隠れる（代償性休止）
      return r;
    }
    case "pac": case "aberrant": {
      const rr = 60 / between(R, 68, 82), r = empty();
      let t = 0.3, n = 0;
      const at = 3 + Math.floor(R() * 3);
      while (t < D) {
        if (n === at) {
          const te = t - rr * 0.4;
          r.ps.push({ t: te - 0.14, amp: 0.08 });
          r.beats.push({ t0: te, m: id === "aberrant" ? morph({ p: 0, qrs: 0.13, r: 0.8, s: -0.3, r2: 0.5, t: -0.2 }) : S });
          t = te + rr; // 洞結節がリセットされる（非代償性）
        } else { r.beats.push({ t0: t, m: S }); r.ps.push({ t: t - 0.16, amp: 0.15 }); t += rr; }
        n++;
      }
      return r;
    }
    case "wenckebach": {
      const pp = 60 / between(R, 72, 86), r = empty(), prs = [0.16, 0.26, 0.32];
      let i = 0;
      for (let t = 0.1; t < D; t += pp, i++) {
        const k = i % 4;
        r.ps.push({ t, amp: 0.15 });
        if (k < 3) r.beats.push({ t0: t + prs[k], m: S });
      }
      return r;
    }
    case "mobitz2": {
      const pp = 60 / between(R, 72, 86), r = empty(), every = R() < 0.5 ? 3 : 4, m = morph({ qrs: 0.12, s: -0.4 });
      let i = 0;
      for (let t = 0.1; t < D; t += pp, i++) { r.ps.push({ t, amp: 0.15 }); if (i % every !== every - 1) r.beats.push({ t0: t + 0.18, m }); }
      return r;
    }
    case "av2to1": {
      const pp = 60 / between(R, 76, 90), r = empty();
      let i = 0;
      for (let t = 0.1; t < D; t += pp, i++) { r.ps.push({ t, amp: 0.2 }); if (i % 2 === 0) r.beats.push({ t0: t + 0.18, m: morph({ qt: 0.36, t: 0.25 }) }); }
      return r;
    }
    case "av3": {
      const pp = 60 / between(R, 75, 90), rr = 60 / between(R, 32, 40), r = empty(), m = morph(WIDE, { t: -0.35, qt: 0.46 });
      for (let t = R() * pp; t < D; t += pp) r.ps.push({ t, amp: 0.15 });
      for (let t = 0.4 + R() * 0.5; t < D; t += rr) r.beats.push({ t0: t, m });
      return r;
    }
    case "afCavb": {
      const rr = 60 / between(R, 38, 45), r = empty();
      for (let t = 0.5; t < D; t += rr) r.beats.push({ t0: t, m: N });
      r.base = fWaves(R);
      return r;
    }
    case "sinusArrest": {
      const rr = 60 / between(R, 66, 78), r = empty();
      let t = 0.3, paused = false;
      while (t < D) {
        r.beats.push({ t0: t, m: S }); r.ps.push({ t: t - 0.16, amp: 0.15 });
        t += !paused && t > 2.5 ? ((paused = true), between(R, 3.2, 3.8)) : rr;
      }
      return r;
    }
    case "bradyTachy": {
      const r = empty();
      let t = 0.1;
      for (; t < 3.6; t += 60 / between(R, 130, 150) * (0.8 + R() * 0.4)) r.beats.push({ t0: t, m: N });
      const fEnd = t, fw = fWaves(R);
      r.base = (x) => (x < fEnd ? fw(x) : 0); // 心房細動が止まったあと、長い休止
      t += between(R, 3.4, 4.2);
      for (; t < D; t += 60 / 44) { r.beats.push({ t0: t, m: S }); r.ps.push({ t: t - 0.16, amp: 0.15 }); }
      return r;
    }
    case "junctional": {
      const rr = 60 / between(R, 45, 55), r = empty();
      for (let t = 0.4; t < D; t += rr) { r.beats.push({ t0: t, m: N }); r.ps.push({ t: t + 0.1, amp: -0.08, dur: 0.07 }); }
      return r;
    }
    case "aivr": {
      const rr = 60 / between(R, 62, 90), r = empty(), m = morph(WIDE, { t: -0.35, qt: 0.44 });
      for (let t = 0.4; t < D; t += rr) r.beats.push({ t0: t, m });
      return r;
    }
    case "paced": {
      const rr = 60 / 60, r = empty(), m = morph(WIDE, { r: 0.2, s: -1.2, t: 0.45, qrs: 0.15 });
      for (let t = 0.3; t < D; t += rr) { r.spikes.push(t - 0.01); r.beats.push({ t0: t, m }); }
      return r;
    }
  }
}

/* ================= 12誘導 ================= */

export const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"] as const;
export type Lead = (typeof LEADS)[number];
const LIMB_ANGLE: Partial<Record<Lead, number>> = { I: 0, II: 60, III: 120, aVR: -150, aVL: -30, aVF: 90 };
const PRECORDIAL: Record<"V1" | "V2" | "V3" | "V4" | "V5" | "V6", Partial<Morph>> = {
  V1: { q: 0, r: 0.3, s: -1.1, t: 0.1, p: 0.08 },
  V2: { q: 0, r: 0.55, s: -1.4, t: 0.45 },
  V3: { q: 0, r: 0.9, s: -0.9, t: 0.45 },
  V4: { q: -0.04, r: 1.4, s: -0.5, t: 0.45 },
  V5: { q: -0.06, r: 1.4, s: -0.2, t: 0.38 },
  V6: { q: -0.06, r: 1.1, s: -0.1, t: 0.3 },
};

export const PATTERN_IDS = [
  "normal", "antMI", "extAntMI", "infMI", "latMI", "postMI", "pericarditis", "rbbb", "lbbb", "lvh", "rvh",
  "wpw", "hyperK", "hypoK", "longQT", "brugada", "hypothermia", "pe", "afNormal",
] as const;
export type PatternId = (typeof PATTERN_IDS)[number];

const rad = (d: number) => (d * Math.PI) / 180;

/** 電気軸 axis（度）の正常な肢誘導 */
export function limbMorph(lead: Lead, axis: number, amp = 1.3): Partial<Morph> {
  const a = LIMB_ANGLE[lead]!;
  const proj = Math.cos(rad(axis - a));
  return {
    q: proj > 0.6 ? -0.08 : 0,
    r: Math.max(0.08, amp * Math.max(0, proj)) + (proj < 0 ? 0.1 : 0),
    s: -(0.08 + amp * Math.max(0, -proj)),
    p: 0.15 * Math.cos(rad(60 - a)),
    t: 0.35 * Math.cos(rad(axis - 15 - a)),
  };
}

export interface TwelveLead { leads: Record<Lead, Morph>; rate: number; pr: number; af?: boolean; stLeads: Lead[] }

/** 12誘導の所見を作る。stLeads は ST が上昇している誘導（答え合わせ用） */
export function makeTwelve(id: PatternId, seed: number): TwelveLead {
  const R = rng(seed);
  let axis = between(R, 35, 70), rate = between(R, 62, 88), pr = 0.16, af = false;
  const mod: Partial<Record<Lead, Partial<Morph>>> = {}, all: Partial<Morph> = {};
  const add = (ls: Lead[], m: Partial<Morph>) => ls.forEach((l) => (mod[l] = { ...mod[l], ...m }));
  const st = (ls: Lead[], v: number, extra: Partial<Morph> = {}) => add(ls, { st: v, ...extra });
  let stLeads: Lead[] = [];
  switch (id) {
    case "normal": break;
    case "afNormal": af = true; rate = between(R, 80, 110); break;
    case "antMI": stLeads = ["V1", "V2", "V3", "V4"]; st(stLeads, 0.3, { t: 0.7 }); st(["II", "III", "aVF"], -0.1); break;
    case "extAntMI": stLeads = ["I", "aVL", "V1", "V2", "V3", "V4", "V5", "V6"]; st(stLeads, 0.3, { t: 0.7 }); st(["II", "III", "aVF"], -0.15); break;
    case "infMI": stLeads = ["II", "III", "aVF"]; st(stLeads, 0.3, { t: 0.6 }); st(["I", "aVL"], -0.15, { t: -0.1 }); st(["V2"], -0.05); break;
    case "latMI": stLeads = ["I", "aVL", "V5", "V6"]; st(stLeads, 0.25, { t: 0.55 }); st(["III", "aVF"], -0.15); break;
    case "postMI": stLeads = []; st(["V1", "V2", "V3"], -0.25, { r: 1.0, s: -0.4, t: 0.5 }); break;
    case "pericarditis":
      stLeads = ["I", "II", "aVF", "V2", "V3", "V4", "V5", "V6"]; st(stLeads, 0.18, { stShape: "flat" }); st(["aVR"], -0.12); break;
    case "rbbb":
      Object.assign(all, { qrs: 0.14 });
      add(["V1", "V2"], { r: 0.3, s: -0.35, r2: 1.0, t: -0.25 }); add(["I", "V5", "V6", "aVL"], { s: -0.45 }); break;
    case "lbbb":
      Object.assign(all, { qrs: 0.16, q: 0 });
      add(["V1", "V2", "V3"], { r: 0.1, s: -1.8, st: 0.2, t: 0.4 }); add(["I", "aVL", "V5", "V6"], { q: 0, r: 1.5, s: 0, r2: 0, st: -0.12, t: -0.3 }); axis = between(R, -20, 10); break;
    case "lvh": add(["V1", "V2"], { s: -2.4 }); add(["V5"], { r: 3.0 }); add(["V6"], { r: 2.6 }); add(["V5", "V6", "I", "aVL"], { st: -0.12, stShape: "down", t: -0.3 }); axis = between(R, 0, 25); break;
    case "rvh": axis = between(R, 110, 140); add(["V1"], { r: 1.2, s: -0.2, t: -0.3 }); add(["V2"], { t: -0.2 }); add(["V5", "V6"], { s: -0.8 }); break;
    case "wpw": pr = 0.1; Object.assign(all, { delta: 0.4, qrs: 0.13, q: 0 }); break;
    case "hyperK": Object.assign(all, { t: 0.95, tW: 0.035, p: 0.07 }); break;
    case "hypoK": Object.assign(all, { t: 0.08, u: 0.2, st: -0.05, stShape: "down" }); break;
    case "longQT": rate = between(R, 55, 65); Object.assign(all, { qt: 0.56, tW: 0.07 }); break;
    case "brugada": stLeads = ["V1", "V2"]; add(stLeads, { r2: 0.3, st: 0.45, stShape: "down", t: -0.25 }); break;
    case "hypothermia": rate = between(R, 42, 52); Object.assign(all, { j: 0.45, qt: 0.46 }); break;
    case "pe":
      rate = between(R, 105, 125); axis = between(R, 95, 115);
      add(["I"], { s: -0.6 }); add(["III"], { q: -0.3, t: -0.25 }); add(["V1", "V2", "V3"], { t: -0.25 }); break;
  }
  const leads = {} as Record<Lead, Morph>;
  for (const l of LEADS) {
    const baseL = l.startsWith("V") ? PRECORDIAL[l as keyof typeof PRECORDIAL] : limbMorph(l, axis);
    const m = morph(baseL, all, mod[l] ?? {});
    // 高K：aVR 以外は高くとがった T
    if (id === "hyperK") m.t = l === "aVR" ? -0.5 : 0.95;
    if (af) m.p = 0;
    if (id === "wpw") m.p = baseL.p ?? 0.15;
    leads[l] = m;
  }
  return { leads, rate, pr, af, stLeads };
}

/** 12誘導の1誘導ぶんの調律（洞調律、または心房細動） */
export function leadRhythm(tw: TwelveLead, lead: Lead, seed: number, D = 10): Rhythm {
  const m = tw.leads[lead];
  if (tw.af) {
    const r: Rhythm = { beats: [], ps: [], spikes: [] };
    const R2 = rng(seed + 7);
    for (let t = 0.2; t < D; t += between(R2, 0.45, 0.95)) r.beats.push({ t0: t, m });
    r.base = fWaves(rng(seed + 11 + lead.length), 0.04);
    return r;
  }
  return { ...sinusSeries(rng(seed + 3), 0.3, D, 60 / tw.rate, m, tw.pr, 0.01), spikes: [] };
}

/** 決まった形の洞調律（キャリパー計測・電気軸などで使う） */
export function sinusRhythm(m: Morph, rate: number, seed: number, D = 10, pr = 0.16): Rhythm {
  return { ...sinusSeries(rng(seed), 0.3, D, 60 / rate, m, pr, 0.005), spikes: [] };
}
