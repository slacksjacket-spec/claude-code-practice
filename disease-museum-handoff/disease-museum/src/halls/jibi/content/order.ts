// 順番に並べよ（共通ゲーム order）。TODO(review)
import type { OrderData } from "../../../engine/games/order.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const orderContent: OrderData = {
  stampAt: 3,
  cases: [
    { ...M, id: "sound", prompt: "音が伝わる順に並べよう。", ends: ["入口", "奥"], items: ["外耳道", "鼓膜", "ツチ骨", "キヌタ骨", "アブミ骨", "蝸牛"],
      explanation: "鼓膜からアブミ骨までが中耳（伝音系）、蝸牛からが内耳（感音系）。" },
    { ...M, id: "path", prompt: "聴覚の神経路を順に並べよう。", ends: ["末梢", "中枢"], items: ["蝸牛神経核", "上オリーブ核", "外側毛帯", "下丘", "内側膝状体", "聴覚野"],
      explanation: "下丘から内側膝状体（視覚は外側膝状体）を経て、側頭葉の聴覚野へ。" },
    { ...M, id: "swallow", prompt: "飲み込みの流れを順に並べよう。", ends: ["先", "後"], items: ["先行期（食べ物を認識する）", "準備期（かんで食塊をつくる）", "口腔期（舌で送る）", "咽頭期（反射で飲み込む）", "食道期"],
      explanation: "咽頭期で喉頭蓋が閉じる。ここの障害が誤嚥性肺炎につながる。" },
  ],
};
