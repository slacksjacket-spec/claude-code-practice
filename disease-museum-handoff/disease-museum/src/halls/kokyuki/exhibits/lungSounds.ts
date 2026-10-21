// 肺音ミキサー：合成した呼吸音（2呼吸）を聴いて（波形も見て）音の種類を当て、考える病気を選ぶ。音は Web Audio の模式
import "./lungSounds.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { LungSoundsData } from "./lungSounds.schema";
import type { LungProfile } from "./lungSounds.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const NAME_COINS = 12, DX_COINS = 12;
const INS = 1.3, EXP = 1.9, CYC = INS + EXP; // 吸気・呼気（秒）

/** 1呼吸のなかの付加音。phase は吸気/呼気、from/to はその相のなかの位置（0〜1） */
interface Add { phase: "ins" | "exp"; from: number; to: number; kind: "tone" | "click" | "creak"; freq: number; amp: number; n?: number }
function adds(p: LungProfile): Add[] {
  switch (p) {
    case "normal": return [];
    case "wheeze": return [{ phase: "exp", from: 0.1, to: 0.95, kind: "tone", freq: 520, amp: 0.5 }];
    case "rhonchi": return [{ phase: "exp", from: 0.05, to: 0.9, kind: "tone", freq: 140, amp: 0.6 }];
    case "fine": return [{ phase: "ins", from: 0.55, to: 1, kind: "click", freq: 1400, amp: 0.45, n: 18 }];
    case "coarse": return [{ phase: "ins", from: 0.05, to: 0.6, kind: "click", freq: 500, amp: 0.7, n: 8 }, { phase: "exp", from: 0, to: 0.3, kind: "click", freq: 450, amp: 0.5, n: 4 }];
    case "stridor": return [{ phase: "ins", from: 0.1, to: 0.95, kind: "tone", freq: 820, amp: 0.7 }];
    case "rub": return [{ phase: "ins", from: 0.2, to: 0.9, kind: "creak", freq: 300, amp: 0.55 }, { phase: "exp", from: 0.1, to: 0.6, kind: "creak", freq: 260, amp: 0.45 }];
  }
}
const span = (a: Add): [number, number] => { const base = a.phase === "ins" ? 0 : INS, len = a.phase === "ins" ? INS : EXP; return [base + a.from * len, base + a.to * len]; };
/** 付加音のクリック（断続性ラ音）の時刻。毎回同じになるよう決まった並び */
const clicks = (a: Add) => { const [s, e] = span(a); return Array.from({ length: a.n ?? 0 }, (_, i) => s + ((i + 0.5 + 0.35 * Math.sin(i * 7.3)) / (a.n ?? 1)) * (e - s)); };

function wave(p: LungProfile) {
  const W = 400, H = 90, C = H / 2, sx = W / (CYC * 2);
  let path = "";
  for (let i = 0; i <= 900; i++) {
    const t = (i / 900) * CYC * 2, tc = t % CYC;
    const breath = tc < INS ? Math.sin((Math.PI * tc) / INS) * 0.35 : Math.sin((Math.PI * (tc - INS)) / EXP) * 0.18;
    let a = breath * Math.sin(t * 1730) * Math.sin(t * 517);
    for (const ad of adds(p)) {
      const [s, e] = span(ad);
      if (tc < s || tc > e) continue;
      if (ad.kind === "tone") a += ad.amp * 0.6 * Math.sin(2 * Math.PI * (ad.freq / 20) * t);
      if (ad.kind === "creak") a += ad.amp * 0.5 * Math.sin(t * 900) * (Math.sin(t * 40) > 0.3 ? 1 : 0.2);
    }
    for (const ad of adds(p)) if (ad.kind === "click") for (const ct of clicks(ad)) if (Math.abs(tc - ct) < 0.012) a += ad.amp * (1 - Math.abs(tc - ct) / 0.012) * (ad.freq > 1000 ? 0.6 : 1);
    path += `${i ? "L" : "M"}${(t * sx).toFixed(1)} ${(C - a * 38).toFixed(1)}`;
  }
  const marks = [0, 1].flatMap((k) => [`<text x="${k * CYC * sx + 2}" y="12">吸気</text>`, `<text x="${(k * CYC + INS) * sx + 2}" y="12">呼気</text>`]).join("");
  return `<svg class="breath" viewBox="0 0 ${W} ${H}" role="img" aria-label="呼吸音の波形">${[0, 1].map((k) => `<rect x="${k * CYC * sx}" y="0" width="${INS * sx}" height="${H}" fill="#123524"/>`).join("")}<line x1="0" y1="${C}" x2="${W}" y2="${C}" stroke="#1E4632"/>${marks}<path d="${path}" fill="none" stroke="#5CFF9D" stroke-width="1"/></svg>`;
}

