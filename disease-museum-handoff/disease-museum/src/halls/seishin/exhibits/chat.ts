// 問診チャット：患者の言葉が1つずつ届く。その症状の名前を選び、最後に診断を答える。用語のまちがい1つまでなら合格
import "./chat.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { ChatData } from "./chat.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const LINE_COINS = 6, DX_COINS = 12;

export const chat: CustomModule<ChatData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.rounds), qi = 0;
    function render() {
      const r = q[qi % q.length];
      let li = 0, miss = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(r.who)}</span><div style="margin-top:6px;font-weight:800">${esc(r.setting)}</div></div>
        <div class="chatLog" aria-live="polite"></div><div class="chatOpts"></div><div class="step2"></div>`;
      const log = $(".chatLog", root), opts = $(".chatOpts", root);
      const say = (cls: string, html: string) => { const b = document.createElement("div"); b.className = `bub ${cls}`; b.innerHTML = html; log.append(b); b.scrollIntoView?.({ block: "nearest" }); };
      const next = () => {
        if (li >= r.lines.length) return finish();
        const l = r.lines[li];
        say("pt", `「${esc(l.quote)}」`);
        const choices = shuffle([l.term, ...shuffle(d.terms.filter((t) => t !== l.term)).slice(0, 3)]);
        opts.innerHTML = choices.map((t) => `<button class="opt">${esc(t)}</button>`).join("");
        $$<HTMLButtonElement>(".opt", opts).forEach((b) => (b.onclick = () => {
          const ok = b.textContent === l.term;
          opts.innerHTML = "";
          if (ok) { ctx.sound.ding(); ctx.award(LINE_COINS, log); say("me", `${esc(l.term)}<small>${esc(l.note)}</small>`); }
          else {
            miss++; ctx.sound.boo();
            say("me ng", `${esc(b.textContent ?? "")} → 正しくは「${esc(l.term)}」<small>${esc(l.note)}</small>`);
            ctx.miss({ id: `${ex.id}-${r.id}-${li}`, src: ex.title, q: `「${l.quote}」この症状は？`, opts: shuffle([l.term, ...shuffle(d.terms.filter((t) => t !== l.term)).slice(0, 2)]), ans: l.term });
          }
          li++;
          setTimeout(next, 350);
        }));
      };
      const finish = () => {
        const dx = r.diagnosis, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">最後に：いちばん考える診断は？</div><div class="opts">${dx.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === dx.answer, pass = ok && miss <= 1;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === dx.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(DX_COINS, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok) ctx.miss({ id: `${ex.id}-${r.id}-dx`, src: ex.title, q: `${r.who}：${r.lines.map((l) => `「${l.quote}」`).join("")} 診断は？`, opts: shuffle([dx.options[dx.answer], ...shuffle(dx.options.filter((_, i) => i !== dx.answer)).slice(0, 2)]), ans: dx.options[dx.answer] });
          if (pass) { ctx.cheat.rewardIfUnpeeked(ex.id, o); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
          ctx.feedback($(".fbBox", box), pass, pass ? `面接合格！（用語のまちがい ${miss}）` : ok ? `診断は正解。用語のまちがい ${miss} で不合格` : `正解は「${esc(dx.options[dx.answer])}」`, `${esc(dx.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.rounds); render(); };
        }));
      };
      next();
    }
    render();
  },
};
