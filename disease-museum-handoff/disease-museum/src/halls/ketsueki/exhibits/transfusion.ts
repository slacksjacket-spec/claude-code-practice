// 輸血バッグ：受血者の血液型と製剤を見て、入れても溶血しないバッグを全部選ぶ
import "./transfusion.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { TransfusionData } from "./transfusion.schema";
import { compatible, PRODUCT_LABEL, TYPES } from "./transfusion.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const COINS = 20;
const show = (t: string) => t === "unknown" ? "不明" : t.replace("-", "（Rh−）").replace("+", "（Rh＋）");

export const transfusion: CustomModule<TransfusionData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ok = TYPES.filter((t) => compatible(c.recipient, t, c.product));
      const picked = new Set<string>();
      let done = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="pcard"><div style="font-weight:800">${esc(c.story)}</div>
          <div class="recipient"><span class="small">受血者</span><span class="bt">${esc(show(c.recipient))}</span><span class="chip">${PRODUCT_LABEL[c.product]}</span></div></div>
        <div class="stepLabel">入れても溶血しないバッグを全部タップ</div>
        <div class="bags">${TYPES.map((t) => `<button class="bag ${c.product}" data-t="${t}" aria-pressed="false"><i class="fill"></i><span>${t.replace("-", "−").replace("+", "＋")}</span></button>`).join("")}</div>
        <div class="axisGo" style="display:flex;justify-content:center;margin-top:12px"><button class="btn go">輸血する</button></div>
        <div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".bag", root).forEach((b) => (b.onclick = () => {
        if (done) return;
        const t = b.dataset.t!;
        if (picked.has(t)) picked.delete(t); else picked.add(t);
        b.classList.toggle("on", picked.has(t)); b.setAttribute("aria-pressed", String(picked.has(t)));
        ctx.sound.beep(picked.has(t) ? 660 : 440, 0.05, "triangle", 0.04);
      }));
      $(".go", root).onclick = () => {
        if (done) return;
        if (!picked.size) { ctx.toast("バッグを選んでから"); return; }
        done = true;
        let perfect = true;
        $$<HTMLButtonElement>(".bag", root).forEach((b) => {
          const t = b.dataset.t! as (typeof TYPES)[number], good = ok.includes(t), sel = picked.has(t);
          b.disabled = true; b.classList.remove("on");
          if (sel && good) b.classList.add("right");
          else if (sel && !good) { b.classList.add("wrong"); perfect = false; }
          else if (!sel && good) { b.classList.add("missed"); perfect = false; }
        });
        const okText = ok.map((t) => t.replace("-", "−").replace("+", "＋")).join("・");
        if (perfect) { ctx.sound.ding(); ctx.award(COINS, $(".go", root)); ctx.cheat.rewardIfUnpeeked(ex.id, $(".go", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        else {
          ctx.sound.boo();
          const wrongs = shuffle(TYPES.filter((t) => !ok.includes(t))).slice(0, 2).map((t) => `${okText.split("・")[0]}と${t.replace("-", "−").replace("+", "＋")}`);
          ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `受血者 ${show(c.recipient)}、${PRODUCT_LABEL[c.product]}。入れてよいバッグは？`, opts: shuffle([okText, ...wrongs]), ans: okText });
        }
        ctx.feedback($(".fbBox", root), perfect, perfect ? "安全に輸血できた！" : "おしい。点線の枠が選び忘れ、赤い枠が不適合", `入れてよいのは ${okText}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
        $(".next", root).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      };
    }
    render();
  },
};
