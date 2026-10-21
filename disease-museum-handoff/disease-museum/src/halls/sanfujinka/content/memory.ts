// マーカー・ホルモンと婦人科の病気 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "hCG 著明高値", disease: "胞状奇胎・絨毛癌" },
    { ...M, marker: "AFP", disease: "卵黄嚢腫瘍" },
    { ...M, marker: "CA125", disease: "卵巣癌（漿液性癌）・子宮内膜症" },
    { ...M, marker: "SCC", disease: "子宮頸部の扁平上皮癌" },
    { ...M, marker: "エストロゲン産生", disease: "顆粒膜細胞腫" },
    { ...M, marker: "LH/FSH比の上昇", disease: "多嚢胞性卵巣症候群" },
    { ...M, marker: "プロラクチン高値", disease: "乳汁漏出・無月経" },
    { ...M, marker: "CEA・CA19-9", disease: "卵巣の粘液性癌" },
  ],
};
