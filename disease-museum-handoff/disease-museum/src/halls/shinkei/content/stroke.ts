// 脳梗塞の病型（共通ゲーム grid）。TODO(review) 各症例の病型と再発予防
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const strokeContent: GridData = {
  rowLabels: ["脳梗塞"],
  colLabels: ["太い血管", "心臓から", "細い血管"],
  cells: [
    { id: "athero", row: 0, col: 0, label: "アテローム血栓性" },
    { id: "cardio", row: 0, col: 1, label: "心原性脳塞栓" },
    { id: "lacunar", row: 0, col: 2, label: "ラクナ梗塞" },
  ],
  question: "病型は？",
  treatQuestion: "再発予防の中心は？",
  treatments: ["抗血小板薬（必要なら頸動脈の治療）", "抗凝固薬（DOACやワルファリン）", "血圧の管理と抗血小板薬"],
  stampAt: 4,
  cases: [
    { ...M, id: "af", who: "78歳 女性", signs: ["心房細動", "日中に突然", "発症直後から症状が最も重い", "皮質を含む大きな梗塞"], cell: "cardio", treatment: 1,
      explanation: "心臓でできた血栓が飛ぶ。突然完成し、出血性梗塞になりやすい。再発予防は抗凝固薬。" },
    { ...M, id: "lacunar", who: "70歳 男性", signs: ["長年の高血圧", "右半身の脱力だけ", "失語・意識障害なし", "MRIで径15 mm未満の梗塞"], cell: "lacunar", treatment: 2,
      explanation: "穿通枝の細い血管が詰まる。純粋運動性片麻痺など。血圧の管理が最重要。" },
    { ...M, id: "carotid", who: "65歳 男性", signs: ["脂質異常症・喫煙", "一過性脳虚血発作をくり返していた", "階段状に悪くなる", "頸動脈に高度狭窄"], cell: "athero", treatment: 0,
      explanation: "太い血管の動脈硬化。TIAが前ぶれのことも。抗血小板薬、高度狭窄なら内膜剝離術やステント。" },
    { ...M, id: "af2", who: "82歳 男性", signs: ["動悸の既往", "朝、起きたら左半身麻痺と左半側空間無視", "心電図でRR間隔がばらばら"], cell: "cardio", treatment: 1,
      explanation: "心房細動による心原性脳塞栓。右中大脳動脈領域。" },
    { ...M, id: "thalamic", who: "68歳 女性", signs: ["高血圧・糖尿病", "左半身のしびれだけ", "視床に小さな梗塞"], cell: "lacunar", treatment: 2,
      explanation: "純粋感覚性脳卒中（視床のラクナ梗塞）。" },
    { ...M, id: "mca", who: "60歳 男性", signs: ["糖尿病・喫煙", "眠っている間に発症", "中大脳動脈の狭窄", "症状が数日で少しずつ進む"], cell: "athero", treatment: 0,
      explanation: "アテローム血栓性は安静時（睡眠中）に起こりやすく、段階的に進むことがある。" },
  ],
};
