// 糖負荷曲線：75g OGTT のグラフを読んで、正常型・境界型・糖尿病型を判定し、続けて診断や病態を答える
import "./ogtt.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { OgttData } from "./ogtt.schema";
import { OGTT_LABEL, TIMES, type OgttType } from "./ogtt.consts";
import { esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

const OGTT_IDS = Object.keys(OGTT_LABEL) as OgttType[];
const W = 320, H = 200, L = 40, Rt = 290, T = 14, B = 172, GMAX = 400;
const x = (t: number) => L + (t / 120) * (Rt - L);
const y = (g: number, max = GMAX) => B - (Math.min(g, max) / max) * (B - T);

function chart(c: OgttData["cases"][number]) {
  const gl = c.glucose.map((g, i) => `${x(TIMES[i]).toFixed(1)},${y(g).toFixed(1)}`).join(" ");
  const insMax = 160;
  const ins = c.insulin?.map((v, i) => `${x(TIMES[i]).toFixed(1)},${y(v, insMax).toFixed(1)}`).join(" ");
  const grid = [100, 200, 300, 400].map((g) => `<line x1="${L}" x2="${Rt}" y1="${y(g)}" y2="${y(g)}" stroke="currentColor" opacity=".12"/><text x="${L - 4}" y="${y(g) + 4}" font-size="10" text-anchor="end">${g}</text>`).join("");
  // 判定の目安線：空腹時（0分）110・126、2時間値（120分）140・200
  const marks = [[0, 110], [0, 126], [120, 140], [120, 200]].map(([t, g]) => `<line x1="${x(t) - 10}" x2="${x(t) + 10}" y1="${y(g)}" y2="${y(g)}" stroke="var(--sun)" stroke-width="3"/><text x="${x(t) + 13}" y="${y(g) + (g === 110 ? 9 : g === 126 ? -1 : 4)}" font-size="9">${g}</text>`).join("");
  return `<svg class="ogttSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="糖負荷試験の血糖曲線：${c.glucose.map((g, i) => `${TIMES[i]}分 ${g}`).join("、")}">
    ${grid}<line x1="${L}" x2="${L}" y1="${T}" y2="${B}" stroke="currentColor"/><line x1="${L}" x2="${Rt}" y1="${B}" y2="${B}" stroke="currentColor"/>
    ${TIMES.map((t) => `<text x="${x(t)}" y="${B + 14}" font-size="10" text-anchor="middle">${t}分</text>`).join("")}
    ${marks}
    ${ins ? `<polyline class="ins" points="${ins}" fill="none" stroke-width="3" stroke-dasharray="6 4"/>` : ""}
    <polyline class="gl" points="${gl}" fill="none" stroke-width="4" stroke-linejoin="round"/>
    ${c.glucose.map((g, i) => `<circle cx="${x(TIMES[i])}" cy="${y(g)}" r="5" fill="var(--tomato)" stroke="#1C1537" stroke-width="2"/><text x="${x(TIMES[i])}" y="${y(g) - 9}" font-size="11" text-anchor="middle">${g}</text>`).join("")}
    <text x="${Rt}" y="${T + 4}" font-size="10" text-anchor="end">― 血糖 mg/dL${ins ? "　- - インスリン" : ""}</text>
  </svg>`;
}

export const ogtt: CustomModule<OgttData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => ({
      head: `<div class="pcard"><span class="tagk">${esc(c.who)}</span><div style="margin-top:6px;font-weight:800">${esc(c.story)}</div>${c.hba1c !== undefined ? `<div class="signs"><span class="chip">HbA1c ${c.hba1c}%</span></div>` : ""}</div>${chart(c)}`,
      q1: "75g糖負荷試験の判定は？", o1: OGTT_IDS.map((k) => OGTT_LABEL[k]), a1: OGTT_IDS.indexOf(c.answer), s1Class: "ogttTypes",
      f: { question: c.followUp.question, options: c.followUp.options, answer: c.followUp.correct },
      lead: `判定：${OGTT_LABEL[c.answer]}（空腹時 ${c.glucose[0]}、2時間値 ${c.glucose[3]}）`, expl: c.explanation,
      miss: `${c.who}：空腹時 ${c.glucose[0]}、2時間値 ${c.glucose[3]} mg/dL${c.hba1c !== undefined ? `、HbA1c ${c.hba1c}%` : ""}。`,
    }));
  },
};
