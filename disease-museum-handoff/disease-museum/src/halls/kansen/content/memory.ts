// 動物・虫と感染症 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "ツツガムシ", disease: "つつが虫病（刺し口・発疹）" },
    { ...M, marker: "マダニ", disease: "重症熱性血小板減少症候群（SFTS）" },
    { ...M, marker: "ハマダラカ", disease: "マラリア" },
    { ...M, marker: "コガタアカイエカ", disease: "日本脳炎" },
    { ...M, marker: "オウム・インコ", disease: "オウム病（クラミジア）" },
    { ...M, marker: "ネズミの尿", disease: "レプトスピラ症（Weil病）" },
    { ...M, marker: "ネコのひっかき傷", disease: "猫ひっかき病（バルトネラ）" },
    { ...M, marker: "加熱不十分の豚肉・ネコのふん", disease: "トキソプラズマ症" },
  ],
};
