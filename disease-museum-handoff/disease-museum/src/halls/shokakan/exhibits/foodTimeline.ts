// 食中毒の犯人さがし：発症から時計を巻き戻し、潜伏期に合う食事を見つけて、原因微生物を当てる
import "./foodTimeline.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { FoodTimelineData } from "./foodTimeline.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const MEAL_COINS = 10, BUG_COINS = 15;
const W = 640, X0 = 20, X1 = 600, MINH = 0.5, MAXH = 240; // 右端が発症。対数の目盛り
const x = (h: number) => X1 - ((Math.log(h) - Math.log(MINH)) / (Math.log(MAXH) - Math.log(MINH))) * (X1 - X0);
const TICKS: [number, string][] = [[1, "1時間"], [3, "3時間"], [6, "6時間"], [12, "12時間"], [24, "1日"], [48, "2日"], [96, "4日"], [192, "8日"]];
const ago = (h: number) => (h < 24 ? `${Math.round(h)}時間前` : `${(h / 24).toFixed(h < 72 ? 1 : 0)}日前`);

export const foodTimeline: CustomModule<FoodTimelineData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`, org = new Map(d.organisms.map((o) => [o.id, o]));
    let q = shuffle(d.cases), qi = 0;

    function render() {
      const c = q[qi % q.length];
      let mealOk = false, stage = 0;
      ctx.cheat.reset(ex.id);
      const svg = () => `<svg class="tl" viewBox="0 0 ${W} 150" role="group" aria-label="発症までのタイムライン（右が発症）">
        <g class="axis"><line x1="${X0}" y1="96" x2="${X1}" y2="96" stroke="var(--line)" stroke-width="3"/>
          ${TICKS.map(([h, l]) => `<line x1="${x(h)}" y1="90" x2="${x(h)}" y2="102" stroke="var(--line)" stroke-width="2"/><text x="${x(h)}" y="118" text-anchor="middle">${l}前</text>`).join("")}
          <text x="${X1}" y="140" text-anchor="end" style="font-size:12px;fill:var(--tomato)">▲ 発症 ${esc(c.onset)}</text></g>
        <g class="band"></g>
        ${c.meals.map((m, i) => `<g class="meal" data-i="${i}" tabindex="0" role="button" aria-label="${esc(m.label)}（${ago(m.hoursBefore)}）"><line x1="${x(m.hoursBefore)}" y1="${i % 2 ? 60 : 40}" x2="${x(m.hoursBefore)}" y2="96" stroke="var(--line)" stroke-width="2"/><circle cx="${x(m.hoursBefore)}" cy="96" r="9"/><text x="${x(m.hoursBefore)}" y="${i % 2 ? 54 : 34}" text-anchor="middle">${esc(m.label)}</text></g>`).join("")}
        <circle class="cursor" cx="${X1}" cy="96" r="5" fill="var(--tomato)"/>
      </svg>`;
      root.innerHTML = `<div class="story">${esc(c.story)}<br><span class="small" style="color:var(--sub)">発症：${esc(c.onset)}</span></div>
        <div class="stepLabel">① 時計を巻き戻して、あやしい食事を選ぼう</div>
        ${svg()}
        <div class="rewind"><span class="small" style="font-weight:800">巻き戻し</span><input type="range" min="0" max="100" value="0" aria-label="巻き戻し"><span class="ago">発症</span></div>
        <div class="mealBtns">${c.meals.map((m, i) => `<button class="btn alt mb" data-i="${i}">${esc(m.label)}（${ago(m.hoursBefore)}）</button>`).join("")}</div>
        <div class="fb1"></div><div class="step2"></div>`;
      const meals = $$<SVGGElement>(".tl .meal", root), range = $<HTMLInputElement>(".rewind input", root);
      range.oninput = () => {
        const t = +range.value / 100, h = Math.exp(Math.log(MINH) + t * (Math.log(MAXH) - Math.log(MINH)));
        $(".rewind .ago", root).textContent = t === 0 ? "発症" : ago(h);
        $(".tl .cursor", root).setAttribute("cx", String(x(h)));
        let near = -1, best = 1e9;
        c.meals.forEach((m, i) => { const dd = Math.abs(Math.log(m.hoursBefore) - Math.log(h)); if (dd < best) { best = dd; near = i; } });
        meals.forEach((g, i) => g.classList.toggle("focus", i === near && best < 0.25));
      };
      const pickMeal = (i: number) => {
        if (stage !== 0) return;
        stage = 1; mealOk = i === c.culprit;
        meals[c.culprit].classList.add("right");
        if (!mealOk) meals[i].classList.add("wrong");
        $$<HTMLButtonElement>(".mb", root).forEach((b) => (b.disabled = true));
        if (mealOk) { ctx.sound.ding(); ctx.award(MEAL_COINS, $(`.mb[data-i="${i}"]`, root)); } else ctx.sound.boo();
        $(".fb1", root).innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${mealOk ? "正解！" : "おしい。"}あやしいのは「${esc(c.meals[c.culprit].label)}」（${ago(c.meals[c.culprit].hoursBefore)}）。</p>`;
        organism();
      };
      meals.forEach((g, i) => {
        g.addEventListener("click", () => pickMeal(i));
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickMeal(i); } });
      });
      $$<HTMLButtonElement>(".mb", root).forEach((b) => (b.onclick = () => pickMeal(+b.dataset.i!)));

      function organism() {
        const box = $(".step2", root), opts = shuffle(c.options);
        box.innerHTML = `<div class="stepLabel">② 原因は？</div><div class="opts">${opts.map((o) => `<button class="opt" data-o="${esc(o)}">${esc(org.get(o)!.name)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok = b.dataset.o === c.organism, o = org.get(c.organism)!;
          $$<HTMLButtonElement>(".opt", box).forEach((xb) => { xb.disabled = true; if (xb.dataset.o === c.organism) xb.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(BUG_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !mealOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}（あやしい食事：${c.meals[c.culprit].label}、${ago(c.meals[c.culprit].hoursBefore)}）原因は？`, opts: shuffle(c.options.slice(0, 4).map((id) => org.get(id)!.name)), ans: o.name });
          if (ok && mealOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          // 正解の菌の潜伏期を帯で見せる
          $(".tl .band", root).innerHTML = `<rect x="${x(o.windowH[1])}" y="76" width="${x(o.windowH[0]) - x(o.windowH[1])}" height="40" rx="8" fill="var(--mint)" opacity=".35"/><text x="${(x(o.windowH[0]) + x(o.windowH[1])) / 2}" y="72" text-anchor="middle" style="font-size:11px;font-weight:800;fill:var(--ink)">${esc(o.name)}の潜伏期</text>`;
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && mealOk, ok && mealOk ? "犯人確保！" : ok ? "原因は正解！" : `正解は「${esc(o.name)}」`,
            `${esc(c.explanation)}<br><span class="small">${esc(o.name)}：${esc(o.note)}</span><div style="margin-top:8px"><button class="btn next">次の事件</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }
    }
    render();
  },
};
