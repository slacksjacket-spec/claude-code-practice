// GCS採点（共通ゲーム gcs）。症例は架空。TODO(review)
import type { GcsData } from "../../../engine/games/gcs.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const gcsContent: GcsData = {
  stampAt: 4,
  cases: [
    { ...M, id: "c1", who: "25歳 男性（バイク事故）", story: "呼びかけると目を開ける。名前は言えるが、ここがどこか、今日が何日かを間違える。「手を握って」に従える。", e: 3, v: 4, m: 6,
      explanation: "E3V4M6 ＝ 13。見当識障害があれば V4。" },
    { ...M, id: "c2", who: "70歳 女性（脳出血）", story: "胸骨を強く押すと目を開ける。うめき声だけ。押している手を払いのけようとする。", e: 2, v: 2, m: 5,
      explanation: "E2V2M5 ＝ 9。痛みの場所に手をもってくれば M5（払いのけ）。" },
    { ...M, id: "c3", who: "55歳 男性（脳底動脈の閉塞）", story: "目を開けない。声も出ない。痛み刺激で両腕を伸ばして内側にひねる。", e: 1, v: 1, m: 2,
      followUp: { question: "この姿勢が示す障害の高さは？", options: ["中脳〜橋（除脳硬直）", "大脳皮質だけ", "脊髄", "末梢神経"], answer: 0 },
      explanation: "E1V1M2 ＝ 4。上肢の伸展は除脳硬直。" },
    { ...M, id: "c4", who: "80歳 女性（肺炎）", story: "自分から目を開けている。話しかけると「りんご」「電車」と、話がかみ合わない言葉が出る。指示には従える。", e: 4, v: 3, m: 6,
      explanation: "E4V3M6 ＝ 13。会話が成り立たず単語だけなら V3。文章になっていて混乱していれば V4。" },
    { ...M, id: "c5", who: "40歳 男性（急性アルコール中毒）", story: "大きな声で呼ぶと目を開ける。話すが混乱している。痛み刺激で手を引っ込めるが、払いのけはしない。", e: 3, v: 4, m: 4,
      explanation: "E3V4M4 ＝ 11。逃避（引っ込める）は M4。" },
    { ...M, id: "c6", who: "60歳 男性（頭部外傷）", story: "目を開けない。声も出ない。痛み刺激で両腕をゆっくり曲げ、足は伸ばす。", e: 1, v: 1, m: 3,
      followUp: { question: "まずすべきことは？", options: ["気道を確保する（GCS 8以下は気管挿管を考える）", "様子を見る", "経口で水を飲ませる", "MRIを先に撮る"], answer: 0 },
      explanation: "E1V1M3 ＝ 5。異常屈曲（除皮質）。GCS 8以下は気道確保を考える。" },
  ],
};
