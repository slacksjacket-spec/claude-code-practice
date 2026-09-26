// 心不全の4分類：所見から「うっ血（wet/dry）」と「低灌流（cold/warm）」を見きわめてマスをタップし、治療を選ぶ
import "./hfProfile.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { HfProfileData } from "./hfProfile.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const Q_COINS = 10, TX_COINS = 15;

export const hfProfile: CustomModule<HfProfileData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length];
      let qOk = false, stage = 0;
      ctx.cheat.reset(ex.id);
      const cell = (k: "A" | "B" | "L" | "C") => `<button data-q="${k}"><b>${k}：${esc(d.quadrants[k].label)}</b><span class="small">${esc(d.quadrants[k].sub)}</span></button>`;
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div class="signs">${c.signs.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
        <div class="stepLabel">① どのマス？</div>
        <div class="quad"><span></span><span class="ax">うっ血なし（dry）</span><span class="ax">うっ血あり（wet）</span>
          <span class="ax v">灌流よい（warm）</span>${cell("A")}${cell("B")}
          <span class="ax v">低灌流（cold）</span>${cell("L")}${cell("C")}</div>
        <div class="fb1"></div><div class="step2"></div>`;
      $$<HTMLButtonElement>(".quad button", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1;
        qOk = b.dataset.q === c.profile;
        $(`.quad button[data-q="${c.profile}"]`, root).classList.add("right");
        if (!qOk) b.classList.add("wrong");
        if (qOk) { ctx.sound.ding(); ctx.award(Q_COINS, b); } else ctx.sound.boo();
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② 治療は？</div><div class="opts">${d.treatments.map((t, i) => `<button class="opt" data-i="${i}">${esc(t)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === c.treatment;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.treatment) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(TX_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          const qa = d.quadrants[c.profile], ans = d.treatments[c.treatment];
          if (!ok || !qOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.who}：${c.signs.join("、")}。治療は？`, opts: shuffle([ans, ...shuffle(d.treatments.filter((t) => t !== ans)).slice(0, 2)]), ans });
          if (ok && qOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && qOk, ok && qOk ? "両方正解！" : ok ? "治療は正解！" : `正解は「${esc(ans)}」`, `${c.profile}（${esc(qa.label)}）。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
