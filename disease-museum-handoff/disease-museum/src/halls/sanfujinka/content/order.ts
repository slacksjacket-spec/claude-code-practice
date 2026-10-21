// 順番に並べよ（共通ゲーム order）。TODO(review)
import type { OrderData } from "../../../engine/games/order.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const orderContent: OrderData = {
  stampAt: 3,
  cases: [
    { ...M, id: "rotation", prompt: "正常な分娩での胎児の回旋の順は？", ends: ["先", "後"], items: ["第1回旋：屈曲（あごを胸につける）", "第2回旋：内回旋（後頭が前へ）", "第3回旋：伸展（顔が出る）", "第4回旋：外回旋（肩の向きに合わせる）"],
      explanation: "屈曲→内回旋→伸展→外回旋。いちばん小さい周囲で産道を通る。" },
    { ...M, id: "labor", prompt: "分娩の流れを順に並べよう。", ends: ["先", "後"], items: ["規則的な陣痛の開始", "子宮口全開大", "児の娩出", "胎盤の娩出"],
      explanation: "第1期（開口期）→第2期（娩出期）→第3期（後産期）。" },
    { ...M, id: "puberty", prompt: "女子の思春期の変化を、ふつう起こる順に並べよう。", ends: ["早い", "遅い"], items: ["乳房の発育", "陰毛の発生", "身長が急に伸びる", "初経"],
      explanation: "乳房発育から始まり、初経は身長の伸びのピークのあと。" },
    { ...M, id: "cervix", prompt: "子宮頸がん検診で異常が出たあとの流れは？", ends: ["先", "後"], items: ["細胞診（スクリーニング）", "コルポスコピー", "狙い組織診", "円錐切除（診断と治療）"],
      explanation: "細胞診で異常 → コルポスコピーで見て組織をとる → 高度異形成や上皮内癌は円錐切除。" },
    { ...M, id: "follicle", prompt: "卵胞と黄体の一生を順に並べよう。", ends: ["先", "後"], items: ["原始卵胞", "胞状卵胞", "成熟卵胞（グラーフ卵胞）", "排卵", "黄体", "白体"],
      explanation: "LHサージで排卵。妊娠しなければ黄体は約14日で白体になる。" },
  ],
};
