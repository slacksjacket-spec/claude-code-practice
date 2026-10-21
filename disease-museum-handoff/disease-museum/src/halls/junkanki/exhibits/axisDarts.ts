// 電気軸ダーツ：6つの肢誘導を見て、六軸図のどこに電気軸があるかを「投げる」。近いほど高得点
import "../ecg/ecg.css";
import "./axisDarts.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { AxisDartsData } from "./axisDarts.schema";
import { limbMorph, morph, sinusRhythm, type Lead } from "../ecg/synth";
import { stripSVG } from "../ecg/render";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const LIMBS: [Lead, number][] = [["I", 0], ["II", 60], ["III", 120], ["aVR", -150], ["aVL", -30], ["aVF", 90]];
const CLASS_COINS = 10;
const diff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const norm = (a: number) => ((a + 540) % 360) - 180;

function dial(guess: number | null, truth: number | null) {
  const C = 100, Rr = 84, pt = (deg: number, r = Rr) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)];
  const lines = LIMBS.map(([l, a]) => {
    const [x1, y1] = pt(a), [x2, y2] = pt(a + 180), [tx, ty] = pt(a, Rr + 10);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--sub)" stroke-width=".6" stroke-dasharray="2 2"/><circle cx="${x1}" cy="${y1}" r="2" fill="var(--ink)"/><text x="${tx}" y="${ty + 3}" text-anchor="middle">${l}</text>`;
  }).join("");
  const arrow = (a: number, color: string) => { const [x, y] = pt(a, Rr - 4); return `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="#1C1537" stroke-width="1.5"/>`; };
  // 正常軸（-30〜+90）の扇
  const [ax, ay] = pt(-30), [bx, by] = pt(90);
  return `<svg class="dial" viewBox="-12 -12 224 224" role="img" aria-label="六軸図。タップで電気軸を投げる">
    <path d="M${C} ${C} L${ax} ${ay} A${Rr} ${Rr} 0 0 1 ${bx} ${by}Z" fill="var(--mint)" opacity=".18"/>
    <circle cx="${C}" cy="${C}" r="${Rr}" fill="none" stroke="var(--line)" stroke-width="2"/>${lines}
    <text x="${C + 4}" y="${C + Rr - 6}" style="font-size:8px;fill:var(--sub)">+90°</text><text x="${C + Rr - 18}" y="${C - 3}" style="font-size:8px;fill:var(--sub)">0°</text>
    ${truth !== null ? arrow(truth, "var(--mint)") : ""}${guess !== null ? arrow(guess, "var(--tomato)") : ""}
  </svg>`;
}

export const axisDarts: CustomModule<AxisDartsData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    const classOf = (a: number) => d.classes.find((c) => norm(a) >= c.from && norm(a) < c.to)!;

    function render() {
      const axis = Math.round(d.range[0] + Math.random() * (d.range[1] - d.range[0])), seed = Math.floor(Math.random() * 1e9);
      let thrown = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="limbGrid">${LIMBS.map(([l]) => `<div class="ecgBox">${stripSVG(sinusRhythm(morph(limbMorph(l, axis)), 70, seed, 2.2), 1.8, { label: l, h: 34, base: 19 })}</div>`).join("")}</div>
        <p class="ecgHint">QRSの上向き・下向きのバランスを見る。上下が同じくらい（基線をはさんで等しい）誘導に直角な方向が電気軸。</p>
        <div class="dialBox">${dial(null, null)}</div><p class="ecgHint" style="text-align:center">六軸図のどこかをタップして投げる（右が0°、下が+90°）</p>
        <div class="fb1"></div><div class="step2"></div>`;
      const bind = () => {
        const svg = $<SVGSVGElement>(".dial", root);
        svg.addEventListener("pointerdown", (e) => {
          if (thrown) return;
          const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
          const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
          throwAt(Math.round((Math.atan2(p.y - 100, p.x - 100) * 180) / Math.PI));
        });
      };
      bind();
      const throwAt = (g: number) => {
        thrown = true;
        const err = diff(g, axis), band = d.bands.find((b) => err <= b.within);
        $(".dialBox", root).innerHTML = dial(g, axis);
        if (band && band.coins) { ctx.sound.yay(); ctx.award(band.coins, $(".dial", root)); } else ctx.sound.boo();
        if (err <= d.stampWithin && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
        $(".fb1", root).innerHTML = `<p style="font-weight:800;text-align:center;margin:6px 0 0">${band ? esc(band.label) : "はずれ"}：あなた ${g > 0 ? "+" : ""}${g}° ／ 正解 ${axis > 0 ? "+" : ""}${axis}°（誤差 ${err}°）</p>`;
        const cls = classOf(axis), box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">この軸の分類は？</div><div class="opts">${shuffle(d.classes).map((c) => `<button class="opt" data-l="${esc(c.label)}">${esc(c.label)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok = b.dataset.l === cls.label;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (x.dataset.l === cls.label) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(CLASS_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); }
          else { b.classList.add("wrong"); ctx.sound.boo(); ctx.miss({ id: `${ex.id}-${cls.label}`, src: ex.title, q: `電気軸 ${axis > 0 ? "+" : ""}${axis}°の分類は？`, opts: d.classes.slice(0, 4).map((c) => c.label), ans: cls.label }); }
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok, ok ? "正解！" : `正解は「${esc(cls.label)}」`, `${esc(cls.note)}<div style="margin-top:8px"><button class="btn next">次の心電図</button></div>`);
          $(".next", fb).onclick = render;
        }));
      };
    }
    render();
  },
};
