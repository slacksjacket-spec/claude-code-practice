// 赤い目ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const redeyeContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 4, stampAt: 4,
  tests: [
    { id: "va", name: "視力", cost: 1 },
    { id: "iop", name: "眼圧", cost: 1 },
    { id: "slit", name: "細隙灯（角膜・前房）", cost: 1 },
    { id: "dis", name: "目やにの性状", cost: 1 },
    { id: "adeno", name: "アデノウイルス迅速検査", cost: 1 },
    { id: "pupil", name: "瞳孔", cost: 1 },
  ],
  diagnoses: [
    { name: "細菌性結膜炎", short: "細菌性" },
    { name: "流行性角結膜炎", short: "EKC" },
    { name: "アレルギー性結膜炎", short: "アレルギー" },
    { name: "急性閉塞隅角緑内障", short: "緑内障" },
    { name: "急性前部ぶどう膜炎", short: "虹彩炎" },
    { name: "結膜下出血", short: "結膜下出血" },
  ],
  cases: [
    { ...M, who: "30歳 女性", vignette: "朝、目やにで目が開かない。両目が赤い。", faceColor: "#F4D2B4", answer: 0,
      results: r({ va: ["正常", false], iop: ["正常", false], slit: ["結膜の充血、角膜はきれい", true], dis: ["黄色く粘り気のある膿性", true], adeno: ["陰性", false], pupil: ["正常", false] }),
      explanation: "膿性の目やには細菌性。抗菌薬の点眼。",
      flow: { prior: [35, 25, 20, 5, 5, 10], priorWhy: "両目の充血と目やに。", steps: [{ test: "dis", finding: "膿性", why: "細菌性らしい。", probs: [80, 10, 3, 2, 3, 2] }], note: "" } },
    { ...M, who: "25歳 男性", vignette: "1週間前に子どもがプールのあと目が赤かった。片目から始まり両目に。耳の前のリンパ節が腫れる。", faceColor: "#F2D0AE", answer: 1,
      results: r({ va: ["やや低下", true], iop: ["正常", false], slit: ["結膜の濾胞、角膜に点状の混濁", true], dis: ["水っぽい漿液性", true], adeno: ["陽性", true], pupil: ["正常", false] }),
      explanation: "アデノウイルスの流行性角結膜炎。感染力が強く、手洗いと器具の消毒。学校は医師が許可するまで出席停止。",
      flow: { prior: [20, 40, 20, 5, 5, 10], priorWhy: "接触歴と耳前リンパ節腫脹。", steps: [{ test: "adeno", finding: "陽性", why: "確定的。", probs: [2, 95, 1, 0, 1, 1] }], note: "" } },
    { ...M, who: "20歳 女性", vignette: "春になると目がかゆく、くしゃみと鼻水も。", faceColor: "#F6D9BE", answer: 2,
      results: r({ va: ["正常", false], iop: ["正常", false], slit: ["結膜の乳頭増殖、むくみ", true], dis: ["さらさらした水っぽい目やに", true], adeno: ["陰性", false], pupil: ["正常", false] }),
      explanation: "かゆみがいちばんの手がかり。抗アレルギー薬の点眼。",
      flow: { prior: [15, 15, 55, 5, 5, 5], priorWhy: "季節性のかゆみ。", steps: [{ test: "adeno", finding: "陰性", why: "ウイルスは否定的。", probs: [15, 3, 70, 4, 4, 4] }], note: "" } },
    { ...M, who: "68歳 女性", vignette: "夜、暗い映画館で急に右目が痛み、頭痛と吐き気。かすんで見える。", faceColor: "#EEC4A2", answer: 3,
      results: r({ va: ["著しく低下", true], iop: ["55 mmHg", true], slit: ["角膜が濁り、前房が浅い", true], dis: ["なし", false], adeno: ["陰性", false], pupil: ["中等度に散大、光に反応しない", true] }),
      explanation: "急性閉塞隅角緑内障。暗所で散瞳したことが引き金。すぐに眼圧を下げる。",
      flow: { prior: [5, 5, 5, 50, 25, 10], priorWhy: "暗い所での急な痛みと頭痛。", steps: [{ test: "iop", finding: "55", why: "急性緑内障。", probs: [0, 0, 0, 96, 4, 0] }], note: "" } },
    { ...M, who: "30歳 男性", vignette: "腰の痛みが続いている。右目がまぶしく痛い。", faceColor: "#F2D0AE", answer: 4,
      results: r({ va: ["やや低下", true], iop: ["正常", false], slit: ["前房に炎症細胞、角膜の周りが赤い（毛様充血）", true], dis: ["なし", false], adeno: ["陰性", false], pupil: ["小さく、形がいびつ", true] }),
      explanation: "急性前部ぶどう膜炎。強直性脊椎炎（HLA-B27）に合併。ステロイドと散瞳薬の点眼（癒着を防ぐ）。",
      flow: { prior: [10, 10, 5, 15, 45, 15], priorWhy: "腰痛とまぶしさ。", steps: [{ test: "slit", finding: "前房の炎症", why: "ぶどう膜炎。", probs: [1, 2, 1, 4, 91, 1] }], note: "" } },
    { ...M, who: "70歳 男性", vignette: "朝起きたら白目が真っ赤になっていた。痛みも見え方の変化もない。", faceColor: "#EFC9A8", answer: 5,
      results: r({ va: ["正常", false], iop: ["正常", false], slit: ["結膜の下にべったりした出血、角膜・前房はきれい", true], dis: ["なし", false], adeno: ["陰性", false], pupil: ["正常", false] }),
      explanation: "結膜下出血。1〜2週で自然に吸収される。くり返すなら血圧や出血傾向を確認。",
      flow: { prior: [10, 10, 5, 5, 5, 65], priorWhy: "痛みも視力低下もない赤い目。", steps: [{ test: "slit", finding: "結膜下の出血", why: "確定。", probs: [1, 1, 0, 0, 0, 98] }], note: "" } },
  ],
};
