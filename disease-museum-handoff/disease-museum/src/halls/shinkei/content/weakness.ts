// 脱力ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const weaknessContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 6, stampAt: 4,
  tests: [
    { id: "k", name: "血清K", cost: 1 },
    { id: "csf", name: "髄液検査", cost: 1 },
    { id: "ncs", name: "神経伝導検査・針筋電図", cost: 1 },
    { id: "rns", name: "反復刺激試験", cost: 1 },
    { id: "ab", name: "抗AChR抗体・抗VGCC抗体", cost: 1 },
    { id: "mri", name: "脳・脊髄MRI", cost: 2 },
    { id: "ct", name: "胸部CT", cost: 1 },
  ],
  diagnoses: [
    { name: "Guillain-Barré症候群", short: "GBS" },
    { name: "重症筋無力症", short: "MG" },
    { name: "筋萎縮性側索硬化症", short: "ALS" },
    { name: "多発性硬化症", short: "MS" },
    { name: "低K性周期性四肢麻痺", short: "周期性" },
    { name: "Lambert-Eaton症候群", short: "LEMS" },
  ],
  cases: [
    { ...M, who: "30歳 男性", vignette: "2週前に下痢。足から上に向かって力が入らなくなってきた。", faceColor: "#F2D0AE", answer: 0,
      results: r({ k: ["正常", false], csf: ["蛋白高値、細胞数は正常（蛋白細胞解離）", true], ncs: ["伝導速度の低下、伝導ブロック", true], rns: ["正常", false], ab: ["陰性", false], mri: ["異常なし", false], ct: ["異常なし", false] }),
      explanation: "カンピロバクター腸炎のあとのGBS。腱反射は消失。呼吸筋麻痺に注意。免疫グロブリン大量療法か血漿交換。",
      flow: { prior: [50, 10, 5, 10, 15, 10], priorWhy: "感染後の上行性の脱力。",
        steps: [{ test: "csf", finding: "蛋白細胞解離", why: "GBSの典型。", probs: [88, 2, 2, 5, 2, 1] }],
        note: "ステロイドは効かない。" } },
    { ...M, who: "35歳 女性", vignette: "夕方になるとまぶたが下がり、物が二重に見える。", faceColor: "#F4D2B4", answer: 1,
      results: r({ k: ["正常", false], csf: ["正常", false], ncs: ["正常", false], rns: ["低頻度刺激で漸減（waning）", true], ab: ["抗AChR抗体 陽性", true], mri: ["異常なし", false], ct: ["前縦隔に胸腺腫", true] }),
      explanation: "重症筋無力症。日内変動と易疲労性。胸腺腫を合併しやすい。抗コリンエステラーゼ薬、胸腺摘除、免疫療法。",
      flow: { prior: [5, 65, 5, 15, 5, 5], priorWhy: "夕方に悪くなる眼瞼下垂と複視。",
        steps: [
          { test: "ab", finding: "抗AChR抗体陽性", why: "MGで確定的。", probs: [0, 97, 0, 1, 0, 2] },
          { test: "ct", finding: "胸腺腫", why: "合併の検索。", probs: [0, 98, 0, 0, 0, 2] },
        ], note: "抗AChR抗体陰性なら抗MuSK抗体。" } },
    { ...M, who: "62歳 男性", vignette: "1年かけて手がやせてきた。話しにくく、むせる。", faceColor: "#EFC9A8", answer: 2,
      results: r({ k: ["正常", false], csf: ["正常", false], ncs: ["伝導は正常、針筋電図で広い範囲に脱神経", true], rns: ["軽い漸減", true], ab: ["陰性", false], mri: ["頸椎症は軽い", false], ct: ["異常なし", false] }),
      explanation: "上位と下位の運動ニューロン障害が広く進むALS。感覚は正常。リルゾール。呼吸と栄養の支援。",
      flow: { prior: [5, 15, 50, 15, 5, 10], priorWhy: "ゆっくり進む筋萎縮と球麻痺。",
        steps: [{ test: "ncs", finding: "広範な脱神経", why: "下位運動ニューロン障害が複数の領域に。", probs: [1, 3, 90, 3, 1, 2] }],
        note: "頸椎症などの除外が大事。" } },
    { ...M, who: "28歳 女性", vignette: "半年前に右目の視力低下があった。今度は左足がしびれて力が入らない。", faceColor: "#F6D9BE", answer: 3,
      results: r({ k: ["正常", false], csf: ["オリゴクローナルバンド陽性、IgG index 上昇", true], ncs: ["正常", false], rns: ["正常", false], ab: ["陰性", false], mri: ["脳室の周りに多数の白質病変（卵円形）", true], ct: ["異常なし", false] }),
      explanation: "時間的・空間的に多発する中枢神経の脱髄。多発性硬化症。体温が上がると悪くなる（Uhthoff徴候）。",
      flow: { prior: [5, 10, 3, 65, 7, 10], priorWhy: "若い女性の再発する中枢神経症状。",
        steps: [{ test: "mri", finding: "脳室周囲の病変", why: "空間的多発。", probs: [1, 1, 1, 96, 0, 1] }],
        note: "視神経脊髄炎（抗AQP4抗体）との区別が大事。" } },
    { ...M, who: "24歳 男性", vignette: "ラーメンをたくさん食べた翌朝、手足が動かない。動悸と体重減少もある。", faceColor: "#F2D0AE", answer: 4,
      results: r({ k: ["K 2.1", true], csf: ["正常", false], ncs: ["正常", false], rns: ["正常", false], ab: ["陰性", false], mri: ["異常なし", false], ct: ["異常なし", false] }),
      explanation: "炭水化物の大量摂取や運動後に、Kが細胞内へ移って起こる。若い男性ではバセドウ病に合併する甲状腺中毒性周期性四肢麻痺を考える。",
      flow: { prior: [20, 5, 3, 7, 55, 10], priorWhy: "食後の朝の脱力。",
        steps: [{ test: "k", finding: "低K", why: "低K性周期性四肢麻痺。", probs: [1, 0, 0, 0, 99, 0] }],
        note: "甲状腺機能も調べる。" } },
    { ...M, who: "65歳 男性", vignette: "足の付け根の力が入りにくい。口が渇く。喫煙50年。", faceColor: "#E9C9A0", answer: 5,
      results: r({ k: ["正常", false], csf: ["正常", false], ncs: ["複合筋活動電位が小さい", true], rns: ["高頻度刺激で漸増（waxing）", true], ab: ["抗VGCC抗体 陽性", true], mri: ["異常なし", false], ct: ["肺門に腫瘤（小細胞肺癌）", true] }),
      explanation: "小細胞肺癌に伴う傍腫瘍性のLambert-Eaton症候群。運動すると少し力が出る。自律神経症状（口渇）。",
      flow: { prior: [5, 30, 15, 5, 5, 40], priorWhy: "喫煙者の近位筋の脱力と口渇。",
        steps: [{ test: "rns", finding: "漸増", why: "MGと逆。", probs: [0, 3, 1, 0, 0, 96] }],
        note: "原因の癌を治療する。" } },
  ],
};
