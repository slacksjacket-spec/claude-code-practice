// 2×2表の計算：研究の2×2表から、相対危険・オッズ比・リスク差・NNT・感度などを計算して選ぶ（18）。答えはコードで計算
import "./koshu.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { EpiData } from "./epi.schema";
import { ASK_LABEL, HEAD, solve, type Ask, type Design } from "./epi.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const COINS = 18;

export const epiCalc: CustomModule<EpiData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], h = HEAD[c.design as Design], [a, b, cc, dd] = c.table, s = solve(c.ask as Ask, c.table);
      const opts = shuffle([s.ans, ...[...new Set(s.wrong.filter((w) => w !== s.ans))].slice(0, 3)]);
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <table class="tbl2"><tr><th></th><th>${h.cols[0]}</th><th>${h.cols[1]}</th></tr>
          <tr><th>${h.rows[0]}</th><td><small>a</small>${a}</td><td><small>b</small>${b}</td></tr>
          <tr><th>${h.rows[1]}</th><td><small>c</small>${cc}</td><td><small>d</small>${dd}</td></tr></table>
        <div class="stepLabel">${ASK_LABEL[c.ask as Ask]}は？</div>
        <div class="opts">${opts.map((v) => `<button class="opt" data-v="${esc(v)}">${esc(v)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".opt", root).forEach((btn) => (btn.onclick = () => {
        const ok = btn.dataset.v === s.ans;
        $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (x.dataset.v === s.ans) x.classList.add("right"); });
        if (ok) { ctx.sound.ding(); ctx.award(COINS, btn); ctx.cheat.rewardIfUnpeeked(ex.id, btn); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        else { btn.classList.add("wrong"); ctx.sound.boo(); ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${h.rows[0]}・${h.cols[0]}の2×2表 a=${a}, b=${b}, c=${cc}, d=${dd}。${ASK_LABEL[c.ask as Ask]}は？`, opts: shuffle([s.ans, ...opts.filter((v) => v !== s.ans).slice(0, 2)]), ans: s.ans }); }
        ctx.feedback($(".fbBox", root), ok, ok ? "計算ぴったり！" : `正解は ${esc(s.ans)}`, `${esc(s.how)}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の表</button></div>`);
        $(".next", root).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      }));
    }
    render();
  },
};
