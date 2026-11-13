// 肺癌 治療すごろく（AlgorithmBoard）。患者はすべて架空。
// TODO(review) 病期ごとの標準治療、ドライバー遺伝子ごとの薬剤、小細胞肺癌の限局型・進展型の治療は記憶から書いた。
// 肺癌診療ガイドライン（日本肺癌学会）で照合が必要。PD-L1による使い分けと周術期治療は単純化して省いた
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: ["肺癌診療ガイドライン2024年版 小細胞肺癌（日本肺癌学会）https://www.haigan.gr.jp/publication/guideline/examination/2024/1/3/240103010100.html", "同 進展型小細胞肺癌 https://www.haigan.gr.jp/publication/guideline/examination/2024/1/3/240103020100.html"] };

export const lungcaContent: ExhibitOf<"AlgorithmBoard">["data"] = {
  stampAt: 4,
  nodes: [
    { id: "hist", label: "組織型", question: "組織型は？", options: [{ value: "nsclc", label: "非小細胞癌（腺癌・扁平上皮癌）" }, { value: "sclc", label: "小細胞癌" }] },
    { id: "stage", label: "病期", question: "病期は？", options: [{ value: "early", label: "I〜II期（切除できる）" }, { value: "la", label: "III期（切除できない）" }, { value: "adv", label: "IV期（遠隔転移）" }] },
    { id: "driver", label: "遺伝子", question: "ドライバー遺伝子は？", options: [{ value: "egfr", label: "EGFR変異" }, { value: "alk", label: "ALK融合遺伝子" }, { value: "none", label: "なし" }] },
    { id: "extent", label: "広がり", question: "病変の広がりは？", options: [{ value: "ld", label: "限局型（片側の胸郭内）" }, { value: "ed", label: "進展型" }] },
  ],
  goalLabel: "治療",
  treatments: [
    "手術（肺葉切除＋リンパ節郭清）",
    "化学放射線療法（のち免疫チェックポイント阻害薬）",
    "EGFRチロシンキナーゼ阻害薬（オシメルチニブ）",
    "ALK阻害薬（アレクチニブ）",
    "免疫チェックポイント阻害薬（＋化学療法）",
    "化学放射線療法と予防的全脳照射",
    "化学療法（プラチナ＋エトポシド）＋免疫チェックポイント阻害薬",
  ],
  patients: [
    { ...M, card: { 年齢: "66", 経過: "健診のCTで右上葉の末梢に2 cmの結節", 組織: "腺癌", 転移: "リンパ節・遠隔転移なし" },
      path: ["hist", "stage", "goal"], answers: { hist: "nsclc", stage: "early" }, treatments: [0],
      explanation: "切除できる非小細胞癌は手術。標準は肺葉切除とリンパ節郭清。手術ができない体力なら定位放射線治療。" },
    { ...M, card: { 年齢: "70", 経過: "喫煙50年。血痰", 組織: "扁平上皮癌", 転移: "縦隔リンパ節に多発、遠隔転移なし" },
      path: ["hist", "stage", "goal"], answers: { hist: "nsclc", stage: "la" }, treatments: [1],
      explanation: "切除できないIII期は、抗がん薬と放射線を同時に行い、そのあと免疫チェックポイント阻害薬（デュルバルマブ）で地固め。" },
    { ...M, card: { 年齢: "58", 性別: "女性・喫煙なし", 組織: "腺癌", 転移: "脳と骨", 遺伝子: "EGFR変異 陽性" },
      path: ["hist", "stage", "driver", "goal"], answers: { hist: "nsclc", stage: "adv", driver: "egfr" }, treatments: [2],
      explanation: "IV期の非小細胞癌はまず遺伝子を調べる。EGFR変異は日本人の腺癌の約半数（女性・非喫煙者に多い）。副作用は皮疹・下痢・間質性肺炎。" },
    { ...M, card: { 年齢: "38", 性別: "男性・喫煙なし", 組織: "腺癌", 転移: "胸膜播種", 遺伝子: "ALK融合遺伝子 陽性" },
      path: ["hist", "stage", "driver", "goal"], answers: { hist: "nsclc", stage: "adv", driver: "alk" }, treatments: [3],
      explanation: "ALK融合遺伝子は若い非喫煙者の腺癌に多い。ALK阻害薬がよく効く。" },
    { ...M, card: { 年齢: "72", 経過: "喫煙60年", 組織: "扁平上皮癌", 転移: "肝と副腎", 遺伝子: "ドライバー遺伝子なし" },
      path: ["hist", "stage", "driver", "goal"], answers: { hist: "nsclc", stage: "adv", driver: "none" }, treatments: [4],
      explanation: "ドライバー遺伝子がなければ免疫チェックポイント阻害薬（抗PD-1/PD-L1抗体）が中心。PD-L1の発現が高ければ単剤、そうでなければ化学療法と併用。" },
    { ...M, card: { 年齢: "64", 経過: "喫煙45年。肺門部の腫瘤", 組織: "小細胞癌", 転移: "同じ側の縦隔リンパ節まで" },
      path: ["hist", "extent", "goal"], answers: { hist: "sclc", extent: "ld" }, treatments: [5],
      explanation: "限局型の小細胞癌は化学放射線療法（シスプラチン＋エトポシド）。よく効いたら、脳転移を防ぐ予防的全脳照射。手術はごく早期（I期）だけ。" },
    { ...M, card: { 年齢: "69", 経過: "低Na血症（SIADH）で見つかった", 組織: "小細胞癌", 転移: "肝・骨・反対側の肺" },
      path: ["hist", "extent", "goal"], answers: { hist: "sclc", extent: "ed" }, treatments: [6],
      explanation: "進展型は薬物療法。増殖が速く早くから転移するが、抗がん薬と放射線はよく効く。SIADH、異所性ACTH、Lambert-Eaton症候群を合併する。" },
  ],
};
