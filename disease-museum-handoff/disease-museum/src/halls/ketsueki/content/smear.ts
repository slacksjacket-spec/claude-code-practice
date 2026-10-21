// 末梢血塗抹（共通ゲーム microscope）。絵は模式。TODO(review) 各所見と疾患の対応
import type { MicroscopeData } from "../../../engine/games/microscope.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const RBC = `<circle r="6" fill="#E88A80" stroke="#B85A50" stroke-width=".8"/><circle r="2.6" fill="#F6C2BA"/>`;
const nuc = (pts: [number, number, number][], color = "#5B3F8C") => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join("");

export const smearContent: MicroscopeData = {
  title: "末梢血塗抹（ギムザ染色）",
  background: "#FBF3F4",
  stampAt: 4,
  sprites: {
    rbc: { label: "正常な赤血球", svg: RBC },
    plt: { label: "血小板", svg: `<circle r="2" fill="#9C7CC4"/>` },
    neut: { label: "好中球", svg: `<circle r="9" fill="#F4E4EE" stroke="#C8A8C0" stroke-width=".8"/>${nuc([[-4, -2, 2.6], [0, 2, 2.6], [4, -1, 2.6]])}` },
    lymph: { label: "リンパ球", svg: `<circle r="7" fill="#C8D8F4" stroke="#8AA0C8" stroke-width=".8"/><circle r="5.6" fill="#4A3A80"/>` },
    target: { label: "標的赤血球", svg: `<circle r="6" fill="#E88A80" stroke="#B85A50" stroke-width=".8"/><circle r="3.4" fill="#F6E4E0"/><circle r="1.6" fill="#E88A80"/>` },
    schisto: { label: "破砕赤血球", svg: `<path d="M-6 -3 L4 -5 L1 0 L5 5 L-5 4Z" fill="#E88A80" stroke="#B85A50" stroke-width=".8"/>` },
    sphero: { label: "球状赤血球", svg: `<circle r="4.6" fill="#C8453B" stroke="#8A2A22" stroke-width=".8"/>` },
    sickle: { label: "鎌状赤血球", svg: `<path d="M-9 2 C-4 -6 4 -6 9 2 C4 -2 -4 -2 -9 2Z" fill="#E88A80" stroke="#B85A50" stroke-width="1"/>` },
    tear: { label: "涙滴赤血球", svg: `<path d="M-5 0 C-5 -5 3 -5 5 -1 L11 0 L5 1 C3 5 -5 5 -5 0Z" fill="#E88A80" stroke="#B85A50" stroke-width=".8"/>` },
    hyperseg: { label: "過分葉好中球", svg: `<circle r="10" fill="#F4E4EE" stroke="#C8A8C0" stroke-width=".8"/>${nuc([[-6, -2, 2.2], [-3, 3, 2.2], [0, -3, 2.2], [3, 3, 2.2], [6, -1, 2.2], [1, 0, 1.6]])}` },
    blastAuer: { label: "アウエル小体のある芽球", svg: `<circle r="9" fill="#B8C8EC" stroke="#7A8AC0" stroke-width=".8"/><circle r="7" fill="#6A58A8"/><circle cx="-2" cy="-1" r="1.4" fill="#B8A8E0"/><path d="M1 -5 L5 3" stroke="#D83A5A" stroke-width="1.4"/><path d="M-4 3 L0 6" stroke="#D83A5A" stroke-width="1.2"/>` },
    atyp: { label: "異型リンパ球", svg: `<path d="M-11 -2 C-10 -10 6 -11 11 -4 C13 4 4 11 -4 10 C-10 8 -12 4 -11 -2Z" fill="#9EB4E8" stroke="#5A70B0" stroke-width=".8"/><ellipse cx="-3" cy="-1" rx="5" ry="6" fill="#3E2E78"/>` },
    howell: { label: "Howell-Jolly小体のある赤血球", svg: `${RBC}<circle cx="2.6" cy="-2" r="1.4" fill="#3E2E78"/>` },
  },
  cases: [
    { ...M, id: "ttp", story: "35歳 女性。発熱、意識の波、紫斑。血小板 1.5万、LDH高値。", crowd: [{ sprite: "rbc", n: 18 }, { sprite: "neut", n: 1 }], target: { sprite: "schisto", n: 3 },
      question: "まず考える病気と治療は？", options: ["血栓性血小板減少性紫斑病（TTP）→ 血漿交換", "ITP → 血小板輸血", "鉄欠乏性貧血 → 鉄剤", "遺伝性球状赤血球症 → 脾摘"], answer: 0,
      explanation: "破砕赤血球は細い血管の血栓で赤血球が切れたしるし（血栓性微小血管症）。TTPはADAMTS13の低下。血小板輸血は血栓を増やすので避ける。" },
    { ...M, id: "hs", story: "12歳 男児。黄疸と脾腫。父も同じ。MCHC 高値。", crowd: [{ sprite: "rbc", n: 14 }, { sprite: "plt", n: 4 }], target: { sprite: "sphero", n: 4 },
      question: "診断と特徴的な検査は？", options: ["遺伝性球状赤血球症（浸透圧抵抗が低下）", "サラセミア（HbA2増加）", "自己免疫性溶血性貧血（直接クームス陽性）", "鉄欠乏性貧血（フェリチン低下）"], answer: 0,
      explanation: "膜蛋白（スペクトリンなど）の異常で丸く小さい赤血球。脾臓で壊される。常染色体顕性遺伝が多い。重ければ脾摘。" },
    { ...M, id: "b12", story: "70歳 女性。胃を全部とって10年。手足のしびれ。MCV 120。", crowd: [{ sprite: "rbc", n: 14 }, { sprite: "plt", n: 2 }], target: { sprite: "hyperseg", n: 2 },
      question: "足りないものは？", options: ["ビタミンB₁₂", "鉄", "ビタミンK", "エリスロポエチン"], answer: 0,
      explanation: "胃全摘で内因子がなくなり、数年後にB₁₂が不足。過分葉好中球は巨赤芽球性貧血のしるし。神経症状（亜急性連合性脊髄変性症）も。" },
    { ...M, id: "apl", story: "40歳 男性。歯ぐきの出血、あざ。フィブリノゲン低値、FDP高値。", crowd: [{ sprite: "rbc", n: 12 }, { sprite: "neut", n: 1 }], target: { sprite: "blastAuer", n: 4 },
      question: "染色体と治療は？", options: ["t(15;17) → 全トランス型レチノイン酸（ATRA）", "t(9;22) → イマチニブ", "t(8;14) → 放射線だけ", "JAK2変異 → 瀉血"], answer: 0,
      explanation: "急性前骨髄球性白血病（APL）。アウエル小体（束になればファゴット細胞）。DICを合併しやすい。ATRAで分化させる。" },
    { ...M, id: "ebv", story: "18歳 男性。発熱、咽頭痛、首のリンパ節の腫れ、肝脾腫。", crowd: [{ sprite: "rbc", n: 14 }, { sprite: "lymph", n: 2 }, { sprite: "neut", n: 1 }], target: { sprite: "atyp", n: 3 },
      question: "診断と、してはいけない薬は？", options: ["伝染性単核球症 → アンピシリンで発疹", "急性リンパ性白血病 → ステロイド", "溶連菌咽頭炎 → ペニシリン", "サルコイドーシス → ステロイド"], answer: 0,
      explanation: "EBウイルスに反応した大きなT細胞（異型リンパ球）。アンピシリンで発疹が出やすい。脾破裂に注意して運動を控える。" },
    { ...M, id: "thal", story: "25歳 女性。地中海の出身。軽い小球性貧血、フェリチンは正常。", crowd: [{ sprite: "rbc", n: 14 }, { sprite: "plt", n: 3 }], target: { sprite: "target", n: 4 },
      question: "考えるのは？", options: ["サラセミア", "鉄欠乏性貧血", "巨赤芽球性貧血", "再生不良性貧血"], answer: 0,
      explanation: "グロビン鎖の合成異常。小球性なのに鉄は足りている。標的赤血球が目立つ。鉄剤は効かない。" },
    { ...M, id: "mf", story: "68歳 男性。巨大な脾腫。骨髄穿刺でドライタップ。", crowd: [{ sprite: "rbc", n: 14 }, { sprite: "neut", n: 1 }], target: { sprite: "tear", n: 3 },
      question: "考えるのは？", options: ["原発性骨髄線維症", "慢性リンパ性白血病", "ITP", "鉄欠乏性貧血"], answer: 0,
      explanation: "骨髄が線維で埋まり、脾臓で血を作る（髄外造血）。涙滴赤血球と白赤芽球症。JAK2変異が半数ほど。" },
    { ...M, id: "asplenia", story: "30歳 男性。交通事故で脾臓を摘出した。", crowd: [{ sprite: "rbc", n: 16 }, { sprite: "plt", n: 5 }], target: { sprite: "howell", n: 3 },
      question: "この人で大事な予防は？", options: ["肺炎球菌などのワクチン（莢膜をもつ菌に弱い）", "鉄剤の内服", "ビタミンKの注射", "抗凝固薬"], answer: 0,
      explanation: "脾臓がないと、赤血球の中の核の残り（Howell-Jolly小体）が取り除かれない。莢膜をもつ菌の重症感染（OPSI）に注意。" },
  ],
};
