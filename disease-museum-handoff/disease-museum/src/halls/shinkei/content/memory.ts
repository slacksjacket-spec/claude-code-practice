// 自己抗体と神経の病気 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "抗AChR抗体", disease: "重症筋無力症" },
    { ...M, marker: "抗VGCC抗体", disease: "Lambert-Eaton症候群" },
    { ...M, marker: "抗GQ1b抗体", disease: "Fisher症候群（眼筋麻痺・運動失調・腱反射消失）" },
    { ...M, marker: "抗アクアポリン4抗体", disease: "視神経脊髄炎" },
    { ...M, marker: "抗NMDA受容体抗体", disease: "卵巣奇形腫に伴う脳炎" },
    { ...M, marker: "抗GM1抗体", disease: "軸索型のGuillain-Barré症候群" },
    { ...M, marker: "抗Hu抗体", disease: "小細胞肺癌に伴う傍腫瘍性神経症候群" },
    { ...M, marker: "抗MuSK抗体", disease: "抗AChR抗体陰性の重症筋無力症" },
  ],
};
