// シナリオ判断：状況（とバイタル）を見て、次の一手を選んでいく。ミスが少なければシナリオクリア
import "./scenario.css";
import type { CustomModule } from "../exhibits/types";
import type { ScenarioData } from "./scenario.schema";
import { $, $$, esc, shuffle } from "../dom";

const STEP_COINS = 10, CLEAR_BONUS = 20;

export const scenario: CustomModule<ScenarioData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let order = shuffle(d.scenarios.map((_, i) => i)), si = 0;
    function start() {
      const s = d.scenarios[order[si % order.length]], marks: ("ok" | "ng")[] = [];
      let i = 0, miss = 0;
      ctx.cheat.reset(ex.id);
      const step = () => {
        const st = s.steps[i], opts = shuffle(st.options.map((o, k) => ({ o, k })));
        root.innerHTML = `<div class="hud"><span class="tagk">${esc(s.title)}</span><span class="small" style="font-weight:800">${esc(s.patient)}</span></div>
          <div class="scSteps">${s.steps.map((_, k) => `<i class="${marks[k] ?? (k === i ? "cur" : "")}"></i>`).join("")}</div>
          ${st.vitals ? `<div class="scVitals">${esc(st.vitals)}</div>` : ""}
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
            ctx.miss({ id: `${ex.id}-${s.id}-${i}`, src: `${ex.title}：${s.title}`, q: `${st.situation}${st.vitals ? `（${st.vitals}）` : ""}次の一手は？`, opts: shuffle([ans, ...shuffle(st.options.filter((_, k) => k !== st.answer)).slice(0, 2)]), ans });
          }
          const last = i === s.steps.length - 1, fb = $(".fbBox", root);
          ctx.feedback(fb, ok, ok ? "その判断でOK！" : `正解は「${esc(st.options[st.answer])}」`, `${esc(st.explanation)}<div style="margin-top:8px"><button class="btn next">${last ? "結果を見る" : "次へ"}</button></div>`);
          $(".next", fb).onclick = () => { i++; if (last) finish(); else step(); };
        }));
      };
      const finish = () => {
        const clear = miss <= d.maxMistakes;
        root.innerHTML = `<div class="scSteps">${marks.map((m) => `<i class="${m}"></i>`).join("")}</div><div class="feedback card-pop"><b class="t">${clear ? "シナリオクリア！" : "もう一度シミュレーション"}</b>${s.steps.length - miss} / ${s.steps.length} 正しい判断。${clear ? `ボーナス +${CLEAR_BONUS}` : `ミス${d.maxMistakes}回までならクリア。`}<div style="margin-top:8px"><button class="btn again">${clear ? "次のシナリオ" : "もう一度"}</button></div></div>`;
        if (clear) { ctx.sound.yay(); ctx.award(CLEAR_BONUS, $(".again", root)); ctx.cheat.rewardIfUnpeeked(ex.id, $(".again", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); si++; if (si % order.length === 0) order = shuffle(order); }
        $(".again", root).onclick = start;
      };
      step();
    }
    start();
  },
};
