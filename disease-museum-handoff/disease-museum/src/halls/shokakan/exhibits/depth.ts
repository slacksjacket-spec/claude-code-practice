// 深達度タップ：壁の断面図で、がんがどの層まで届いているかをタップ → 治療を選ぶ
import "./depth.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { DepthData } from "./depth.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const DEPTH_COINS = 10, TX_COINS = 15;
const FILLS = ["#F7B8B0", "#FBE3C4", "#E8A0A0", "#FFF1D6", "#F3D1C0", "#E7E0F5"];

/** 壁の断面：上が内腔。がんは上から target 層の中ほどまで届く */
function wall(layers: { id: string; label: string }[], target: number) {
  const W = 520, top = 40, h = 44, bottom = top + layers.length * h;
  const depthY = top + target * h + h * 0.55;
  const tumor = `<path d="M170 ${top - 14} C200 ${top - 26} 320 ${top - 26} 350 ${top - 14} C340 ${depthY - 30} 300 ${depthY} 260 ${depthY} C220 ${depthY} 180 ${depthY - 30} 170 ${top - 14}Z" fill="#8E3B6E" opacity=".85" stroke="#1C1537" stroke-width="3" pointer-events="none"/>`;
  return `<svg class="wall" viewBox="0 0 ${W} ${bottom + 10}" role="group" aria-label="壁の断面図。上が内腔">
    <text x="12" y="24">↑ 内腔（粘膜の表面）</text>
    ${layers.map((l, i) => `<g class="band" data-i="${i}" tabindex="0" role="button" aria-label="${esc(l.label)}"><rect class="l" x="4" y="${top + i * h}" width="${W - 8}" height="${h}" fill="${FILLS[i % FILLS.length]}" stroke="#1C1537" stroke-width="1.5"/><text x="14" y="${top + i * h + h / 2 + 5}">${esc(l.label)}</text></g>`).join("")}
    ${tumor}
    <text x="${W - 12}" y="${top - 10}" text-anchor="end">がん</text>
  </svg>`;
}

export const depth: CustomModule<DepthData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;

    function render() {
      const c = q[qi % q.length], organ = d.organs[c.organ], target = organ.layers.findIndex((l) => l.id === c.depth);
      let depthOk = false, stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="pcard"><span class="tagk">${esc(organ.name)}</span><div class="chips">${Object.entries(c.card).map(([k, v]) => `<span class="chip">${esc(k)}：${esc(v)}</span>`).join("")}</div></div>
        <div class="stepLabel">① がんはどの層まで？（層をタップ）</div>
        ${wall(organ.layers, target)}
        <div class="fb1"></div>
        <div class="step2"></div>`;
      const bands = $$<SVGGElement>(".band", root);
      const pickDepth = (g: SVGGElement) => {
        if (stage !== 0) return;
        stage = 1;
        const i = +g.dataset.i!;
        depthOk = i === target;
        bands[target].classList.add("right");
        if (!depthOk) { g.classList.add("wrong"); ctx.sound.boo(); }
        else { ctx.sound.ding(); ctx.award(DEPTH_COINS, g); }
        $(".fb1", root).innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${depthOk ? "正解！" : "おしい。"}がんは「${esc(organ.layers[target].label)}」まで。</p>`;
        treatment();
      };
      bands.forEach((g) => {
        g.addEventListener("click", () => pickDepth(g));
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickDepth(g); } });
      });

      function treatment() {
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② 治療は？</div><div class="opts">${d.treatments.map((t, i) => `<button class="opt" data-i="${i}">${esc(t)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok = +b.dataset.i! === c.treatment;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.treatment) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(TX_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); }
          else b.classList.add("wrong"), ctx.sound.boo();
          if (!ok || !depthOk) {
            const ans = d.treatments[c.treatment];
            ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${organ.name}：${Object.entries(c.card).map(([k, v]) => `${k} ${v}`).join("、")}、深達度 ${organ.layers[target].label}。治療は？`, opts: d.treatments.slice(0, 4).includes(ans) ? d.treatments.slice(0, 4) : [ans, ...d.treatments.filter((t) => t !== ans).slice(0, 3)], ans });
          }
          if (ok && depthOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && depthOk, ok && depthOk ? "両方正解！" : ok ? "治療は正解！" : `正解は「${esc(d.treatments[c.treatment])}」`,
            `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の症例</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }
    }
    render();
  },
};
