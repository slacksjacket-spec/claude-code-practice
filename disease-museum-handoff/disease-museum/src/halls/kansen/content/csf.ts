// 髄液の読み方（共通ゲーム grid）。TODO(review) 各症例の分類と治療
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const csfContent: GridData = {
  rowLabels: ["多核球が多い", "リンパ球が多い"],
  colLabels: ["糖 低下", "糖 正常"],
  cells: [
    { id: "bact", row: 0, col: 0, label: "細菌性髄膜炎" },
    { id: "tbfung", row: 1, col: 0, label: "結核性・真菌性" },
    { id: "viral", row: 1, col: 1, label: "ウイルス性" },
  ],
  question: "髄液所見はどのマス？",
  treatQuestion: "治療は？",
  treatments: [
    "セフトリアキソン＋バンコマイシン（＋デキサメタゾン）",
    "上の治療にアンピシリンを加える",
    "アシクロビル",
    "抗結核薬（4剤）",
    "アムホテリシンB＋フルシトシン",
    "対症療法",
  ],
  stampAt: 4,
  cases: [
    { ...M, id: "pneumo", who: "45歳 男性", signs: ["高熱・頭痛・項部硬直", "細胞 2,500/μL（多核球）", "糖 15 mg/dL", "蛋白 高値"], cell: "bact", treatment: 0,
      explanation: "成人の細菌性髄膜炎は肺炎球菌が最多。抗菌薬の直前か同時にデキサメタゾン。血液培養をとって1時間以内に。" },
    { ...M, id: "listeria", who: "75歳 女性", signs: ["ステロイド内服中", "発熱と意識障害", "細胞 1,200/μL（多核球）", "糖 低下"], cell: "bact", treatment: 1,
      explanation: "50歳以上・免疫不全ではリステリアを考えてアンピシリンを追加（セフェムが効かない）。" },
    { ...M, id: "hsv", who: "40歳 男性", signs: ["発熱と異常行動", "細胞 150/μL（リンパ球）", "糖 正常", "MRIで側頭葉に異常"], cell: "viral", treatment: 2,
      explanation: "単純ヘルペス脳炎。疑えばすぐにアシクロビル。髄液PCRで確定。" },
    { ...M, id: "tb", who: "60歳 男性", signs: ["2週間の微熱と頭痛", "外転神経麻痺", "細胞 300/μL（リンパ球）", "糖 低下・ADA 高値", "低Na血症"], cell: "tbfung", treatment: 3,
      explanation: "結核性髄膜炎。亜急性、脳底部の炎症で脳神経麻痺。ADAの上昇。" },
    { ...M, id: "crypto", who: "35歳 男性", signs: ["HIV陽性・CD4 50", "頭痛", "細胞 50/μL（リンパ球）", "糖 低下", "墨汁染色で莢膜をもつ酵母"], cell: "tbfung", treatment: 4,
      explanation: "クリプトコッカス髄膜炎。頭蓋内圧が高ければくり返し腰椎穿刺。" },
    { ...M, id: "mumps", who: "6歳 男児", signs: ["耳下腺が腫れて数日後", "頭痛・嘔吐", "細胞 300/μL（リンパ球）", "糖 正常"], cell: "viral", treatment: 5,
      explanation: "ムンプスの無菌性髄膜炎。多くは自然に治る。" },
  ],
};
