// 中毒と解毒薬 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "アセトアミノフェン", disease: "N-アセチルシステイン" },
    { ...M, marker: "有機リン", disease: "アトロピン・PAM" },
    { ...M, marker: "オピオイド", disease: "ナロキソン" },
    { ...M, marker: "ベンゾジアゼピン", disease: "フルマゼニル" },
    { ...M, marker: "一酸化炭素", disease: "100%酸素（高気圧酸素）" },
    { ...M, marker: "シアン", disease: "ヒドロキソコバラミン" },
    { ...M, marker: "メタノール・エチレングリコール", disease: "ホメピゾール" },
    { ...M, marker: "鉄", disease: "デフェロキサミン" },
  ],
};
