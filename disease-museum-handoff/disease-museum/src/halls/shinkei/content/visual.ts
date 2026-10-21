// 視野と病変（共通ゲーム visualField）。症例は架空。TODO(review)
import type { VisualFieldData } from "../../../engine/games/visualField.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const visualContent: VisualFieldData = {
  stampAt: 4,
  cases: [
    { ...M, id: "pit", story: "45歳 女性。月経が止まり、乳汁が出る。よく人や物にぶつかる。", lesion: "chiasm",
      followUp: { question: "考える原因は？", options: ["下垂体腺腫（プロラクチノーマ）", "後頭葉の梗塞", "緑内障", "網膜剝離"], answer: 0 },
      explanation: "視交叉で交叉する鼻側網膜の線維が下から押される。両耳側半盲。" },
    { ...M, id: "occ", story: "70歳 男性。心房細動。急に右側が見えにくくなった。中心だけは見える。", lesion: "occL",
      followUp: { question: "詰まった血管は？", options: ["左の後大脳動脈", "左の中大脳動脈", "前交通動脈", "眼動脈"], answer: 0 },
      explanation: "後頭葉の梗塞。黄斑部は中大脳動脈からも血が来るので中心が残る（黄斑回避）。" },
    { ...M, id: "meyer", story: "40歳 男性。右側頭葉てんかんの手術のあと。", lesion: "meyerR",
      followUp: { question: "この欠け方の名前は？", options: ["同名性上四分盲（pie in the sky）", "両耳側半盲", "同名性下四分盲", "中心暗点"], answer: 0 },
      explanation: "側頭葉を回るMeyerループは上の視野を運ぶ。右の障害で左上が欠ける。" },
    { ...M, id: "par", story: "65歳 女性。左の頭頂葉の脳出血。", lesion: "parL",
      explanation: "頭頂葉を通る視放線は下の視野を運ぶ。左の障害で右下が欠ける（同名性下四分盲）。" },
    { ...M, id: "on", story: "28歳 女性。数日で右目が見えにくくなり、目を動かすと痛い。", lesion: "onR",
      followUp: { question: "考える病気と、ほかに調べたいことは？", options: ["視神経炎。多発性硬化症や視神経脊髄炎を考えてMRI・抗AQP4抗体", "緑内障。眼圧", "白内障。水晶体", "網膜色素変性症。遺伝子"], answer: 0 },
      explanation: "視神経の障害は片目だけの視力低下。対光反射で相対的瞳孔求心路障害（RAPD）。" },
    { ...M, id: "tract", story: "50歳 男性。左の視索のあたりに腫瘍。", lesion: "tractL",
      explanation: "視交叉より後ろの障害は、両目の同じ側が欠ける（同名性半盲）。左の障害で右が欠ける。" },
  ],
};
