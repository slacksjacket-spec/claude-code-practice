// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "spinal-epidural", title: "脊髄くも膜下麻酔 vs 硬膜外麻酔",
      a: { name: "脊髄くも膜下麻酔", color: "cobalt", traits: ["くも膜下腔", "少量ですぐ効く", "1回"] },
      b: { name: "硬膜外麻酔", color: "mint", traits: ["硬膜外腔", "カテーテル", "術後の鎮痛"] },
      clues: [
        { text: "針先から髄液が戻ってくる", side: "a" },
        { text: "抵抗消失法で針を進める", side: "b" },
        { text: "カテーテルを残して術後も鎮痛を続けられる", side: "b" },
        { text: "あとで頭を上げると強くなる頭痛（硬膜穿刺後頭痛）が典型", side: "a" },
        { text: "少ない量の局所麻酔薬で数分で効く", side: "a" },
        { text: "抗凝固薬の内服中は血腫に注意（どちらも）。抜くときにも注意", side: "b" },
      ] },
    { ...M, id: "mh-nms", title: "悪性高熱症 vs 悪性症候群",
      a: { name: "悪性高熱症", color: "tomato", traits: ["麻酔中", "数分〜数時間", "EtCO₂上昇"] },
      b: { name: "悪性症候群", color: "sun", traits: ["抗精神病薬", "数日", "筋強剛"] },
      clues: [
        { text: "揮発性麻酔薬やスキサメトニウムが引き金", side: "a" },
        { text: "抗精神病薬を増やした数日後", side: "b" },
        { text: "RYR1遺伝子の変異（家族歴）", side: "a" },
        { text: "パーキンソン病の薬を急にやめても起こる", side: "b" },
        { text: "換気を増やしてもEtCO₂が上がり続ける", side: "a" },
        { text: "意識の変化と自律神経の乱れがゆっくり進む", side: "b" },
      ] },
  ],
};
