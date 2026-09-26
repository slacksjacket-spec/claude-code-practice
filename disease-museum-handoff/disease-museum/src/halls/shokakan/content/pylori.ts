// ピロリ除菌すごろく（AlgorithmBoard）。
// TODO(review) 除菌判定の時期（4週以上）、PPI休薬（2週間）、レジメン、ペニシリンアレルギー時の扱いは記憶から書いた。
// H. pylori感染の診断と治療のガイドライン（日本ヘリコバクター学会）で照合が必要
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: ["H. pylori感染の診断と治療のガイドライン 2016改訂版"] };

export const pyloriContent: ExhibitOf<"AlgorithmBoard">["data"] = {
  stampAt: 4,
  nodes: [
    { id: "timing", label: "判定の時期", question: "除菌治療が終わってから4週以上たった？", options: [{ value: "yes", label: "4週以上たった" }, { value: "no", label: "まだ4週たっていない" }] },
    { id: "ppi", label: "PPI", question: "検査の前にPPIやP-CABを飲んでいた？", options: [{ value: "yes", label: "飲んでいた" }, { value: "no", label: "飲んでいない" }] },
    { id: "result", label: "結果", question: "感染診断の結果は？", options: [{ value: "pos", label: "陽性" }, { value: "neg", label: "陰性" }] },
    { id: "line", label: "除菌歴", question: "これまでの除菌は？", options: [{ value: "none", label: "はじめて" }, { value: "failed1", label: "一次除菌で失敗" }] },
    { id: "allergy", label: "アレルギー", question: "ペニシリンアレルギーは？", options: [{ value: "yes", label: "あり" }, { value: "no", label: "なし" }] },
  ],
  goalLabel: "次の一手",
  treatments: [
    "一次除菌（P-CABかPPI＋アモキシシリン＋クラリスロマイシン、7日間）",
    "二次除菌（P-CABかPPI＋アモキシシリン＋メトロニダゾール、7日間）",
    "アモキシシリンを使わない除菌（専門施設に相談）",
    "判定できる時期まで待つ",
    "PPIを休薬してから検査しなおす",
    "除菌は不要（感染なし）",
  ],
  patients: [
    { ...M, card: { 年齢: "52", 経過: "胃潰瘍で内視鏡", 検査: "迅速ウレアーゼ試験 陽性", 服薬: "なし" },
      path: ["ppi", "result", "line", "allergy", "goal"], answers: { ppi: "no", result: "pos", line: "none", allergy: "no" }, treatments: [0],
      explanation: "はじめての除菌は、酸を抑える薬（P-CABかPPI）＋アモキシシリン＋クラリスロマイシンの3剤を7日間。" },
    { ...M, card: { 年齢: "60", 経過: "2か月前に一次除菌", 検査: "除菌後6週の尿素呼気試験 陽性", 服薬: "なし" },
      path: ["timing", "ppi", "result", "line", "allergy", "goal"], answers: { timing: "yes", ppi: "no", result: "pos", line: "failed1", allergy: "no" }, treatments: [1],
      explanation: "一次除菌の失敗はクラリスロマイシン耐性が多い。二次除菌はクラリスロマイシンをメトロニダゾールにかえる。" },
    { ...M, card: { 年齢: "45", 経過: "健診の胃カメラで萎縮性胃炎", 検査: "便中抗原 陽性", 既往: "ペニシリンで蕁麻疹" },
      path: ["ppi", "result", "line", "allergy", "goal"], answers: { ppi: "no", result: "pos", line: "none", allergy: "yes" }, treatments: [2],
      explanation: "標準の除菌はどちらもアモキシシリン（ペニシリン系）を使う。アレルギーがあれば別のレジメンになるので専門施設に相談。" },
    { ...M, card: { 年齢: "38", 経過: "一次除菌を終えて1週間", 希望: "すぐに成功したか知りたい" },
      path: ["timing", "goal"], answers: { timing: "no" }, treatments: [3],
      explanation: "除菌直後は菌が減っているだけで偽陰性になりやすい。除菌判定は終了から4週以上あけて、尿素呼気試験か便中抗原で。" },
    { ...M, card: { 年齢: "66", 経過: "胃潰瘍でPPIを内服中", 検査: "尿素呼気試験 陰性" },
      path: ["ppi", "goal"], answers: { ppi: "yes" }, treatments: [4],
      explanation: "PPIやP-CABはウレアーゼ活性を下げ、尿素呼気試験などを偽陰性にする。休薬してから（目安2週間）検査しなおす。" },
    { ...M, card: { 年齢: "29", 経過: "健診で胃もたれ", 検査: "尿素呼気試験 陰性", 服薬: "なし" },
      path: ["ppi", "result", "goal"], answers: { ppi: "no", result: "neg" }, treatments: [5],
      explanation: "薬の影響がなく陰性なら、感染していない。除菌は要らない。" },
  ],
};
