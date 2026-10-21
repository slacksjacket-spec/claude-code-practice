// アレルギーの4型（共通ゲーム grid）。TODO(review) 各疾患の型
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const allergyContent: GridData = {
  rowLabels: ["型"],
  colLabels: ["IgE・即時", "細胞に抗体", "免疫複合体", "T細胞・遅延"],
  cells: [
    { id: "t1", row: 0, col: 0, label: "I型" },
    { id: "t2", row: 0, col: 1, label: "II型" },
    { id: "t3", row: 0, col: 2, label: "III型" },
    { id: "t4", row: 0, col: 3, label: "IV型" },
  ],
  question: "アレルギーの型は？",
  stampAt: 5,
  cases: [
    { ...M, id: "ana", who: "20歳 男性", signs: ["そばを食べて15分", "じんましん・喘鳴・血圧低下"], cell: "t1",
      explanation: "IgEが肥満細胞に結合し、抗原でヒスタミンなどが一気に出る。アナフィラキシー。" },
    { ...M, id: "aiha", who: "40歳 女性", signs: ["黄疸と貧血", "直接クームス試験陽性"], cell: "t2",
      explanation: "赤血球の表面に抗体が付き、補体やマクロファージが壊す。" },
    { ...M, id: "gp", who: "25歳 男性", signs: ["喀血と血尿", "抗GBM抗体"], cell: "t2",
      explanation: "基底膜に対する抗体（Goodpasture症候群）。線状の沈着。" },
    { ...M, id: "psgn", who: "8歳 男児", signs: ["咽頭炎の2週後", "血尿・浮腫", "低補体"], cell: "t3",
      explanation: "抗原と抗体の複合体が糸球体にたまる。溶連菌感染後急性糸球体腎炎。" },
    { ...M, id: "serum", who: "50歳 男性", signs: ["抗毒素血清を打って10日後", "発熱・関節痛・じんましん"], cell: "t3",
      explanation: "血清病。異種蛋白に抗体ができて複合体が全身にたまる。" },
    { ...M, id: "contact", who: "30歳 女性", signs: ["新しいピアスをつけて2日後", "耳たぶが赤くかゆい"], cell: "t4",
      explanation: "金属による接触皮膚炎。T細胞がかかわるので1〜2日たってから出る。パッチテストで確かめる。" },
    { ...M, id: "tb", who: "看護師", signs: ["ツベルクリン反応", "48時間後に硬結"], cell: "t4",
      explanation: "結核菌の成分に感作されたT細胞の反応。" },
    { ...M, id: "graves", who: "30歳 女性", signs: ["TSH受容体を刺激する抗体", "甲状腺機能亢進"], cell: "t2",
      explanation: "受容体に対する抗体（刺激型）。V型として分けることもある。" },
  ],
};
