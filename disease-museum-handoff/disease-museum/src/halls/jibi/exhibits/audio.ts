// オージオグラム：純音聴力検査の結果を読んで、難聴の型（12）→ 原因や対応（12）
import "./audio.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { AudioData } from "./audio.schema";
import { AIR_F, BONE_F, HL_LABEL, type HlType } from "./audio.consts";
import { esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

const HL_IDS = Object.keys(HL_LABEL) as HlType[];
const W = 340, H = 300, L = 40, R = 324, T = 26, B = 284;
const x = (f: number) => L + (Math.log2(f / 125) / 6) * (R - L);
const y = (db: number) => T + ((db + 10) / 130) * (B - T);

function chart(c: AudioData["cases"][number]) {
  const right = c.ear === "R", col = right ? "#E0303A" : "#3D5AFE";
  const mark = (f: number, v: number) => right ? `<circle cx="${x(f)}" cy="${y(v)}" r="5" fill="#fff" stroke="${col}" stroke-width="2.5"/>` : `<path d="M${x(f) - 5} ${y(v) - 5} l10 10 m0 -10 l-10 10" stroke="${col}" stroke-width="2.5"/>`;
  const bmark = (f: number, v: number) => right ? `<path d="M${x(f) - 4} ${y(v) - 7} h-5 v14 h5" stroke="${col}" stroke-width="2.5" fill="none"/>` : `<path d="M${x(f) + 4} ${y(v) - 7} h5 v14 h-5" stroke="${col}" stroke-width="2.5" fill="none"/>`;
  return `<svg class="audioSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${right ? "右" : "左"}耳のオージオグラム。気導 ${c.air.join("、")} dB、骨導 ${c.bone.join("、")} dB">
    <rect x="${L}" y="${y(-10)}" width="${R - L}" height="${y(25) - y(-10)}" fill="#E7F7EF"/>
    ${AIR_F.map((f) => `<line x1="${x(f)}" x2="${x(f)}" y1="${T}" y2="${B}" stroke="#E0D8EC"/><text x="${x(f)}" y="${T - 8}" font-size="9" text-anchor="middle">${f >= 1000 ? `${f / 1000}k` : f}</text>`).join("")}
    ${Array.from({ length: 14 }, (_, i) => i * 10 - 10).map((db) => `<line x1="${L}" x2="${R}" y1="${y(db)}" y2="${y(db)}" stroke="${db === 0 ? "#9A8EB8" : "#E0D8EC"}"/>${db % 20 === 0 ? `<text x="${L - 4}" y="${y(db) + 3}" font-size="9" text-anchor="end">${db}</text>` : ""}`).join("")}
    <polyline points="${AIR_F.map((f, i) => `${x(f)},${y(c.air[i])}`).join(" ")}" fill="none" stroke="${col}" stroke-width="2"/>
    ${AIR_F.map((f, i) => mark(f, c.air[i])).join("")}${BONE_F.map((f, i) => bmark(f, c.bone[i])).join("")}
    <text x="${R}" y="${B - 6}" font-size="9" text-anchor="end">${right ? "○ 右・気導　［ 右・骨導" : "× 左・気導　］ 左・骨導"}　縦軸 dB（下ほど聞こえない）</text>
  </svg>`;
}

export const audiogram: CustomModule<AudioData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => ({
      head: `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>${chart(c)}`,
      q1: "聴力の型は？", o1: HL_IDS.map((k) => HL_LABEL[k]), a1: HL_IDS.indexOf(c.answer), s1Class: "hlTypes",
      f: c.followUp, lead: `型：${HL_LABEL[c.answer]}`, expl: c.explanation, miss: `${c.story}（${HL_LABEL[c.answer]}）`,
    }));
  },
};
