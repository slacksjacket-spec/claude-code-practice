// 染色体の病気 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "21トリソミー", disease: "心内膜床欠損・十二指腸閉鎖・白血病" },
    { ...M, marker: "18トリソミー", disease: "手指の重なり・揺り椅子状の足底" },
    { ...M, marker: "13トリソミー", disease: "口唇口蓋裂・全前脳胞症・多指" },
    { ...M, marker: "45,X", disease: "低身長・翼状頸・大動脈縮窄" },
    { ...M, marker: "47,XXY", disease: "高身長・小さな精巣・女性化乳房" },
    { ...M, marker: "22q11.2欠失", disease: "胸腺低形成・低Ca血症・円錐動脈幹の異常" },
    { ...M, marker: "15q11-q13 父由来の欠失", disease: "筋緊張低下と過食（Prader-Willi症候群）" },
    { ...M, marker: "7q11.23欠失", disease: "大動脈弁上狭窄・妖精様顔貌（Williams症候群）" },
  ],
};
