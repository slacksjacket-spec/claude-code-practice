// 下腹部痛ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const painContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 5, stampAt: 4,
  tests: [
    { id: "hcg", name: "妊娠反応（尿hCG）", cost: 1 },
    { id: "us", name: "経腟エコー", cost: 1 },
    { id: "cbc", name: "血算・CRP", cost: 1 },
    { id: "chl", name: "子宮頸管のクラミジア・淋菌検査", cost: 1 },
    { id: "ca125", name: "CA125", cost: 1 },
    { id: "ct", name: "腹部CT", cost: 2 },
  ],
  diagnoses: [
    { name: "異所性妊娠", short: "異所性" },
    { name: "卵巣嚢腫の茎捻転", short: "茎捻転" },
    { name: "骨盤内炎症性疾患", short: "PID" },
    { name: "黄体出血", short: "黄体出血" },
    { name: "急性虫垂炎", short: "虫垂炎" },
    { name: "子宮内膜症", short: "内膜症" },
  ],
  cases: [
    { ...M, who: "27歳 女性", vignette: "月経が2週間遅れている。急な下腹部痛とめまい。", faceColor: "#F4D2B4", answer: 0,
      results: r({ hcg: ["陽性", true], us: ["子宮内に胎嚢なし、ダグラス窩に液体", true], cbc: ["Hb 9.0", true], chl: ["陰性", false], ca125: ["正常", false], ct: ["腹腔内に出血", true] }),
      explanation: "妊娠反応陽性で子宮内に胎嚢がなく、腹腔内出血。異所性妊娠の破裂。ショックなら緊急手術。",
      flow: { prior: [30, 15, 15, 20, 10, 10], priorWhy: "生殖年齢の女性の急な下腹部痛。まず妊娠反応。",
        steps: [{ test: "hcg", finding: "陽性", why: "妊娠に関連する病気が一気に上位に。", probs: [80, 5, 3, 7, 3, 2] }, { test: "us", finding: "子宮内に胎嚢なし", why: "異所性妊娠。", probs: [96, 1, 1, 1, 1, 0] }], note: "" } },
    { ...M, who: "22歳 女性", vignette: "運動中に急に片側の下腹部が激痛。吐き気。", faceColor: "#F6D9BE", answer: 1,
      results: r({ hcg: ["陰性", false], us: ["6 cmの卵巣腫瘤、ドプラで血流が乏しい", true], cbc: ["白血球 軽度上昇", true], chl: ["陰性", false], ca125: ["正常", false], ct: ["卵巣腫瘤と渦巻き状の茎", true] }),
      explanation: "卵巣嚢腫（皮様嚢腫が多い）の茎捻転。卵巣を救うため早く手術。",
      flow: { prior: [15, 30, 15, 15, 15, 10], priorWhy: "運動中の突然の片側の痛み。",
        steps: [{ test: "us", finding: "卵巣腫瘤・血流低下", why: "茎捻転。", probs: [2, 90, 2, 3, 2, 1] }], note: "" } },
    { ...M, who: "20歳 女性", vignette: "数日前から両側の下腹部痛と発熱、おりものが増えた。", faceColor: "#F2D0AE", answer: 2,
      results: r({ hcg: ["陰性", false], us: ["卵管がやや腫れている", true], cbc: ["白血球 13,000、CRP 8", true], chl: ["クラミジア陽性", true], ca125: ["軽度上昇", true], ct: ["骨盤内の炎症", true] }),
      explanation: "骨盤内炎症性疾患。子宮頸部を動かすと痛い。肝周囲炎（Fitz-Hugh-Curtis症候群）や不妊・異所性妊娠の原因に。パートナーも治療。",
      flow: { prior: [10, 10, 40, 10, 20, 10], priorWhy: "発熱と帯下の増加。",
        steps: [{ test: "chl", finding: "クラミジア陽性", why: "PID。", probs: [2, 1, 90, 1, 5, 1] }], note: "" } },
    { ...M, who: "25歳 女性", vignette: "月経周期の後半（排卵から1週間）、性交後に右下腹部痛。", faceColor: "#F4D2B4", answer: 3,
      results: r({ hcg: ["陰性", false], us: ["右卵巣のまわりに血の塊、ダグラス窩に少量の液体", true], cbc: ["Hb 11.5", false], chl: ["陰性", false], ca125: ["正常", false], ct: ["右付属器のまわりに出血", true] }),
      explanation: "黄体出血。黄体期、性交後に多い。多くは安静で治まる。",
      flow: { prior: [20, 15, 10, 25, 20, 10], priorWhy: "黄体期と性交後。",
        steps: [{ test: "hcg", finding: "陰性", why: "異所性妊娠は否定的。", probs: [2, 20, 12, 33, 23, 10] }, { test: "us", finding: "卵巣周囲の出血", why: "黄体出血。", probs: [1, 3, 2, 88, 4, 2] }], note: "" } },
    { ...M, who: "19歳 女性", vignette: "みぞおちから右下腹部へ移る痛み。食欲がない。", faceColor: "#F6D9BE", answer: 4,
      results: r({ hcg: ["陰性", false], us: ["子宮・卵巣に異常なし", false], cbc: ["白血球 14,000", true], chl: ["陰性", false], ca125: ["正常", false], ct: ["腫れた虫垂、糞石", true] }),
      explanation: "女性の右下腹部痛でも虫垂炎は多い。婦人科の病気を除いたうえでCT。",
      flow: { prior: [10, 10, 15, 10, 45, 10], priorWhy: "痛みの移動は虫垂炎らしい。",
        steps: [{ test: "ct", finding: "腫れた虫垂", why: "確定。", probs: [0, 1, 1, 1, 96, 1] }], note: "" } },
    { ...M, who: "33歳 女性", vignette: "年々ひどくなる月経痛。妊娠しない。", faceColor: "#F2D0AE", answer: 5,
      results: r({ hcg: ["陰性", false], us: ["卵巣に内部が均一な嚢胞（チョコレート嚢胞）", true], cbc: ["正常", false], chl: ["陰性", false], ca125: ["CA125 上昇", true], ct: ["卵巣嚢胞", true] }),
      explanation: "子宮内膜症。低用量エストロゲン・プロゲスチン配合薬、ジエノゲストなど。",
      flow: { prior: [3, 10, 10, 5, 2, 70], priorWhy: "慢性の月経痛と不妊。",
        steps: [{ test: "us", finding: "チョコレート嚢胞", why: "内膜症。", probs: [0, 4, 1, 1, 0, 94] }], note: "" } },
  ],
};
