// ネフロンと利尿薬（共通ゲーム tapMap）。TODO(review) 作用部位・副作用、遺伝性尿細管疾患の部位
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const svg = `<rect width="320" height="300" fill="#FFF8F0"/>
  <path d="M40 150 L280 150" stroke="#E0C9B0" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="290" y="140" font-size="10" fill="#9A8670" text-anchor="end">皮質</text><text x="290" y="168" font-size="10" fill="#9A8670" text-anchor="end">髄質</text>
  <circle cx="60" cy="60" r="26" fill="#F7C6C0" stroke="#C9726A" stroke-width="3"/><path d="M44 58 C52 46 68 46 76 58 C70 70 52 72 44 58Z" fill="#E58C7C"/>
  <path d="M84 66 C110 60 120 90 100 96 C80 102 96 124 120 118 C140 112 150 120 148 140 L148 250" stroke="#F2B3A6" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M148 250 C150 276 176 276 178 250 L178 140" stroke="#F2B3A6" stroke-width="12" fill="none"/>
  <path d="M178 140 C182 104 200 96 214 110 C228 124 240 110 236 90 C232 70 250 60 262 70" stroke="#F2B3A6" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M262 70 L262 290" stroke="#F2B3A6" stroke-width="16" fill="none"/>
  <text x="60" y="104" font-size="10" text-anchor="middle" fill="#7A5A50">糸球体</text>`;

export const nephronContent: TapMapData = {
  question: "作用・障害の場所は？",
  stampAt: 4,
  figures: {
    nephron: { viewBox: "0 0 320 300", ariaLabel: "ネフロンの模式図", svg,
      regions: [
        { id: "prox", label: "近位尿細管", shape: `<path d="M82 52 C120 46 130 86 110 100 C96 110 108 122 128 116 C152 110 160 124 158 150 L138 150 C138 132 132 128 120 132 C88 138 76 112 98 92 C108 82 102 72 82 76Z"/>` },
        { id: "tdl", label: "ヘンレ係蹄（細い下行脚）", shape: `<rect x="138" y="152" width="20" height="100" rx="6"/>` },
        { id: "tal", label: "ヘンレ係蹄（太い上行脚）", shape: `<rect x="168" y="140" width="20" height="116" rx="6"/>` },
        { id: "dct", label: "遠位曲尿細管", shape: `<path d="M168 136 C172 96 200 86 216 100 C226 108 232 100 228 88 C224 66 246 52 258 60 L252 80 C246 76 244 84 246 94 C250 124 224 132 206 118 C196 110 190 116 188 136Z"/>` },
        { id: "cd", label: "集合管", shape: `<rect x="252" y="82" width="22" height="210" rx="6"/>` },
      ] },
  },
  cases: [
    { ...M, id: "loop", figure: "nephron", prompt: "フロセミド（ループ利尿薬）が働く場所は？", answer: ["tal"],
      followUp: { question: "Na-K-2Cl共輸送体を止める。起こりやすい副作用は？", options: ["低カリウム血症", "高カリウム血症", "高カルシウム血症", "代謝性アシドーシス"], answer: 0 },
      explanation: "ヘンレ係蹄の太い上行脚のNa-K-2Cl共輸送体を阻害。利尿作用が最も強い。低K、代謝性アルカローシス、高尿酸、Caは尿へ出ていく。" },
    { ...M, id: "thiazide", figure: "nephron", prompt: "サイアザイド系利尿薬が働く場所は？", answer: ["dct"],
      followUp: { question: "Na-Cl共輸送体を止める。カルシウムはどうなる？", options: ["尿中Caが減り、血清Caは上がりぎみ", "尿中Caが増える", "変わらない", "低Ca血症になる"], answer: 0 },
      explanation: "遠位曲尿細管のNa-Cl共輸送体を阻害。Caの再吸収が増えるので、Ca結石の予防にも使う。低Na・低K・高血糖・高尿酸。" },
    { ...M, id: "spiro", figure: "nephron", prompt: "スピロノラクトンが働く場所は？", answer: ["cd"],
      followUp: { question: "起こりやすい副作用は？", options: ["高カリウム血症と女性化乳房", "低カリウム血症", "難聴", "高血糖"], answer: 0 },
      explanation: "集合管（皮質集合管）でアルドステロンの作用を止める（カリウム保持性）。高K血症に注意。" },
    { ...M, id: "acetazolamide", figure: "nephron", prompt: "アセタゾラミド（炭酸脱水酵素阻害薬）が働く場所は？", answer: ["prox"],
      followUp: { question: "起こる酸塩基の変化は？", options: ["代謝性アシドーシス（HCO₃⁻が尿へ出る）", "代謝性アルカローシス", "呼吸性アシドーシス", "変化しない"], answer: 0 },
      explanation: "近位尿細管でHCO₃⁻の再吸収を減らす。緑内障や高山病にも使う。" },
    { ...M, id: "tolvaptan", figure: "nephron", prompt: "トルバプタン（バソプレシンV₂受容体拮抗薬）が働く場所は？", answer: ["cd"],
      explanation: "集合管で水の再吸収（アクアポリン2）を減らし、Naを失わずに水だけを出す。SIADHや心不全の低Na、多発性嚢胞腎。急な血清Naの上昇に注意。" },
    { ...M, id: "sglt2", figure: "nephron", prompt: "SGLT2阻害薬が働く場所は？", answer: ["prox"],
      explanation: "近位尿細管のブドウ糖の再吸収を止めて尿糖を出す。心不全や慢性腎臓病の進行抑制にも。" },
    { ...M, id: "bartter", figure: "nephron", prompt: "Bartter症候群で障害されている場所は？（ループ利尿薬を飲み続けているのと似た状態）", answer: ["tal"],
      followUp: { question: "Gitelman症候群の障害部位は？", options: ["遠位曲尿細管", "近位尿細管", "集合管", "糸球体"], answer: 0 },
      explanation: "Bartterは太い上行脚、Gitelmanは遠位曲尿細管（サイアザイドを飲み続けているのと似る、低Mg・低Ca尿症）。どちらも低K性代謝性アルカローシスで血圧は正常。" },
    { ...M, id: "fanconi", figure: "nephron", prompt: "Fanconi症候群（糖・アミノ酸・リン・HCO₃⁻がまとめて尿に漏れる）の場所は？", answer: ["prox"],
      explanation: "近位尿細管の再吸収がまとめて障害される。2型（近位）尿細管性アシドーシスを伴う。" },
  ],
};
