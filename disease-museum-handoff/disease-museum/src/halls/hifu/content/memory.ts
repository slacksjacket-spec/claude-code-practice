// デルマドローム 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "黒色表皮腫", disease: "胃癌・インスリン抵抗性" },
    { ...M, marker: "壊疽性膿皮症", disease: "潰瘍性大腸炎" },
    { ...M, marker: "結節性紅斑", disease: "Behçet病・サルコイドーシス" },
    { ...M, marker: "ヘリオトロープ疹", disease: "皮膚筋炎（悪性腫瘍を探す）" },
    { ...M, marker: "Leser-Trélat徴候", disease: "脂漏性角化症の急な多発と内臓癌" },
    { ...M, marker: "疱疹状皮膚炎", disease: "セリアック病" },
    { ...M, marker: "発疹性黄色腫", disease: "高トリグリセリド血症" },
    { ...M, marker: "壊死性遊走性紅斑", disease: "グルカゴノーマ" },
  ],
};
