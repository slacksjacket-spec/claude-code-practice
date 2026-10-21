// Cushing症候群すごろく（AlgorithmBoard）。TODO(review) 検査の順序と判定（1 mg デキサメタゾン抑制試験の基準など）
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const cushingContent: ExhibitOf<"AlgorithmBoard">["data"] = {
  stampAt: 4,
  nodes: [
    { id: "dex1", label: "一晩少量デキサメタゾン", question: "1 mg デキサメタゾン翌朝のコルチゾールは？", options: [{ value: "sup", label: "抑えられた" }, { value: "no", label: "抑えられない" }] },
    { id: "acth", label: "血中ACTH", question: "血中ACTHは？", options: [{ value: "low", label: "低い（抑えられている）" }, { value: "high", label: "正常〜高い" }] },
    { id: "hdex", label: "大量デキサメタゾン", question: "8 mg デキサメタゾンでコルチゾールは？", options: [{ value: "sup", label: "半分以下に抑えられた" }, { value: "no", label: "抑えられない" }] },
  ],
  goalLabel: "診断と治療",
  treatments: [
    "Cushing症候群ではない（肥満などの生活指導）",
    "副腎腫瘍 → 腹腔鏡で副腎摘出",
    "Cushing病 → 経蝶形骨洞手術",
    "異所性ACTH産生腫瘍 → 原発巣を探して切除",
  ],
  patients: [
    { ...M, card: { 年齢: "38", 性別: "女性", 所見: "単純な肥満、皮膚線条は白い" }, path: ["dex1", "goal"], answers: { dex1: "sup" }, treatments: [0],
      explanation: "少量で抑えられればCushing症候群は否定的。" },
    { ...M, card: { 年齢: "44", 性別: "女性", 所見: "満月様顔貌・高血圧・糖尿病", CT: "左副腎に腫瘍" }, path: ["dex1", "acth", "goal"], answers: { dex1: "no", acth: "low" }, treatments: [1],
      explanation: "ACTHが抑えられていれば副腎が原因（ACTH非依存性）。" },
    { ...M, card: { 年齢: "32", 性別: "女性", 所見: "中心性肥満・赤紫色の皮膚線条・月経不順" }, path: ["dex1", "acth", "hdex", "goal"], answers: { dex1: "no", acth: "high", hdex: "sup" }, treatments: [2],
      explanation: "ACTH依存性で、大量なら抑えられる＝下垂体の腺腫（フィードバックがまだ少し効く）。" },
    { ...M, card: { 年齢: "65", 性別: "男性", 所見: "急に進む筋力低下・色素沈着", 血液: "低K血症が強い", 既往: "喫煙50年" }, path: ["dex1", "acth", "hdex", "goal"], answers: { dex1: "no", acth: "high", hdex: "no" }, treatments: [3],
      explanation: "小細胞肺癌やカルチノイドがACTHを出す。量が多く、低K血症と色素沈着が目立つ。" },
    { ...M, card: { 年齢: "58", 性別: "男性", 所見: "高血圧・耐糖能異常、典型的な外見はない", CT: "偶然見つかった右副腎腫瘍" }, path: ["dex1", "acth", "goal"], answers: { dex1: "no", acth: "low" }, treatments: [1],
      explanation: "副腎偶発腫からのサブクリニカルCushing症候群。" },
    { ...M, card: { 年齢: "29", 性別: "女性", 所見: "体重増加・にきび・多毛", MRI: "下垂体に小さな腺腫" }, path: ["dex1", "acth", "hdex", "goal"], answers: { dex1: "no", acth: "high", hdex: "sup" }, treatments: [2],
      explanation: "Cushing病。微小腺腫が多く、MRIで見えないときは下錐体静脈洞サンプリング。" },
  ],
};
