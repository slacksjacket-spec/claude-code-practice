// 診断基準チェック：患者の所見の中から、診断基準に入るものを全部選び（15）、数えて判断する（10）
import "./criteria.css";
import type { CustomModule } from "../exhibits/types";
import type { CriteriaData } from "./criteria.schema";
import { $, $$, esc, shuffle } from "../dom";

const PICK_COINS = 15, Q_COINS = 10;

export const criteria: CustomModule<CriteriaData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], items = shuffle(c.items.map((it, i) => ({ ...it, i }))), sel = new Set<number>();
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(c.who)}</span></div>
        <div class="stepLabel">① 「${esc(c.criteria)}」に入るものを全部チェック</div>
        <div class="critItems">${items.map((it) => `<button data-i="${it.i}" aria-pressed="false">${esc(it.text)}</button>`).join("")}</div>
        <div class="critCount">チェック <span class="n">0</span> 個</div>
        <div class="row" style="justify-content:center;margin-top:8px"><button class="btn go">数え終わった</button></div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".critItems button", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        const i = +b.dataset.i!;
        sel.has(i) ? sel.delete(i) : sel.add(i);
        b.setAttribute("aria-pressed", String(sel.has(i)));
        $(".n", root).textContent = String(sel.size);
        ctx.sound.beep(sel.has(i) ? 680 : 440, 0.05, "triangle", 0.04);
      }));
      $(".go", root).onclick = () => {
        if (stage) return;
        stage = 1;
        $(".go", root).setAttribute("disabled", "");
        let miss = 0;
        $$<HTMLButtonElement>(".critItems button", root).forEach((b) => {
          const i = +b.dataset.i!, t = c.items[i].counts, s = sel.has(i);
          b.disabled = true;
          if (t && s) b.classList.add("right"); else if (s) { b.classList.add("wrong"); miss++; } else if (t) { b.classList.add("missed"); miss++; }
        });
        const nTrue = c.items.filter((x) => x.counts).length, pickOk = miss === 0;
        $(".critCount", root).textContent = `基準に入るのは ${nTrue} 個`;
        if (pickOk) { ctx.sound.ding(); ctx.award(PICK_COINS, $(".critCount", root)); } else ctx.sound.boo();
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(c.question)}</div><div class="opts">${c.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === c.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(Q_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !pickOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.who}：${c.items.map((x) => x.text).join("、")}。${c.question}`, opts: shuffle([c.options[c.answer], ...shuffle(c.options.filter((_, i) => i !== c.answer)).slice(0, 2)]), ans: c.options[c.answer] });
          if (ok && pickOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && pickOk, ok && pickOk ? "チェックも判断も正解！" : ok ? "判断は正解！（チェックは点線と赤を確認）" : `正解は「${esc(c.options[c.answer])}」`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      };
    }
    render();
  },
};
