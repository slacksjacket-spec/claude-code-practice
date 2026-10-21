// カプノグラム：麻酔中の呼気CO₂の波形（24秒）を読んで何が起きているかを当て（12）、対応を答える（12）
import "./masui.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CapnoData } from "./capno.schema";
import { CAPNO_HZ, synthCapno, type Capno } from "./capno.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 12, C2 = 12, W = 600, H = 170, T = 14, B = 150;
const y = (v: number) => B - (Math.min(80, v) / 80) * (B - T);

function chart(p: Capno) {
  const s = synthCapno(p), x = (i: number) => (i / s.length) * W;
  const grid = [0, 20, 40, 60, 80].map((v) => `<line x1="0" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="#1E3A2A"/><text x="4" y="${y(v) - 2}" font-size="10" fill="#5A8A6A" font-weight="800">${v}</text>`).join("");
  const sec = Array.from({ length: s.length / CAPNO_HZ / 4 + 1 }, (_, i) => `<line x1="${x(i * 4 * CAPNO_HZ)}" x2="${x(i * 4 * CAPNO_HZ)}" y1="${T}" y2="${B}" stroke="#16281E"/>`).join("");
  return `<svg class="capno" viewBox="0 0 ${W} ${H}" role="img" aria-label="カプノグラム（24秒）">${sec}${grid}
    <polyline points="${s.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}" fill="none" stroke="#FFD84A" stroke-width="2.2" stroke-linejoin="round"/>
    <text x="${W - 6}" y="${H - 4}" font-size="10" fill="#BFE8C0" text-anchor="end" font-weight="800">EtCO₂（mmHg）・縦線は4秒ごと</text></svg>`;
}

export const capnogram: CustomModule<CapnoData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length];
      let stage = 0, ok1 = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${chart(c.pattern as Capno)}
        <div class="stepLabel">① 何が起きている？</div>
        <div class="opts s1">${c.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".s1 .opt", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; ok1 = +b.dataset.i! === c.answer;
        $$<HTMLButtonElement>(".s1 .opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.answer) x.classList.add("right"); });
        if (ok1) { ctx.sound.ding(); ctx.award(C1, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok1) ctx.miss({ id: `${ex.id}-${c.id}-wave`, src: ex.title, q: `${c.story} カプノグラムの変化から考えるのは？`, opts: shuffle([c.options[c.answer], ...shuffle(c.options.filter((_, i) => i !== c.answer)).slice(0, 2)]), ans: c.options[c.answer] });
          if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.options[c.answer]}。${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `①の答え：${esc(c.options[c.answer])}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の波形</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
