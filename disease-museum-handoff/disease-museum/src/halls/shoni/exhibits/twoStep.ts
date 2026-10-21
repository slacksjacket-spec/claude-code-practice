// このホールのグラフ系ゲーム共通の「① 読む → ② 原因・対応」の2段の流れ
import type { Ctx } from "../../../engine/context";
import { $, $$, esc, shuffle } from "../../../engine/dom";

export interface Step { head: string; q1: string; o1: string[]; a1: number; f: { question: string; options: string[]; answer: number }; expl: string; miss: string }
const C1 = 12, C2 = 12;

/** head は esc 済みの HTML を渡す */
export function twoStep<T extends { id: string }>(root: HTMLElement, ex: { id: string; title: string }, ctx: Ctx, cases: T[], stampAt: number, make: (c: T) => Step) {
  const okKey = `${ex.id}.ok`;
  let q = shuffle(cases), qi = 0;
  function render() {
    const c = q[qi % q.length], s = make(c);
    let stage = 0, ok1 = false;
    ctx.cheat.reset(ex.id);
    root.innerHTML = `${s.head}<div class="stepLabel">① ${esc(s.q1)}</div><div class="opts s1">${s.o1.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="step2"></div>`;
    $$<HTMLButtonElement>(".s1 .opt", root).forEach((b) => (b.onclick = () => {
      if (stage) return;
      stage = 1; ok1 = +b.dataset.i! === s.a1;
      $$<HTMLButtonElement>(".s1 .opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.i! === s.a1) x.classList.add("right"); });
      if (ok1) { ctx.sound.ding(); ctx.award(C1, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
      const f = s.f, box = $(".step2", root);
      box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
        const ok = +o.dataset.i! === f.answer;
        $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
        if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
        if (!ok || !ok1) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${s.miss} ${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
        if (ok && ok1 && ctx.prog(okKey) >= stampAt) ctx.stamp(ex.id);
        ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `①の答え：${esc(s.o1[s.a1])}。${esc(s.expl)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
        $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(cases); render(); };
      }));
    }));
  }
  render();
}
