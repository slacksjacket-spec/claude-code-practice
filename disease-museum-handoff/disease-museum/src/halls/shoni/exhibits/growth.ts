// 成長曲線：身長（と体重）の点を成長曲線に打ったグラフを読んで、パターンと原因を答える
import "./growth.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { GrowthData } from "./growth.schema";
import { AGES, at, H_MEAN, H_SD, W_MEAN, W_SD } from "./growth.consts";
import { twoStep } from "./twoStep";
import { esc } from "../../../engine/dom";

const W = 340, H = 260, L = 34, R = 300, T = 12, B = 232;
const x = (age: number) => L + ((age - 2) / 16) * (R - L);
const yH = (cm: number) => B - ((cm - 70) / 120) * (B - T);   // 身長 70〜190 cm
const yW = (kg: number) => B - (kg / 100) * (B - T);           // 体重 0〜100 kg

function band(mean: number[], sd: number[], k: number, y: (v: number) => number) {
  const pts: string[] = [];
  for (let a = 2; a <= 18; a += 0.5) pts.push(`${x(a).toFixed(1)},${y(at(mean, a) + k * at(sd, a)).toFixed(1)}`);
  return pts.join(" ");
}
function chart(c: GrowthData["cases"][number]) {
  const sdLines = [-2, -1, 0, 1, 2].map((k) => `<polyline points="${band(H_MEAN, H_SD, k, yH)}" fill="none" stroke="#3D5AFE" stroke-width="${k === 0 ? 1.6 : 0.9}" stroke-dasharray="${Math.abs(k) === 2 ? "5 3" : ""}" opacity=".6"/>`).join("");
  const wLines = c.weight ? [-2, 0, 2].map((k) => `<polyline points="${band(W_MEAN, W_SD, k, yW)}" fill="none" stroke="#FF5A36" stroke-width="${k === 0 ? 1.4 : 0.8}" stroke-dasharray="${k ? "5 3" : ""}" opacity=".55"/>`).join("") : "";
  const dots = (pts: [number, number][], y: (v: number) => number, col: string) => `<polyline points="${pts.map(([a, v]) => `${x(a)},${y(v)}`).join(" ")}" fill="none" stroke="${col}" stroke-width="2"/>${pts.map(([a, v]) => `<circle cx="${x(a)}" cy="${y(v)}" r="4" fill="${col}" stroke="#1C1537" stroke-width="1.5"/>`).join("")}`;
  return `<svg class="chartSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="成長曲線">
    ${AGES.map((a) => `<line x1="${x(a)}" x2="${x(a)}" y1="${T}" y2="${B}" stroke="#E8E0F0"/><text x="${x(a)}" y="${B + 14}" font-size="9" text-anchor="middle">${a}歳</text>`).join("")}
    ${[80, 100, 120, 140, 160, 180].map((cm) => `<text x="${L - 3}" y="${yH(cm) + 3}" font-size="9" text-anchor="end">${cm}</text>`).join("")}
    ${sdLines}${wLines}
    ${dots(c.height as [number, number][], yH, "#3D5AFE")}${c.weight ? dots(c.weight as [number, number][], yW, "#FF5A36") : ""}
    <text x="${R + 2}" y="${yH(at(H_MEAN, 18) + 2 * at(H_SD, 18)) + 3}" font-size="8">+2SD</text><text x="${R + 2}" y="${yH(at(H_MEAN, 18)) + 3}" font-size="8">平均</text><text x="${R + 2}" y="${yH(at(H_MEAN, 18) - 2 * at(H_SD, 18)) + 3}" font-size="8">−2SD</text>
    <text x="${L + 4}" y="${T + 10}" font-size="9">● 身長（cm）${c.weight ? "　● 体重（赤）" : ""}　模式（男女共通の目安）</text>
  </svg>`;
}

export const growth: CustomModule<GrowthData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => ({ head: `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div style="margin-top:6px;font-weight:800">${esc(c.story)}</div></div>${chart(c)}`, q1: c.question, o1: c.options, a1: c.answer, f: c.followUp, expl: c.explanation, miss: `${c.who}：${c.story}` }));
  },
};
