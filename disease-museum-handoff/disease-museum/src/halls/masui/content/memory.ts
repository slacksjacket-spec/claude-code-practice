// 麻酔の薬 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "プロポフォール", disease: "血圧低下・長期大量でプロポフォール注入症候群" },
    { ...M, marker: "ケタミン", disease: "血圧が保たれ、気管支を広げる。悪夢" },
    { ...M, marker: "スキサメトニウム", disease: "高K血症・悪性高熱症の誘因" },
    { ...M, marker: "ロクロニウム", disease: "スガマデクスで拮抗" },
    { ...M, marker: "セボフルラン", disease: "においが少なく、吸入で導入できる" },
    { ...M, marker: "亜酸化窒素", disease: "閉じた空間が広がる（気胸・腸閉塞で避ける）" },
    { ...M, marker: "ミダゾラム", disease: "フルマゼニルで拮抗" },
    { ...M, marker: "ブピバカイン", disease: "心毒性が強い局所麻酔薬（中毒に脂肪乳剤）" },
  ],
};
