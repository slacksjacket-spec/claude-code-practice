// 神経根レベル（ホール専用 root）。症例は架空。TODO(review)
import type { RootData } from "../exhibits/root.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const rootContent: RootData = {
  stampAt: 4,
  cases: [
    { ...M, id: "c5", story: "50歳 男性。首を反らすと右肩から腕に痛みが走る。腕が上がりにくい。", root: "C5",
      followUp: { question: "首を反らせて患側に傾け、上から押すと痛みが走る検査は？", options: ["Spurlingテスト", "Phalenテスト", "Lasègue徴候", "Thomasテスト"], answer: 0 },
      explanation: "頸椎症性神経根症。C5はC4/5の椎間で障害されやすい。" },
    { ...M, id: "c6", story: "45歳 女性。右の親指がしびれる。", root: "C6",
      followUp: { question: "障害されやすい椎間は？", options: ["C5/6", "C3/4", "C7/T1", "L4/5"], answer: 0 },
      explanation: "頸椎の神経根は同じ番号の椎体の上を出るので、C5/6でC6が障害される。" },
    { ...M, id: "c7", story: "55歳 男性。右の中指がしびれ、腕立て伏せがしにくい。", root: "C7",
      followUp: { question: "頸椎椎間板ヘルニアで最も多い高位の一つは？", options: ["C6/7", "C1/2", "T12/L1", "L5/S1"], answer: 0 },
      explanation: "C7はC6/7で障害される。上腕三頭筋の筋力低下と反射低下。" },
    { ...M, id: "c8", story: "60歳 男性。右の小指がしびれ、ボタンがとめにくい。", root: "C8",
      followUp: { question: "尺骨神経障害との違いは？", options: ["前腕の内側までしびれる（尺骨神経は手まで）", "親指がしびれる", "反射が亢進する", "違いはない"], answer: 0 },
      explanation: "C8の感覚領域は前腕内側まで及ぶ。肘部管症候群は手の尺側だけ。" },
    { ...M, id: "l4", story: "40歳 男性。重い物を持ってから腰痛と右足の痛み。階段を下りると膝が折れそう。", root: "L4",
      followUp: { question: "うつぶせで膝を曲げて股関節を伸ばすと太ももの前が痛む検査は？", options: ["大腿神経伸展テスト", "下肢伸展挙上テスト", "Patrickテスト", "Phalenテスト"], answer: 0 },
      explanation: "L4は上位腰椎（L3/4）のヘルニアで障害されることが多い。" },
    { ...M, id: "l5", story: "35歳 男性。腰痛と左足の痛み。かかと歩きができない。", root: "L5",
      followUp: { question: "腰椎椎間板ヘルニアで最も多い高位は？", options: ["L4/5", "L1/2", "L2/3", "T11/12"], answer: 0 },
      explanation: "L4/5の後側方ヘルニアはL5を圧迫。下肢伸展挙上テスト（Lasègue）陽性。足の親指を反らす力が落ちる。" },
    { ...M, id: "s1", story: "45歳 女性。腰痛と右足の痛み。つま先立ちができない。", root: "S1",
      followUp: { question: "障害されやすい椎間は？", options: ["L5/S1", "L3/4", "C5/6", "T12/L1"], answer: 0 },
      explanation: "S1はL5/S1のヘルニアで。アキレス腱反射が落ちる。" },
  ],
};
