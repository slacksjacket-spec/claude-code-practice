// 並べ替え：カードを正しい順にタップしていく。順番をまちがえるとカードが揺れる（ミスの数でコインが減る）
import "./order.css";
import type { CustomModule } from "../exhibits/types";
import type { OrderData } from "./order.schema";
import { $, $$, esc, shuffle } from "../dom";

const coins = (miss: number) => Math.max(5, 20 - miss * 5);

export const order: CustomModule<OrderData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length];
      let next = 0, miss = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.prompt)}</div>
        ${c.ends ? `<div class="orderEnds" style="margin-top:8px"><span>↑ ${esc(c.ends[0])}</span><span>ミス <b class="miss">0</b></span></div>` : `<div class="orderEnds" style="margin-top:8px"><span></span><span>ミス <b class="miss">0</b></span></div>`}
        <ol class="orderSlots">${c.items.map((_, i) => `<li><span class="n">${i + 1}</span><span class="t"></span></li>`).join("")}</ol>
        ${c.ends ? `<div class="orderEnds"><span>↓ ${esc(c.ends[1])}</span></div>` : ""}
        <div class="orderPool">${shuffle(c.items).map((it) => `<button class="opt" data-it="${esc(it)}">${esc(it)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".orderPool .opt", root).forEach((b) => (b.onclick = () => {
        if (b.dataset.it !== c.items[next]) {
          miss++; $(".miss", root).textContent = String(miss);
          b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong"); ctx.sound.boo();
          setTimeout(() => b.classList.remove("wrong"), 450);
          return;
        }
        const slot = $$(".orderSlots li", root)[next];
        slot.classList.add("filled"); $(".t", slot).textContent = c.items[next];
        b.remove(); ctx.sound.beep(600 + next * 80, 0.06, "triangle", 0.05);
        next++;
        if (next < c.items.length) return;
        const got = coins(miss), perfect = miss === 0;
        ctx.sound.ding(); ctx.award(got, slot);
        if (perfect) { ctx.cheat.rewardIfUnpeeked(ex.id, slot); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        else ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.prompt}：いちばん最初は？`, opts: shuffle([c.items[0], ...shuffle(c.items.slice(1)).slice(0, 2)]), ans: c.items[0] });
        const fb = $(".fbBox", root);
        ctx.feedback(fb, perfect, perfect ? `ノーミス！ +${got}` : `完成（ミス${miss}回、+${got}）`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の問題</button></div>`);
        $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      }));
    }
    render();
  },
};
