// 糸球体ラボ（DiagnosisLab）。値は架空。確率バーはイメージ値。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const glomerularContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 7, stampAt: 4,
  tests: [
    { id: "prot", name: "尿蛋白定量・血清アルブミン", cost: 1 },
    { id: "sed", name: "尿沈渣", cost: 1 },
    { id: "c3", name: "血清補体（C3）", cost: 1 },
    { id: "aso", name: "ASO", cost: 1 },
    { id: "ana", name: "抗核抗体・抗dsDNA抗体", cost: 1 },
    { id: "anca", name: "MPO-ANCA", cost: 1 },
    { id: "bx", name: "腎生検", cost: 3 },
  ],
  diagnoses: [
    { name: "微小変化型ネフローゼ症候群", short: "微小変化" },
    { name: "膜性腎症", short: "膜性" },
    { name: "IgA腎症", short: "IgA" },
    { name: "溶連菌感染後急性糸球体腎炎", short: "溶連菌後" },
    { name: "ループス腎炎", short: "ループス" },
    { name: "ANCA関連の急速進行性糸球体腎炎", short: "ANCA" },
  ],
  cases: [
    { ...M, who: "6歳 男児", vignette: "急に顔と足がむくんだ。尿が泡立つ。", faceColor: "#F6D9BE", answer: 0,
      results: r({ prot: ["尿蛋白 6 g/日、アルブミン 1.8 g/dL", true], sed: ["赤血球はほとんどない、卵円形脂肪体", true], c3: ["正常", false], aso: ["正常", false], ana: ["陰性", false], anca: ["陰性", false], bx: ["光学顕微鏡で変化なし、電子顕微鏡で足突起の消失", true] }),
      explanation: "小児のネフローゼは多くが微小変化型。ステロイドがよく効くので、まず生検なしでステロイドを始めることが多い。",
      flow: { prior: [55, 10, 10, 10, 8, 7], priorWhy: "小児の急なむくみ。ネフローゼなら微小変化型が最多。",
        steps: [
          { test: "prot", finding: "高度の蛋白尿と低アルブミン", why: "ネフローゼ症候群。腎炎型は否定的。", probs: [70, 15, 4, 3, 6, 2] },
          { test: "sed", finding: "血尿なし", why: "血尿が乏しい選択的な蛋白尿は微小変化型らしい。", probs: [86, 10, 1, 1, 2, 0] },
        ],
        note: "小児ではステロイドへの反応で判断し、効かないときに生検する。" } },
    { ...M, who: "65歳 男性", vignette: "数か月で少しずつ足がむくんできた。", faceColor: "#EFC9A8", answer: 1,
      results: r({ prot: ["尿蛋白 5 g/日、アルブミン 2.2 g/dL", true], sed: ["軽い血尿", true], c3: ["正常", false], aso: ["正常", false], ana: ["陰性", false], anca: ["陰性", false], bx: ["基底膜の肥厚とスパイク、IgGの顆粒状沈着", true] }),
      explanation: "成人のネフローゼで多い膜性腎症。高齢者は悪性腫瘍に伴うこともあるので、癌の検索も。",
      flow: { prior: [15, 45, 15, 3, 10, 12], priorWhy: "高齢者のゆっくり進むネフローゼ。膜性腎症が多い。",
        steps: [
          { test: "prot", finding: "ネフローゼ", why: "ネフローゼ症候群を確認。", probs: [18, 58, 8, 1, 10, 5] },
          { test: "bx", finding: "スパイク", why: "基底膜のスパイクは膜性腎症。", probs: [0, 98, 0, 0, 2, 0] },
        ],
        note: "抗PLA2R抗体が陽性なら一次性の膜性腎症を支持する。" } },
    { ...M, who: "22歳 男性", vignette: "かぜをひいた翌日、コーラ色の尿。", faceColor: "#F2D0AE", answer: 2,
      results: r({ prot: ["尿蛋白 0.8 g/日", true], sed: ["変形赤血球、赤血球円柱", true], c3: ["正常", false], aso: ["正常", false], ana: ["陰性", false], anca: ["陰性", false], bx: ["メサンギウムの増殖、IgAの沈着", true] }),
      explanation: "上気道炎の直後（1〜2日）の肉眼的血尿、補体は正常。IgA腎症。日本で最も多い慢性糸球体腎炎。",
      flow: { prior: [3, 3, 50, 30, 7, 7], priorWhy: "感染の直後の血尿。IgA腎症か溶連菌感染後か。",
        steps: [
          { test: "c3", finding: "正常", why: "溶連菌感染後やループス腎炎では補体が下がる。正常ならIgA腎症寄り。", probs: [3, 3, 80, 4, 2, 8] },
          { test: "bx", finding: "IgA沈着", why: "IgAの沈着で確定。", probs: [0, 0, 99, 0, 1, 0] },
        ],
        note: "溶連菌感染後は感染から1〜2週間あいて発症。IgA腎症は感染の直後。" } },
    { ...M, who: "8歳 女児", vignette: "2週間前に喉が痛かった。まぶたのむくみ、血尿、血圧が高い。", faceColor: "#F6D9BE", answer: 3,
      results: r({ prot: ["尿蛋白 0.5 g/日", true], sed: ["赤血球円柱", true], c3: ["低下", true], aso: ["上昇", true], ana: ["陰性", false], anca: ["陰性", false], bx: ["管内増殖、上皮下のこぶ（hump）", true] }),
      explanation: "溶連菌の咽頭炎から1〜2週間あとの急性腎炎症候群（血尿・浮腫・高血圧）。低補体とASO上昇。多くは自然に治る。",
      flow: { prior: [10, 2, 20, 55, 8, 5], priorWhy: "咽頭炎の2週後の急性腎炎。溶連菌感染後を考える。",
        steps: [
          { test: "c3", finding: "低下", why: "補体が下がる腎炎（溶連菌後・ループス・膜性増殖性）に絞られる。", probs: [1, 1, 3, 75, 18, 2] },
          { test: "aso", finding: "上昇", why: "溶連菌に最近かかったしるし。", probs: [0, 0, 1, 95, 4, 0] },
        ],
        note: "補体は8週以内に戻るのがふつう。戻らなければほかの病気を考える。" } },
    { ...M, who: "25歳 女性", vignette: "関節痛、顔の赤い発疹、むくみ。", faceColor: "#F4D2B4", answer: 4,
      results: r({ prot: ["尿蛋白 3 g/日", true], sed: ["赤血球円柱", true], c3: ["低下（C4も低下）", true], aso: ["正常", false], ana: ["抗核抗体・抗dsDNA抗体 陽性", true], anca: ["陰性", false], bx: ["フルハウス（IgG・IgA・IgM・C3・C1qすべて沈着）", true] }),
      explanation: "若い女性の全身症状、低補体、抗dsDNA抗体。ループス腎炎。生検で分類して治療を決める。",
      flow: { prior: [5, 5, 10, 10, 60, 10], priorWhy: "若い女性の関節痛と蝶形紅斑。SLEを疑う。",
        steps: [{ test: "ana", finding: "抗dsDNA抗体陽性", why: "SLEに特異的な抗体。", probs: [1, 2, 2, 1, 93, 1] }],
        note: "活動性の目安に補体と抗dsDNA抗体を追う。" } },
    { ...M, who: "72歳 女性", vignette: "1か月の微熱と体重減少。数週間でクレアチニンが急に上がった。", faceColor: "#EEC4A2", answer: 5,
      results: r({ prot: ["尿蛋白 1 g/日", true], sed: ["赤血球円柱", true], c3: ["正常", false], aso: ["正常", false], ana: ["陰性", false], anca: ["MPO-ANCA 陽性", true], bx: ["半月体形成、免疫沈着がほとんどない（pauci-immune）", true] }),
      explanation: "高齢者の数週〜数か月で進む腎機能低下と血尿。MPO-ANCA陽性の顕微鏡的多発血管炎。日本の急速進行性糸球体腎炎で最も多い。",
      flow: { prior: [2, 10, 10, 3, 5, 70], priorWhy: "高齢者の全身症状と急な腎機能低下。急速進行性糸球体腎炎を疑う。",
        steps: [{ test: "anca", finding: "MPO-ANCA陽性", why: "ANCA関連血管炎。", probs: [0, 1, 1, 0, 1, 97] }],
        note: "急速に腎機能が失われるので、ステロイドと免疫抑制薬を早く始める。" } },
  ],
};
