// 心音オーケストラ：合成した心音と雑音を聴いて（心音図も見て）弁膜症などを当て、よく聴こえる場所をタップする。
// 音はすべて Web Audio で作った模式（実際の録音ではない）
import "./heartSounds.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { HeartSoundsData } from "./heartSounds.schema";
import { AREAS, type Area, type Profile } from "./heartSounds.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const NAME_COINS = 15, AREA_COINS = 10;
const CYCLE = 0.86, SYS = 0.32; // 1心周期（秒）、S1 から S2 まで

/** 1心周期の中の音。t は周期の中の秒、kind で音色、shape で強さの変化 */
interface Ev { t: number; dur: number; kind: "S" | "murmurHi" | "murmurMid" | "murmurLo"; amp: number; shape: "tap" | "flat" | "diamond" | "decr" | "rumble" }
const S1 = (amp = 1): Ev => ({ t: 0, dur: 0.07, kind: "S", amp, shape: "tap" });
const S2 = (t = SYS, amp = 0.8): Ev => ({ t, dur: 0.05, kind: "S", amp, shape: "tap" });

export function events(p: Profile): Ev[] {
  switch (p) {
    case "normal": return [S1(), S2()];
    case "as": return [S1(), { t: 0.08, dur: 0.21, kind: "murmurMid", amp: 0.8, shape: "diamond" }, S2(SYS, 0.5)];
    case "mr": return [S1(0.6), { t: 0.06, dur: SYS - 0.04, kind: "murmurHi", amp: 0.55, shape: "flat" }, S2()];
    case "vsd": return [S1(0.8), { t: 0.05, dur: SYS - 0.04, kind: "murmurMid", amp: 0.7, shape: "flat" }, S2()];
    case "ar": return [S1(), S2(), { t: SYS + 0.04, dur: 0.3, kind: "murmurHi", amp: 0.5, shape: "decr" }];
    case "ms": return [S1(1.3), S2(), { t: SYS + 0.08, dur: 0.035, kind: "S", amp: 0.6, shape: "tap" }, { t: SYS + 0.13, dur: 0.38, kind: "murmurLo", amp: 0.6, shape: "rumble" }];
    case "asd": return [S1(), { t: 0.08, dur: 0.18, kind: "murmurMid", amp: 0.35, shape: "diamond" }, S2(SYS - 0.02, 0.7), S2(SYS + 0.045, 0.6)];
    case "s3": return [S1(), S2(), { t: SYS + 0.15, dur: 0.06, kind: "S", amp: 0.5, shape: "tap" }];
  }
}
const env = (e: Ev, x: number) => {
  // x は 0〜1（音の中の位置）
  switch (e.shape) {
    case "tap": return Math.sin(Math.PI * x) ** 0.6;
    case "flat": return x < 0.08 ? x / 0.08 : x > 0.92 ? (1 - x) / 0.08 : 1;
    case "diamond": return 1 - Math.abs(2 * x - 1);
    case "decr": return x < 0.05 ? x / 0.05 : 1 - (x - 0.05) / 0.95;
    case "rumble": return 0.55 + 0.45 * (x > 0.75 ? (x - 0.75) / 0.25 : 0) - 0.25 * Math.sin(Math.PI * x);
  }
};

/** 心音図（2周期） */
function pcg(p: Profile) {
  const W = 400, H = 90, C = H / 2, sx = W / (CYCLE * 2);
  let path = "";
  for (let i = 0; i <= 800; i++) {
    const t = (i / 800) * CYCLE * 2, tc = t % CYCLE;
    let a = 0;
    for (const e of events(p)) if (tc >= e.t && tc <= e.t + e.dur) {
      const x = (tc - e.t) / e.dur, k = env(e, x) * e.amp;
      const f = e.kind === "S" ? 55 : e.kind === "murmurHi" ? 160 : e.kind === "murmurMid" ? 120 : 70;
      a += k * (e.kind === "S" ? Math.sin(2 * Math.PI * f * (tc - e.t)) : Math.sin(2 * Math.PI * f * t) * (0.6 + 0.4 * Math.sin(t * 997)));
    }
    path += `${i ? "L" : "M"}${(t * sx).toFixed(1)} ${(C - a * 34).toFixed(1)}`;
  }
  const marks = [0, 1].flatMap((k) => [`<text x="${(k * CYCLE) * sx + 2}" y="12">S1</text>`, `<text x="${(k * CYCLE + SYS) * sx + 2}" y="12">S2</text>`]).join("");
  return `<svg class="pcg" viewBox="0 0 ${W} ${H}" role="img" aria-label="心音図"><line x1="0" y1="${C}" x2="${W}" y2="${C}" stroke="#1E4632"/>${marks}<path d="${path}" fill="none" stroke="#5CFF9D" stroke-width="1.2"/></svg>`;
}

