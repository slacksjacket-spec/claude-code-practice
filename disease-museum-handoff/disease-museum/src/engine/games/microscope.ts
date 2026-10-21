// 顕微鏡で探せ：視野の中から目的の物（円柱・結晶・異常な細胞・菌など）をすべてタップで見つけ、それが意味するものを答える
import "./microscope.css";
import type { CustomModule } from "../exhibits/types";
import type { MicroscopeData } from "./microscope.schema";
import { $, $$, esc, shuffle } from "../dom";

const FIND_COINS = 12, Q_COINS = 12, MISS_PENALTY = 3, R = 120;

/** 重ならないように円の中へ並べる */
function place(n: number, minGap = 26) {
  const pts: [number, number][] = [];
  for (let tries = 0; pts.length < n && tries < n * 200; tries++) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (R - 18);
    const p: [number, number] = [R + r * Math.cos(a), R + r * Math.sin(a)];
    if (pts.every(([x, y]) => Math.hypot(x - p[0], y - p[1]) > minGap)) pts.push(p);
  }
  return pts;
}

export const microscope: CustomModule<MicroscopeData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], tgt = d.sprites[c.target.sprite];
      const items = shuffle([...c.crowd.flatMap((x) => Array.from({ length: x.n }, () => ({ s: x.sprite, t: false }))), ...Array.from({ length: c.target.n }, () => ({ s: c.target.sprite, t: true }))]);
      const pts = place(items.length);
      let found = 0, miss = 0, done = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="stepLabel">① 視野の中の「${esc(tgt.label)}」を全部タップ（${c.target.n}個）</div>
        <svg class="scope" viewBox="0 0 ${R * 2} ${R * 2}" role="group" aria-label="${esc(d.title)}">
          <defs><clipPath id="scopeClip"><circle cx="${R}" cy="${R}" r="${R}"/></clipPath><radialGradient id="scopeVig" cx="50%" cy="50%" r="50%"><stop offset=".86" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient></defs>
          <g clip-path="url(#scopeClip)"><rect width="${R * 2}" height="${R * 2}" fill="${esc(d.background ?? "#F3EEDF")}"/>
          ${items.map((it, i) => pts[i] ? `<g class="obj" data-i="${i}" data-t="${it.t ? 1 : 0}" transform="translate(${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}) rotate(${Math.floor(Math.random() * 360)})" role="button" tabindex="0" aria-label="${esc(d.sprites[it.s].label)}">${d.sprites[it.s].svg}<circle class="hit" r="14" fill="transparent"/></g>` : "").join("")}
          <circle cx="${R}" cy="${R}" r="${R}" fill="url(#scopeVig)" pointer-events="none"/></g>
        </svg>
        <div class="scopeBar"><span class="cnt">0 / ${c.target.n}</span><span class="small">まちがい <b class="miss">0</b></span><button class="btn alt hint">見つからない</button></div>
        <div class="step2"></div>`;
      const after = () => {
        done = true;
        const got = Math.max(2, FIND_COINS - miss * MISS_PENALTY);
        if (found === c.target.n) { ctx.sound.ding(); ctx.award(got, $(".scope", root)); }
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(c.question)}</div><div class="opts">${c.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok = +b.dataset.i! === c.answer, findOk = found === c.target.n && miss <= 1;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(Q_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${d.title}で「${tgt.label}」が見える。${c.question}`, opts: shuffle([c.options[c.answer], ...shuffle(c.options.filter((_, i) => i !== c.answer)).slice(0, 2)]), ans: c.options[c.answer] });
          if (ok && findOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && findOk, ok && findOk ? "観察も判断も完璧！" : ok ? "判断は正解！" : `正解は「${esc(c.options[c.answer])}」`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の視野</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      };
      const tap = (g: Element) => {
        if (done || g.classList.contains("found")) return;
        if (g.getAttribute("data-t") === "1") {
          g.classList.add("found"); found++; ctx.sound.beep(700 + found * 80, 0.06, "triangle", 0.05);
          $(".cnt", root).textContent = `${found} / ${c.target.n}`;
          if (found === c.target.n) after();
        } else { miss++; $(".miss", root).textContent = String(miss); g.classList.add("oops"); ctx.sound.boo(); setTimeout(() => g.classList.remove("oops"), 400); }
      };
      $$(".scope .obj", root).forEach((g) => {
        g.addEventListener("click", () => tap(g));
        g.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); tap(g); } });
      });
      $(".hint", root).onclick = () => { if (done) return; miss = 99; $$('.scope .obj[data-t="1"]', root).forEach((g) => g.classList.add("hint")); found = c.target.n; after(); };
    }
    render();
  },
};
