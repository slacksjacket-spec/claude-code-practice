// 帰国後の発熱ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const travelContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 5, stampAt: 4,
  tests: [
    { id: "smear", name: "血液塗抹（厚層・薄層）", cost: 1 },
    { id: "cbc", name: "血算", cost: 1 },
    { id: "bc", name: "血液培養", cost: 1 },
    { id: "lft", name: "肝機能・IgM-HA抗体", cost: 1 },
    { id: "ns1", name: "デングNS1抗原", cost: 1 },
    { id: "cxr", name: "胸部X線・喀痰", cost: 1 },
    { id: "flu", name: "インフルエンザ迅速検査", cost: 1 },
  ],
  diagnoses: [
    { name: "熱帯熱マラリア", short: "マラリア" },
    { name: "デング熱", short: "デング" },
    { name: "腸チフス", short: "腸チフス" },
    { name: "A型肝炎", short: "A型肝炎" },
    { name: "肺結核", short: "結核" },
    { name: "インフルエンザ", short: "インフル" },
  ],
  cases: [
    { ...M, who: "35歳 男性", vignette: "西アフリカから帰国して10日。予防内服はしていない。高熱と悪寒。", faceColor: "#F2D0AE", answer: 0,
      results: r({ smear: ["赤血球の中に輪状体が多数（寄生率 6%）", true], cbc: ["血小板 4万", true], bc: ["陰性", false], lft: ["ビリルビン軽度上昇、IgM-HA 陰性", true], ns1: ["陰性", false], cxr: ["異常なし", false], flu: ["陰性", false] }),
      explanation: "熱帯熱マラリアは急に重症化する。アフリカ帰りの発熱は、まず血液塗抹を（陰性でも12〜24時間おきにくり返す）。",
      flow: { prior: [45, 15, 15, 10, 5, 10], priorWhy: "アフリカ帰国後の発熱。",
        steps: [{ test: "smear", finding: "輪状体", why: "マラリア確定。", probs: [99, 0, 1, 0, 0, 0] }], note: "重症なら注射薬。" } },
    { ...M, who: "28歳 女性", vignette: "東南アジアから帰国して5日。高熱、目の奥の痛み、筋肉痛。", faceColor: "#F4D2B4", answer: 1,
      results: r({ smear: ["陰性", false], cbc: ["白血球 2,500、血小板 6万", true], bc: ["陰性", false], lft: ["AST軽度上昇、IgM-HA 陰性", true], ns1: ["陽性", true], cxr: ["異常なし", false], flu: ["陰性", false] }),
      explanation: "デング熱。蚊（ネッタイシマカ・ヒトスジシマカ）が運ぶ。解熱のころに出血や血漿漏出（重症デング）に注意。NSAIDsは避けてアセトアミノフェン。",
      flow: { prior: [20, 40, 10, 10, 5, 15], priorWhy: "アジア帰国、潜伏期の短い発熱と筋肉痛。",
        steps: [{ test: "cbc", finding: "白血球・血小板減少", why: "デングらしい。", probs: [15, 70, 8, 3, 1, 3] }, { test: "ns1", finding: "陽性", why: "確定。", probs: [1, 98, 0, 0, 0, 1] }], note: "" } },
    { ...M, who: "40歳 男性", vignette: "南アジアから帰国して2週間。じわじわ上がる熱。熱のわりに脈が遅い。", faceColor: "#EFC9A8", answer: 2,
      results: r({ smear: ["陰性", false], cbc: ["白血球 3,800（好酸球 消失）", true], bc: ["グラム陰性桿菌（Salmonella Typhi）", true], lft: ["AST軽度上昇、IgM-HA 陰性", true], ns1: ["陰性", false], cxr: ["異常なし", false], flu: ["陰性", false] }),
      explanation: "腸チフス。比較的徐脈、バラ疹、脾腫。血液培養で確定。キノロン耐性が多く、セフトリアキソンやアジスロマイシン。",
      flow: { prior: [20, 20, 30, 15, 5, 10], priorWhy: "南アジア帰国、段階的な発熱と比較的徐脈。",
        steps: [{ test: "bc", finding: "Salmonella Typhi", why: "確定。", probs: [0, 0, 100, 0, 0, 0] }], note: "" } },
    { ...M, who: "25歳 男性", vignette: "東南アジアで屋台の生ガキを食べた。1か月後に発熱、だるさ、黄疸。", faceColor: "#F2D7A0", answer: 3,
      results: r({ smear: ["陰性", false], cbc: ["正常", false], bc: ["陰性", false], lft: ["AST 2,800、ALT 3,200、IgM-HA 陽性", true], ns1: ["陰性", false], cxr: ["異常なし", false], flu: ["陰性", false] }),
      explanation: "A型肝炎。潜伏期は2〜6週。慢性化しない。ワクチンで予防できる。",
      flow: { prior: [10, 5, 10, 60, 5, 10], priorWhy: "生ものの摂取と黄疸。",
        steps: [{ test: "lft", finding: "IgM-HA陽性", why: "確定。", probs: [0, 0, 0, 100, 0, 0] }], note: "" } },
    { ...M, who: "50歳 男性", vignette: "フィリピンで長く働いて帰国。2か月続く咳と微熱、寝汗、体重減少。", faceColor: "#E9C9A0", answer: 4,
      results: r({ smear: ["陰性", false], cbc: ["軽い貧血", true], bc: ["陰性", false], lft: ["正常", false], ns1: ["陰性", false], cxr: ["右上葉に空洞、喀痰の抗酸菌塗抹 陽性", true], flu: ["陰性", false] }),
      explanation: "肺結核。空気感染なので陰圧個室へ。4剤（イソニアジド、リファンピシン、ピラジナミド、エタンブトール）。保健所へ届出。",
      flow: { prior: [5, 5, 10, 5, 65, 10], priorWhy: "長引く咳と寝汗。",
        steps: [{ test: "cxr", finding: "空洞と塗抹陽性", why: "結核。", probs: [0, 0, 0, 0, 100, 0] }], note: "" } },
    { ...M, who: "30歳 女性", vignette: "冬にオーストラリアから帰国して2日。急な高熱、関節痛、咳。", faceColor: "#F6D9BE", answer: 5,
      results: r({ smear: ["陰性", false], cbc: ["正常", false], bc: ["陰性", false], lft: ["正常", false], ns1: ["陰性", false], cxr: ["異常なし", false], flu: ["A型 陽性", true] }),
      explanation: "南半球は日本と季節が逆。帰国後の発熱でもありふれた病気が多い。",
      flow: { prior: [5, 10, 5, 5, 5, 70], priorWhy: "南半球の冬からの帰国、急な発熱と咳。",
        steps: [{ test: "flu", finding: "A型陽性", why: "確定。", probs: [0, 0, 0, 0, 0, 100] }], note: "" } },
  ],
};
