// カルシウムとPTHの4マス（共通ゲーム grid）。TODO(review) 各症例の分類
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const calciumContent: GridData = {
  rowLabels: ["Ca 高", "Ca 低"],
  colLabels: ["PTH 高", "PTH 低"],
  cells: [
    { id: "phpt", row: 0, col: 0, label: "原発性副甲状腺機能亢進症" },
    { id: "nonpth", row: 0, col: 1, label: "PTHによらない高Ca", sub: "悪性腫瘍・ビタミンD過剰" },
    { id: "secondary", row: 1, col: 0, label: "PTHが効かない・追いつかない", sub: "CKD・ビタミンD欠乏・偽性" },
    { id: "hypopara", row: 1, col: 1, label: "副甲状腺機能低下症" },
  ],
  question: "Ca と PTH から、どのマス？",
  stampAt: 4,
  cases: [
    { ...M, id: "phpt", who: "55歳 女性", signs: ["尿路結石をくり返す", "骨粗鬆症", "Ca 11.6", "P 低値", "PTH 高値"], cell: "phpt",
      explanation: "副甲状腺の腺腫が多い。Caが高いのにPTHが下がらない。手術で摘出。" },
    { ...M, id: "pthrp", who: "70歳 男性", signs: ["肺扁平上皮癌", "意識がぼんやり", "Ca 14.2", "PTH 低値", "PTHrP 高値"], cell: "nonpth",
      explanation: "腫瘍が出すPTH関連蛋白（PTHrP）。本物のPTHは抑えられる。生理食塩水、ビスホスホネート、カルシトニン。" },
    { ...M, id: "sarcoid", who: "40歳 女性", signs: ["両側肺門リンパ節腫脹", "Ca 11.5", "PTH 低値", "1,25(OH)₂D 高値"], cell: "nonpth",
      explanation: "サルコイドーシスの肉芽腫が活性型ビタミンDを作る。" },
    { ...M, id: "ckd", who: "65歳 男性", signs: ["透析中", "Ca 低め", "P 高値", "PTH 高値"], cell: "secondary",
      explanation: "腎臓でビタミンDが活性化されず、Pもたまる。PTHが上がり続ける（二次性副甲状腺機能亢進症）。" },
    { ...M, id: "pseudo", who: "12歳 女児", signs: ["丸い顔", "低身長", "第4中手骨が短い", "Ca 低値", "P 高値", "PTH 高値"], cell: "secondary",
      explanation: "偽性副甲状腺機能低下症。PTHは出ているのに腎臓が反応しない（Gs蛋白の異常）。" },
    { ...M, id: "postop", who: "45歳 女性", signs: ["甲状腺全摘の翌日", "口のまわりのしびれ", "Trousseau徴候", "Ca 低値", "PTH 低値"], cell: "hypopara",
      explanation: "手術で副甲状腺を傷めた。カルシウムと活性型ビタミンDを補う。" },
    { ...M, id: "lowmg", who: "60歳 男性", signs: ["大酒家", "Mg 低値", "Ca 低値", "PTH 低値"], cell: "hypopara",
      explanation: "Mgが足りないとPTHが出ない（効きも悪い）。Caより先にMgを補う。" },
  ],
};
