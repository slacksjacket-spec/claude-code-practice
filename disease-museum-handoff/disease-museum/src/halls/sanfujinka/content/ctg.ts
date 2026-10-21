// CTG読み（ホール専用 ctg）。波形は合成した模式。TODO(review) 波形レベル分類と対応（日本産科婦人科学会の5段階）
import type { CtgData } from "../exhibits/ctg.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const ctgContent: CtgData = {
  stampAt: 4,
  cases: [
    { ...M, id: "normal", story: "38週、陣痛が始まって入院。", baseline: 140, variability: "moderate", accel: true, decel: "none",
      followUp: { question: "この状態は？", options: ["胎児の状態は良好（reassuring）。経過観察", "すぐに帝王切開", "子宮収縮薬を中止", "母体に酸素投与"], answer: 0 },
      explanation: "基線正常、基線細変動あり、一過性頻脈あり、一過性徐脈なし。" },
    { ...M, id: "early", story: "39週、子宮口8 cm。児頭が下りてきている。", baseline: 135, variability: "moderate", accel: false, decel: "early",
      followUp: { question: "この徐脈の原因は？", options: ["児頭の圧迫（迷走神経反射）", "胎盤の機能低下", "臍帯の圧迫", "胎児貧血"], answer: 0 },
      explanation: "収縮と鏡写しにゆるやかに下がり、最下点が収縮の頂点と一致。児頭圧迫による良性のもの。" },
    { ...M, id: "late", story: "妊娠高血圧症候群。40週、陣痛中。", baseline: 150, variability: "minimal", accel: false, decel: "late",
      followUp: { question: "この所見が示すのは？", options: ["胎盤の機能低下による胎児の低酸素", "児頭の圧迫", "正常な反応", "母体の発熱"], answer: 0 },
      explanation: "収縮の頂点より遅れて最下点。胎盤機能不全。細変動の減少を伴えば急いで娩出を考える。" },
    { ...M, id: "variable", story: "羊水が少ない。陣痛中。", baseline: 140, variability: "moderate", accel: false, decel: "variable",
      followUp: { question: "原因として多いのは？", options: ["臍帯の圧迫", "児頭の圧迫", "胎盤の機能低下", "胎児の睡眠"], answer: 0 },
      explanation: "急に下がって急に戻る。形も時刻もばらばら。臍帯圧迫。体位変換や羊水補充を考える。" },
    { ...M, id: "prolonged", story: "硬膜外麻酔を入れた直後に母体の血圧が下がった。", baseline: 140, variability: "moderate", accel: false, decel: "prolonged",
      followUp: { question: "まずすることは？", options: ["体位変換（左側臥位）・輸液・昇圧・酸素で母体を立て直す", "様子を見る", "子宮収縮薬を増やす", "麻酔を追加する"], answer: 0 },
      explanation: "2分以上10分未満の徐脈は遷延一過性徐脈。原因を除いても戻らなければ急速遂娩。" },
    { ...M, id: "sinus", story: "母がRh陰性。抗D抗体が高い。", baseline: 150, variability: "moderate", accel: false, decel: "none", sinusoidal: true,
      followUp: { question: "このなめらかな波の名前と原因は？", options: ["サイナソイダルパターン。胎児の高度な貧血", "正常な細変動", "早発一過性徐脈", "胎児の睡眠"], answer: 0 },
      explanation: "規則正しい波打ち。胎児貧血（血液型不適合、母児間輸血）で見られ、危険なサイン。" },
  ],
};
