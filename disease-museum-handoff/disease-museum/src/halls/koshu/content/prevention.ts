// 予防の3段階（共通ゲーム grid）。TODO(review)
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const preventionContent: GridData = {
  rowLabels: ["予防"],
  colLabels: ["一次予防", "二次予防", "三次予防"],
  cells: [
    { id: "p1", row: 0, col: 0, label: "一次", sub: "病気にならない" },
    { id: "p2", row: 0, col: 1, label: "二次", sub: "早く見つける" },
    { id: "p3", row: 0, col: 2, label: "三次", sub: "悪化・再発を防ぐ" },
  ],
  question: "どの予防？",
  stampAt: 5,
  cases: [
    { ...M, id: "vac", who: "地域", signs: ["子どもへのMRワクチン"], cell: "p1", explanation: "予防接種は一次予防（特異的予防）。" },
    { ...M, id: "smoke", who: "職場", signs: ["禁煙の指導"], cell: "p1", explanation: "健康増進・生活習慣の改善は一次予防。" },
    { ...M, id: "ca", who: "市町村", signs: ["大腸がん検診（便潜血検査）"], cell: "p2", explanation: "検診で早く見つけて早く治すのは二次予防。" },
    { ...M, id: "nbs", who: "新生児", signs: ["新生児マススクリーニング（先天性代謝異常）"], cell: "p2", explanation: "発症前に見つけて治療する二次予防。" },
    { ...M, id: "rehab", who: "病院", signs: ["心筋梗塞のあとの心臓リハビリテーション"], cell: "p3", explanation: "機能を回復し再発を防ぐのは三次予防。" },
    { ...M, id: "dm", who: "外来", signs: ["糖尿病の人の腎症を防ぐための血糖・血圧管理"], cell: "p3", explanation: "すでにある病気の合併症・悪化を防ぐ三次予防。" },
    { ...M, id: "salt", who: "地域", signs: ["減塩の食生活の教室"], cell: "p1", explanation: "一次予防。" },
  ],
};
