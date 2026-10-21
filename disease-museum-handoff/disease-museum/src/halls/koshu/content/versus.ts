// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "cohort-cc", title: "コホート研究 vs 症例対照研究",
      a: { name: "コホート研究", color: "mint", traits: ["曝露から結果へ", "相対危険", "時間がかかる"] },
      b: { name: "症例対照研究", color: "pink", traits: ["結果から曝露へ", "オッズ比", "まれな病気"] },
      clues: [
        { text: "発症率（罹患率）が直接計算できる", side: "a" },
        { text: "まれな病気の原因を探すのに向く", side: "b" },
        { text: "思い出しバイアスが入りやすい", side: "b" },
        { text: "まれな曝露（特殊な職業）の影響を見るのに向く", side: "a" },
        { text: "1つの曝露から複数の病気を調べられる", side: "a" },
        { text: "少ない人数・短い期間で実施できる", side: "b" },
      ] },
    { ...M, id: "sens-spec", title: "感度 vs 特異度",
      a: { name: "感度", color: "tomato", traits: ["病気の人を陽性に", "SnNout", "スクリーニング"] },
      b: { name: "特異度", color: "cobalt", traits: ["病気でない人を陰性に", "SpPin", "確定診断"] },
      clues: [
        { text: "高いと偽陰性が少ない", side: "a" },
        { text: "高いと偽陽性が少ない", side: "b" },
        { text: "高い検査で陰性なら病気を除外しやすい", side: "a" },
        { text: "高い検査で陽性なら病気を確定しやすい", side: "b" },
        { text: "ROC曲線の縦軸", side: "a" },
        { text: "ROC曲線の横軸は「1 − これ」", side: "b" },
      ] },
  ],
};
