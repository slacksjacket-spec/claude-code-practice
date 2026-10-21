// 熱と関節痛ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const feverContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 6, stampAt: 4,
  tests: [
    { id: "crp", name: "CRP・赤沈", cost: 1 },
    { id: "ana", name: "抗核抗体・抗dsDNA抗体・補体", cost: 1 },
    { id: "ccp", name: "リウマトイド因子・抗CCP抗体", cost: 1 },
    { id: "ck", name: "CK・アルドラーゼ", cost: 1 },
    { id: "fer", name: "フェリチン", cost: 1 },
    { id: "ssa", name: "抗SS-A抗体", cost: 1 },
    { id: "img", name: "関節エコー・MRI", cost: 2 },
  ],
  diagnoses: [
    { name: "全身性エリテマトーデス", short: "SLE" },
    { name: "関節リウマチ", short: "RA" },
    { name: "皮膚筋炎", short: "皮膚筋炎" },
    { name: "成人Still病", short: "Still" },
    { name: "リウマチ性多発筋痛症", short: "PMR" },
    { name: "Sjögren症候群", short: "Sjögren" },
  ],
  cases: [
    { ...M, who: "24歳 女性", vignette: "日光に当たると頬が赤くなる。関節痛と口内炎。", faceColor: "#F4D2B4", answer: 0,
      results: r({ crp: ["赤沈 亢進、CRP ほぼ正常", true], ana: ["抗核抗体・抗dsDNA抗体 陽性、補体低値", true], ccp: ["陰性", false], ck: ["正常", false], fer: ["やや高い", true], ssa: ["陰性", false], img: ["軽い滑膜炎、骨びらんなし", true] }),
      explanation: "SLE。赤沈は上がるがCRPは上がりにくい（感染や漿膜炎で上がる）。関節炎は骨を壊さない。",
      flow: { prior: [45, 15, 10, 10, 5, 15], priorWhy: "若い女性の光線過敏と関節痛。",
        steps: [{ test: "ana", finding: "抗dsDNA陽性・低補体", why: "SLEに特異的。", probs: [95, 1, 1, 1, 0, 2] }], note: "" } },
    { ...M, who: "50歳 女性", vignette: "両手の指の付け根が腫れて、朝のこわばりが2時間。", faceColor: "#EFC9A8", answer: 1,
      results: r({ crp: ["CRP 上昇", true], ana: ["抗核抗体 弱陽性、補体正常", false], ccp: ["RF・抗CCP抗体 陽性", true], ck: ["正常", false], fer: ["正常", false], ssa: ["陰性", false], img: ["滑膜の肥厚と血流、骨びらん", true] }),
      explanation: "関節リウマチ。早くメトトレキサートを始めて骨の破壊を止める。",
      flow: { prior: [10, 55, 5, 5, 10, 15], priorWhy: "左右対称の小関節の腫れと長い朝のこわばり。",
        steps: [{ test: "ccp", finding: "抗CCP抗体陽性", why: "RAに特異的。", probs: [2, 94, 1, 0, 1, 2] }], note: "" } },
    { ...M, who: "55歳 女性", vignette: "まぶたが紫色にむくむ。階段がのぼりにくい。指の関節の背側に赤い盛り上がり。", faceColor: "#F2D0AE", answer: 2,
      results: r({ crp: ["軽い上昇", true], ana: ["陰性", false], ccp: ["陰性", false], ck: ["CK 2,400", true], fer: ["正常", false], ssa: ["陰性", false], img: ["MRIで大腿の筋に炎症", true] }),
      explanation: "皮膚筋炎（ヘリオトロープ疹、Gottron丘疹、近位筋の筋力低下）。悪性腫瘍の合併を探す。",
      flow: { prior: [10, 10, 50, 5, 15, 10], priorWhy: "特徴的な皮疹と近位筋の脱力。",
        steps: [{ test: "ck", finding: "CK高値", why: "筋炎。", probs: [2, 1, 92, 0, 4, 1] }], note: "" } },
    { ...M, who: "30歳 男性", vignette: "夕方に39℃の熱が出て朝には下がる。熱のときだけサーモンピンクの発疹。のどの痛み。", faceColor: "#F2D0AE", answer: 3,
      results: r({ crp: ["CRP 著明に上昇", true], ana: ["陰性", false], ccp: ["陰性", false], ck: ["正常", false], fer: ["フェリチン 12,000", true], ssa: ["陰性", false], img: ["関節に少し液", true] }),
      explanation: "成人Still病。抗体はすべて陰性で、フェリチンが著しく高い。感染症・悪性腫瘍を除いてから診断。",
      flow: { prior: [15, 10, 5, 45, 10, 15], priorWhy: "弛張熱とサーモンピンク疹。",
        steps: [{ test: "fer", finding: "著明高値", why: "Still病らしい。", probs: [3, 1, 1, 93, 1, 1] }], note: "" } },
    { ...M, who: "75歳 女性", vignette: "朝、両肩と腰回りがこわばって起き上がれない。2週間前から。", faceColor: "#EEC4A2", answer: 4,
      results: r({ crp: ["赤沈 80 mm/時", true], ana: ["陰性", false], ccp: ["陰性", false], ck: ["正常", false], fer: ["正常", false], ssa: ["陰性", false], img: ["肩の滑液包炎", true] }),
      explanation: "リウマチ性多発筋痛症。CKは正常（筋炎ではない）。少量のステロイドが劇的に効く。巨細胞性動脈炎の合併に注意。",
      flow: { prior: [3, 20, 15, 5, 50, 7], priorWhy: "高齢者の肩と腰のこわばり。",
        steps: [{ test: "ck", finding: "正常", why: "筋炎は否定的。", probs: [3, 18, 2, 5, 70, 2] }, { test: "ccp", finding: "陰性", why: "RAらしくない。", probs: [3, 5, 2, 5, 83, 2] }], note: "" } },
    { ...M, who: "48歳 女性", vignette: "目がゴロゴロし、パンが水なしで飲み込めない。", faceColor: "#F4D2B4", answer: 5,
      results: r({ crp: ["正常", false], ana: ["抗核抗体 陽性（斑紋型）", true], ccp: ["RF 陽性", true], ck: ["正常", false], fer: ["正常", false], ssa: ["抗SS-A抗体 陽性", true], img: ["唾液腺に点状の影", true] }),
      explanation: "Sjögren症候群。RFが陽性になることもあるが、関節破壊はない。Schirmer試験、口唇生検。",
      flow: { prior: [10, 10, 3, 2, 5, 70], priorWhy: "乾燥症状。",
        steps: [{ test: "ssa", finding: "陽性", why: "Sjögren症候群。", probs: [5, 2, 0, 0, 0, 93] }], note: "" } },
  ],
};
