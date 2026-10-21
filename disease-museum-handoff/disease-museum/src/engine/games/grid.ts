// 分類マス：所見カードを読んで、表のどのマスに当たるかをタップ。続けて治療・対応を選ぶ（例：心不全の4分類、酸塩基平衡、甲状腺機能）
import "./grid.css";
import type { CustomModule } from "../exhibits/types";
import type { GridData } from "./grid.schema";
import { $, $$, esc, shuffle } from "../dom";

export const grid: CustomModule<GridData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`, R = d.rowLabels.length, C = d.colLabels.length;
    const cellCoins = d.treatments ? 10 : 15, TX_COINS = 15;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ans = d.cells.find((x) => x.id === c.cell)!;
      let cellOk = false, stage = 0;
      ctx.cheat.reset(ex.id);
      let cells = "";
      for (let r = 0; r < R; r++) {
        cells += `<span class="ax v">${esc(d.rowLabels[r])}</span>`;
        for (let k = 0; k < C; k++) {
          const cell = d.cells.find((x) => x.row === r && x.col === k);
          cells += cell ? `<button data-c="${esc(cell.id)}"><b>${esc(cell.label)}</b>${cell.sub ? `<span class="small">${esc(cell.sub)}</span>` : ""}</button>` : `<span class="blank"></span>`;
        }
      }
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div class="signs">${c.signs.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
        <div class="stepLabel">① ${esc(d.question ?? "どのマス？")}</div>
        <div class="gridQ" style="grid-template-columns:auto repeat(${C},1fr)"><span></span>${d.colLabels.map((l) => `<span class="ax">${esc(l)}</span>`).join("")}${cells}</div>
        <div class="step2"></div>`;
      const finish = (ok: boolean, title: string) => {
        if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.who}：${c.signs.join("、")}。${d.treatments ? d.treatQuestion ?? "治療は？" : d.question ?? "どれ？"}`, ...(d.treatments
          ? (() => { const a = d.treatments![c.treatment!]; return { opts: shuffle([a, ...shuffle(d.treatments!.filter((t) => t !== a)).slice(0, 2)]), ans: a }; })()
          : { opts: shuffle([ans.label, ...shuffle(d.cells.filter((x) => x.id !== ans.id)).slice(0, 2).map((x) => x.label)]), ans: ans.label }) });
        if (ok && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
        const box = $(".step2", root), fb = document.createElement("div");
        box.append(fb);
        ctx.feedback(fb, ok, title, `${esc(ans.label)}${ans.sub ? `（${esc(ans.sub)}）` : ""}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
        $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      };
      $$<HTMLButtonElement>(".gridQ button", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1;
        cellOk = b.dataset.c === c.cell;
        $(`.gridQ button[data-c="${CSS.escape(c.cell)}"]`, root).classList.add("right");
        if (!cellOk) b.classList.add("wrong");
        if (cellOk) { ctx.sound.ding(); ctx.award(cellCoins, b); } else ctx.sound.boo();
        if (!d.treatments) { ctx.cheat.rewardIfUnpeeked(ex.id, b); finish(cellOk, cellOk ? "正解！" : `正解は「${esc(ans.label)}」`); return; }
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(d.treatQuestion ?? "治療は？")}</div><div class="opts">${d.treatments.map((t, i) => `<button class="opt" data-i="${i}">${esc(t)}</button>`).join("")}</div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === c.treatment;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.treatment) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(TX_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          finish(ok && cellOk, ok && cellOk ? "両方正解！" : ok ? "治療は正解！" : `正解は「${esc(d.treatments![c.treatment!])}」`);
        }));
      }));
    }
    render();
  },
};
