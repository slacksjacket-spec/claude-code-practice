// ホルモン軸：視床下部→下垂体→標的臓器の各ホルモンが上がるか下がるかを、負のフィードバックから予想する。続けて原因を答える
import "./axis.css";
import type { CustomModule } from "../exhibits/types";
import type { AxisData } from "./axis.schema";
import { $, $$, esc, shuffle } from "../dom";

const ARROW_COINS = 15, Q_COINS = 10;
type D = "up" | "nl" | "down";
const SYM: Record<D | "q", string> = { up: "↑", nl: "→", down: "↓", q: "？" };
const NAME: Record<D, string> = { up: "上がる", nl: "正常", down: "下がる" };
const NEXT: Record<D | "q", D> = { q: "up", up: "nl", nl: "down", down: "up" };

export const axis: CustomModule<AxisData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ax = d.axes[c.axis];
      const cur: Record<string, D | "q"> = Object.fromEntries(ax.levels.map((l) => [l.id, c.given[l.id] ?? "q"]));
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div style="margin-top:6px;font-weight:800">${esc(c.story)}</div></div>
        <div class="stepLabel">① ${esc(ax.title)}：それぞれ上がる？下がる？（タップで切り替え）</div>
        <div class="axisBox">
          ${ax.levels.map((l, i) => `${i ? `<div class="axisArrow">↓ 刺激</div>` : ""}<div class="axisLv ${c.given[l.id] ? "given" : ""}" data-l="${esc(l.id)}">
            <div class="org"><small>${esc(l.organ)}${c.given[l.id] ? "（検査値）" : ""}</small><b>${esc(l.hormone)}</b><div class="fix"></div></div>
            <button class="dir ${cur[l.id] === "q" ? "" : cur[l.id]}" aria-label="${esc(l.hormone)}の変化" ${c.given[l.id] ? "disabled" : ""}>${SYM[cur[l.id]]}</button></div>`).join("")}
          <div class="axisFb" aria-hidden="true"><span>負のフィードバック</span></div>
        </div>
        <div class="axisGo"><button class="btn go">これで判定</button></div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".axisLv .dir", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        const id = b.closest<HTMLElement>(".axisLv")!.dataset.l!;
        cur[id] = NEXT[cur[id]];
        b.textContent = SYM[cur[id]]; b.className = `dir ${cur[id]}`;
        ctx.sound.beep(cur[id] === "up" ? 760 : cur[id] === "down" ? 420 : 580, 0.05, "triangle", 0.04);
      }));
      $(".go", root).onclick = () => {
        if (stage) return;
        if (Object.values(cur).includes("q")) { ctx.toast("「？」が残っている"); return; }
        stage = 1;
        $(".go", root).setAttribute("disabled", "");
        $$<HTMLButtonElement>(".axisLv .dir", root).forEach((b) => (b.disabled = true));
        let all = true;
        for (const l of ax.levels) {
          const el = $(`.axisLv[data-l="${CSS.escape(l.id)}"]`, root), ok = cur[l.id] === c.answer[l.id];
          if (c.given[l.id]) continue;
          el.classList.add(ok ? "right" : "wrong");
          if (!ok) { all = false; $(".fix", el).textContent = `正解：${SYM[c.answer[l.id]]} ${NAME[c.answer[l.id]]}`; }
        }
        if (all) { ctx.sound.ding(); ctx.award(ARROW_COINS, $(".axisBox", root)); } else ctx.sound.boo();
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(c.question ?? "原因は？")}</div><div class="opts">${c.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === c.correct;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.correct) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(Q_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !all) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.who}：${c.story} ${c.question ?? "原因は？"}`, opts: shuffle([c.options[c.correct], ...shuffle(c.options.filter((_, i) => i !== c.correct)).slice(0, 2)]), ans: c.options[c.correct] });
          if (ok && all && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          const chain = ax.levels.map((l) => `${esc(l.hormone)} ${SYM[c.answer[l.id]]}`).join("　");
          ctx.feedback(fb, ok && all, ok && all ? "軸も原因も正解！" : ok ? "原因は正解！" : `正解は「${esc(c.options[c.correct])}」`, `<b>${chain}</b><br>${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      };
    }
    render();
  },
};
