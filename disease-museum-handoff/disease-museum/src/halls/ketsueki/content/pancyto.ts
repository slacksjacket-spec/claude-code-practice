// 汎血球減少ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const pancytoContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 7, stampAt: 4,
  tests: [
    { id: "retic", name: "網赤血球・MCV", cost: 1 },
    { id: "smear", name: "末梢血塗抹", cost: 1 },
    { id: "b12", name: "ビタミンB₁₂・葉酸", cost: 1 },
    { id: "hemo", name: "LDH・ハプトグロビン・尿ヘモジデリン", cost: 1 },
    { id: "cd55", name: "CD55・CD59（フローサイトメトリー）", cost: 1 },
    { id: "echo", name: "腹部エコー（肝臓・脾臓）", cost: 1 },
    { id: "bm", name: "骨髄穿刺・生検", cost: 3 },
  ],
  diagnoses: [
    { name: "再生不良性貧血", short: "再不貧" },
    { name: "骨髄異形成症候群", short: "MDS" },
    { name: "急性白血病", short: "白血病" },
    { name: "巨赤芽球性貧血", short: "巨赤芽球" },
    { name: "発作性夜間ヘモグロビン尿症", short: "PNH" },
    { name: "肝硬変による脾機能亢進", short: "脾亢進" },
  ],
  cases: [
    { ...M, who: "22歳 男性", vignette: "息切れ、あざ。熱はない。", faceColor: "#F2D0AE", answer: 0,
      results: r({ retic: ["網赤血球 低い、MCV 正常〜やや大きい", true], smear: ["芽球なし、形の異常なし", false], b12: ["正常", false], hemo: ["正常", false], cd55: ["一部にPNH型の血球（少数）", true], echo: ["脾腫なし", false], bm: ["低形成（脂肪髄）", true] }),
      explanation: "若い人の汎血球減少で、骨髄が空っぽ。再生不良性貧血。少数のPNH型血球が見つかることがある。",
      flow: { prior: [30, 10, 25, 10, 10, 15], priorWhy: "若い人の汎血球減少。",
        steps: [
          { test: "smear", finding: "芽球なし", why: "白血病は考えにくい。", probs: [40, 12, 5, 13, 13, 17] },
          { test: "bm", finding: "低形成", why: "骨髄が空っぽ。再生不良性貧血。", probs: [88, 5, 1, 1, 4, 1] },
        ], note: "診断には骨髄の低形成の確認が必要。" } },
    { ...M, who: "78歳 男性", vignette: "ゆっくり進むだるさ。", faceColor: "#EEC4A2", answer: 1,
      results: r({ retic: ["網赤血球 低い、MCV 106", true], smear: ["偽ペルゲル核異常、好中球の顆粒が少ない", true], b12: ["正常", false], hemo: ["正常", false], cd55: ["正常", false], echo: ["脾腫なし", false], bm: ["過形成、3系統に異形成、芽球 6%", true] }),
      explanation: "高齢者の大球性の汎血球減少で、ビタミンは正常。異形成があれば骨髄異形成症候群。",
      flow: { prior: [15, 35, 15, 20, 5, 10], priorWhy: "高齢者のゆっくりした血球減少。",
        steps: [
          { test: "b12", finding: "正常", why: "ビタミン不足ではない。", probs: [20, 50, 18, 2, 5, 5] },
          { test: "smear", finding: "偽ペルゲル", why: "異形成のしるし。", probs: [5, 78, 12, 1, 3, 1] },
        ], note: "芽球が20%以上なら急性白血病。" } },
    { ...M, who: "50歳 女性", vignette: "2週間の発熱と出血斑、歯ぐきの腫れ。", faceColor: "#F4D2B4", answer: 2,
      results: r({ retic: ["網赤血球 低い", true], smear: ["芽球が多数、白血病裂孔", true], b12: ["正常", false], hemo: ["LDH 高値", true], cd55: ["正常", false], echo: ["軽い脾腫", true], bm: ["芽球 70%、ペルオキシダーゼ陽性", true] }),
      explanation: "末梢に芽球、骨髄の芽球20%以上で急性白血病。ペルオキシダーゼ陽性なら骨髄性。",
      flow: { prior: [15, 15, 40, 10, 5, 15], priorWhy: "発熱と出血の急な経過。",
        steps: [{ test: "smear", finding: "芽球多数", why: "白血病裂孔（成熟途中の細胞が抜ける）。", probs: [1, 8, 90, 0, 0, 1] }],
        note: "歯肉腫脹は単球系（M4・M5）に多い。" } },
    { ...M, who: "60歳 男性", vignette: "胃全摘から8年。足のしびれと貧血。", faceColor: "#EFC9A8", answer: 3,
      results: r({ retic: ["網赤血球 低い、MCV 124", true], smear: ["過分葉好中球、大きな卵円形の赤血球", true], b12: ["B₁₂ 低値", true], hemo: ["LDH 著明高値、ハプトグロビン低値", true], cd55: ["正常", false], echo: ["正常", false], bm: ["巨赤芽球", true] }),
      explanation: "B₁₂欠乏の巨赤芽球性貧血。骨髄の中で壊れる（無効造血）のでLDHが高い。",
      flow: { prior: [10, 15, 10, 50, 5, 10], priorWhy: "胃全摘の既往としびれ。",
        steps: [{ test: "b12", finding: "B₁₂ 低値", why: "B₁₂欠乏。", probs: [1, 3, 1, 94, 1, 0] }],
        note: "骨髄穿刺をしなくても診断できることが多い。" } },
    { ...M, who: "35歳 男性", vignette: "朝の尿が赤黒い。腹痛と貧血。", faceColor: "#F2D0AE", answer: 4,
      results: r({ retic: ["網赤血球 増加", true], smear: ["特徴的な形の異常なし", false], b12: ["正常", false], hemo: ["LDH 著明高値、ハプトグロビン低値、尿ヘモジデリン陽性", true], cd55: ["CD55・CD59 欠損の血球が多い", true], echo: ["門脈に血栓", true], bm: ["やや低形成", true] }),
      explanation: "補体で血管内溶血するPNH。血栓症（腹腔内静脈など）を起こしやすい。エクリズマブ。",
      flow: { prior: [20, 10, 10, 10, 35, 15], priorWhy: "朝の赤黒い尿は血管内溶血を考える。",
        steps: [
          { test: "hemo", finding: "血管内溶血", why: "尿ヘモジデリン陽性。", probs: [5, 3, 2, 15, 72, 3] },
          { test: "cd55", finding: "欠損", why: "GPIアンカー蛋白の欠損で確定。", probs: [1, 0, 0, 0, 99, 0] },
        ], note: "再生不良性貧血と行き来することがある。" } },
    { ...M, who: "62歳 男性", vignette: "C型肝炎で長く通院。腹水。", faceColor: "#E9C9A0", answer: 5,
      results: r({ retic: ["網赤血球 やや増加", true], smear: ["標的赤血球が少し", true], b12: ["正常", false], hemo: ["正常", false], cd55: ["正常", false], echo: ["肝臓の表面が凸凹、巨大な脾腫", true], bm: ["正〜過形成", false] }),
      explanation: "門脈圧亢進で脾臓が大きくなり、血球をため込んで壊す（脾機能亢進）。骨髄は元気。",
      flow: { prior: [10, 10, 10, 10, 5, 55], priorWhy: "肝硬変の背景。",
        steps: [{ test: "echo", finding: "巨大脾腫", why: "脾機能亢進。", probs: [2, 3, 3, 2, 2, 88] }],
        note: "血小板がまず減ることが多い。" } },
  ],
};
