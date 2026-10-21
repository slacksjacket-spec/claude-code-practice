// 血液ガス道場（共通ゲーム abg）。値は Henderson-Hasselbalch で整合させた架空の値。TODO(review) 原因の選択肢と解説
import type { AbgData } from "../../../engine/games/abg.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const abgContent: AbgData = {
  stampAt: 3,
  cases: [
    { ...M, id: "copd", story: "72歳 男性。COPDで在宅酸素。いつもの外来で採血。", gas: { pH: 7.34, PaCO2: 60, HCO3: 31, PaO2: 58 }, primary: "呼吸性アシドーシス", chronic: true,
      cause: { options: ["COPDによる慢性の肺胞低換気", "過換気症候群", "糖尿病ケトアシドーシス", "嘔吐"], answer: 0 },
      explanation: "慢性の呼吸性アシドーシスを、腎臓がHCO₃⁻を増やして代償している。高濃度の酸素でCO₂ナルコーシスにならないよう注意。" },
    { ...M, id: "opioid", story: "40歳 男性。意識がもうろうとして呼吸が浅い。縮瞳。", gas: { pH: 7.22, PaCO2: 70, HCO3: 28, PaO2: 62 }, primary: "呼吸性アシドーシス",
      cause: { options: ["オピオイド過量による呼吸抑制", "COPDの安定期", "過換気症候群", "嘔吐"], answer: 0 },
      explanation: "急性の呼吸性アシドーシス。代償が追いつかずpHが大きく下がる。縮瞳と呼吸抑制はオピオイドを疑い、ナロキソン。" },
    { ...M, id: "hypervent", story: "20歳 女性。試験前に急に息苦しくなり、手がしびれる。", gas: { pH: 7.56, PaCO2: 24, HCO3: 21, PaO2: 105 }, primary: "呼吸性アルカローシス",
      cause: { options: ["過換気症候群", "COPDの増悪", "嘔吐", "利尿薬"], answer: 0 },
      explanation: "急性の呼吸性アルカローシス。低Ca様の症状（しびれ、テタニー）。肺塞栓などの器質的な病気を除外してから診断する。" },
    { ...M, id: "dka", story: "19歳 男性。1型糖尿病。数日前からインスリンを打っていない。深く大きい呼吸。", gas: { pH: 7.1, PaCO2: 17, HCO3: 5, PaO2: 110, Na: 134, Cl: 98 }, primary: "代謝性アシドーシス",
      cause: { options: ["糖尿病ケトアシドーシス", "下痢", "尿細管性アシドーシス", "嘔吐"], answer: 0 },
      explanation: "AG開大性の代謝性アシドーシスを、深く大きい呼吸（Kussmaul呼吸）で代償している。" },
    { ...M, id: "vomit", story: "45歳 男性。幽門狭窄で何日も吐き続けている。", gas: { pH: 7.52, PaCO2: 47, HCO3: 37, PaO2: 80, Na: 136, Cl: 88 }, primary: "代謝性アルカローシス",
      cause: { options: ["嘔吐による胃酸の喪失", "過換気症候群", "下痢", "COPD"], answer: 0 },
      explanation: "胃液（HCl）を失い、低Cl性の代謝性アルカローシス。呼吸を抑えてPaCO₂を上げて代償する。" },
    { ...M, id: "salicylate", story: "30歳 女性。大量のアスピリンを飲んだ。耳鳴りと過呼吸。", gas: { pH: 7.45, PaCO2: 22, HCO3: 15, PaO2: 100, Na: 140, Cl: 104 }, primary: "呼吸性アルカローシス",
      cause: { options: ["サリチル酸（アスピリン）中毒", "過換気症候群だけ", "嘔吐", "COPD"], answer: 0 },
      explanation: "呼吸中枢の刺激による呼吸性アルカローシスに、AG開大性の代謝性アシドーシスが合併（AG 21）。pHが正常でも安心しない。" },
  ],
};
