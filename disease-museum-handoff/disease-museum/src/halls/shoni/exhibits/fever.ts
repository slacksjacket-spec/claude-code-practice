// 熱型表：毎日の体温のグラフと、発疹が出た日を見て、病名と次の質問に答える
import "./growth.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { FeverData } from "./fever.schema";
import { esc } from "../../../engine/dom";
import { twoStep } from "./twoStep";

const W = 340, H = 190, L = 34, R = 326, T = 14, B = 160;
function chart(c: FeverData["cases"][number]) {
  const n = c.temps.length, x = (d: number) => L + ((d - 0.5) / n) * (R - L), y = (t: number) => B - ((t - 35.5) / 5) * (B - T);
  const rash = c.rashFrom ? `<rect x="${x(c.rashFrom) - (R - L) / n / 2}" y="${T}" width="${(R - L) / n * (n - c.rashFrom + 1)}" height="${B - T}" fill="var(--pink)" opacity=".18"/><text x="${x(c.rashFrom) - (R - L) / n / 2 + 4}" y="${T + 12}" font-size="10" fill="#C0306A">発疹</text>` : "";
  return `<svg class="chartSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="熱型表：${c.temps.map((t, i) => `${i + 1}日目 ${t}℃`).join("、")}">
    ${rash}
    ${[36, 37, 38, 39, 40].map((t) => `<line x1="${L}" x2="${R}" y1="${y(t)}" y2="${y(t)}" stroke="${t === 38 ? "#FF5A36" : "#E8E0F0"}" stroke-dasharray="${t === 38 ? "4 3" : ""}"/><text x="${L - 4}" y="${y(t) + 3}" font-size="9" text-anchor="end">${t}</text>`).join("")}
    ${c.temps.map((_, i) => `<text x="${x(i + 1)}" y="${B + 14}" font-size="9" text-anchor="middle">${i + 1}</text>`).join("")}
    <text x="${R}" y="${B + 26}" font-size="9" text-anchor="end">病日</text>
    <polyline points="${c.temps.map((t, i) => `${x(i + 1).toFixed(1)},${y(t).toFixed(1)}`).join(" ")}" fill="none" stroke="#FF5A36" stroke-width="2.5" stroke-linejoin="round"/>
    ${c.temps.map((t, i) => `<circle cx="${x(i + 1)}" cy="${y(t)}" r="3.5" fill="#FF5A36" stroke="#1C1537" stroke-width="1.2"/>`).join("")}
  </svg>`;
}

export const feverChart: CustomModule<FeverData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => ({
      head: `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div class="signs">${[...(c.rash ? [`発疹：${c.rash}`] : []), ...c.signs].map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>${chart(c)}`,
      q1: "考える病気は？", o1: c.options, a1: c.answer, f: c.followUp, expl: c.explanation, miss: `${c.who}：${c.signs.join("、")}${c.rash ? `、発疹 ${c.rash}` : ""}。`,
    }));
  },
};
