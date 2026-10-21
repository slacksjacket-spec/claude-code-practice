// 順番に並べよ（共通ゲーム order）。TODO(review) 時間の目安
import type { OrderData } from "../../../engine/games/order.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const orderContent: OrderData = {
  stampAt: 3,
  cases: [
    { ...M, id: "awd", prompt: "最後の飲酒からの、アルコール離脱症状の出る順は？", ends: ["早い", "遅い"], items: ["手のふるえ・発汗（6〜24時間）", "幻覚（12〜48時間）", "離脱けいれん（24〜48時間）", "振戦せん妄（48〜96時間）"],
      explanation: "振戦せん妄は数日たってから。ベンゾジアゼピンで予防・治療。" },
    { ...M, id: "orient", prompt: "Alzheimer型認知症で、見当識が失われていく順は？", ends: ["早い", "遅い"], items: ["時間（日付・季節）", "場所", "人"],
      explanation: "時間→場所→人の順に分からなくなる。" },
    { ...M, id: "sleep", prompt: "眠りに入ってからの最初の睡眠周期の順は？", ends: ["先", "後"], items: ["覚醒", "ノンレム睡眠 N1", "ノンレム睡眠 N2", "ノンレム睡眠 N3（深い）", "レム睡眠"],
      explanation: "深いノンレム睡眠は夜の前半、レム睡眠は後半に長い。ナルコレプシーでは入眠時にすぐレム睡眠。" },
    { ...M, id: "ssri", prompt: "SSRIを始めてから、ふつう起こる順は？", ends: ["早い", "遅い"], items: ["吐き気などの副作用（数日）", "効果が出始める（2〜4週）", "寛解しても半年以上は続ける"],
      explanation: "副作用は先に、効果は遅れて出る。若い人では賦活症候群に注意。" },
  ],
};
