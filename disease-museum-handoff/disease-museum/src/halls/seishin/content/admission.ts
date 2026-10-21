// 入院形態すごろく（AlgorithmBoard）。TODO(review) 精神保健福祉法の要件（指定医の人数、同意者、期間）
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const admissionContent: ExhibitOf<"AlgorithmBoard">["data"] = {
  stampAt: 4,
  nodes: [
    { id: "consent", label: "本人の同意", question: "本人は入院に同意している？", options: [{ value: "yes", label: "同意している" }, { value: "no", label: "同意しない・できない" }] },
    { id: "harm", label: "自傷他害", question: "精神障害のために自傷他害のおそれがある？", options: [{ value: "yes", label: "ある" }, { value: "no", label: "ない" }] },
    { id: "doctors", label: "指定医", question: "精神保健指定医の診察は？", options: [{ value: "two", label: "2人の指定医が一致して必要と判断" }, { value: "one", label: "急を要し、指定医1人しかいない" }] },
    { id: "family", label: "家族等", question: "家族等の同意は？", options: [{ value: "yes", label: "得られた" }, { value: "no", label: "急を要するが、家族等に連絡がつかない" }] },
  ],
  goalLabel: "入院形態",
  treatments: ["任意入院", "措置入院（都道府県知事の命令）", "緊急措置入院（72時間まで）", "医療保護入院", "応急入院（72時間まで）"],
  patients: [
    { ...M, card: { 年齢: "35", 状況: "うつ病。自分から入院して休みたいと言う" }, path: ["consent", "goal"], answers: { consent: "yes" }, treatments: [0],
      explanation: "本人の同意による任意入院が原則。" },
    { ...M, card: { 年齢: "28", 状況: "幻聴に命令されて包丁を持ち出し、近所の人を襲おうとした", 診察: "指定医2名" }, path: ["consent", "harm", "doctors", "goal"], answers: { consent: "no", harm: "yes", doctors: "two" }, treatments: [1],
      explanation: "自傷他害のおそれがあり、2名の指定医が一致すれば、知事の命令で措置入院。" },
    { ...M, card: { 年齢: "40", 状況: "夜間、刃物を振り回して保護された", 診察: "指定医は1人しか間に合わない" }, path: ["consent", "harm", "doctors", "goal"], answers: { consent: "no", harm: "yes", doctors: "one" }, treatments: [2],
      explanation: "急を要するときは指定医1名で緊急措置入院（72時間以内）。その間に正式な措置診察。" },
    { ...M, card: { 年齢: "70", 状況: "認知症で、食事や服薬ができず入院が必要。本人は判断できない", 家族: "息子が同意" }, path: ["consent", "harm", "family", "goal"], answers: { consent: "no", harm: "no", family: "yes" }, treatments: [3],
      explanation: "自傷他害はないが入院が必要で、本人が同意できない。指定医1名の診察と家族等の同意で医療保護入院。" },
    { ...M, card: { 年齢: "30", 状況: "躁状態で入院が必要だが拒否。身寄りがなく、すぐに家族と連絡がつかない" }, path: ["consent", "harm", "family", "goal"], answers: { consent: "no", harm: "no", family: "no" }, treatments: [4],
      explanation: "急を要し、家族等の同意が得られないときは応急入院（応急入院指定病院、72時間まで）。" },
    { ...M, card: { 年齢: "22", 状況: "統合失調症。入院を拒むが、自傷他害はない", 家族: "母が同意" }, path: ["consent", "harm", "family", "goal"], answers: { consent: "no", harm: "no", family: "yes" }, treatments: [3],
      explanation: "医療保護入院。" },
  ],
};
