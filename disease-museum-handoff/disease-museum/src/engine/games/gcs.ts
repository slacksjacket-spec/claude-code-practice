// GCS採点：患者の反応の様子を読んで、E（開眼）・V（言葉）・M（運動）を付ける。続けて質問が出せる
import "./gcs.css";
import type { CustomModule } from "../exhibits/types";
import type { GcsData } from "./gcs.schema";
import { GCS, type GcsKey } from "./gcs.consts";
import { $, $$, esc, shuffle } from "../dom";

const COINS = 15, FOLLOW_COINS = 10;
const NAME: Record<GcsKey, string> = { E: "E 開眼", V: "V 言葉", M: "M 運動" };

export const gcs: CustomModule<GcsData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], truth: Record<GcsKey, number> = { E: c.e, V: c.v, M: c.m };
      const sel: Partial<Record<GcsKey, number>> = {};
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div style="margin-top:6px;font-weight:800">${esc(c.story)}</div></div>
        ${(Object.keys(GCS) as GcsKey[]).map((k) => `<div class="gcsRow" data-k="${k}"><h4>${NAME[k]}</h4><div class="gcsBtns">${GCS[k].map(([n, t]) => `<button data-n="${n}" aria-pressed="false"><b>${n}</b>${esc(t)}</button>`).join("")}</div></div>`).join("")}
        <div class="gcsTotal">合計 <span class="tot">—</span></div>
        <div class="row" style="justify-content:center;margin-top:8px"><button class="btn go">採点する</button></div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".gcsBtns button", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        const k = b.closest<HTMLElement>(".gcsRow")!.dataset.k as GcsKey;
        sel[k] = +b.dataset.n!;
        $$<HTMLButtonElement>(`.gcsRow[data-k="${k}"] button`, root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        ctx.sound.beep(500 + sel[k]! * 60, 0.05, "triangle", 0.04);
        if (sel.E && sel.V && sel.M) $(".tot", root).textContent = `E${sel.E}V${sel.V}M${sel.M} ＝ ${sel.E + sel.V + sel.M}`;
      }));
      $(".go", root).onclick = () => {
        if (stage) return;
        if (!sel.E || !sel.V || !sel.M) { ctx.toast("E・V・M を全部選んでから"); return; }
        stage = 1;
        $(".go", root).setAttribute("disabled", "");
        let all = true;
        for (const k of Object.keys(GCS) as GcsKey[]) {
          $$<HTMLButtonElement>(`.gcsRow[data-k="${k}"] button`, root).forEach((x) => {
            x.disabled = true;
            if (+x.dataset.n! === truth[k]) x.classList.add("right");
            else if (+x.dataset.n! === sel[k]) x.classList.add("wrong");
          });
          if (sel[k] !== truth[k]) all = false;
        }
        const tot = c.e + c.v + c.m;
        $(".tot", root).textContent = `正解 E${c.e}V${c.v}M${c.m} ＝ ${tot}`;
        if (all) { ctx.sound.ding(); ctx.award(COINS, $(".gcsTotal", root)); } else ctx.sound.boo();
        const done = (ok: boolean, title: string) => {
          if (!ok) {
            const fu = c.followUp, ans = fu ? fu.options[fu.answer] : `E${c.e}V${c.v}M${c.m}（${tot}点）`;
            const others = fu ? fu.options.filter((_, i) => i !== fu.answer) : [`E${c.e}V${Math.max(1, c.v - 1)}M${c.m}`, `E${c.e}V${c.v}M${Math.min(6, c.m + 1)}`];
            ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.who}：${c.story}${fu ? fu.question : "GCSは？"}`, opts: shuffle([ans, ...shuffle(others).slice(0, 2)]), ans });
          }
          if (ok) { ctx.cheat.rewardIfUnpeeked(ex.id, $(".gcsTotal", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
          const fb = document.createElement("div"); $(".step2", root).append(fb);
          ctx.feedback(fb, ok, title, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        };
        if (!c.followUp) { done(all, all ? "正確な採点！" : "おしい。緑が正解"); return; }
        const fu = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(fu.question)}</div><div class="opts">${fu.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok2 = +b.dataset.i! === fu.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === fu.answer) x.classList.add("right"); });
          if (ok2) { ctx.sound.ding(); ctx.award(FOLLOW_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
          done(all && ok2, all && ok2 ? "両方正解！" : ok2 ? "②は正解！" : `②の正解は「${esc(fu.options[fu.answer])}」`);
        }));
      };
    }
    render();
  },
};
