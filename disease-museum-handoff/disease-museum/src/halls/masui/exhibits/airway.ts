// Mallampati分類：口を大きく開けて舌を出した絵から分類を当て（12）、気道の評価や対応を答える（12）
import "./masui.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { AirwayData } from "./airway.schema";
import { esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

const CLS = ["I", "II", "III", "IV"];
const SEEN = ["", "軟口蓋・口峡・口蓋垂・口蓋弓が見える", "軟口蓋・口峡・口蓋垂が見える", "軟口蓋と口蓋垂の根元だけ見える", "硬口蓋しか見えない"];
/** 舌の上端の高さで、奥がどこまで見えるかが変わる */
function mouth(cls: number) {
  const tongueTop = [0, 168, 138, 112, 66][cls];
  return `<svg class="mouth" viewBox="0 0 240 220" role="img" aria-label="口を開けて舌を出したところ（模式）">
    <ellipse cx="120" cy="110" rx="96" ry="92" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
    <ellipse cx="120" cy="116" rx="70" ry="80" fill="#5A1A24" stroke="#1C1537" stroke-width="3"/>
    <path d="M56 70 Q120 22 184 70 L176 80 Q120 40 64 80Z" fill="#F2B8B8"/>
    <path d="M64 80 Q120 50 176 80 L170 100 Q120 76 70 100Z" fill="#E89AA0"/>
    ${cls === 1 ? `<path d="M70 100 Q74 150 84 186 M170 100 Q166 150 156 186" stroke="#C86A78" stroke-width="7" fill="none"/>
    <path d="M86 104 Q90 150 96 186 M154 104 Q150 150 144 186" stroke="#B05A68" stroke-width="5" fill="none"/>` : ""}
    <path d="M114 78 Q120 74 126 78 L124 118 Q120 128 116 118Z" fill="#E87A88" stroke="#B05A68" stroke-width="2"/>
    <path d="M44 ${tongueTop + 40} Q120 ${tongueTop - 30} 196 ${tongueTop + 40} L196 220 L44 220Z" fill="#F08A94" stroke="#1C1537" stroke-width="3"/>
    <path d="M120 ${tongueTop + 10} L120 ${tongueTop + 60}" stroke="#D86A78" stroke-width="2"/>
    ${[[70, 20], [94, 14], [120, 12], [146, 14], [170, 20]].map(([x, y]) => `<rect x="${x - 9}" y="${y + 8}" width="18" height="16" rx="4" fill="#fff" stroke="#1C1537" stroke-width="2"/>`).join("")}
  </svg>`;
}

export const mallampati: CustomModule<AirwayData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => ({
      head: `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>${mouth(c.cls)}`,
      q1: "Mallampati分類は？（座って口を大きく開け、舌を出し、声は出さない）", o1: CLS.map((k) => `クラス${k}`), a1: c.cls - 1, s1Class: "classes",
      f: c.followUp, lead: `クラス${CLS[c.cls - 1]}：${SEEN[c.cls]}`, expl: c.explanation,
      miss: c.story, miss1: `口を開けると「${SEEN[c.cls]}」。Mallampati分類は？`, next: "次の患者",
    }));
  },
};
