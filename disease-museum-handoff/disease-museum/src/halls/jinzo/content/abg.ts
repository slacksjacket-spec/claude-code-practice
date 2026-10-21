// 血液ガス道場・腎編（共通ゲーム abg）。値は Henderson-Hasselbalch で整合させた架空の値。TODO(review)
import type { AbgData } from "../../../engine/games/abg.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const abgContent: AbgData = {
  stampAt: 3,
  cases: [
    { ...M, id: "diarrhea", story: "40歳 女性。1週間続く大量の水様下痢。", gas: { pH: 7.28, PaCO2: 30, HCO3: 14, Na: 138, Cl: 114 }, primary: "代謝性アシドーシス",
      cause: { options: ["下痢によるHCO₃⁻の喪失", "糖尿病ケトアシドーシス", "嘔吐", "過換気症候群"], answer: 0 },
      explanation: "AG正常（高Cl性）の代謝性アシドーシス。腸からHCO₃⁻を失い、かわりにClが増える。" },
    { ...M, id: "ckd", story: "70歳 男性。慢性腎臓病（eGFR 12）。だるさと食欲低下。", gas: { pH: 7.3, PaCO2: 30, HCO3: 14, Na: 138, Cl: 106 }, primary: "代謝性アシドーシス",
      cause: { options: ["腎不全（酸を排泄できない）", "下痢", "嘔吐", "利尿薬"], answer: 0 },
      explanation: "腎不全が進むと、リン酸・硫酸などの酸がたまりAGが開大する（AG 18）。" },
    { ...M, id: "rta1", story: "35歳 女性。シェーグレン症候群。脱力。腎に石灰化。尿のpHは6.5。", gas: { pH: 7.3, PaCO2: 32, HCO3: 15, Na: 140, Cl: 115 }, primary: "代謝性アシドーシス",
      cause: { options: ["遠位（1型）尿細管性アシドーシス", "糖尿病ケトアシドーシス", "乳酸アシドーシス", "腎不全"], answer: 0 },
      explanation: "AG正常の代謝性アシドーシスなのに尿がアルカリ性（H⁺を尿へ出せない）。低K血症、腎石灰化。シェーグレン症候群に合併する。" },
    { ...M, id: "vomit", story: "45歳 男性。幽門狭窄で何日も吐き続けている。", gas: { pH: 7.52, PaCO2: 47, HCO3: 37, Na: 136, Cl: 88 }, primary: "代謝性アルカローシス",
      cause: { options: ["嘔吐による胃酸の喪失", "下痢", "腎不全", "過換気症候群"], answer: 0 },
      explanation: "低Cl性の代謝性アルカローシス。生理食塩水で体液とClを補うと治る（Cl反応性）。" },
    { ...M, id: "loop", story: "80歳 女性。心不全で大量のフロセミドを飲んでいる。", gas: { pH: 7.48, PaCO2: 46, HCO3: 33, Na: 134, Cl: 90 }, primary: "代謝性アルカローシス",
      cause: { options: ["ループ利尿薬", "下痢", "尿細管性アシドーシス", "COPD"], answer: 0 },
      explanation: "利尿薬で体液量が減り（contraction alkalosis）、Kも失って代謝性アルカローシスになる。" },
    { ...M, id: "lactic", story: "65歳 男性。敗血症性ショック。手足が冷たい。", gas: { pH: 7.2, PaCO2: 22, HCO3: 8, Na: 140, Cl: 100 }, primary: "代謝性アシドーシス",
      cause: { options: ["組織の低灌流による乳酸アシドーシス", "下痢", "嘔吐", "尿細管性アシドーシス"], answer: 0 },
      explanation: "AG開大（32）の代謝性アシドーシス。原因の治療（循環の回復）が先。" },
  ],
};
