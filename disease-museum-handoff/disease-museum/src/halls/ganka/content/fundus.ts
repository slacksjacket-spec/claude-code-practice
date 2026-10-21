// 眼底の影絵当て（共通ゲーム reveal）。模式図。TODO(review) 各所見の描き方と解説
import type { RevealData } from "../../../engine/games/reveal.schema";

const M = { review: "draft" as const, sources: [] as string[] };
/** 眼底の基本：橙色の背景、視神経乳頭（左寄り）、黄斑（中央）、血管 */
const base = (extra: string, disc = `<circle cx="70" cy="120" r="18" fill="#FFE2A8"/><circle cx="70" cy="120" r="7" fill="#FFF6DC"/>`, vessels = true, bg = "#D9622B") =>
  `<svg viewBox="0 0 200 240" role="img" aria-label="眼底の模式図"><rect width="200" height="240" fill="#111"/><circle cx="100" cy="120" r="96" fill="${bg}"/>
  <circle cx="125" cy="120" r="10" fill="#A8401C"/>
  ${vessels ? `<path d="M70 110 C90 70 130 50 170 54 M70 112 C100 90 140 86 180 96 M70 130 C90 170 130 190 170 186 M70 128 C100 150 140 154 180 144" stroke="#9A1A12" stroke-width="3" fill="none"/>
  <path d="M70 108 C88 74 126 58 168 64 M70 132 C88 166 126 182 168 176" stroke="#C83020" stroke-width="2" fill="none"/>` : ""}
  ${disc}${extra}</svg>`;

export const fundusContent: RevealData = {
  levels: [14, 9, 5, 2, 0],
  roundSize: 6,
  stampAt: 4,
  distractors: ["網膜色素変性症", "網膜剝離"],
  items: [
    { ...M, id: "normal", answer: "正常な眼底", caption: "眼底（右眼）", svg: base(""), explanation: "乳頭は境界くっきり、陥凹は小さい。黄斑は乳頭の耳側。" },
    { ...M, id: "glaucoma", answer: "緑内障（乳頭陥凹の拡大）", caption: "眼底（右眼）", svg: base("", `<circle cx="70" cy="120" r="18" fill="#FFE2A8"/><circle cx="70" cy="120" r="14" fill="#FFF8E8"/>`),
      explanation: "乳頭の中のくぼみ（陥凹）が大きい。視神経線維が減っている。視野欠損はゆっくり進む。" },
    { ...M, id: "papilledema", answer: "うっ血乳頭", caption: "眼底（右眼）", svg: base(`${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => `<path d="M${70 + 18 * Math.cos((a * Math.PI) / 180)} ${120 + 18 * Math.sin((a * Math.PI) / 180)} l${8 * Math.cos((a * Math.PI) / 180)} ${8 * Math.sin((a * Math.PI) / 180)}" stroke="#C83020" stroke-width="2"/>`).join("")}`, `<circle cx="70" cy="120" r="24" fill="#F7D08A" opacity=".9"/><circle cx="70" cy="120" r="20" fill="#FFE2A8"/>`),
      explanation: "乳頭が腫れて境界がぼやけ、周りに出血。頭蓋内圧亢進。両眼性。" },
    { ...M, id: "crao", answer: "網膜中心動脈閉塞症", caption: "眼底（右眼）", svg: base(`<circle cx="125" cy="120" r="9" fill="#C81818"/>`, undefined, true, "#F0E4DA"),
      explanation: "網膜が白くむくみ、黄斑だけ赤く見える（cherry-red spot）。突然の無痛性の視力低下。" },
    { ...M, id: "crvo", answer: "網膜中心静脈閉塞症", caption: "眼底（右眼）", svg: base(Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2, r = 30 + (i % 5) * 12; return `<path d="M${70 + r * Math.cos(a)} ${120 + r * Math.sin(a)} l${6 * Math.cos(a)} ${6 * Math.sin(a)}" stroke="#7A0A0A" stroke-width="5" stroke-linecap="round"/>`; }).join("")),
      explanation: "静脈が曲がりくねって太く、炎のような出血が全体に。高血圧や動脈硬化が背景。黄斑浮腫には抗VEGF薬。" },
    { ...M, id: "dr", answer: "糖尿病網膜症", caption: "眼底（右眼）", svg: base(`${[[110, 90], [140, 150], [90, 160], [150, 100], [120, 170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#7A0A0A"/>`).join("")}${[[100, 100], [135, 135], [150, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#FFF0A0"/>`).join("")}<ellipse cx="110" cy="70" rx="9" ry="6" fill="#F4F0E8" opacity=".9"/>`),
      explanation: "点状・しみ状出血、硬性白斑（黄色）、軟性白斑（白い綿花）。新生血管が出れば増殖網膜症で光凝固。" },
    { ...M, id: "amd", answer: "加齢黄斑変性", caption: "眼底（右眼）", svg: base(`<circle cx="125" cy="120" r="18" fill="#6A4A30"/><circle cx="125" cy="120" r="24" fill="none" stroke="#7A0A0A" stroke-width="5"/>`),
      explanation: "黄斑の下に新生血管と出血。ゆがんで見える（変視症）、中心が見えない。滲出型は抗VEGF薬。" },
  ],
};
