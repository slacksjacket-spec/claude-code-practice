// 部位タップ：図の上の場所をタップして答える（病変の局在、視野欠損の責任部位、皮膚分節など）。続けて質問が出せる
import "./tapMap.css";
import type { CustomModule } from "../exhibits/types";
import type { TapMapData } from "./tapMap.schema";
import { $, $$, esc, shuffle } from "../dom";

const TAP_COINS = 15, FOLLOW_COINS = 10;

export const tapMap: CustomModule<TapMapData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], f = d.figures[c.figure], multi = c.answer.length > 1, sel = new Set<string>();
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.prompt)}${c.signs ? `<div class="signs" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${c.signs.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>` : ""}</div>
        <div class="stepLabel">① ${esc(d.question ?? "どこ？")}${multi ? `（${c.answer.length}つ選んで決定）` : "（タップ）"}</div>
        <svg class="tapFig" viewBox="${esc(f.viewBox)}" role="group" aria-label="${esc(f.ariaLabel)}">${f.svg}
          ${f.regions.map((r) => `<g class="tapR" data-r="${esc(r.id)}" tabindex="0" role="button" aria-label="${esc(r.label)}">${r.shape.replace(/^<(\w+)/, '<$1 class="shape"')}</g>`).join("")}</svg>
        ${f.note ? `<p class="small" style="text-align:center;color:var(--sub);font-weight:800;margin:4px 0 0">${esc(f.note)}</p>` : ""}
        <div class="tapChips">${f.regions.map((r) => `<button data-r="${esc(r.id)}" aria-pressed="false">${esc(r.label)}</button>`).join("")}</div>
        ${multi ? `<div class="row" style="margin-top:10px"><button class="btn go">決定</button></div>` : ""}
        <div class="fb1"></div><div class="step2"></div>`;
      const label = (id: string) => f.regions.find((r) => r.id === id)!.label;
      const sync = () => {
        $$(".tapFig .tapR", root).forEach((g) => g.classList.toggle("sel", sel.has(g.getAttribute("data-r")!)));
        $$(".tapChips button", root).forEach((b) => b.setAttribute("aria-pressed", String(sel.has(b.dataset.r!))));
      };
      const judge = () => {
        stage = 1;
        const truth = new Set(c.answer), ok = sel.size === truth.size && [...sel].every((x) => truth.has(x));
        $$(".tapFig .tapR", root).forEach((g) => { const id = g.getAttribute("data-r")!; g.classList.remove("sel"); if (truth.has(id)) g.classList.add("right"); else if (sel.has(id)) g.classList.add("wrong"); });
        if (ok) { ctx.sound.ding(); ctx.award(TAP_COINS, $(".tapFig", root)); } else ctx.sound.boo();
        $(".fb1", root).innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${ok ? "正解！" : "おしい。"}答え：${c.answer.map((a) => esc(label(a))).join("・")}</p>`;
        const done = (all: boolean, title: string) => {
          if (!all) {
            const ans = c.followUp ? c.followUp.options[c.followUp.answer] : c.answer.map(label).join("・");
            const others = c.followUp ? c.followUp.options.filter((_, i) => i !== c.followUp!.answer) : f.regions.filter((r) => !truth.has(r.id)).map((r) => r.label);
            ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.prompt}${c.signs ? `（${c.signs.join("、")}）` : ""}${c.followUp ? c.followUp.question : d.question ?? "どこ？"}`, opts: shuffle([ans, ...shuffle(others).slice(0, 2)]), ans });
          }
          if (all) { ctx.cheat.rewardIfUnpeeked(ex.id, $(".tapFig", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
          const fb = document.createElement("div"); $(".step2", root).append(fb);
          ctx.feedback(fb, all, title, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        };
        if (!c.followUp) { done(ok, ok ? "正解！" : "答えは緑の場所"); return; }
        const fu = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(fu.question)}</div><div class="opts">${fu.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok2 = +b.dataset.i! === fu.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === fu.answer) x.classList.add("right"); });
          if (ok2) { ctx.sound.ding(); ctx.award(FOLLOW_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
          done(ok && ok2, ok && ok2 ? "両方正解！" : ok2 ? "②は正解！" : `②の正解は「${esc(fu.options[fu.answer])}」`);
        }));
      };
      const pick = (id: string) => {
        if (stage) return;
        if (!multi) { sel.clear(); sel.add(id); sync(); judge(); return; }
        sel.has(id) ? sel.delete(id) : sel.add(id);
        ctx.sound.beep(sel.has(id) ? 760 : 420, 0.04, "triangle", 0.04);
        sync();
      };
      $$(".tapFig .tapR", root).forEach((g) => {
        g.addEventListener("click", () => pick(g.getAttribute("data-r")!));
        g.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); pick(g.getAttribute("data-r")!); } });
      });
      $$<HTMLButtonElement>(".tapChips button", root).forEach((b) => (b.onclick = () => pick(b.dataset.r!)));
      if (multi) $(".go", root).onclick = () => { if (stage) return; if (!sel.size) { ctx.toast("場所を選んでね"); return; } judge(); };
    }
    render();
  },
};
