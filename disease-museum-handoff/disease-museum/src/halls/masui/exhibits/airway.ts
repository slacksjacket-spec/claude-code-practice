// Mallampati分類：口を大きく開けて舌を出した絵から分類を当て（12）、気道の評価や対応を答える（12）
import "./masui.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { AirwayData } from "./airway.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 12, C2 = 12;
const SEEN = ["", "軟口蓋・口峡・口蓋垂・口蓋弓が見える", "軟口蓋・口峡・口蓋垂が見える", "軟口蓋と口蓋垂の根元だけ見える", "硬口蓋しか見えない"];
/** 舌の上端の高さで、奥がどこまで見えるかが変わる */
function mouth(cls: number) {
  const tongueTop = [0, 168, 138, 112, 66][cls];
  return `<svg class="mouth" viewBox="0 0 240 220" role="img" aria-label="口を開けて舌を出したところ（模式）">
    <ellipse cx="120" cy="110" rx="96" ry="92" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
    <ellipse cx="120" cy="116" rx="70" ry="80" fill="#5A1A24" stroke="#1C1537" stroke-width="3"/>
    <path d="M56 70 Q120 22 184 70 L176 80 Q120 40 64 80Z" fill="#F2B8B8"/>
    <path d="M64 80 Q120 50 176 80 L170 100 Q120 76 70 100Z" fill="#E89AA0"/>
    ${cls === 1 ? `<path d="M70 100 Q74 150 84 186 M170 100 Q166 150 156 186" stroke="#C86A78" stroke-width="7" fill="none"/>
    <path d="M86 104 Q90 150 96 186 M154 104 Q150 150 144 186" stroke="#B05A68" stroke-width="5" fill="none"/>` : ""}
    <path d="M114 78 Q120 74 126 78 L124 118 Q120 128 116 118Z" fill="#E87A88" stroke="#B05A68" stroke-width="2"/>
    <path d="M44 ${tongueTop + 40} Q120 ${tongueTop - 30} 196 ${tongueTop + 40} L196 220 L44 220Z" fill="#F08A94" stroke="#1C1537" stroke-width="3"/>
    <path d="M120 ${tongueTop + 10} L120 ${tongueTop + 60}" stroke="#D86A78" stroke-width="2"/>
    ${[[70, 20], [94, 14], [120, 12], [146, 14], [170, 20]].map(([x, y]) => `<rect x="${x - 9}" y="${y + 8}" width="18" height="16" rx="4" fill="#fff" stroke="#1C1537" stroke-width="2"/>`).join("")}
  </svg>`;
}

export const mallampati: CustomModule<AirwayData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length];
      let stage = 0, ok1 = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${mouth(c.cls)}
        <div class="stepLabel">① Mallampati分類は？（座って口を大きく開け、舌を出し、声は出さない）</div>
        <div class="classes s1">${[1, 2, 3, 4].map((k) => `<button class="opt" data-k="${k}">${["I", "II", "III", "IV"][k - 1]}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".s1 .opt", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; ok1 = +b.dataset.k! === c.cls;
        $$<HTMLButtonElement>(".s1 .opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.k! === c.cls) x.classList.add("right"); });
        if (ok1) { ctx.sound.ding(); ctx.award(C1, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok1) ctx.miss({ id: `${ex.id}-${c.id}-cls`, src: ex.title, q: `口を開けると「${SEEN[c.cls]}」。Mallampati分類は？`, opts: shuffle([`クラス${c.cls}`, ...shuffle([1, 2, 3, 4].filter((k) => k !== c.cls)).slice(0, 2).map((k) => `クラス${k}`)]), ans: `クラス${c.cls}` });
          if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `クラス${["I", "II", "III", "IV"][c.cls - 1]}：${SEEN[c.cls]}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