let ac: AudioContext | null = null;
let noise: AudioBuffer | null = null;
function play(p: Profile, cycles = 4) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = ac || new AC();
    if (!noise) { noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const ch = noise.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
    const t0 = ac.currentTime + 0.05, out = ac.createGain();
    out.gain.value = 0.9; out.connect(ac.destination);
    for (let c = 0; c < cycles; c++) for (const e of events(p)) {
      const start = t0 + c * CYCLE + e.t, g = ac.createGain();
      g.gain.setValueAtTime(0, start);
      for (let k = 1; k <= 12; k++) g.gain.linearRampToValueAtTime(env(e, k / 12) * e.amp * (e.kind === "S" ? 0.9 : 0.35), start + (e.dur * k) / 12);
      g.connect(out);
      if (e.kind === "S") {
        // 心音：低い「ドン」（小さなスピーカーでも聞こえるよう少し高め）
        const o = ac.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(e.amp > 1 ? 150 : 110, start); o.frequency.exponentialRampToValueAtTime(60, start + e.dur);
        o.connect(g); o.start(start); o.stop(start + e.dur + 0.02);
      } else {
        // 雑音：帯域を絞ったノイズ（高い＝逆流の「ザー」、中＝駆出性、低い＝ランブル）
        const src = ac.createBufferSource(); src.buffer = noise;
        const bp = ac.createBiquadFilter(); bp.type = "bandpass";
        bp.frequency.value = e.kind === "murmurHi" ? 600 : e.kind === "murmurMid" ? 300 : 140; bp.Q.value = e.kind === "murmurLo" ? 2 : 1.2;
        src.connect(bp).connect(g); src.start(start, Math.random()); src.stop(start + e.dur + 0.02);
      }
    }
  } catch { /* 音が出なくても心音図で遊べる */ }
}

const SHORT: Record<Area, string> = { "2RSB": "右2", "2LSB": "左2", "3LSB": "左3", "4LSB": "左4", apex: "心尖部" };
function chest(labels: Record<Area, string>) {
  const P: Record<Area, [number, number]> = { "2RSB": [104, 70], "2LSB": [156, 70], "3LSB": [156, 102], "4LSB": [150, 136], apex: [196, 160] };
  return `<svg class="chest" viewBox="0 0 260 230" role="group" aria-label="胸の聴診部位（見る人の左が患者の右）">
    <path d="M40 20 C70 6 190 6 220 20 L236 220 L24 220Z" fill="#FFE1CC" stroke="var(--line)" stroke-width="3"/>
    <path d="M130 30 L130 190" stroke="#E0B89E" stroke-width="8"/>
    ${[50, 80, 110, 140, 170].map((y) => `<path d="M60 ${y} Q130 ${y - 14} 200 ${y}" stroke="#E0B89E" stroke-width="2" fill="none"/>`).join("")}
    <path d="M146 96 C150 70 200 72 206 110 C212 150 184 172 170 176 C150 160 140 130 146 96Z" fill="#FF9E9E" opacity=".35"/>
    ${AREAS.map((a) => `<g class="spot" data-a="${a}" tabindex="0" role="button" aria-label="${esc(labels[a])}"><circle cx="${P[a][0]}" cy="${P[a][1]}" r="11"/><text x="${a === "2RSB" ? P[a][0] - 16 : P[a][0] + 16}" y="${P[a][1] + 3}" text-anchor="${a === "2RSB" ? "end" : "start"}">${SHORT[a]}</text></g>`).join("")}
    <text x="10" y="226" font-size="9" fill="var(--sub)">患者の右</text>
  </svg><p class="ecgHint" style="text-align:center">${AREAS.map((a) => `${SHORT[a]}＝${esc(labels[a])}`).join("　")}</p>`;
}

export const heartSounds: CustomModule<HeartSoundsData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;

    function render() {
      const c = q[qi % q.length];
      let nameOk = false;
      const opts = shuffle([c.name, ...shuffle(d.cases.filter((x) => x.name !== c.name)).slice(0, 4).map((x) => x.name)]);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="listen"><button class="btn play">▶ 聴く（4拍）</button><span class="small" style="font-weight:800;color:var(--sub)">イヤホン推奨。音が出なくても心音図で答えられる</span></div>
        ${pcg(c.profile)}
        <div class="stepLabel">① これは？</div><div class="opts">${opts.map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="fb1"></div><div class="step2"></div>`;
      $(".play", root).onclick = () => play(c.profile);
      $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
        nameOk = b.dataset.a === c.name;
        $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (x.dataset.a === c.name) x.classList.add("right"); });
        if (nameOk) { ctx.sound.ding(); ctx.award(NAME_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② いちばんよく聴こえる場所は？</div>${chest(d.areaLabels)}<div class="fbBox"></div>`;
        const pickArea = (g: Element) => {
          if (box.dataset.done) return;
          box.dataset.done = "1";
          const a = g.getAttribute("data-a") as Area, ok = a === c.area;
          $(`.spot[data-a="${c.area}"]`, box).classList.add("right");
          if (!ok) g.classList.add("wrong");
          if (ok) { ctx.sound.ding(); ctx.award(AREA_COINS, g); } else ctx.sound.boo();
          if (!nameOk || !ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story} ${c.explanation.split("。")[0]}。これは？`, opts: shuffle([c.name, ...opts.filter((o) => o !== c.name).slice(0, 2)]), ans: c.name });
          if (nameOk && ok && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, nameOk && ok, nameOk && ok ? "両方正解！" : ok ? "場所は正解！" : `よく聴こえるのは「${esc(d.areaLabels[c.area])}」`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        };
        $$(".spot", box).forEach((g) => {
          g.addEventListener("click", () => pickArea(g));
          g.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); pickArea(g); } });
        });
      }));
    }
    render();
  },
};
