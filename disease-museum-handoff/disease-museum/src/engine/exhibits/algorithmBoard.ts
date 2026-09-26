// 3.4 すごろく：患者カードを見て分岐マスを進む。まちがえると1マス戻る。ゴールで治療を選ぶ（複数正解あり）
import "./algorithmBoard.css";
import type { ExhibitModule } from "./types";
import { $, $$, esc, shuffle } from "../dom";

const GOAL_COINS = 25; // SPEC 3.4

export const AlgorithmBoard: ExhibitModule<"AlgorithmBoard"> = {
  mount(root, ex, ctx) {
    const d = ex.data, tiles = [...d.nodes.map((n) => [n.id, n.label] as const), ["goal", d.goalLabel] as const];
    let q = shuffle(d.patients.map((_, i) => i)), pi = 0, step = 0, kept = false;

    function render() {
      const idx = q[pi % q.length], p = d.patients[idx], path = p.path, cur = path[step];
      if (step === 0 && !kept) ctx.cheat.reset(ex.id);
      kept = false;
      const node = d.nodes.find((n) => n.id === cur);
      root.innerHTML = `<div class="pcard"><span class="tagk">患者 ${(pi % q.length) + 1}</span><div class="chips">${Object.entries(p.card).map(([k, v]) => `<span class="chip">${esc(k)}：${esc(v)}</span>`).join("")}</div></div>
  <div class="board">${tiles.map(([k, n]) => {
    const inP = path.includes(k), at = path.indexOf(k);
    const cls = !inP ? "skip" : k === "goal" ? "goal" + (cur === "goal" ? " cur" : "") : at < step ? "past" : at === step ? "cur" : "";
    return `<div class="tile ${cls}">${esc(n)}${at === step ? '<span class="pawn"></span>' : ""}</div>`;
  }).join("")}</div>
  <div class="stepLabel">${cur === "goal" ? `ゴール！${esc(d.goalLabel)}はどれ？` : esc(node!.question)}</div>
  <div class="opts">${cur === "goal" ? d.treatments.map((t, i) => `<button class="opt" data-v="${i}">${esc(t)}</button>`).join("") : node!.options.map((o) => `<button class="opt" data-v="${esc(o.value)}">${esc(o.label)}</button>`).join("")}</div><div class="fbBox"></div>`;
      const board = $(".board", root), tile = $(".board .cur", root);
      if (tile) board.scrollTo({ left: tile.offsetLeft - board.clientWidth / 2 + tile.offsetWidth / 2, behavior: "smooth" });

      $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
        if (cur === "goal") {
          const i = +b.dataset.v!, ok = p.treatments.includes(i);
          $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (p.treatments.includes(+x.dataset.v!)) x.classList.add("right"); });
          if (ok) {
            ctx.sound.ding(); ctx.award(GOAL_COINS, b); ctx.confetti(30); ctx.cheat.rewardIfUnpeeked(ex.id, b);
            if (ctx.prog(`${ex.id}.ok`) >= d.stampAt) ctx.stamp(ex.id);
          } else {
            b.classList.add("wrong"); ctx.sound.boo();
            const ans = d.treatments[p.treatments[0]];
            const others = shuffle(d.treatments.filter((_, j) => !p.treatments.includes(j))).slice(0, 2);
            ctx.miss({ id: `${ex.id}-${idx}`, src: ex.title, q: Object.entries(p.card).map(([k, v]) => `${k} ${v}`).join("、") + `。推奨される${d.goalLabel}は？`, opts: shuffle([ans, ...others]), ans });
          }
          const fb = $(".fbBox", root);
          ctx.feedback(fb, ok, ok ? "ゴール！" : `正解は「${p.treatments.map((i) => esc(d.treatments[i])).join("」「")}」`, `${esc(p.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", fb).onclick = () => { pi++; step = 0; if (pi % q.length === 0) q = shuffle(d.patients.map((_, i) => i)); render(); };
          return;
        }
        if (b.dataset.v === p.answers[cur]) { ctx.sound.beep(660, 0.08, "triangle", 0.06, 990); step++; render(); }
        else {
          b.classList.add("wrong"); ctx.sound.boo(); ctx.toast("ちがう道！1マス戻る");
          step = Math.max(0, step - 1);
          setTimeout(() => { kept = true; render(); }, 700);
        }
      }));
    }
    render();
  },
};
