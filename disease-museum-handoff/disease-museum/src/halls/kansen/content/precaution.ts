// 感染経路別予防策（共通ゲーム grid）。TODO(review) 各病原体の予防策
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const precautionContent: GridData = {
  rowLabels: ["標準予防策に加えて"],
  colLabels: ["接触", "飛沫", "空気"],
  cells: [
    { id: "contact", row: 0, col: 0, label: "接触予防策", sub: "手袋・ガウン" },
    { id: "droplet", row: 0, col: 1, label: "飛沫予防策", sub: "サージカルマスク" },
    { id: "airborne", row: 0, col: 2, label: "空気予防策", sub: "陰圧個室・N95" },
  ],
  question: "どの予防策を加える？",
  stampAt: 5,
  cases: [
    { ...M, id: "tb", who: "70歳 男性", signs: ["喀痰の抗酸菌塗抹 陽性", "肺結核"], cell: "airborne",
      explanation: "結核は空気感染。陰圧個室、入室者はN95マスク。患者が部屋を出るときはサージカルマスク。" },
    { ...M, id: "measles", who: "3歳 男児", signs: ["高熱", "Koplik斑", "全身の発疹"], cell: "airborne",
      explanation: "麻疹は空気感染。免疫のない職員は担当しない。" },
    { ...M, id: "vzv", who: "6歳 女児", signs: ["水痘（いろいろな段階の水疱）"], cell: "airborne",
      explanation: "水痘・播種性帯状疱疹は空気感染（＋接触）。" },
    { ...M, id: "flu", who: "80歳 女性", signs: ["インフルエンザ迅速検査 陽性"], cell: "droplet",
      explanation: "インフルエンザは飛沫感染。1〜2 m以内でサージカルマスク。" },
    { ...M, id: "pertussis", who: "2か月 乳児", signs: ["けいれん性の咳発作", "百日咳"], cell: "droplet",
      explanation: "百日咳、髄膜炎菌、マイコプラズマ、風疹も飛沫予防策。" },
    { ...M, id: "cdi", who: "75歳 男性", signs: ["抗菌薬のあとの下痢", "CDトキシン陽性"], cell: "contact",
      explanation: "C. difficileは芽胞を作り、アルコールが効かない。流水と石けんで手洗い。" },
    { ...M, id: "mrsa", who: "60歳 女性", signs: ["創部からMRSA"], cell: "contact",
      explanation: "MRSAなどの耐性菌は接触予防策。" },
    { ...M, id: "noro", who: "85歳 女性（施設）", signs: ["嘔吐と下痢", "ノロウイルス"], cell: "contact",
      explanation: "ノロウイルスは接触予防策。アルコールが効きにくく、次亜塩素酸ナトリウムで消毒。吐物の処理ではしぶきに注意。" },
  ],
};
