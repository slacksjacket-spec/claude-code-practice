// 血液ガス道場：pH → 一次性の障害 → 代償は予測どおりか → アニオンギャップ → 原因、の順に読む
import "./abg.css";
import type { CustomModule } from "../exhibits/types";
import type { AbgData } from "./abg.schema";
import { PRIMARY, AG_HIGH, anionGap, compensated, emia, expected, primaryOf } from "./abg.consts";
import { $, $$, esc, shuffle } from "../dom";

const COINS = 8, PERFECT_BONUS = 15;

export const abg: CustomModule<AbgData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], g = c.gas, ag = anionGap(g), exp = expected(g, c.chronic);
      ctx.cheat.reset(ex.id);
      // 問題の列（AG は Na・Cl があって代謝性アシドーシスのときだけ）
      const steps: { q: string; opts: string[]; ans: string; why: string }[] = [
        { q: "まず pH は？", opts: ["アシデミア", "アルカレミア", "pHは正常範囲"], ans: emia(g), why: `pH ${g.pH}（正常 7.35〜7.45）。` },
        { q: "一次性の障害は？", opts: [...PRIMARY], ans: primaryOf(g), why: `pH を説明できるのは${primaryOf(g).startsWith("呼吸") ? "PaCO₂" : "HCO₃⁻"}の変化。` },
        { q: `代償は予測どおり？${primaryOf(g).startsWith("呼吸") ? `（${c.chronic ? "慢性" : "急性"}として）` : ""}`, opts: ["予測の範囲内（単純性）", "範囲外（ほかの障害が合併）"], ans: compensated(g, c.chronic) ? "予測の範囲内（単純性）" : "範囲外（ほかの障害が合併）", why: `${exp.formula}。実際の${exp.what === "PaCO2" ? "PaCO₂" : "HCO₃⁻"}は ${exp.what === "PaCO2" ? g.PaCO2 : g.HCO3}。` },
      ];
      if (ag !== null && primaryOf(g) === "代謝性アシドーシス") steps.push({ q: "アニオンギャップは？", opts: ["開大している", "正常"], ans: ag > AG_HIGH ? "開大している" : "正常", why: `AG ＝ Na −（Cl＋HCO₃⁻）＝ ${g.Na} −（${g.Cl}＋${g.HCO3}）＝ ${ag}（${AG_HIGH}を超えれば開大）。` });
      steps.push({ q: "原因として最も考えるのは？", opts: c.cause.options, ans: c.cause.options[c.cause.answer], why: "" });
      let si = 0, miss = 0;
      const marks: ("ok" | "ng")[] = [];
      const panel = `<div class="gasPanel">${[["pH", g.pH], ["PaCO₂", g.PaCO2], ["HCO₃⁻", g.HCO3], ["PaO₂", g.PaO2], ["Na", g.Na], ["Cl", g.Cl]].filter(([, v]) => v !== undefined).map(([k, v]) => `<div>${k}<b>${v}</b></div>`).join("")}</div>`;
      const step = () => {
        const s = steps[si];
        root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800;margin-bottom:8px">${esc(c.story)}</div>${panel}
          <div class="abgSteps">${steps.map((_, k) => `<i class="${marks[k] ?? (k === si ? "cur" : "")}"></i>`).join("")}</div>
          <div class="stepLabel">${si + 1}. ${esc(s.q)}</div><div class="opts">${s.opts.map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
          const ok = b.dataset.a === s.ans;
          $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (x.dataset.a === s.ans) x.classList.add("right"); });
          marks[si] = ok ? "ok" : "ng";
          if (ok) { ctx.sound.ding(); ctx.award(COINS, b); } else { miss++; b.classList.add("wrong"); ctx.sound.boo(); }
          const last = si === steps.length - 1, fb = $(".fbBox", root);
          if (!ok && si < steps.length - 1) ctx.miss({ id: `${ex.id}-${c.id}-${si}`, src: ex.title, q: `pH ${g.pH}、PaCO₂ ${g.PaCO2}、HCO₃⁻ ${g.HCO3}${g.Na !== undefined ? `、Na ${g.Na}、Cl ${g.Cl}` : ""}。${s.q}`, opts: s.opts.length > 4 ? shuffle([s.ans, ...shuffle(s.opts.filter((o) => o !== s.ans)).slice(0, 3)]) : s.opts, ans: s.ans });
          if (!ok && last) ctx.miss({ id: `${ex.id}-${c.id}-cause`, src: ex.title, q: `${c.story}（pH ${g.pH}、PaCO₂ ${g.PaCO2}、HCO₃⁻ ${g.HCO3}）原因は？`, opts: shuffle([s.ans, ...shuffle(s.opts.filter((o) => o !== s.ans)).slice(0, 2)]), ans: s.ans });
          ctx.feedback(fb, ok, ok ? "正解！" : `正解は「${esc(s.ans)}」`, `${esc(last ? c.explanation : s.why)}<div style="margin-top:8px"><button class="btn next">${last ? "結果を見る" : "次へ"}</button></div>`);
          $(".next", fb).onclick = () => { si++; if (si < steps.length) step(); else finish(); };
        }));
      };
      const finish = () => {
        const perfect = miss === 0;
        root.innerHTML = `${panel}<div class="abgSteps">${marks.map((m) => `<i class="${m}"></i>`).join("")}</div><div class="feedback card-pop"><b class="t">${perfect ? "完全読破！" : `${steps.length - miss} / ${steps.length}`}</b>${perfect ? `ボーナス +${PERFECT_BONUS}` : "全部正解で通算に数える。"}<div style="margin-top:8px"><button class="btn again">次の血液ガス</button></div></div>`;
        if (perfect) { ctx.sound.yay(); ctx.award(PERFECT_BONUS, $(".again", root)); ctx.cheat.rewardIfUnpeeked(ex.id, $(".again", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        $(".again", root).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      };
      step();
    }
    render();
  },
};
