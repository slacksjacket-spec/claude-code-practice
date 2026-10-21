// 甲状腺ホルモンの9マス（共通ゲーム grid）。TODO(review) 各症例の分類と治療
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const thyroidContent: GridData = {
  rowLabels: ["FT4 高", "FT4 正常", "FT4 低"],
  colLabels: ["TSH 低", "TSH 正常", "TSH 高"],
  cells: [
    { id: "toxic", row: 0, col: 0, label: "甲状腺中毒症", sub: "バセドウ病・甲状腺炎" },
    { id: "sitsh", row: 0, col: 2, label: "TSH不適切分泌", sub: "TSH産生腫瘍など" },
    { id: "subhyper", row: 1, col: 0, label: "潜在性の機能亢進" },
    { id: "normal", row: 1, col: 1, label: "正常" },
    { id: "subhypo", row: 1, col: 2, label: "潜在性の機能低下" },
    { id: "central", row: 2, col: 0, label: "中枢性の機能低下", sub: "TSHは低〜正常" },
    { id: "primary", row: 2, col: 2, label: "原発性の機能低下", sub: "橋本病など" },
  ],
  question: "検査値はどのマス？",
  treatQuestion: "対応は？",
  treatments: [
    "抗甲状腺薬（チアマゾール）",
    "β遮断薬で症状を抑えて経過観察",
    "NSAIDs（重ければステロイド）",
    "レボチロキシンの補充",
    "副腎皮質ホルモンを先に補ってから甲状腺ホルモン",
    "下垂体の手術",
    "治療せず、定期的に再検",
  ],
  stampAt: 4,
  cases: [
    { ...M, id: "graves", who: "30歳 女性", signs: ["動悸・体重減少", "眼球突出", "TRAb陽性", "放射性ヨウ素摂取率 高い"], cell: "toxic", treatment: 0,
      explanation: "ホルモンを作りすぎるバセドウ病。抗甲状腺薬（妊娠初期はプロピルチオウラシル）、アイソトープ、手術。" },
    { ...M, id: "painless", who: "32歳 女性", signs: ["出産から3か月", "動悸", "甲状腺の痛みなし", "TRAb陰性", "摂取率 低い"], cell: "toxic", treatment: 1,
      explanation: "無痛性甲状腺炎（産後に多い）。壊れた甲状腺からホルモンが漏れるだけなので、抗甲状腺薬は効かない。" },
    { ...M, id: "subacute", who: "45歳 女性", signs: ["かぜのあと", "発熱", "前頸部の痛み（移動する）", "CRP上昇", "摂取率 低い"], cell: "toxic", treatment: 2,
      explanation: "亜急性甲状腺炎。痛みと炎症を抑える。抗甲状腺薬は使わない。" },
    { ...M, id: "hashimoto", who: "55歳 女性", signs: ["寒がり・便秘", "むくみ", "抗TPO抗体陽性"], cell: "primary", treatment: 3,
      explanation: "橋本病による原発性の機能低下。レボチロキシンで補う（高齢者や心疾患では少量から）。" },
    { ...M, id: "central", who: "60歳 男性", signs: ["下垂体腫瘍の手術後", "だるさ", "コルチゾール低値"], cell: "central", treatment: 4,
      explanation: "副腎不全があるとき甲状腺ホルモンを先に入れると、代謝が上がって副腎クリーゼを起こす。ステロイドが先。" },
    { ...M, id: "tshoma", who: "48歳 男性", signs: ["動悸・発汗", "両耳側半盲", "下垂体腫瘍"], cell: "sitsh", treatment: 5,
      explanation: "TSH産生下垂体腺腫。手術で腫瘍を取る。" },
    { ...M, id: "subclin", who: "40歳 女性", signs: ["健診で偶然", "症状なし", "TSH 6 μU/mL"], cell: "subhypo", treatment: 6,
      explanation: "潜在性の機能低下。TSHが軽く高いだけなら経過を見る（妊娠希望や高値では補充を考える）。" },
  ],
};
