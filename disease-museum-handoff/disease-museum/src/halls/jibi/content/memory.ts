// 耳鼻咽喉の病気 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "上咽頭癌", disease: "EBウイルス・片側の滲出性中耳炎" },
    { ...M, marker: "中咽頭癌", disease: "HPV（p16陽性は予後がよい）" },
    { ...M, marker: "声門癌", disease: "喫煙・早くから声がかすれる" },
    { ...M, marker: "真珠腫性中耳炎", disease: "骨を壊し、顔面神経麻痺やめまい" },
    { ...M, marker: "若年性血管線維腫", disease: "思春期男子のくり返す鼻出血" },
    { ...M, marker: "好酸球性副鼻腔炎", disease: "喘息・においがわからない・鼻茸" },
    { ...M, marker: "反回神経麻痺", disease: "甲状腺手術・大動脈瘤・肺癌で嗄声" },
    { ...M, marker: "Kiesselbach部位", disease: "鼻出血の多くの出血点" },
  ],
};
