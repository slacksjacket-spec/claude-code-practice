// 胸水ラボ（DiagnosisLab）。値は架空。確率バーは手で決めたイメージ値。TODO(review) Lightの基準、ADA、pH・糖の解釈
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const pleuralContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 7, stampAt: 4,
  tests: [
    { id: "look", name: "胸水の外観", cost: 1 },
    { id: "light", name: "蛋白・LDH（Lightの基準）", cost: 1 },
    { id: "ph", name: "胸水のpH・糖", cost: 1 },
    { id: "ada", name: "ADA", cost: 1 },
    { id: "cyto", name: "細胞数・分画と細胞診", cost: 2 },
    { id: "gram", name: "グラム染色・培養", cost: 2 },
    { id: "ct", name: "胸部造影CT", cost: 3 },
  ],
  diagnoses: [
    { name: "心不全（漏出性）", short: "心不全" },
    { name: "肝硬変による胸水（漏出性）", short: "肝性胸水" },
    { name: "肺炎随伴性胸水", short: "肺炎随伴" },
    { name: "膿胸", short: "膿胸" },
    { name: "結核性胸膜炎", short: "結核性" },
    { name: "癌性胸膜炎", short: "癌性" },
  ],
  cases: [
    { ...M, who: "78歳 男性", vignette: "息切れと両足のむくみ。両側に胸水。", faceColor: "#F2C6A0", answer: 0,
      results: r({ look: ["淡黄色・透明", false], light: ["3項目とも満たさない＝漏出性", false], ph: ["pH 7.46、糖は血糖と同じくらい", false], ada: ["低値", false], cyto: ["細胞は少ない、悪性細胞なし", false], gram: ["菌なし", false], ct: ["両側の胸水と心拡大", true] }),
      explanation: "両側性で漏出性、心拡大とむくみ。心不全による胸水。利尿薬で治療。",
      flow: { prior: [55, 15, 10, 5, 5, 10], priorWhy: "両側の胸水とむくみ。まず心不全を考える。",
        steps: [{ test: "light", finding: "漏出性", why: "漏出性なら、胸膜そのものの病気（感染・結核・癌）は考えにくい。", probs: [80, 16, 1, 0, 1, 2] }],
        note: "漏出性とわかれば、原因（心不全・肝硬変・ネフローゼ）を全身から探す。胸水の追加検査はあまり要らない。" } },
    { ...M, who: "60歳 男性", vignette: "大量飲酒歴。おなかが張っている。右だけに胸水。", faceColor: "#EED29A", answer: 1,
      results: r({ look: ["淡黄色・透明", false], light: ["漏出性", false], ph: ["pH 7.45、糖は正常", false], ada: ["低値", false], cyto: ["細胞は少ない", false], gram: ["菌なし", false], ct: ["肝臓の萎縮と腹水、右胸水", true] }),
      explanation: "腹水が横隔膜の小さな穴を通って右胸腔へ。肝性胸水。",
      flow: { prior: [20, 50, 8, 5, 5, 12], priorWhy: "肝硬変を疑わせる病歴と腹水。右側の胸水。",
        steps: [
          { test: "light", finding: "漏出性", why: "漏出性で、胸膜の病気は否定的。", probs: [25, 70, 1, 0, 1, 3] },
          { test: "ct", finding: "肝萎縮と腹水", why: "肝硬変と腹水を確認。", probs: [5, 93, 0, 0, 0, 2] },
        ],
        note: "肝性胸水は右側が多い。" } },
    { ...M, who: "35歳 男性", vignette: "3日前から発熱と咳。右の胸水は少量。", faceColor: "#F4D2B4", answer: 2,
      results: r({ look: ["淡黄色・やや混濁", true], light: ["滲出性（好中球優位）", true], ph: ["pH 7.38、糖は正常", false], ada: ["やや高い", false], cyto: ["好中球が多い、悪性細胞なし", true], gram: ["菌は見えない", false], ct: ["右下葉の肺炎と少量の胸水", true] }),
      explanation: "肺炎に伴う滲出性胸水で、pH・糖が保たれ菌もいない（単純性）。抗菌薬で治る。",
      flow: { prior: [5, 3, 50, 25, 10, 7], priorWhy: "肺炎の症状に少量の胸水。肺炎随伴性胸水か膿胸か。",
        steps: [
          { test: "light", finding: "滲出性", why: "胸膜に炎症がある。", probs: [1, 1, 52, 28, 11, 7] },
          { test: "ph", finding: "pHも糖も保たれている", why: "膿胸（複雑性）ならpH・糖が下がる。単純性の肺炎随伴性胸水。", probs: [1, 0, 86, 4, 6, 3] },
        ],
        note: "pH 7.2未満、糖が低い、グラム染色で菌が見える、膿性なら、ドレナージが必要。" } },
    { ...M, who: "55歳 男性", vignette: "糖尿病。1週間の高熱と胸痛。", faceColor: "#EFC9A8", answer: 3,
      results: r({ look: ["膿性・悪臭", true], light: ["滲出性", true], ph: ["pH 6.9、糖は著明に低い", true], ada: ["高値", true], cyto: ["好中球が非常に多い", true], gram: ["グラム陽性球菌と嫌気性菌", true], ct: ["被包化された胸水、胸膜の造影（split pleura sign）", true] }),
      explanation: "膿性の胸水は膿胸。抗菌薬に加えて胸腔ドレナージ。",
      flow: { prior: [3, 2, 30, 50, 8, 7], priorWhy: "糖尿病の人の高熱と胸痛。膿胸を疑う。",
        steps: [{ test: "look", finding: "膿性・悪臭", why: "見た目が膿なら膿胸で確定。悪臭は嫌気性菌。", probs: [0, 0, 2, 97, 1, 0] }],
        note: "まず見た目を見る。それだけで決まることもある。" } },
    { ...M, who: "25歳 男性", vignette: "1か月の微熱、寝汗、体重減少。左の胸水。", faceColor: "#F2D0AE", answer: 4,
      results: r({ look: ["黄色・やや混濁", true], light: ["滲出性（リンパ球優位）", true], ph: ["pH 7.32、糖はやや低い", true], ada: ["高値（70 U/L）", true], cyto: ["リンパ球が多い、悪性細胞なし", true], gram: ["一般細菌なし、抗酸菌塗抹は陰性", false], ct: ["片側の胸水", true] }),
      explanation: "若年者のリンパ球優位の滲出性胸水でADA高値。結核性胸膜炎。胸水の抗酸菌は見つかりにくいので、ADAが役立つ。",
      flow: { prior: [3, 2, 15, 10, 45, 25], priorWhy: "若い人の亜急性の発熱と寝汗。結核を考える。",
        steps: [
          { test: "light", finding: "滲出性", why: "胸膜の病気。", probs: [1, 1, 15, 10, 46, 27] },
          { test: "ada", finding: "高値", why: "ADA高値は結核性を強く示す。", probs: [0, 0, 4, 3, 85, 8] },
        ],
        note: "胸水の抗酸菌の塗抹・培養は陽性率が低い。胸膜生検で確定することもある。" } },
    { ...M, who: "72歳 男性", vignette: "喫煙50年。体重が減っている。血の混じった胸水。", faceColor: "#EEC4A2", answer: 5,
      results: r({ look: ["血性", true], light: ["滲出性", true], ph: ["pH 7.30、糖はやや低い", true], ada: ["低値", false], cyto: ["腺癌の細胞", true], gram: ["菌なし", false], ct: ["右肺の腫瘤と胸膜の結節", true] }),
      explanation: "血性の滲出性胸水で、細胞診で腺癌。肺癌の胸膜播種（癌性胸膜炎）。",
      flow: { prior: [10, 3, 5, 5, 12, 65], priorWhy: "高齢喫煙者の体重減少と血性胸水。癌性胸膜炎を疑う。",
        steps: [{ test: "cyto", finding: "腺癌の細胞", why: "細胞診で悪性細胞が見つかれば確定。", probs: [0, 0, 0, 0, 1, 99] }],
        note: "細胞診は1回では陰性のこともある。くり返すか、胸膜生検へ。" } },
  ],
};
