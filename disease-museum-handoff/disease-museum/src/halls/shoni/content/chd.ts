// 先天性心疾患の4マス（共通ゲーム grid）。TODO(review) 分類と所見
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const chdContent: GridData = {
  rowLabels: ["チアノーゼなし", "チアノーゼあり"],
  colLabels: ["肺血流 増える", "肺血流 増えない"],
  cells: [
    { id: "lr", row: 0, col: 0, label: "左右短絡", sub: "VSD・ASD・PDA" },
    { id: "obs", row: 0, col: 1, label: "狭窄", sub: "肺動脈弁狭窄・大動脈縮窄" },
    { id: "mix", row: 1, col: 0, label: "血が混ざる", sub: "大血管転位など" },
    { id: "tof", row: 1, col: 1, label: "肺血流が減る", sub: "Fallot四徴症など" },
  ],
  question: "どのマス？",
  stampAt: 4,
  cases: [
    { ...M, id: "vsd", who: "2か月 男児", signs: ["哺乳のときに汗をかく", "体重が増えない", "胸骨左縁下部の汎収縮期雑音"], cell: "lr",
      explanation: "心室中隔欠損症。いちばん多い先天性心疾患。大きければ心不全。" },
    { ...M, id: "asd", who: "7歳 女児", signs: ["学校健診で心雑音", "II音の固定性分裂", "症状なし"], cell: "lr",
      explanation: "心房中隔欠損症。肺動脈弁の血流が増えて駆出性雑音。成人で見つかることも。" },
    { ...M, id: "pda", who: "早産の新生児", signs: ["連続性雑音", "脈圧が大きい"], cell: "lr",
      explanation: "動脈管開存症。早産児ではインドメタシンで閉じる。" },
    { ...M, id: "tof", who: "1歳 男児", signs: ["泣くと急に紫色になる発作", "しゃがみこむ", "X線で木靴形の心臓"], cell: "tof",
      explanation: "Fallot四徴症（VSD、肺動脈狭窄、大動脈騎乗、右室肥大）。無酸素発作には胸膝位、酸素、β遮断薬。" },
    { ...M, id: "tga", who: "生後1日", signs: ["生まれてすぐ強いチアノーゼ", "酸素を吸ってもよくならない", "X線で卵を横にした形"], cell: "mix",
      explanation: "完全大血管転位。動脈管を開いておくためプロスタグランジンE₁。動脈スイッチ手術。" },
    { ...M, id: "coarc", who: "3か月 男児", signs: ["上肢の血圧が高く、下肢の脈が弱い", "チアノーゼなし"], cell: "obs",
      explanation: "大動脈縮窄症。Turner症候群に多い。成人では肋骨の切痕。" },
  ],
};
