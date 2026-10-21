// 腰痛ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const backContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 5, stampAt: 4,
  tests: [
    { id: "slr", name: "下肢伸展挙上テスト", cost: 1 },
    { id: "xray", name: "腰椎X線", cost: 1 },
    { id: "crp", name: "CRP・血液培養", cost: 1 },
    { id: "tm", name: "腫瘍マーカー・PSA", cost: 1 },
    { id: "hla", name: "HLA-B27・仙腸関節", cost: 1 },
    { id: "mri", name: "腰椎MRI", cost: 2 },
  ],
  diagnoses: [
    { name: "腰椎椎間板ヘルニア", short: "ヘルニア" },
    { name: "腰部脊柱管狭窄症", short: "狭窄症" },
    { name: "化膿性脊椎炎", short: "化膿性" },
    { name: "転移性脊椎腫瘍", short: "転移" },
    { name: "骨粗鬆症性圧迫骨折", short: "圧迫骨折" },
    { name: "強直性脊椎炎", short: "強直性" },
  ],
  cases: [
    { ...M, who: "30歳 男性", vignette: "重い物を持ち上げてから腰痛と左足の放散痛。咳で響く。", faceColor: "#F2D0AE", answer: 0,
      results: r({ slr: ["左で30°で陽性", true], xray: ["異常なし", false], crp: ["正常", false], tm: ["正常", false], hla: ["陰性", false], mri: ["L4/5の椎間板が左後方へ突出", true] }),
      explanation: "若い人の急な腰痛と坐骨神経痛。多くは保存療法でよくなる。",
      flow: { prior: [50, 10, 5, 5, 10, 20], priorWhy: "若い人の重量物のあとの痛み。", steps: [{ test: "slr", finding: "陽性", why: "神経根の伸展で痛む。", probs: [80, 5, 2, 3, 3, 7] }], note: "" } },
    { ...M, who: "72歳 男性", vignette: "歩くと両足がしびれて休みたくなる。前かがみで休むと楽になり、また歩ける。", faceColor: "#EEC4A2", answer: 1,
      results: r({ slr: ["陰性", false], xray: ["変形性変化、すべり", true], crp: ["正常", false], tm: ["正常", false], hla: ["陰性", false], mri: ["L4/5で脊柱管が狭い", true] }),
      explanation: "神経性間欠跛行。自転車は平気。足の脈が触れれば血管性（閉塞性動脈硬化症）との区別に役立つ。",
      flow: { prior: [10, 50, 5, 10, 15, 10], priorWhy: "前かがみで楽になる間欠跛行。", steps: [{ test: "mri", finding: "脊柱管狭窄", why: "確定的。", probs: [3, 92, 1, 2, 2, 0] }], note: "" } },
    { ...M, who: "68歳 男性", vignette: "糖尿病で透析中。腰痛が日に日に強くなり、夜も痛い。熱がある。", faceColor: "#E9C9A0", answer: 2,
      results: r({ slr: ["陰性", false], xray: ["椎間板が狭く、隣の椎体の縁がぼやける", true], crp: ["CRP 15、血液培養で黄色ブドウ球菌", true], tm: ["正常", false], hla: ["陰性", false], mri: ["隣り合う2つの椎体と椎間板に炎症", true] }),
      explanation: "化膿性脊椎炎。発熱と夜間痛は危険なサイン。血液培養と長期の抗菌薬。",
      flow: { prior: [5, 10, 35, 25, 15, 10], priorWhy: "免疫が落ちた人の進む痛みと発熱。", steps: [{ test: "crp", finding: "菌血症", why: "感染。", probs: [1, 1, 90, 5, 2, 1] }], note: "" } },
    { ...M, who: "70歳 男性", vignette: "体重が減ってきた。横になっても治らない腰痛。", faceColor: "#EFC9A8", answer: 3,
      results: r({ slr: ["陰性", false], xray: ["椎弓根が見えない（winking owl sign）", true], crp: ["軽度上昇", true], tm: ["PSA 120", true], hla: ["陰性", false], mri: ["多数の椎体に腫瘍", true] }),
      explanation: "前立腺癌の骨転移（造骨性）。高齢者の夜間痛・体重減少・癌の既往は危険なサイン。",
      flow: { prior: [5, 10, 15, 40, 20, 10], priorWhy: "体重減少と安静時の痛み。", steps: [{ test: "tm", finding: "PSA高値", why: "前立腺癌の転移。", probs: [0, 1, 1, 96, 2, 0] }], note: "" } },
    { ...M, who: "78歳 女性", vignette: "しりもちをついてから背中が痛い。身長が縮んだ。", faceColor: "#EEC4A2", answer: 4,
      results: r({ slr: ["陰性", false], xray: ["第1腰椎が楔形につぶれている", true], crp: ["正常", false], tm: ["正常", false], hla: ["陰性", false], mri: ["新しい骨折（T1で低信号）", true] }),
      explanation: "骨粗鬆症性圧迫骨折。骨粗鬆症の治療を始めて、次の骨折を防ぐ。",
      flow: { prior: [5, 10, 5, 15, 60, 5], priorWhy: "高齢女性の軽い外傷。", steps: [{ test: "xray", finding: "楔状変形", why: "圧迫骨折。", probs: [1, 2, 3, 10, 84, 0] }], note: "悪性の圧迫骨折との区別にMRI。" } },
    { ...M, who: "25歳 男性", vignette: "3か月続く腰痛。朝にこわばり、体を動かすとむしろ楽になる。かかとも痛い。", faceColor: "#F2D0AE", answer: 5,
      results: r({ slr: ["陰性", false], xray: ["両側の仙腸関節炎", true], crp: ["軽度上昇", true], tm: ["正常", false], hla: ["HLA-B27 陽性", true], mri: ["仙腸関節の骨髄浮腫", true] }),
      explanation: "炎症性腰痛（安静で悪化、運動で改善）。進むと竹様脊椎。ぶどう膜炎の合併。NSAIDs、TNF阻害薬。",
      flow: { prior: [20, 5, 5, 5, 5, 60], priorWhy: "若い男性の炎症性腰痛。", steps: [{ test: "hla", finding: "陽性・仙腸関節炎", why: "強直性脊椎炎。", probs: [2, 0, 1, 0, 0, 97] }], note: "" } },
  ],
};
