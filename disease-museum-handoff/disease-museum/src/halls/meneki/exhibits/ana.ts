// 抗核抗体の染色型：蛍光顕微鏡のHEp-2細胞の光り方から染色型を答え、続けて関係する抗体・病気を答える
import "./ana.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { AnaData } from "./ana.schema";
import { PATTERNS, PATTERN_IDS, type Pattern } from "./ana.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const PAT_COINS = 12, Q_COINS = 12;
const G = "#7CFF6B", rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** 細胞1個（cx, cy を中心に）。核の光り方を染色型で変える */
function cell(p: Pattern, cx: number, cy: number) {
  const rx = rnd(20, 25), ry = rnd(15, 19), rot = rnd(0, 180);
  const inside = (n: number, r: number, size: number) => Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2, t = Math.sqrt(Math.random()) * 0.85;
    return `<circle cx="${(Math.cos(a) * rx * t).toFixed(1)}" cy="${(Math.sin(a) * ry * t).toFixed(1)}" r="${r}" fill="${G}" opacity="${size}"/>`;
  }).join("");
  let nuc = "";
  if (p === "homo") nuc = `<ellipse rx="${rx}" ry="${ry}" fill="${G}" opacity=".85"/>`;
  else if (p === "speckled") nuc = `<ellipse rx="${rx}" ry="${ry}" fill="${G}" opacity=".25"/>${inside(70, 1, 0.9)}`;
  else if (p === "centro") nuc = `<ellipse rx="${rx}" ry="${ry}" fill="${G}" opacity=".06"/>${inside(42, 1.6, 1)}`;
  else if (p === "nucleolar") nuc = `<ellipse rx="${rx}" ry="${ry}" fill="${G}" opacity=".12"/>${inside(4, 4.2, 0.95)}`;
  else nuc = `<ellipse rx="${rx}" ry="${ry}" fill="${G}" opacity=".15" stroke="${G}" stroke-width="3.5"/>`;
  return `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot.toFixed(0)})"><ellipse rx="${rx + 12}" ry="${ry + 9}" fill="#0E2A12" opacity=".7"/>${nuc}</g>`;
}
function figure(p: Pattern) {
  const pts: [number, number][] = [];
  for (let t = 0; pts.length < 7 && t < 500; t++) {
    const q: [number, number] = [rnd(40, 280), rnd(36, 164)];
    if (pts.every(([x, y]) => Math.hypot(x - q[0], y - q[1]) > 70)) pts.push(q);
  }
  return `<svg class="anaFig" viewBox="0 0 320 200" role="img" aria-label="蛍光抗体法の視野">${pts.map(([x, y]) => cell(p, x, y)).join("")}</svg>`;
}

export const ana: CustomModule<AnaData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ans = c.pattern as Pattern;
      let stage = 0, patOk = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${figure(ans)}
        <div class="stepLabel">① 染色型は？</div>
        <div class="anaPats">${PATTERN_IDS.map((k) => `<button class="opt" data-k="${k}">${PATTERNS[k]}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".anaPats .opt", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; patOk = b.dataset.k === ans;
        $$<HTMLButtonElement>(".anaPats .opt", root).forEach((x) => { x.disabled = true; if (x.dataset.k === ans) x.classList.add("right"); });
        if (patOk) { ctx.sound.ding(); ctx.award(PAT_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(Q_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !patOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `抗核抗体が${PATTERNS[ans]}。${c.story}${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && patOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && patOk, ok && patOk ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `染色型：${PATTERNS[ans]}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
