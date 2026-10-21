// 染色体と血液腫瘍 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "t(15;17) PML-RARA", disease: "急性前骨髄球性白血病" },
    { ...M, marker: "t(9;22) BCR-ABL1", disease: "慢性骨髄性白血病" },
    { ...M, marker: "t(8;14) MYC", disease: "Burkittリンパ腫" },
    { ...M, marker: "t(14;18) BCL2", disease: "濾胞性リンパ腫" },
    { ...M, marker: "t(11;14) サイクリンD1", disease: "マントル細胞リンパ腫" },
    { ...M, marker: "JAK2 V617F", disease: "真性多血症" },
    { ...M, marker: "HTLV-1", disease: "成人T細胞白血病・リンパ腫" },
    { ...M, marker: "t(8;21) RUNX1-RUNX1T1", disease: "AML（予後がよい型）" },
  ],
};
