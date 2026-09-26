// キャリパー計測。TODO(review) 判定の境界値（徐脈・頻脈、PR、QRS、QT）は教科書的な目安を記憶から書いた
import type { CalipersData } from "../exhibits/calipers.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const calipersContent: CalipersData = {
  stampAt: 4,
  tasks: [
    { ...M, kind: "hr", prompt: "RR間隔を測って心拍数を出そう（となりのQRSの頂点 → 頂点）", tolerance: 0.04, values: [42, 75, 125],
      categories: [{ label: "徐脈（50/分未満）", max: 50 }, { label: "正常（50〜100/分）", min: 50, max: 100 }, { label: "頻脈（100/分以上）", min: 100 }],
      explanation: "心拍数＝60÷RR間隔（秒）。大きいマスで数えるなら 300÷（RRの大きいマスの数）。" },
    { ...M, kind: "pr", prompt: "PR間隔を測ろう（P波の始まり → QRSの始まり）", tolerance: 0.03, values: [0.1, 0.16, 0.28],
      categories: [{ label: "短い（0.12秒未満）", max: 0.12 }, { label: "正常（0.12〜0.20秒）", min: 0.12, max: 0.2 }, { label: "延長（0.20秒超）＝1度房室ブロック", min: 0.2 }],
      explanation: "PR間隔の正常は0.12〜0.20秒（小さいマス3〜5個）。長ければ1度房室ブロック、短ければWPW症候群などの早期興奮を考える。" },
    { ...M, kind: "qrs", prompt: "QRS幅を測ろう（QRSの始まり → 終わり）", tolerance: 0.03, values: [0.08, 0.14, 0.16],
      categories: [{ label: "正常（0.12秒未満）", max: 0.12 }, { label: "幅広い（0.12秒以上）", min: 0.12 }],
      explanation: "QRS幅が0.12秒（小さいマス3個）以上なら、脚ブロック、心室由来の興奮、ペーシング、高カリウム血症などを考える。" },
    { ...M, kind: "qt", prompt: "QT間隔を測ろう（QRSの始まり → T波の終わり）。心拍数は60/分", tolerance: 0.04, values: [0.38, 0.54],
      categories: [{ label: "正常", max: 0.46 }, { label: "QT延長", min: 0.46 }],
      explanation: "心拍数60/分ならQTc＝QT。QTcが男性で約0.45秒、女性で約0.46秒を超えると延長。RR間隔の半分を超えるかも目安になる。" },
  ],
};
