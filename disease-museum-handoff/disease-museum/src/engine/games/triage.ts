// トリアージ：多数傷病者の現場で、1人ずつSTART法で色を付ける。1人正解5コイン、合格で+15
import "./triage.css";
import type { CustomModule } from "../exhibits/types";
import type { TriageData } from "./triage.schema";
import { start, TAG_LABEL, TAGS, type Tag } from "./triage.consts";
import { $, $$, shuffle } from "../dom";

const EACH = 5, PASS_BONUS = 15;

export const triage: CustomModule<TriageData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    function round() {
      const list = shuffle(d.patients).slice(0, d.roundSize);
      let i = 0, score = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="triHead"><span class="tagk">傷病者 <span class="n">1</span> / ${list.length}</span><span>正解 <span class="sc">0</span></span></div>
        <div class="triCard"></div>
        <div class="tags">${TAGS.map((t) => `<button data-t="${t}">${TAG_LABEL[t]}</button>`).join("")}</div>
        <div class="triLog"></div><div class="fbBox"></div>`;
      const show = () => { $(".n", root).textContent = String(i + 1); $(".triCard", root).textContent = list[i].desc; };
      show();
      $$<HTMLButtonElement>(".tags button", root).forEach((b) => (b.onclick = () => {
        if (i >= list.length) return;
        const p = list[i], [truth, why] = start(p), ok = b.dataset.t === truth;
        if (ok) { score++; ctx.sound.ding(); ctx.award(EACH, b); } else {
          ctx.sound.boo();
          ctx.miss({ id: `${ex.id}-${p.id}`, src: ex.title, q: `START法：${p.desc} 何色？`, opts: shuffle([TAG_LABEL[truth], ...shuffle(TAGS.filter((t) => t !== truth)).slice(0, 2).map((t) => TAG_LABEL[t])]), ans: TAG_LABEL[truth] });
        }
        const row = document.createElement("div");
        if (!ok) row.className = "ng";
        row.textContent = `${i + 1}. ${ok ? "○" : "×"} ${TAG_LABEL[b.dataset.t as Tag]}${ok ? "" : ` → 正解 ${TAG_LABEL[truth]}`}（${why}）`;
        $(".triLog", root).prepend(row);
        $(".sc", root).textContent = String(score);
        i++;
        if (i < list.length) { show(); return; }
        $(".triCard", root).textContent = "全員にタグを付け終わった。";
        $$<HTMLButtonElement>(".tags button", root).forEach((x) => (x.disabled = true));
        const pass = score >= d.passScore;
        if (pass) { ctx.award(PASS_BONUS, $(".triCard", root)); ctx.cheat.rewardIfUnpeeked(ex.id, $(".triCard", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        ctx.feedback($(".fbBox", root), pass, pass ? `合格！ ${score} / ${list.length}` : `${score} / ${list.length}。${d.passScore}人以上で合格`, `歩ける→緑、呼吸なし→黒、呼吸数30超・循環不良・指示に従えない→赤、それ以外→黄。<div style="margin-top:8px"><button class="btn next">次の現場</button></div>`);
        $(".next", root).onclick = round;
      }));
    }
    round();
  },
};
