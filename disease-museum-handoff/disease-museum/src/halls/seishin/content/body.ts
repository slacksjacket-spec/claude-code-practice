// まず体を疑えラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const bodyContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 5, stampAt: 4,
  tests: [
    { id: "glu", name: "血糖", cost: 1 },
    { id: "thy", name: "甲状腺機能", cost: 1 },
    { id: "inf", name: "血算・CRP・尿検査", cost: 1 },
    { id: "csf", name: "髄液検査", cost: 1 },
    { id: "eeg", name: "脳波", cost: 1 },
    { id: "mri", name: "頭部MRI", cost: 2 },
    { id: "pel", name: "骨盤エコー", cost: 1 },
  ],
  diagnoses: [
    { name: "統合失調症", short: "統合失調症" },
    { name: "せん妄（感染による）", short: "せん妄" },
    { name: "甲状腺中毒症", short: "甲状腺" },
    { name: "抗NMDA受容体脳炎", short: "脳炎" },
    { name: "低血糖", short: "低血糖" },
    { name: "Wernicke脳症", short: "Wernicke" },
  ],
  cases: [
    { ...M, who: "20歳 男性", vignette: "1年かけて少しずつ口数が減り、幻聴を訴える。体の症状はない。", faceColor: "#F2D0AE", answer: 0,
      results: r({ glu: ["正常", false], thy: ["正常", false], inf: ["正常", false], csf: ["正常", false], eeg: ["正常", false], mri: ["異常なし", false], pel: ["—", false] }),
      explanation: "体の病気を除外したうえでの統合失調症。初発では必ず器質因を確認する。",
      flow: { prior: [50, 10, 10, 10, 10, 10], priorWhy: "ゆっくりした経過の幻聴。",
        steps: [{ test: "mri", finding: "異常なし", why: "器質疾患は否定的。", probs: [70, 8, 10, 4, 4, 4] }, { test: "thy", finding: "正常", why: "甲状腺は否定。", probs: [80, 8, 0, 4, 4, 4] }], note: "" } },
    { ...M, who: "85歳 女性", vignette: "入院2日目の夜から急に興奮し、点滴を抜く。昼はうとうと。", faceColor: "#EEC4A2", answer: 1,
      results: r({ glu: ["正常", false], thy: ["正常", false], inf: ["白血球 14,000、CRP 9、尿の白血球多数", true], csf: ["正常", false], eeg: ["全体に徐波", true], mri: ["年齢相応の萎縮", false], pel: ["—", false] }),
      explanation: "急な発症、意識と注意の障害、日内変動。尿路感染によるせん妄。原因を治し、環境を整える。",
      flow: { prior: [5, 55, 10, 5, 15, 10], priorWhy: "高齢者の急な夜間の興奮。",
        steps: [{ test: "inf", finding: "尿路感染", why: "せん妄の原因。", probs: [1, 88, 3, 1, 4, 3] }], note: "" } },
    { ...M, who: "35歳 女性", vignette: "イライラして落ち着かず、眠れない。動悸と体重減少、手のふるえ。", faceColor: "#F4D2B4", answer: 2,
      results: r({ glu: ["正常", false], thy: ["FT4 高値、TSH 抑制", true], inf: ["正常", false], csf: ["—", false], eeg: ["—", false], mri: ["—", false], pel: ["—", false] }),
      explanation: "甲状腺中毒症による不安・焦燥。体重減少と頻脈は手がかり。",
      flow: { prior: [10, 10, 50, 10, 10, 10], priorWhy: "身体症状を伴う焦燥。",
        steps: [{ test: "thy", finding: "甲状腺中毒症", why: "確定。", probs: [1, 1, 96, 1, 1, 0] }], note: "" } },
    { ...M, who: "24歳 女性", vignette: "かぜのあと、急に奇妙な言動と幻覚。口をもぐもぐ動かし、けいれんも。", faceColor: "#F6D9BE", answer: 3,
      results: r({ glu: ["正常", false], thy: ["正常", false], inf: ["軽いCRP上昇", true], csf: ["リンパ球の増加、抗NMDA受容体抗体陽性", true], eeg: ["異常な徐波", true], mri: ["異常なし", false], pel: ["卵巣奇形腫", true] }),
      explanation: "若い女性の急性精神病とけいれん・不随意運動・自律神経症状。卵巣奇形腫を探して切除し、免疫療法。",
      flow: { prior: [30, 10, 5, 35, 10, 10], priorWhy: "急な発症と神経症状。",
        steps: [{ test: "csf", finding: "抗体陽性", why: "確定。", probs: [1, 1, 0, 97, 0, 1] }, { test: "pel", finding: "奇形腫", why: "原因。", probs: [0, 0, 0, 100, 0, 0] }], note: "" } },
    { ...M, who: "70歳 男性", vignette: "糖尿病でSU薬を内服。朝、急に意味不明なことを言い暴れた。", faceColor: "#EFC9A8", answer: 4,
      results: r({ glu: ["血糖 35", true], thy: ["正常", false], inf: ["正常", false], csf: ["—", false], eeg: ["—", false], mri: ["異常なし", false], pel: ["—", false] }),
      explanation: "意識障害や異常行動を見たら、まず血糖。",
      flow: { prior: [5, 20, 5, 5, 50, 15], priorWhy: "糖尿病の薬と急な異常行動。",
        steps: [{ test: "glu", finding: "35", why: "低血糖。", probs: [0, 0, 0, 0, 100, 0] }], note: "" } },
    { ...M, who: "55歳 男性", vignette: "大酒家。食事をほとんどとっていない。ぼんやりして、ふらつき、目が揺れる。", faceColor: "#E9C9A0", answer: 5,
      results: r({ glu: ["正常", false], thy: ["正常", false], inf: ["軽い貧血", true], csf: ["正常", false], eeg: ["軽い徐波", true], mri: ["乳頭体と第三脳室周囲の信号変化", true], pel: ["—", false] }),
      explanation: "意識障害・眼振（眼球運動障害）・失調の三徴。ビタミンB₁をすぐに（ブドウ糖より先に）。放置するとKorsakoff症候群。",
      flow: { prior: [5, 20, 5, 5, 15, 50], priorWhy: "大酒家の意識障害と眼球の異常。",
        steps: [{ test: "mri", finding: "乳頭体の異常", why: "Wernicke脳症。", probs: [0, 3, 0, 1, 0, 96] }], note: "診断を待たずにB₁を投与してよい。" } },
  ],
};
