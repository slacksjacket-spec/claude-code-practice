// 神経根レベル：筋力低下・反射・感覚障害（図に色）から、障害された神経根を当てる（12）→ 続けて質問（12）
import "./root.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { RootData } from "./root.schema";
import { AREA, ROOTS, ROOT_IDS, type Root } from "./root.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 12, C2 = 12;
const limb = (d: string) => `<path d="${d}" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>`;
const BODY = `<circle cx="60" cy="30" r="16" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>
  ${limb("M44 60 L28 68 L20 170 L32 172 L46 110Z")}${limb("M76 60 L92 68 L100 170 L88 172 L74 110Z")}
  <ellipse cx="24" cy="184" rx="9" ry="13" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/><ellipse cx="96" cy="184" rx="9" ry="13" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>
  <rect x="44" y="50" width="32" height="100" rx="10" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>
  ${limb("M44 148 L58 148 L58 290 L44 290Z")}${limb("M62 148 L76 148 L76 290 L62 290Z")}
  <ellipse cx="48" cy="296" rx="12" ry="6" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/><ellipse cx="72" cy="296" rx="12" ry="6" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>`;

export const root: CustomModule<RootData> = {
  mount(rootEl, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], r = c.root as Root, info = ROOTS[r], show = c.show ?? ["motor", "reflex", "sensory"];
      let stage = 0, ok1 = false;
      ctx.cheat.reset(ex.id);
      const cards = [["motor", "筋力低下", info.motor], ["reflex", "反射", info.reflex], ["sensory", "感覚低下（図の色）", info.sensory]].filter(([k]) => show.includes(k as "motor")) as [string, string, string][];
      rootEl.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="rootWrap">
          <svg class="rootFig" viewBox="0 0 120 322" role="img" aria-label="感覚が低下した場所（右半身）">${BODY}${show.includes("sensory") ? `<g fill="var(--tomato)" opacity=".75">${AREA[r]}</g>` : ""}<text x="60" y="318" text-anchor="middle" font-size="9" font-weight="800" fill="#7A5A50">図の左が右半身</text></svg>
          <div class="rootCards">${cards.map(([, k, v]) => `<div><small>${esc(k)}</small>${esc(v)}</div>`).join("")}</div>
        </div>
        <div class="stepLabel">① 障害された神経根は？</div>
        <div class="roots s1">${ROOT_IDS.map((k) => `<button class="opt" data-k="${k}">${k}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".s1 .opt", rootEl).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; ok1 = b.dataset.k === r;
        $$<HTMLButtonElement>(".s1 .opt", rootEl).forEach((x) => { x.disabled = true; if (x.dataset.k === r) x.classList.add("right"); });
        if (ok1) { ctx.sound.ding(); ctx.award(C1, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", rootEl);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok1) ctx.miss({ id: `${ex.id}-${c.id}-root`, src: ex.title, q: `${cards.map(([, k, v]) => `${k}：${v}`).join("、")}。障害された神経根は？`, opts: shuffle([r, ...shuffle(ROOT_IDS.filter((x) => x !== r)).slice(0, 2)]), ans: r });
          if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const all = `${r}：${info.motor}／${info.reflex}／${info.sensory}`;
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `${esc(all)}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
