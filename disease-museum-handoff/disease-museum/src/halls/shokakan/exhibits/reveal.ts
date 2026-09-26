// 影絵当て：造影の模式図がぼかしから少しずつくっきりする。早く当てるほどコインが多い。まちがえると1段見えてしまう
import "./reveal.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { RevealData } from "./reveal.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const coinsAt = (level: number) => Math.max(4, 20 - level * 4);

export const reveal: CustomModule<RevealData> = {
  mount(root, ex, ctx) {
    const d = ex.data, names = [...d.items.map((i) => i.answer), ...d.distractors];
    const okKey = `${ex.id}.ok`;
    let q = shuffle(d.items).slice(0, d.roundSize), qi = 0, firstOk = 0;

    function render() {
      if (qi >= q.length) {
        root.innerHTML = `<div class="feedback card-pop"><b class="t">${firstOk} / ${q.length} を一発正解</b>通算${d.stampAt}枚の一発正解でスタンプ。<div style="margin-top:8px"><button class="btn again">もう一周</button></div></div>`;
        $(".again", root).onclick = () => { q = shuffle(d.items).slice(0, d.roundSize); qi = 0; firstOk = 0; render(); };
        return;
      }
      const it = q[qi];
      let level = 0, first = true, done = false;
      const opts = shuffle([it.answer, ...shuffle(names.filter((n) => n !== it.answer)).slice(0, 3)]);
      root.innerHTML = `<div class="hud"><span class="tagk">画像 ${qi + 1} / ${q.length}</span><span class="small" style="font-weight:800">一発正解 通算 ${Number(ctx.st.prog[okKey] ?? 0)} / ${d.stampAt}</span></div>
      <div class="revealFig"><div class="img">${it.svg}</div><span class="cap">${esc(it.caption)}</span></div>
      <div class="revealMeter">${d.levels.map(() => "<i></i>").join("")}</div>
      <div class="revealBar"><span class="worth"></span><button class="btn alt more">もう少し見る</button></div>
      <div class="stepLabel">これは？</div>
      <div class="opts">${opts.map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="fbBox"></div>`;
      const img = $(".img", root), more = $<HTMLButtonElement>(".more", root);
      const show = () => {
        img.style.filter = `blur(${d.levels[level]}px)`;
        $$(".revealMeter i", root).forEach((m, i) => m.classList.toggle("on", i <= level));
        $(".worth", root).textContent = done ? "" : `いま当てると +${coinsAt(level)}`;
        more.disabled = done || level >= d.levels.length - 1;
      };
      const step = () => { if (level < d.levels.length - 1) { level++; ctx.sound.beep(500 + level * 90, 0.06, "triangle", 0.05); } show(); };
      more.onclick = step;
      show();
      $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
        if (done) return;
        if (b.dataset.a !== it.answer) {
          b.classList.add("wrong"); b.disabled = true; ctx.sound.boo();
          if (first) ctx.miss({ id: `${ex.id}-${it.id}`, src: ex.title, q: `${it.caption}の模式図で「${it.explanation.split("。")[0]}」。この病気は？`, opts: shuffle([it.answer, ...opts.filter((o) => o !== it.answer).slice(0, 2)]), ans: it.answer });
          first = false;
          step();
          return;
        }
        done = true;
        const coins = coinsAt(level);
        b.classList.add("right");
        $$<HTMLButtonElement>(".opt", root).forEach((x) => (x.disabled = true));
        level = d.levels.length - 1; show();
        ctx.sound.ding(); ctx.award(coins, b);
        if (first) { firstOk++; if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        const fb = $(".fbBox", root);
        ctx.feedback(fb, true, first ? `正解！ +${coins}` : `正解（${coins}コイン）`, `${esc(it.explanation)}<div style="margin-top:8px"><button class="btn next">${qi < q.length - 1 ? "次の画像" : "結果を見る"}</button></div>`);
        $(".next", fb).onclick = () => { qi++; render(); };
      }));
    }
    render();
  },
};
