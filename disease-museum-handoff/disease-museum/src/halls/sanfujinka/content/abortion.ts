// 流産のマス（共通ゲーム grid）。TODO(review) 分類と対応
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const abortionContent: GridData = {
  rowLabels: ["子宮口 閉じている", "子宮口 開いている"],
  colLabels: ["胎児は生きている", "胎児は亡くなっている", "一部が出た", "全部出た"],
  cells: [
    { id: "threat", row: 0, col: 0, label: "切迫流産" },
    { id: "missed", row: 0, col: 1, label: "稽留流産" },
    { id: "complete", row: 0, col: 3, label: "完全流産" },
    { id: "inevitable", row: 1, col: 1, label: "進行流産" },
    { id: "incomplete", row: 1, col: 2, label: "不全流産" },
  ],
  question: "どの流産？",
  treatQuestion: "対応は？",
  treatments: ["経過観察（安静）", "子宮内容除去術（または待機・薬）", "処置は不要。経過観察"],
  stampAt: 4,
  cases: [
    { ...M, id: "threat", who: "8週", signs: ["少量の出血", "子宮口は閉じている", "胎児心拍あり"], cell: "threat", treatment: 0,
      explanation: "流産しかかっているが、まだ続けられる状態。初期の流産の多くは染色体異常で、安静で防げるわけではない。" },
    { ...M, id: "missed", who: "10週", signs: ["症状なし", "健診で胎児心拍が見えない", "子宮口は閉じている"], cell: "missed", treatment: 1,
      explanation: "胎児が亡くなって子宮内にとどまっている。" },
    { ...M, id: "inevitable", who: "9週", signs: ["出血が増え、下腹部が痛い", "子宮口が開いている"], cell: "inevitable", treatment: 1,
      explanation: "子宮口が開き、流産が止められない状態。" },
    { ...M, id: "incomplete", who: "11週", signs: ["組織のかたまりが出た", "まだ出血が続く", "子宮内に残りがある"], cell: "incomplete", treatment: 1,
      explanation: "一部が残っているので出血が続く。" },
    { ...M, id: "complete", who: "7週", signs: ["かたまりが出たあと出血がおさまった", "子宮内は空", "子宮口は閉じた"], cell: "complete", treatment: 2,
      explanation: "全部出て子宮が戻った。経過観察。" },
    { ...M, id: "threat2", who: "12週", signs: ["軽い下腹部の張り", "出血少量", "胎児心拍あり", "子宮口は閉じている"], cell: "threat", treatment: 0,
      explanation: "切迫流産。胎児心拍が確認できれば、多くはそのまま続く。" },
  ],
};
