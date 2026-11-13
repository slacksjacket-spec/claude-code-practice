// 窓口負担すごろく（AlgorithmBoard）。患者はすべて架空。
// TODO(review) 自己負担の割合（年齢・所得の区分）は記憶から書いた。制度改正で変わるので要確認
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: ["厚生労働省 医療費の一部負担（自己負担）割合について https://www.mhlw.go.jp/bunya/shakaihosho/iryouseido01/dl/info02d-37.pdf", "厚生労働省 後期高齢者の窓口負担割合の変更（令和4年10月）https://www.mhlw.go.jp/content/000937919.pdf"] };

export const insuranceContent: ExhibitOf<"AlgorithmBoard">["data"] = {
  stampAt: 4,
  nodes: [
    { id: "welfare", label: "生活保護", question: "生活保護を受けている？", options: [{ value: "yes", label: "受けている" }, { value: "no", label: "受けていない" }] },
    { id: "age", label: "年齢", question: "年齢は？", options: [{ value: "pre", label: "小学校に入る前" }, { value: "work", label: "小学生〜69歳" }, { value: "7074", label: "70〜74歳" }, { value: "75", label: "75歳以上" }] },
    { id: "income", label: "所得", question: "所得は？", options: [{ value: "std", label: "一般" }, { value: "mid", label: "一定以上（75歳以上の区分）" }, { value: "high", label: "現役並み" }] },
  ],
  goalLabel: "窓口で払う割合",
  treatments: ["自己負担なし（医療扶助）", "1割", "2割", "3割"],
  patients: [
    { ...M, card: { 年齢: "4", 保険: "父の健康保険の被扶養者" },
      path: ["welfare", "age", "goal"], answers: { welfare: "no", age: "pre" }, treatments: [2],
      explanation: "義務教育就学前は2割（実際は自治体の助成でさらに軽くなることが多い）。" },
    { ...M, card: { 年齢: "35", 保険: "会社員（健康保険組合）" },
      path: ["welfare", "age", "goal"], answers: { welfare: "no", age: "work" }, treatments: [3],
      explanation: "小学生から69歳までは3割。会社員は被用者保険（協会けんぽ・健保組合・共済）、自営業や無職は国民健康保険。高くなりすぎたら高額療養費制度。" },
    { ...M, card: { 年齢: "72", 保険: "国民健康保険", 所得: "年金のみ（一般）" },
      path: ["welfare", "age", "income", "goal"], answers: { welfare: "no", age: "7074", income: "std" }, treatments: [2],
      explanation: "70〜74歳は2割。まだ後期高齢者医療制度ではなく、それまでの保険のまま。" },
    { ...M, card: { 年齢: "71", 保険: "健康保険（会社役員）", 所得: "現役並み" },
      path: ["welfare", "age", "income", "goal"], answers: { welfare: "no", age: "7074", income: "high" }, treatments: [3],
      explanation: "70歳以上でも、現役並みの所得があれば3割。" },
    { ...M, card: { 年齢: "80", 保険: "後期高齢者医療制度", 所得: "年金のみ（一般）" },
      path: ["welfare", "age", "income", "goal"], answers: { welfare: "no", age: "75", income: "std" }, treatments: [1],
      explanation: "75歳になると全員が後期高齢者医療制度へ（運営は都道府県ごとの広域連合）。一般は1割。" },
    { ...M, card: { 年齢: "78", 保険: "後期高齢者医療制度", 所得: "一定以上" },
      path: ["welfare", "age", "income", "goal"], answers: { welfare: "no", age: "75", income: "mid" }, treatments: [2],
      explanation: "75歳以上で一定以上の所得がある人は2割（2022年から）。" },
    { ...M, card: { 年齢: "82", 保険: "後期高齢者医療制度", 所得: "現役並み" },
      path: ["welfare", "age", "income", "goal"], answers: { welfare: "no", age: "75", income: "high" }, treatments: [3],
      explanation: "75歳以上でも現役並みの所得なら3割。" },
    { ...M, card: { 年齢: "50", 状況: "生活保護を受けている" },
      path: ["welfare", "goal"], answers: { welfare: "yes" }, treatments: [0],
      explanation: "生活保護を受けると国民健康保険から外れ、医療費は全額が公費の医療扶助（現物給付）でまかなわれる。" },
  ],
};
