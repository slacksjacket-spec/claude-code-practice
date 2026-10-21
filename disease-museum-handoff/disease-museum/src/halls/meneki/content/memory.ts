// 自己抗体 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "抗Sm抗体", disease: "SLE（特異度が高い）" },
    { ...M, marker: "抗CCP抗体", disease: "関節リウマチ（早期から陽性）" },
    { ...M, marker: "抗Scl-70抗体", disease: "びまん皮膚硬化型の全身性強皮症（間質性肺炎）" },
    { ...M, marker: "抗Jo-1抗体", disease: "多発性筋炎・皮膚筋炎（抗ARS抗体）" },
    { ...M, marker: "抗MDA5抗体", disease: "急速に進む間質性肺炎を伴う皮膚筋炎" },
    { ...M, marker: "PR3-ANCA", disease: "多発血管炎性肉芽腫症" },
    { ...M, marker: "抗リン脂質抗体", disease: "習慣流産と血栓症" },
    { ...M, marker: "抗GBM抗体", disease: "Goodpasture症候群（肺出血と腎炎）" },
  ],
};