let ac: AudioContext | null = null, noise: AudioBuffer | null = null;
function play(p: LungProfile, breaths = 2) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = ac || new AC();
    if (!noise) { noise = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate); const ch = noise.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
    const t0 = ac.currentTime + 0.05, out = ac.createGain(); out.gain.value = 0.9; out.connect(ac.destination);
    const env = (g: GainNode, s: number, e: number, amp: number) => { g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(amp, s + Math.min(0.15, (e - s) / 3)); g.gain.setValueAtTime(amp, e - Math.min(0.15, (e - s) / 3)); g.gain.linearRampToValueAtTime(0, e); };
    for (let b = 0; b < breaths; b++) {
      const base = t0 + b * CYC;
      // 呼吸のザーという音（吸気が大きい）
      for (const [s, e, amp] of [[0, INS, 0.35], [INS, CYC, 0.18]] as const) {
        const src = ac.createBufferSource(); src.buffer = noise;
        const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600;
        const g = ac.createGain(); env(g, base + s, base + e, amp);
        src.connect(lp).connect(g).connect(out); src.start(base + s, Math.random()); src.stop(base + e + 0.05);
      }
      for (const ad of adds(p)) {
        const [s, e] = span(ad);
        if (ad.kind === "tone") {
          const o = ac.createOscillator(); o.type = ad.freq < 200 ? "sawtooth" : "sine"; o.frequency.value = ad.freq;
          const g = ac.createGain(); env(g, base + s, base + e, ad.amp * (ad.freq < 200 ? 0.12 : 0.18));
          o.connect(g).connect(out); o.start(base + s); o.stop(base + e + 0.05);
        } else if (ad.kind === "creak") {
          const src = ac.createBufferSource(); src.buffer = noise;
          const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = ad.freq; bp.Q.value = 3;
          const g = ac.createGain(); env(g, base + s, base + e, ad.amp * 0.6);
          const lfo = ac.createOscillator(); lfo.frequency.value = 7; const lg = ac.createGain(); lg.gain.value = ad.amp * 0.5; lfo.connect(lg).connect(g.gain); lfo.start(base + s); lfo.stop(base + e);
          src.connect(bp).connect(g).connect(out); src.start(base + s, Math.random()); src.stop(base + e + 0.05);
        } else for (const ct of clicks(ad)) {
          const src = ac.createBufferSource(); src.buffer = noise;
          const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = ad.freq; bp.Q.value = 1;
          const g = ac.createGain(); g.gain.setValueAtTime(ad.amp * 1.2, base + ct); g.gain.exponentialRampToValueAtTime(0.001, base + ct + (ad.freq > 1000 ? 0.012 : 0.03));
          src.connect(bp).connect(g).connect(out); src.start(base + ct, Math.random()); src.stop(base + ct + 0.05);
        }
      }
    }
  } catch { /* 音が出なくても波形で遊べる */ }
}

export const lungSounds: CustomModule<LungSoundsData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`, allNames = Object.values(d.names);
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], name = d.names[c.profile];
      let nameOk = false;
      const opts = shuffle([name, ...shuffle(allNames.filter((n) => n !== name)).slice(0, 4)]);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="row" style="margin:8px 0"><button class="btn play">▶ 聴く（2呼吸）</button><span class="small" style="font-weight:800;color:var(--sub)">イヤホン推奨。濃い部分が吸気</span></div>
        ${wave(c.profile)}
        <div class="stepLabel">① 聴こえる音は？</div><div class="opts n1">${opts.map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="step2"></div>`;
      $(".play", root).onclick = () => play(c.profile);
      $$<HTMLButtonElement>(".n1 .opt", root).forEach((b) => (b.onclick = () => {
        nameOk = b.dataset.a === name;
        $$<HTMLButtonElement>(".n1 .opt", root).forEach((x) => { x.disabled = true; if (x.dataset.a === name) x.classList.add("right"); });
        if (nameOk) { ctx.sound.ding(); ctx.award(NAME_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const box = $(".step2", root), dz = c.disease;
        box.innerHTML = `<div class="stepLabel">② 考える病気は？</div><div class="opts">${dz.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === dz.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === dz.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(DX_COINS, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !nameOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}（${name}が聴こえる）考える病気は？`, opts: shuffle([dz.options[dz.answer], ...shuffle(dz.options.filter((_, i) => i !== dz.answer)).slice(0, 2)]), ans: dz.options[dz.answer] });
          if (ok && nameOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && nameOk, ok && nameOk ? "両方正解！" : ok ? "病気は正解！" : `正解は「${esc(dz.options[dz.answer])}」`, `${esc(name)}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
