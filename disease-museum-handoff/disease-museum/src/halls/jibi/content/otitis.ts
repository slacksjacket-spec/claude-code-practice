// 中耳炎のマス（共通ゲーム grid）。TODO(review) 分類と治療
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const otitisContent: GridData = {
  rowLabels: ["鼓膜が赤く腫れる", "鼓膜の奥に液体", "鼓膜に穴・耳だれ"],
  colLabels: ["痛い・熱", "痛くない"],
  cells: [
    { id: "aom", row: 0, col: 0, label: "急性中耳炎" },
    { id: "ome", row: 1, col: 1, label: "滲出性中耳炎" },
    { id: "com", row: 2, col: 1, label: "慢性中耳炎" },
  ],
  question: "どのマス？",
  treatQuestion: "対応は？",
  treatments: ["軽ければ経過観察、中等症以上はアモキシシリン", "経過観察、長引けば鼓膜チューブ（大人の片側なら上咽頭を調べる）", "耳だれを抑え、鼓室形成術"],
  stampAt: 4,
  cases: [
    { ...M, id: "aom", who: "2歳 男児", signs: ["保育園", "かぜのあと、夜に耳を痛がって泣く", "39℃", "鼓膜が赤く膨らむ"], cell: "aom", treatment: 0,
      explanation: "原因は肺炎球菌・インフルエンザ菌・モラクセラ。重症なら鼓膜切開。" },
    { ...M, id: "ome", who: "5歳 女児", signs: ["急性中耳炎のあと", "聞こえにくい", "痛みなし", "鼓膜の奥に液面"], cell: "ome", treatment: 1,
      explanation: "3か月以上続き聞こえが悪ければチューブ。アデノイドの肥大も原因。" },
    { ...M, id: "npc", who: "60歳 男性", signs: ["片耳だけ詰まった感じ", "痛みなし", "首のしこり", "鼓膜の奥に液"], cell: "ome", treatment: 1,
      explanation: "大人の片側の滲出性中耳炎は上咽頭癌（EBウイルス）を必ず疑い、上咽頭を内視鏡で見る。" },
    { ...M, id: "com", who: "55歳 女性", signs: ["長年の耳だれ", "痛みなし", "鼓膜に大きな穴", "伝音難聴"], cell: "com", treatment: 2,
      explanation: "慢性化膿性中耳炎。乾燥させてから手術。" },
    { ...M, id: "aom2", who: "1歳 女児", signs: ["発熱", "耳をさわる", "不機嫌", "鼓膜の発赤と膨隆"], cell: "aom", treatment: 0,
      explanation: "乳児の発熱では鼓膜も見る。" },
  ],
};
