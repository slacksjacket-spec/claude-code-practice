// CTG読み：胎児心拍数陣痛図（10分）を読んで一過性徐脈の種類を答え、続けて評価や対応を答える
import "./ctg.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CtgData } from "./ctg.schema";
import { DECEL_IDS, DECEL_LABEL, synthCtg, type Decel } from "./ctg.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const TYPE_COINS = 12, Q_COINS = 12;
const W = 600, FH = 170, UH = 80, GAP = 14;
const yF = (b: number) => FH - ((Math.max(60, Math.min(200, b)) - 60) / 140) * FH;
const yU = (u: number) => FH + GAP + UH - (Math.min(100, u) / 100) * UH;

function chart(c: CtgData["cases"][number]) {
  const { fhr, uc } = synthCtg({ baseline: c.baseline, variability: c.variability, accel: c.accel, decel: c.decel as Decel, sinusoidal: c.sinusoidal });
  let grid = "";
  for (let b = 60; b <= 200; b += 10) grid += `<line x1="0" x2="${W}" y1="${yF(b)}" y2="${yF(b)}" stroke="#F2B3A6" stroke-width="${b % 30 === 0 ? 1 : 0.4}"/>${b % 30 === 0 ? `<text x="3" y="${yF(b) - 2}" font-size="9">${b}</text>` : ""}`;
  for (let u = 0; u <= 100; u += 25) grid += `<line x1="0" x2="${W}" y1="${yU(u)}" y2="${yU(u)}" stroke="#F2B3A6" stroke-width=".5"/>`;
  for (let t = 0; t <= W; t += 60) grid += `<line x1="${t}" x2="${t}" y1="0" y2="${FH + GAP + UH}" stroke="#E8A090" stroke-width="${t % 60 === 0 ? 0.9 : 0.4}"/>`;
  const line = (arr: number[], f: (v: number) => number) => arr.map((v, i) => `${i},${f(v).toFixed(1)}`).join(" ");
  return `<div class="ctgWrap"><svg viewBox="0 0 ${W} ${FH + GAP + UH + 12}" role="img" aria-label="胎児心拍数陣痛図（10分間）">
    <rect x="0" y="${yF(160)}" width="${W}" height="${yF(110) - yF(160)}" fill="#E7F7EF"/>
    ${grid}
    <polyline points="${line(fhr, yF)}" fill="none" stroke="#1C1537" stroke-width="1.6" stroke-linejoin="round"/>
    <polyline points="${line(uc, yU)}" fill="none" stroke="#3D5AFE" stroke-width="1.6"/>
    <text x="${W - 4}" y="12" font-size="10" text-anchor="end">胎児心拍数（bpm）・緑は正常域110〜160</text>
    <text x="${W - 4}" y="${FH + GAP + 10}" font-size="10" text-anchor="end">子宮収縮</text>
    <text x="${W - 4}" y="${FH + GAP + UH + 11}" font-size="9" text-anchor="end">縦線は1分ごと</text>
  </svg></div>`;
}

export const ctg: CustomModule<CtgData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ans = c.decel as Decel;
      let stage = 0, typeOk = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${chart(c)}
        <div class="stepLabel">① 一過性徐脈は？</div>
        <div class="ctgTypes">${DECEL_IDS.map((k) => `<button class="opt" data-k="${k}">${DECEL_LABEL[k]}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".ctgTypes .opt", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; typeOk = b.dataset.k === ans;
        $$<HTMLButtonElement>(".ctgTypes .opt", root).forEach((x) => { x.disabled = true; if (x.dataset.k === ans) x.classList.add("right"); });
        if (typeOk) { ctx.sound.ding(); ctx.award(TYPE_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(Q_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !typeOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `CTGで${DECEL_LABEL[ans]}（基線 ${c.baseline}）。${c.story}${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && typeOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && typeOk, ok && typeOk ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `${DECEL_LABEL[ans]}、基線 ${c.baseline} bpm。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
