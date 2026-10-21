// 骨と関節の病気 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "骨肉腫", disease: "10代の膝のまわり・Codman三角" },
    { ...M, marker: "Ewing肉腫", disease: "骨幹・タマネギの皮のような骨膜反応" },
    { ...M, marker: "骨巨細胞腫", disease: "骨端・石けんの泡のような像" },
    { ...M, marker: "類骨骨腫", disease: "夜の痛みがアスピリンで治まる" },
    { ...M, marker: "多発性骨髄腫", disease: "頭蓋骨の打ち抜き像" },
    { ...M, marker: "Perthes病", disease: "4〜8歳男児の大腿骨頭の壊死" },
    { ...M, marker: "大腿骨頭すべり症", disease: "肥満の思春期男子・Drehmann徴候" },
    { ...M, marker: "Osgood-Schlatter病", disease: "スポーツをする少年の脛骨粗面の痛み" },
  ],
};
