// 全身の病気と目 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "Behçet病", disease: "前房蓄膿を伴うぶどう膜炎" },
    { ...M, marker: "サルコイドーシス", disease: "豚脂様の角膜後面沈着物" },
    { ...M, marker: "Marfan症候群", disease: "水晶体の上方への偏位" },
    { ...M, marker: "Wilson病", disease: "Kayser-Fleischer角膜輪" },
    { ...M, marker: "甲状腺眼症", disease: "眼球突出・上まぶたの後退" },
    { ...M, marker: "神経線維腫症1型", disease: "虹彩のLisch結節" },
    { ...M, marker: "Tay-Sachs病", disease: "cherry-red spot" },
    { ...M, marker: "Sjögren症候群", disease: "乾性角結膜炎（Schirmer試験）" },
  ],
};
