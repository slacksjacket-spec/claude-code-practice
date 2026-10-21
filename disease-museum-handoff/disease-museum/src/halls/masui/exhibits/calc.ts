// 輸液ポンプ計算：患者の情報から輸液量・滴下数・補正の上限を計算して選ぶ。答えはコードで計算
import "./masui.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CalcData } from "./calc.schema";
import { solve } from "./calc.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const COINS = 18;

export const infusionCalc: CustomModule<CalcData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], s = solve(c), fmt = (v: number) => `${v.toLocaleString()} ${s.unit}`;
      const opts = shuffle([s.ans, ...[...new Set(s.wrong.filter((w) => w !== s.ans && w > 0))].slice(0, 3)]);
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="calcCard">${esc(c.story)}${c.weight ? `<br>体重 <b>${c.weight} kg</b>` : ""}${c.na !== undefined ? `　Na <b>${c.na}</b>` : ""}${c.mlh ? `<br>指示 <b>${c.mlh} mL/時</b>　輸液セット <b>${c.set}滴/mL</b>` : ""}</div>
        <div class="stepLabel">${esc(c.question)}</div>
        <div class="opts">${opts.map((v) => `<button class="opt" data-v="${v}">${fmt(v)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
        const ok = +b.dataset.v! === s.ans;
        $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.v! === s.ans) x.classList.add("right"); });
        if (ok) { ctx.sound.ding(); ctx.award(COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        else { b.classList.add("wrong"); ctx.sound.boo(); ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${c.weight ? `（${c.weight} kg）` : ""}${c.question}`, opts: shuffle([fmt(s.ans), ...opts.filter((v) => v !== s.ans).slice(0, 2).map(fmt)]), ans: fmt(s.ans) }); }
        ctx.feedback($(".fbBox", root), ok, ok ? "計算ぴったり！" : `正解は ${fmt(s.ans)}`, `${esc(s.how)}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の指示</button></div>`);
        $(".next", root).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      }));
    }
    render();
  },
};
