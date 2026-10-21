// 骨折の影絵当て（共通ゲーム reveal）。X線の模式図（実際の画像ではない）。TODO(review) 描き方と解説
import type { RevealData } from "../../../engine/games/reveal.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const BG = "#14161C", B = "#E8E4D8";
const frame = (inner: string) => `<svg viewBox="0 0 200 240" role="img" aria-label="X線の模式図"><rect width="200" height="240" fill="${BG}"/>${inner}</svg>`;

export const fractureContent: RevealData = {
  levels: [14, 9, 5, 2, 0],
  roundSize: 6,
  stampAt: 4,
  distractors: ["Smith骨折", "距骨骨折"],
  items: [
    { ...M, id: "clavicle", answer: "鎖骨骨折", caption: "肩の正面像",
      svg: frame(`<path d="M20 110 C50 90 80 100 96 112" stroke="${B}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M104 104 C130 90 160 96 184 120" stroke="${B}" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="170" cy="160" r="30" fill="${B}" opacity=".6"/><path d="M60 140 L60 230" stroke="${B}" stroke-width="10" opacity=".5"/>`),
      explanation: "中央1/3で多い。内側の骨片は胸鎖乳突筋で上へ引かれる。多くは保存療法（鎖骨バンド）。" },
    { ...M, id: "colles", answer: "Colles骨折", caption: "手首の側面像（左が手の甲側）",
      svg: frame(`<path d="M100 10 L100 150" stroke="${B}" stroke-width="20"/><path d="M100 150 L80 172 L84 200" stroke="${B}" stroke-width="20" fill="none" stroke-linejoin="round"/><rect x="64" y="200" width="40" height="30" rx="8" fill="${B}" opacity=".8"/>`),
      explanation: "高齢女性が手をついて転ぶ。橈骨遠位端の骨片が手の甲側にずれてフォーク状変形。骨粗鬆症のしるし。" },
    { ...M, id: "femneck", answer: "大腿骨頸部骨折", caption: "股関節の正面像",
      svg: frame(`<path d="M10 40 C60 30 90 60 90 100" stroke="${B}" stroke-width="14" fill="none"/><circle cx="110" cy="96" r="22" fill="${B}"/><path d="M122 110 L134 122" stroke="${BG}" stroke-width="5"/><path d="M136 120 L160 140 L170 230" stroke="${B}" stroke-width="24" fill="none" stroke-linejoin="round"/>`),
      explanation: "高齢者の転倒。下肢は短縮して外旋。関節内骨折で骨頭への血流が絶たれやすく、ずれが大きければ人工骨頭。早期の手術と離床。" },
    { ...M, id: "supracondylar", answer: "上腕骨顆上骨折", caption: "小児の肘の側面像",
      svg: frame(`<path d="M100 10 L100 140" stroke="${B}" stroke-width="22"/><path d="M84 150 C80 170 96 186 112 180 L118 156Z" fill="${B}"/><path d="M110 184 L150 230" stroke="${B}" stroke-width="14"/><path d="M100 182 L80 230" stroke="${B}" stroke-width="14"/><path d="M90 140 L114 146" stroke="${BG}" stroke-width="4"/>`),
      explanation: "小児で最も多い肘の骨折。遠位の骨片が後ろへずれる（伸展型）。神経・血管損傷とコンパートメント症候群に注意。" },
    { ...M, id: "compression", answer: "脊椎圧迫骨折", caption: "胸腰椎の側面像",
      svg: frame(`${[20, 70, 120, 170].map((y, i) => i === 2 ? `<path d="M70 ${y} L130 ${y + 10} L130 ${y + 38} L70 ${y + 38}Z" fill="${B}"/>` : `<rect x="70" y="${y}" width="60" height="38" rx="4" fill="${B}"/>`).join("")}`),
      explanation: "前のほうがつぶれて楔形。骨粗鬆症の高齢者で、尻もちや何もしなくても起こる。" },
    { ...M, id: "greenstick", answer: "若木骨折", caption: "小児の前腕の正面像",
      svg: frame(`<path d="M80 10 C70 80 70 120 82 230" stroke="${B}" stroke-width="16" fill="none"/><path d="M120 10 C130 80 132 120 118 230" stroke="${B}" stroke-width="16" fill="none"/><path d="M124 100 L136 108" stroke="${BG}" stroke-width="4"/>`),
      explanation: "小児の骨は柔らかく骨膜が厚いので、片側だけ折れて曲がる。" },
  ],
};
