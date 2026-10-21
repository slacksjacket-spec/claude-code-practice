// 低ナトリウム血症すごろく（AlgorithmBoard）。TODO(review) 尿Naの目安（20〜30 mEq/L）、補正速度の注意
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const hyponatremiaContent: ExhibitOf<"AlgorithmBoard">["data"] = {
  stampAt: 4,
  nodes: [
    { id: "osm", label: "血漿浸透圧", question: "血漿浸透圧は？", options: [{ value: "low", label: "低い（低張性）" }, { value: "nl", label: "正常〜高い" }] },
    { id: "vol", label: "体液量", question: "細胞外液量は？", options: [{ value: "low", label: "減っている" }, { value: "nl", label: "ほぼ正常" }, { value: "high", label: "増えている（浮腫）" }] },
    { id: "una", label: "尿Na", question: "尿中Naは？", options: [{ value: "low", label: "低い（腎はNaを保持）" }, { value: "high", label: "高い（尿にNaが出ている）" }] },
  ],
  goalLabel: "原因と対応",
  treatments: [
    "高血糖などによる見かけの低Na（原因を治す）",
    "腎外からの喪失（嘔吐・下痢）→ 生理食塩水",
    "腎からの喪失（利尿薬・副腎不全）→ 原因薬の中止・補充",
    "SIADH → 水制限",
    "心不全・肝硬変・ネフローゼ → 原疾患の治療と水・塩分制限",
  ],
  patients: [
    { ...M, card: { 年齢: "60", 経過: "糖尿病で血糖 800 mg/dL", Na: "126" }, path: ["osm", "goal"], answers: { osm: "nl" }, treatments: [0],
      explanation: "高血糖で浸透圧が高く、水が細胞から出てNaが薄まる。血糖を下げれば戻る。" },
    { ...M, card: { 年齢: "75", 経過: "数日の嘔吐と下痢", 所見: "皮膚のツルゴール低下", Na: "125", 尿Na: "10" }, path: ["osm", "vol", "una", "goal"], answers: { osm: "low", vol: "low", una: "low" }, treatments: [1],
      explanation: "体液が減り、腎臓はNaを保持（尿Na低値）。生理食塩水で補う。" },
    { ...M, card: { 年齢: "82", 経過: "サイアザイドを内服", 所見: "脱水ぎみ", Na: "122", 尿Na: "60" }, path: ["osm", "vol", "una", "goal"], answers: { osm: "low", vol: "low", una: "high" }, treatments: [2],
      explanation: "体液が減っているのに尿にNaが出ている＝腎からの喪失。サイアザイドは低Na血症を起こしやすい。" },
    { ...M, card: { 年齢: "68", 経過: "小細胞肺癌", 所見: "浮腫なし・脱水なし", Na: "118", 尿Na: "70", 尿浸透圧: "500" }, path: ["osm", "vol", "una", "goal"], answers: { osm: "low", vol: "nl", una: "high" }, treatments: [3],
      explanation: "体液量正常で尿が濃くNaも出ている。抗利尿ホルモンの不適切な分泌（SIADH）。水制限。急な補正は浸透圧性脱髄症候群を起こす。" },
    { ...M, card: { 年齢: "78", 経過: "心不全", 所見: "下腿浮腫・頸静脈怒張", Na: "126", 尿Na: "8" }, path: ["osm", "vol", "una", "goal"], answers: { osm: "low", vol: "high", una: "low" }, treatments: [4],
      explanation: "体の水とNaは多いが、有効循環血液量が少なくADHが出る。心不全の治療と水分制限。" },
    { ...M, card: { 年齢: "45", 経過: "長年のステロイド内服を急に中止", 所見: "低血圧・高K", Na: "124", 尿Na: "50" }, path: ["osm", "vol", "una", "goal"], answers: { osm: "low", vol: "low", una: "high" }, treatments: [2],
      explanation: "副腎不全（ミネラルコルチコイド不足）で腎からNaを失う。ステロイドを補充。" },
  ],
};
