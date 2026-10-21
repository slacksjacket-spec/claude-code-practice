// めまいラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const vertigoContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 5, stampAt: 4,
  tests: [
    { id: "dix", name: "頭位変換眼振検査（Dix-Hallpike）", cost: 1 },
    { id: "nys", name: "注視眼振", cost: 1 },
    { id: "neuro", name: "神経所見（構音・協調運動・歩行）", cost: 1 },
    { id: "pta", name: "聴力検査", cost: 1 },
    { id: "cal", name: "温度眼振検査（カロリック）", cost: 1 },
    { id: "mri", name: "頭部MRI", cost: 2 },
  ],
  diagnoses: [
    { name: "良性発作性頭位めまい症", short: "BPPV" },
    { name: "メニエール病", short: "メニエール" },
    { name: "前庭神経炎", short: "前庭神経炎" },
    { name: "小脳梗塞", short: "小脳梗塞" },
    { name: "聴神経腫瘍", short: "聴神経腫瘍" },
    { name: "突発性難聴（めまいを伴う）", short: "突発性難聴" },
  ],
  cases: [
    { ...M, who: "60歳 女性", vignette: "寝返りを打つと、ぐるぐる回るめまいが数十秒。聞こえは普通。", faceColor: "#EFC9A8", answer: 0,
      results: r({ dix: ["右下で回旋性の眼振（数秒遅れて出て、30秒以内に消える）", true], nys: ["なし", false], neuro: ["正常", false], pta: ["正常", false], cal: ["正常", false], mri: ["異常なし", false] }),
      explanation: "耳石が後半規管に入り込む。Epley法などの頭位治療で治る。",
      flow: { prior: [50, 15, 15, 10, 5, 5], priorWhy: "頭を動かしたときだけの短いめまい。", steps: [{ test: "dix", finding: "陽性", why: "BPPV。", probs: [95, 1, 1, 2, 0, 1] }], note: "" } },
    { ...M, who: "40歳 女性", vignette: "数時間続く回転性めまいをくり返す。そのたびに右耳が詰まり、耳鳴り。", faceColor: "#F4D2B4", answer: 1,
      results: r({ dix: ["陰性", false], nys: ["発作中は水平性の眼振", true], neuro: ["正常", false], pta: ["右の低音障害型の感音難聴", true], cal: ["右がやや低下", true], mri: ["異常なし", false] }),
      explanation: "内リンパ水腫。ストレスや睡眠不足が誘因。",
      flow: { prior: [15, 45, 10, 5, 10, 15], priorWhy: "くり返す数時間のめまいと耳の症状。", steps: [{ test: "pta", finding: "低音の感音難聴", why: "メニエール病らしい。", probs: [2, 80, 2, 1, 8, 7] }], note: "" } },
    { ...M, who: "35歳 男性", vignette: "かぜの1週間後、急に激しい回転性めまい。丸1日続き、吐く。聞こえは普通。", faceColor: "#F2D0AE", answer: 2,
      results: r({ dix: ["陰性", false], nys: ["左向きの水平性眼振（一方向性）", true], neuro: ["正常、歩けるがふらつく", false], pta: ["正常", false], cal: ["右の反応がない", true], mri: ["異常なし", false] }),
      explanation: "前庭神経の炎症。難聴はない。数日で落ち着き、リハビリで代償される。",
      flow: { prior: [10, 10, 40, 25, 5, 10], priorWhy: "持続する急なめまい。小脳梗塞の除外が必要。", steps: [{ test: "neuro", finding: "正常", why: "中枢性らしくない。", probs: [10, 10, 60, 8, 5, 7] }, { test: "cal", finding: "片側の反応なし", why: "前庭神経炎。", probs: [2, 3, 88, 3, 2, 2] }], note: "" } },
    { ...M, who: "70歳 男性", vignette: "高血圧と心房細動。急なめまいで立てない。しゃべりにくい。", faceColor: "#EEC4A2", answer: 3,
      results: r({ dix: ["—", false], nys: ["見る方向で向きが変わる眼振", true], neuro: ["右の指鼻試験が拙劣、座っていられない", true], pta: ["正常", false], cal: ["正常", false], mri: ["右小脳半球の梗塞", true] }),
      explanation: "中枢性めまい。方向交代性の眼振、構音障害、体幹失調。ふらついて座れないのは危険なサイン。",
      flow: { prior: [10, 5, 30, 40, 5, 10], priorWhy: "血管危険因子と急なめまい。", steps: [{ test: "neuro", finding: "小脳症状", why: "中枢性。", probs: [1, 1, 5, 90, 2, 1] }], note: "初期のCTでは見えないことが多い。MRIで。" } },
    { ...M, who: "55歳 女性", vignette: "数年かけて左耳が聞こえにくくなり、耳鳴りとふらつき。", faceColor: "#F4D2B4", answer: 4,
      results: r({ dix: ["陰性", false], nys: ["なし", false], neuro: ["左の角膜反射が弱い", true], pta: ["左の高音の感音難聴、語音明瞭度が悪い", true], cal: ["左が低下", true], mri: ["左の内耳道に造影される腫瘍", true] }),
      explanation: "前庭神経鞘腫。片側の進行する感音難聴はMRIで除外。",
      flow: { prior: [5, 20, 5, 5, 45, 20], priorWhy: "片側のゆっくり進む難聴。", steps: [{ test: "mri", finding: "内耳道の腫瘍", why: "確定。", probs: [0, 0, 0, 0, 100, 0] }], note: "" } },
    { ...M, who: "45歳 男性", vignette: "朝起きたら急に右耳が聞こえず、めまいもする。くり返したことはない。", faceColor: "#F2D0AE", answer: 5,
      results: r({ dix: ["陰性", false], nys: ["左向きの眼振", true], neuro: ["正常", false], pta: ["右の高度な感音難聴", true], cal: ["右が低下", true], mri: ["異常なし", false] }),
      explanation: "めまいを伴う突発性難聴は回復が悪い傾向。早くステロイド。",
      flow: { prior: [10, 20, 20, 10, 10, 30], priorWhy: "急な片側難聴とめまい、初めて。", steps: [{ test: "pta", finding: "高度な感音難聴", why: "突発性難聴。", probs: [1, 15, 2, 3, 9, 70] }, { test: "mri", finding: "異常なし", why: "腫瘍や梗塞を除外。", probs: [1, 15, 1, 0, 0, 83] }], note: "初回のメニエール病との区別は経過で。" } },
  ],
};
