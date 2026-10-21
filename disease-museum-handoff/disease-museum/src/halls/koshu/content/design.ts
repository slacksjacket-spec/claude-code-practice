// 研究デザイン（共通ゲーム grid）。架空の論文の要旨。TODO(review)
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const designContent: GridData = {
  rowLabels: ["観察研究", "介入・統合"],
  colLabels: ["", "", ""],
  cells: [
    { id: "cross", row: 0, col: 0, label: "横断研究" },
    { id: "cc", row: 0, col: 1, label: "症例対照研究" },
    { id: "cohort", row: 0, col: 2, label: "コホート研究" },
    { id: "rct", row: 1, col: 0, label: "ランダム化比較試験" },
    { id: "meta", row: 1, col: 1, label: "メタアナリシス" },
  ],
  question: "どの研究デザイン？",
  stampAt: 5,
  cases: [
    { ...M, id: "c1", who: "要旨", signs: ["ある日の健診受診者1万人", "睡眠時間と血圧を同時に調べた"], cell: "cross",
      explanation: "ある時点の調査。原因と結果の時間の前後がわからない。有病率がわかる。" },
    { ...M, id: "c2", who: "要旨", signs: ["まれな小児がんの子100人と、がんのない子200人", "妊娠中の母親の服薬を聞き取り"], cell: "cc",
      explanation: "結果から過去にさかのぼる。まれな病気に向く。思い出しバイアスに注意。オッズ比。" },
    { ...M, id: "c3", who: "要旨", signs: ["40歳の住民5,000人を登録", "飲酒量を調べて20年間追いかけ、肝癌の発症を比べた"], cell: "cohort",
      explanation: "曝露から結果へ前向きに追う。発症率と相対危険がわかる。時間とお金がかかる。" },
    { ...M, id: "c4", who: "要旨", signs: ["患者を無作為に2群に分けた", "片方に新薬、片方に偽薬", "二重盲検"], cell: "rct",
      explanation: "無作為化で、知られていない交絡因子まで両群でそろう。" },
    { ...M, id: "c5", who: "要旨", signs: ["同じテーマのRCT 15本を系統的に集めた", "結果を統計的に統合した"], cell: "meta",
      explanation: "エビデンスの階層の頂点。出版バイアスに注意（ファンネルプロット）。" },
    { ...M, id: "c6", who: "要旨", signs: ["過去のカルテから、30年前に放射線を浴びた作業員とそうでない作業員を特定", "その後の白血病の発症を比べた"], cell: "cohort",
      explanation: "過去にさかのぼって曝露群を決め、その後を追う後ろ向きコホート研究。" },
    { ...M, id: "c7", who: "要旨", signs: ["国ごとの1人あたり塩分摂取量と脳卒中死亡率を比べた"], cell: "cross",
      explanation: "集団単位の比較は生態学的研究（地域相関研究）。ここでは横断的な比較として分類。個人に当てはめると生態学的誤謬。" },
  ],
};
