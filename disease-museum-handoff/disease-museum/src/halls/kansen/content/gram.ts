// グラム染色（共通ゲーム microscope）。絵は模式。TODO(review) 各症例の菌と治療
import type { MicroscopeData } from "../../../engine/games/microscope.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const P = "#4A2A8C", R = "#E0507A"; // 陽性（紫）、陰性（赤）
const cocci = (pts: [number, number][], c: string, r = 2.6) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("");

export const gramContent: MicroscopeData = {
  title: "グラム染色（油浸）",
  background: "#FDF3F6",
  stampAt: 4,
  sprites: {
    neut: { label: "好中球", svg: `<circle r="11" fill="#F6D6E0" stroke="#D8A0B4" stroke-width=".8"/><path d="M-6 -1 C-6 -5 -1 -5 -1 -1 C-1 3 3 3 3 0 C3 -4 7 -3 7 0" stroke="#C77AA0" stroke-width="3.4" fill="none" stroke-linecap="round"/>` },
    epi: { label: "扁平上皮細胞", svg: `<path d="M-13 -7 L-2 -12 L12 -6 L13 7 L1 12 L-12 7Z" fill="#FBE4EC" stroke="#E0A0B8" stroke-width="1"/><circle r="2.2" fill="#C06090"/>` },
    gpcCluster: { label: "ブドウの房状のグラム陽性球菌", svg: cocci([[-4, -3], [0, -4], [4, -2], [-3, 1], [1, 0], [5, 2], [-1, 4], [3, 5]], P) },
    gpcChain: { label: "連鎖状のグラム陽性球菌", svg: cocci([[-10, -4], [-6, -2], [-2, 0], [2, 1], [6, 3], [10, 4]], P) },
    gpdc: { label: "莢膜をもつランセット形のグラム陽性双球菌", svg: `<ellipse rx="8" ry="5" fill="none" stroke="#C8B8E8" stroke-width="2"/><path d="M-6 0 Q-3 -3 -0.5 0 Q-3 3 -6 0Z M6 0 Q3 -3 0.5 0 Q3 3 6 0Z" fill="${P}"/>` },
    gnr: { label: "グラム陰性桿菌", svg: `<rect x="-6" y="-2" width="12" height="4.4" rx="2.2" fill="${R}"/>` },
    gnrSmall: { label: "小さなグラム陰性短桿菌", svg: `<rect x="-3" y="-1.6" width="6" height="3.2" rx="1.6" fill="${R}"/><rect x="2" y="3" width="5" height="3" rx="1.5" fill="${R}"/>` },
    gndc: { label: "白血球に食べられたグラム陰性双球菌", svg: `<circle r="11" fill="#F6D6E0" stroke="#D8A0B4" stroke-width=".8"/>${cocci([[-5, -3], [5, 3]], "#B04070", 2.4)}${[[-2, 3], [1, -4], [4, -1]].map(([x, y]) => `<ellipse cx="${x - 1.7}" cy="${y}" rx="1.4" ry="2" fill="${R}"/><ellipse cx="${x + 1.7}" cy="${y}" rx="1.4" ry="2" fill="${R}"/>`).join("")}` },
    yeast: { label: "出芽する酵母様真菌", svg: `<ellipse rx="5" ry="4" fill="${P}"/><ellipse cx="6" cy="-3" rx="3" ry="2.4" fill="${P}"/>` },
  },
  cases: [
    { ...M, id: "pneumo", story: "75歳 男性。高熱と鉄さび色の痰。右下肺に浸潤影。", crowd: [{ sprite: "neut", n: 10 }, { sprite: "epi", n: 1 }, { sprite: "gnr", n: 1 }], target: { sprite: "gpdc", n: 4 },
      question: "考える菌と治療の第一選択は？", options: ["肺炎球菌 → アンピシリン（ペニシリン系）", "黄色ブドウ球菌 → バンコマイシン", "緑膿菌 → メロペネム", "マイコプラズマ → マクロライド"], answer: 0,
      explanation: "ランセット形の双球菌で周りが抜けて見える（莢膜）。肺炎球菌。尿中抗原も役立つ。" },
    { ...M, id: "staph", story: "60歳 男性。透析カテーテルから発熱。血液培養が陽性に。", crowd: [{ sprite: "neut", n: 6 }], target: { sprite: "gpcCluster", n: 4 },
      question: "結果を待つ間の最初の抗菌薬は？", options: ["MRSAも考えてバンコマイシン", "アジスロマイシン", "メトロニダゾール", "抗菌薬は培養結果が出るまで待つ"], answer: 0,
      explanation: "ブドウの房はブドウ球菌。カテーテル関連ではMRSAを考える。黄色ブドウ球菌の菌血症は心エコーで感染性心内膜炎を探す。" },
    { ...M, id: "strep", story: "8歳 男児。高熱と咽頭痛。扁桃に白苔、前頸部リンパ節が腫れて痛い。咳はない。", crowd: [{ sprite: "neut", n: 8 }, { sprite: "epi", n: 3 }], target: { sprite: "gpcChain", n: 3 },
      question: "治療は？", options: ["アモキシシリンを10日間", "抗菌薬は不要", "バンコマイシン点滴", "アンピシリンは発疹が出るので禁止"], answer: 0,
      explanation: "A群溶連菌の咽頭炎。リウマチ熱の予防のため10日間。迅速抗原検査も使う。" },
    { ...M, id: "ecoli", story: "30歳 女性。発熱と右の背中の痛み。尿のグラム染色。", crowd: [{ sprite: "neut", n: 10 }], target: { sprite: "gnr", n: 5 },
      question: "最も多い原因菌は？", options: ["大腸菌", "緑膿菌", "黄色ブドウ球菌", "肺炎球菌"], answer: 0,
      explanation: "腎盂腎炎の原因の多くは大腸菌などの腸内細菌（グラム陰性桿菌）。地域のESBL産生菌の頻度も考える。" },
    { ...M, id: "gono", story: "22歳 男性。排尿時の強い痛みと、黄色いうみのような分泌物。", crowd: [{ sprite: "neut", n: 4 }, { sprite: "epi", n: 1 }], target: { sprite: "gndc", n: 3 },
      question: "治療は？", options: ["セフトリアキソン（クラミジアも調べて治療）", "アモキシシリン内服", "レボフロキサシン内服", "経過観察"], answer: 0,
      explanation: "白血球の中のそら豆形の双球菌は淋菌。キノロン耐性が多い。クラミジアの同時感染が多い。" },
    { ...M, id: "hflu", story: "70歳 男性。COPD。痰が増えて黄色くなった。", crowd: [{ sprite: "neut", n: 8 }, { sprite: "epi", n: 1 }], target: { sprite: "gnrSmall", n: 5 },
      question: "考える菌は？", options: ["インフルエンザ菌", "肺炎球菌", "黄色ブドウ球菌", "結核菌"], answer: 0,
      explanation: "小さな陰性短桿菌（多形性）。COPDの増悪で多い。βラクタマーゼを作るものもある。" },
    { ...M, id: "candida", story: "65歳 女性。ICUで中心静脈カテーテルと広域抗菌薬を使用中。発熱が続く。", crowd: [{ sprite: "neut", n: 5 }], target: { sprite: "yeast", n: 4 },
      question: "まずすることは？", options: ["カテーテルを抜き、抗真菌薬を始め、眼科で眼内炎を調べる", "抗菌薬を増やす", "様子を見る", "ステロイド"], answer: 0,
      explanation: "カンジダ血症。カテーテル抜去と抗真菌薬（エキノキャンディン系など）。眼内炎の確認。" },
  ],
};
