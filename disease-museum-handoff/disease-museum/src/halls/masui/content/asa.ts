// ASA-PS（共通ゲーム grid）。TODO(review) 各症例の分類
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const asaContent: GridData = {
  rowLabels: ["ASA"],
  colLabels: ["I", "II", "III", "IV", "V"],
  cells: [
    { id: "1", row: 0, col: 0, label: "I", sub: "健康" },
    { id: "2", row: 0, col: 1, label: "II", sub: "軽い全身疾患" },
    { id: "3", row: 0, col: 2, label: "III", sub: "重い全身疾患" },
    { id: "4", row: 0, col: 3, label: "IV", sub: "命を脅かす" },
    { id: "5", row: 0, col: 4, label: "V", sub: "手術なしでは助からない" },
  ],
  question: "ASA-PS分類は？",
  stampAt: 4,
  cases: [
    { ...M, id: "a1", who: "25歳 男性", signs: ["持病なし", "喫煙なし", "鼠径ヘルニアの手術"], cell: "1", explanation: "健康な患者はI。" },
    { ...M, id: "a2", who: "50歳 女性", signs: ["高血圧（薬でよくコントロール）", "喫煙者"], cell: "2", explanation: "日常生活に支障のない軽い病気はII。喫煙や妊娠もII。" },
    { ...M, id: "a3", who: "65歳 男性", signs: ["透析中の慢性腎不全"], cell: "3", explanation: "日常生活が制限される重い病気はIII。" },
    { ...M, id: "a3b", who: "40歳 女性", signs: ["BMI 42", "睡眠時無呼吸"], cell: "3", explanation: "BMI 40以上の高度肥満はIII。" },
    { ...M, id: "a4", who: "70歳 男性", signs: ["3週間前に心筋梗塞", "今も胸痛がある"], cell: "4", explanation: "3か月以内の心筋梗塞など、常に命を脅かす病気はIV。待てる手術は延期。" },
    { ...M, id: "a5", who: "75歳 男性", signs: ["腹部大動脈瘤の破裂", "ショック"], cell: "5", explanation: "手術をしなければ助からない瀕死の状態はV。緊急手術なので「E」を付けて V-E。" },
  ],
};
