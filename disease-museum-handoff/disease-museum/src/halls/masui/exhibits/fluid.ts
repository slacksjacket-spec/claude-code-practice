// 輸液のゆくえ：1,000 mLを入れたとき血管内に残る量をスライダーで予想し（当たれば15）、3つの区画に分かれる様子を見る → 続けて質問（10）
import "./masui.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { FluidData } from "./fluid.schema";
import { PRODUCTS, split, type Product } from "./fluid.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 15, C2 = 10;
const near = (g: number, t: number) => Math.abs(g - t) <= Math.max(40, t * 0.2);

export const fluidSpace: CustomModule<FluidData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], p = c.product as Product, [iv, is, ic] = split(p);
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="bag" style="margin-top:8px"><i class="pack" aria-hidden="true"></i><div><span class="small">1,000 mL・Na ${PRODUCTS[p].na} mEq/L</span><b>${esc(PRODUCTS[p].label)}</b></div></div>
        <div class="stepLabel">① しばらくして血管内に残るのは何 mL？</div>
        <div class="guess"><span class="val">500</span> mL<input type="range" min="0" max="1000" step="10" value="500" aria-label="血管内に残る量"></div>
        <div class="row" style="justify-content:center"><button class="btn go">投与する</button></div>
        <div class="comp" aria-live="polite">${["血管内", "間質", "細胞内"].map((n) => `<div><i style="height:0%"></i><span>${n}</span><b>?</b></div>`).join("")}</div>
        <div class="step2"></div>`;
      const range = $("input", root) as HTMLInputElement;
      range.oninput = () => { $(".val", root).textContent = range.value; };
      $(".go", root).onclick = () => {
        if (stage) return;
        stage = 1;
        range.disabled = true; $(".go", root).setAttribute("disabled", "");
        const g = +range.value, ok1 = near(g, iv);
        $$(".comp div", root).forEach((el, i) => { const v = [iv, is, ic][i]; ($("i", el) as HTMLElement).style.height = `${v / 10}%`; $("b", el).textContent = `${v} mL`; });
        if (ok1) { ctx.sound.ding(); ctx.award(C1, $(".comp", root)); } else ctx.sound.boo();
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${ok1 ? "ほぼ正解！" : "おしい。"}あなたの予想 ${g} mL → 血管内 ${iv} mL</p>
          <div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok1) ctx.miss({ id: `${ex.id}-${p}`, src: ex.title, q: `${PRODUCTS[p].label} 1,000 mLのうち、血管内に残るのはおよそ？`, opts: shuffle([`${iv} mL`, ...shuffle([1000, 500, 250, 180, 120, 80].filter((v) => !near(v, iv))).slice(0, 2).map((v) => `${v} mL`)]), ans: `${iv} mL` });
          if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `${esc(c.explanation)}<br><span class="small">計算：Naの濃さの分は細胞外液（血管内1/4・間質3/4）へ、残りの自由水は体液全体（細胞内2/3）へ広がるとした模式。</span><div style="margin-top:8px"><button class="btn next">次の輸液</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      };
    }
    render();
  },
};
