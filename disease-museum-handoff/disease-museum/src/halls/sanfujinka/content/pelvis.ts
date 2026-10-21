// 骨盤の中のどこ？（共通ゲーム tapMap）。図は模式。TODO(review)
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const svg = `<rect width="320" height="260" fill="#FFF6F2"/>
  <path d="M120 70 C120 40 200 40 200 70 L196 150 C194 170 180 176 172 180 L172 214 L148 214 L148 180 C140 176 126 170 124 150Z" fill="#F7C6C0" stroke="#1C1537" stroke-width="3"/>
  <path d="M138 70 C138 56 182 56 182 70 L178 140 C176 156 144 156 142 140Z" fill="#FBE4E0"/>
  <path d="M122 72 C100 60 80 60 60 76 C52 82 46 92 40 96" stroke="#E8A0A0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M198 72 C220 60 240 60 260 76 C268 82 274 92 280 96" stroke="#E8A0A0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="56" cy="120" rx="22" ry="14" fill="#FFE1C8" stroke="#1C1537" stroke-width="3"/><ellipse cx="264" cy="120" rx="22" ry="14" fill="#FFE1C8" stroke="#1C1537" stroke-width="3"/>
  <path d="M148 214 L148 250 M172 214 L172 250" stroke="#1C1537" stroke-width="3"/>
  <text x="160" y="36" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">正面から見た模式図</text>`;

export const pelvisContent: TapMapData = {
  question: "どこの病気？",
  stampAt: 4,
  figures: {
    pelvis: { viewBox: "0 0 320 260", ariaLabel: "子宮と付属器の模式図", svg, note: "点線の場所をタップ（卵管は右、卵巣は左に代表して示す）。ダグラス窩は子宮の後ろのくぼみ",
      regions: [
        { id: "body", label: "子宮体部", shape: `<path d="M126 74 C126 48 194 48 194 74 L190 146 C188 162 132 162 130 146Z"/>` },
        { id: "cervix", label: "子宮頸部", shape: `<rect x="146" y="170" width="28" height="44" rx="8"/>` },
        { id: "tube", label: "卵管", shape: `<path d="M196 64 C222 52 246 54 266 70 L284 92 L272 104 L254 84 C238 72 222 72 200 82Z"/>` },
        { id: "ovary", label: "卵巣", shape: `<ellipse cx="56" cy="120" rx="26" ry="18"/>` },
        { id: "douglas", label: "ダグラス窩", shape: `<ellipse cx="160" cy="236" rx="40" ry="14"/>` },
      ] },
  },
  cases: [
    { ...M, id: "cxca", figure: "pelvis", prompt: "35歳 女性。性交後の出血。HPV 16型陽性。", answer: ["cervix"],
      followUp: { question: "この癌で多い組織型は？", options: ["扁平上皮癌", "類内膜癌", "漿液性癌", "明細胞癌"], answer: 0 },
      explanation: "子宮頸癌。扁平円柱上皮境界（移行帯）から。HPVワクチンで予防。" },
    { ...M, id: "endo", figure: "pelvis", prompt: "58歳 女性。閉経後の不正出血。肥満、糖尿病、出産経験なし。", answer: ["body"],
      followUp: { question: "危険因子の共通点は？", options: ["エストロゲンにさらされる時間が長い", "HPV感染", "喫煙", "多産"], answer: 0 },
      explanation: "子宮体癌（類内膜癌）。エストロゲン依存性。内膜細胞診や組織診で。" },
    { ...M, id: "ectopic", figure: "pelvis", prompt: "28歳 女性。最終月経から7週。妊娠反応陽性だが子宮内に胎嚢がない。", answer: ["tube"],
      followUp: { question: "異所性妊娠の最多の部位は？", options: ["卵管膨大部", "卵巣", "子宮頸部", "腹腔"], answer: 0 },
      explanation: "異所性妊娠の多くは卵管（膨大部）。クラミジア感染や手術歴が危険因子。" },
    { ...M, id: "chocolate", figure: "pelvis", prompt: "32歳 女性。だんだん強くなる月経痛と不妊。エコーで内部が均一な嚢胞。", answer: ["ovary"],
      followUp: { question: "この嚢胞の名前は？", options: ["チョコレート嚢胞（子宮内膜症性嚢胞）", "皮様嚢腫", "漿液性嚢胞腺腫", "黄体嚢胞"], answer: 0 },
      explanation: "子宮内膜症で古い血液がたまる。まれに癌化（明細胞癌・類内膜癌）。" },
    { ...M, id: "dyspareunia", figure: "pelvis", prompt: "30歳 女性。性交痛と排便痛。内診で子宮の後ろに硬い結節。", answer: ["douglas"],
      followUp: { question: "考えるのは？", options: ["子宮内膜症（ダグラス窩の病変）", "子宮頸癌", "子宮筋腫", "卵巣過剰刺激症候群"], answer: 0 },
      explanation: "子宮内膜症はダグラス窩に癒着や結節をつくり、子宮は後屈して動きにくくなる。" },
    { ...M, id: "myoma", figure: "pelvis", prompt: "45歳 女性。月経量が多く貧血。子宮が大きくでこぼこ。", answer: ["body"],
      followUp: { question: "考えるのは？", options: ["子宮筋腫", "子宮頸癌", "卵巣癌", "異所性妊娠"], answer: 0 },
      explanation: "子宮筋腫は平滑筋の良性腫瘍。粘膜下筋腫は小さくても過多月経。" },
  ],
};
