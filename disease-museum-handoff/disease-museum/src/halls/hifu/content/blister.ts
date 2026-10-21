// 水疱症の4マス（共通ゲーム grid）。TODO(review) 分類と治療
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const blisterContent: GridData = {
  rowLabels: ["表皮の中で裂ける", "表皮の下で裂ける"],
  colLabels: ["自己免疫", "それ以外"],
  cells: [
    { id: "pv", row: 0, col: 0, label: "天疱瘡" },
    { id: "inf", row: 0, col: 1, label: "感染・毒素", sub: "SSSS・とびひ" },
    { id: "bp", row: 1, col: 0, label: "類天疱瘡" },
    { id: "drug", row: 1, col: 1, label: "薬疹など", sub: "TEN" },
  ],
  question: "どのマス？",
  treatQuestion: "治療の中心は？",
  treatments: ["ステロイド内服（必要なら免疫抑制）", "抗菌薬", "原因薬を中止し、全身管理"],
  stampAt: 4,
  cases: [
    { ...M, id: "pv", who: "50歳 女性", signs: ["口の中のただれが治らない", "破れやすい水疱", "Nikolsky現象 陽性", "抗デスモグレイン3抗体"], cell: "pv", treatment: 0,
      explanation: "尋常性天疱瘡。表皮細胞どうしのつなぎ目（デスモソーム）への抗体。棘融解。" },
    { ...M, id: "bp", who: "80歳 男性", signs: ["かゆい紅斑の上に、張りつめた大きな水疱", "口の中はきれい", "抗BP180抗体"], cell: "bp", treatment: 0,
      explanation: "水疱性類天疱瘡。表皮と真皮の境目（ヘミデスモソーム）への抗体。高齢者に多い。DPP-4阻害薬が誘因のことも。" },
    { ...M, id: "ssss", who: "2歳 男児", signs: ["発熱", "首やわきの赤み", "触ると皮膚がずるっとむける", "口のまわりにかさぶた"], cell: "inf", treatment: 1,
      explanation: "ブドウ球菌性熱傷様皮膚症候群。表皮剝脱毒素が顆粒層で裂く。粘膜は侵されない。" },
    { ...M, id: "impetigo", who: "4歳 女児", signs: ["夏", "鼻の下に破れやすい水疱とただれ", "広がっていく"], cell: "inf", treatment: 1,
      explanation: "伝染性膿痂疹（とびひ）。黄色ブドウ球菌。" },
    { ...M, id: "ten", who: "40歳 男性", signs: ["カルバマゼピンを始めて2週間", "発熱", "目と口のただれ", "体の30%以上の皮膚がはがれる"], cell: "drug", treatment: 2,
      explanation: "中毒性表皮壊死症。表皮全層の壊死。原因薬の中止、熱傷に準じた管理、眼の管理。" },
    { ...M, id: "pf", who: "45歳 男性", signs: ["胸や背中にかさぶたと浅いただれ", "口の中はきれい", "抗デスモグレイン1抗体"], cell: "pv", treatment: 0,
      explanation: "落葉状天疱瘡。表皮の浅いところで裂けるので、水疱よりかさぶたが目立つ。" },
  ],
};
