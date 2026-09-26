// 12誘導読影：ST上昇の誘導をタップして部位と責任血管を当てる／所見を当てる
import "../ecg/ecg.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { TwelveData } from "./twelve.schema";
import { LEADS, makeTwelve, type Lead } from "../ecg/synth";
import { twelveSVG } from "../ecg/render";
import { $, $$, esc, pick, shuffle } from "../../../engine/dom";

const LEAD_COINS = 15, AREA_COINS = 15, DX_COINS = 15;

export const twelve: CustomModule<TwelveData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let mode: "st" | "dx" = "st";
    root.innerHTML = `<div class="seg modeTabs"><button aria-pressed="true" data-m="st">ST上昇はどこ？</button><button aria-pressed="false" data-m="dx">所見当て</button></div><div class="body"></div>`;
    const body = $(".body", root);
    $$<HTMLButtonElement>(".modeTabs button", root).forEach((b) => (b.onclick = () => {
      mode = b.dataset.m as "st" | "dx";
      $$(".modeTabs button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    }));
    const win = () => { if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); };

    function render() { ctx.cheat.reset(ex.id); if (mode === "st") st(); else dx(); }

    function st() {
      const c = pick(d.stCases), seed = Math.floor(Math.random() * 1e9), tw = makeTwelve(c.pattern, seed);
      const truth = new Set<Lead>(tw.stLeads), sel = new Set<Lead>();
      let stage = 0, leadsOk = false;
      body.innerHTML = `<div class="ecgBox">${twelveSVG(tw, seed, { tappable: true })}</div><p class="ecgHint">胸痛で来院。ST が上がっている誘導をすべて選ぼう（心電図の区画をタップしても選べる）。</p>
        <div class="leadChips">${LEADS.map((l) => `<button data-l="${l}" aria-pressed="false">${l}</button>`).join("")}<button class="none" data-l="">上昇なし</button></div>
        <div class="row" style="margin-top:10px"><button class="btn go">決定</button></div><div class="fb1"></div><div class="step2"></div>`;
      const sync = () => {
        $$(".leadChips button[data-l]", body).forEach((b) => b.dataset.l && b.setAttribute("aria-pressed", String(sel.has(b.dataset.l as Lead))));
        $$(".leadHit", body).forEach((r) => r.classList.toggle("on", sel.has(r.getAttribute("data-lead") as Lead)));
      };
      const toggle = (l: Lead) => { if (stage) return; sel.has(l) ? sel.delete(l) : sel.add(l); ctx.sound.beep(sel.has(l) ? 760 : 420, 0.04, "triangle", 0.04); sync(); };
      $$<HTMLButtonElement>(".leadChips button", body).forEach((b) => (b.onclick = () => { if (b.dataset.l) toggle(b.dataset.l as Lead); else if (!stage) { sel.clear(); sync(); } }));
      $$(".leadHit", body).forEach((r) => {
        r.addEventListener("click", () => toggle(r.getAttribute("data-lead") as Lead));
        r.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); toggle(r.getAttribute("data-lead") as Lead); } });
      });
      const go = $<HTMLButtonElement>(".go", body);
      go.onclick = () => {
        if (stage) return;
        stage = 1; go.disabled = true;
        leadsOk = sel.size === truth.size && [...sel].every((l) => truth.has(l));
        $$<HTMLButtonElement>(".leadChips button[data-l]", body).forEach((b) => {
          const l = b.dataset.l as Lead;
          if (!l) return;
          b.classList.toggle("right", truth.has(l));
          b.classList.toggle("missed", truth.has(l) && !sel.has(l));
        });
        if (leadsOk) { ctx.sound.ding(); ctx.award(LEAD_COINS, go); } else ctx.sound.boo();
        $(".fb1", body).innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${leadsOk ? "誘導は正解！" : "おしい。"}ST上昇：${truth.size ? [...truth].join("・") : "なし"}</p>`;
        const box = $(".step2", body);
        box.innerHTML = `<div class="stepLabel">部位と責任血管は？</div><div class="opts">${d.territories.map((t) => `<button class="opt" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok = b.dataset.t === c.territory;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (x.dataset.t === c.territory) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(AREA_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !leadsOk) ctx.miss({ id: `${ex.id}-${c.pattern}`, src: ex.title, q: `ST上昇が ${[...truth].join("・") || "なし（V1〜V3でST低下と高いR波）"}。部位と責任血管は？`, opts: shuffle([c.territory, ...shuffle(d.territories.filter((t) => t !== c.territory)).slice(0, 2)]), ans: c.territory });
          if (ok && leadsOk) win();
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && leadsOk, ok && leadsOk ? "完璧！" : ok ? "部位は正解！" : `正解は「${esc(c.territory)}」`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の心電図</button></div>`);
          $(".next", fb).onclick = render;
        }));
      };
    }

    function dx() {
      const p = pick(d.patterns), seed = Math.floor(Math.random() * 1e9);
      const opts = shuffle([p.name, ...shuffle(d.patterns.filter((x) => x.id !== p.id)).slice(0, 4).map((x) => x.name)]);
      body.innerHTML = `<div class="ecgBox">${twelveSVG(makeTwelve(p.id, seed), seed)}</div><p class="ecgHint">横にスクロールできます（25mm/秒、10mm/mV）。</p>
        <div class="stepLabel">この心電図の所見は？</div><div class="opts">${opts.map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".opt", body).forEach((b) => (b.onclick = () => {
        const ok = b.dataset.a === p.name;
        $$<HTMLButtonElement>(".opt", body).forEach((x) => { x.disabled = true; if (x.dataset.a === p.name) x.classList.add("right"); });
        if (ok) { ctx.sound.ding(); ctx.award(DX_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); win(); }
        else { b.classList.add("wrong"); ctx.sound.boo(); ctx.miss({ id: `${ex.id}-dx-${p.id}`, src: ex.title, q: `12誘導：${p.clue} この所見は？`, opts: shuffle([p.name, ...opts.filter((o) => o !== p.name).slice(0, 2)]), ans: p.name }); }
        const fb = $(".fbBox", body);
        ctx.feedback(fb, ok, ok ? "正解！" : `正解は「${esc(p.name)}」`, `<span class="clueLine">読むポイント：${esc(p.clue)}</span><br>${esc(p.explanation)}<div style="margin-top:8px"><button class="btn next">次の心電図</button></div>`);
        $(".next", fb).onclick = render;
      }));
    }
    render();
  },
};
