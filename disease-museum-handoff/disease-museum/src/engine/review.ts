// 収蔵庫（要復習）：まちがえた問題を選択式で再挑戦。正解で「退館」して 5 コイン
import type { Ctx } from "./context";
import { $, $$, esc, shuffle } from "./dom";

export const REVIEW_REWARD = 5;

export function sectionHTML() {
  return `<section class="wing" id="w-review"><div class="wrap">
  <div class="wingHead"><div><span class="wingLabel" style="background:var(--ink);color:var(--bg)">収蔵庫</span><h2>まちがえた問題の保管室</h2></div><p id="revCount">0点を保管中</p></div>
  <article class="pop exhibit" id="ex-review">
    <h3>要復習コーナー</h3>
    <p class="how">展示でまちがえた問題がここに保管される。正解すると退館して、1問${REVIEW_REWARD}コイン。</p>
    <div class="revList" id="revList"></div>
  </article>
</div></section>`;
}

export function mountReview(ctx: Ctx) {
  let shown = "";
  function render() {
    const { st } = ctx;
    $("#revCount").textContent = `${st.review.length}点を保管中`;
    // 中身が変わったときだけ描き直す（回答中の選択肢が並び替わらないように）
    const sig = st.review.map((r) => r.id).join("\n");
    if (sig === shown) return;
    shown = sig;
    const L = $("#revList");
    if (!st.review.length) {
      L.innerHTML = `<div class="empty">収蔵庫はからっぽ。まちがえた問題がここに並びます。</div>`;
      return;
    }
    L.innerHTML = st.review.map((r) => {
      const opts = shuffle(r.opts);
      return `<div class="rev" data-id="${esc(r.id)}"><div class="src">${esc(r.src)}</div><p>${esc(r.q)}</p><div class="opts">${opts.map((o) => `<button class="opt" data-ok="${o === r.ans ? 1 : 0}">${esc(o)}</button>`).join("")}</div></div>`;
    }).join("");
    $$("#revList .rev").forEach((el) => {
      const id = el.dataset.id!;
      $$<HTMLButtonElement>(".opt", el).forEach((b) => (b.onclick = () => {
        if (b.dataset.ok === "1") {
          b.classList.add("right");
          ctx.sound.ding();
          ctx.award(REVIEW_REWARD, b);
          setTimeout(() => {
            ctx.st.review = ctx.st.review.filter((x) => x.id !== id);
            ctx.save();
            ctx.refresh();
            ctx.toast("退館！");
          }, 500);
        } else {
          b.classList.add("wrong");
          ctx.sound.boo();
        }
      }));
    });
  }
  ctx.onRefresh(render);
  render();
}
