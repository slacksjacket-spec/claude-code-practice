// バイアス 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "思い出しバイアス", disease: "症例対照研究で、病気の人ほど過去をよく思い出す" },
    { ...M, marker: "交絡", disease: "飲酒と肺癌の関係の陰に喫煙が隠れている" },
    { ...M, marker: "リードタイムバイアス", disease: "検診で早く見つかっただけで生存期間が延びて見える" },
    { ...M, marker: "レングスバイアス", disease: "ゆっくり進むがんほど検診で見つかりやすい" },
    { ...M, marker: "健康労働者効果", disease: "働いている人は一般集団より健康" },
    { ...M, marker: "出版バイアス", disease: "差が出なかった研究は発表されにくい" },
    { ...M, marker: "選択バイアス", disease: "ボランティアは健康に関心が高い人が多い" },
    { ...M, marker: "過剰診断", disease: "一生害にならないがんまで見つけて治療してしまう" },
  ],
};
