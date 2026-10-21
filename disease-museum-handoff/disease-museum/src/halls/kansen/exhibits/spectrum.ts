// 抗菌薬スペクトラム：薬のカードを見て、効く菌をすべて選ぶ。まちがい1つまでなら合格
import "./spectrum.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { SpectrumData } from "./spectrum.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const PERFECT = 20, ONE_MISS = 10;

export const spectrum: CustomModule<SpectrumData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.drugs), qi = 0;
    function render() {
      const x = q[qi % q.length], truth = new Set(x.covers), sel = new Set<string>();
      let done = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="drugCard"><i class="pill" aria-hidden="true"></i><div><span class="small">${esc(x.klass)}</span><b>${esc(x.name)}</b></div></div>
        <div class="stepLabel">この薬がふつう効く菌を全部タップ（まちがい1つまでOK）</div>
        <div class="bugs">${d.bugs.map((b) => `<button class="bug" data-b="${esc(b.id)}" aria-pressed="false">${esc(b.label)}${b.sub ? `<small>${esc(b.sub)}</small>` : ""}</button>`).join("")}</div>
        <div class="row" style="justify-content:center;margin-top:12px"><button class="btn go">投与する</button></div>
        <div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".bug", root).forEach((b) => (b.onclick = () => {
        if (done) return;
        const id = b.dataset.b!;
        sel.has(id) ? sel.delete(id) : sel.add(id);
        b.setAttribute("aria-pressed", String(sel.has(id)));
        ctx.sound.beep(sel.has(id) ? 680 : 440, 0.05, "triangle", 0.04);
      }));
      $(".go", root).onclick = () => {
        if (done) return;
        done = true;
        let miss = 0;
        $$<HTMLButtonElement>(".bug", root).forEach((b) => {
          const id = b.dataset.b!, t = truth.has(id), s = sel.has(id);
          b.disabled = true;
          if (t && s) b.classList.add("right"); else if (s) { b.classList.add("wrong"); miss++; } else if (t) { b.classList.add("missed"); miss++; }
        });
        const label = (id: string) => d.bugs.find((b) => b.id === id)!.label;
        const okText = x.covers.map(label).join("・"), pass = miss <= 1;
        if (pass) { ctx.sound.ding(); ctx.award(miss ? ONE_MISS : PERFECT, $(".go", root)); if (!miss) ctx.cheat.rewardIfUnpeeked(ex.id, $(".go", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        else ctx.sound.boo();
        if (miss) {
          const others = d.drugs.filter((y) => y.id !== x.id && y.covers.join() !== x.covers.join()).map((y) => y.covers.map(label).join("・"));
          ctx.miss({ id: `${ex.id}-${x.id}`, src: ex.title, q: `${x.name}（${x.klass}）がふつう効くのは？`, opts: shuffle([okText, ...shuffle(others).slice(0, 2)]), ans: okText });
        }
        ctx.feedback($(".fbBox", root), pass, !miss ? "スペクトラム完璧！" : pass ? "ほぼ正解！（まちがい1つ）" : `まちがい${miss}つ。点線が選び忘れ、赤が効かない菌`, `効くのは ${esc(okText)}。${esc(x.note)}<div style="margin-top:8px"><button class="btn next">次の薬</button></div>`);
        $(".next", root).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.drugs); render(); };
      };
    }
    render();
  },
};
