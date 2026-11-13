// 「① 読む・当てる → ② 原因や対応を答える」の2段のゲームの共通の流れ。
// 図や患者カード（head）と①の選択肢だけを各ゲームが用意し、採点・コイン・収蔵庫・スタンプ・次へ、はここでそろえる
import type { Ctx } from "../context";
import { $, $$, esc, shuffle } from "../dom";

// コインの目安：2段のゲームは ①12＋②12、1問で完結する計算・選択のゲームは 20
export const STEP1_COINS = 12, STEP2_COINS = 12, SINGLE_COINS = 20;

export interface TwoStep {
  head: string;                    // ①より上に出す HTML（esc 済みで渡す）
  q1: string; o1: string[]; a1: number;
  s1Class?: string;                // ①の選択肢を並べる入れ物のクラス（既定は opts）
  f: { question: string; options: string[]; answer: number };
  lead?: string;                   // 解説の頭に出す1文（既定は「①の答え：…」）
  expl: string;
  miss: string;                    // 収蔵庫に入れるとき、②の問いの前に付ける状況の説明
  miss1?: string;                  // あれば、①をまちがえたとき①の問いも別に収蔵庫へ入れる
  next?: string;                   // 次へボタンの文字
  after?: (root: HTMLElement) => void; // 描いたあとに、図のボタンなどをつなぐ
}
const pick3 = (opts: string[], ans: number) => shuffle([opts[ans], ...shuffle(opts.filter((_, i) => i !== ans)).slice(0, 2)]);

export function twoStep<T extends { id: string }>(root: HTMLElement, ex: { id: string; title: string }, ctx: Ctx, cases: T[], stampAt: number, make: (c: T) => TwoStep) {
  const okKey = `${ex.id}.ok`;
  let q = shuffle(cases), qi = 0;
  function render() {
    const c = q[qi % q.length], s = make(c);
    let stage = 0, ok1 = false;
    ctx.cheat.reset(ex.id);
    root.innerHTML = `${s.head}<div class="stepLabel">① ${esc(s.q1)}</div><div class="${s.s1Class ?? "opts"} s1">${s.o1.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="step2"></div>`;
    s.after?.(root);
    $$<HTMLButtonElement>(".s1 .opt", root).forEach((b) => (b.onclick = () => {
      if (stage) return;
      stage = 1; ok1 = +b.dataset.i! === s.a1;
      $$<HTMLButtonElement>(".s1 .opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.i! === s.a1) x.classList.add("right"); });
      if (ok1) { ctx.sound.ding(); ctx.award(STEP1_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
      const f = s.f, box = $(".step2", root);
      box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
        const ok = +o.dataset.i! === f.answer;
        $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
        if (ok) { ctx.sound.ding(); ctx.award(STEP2_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
        if (s.miss1 && !ok1) ctx.miss({ id: `${ex.id}-${c.id}-s1`, src: ex.title, q: s.miss1, opts: pick3(s.o1, s.a1), ans: s.o1[s.a1] });
        if (!ok || (!ok1 && !s.miss1)) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${s.miss}${f.question}`, opts: pick3(f.options, f.answer), ans: f.options[f.answer] });
        if (ok && ok1 && ctx.prog(okKey) >= stampAt) ctx.stamp(ex.id);
        const fb = $(".fbBox", box);
        ctx.feedback(fb, ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `${esc(s.lead ?? `①の答え：${s.o1[s.a1]}`)}。${esc(s.expl)}<div style="margin-top:8px"><button class="btn next">${esc(s.next ?? "次へ")}</button></div>`);
        $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(cases); render(); };
      }));
    }));
  }
  render();
}
