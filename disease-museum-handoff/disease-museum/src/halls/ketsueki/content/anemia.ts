// 貧血のマス（共通ゲーム grid）。TODO(review) 各症例の分類と治療
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const anemiaContent: GridData = {
  rowLabels: ["網赤血球 増加", "網赤血球 増えない"],
  colLabels: ["小球性", "正球性", "大球性"],
  cells: [
    { id: "hemo", row: 0, col: 1, label: "溶血・急な出血" },
    { id: "micro", row: 1, col: 0, label: "鉄が使えない", sub: "鉄欠乏・慢性炎症・サラセミア" },
    { id: "normo", row: 1, col: 1, label: "作れない", sub: "再生不良性・腎性" },
    { id: "macro", row: 1, col: 2, label: "DNAが作れない", sub: "B₁₂・葉酸欠乏・MDS" },
  ],
  question: "MCV と網赤血球から、どのマス？",
  treatQuestion: "治療は？",
  treatments: ["鉄剤", "ビタミンB₁₂の筋注", "エリスロポエチン製剤", "免疫抑制療法（ATG＋シクロスポリン）", "副腎皮質ステロイド", "原因の治療と輸血を検討"],
  stampAt: 4,
  cases: [
    { ...M, id: "ida", who: "38歳 女性", signs: ["過多月経", "スプーン状の爪", "MCV 68", "フェリチン 4"], cell: "micro", treatment: 0,
      explanation: "鉄欠乏性貧血。フェリチン低値、TIBC上昇。原因（子宮筋腫や消化管出血）も探す。" },
    { ...M, id: "pa", who: "65歳 女性", signs: ["舌の痛み（Hunter舌炎）", "MCV 118", "抗内因子抗体陽性"], cell: "macro", treatment: 1,
      explanation: "悪性貧血。内因子がなくて吸収できないので、B₁₂は筋注で。" },
    { ...M, id: "ckd", who: "70歳 男性", signs: ["透析中", "MCV 90", "エリスロポエチン 低め"], cell: "normo", treatment: 2,
      explanation: "腎臓がエリスロポエチンを作れない腎性貧血。" },
    { ...M, id: "aa", who: "25歳 男性", signs: ["あざ・歯ぐきの出血", "汎血球減少", "骨髄が脂肪だらけ"], cell: "normo", treatment: 3,
      explanation: "再生不良性貧血。若ければ骨髄移植も。" },
    { ...M, id: "aiha", who: "45歳 女性", signs: ["黄疸", "LDH高値・ハプトグロビン低値", "直接クームス陽性", "MCV 98"], cell: "hemo", treatment: 4,
      explanation: "自己免疫性溶血性貧血（温式）。網赤血球が増えて、MCVはやや大きめになることも。" },
    { ...M, id: "acd", who: "60歳 女性", signs: ["関節リウマチ", "MCV 78", "フェリチン 高め", "血清鉄 低い"], cell: "micro", treatment: 5,
      explanation: "慢性炎症に伴う貧血。ヘプシジンで鉄が閉じ込められる。鉄はあるので鉄剤は効きにくい。" },
    { ...M, id: "mds", who: "78歳 男性", signs: ["ゆっくり進む貧血", "MCV 108", "B₁₂・葉酸 正常", "骨髄に異形成"], cell: "macro", treatment: 5,
      explanation: "骨髄異形成症候群。高齢者の大球性貧血でビタミンが足りていれば考える。" },
  ],
};
