// 血管炎の大きさ分類（共通ゲーム grid）。TODO(review) 各疾患の分類
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const vasculitisContent: GridData = {
  rowLabels: ["血管炎"],
  colLabels: ["大型", "中型", "小型", "小型"],
  cells: [
    { id: "large", row: 0, col: 0, label: "大型", sub: "大動脈と枝" },
    { id: "medium", row: 0, col: 1, label: "中型", sub: "臓器の動脈" },
    { id: "anca", row: 0, col: 2, label: "ANCA関連" },
    { id: "ic", row: 0, col: 3, label: "免疫複合体" },
  ],
  question: "血管炎の大きさは？",
  stampAt: 5,
  cases: [
    { ...M, id: "takayasu", who: "25歳 女性", signs: ["左右の腕で血圧が違う", "脈が触れにくい", "微熱"], cell: "large",
      explanation: "高安動脈炎。若い女性。大動脈弓の枝の狭窄。" },
    { ...M, id: "gca", who: "75歳 女性", signs: ["こめかみの痛み", "噛むとあごが疲れる", "急な視力低下"], cell: "large",
      explanation: "巨細胞性動脈炎。高齢者。失明を防ぐため、疑ったらすぐステロイド。" },
    { ...M, id: "pan", who: "55歳 男性", signs: ["B型肝炎", "高血圧と腎梗塞", "多発単神経炎", "腹部の血管に小さな瘤"], cell: "medium",
      explanation: "結節性多発動脈炎。ANCA陰性。糸球体腎炎は起こさない。" },
    { ...M, id: "kawasaki", who: "2歳 男児", signs: ["5日以上の発熱", "いちご舌", "手足の硬いむくみ", "冠動脈瘤"], cell: "medium",
      explanation: "川崎病。中型血管炎で冠動脈瘤が問題。" },
    { ...M, id: "gpa", who: "45歳 男性", signs: ["鼻出血と鞍鼻", "肺の空洞", "血尿", "PR3-ANCA陽性"], cell: "anca",
      explanation: "多発血管炎性肉芽腫症。上気道・肺・腎の3つ。" },
    { ...M, id: "egpa", who: "50歳 女性", signs: ["喘息", "好酸球増多", "しびれ（多発単神経炎）"], cell: "anca",
      explanation: "好酸球性多発血管炎性肉芽腫症。MPO-ANCAが陽性になることがある。" },
    { ...M, id: "iga", who: "6歳 男児", signs: ["かぜのあと", "足の触れる紫斑", "腹痛", "関節痛"], cell: "ic",
      explanation: "IgA血管炎（Henoch-Schönlein紫斑病）。血小板は正常。腎炎の合併に注意。" },
  ],
};
