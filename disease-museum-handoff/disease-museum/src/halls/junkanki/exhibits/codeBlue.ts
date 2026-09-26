// コードブルー：心停止・不安定な不整脈のシナリオ。モニターの波形を見て、次の一手を選んでいく
import "./codeBlue.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CodeBlueData } from "./codeBlue.schema";
import { makeRhythm } from "../ecg/synth";
import { stripSVG } from "../ecg/render";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const STEP_COINS = 10, CLEAR_BONUS = 20;

export const codeBlue: CustomModule<CodeBlueData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let order = shuffle(d.scenarios.map((_, i) => i)), si = 0;

    function start() {
      const s = d.scenarios[order[si % order.length]];
      let i = 0, miss = 0;
      const marks: ("ok" | "ng")[] = [];
      ctx.cheat.reset(ex.id);
      const step = () => {
        const st = s.steps[i], seed = Math.floor(Math.random() * 1e9);
        const opts = shuffle(st.options.map((o, k) => ({ o, k })));
        root.innerHTML = `<div class="hud"><span class="tagk">${esc(s.title)}</span><span class="small" style="font-weight:800">${esc(s.patient)}</span></div>
          <div class="cbSteps">${s.steps.map((_, k) => `<i class="${marks[k] ?? (k === i ? "cur" : "")}"></i>`).join("")}</div>
          <div class="cbMon">${st.rhythm ? stripSVG(makeRhythm(st.rhythm, seed, 6), 6, { monitor: true, label: "II", h: 30, base: 18 }) : `<svg viewBox="0 0 158 30" role="img" aria-label="モニター未装着"><rect width="158" height="30" fill="#0B1A14"/><text x="79" y="18" text-anchor="middle" font-size="5" fill="#5CFF9D" opacity=".6">NO SIGNAL</text></svg>`}<div class="cbVitals">${esc(st.vitals)}</div></div>
          <div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800;margin-top:10px">${esc(st.situation)}</div>
          <div class="stepLabel">次の一手は？</div>
          <div class="opts">${opts.map(({ o, k }) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
          const ok = +b.dataset.k! === st.answer;
          $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.k! === st.answer) x.classList.add("right"); });
          marks[i] = ok ? "ok" : "ng";
          if (ok) { ctx.sound.ding(); ctx.award(STEP_COINS, b); }
          else {
            miss++; b.classList.add("wrong"); ctx.sound.boo();
            const ans = st.options[st.answer];
            ctx.miss({ id: `${ex.id}-${s.id}-${i}`, src: `${ex.title}：${s.title}`, q: `${st.situation}（${st.vitals}）次の一手は？`, opts: shuffle([ans, ...shuffle(st.options.filter((_, k) => k !== st.answer)).slice(0, 2)]), ans });
          }
          const last = i === s.steps.length - 1, fb = $(".fbBox", root);
          ctx.feedback(fb, ok, ok ? "その判断でOK！" : `正解は「${esc(st.options[st.answer])}」`, `${esc(st.explanation)}<div style="margin-top:8px"><button class="btn next">${last ? "結果を見る" : "次へ"}</button></div>`);
          $(".next", fb).onclick = () => { i++; if (last) finish(); else step(); };
        }));
      };
      const finish = () => {
        const clear = miss <= d.maxMistakes;
        root.innerHTML = `<div class="cbSteps">${marks.map((m) => `<i class="${m}"></i>`).join("")}</div><div class="feedback card-pop"><b class="t">${clear ? "チーム蘇生、成功！" : "もう一度シミュレーション"}</b>${s.steps.length - miss} / ${s.steps.length} 正しい判断。${clear ? `ボーナス +${CLEAR_BONUS}` : `ミス${d.maxMistakes}回までならクリア。`}<div style="margin-top:8px"><button class="btn again">${clear ? "次のシナリオ" : "もう一度"}</button></div></div>`;
        if (clear) { ctx.sound.yay(); ctx.award(CLEAR_BONUS, $(".again", root)); ctx.cheat.rewardIfUnpeeked(ex.id, $(".again", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); si++; if (si % order.length === 0) order = shuffle(order); }
        $(".again", root).onclick = start;
      };
      step();
    }
    start();
  },
};
