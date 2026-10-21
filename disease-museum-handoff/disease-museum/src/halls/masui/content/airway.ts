// Mallampati分類（ホール専用 mallampati）。絵は模式。TODO(review)
import type { AirwayData } from "../exhibits/airway.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const airwayContent: AirwayData = {
  stampAt: 4,
  cases: [
    { ...M, id: "c1", story: "25歳 男性。虫垂炎の手術前。持病なし。", cls: 1,
      followUp: { question: "この人の挿管は？", options: ["挿管困難は予測されにくい", "必ず意識下挿管", "気管切開が必要", "全身麻酔は禁忌"], answer: 0 },
      explanation: "口蓋弓まで見えるクラスI。" },
    { ...M, id: "c4", story: "50歳 男性。BMI 38。いびきと睡眠時無呼吸。首が太く短い。", cls: 4,
      followUp: { question: "挿管困難が予測されるときの準備は？", options: ["ビデオ喉頭鏡や声門上器具を用意し、意識下挿管も考える", "準備は不要", "筋弛緩薬を倍量に", "マスク換気をしない"], answer: 0 },
      explanation: "肥満・睡眠時無呼吸・短い首はマスク換気も挿管も難しい。" },
    { ...M, id: "ra", story: "65歳 女性。長年の関節リウマチ。", cls: 3,
      followUp: { question: "関節リウマチの患者で挿管時に注意するのは？", options: ["首を強く反らせない（環軸椎亜脱臼）", "眼球を圧迫しない", "腹部を圧迫しない", "特に注意はない"], answer: 0 },
      explanation: "術前に頸椎のX線（前屈・後屈）を確認する。" },
    { ...M, id: "c2", story: "40歳 女性。胆嚢摘出の前。", cls: 2,
      followUp: { question: "Mallampati分類以外に挿管困難を予測する所見は？", options: ["甲状オトガイ間距離が短い・口が開きにくい・首が後ろに曲がらない", "血圧が高い", "身長が高い", "近視"], answer: 0 },
      explanation: "1つの指標だけでは予測は不十分。いくつかを組み合わせる。" },
    { ...M, id: "preg", story: "32歳 妊婦。緊急帝王切開で全身麻酔になった。", cls: 3,
      followUp: { question: "妊婦の気道で注意するのは？", options: ["粘膜がむくんで挿管しにくく、胃の内容を誤嚥しやすい", "気道は妊娠で広がる", "酸素の消費が減る", "誤嚥の心配はない"], answer: 0 },
      explanation: "迅速導入（rapid sequence induction）で。酸素の予備も少なく、すぐ低酸素になる。" },
  ],
};
