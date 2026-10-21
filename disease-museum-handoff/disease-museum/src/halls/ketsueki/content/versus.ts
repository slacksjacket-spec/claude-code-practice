// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "ida-acd", title: "鉄欠乏性貧血 vs 慢性炎症に伴う貧血",
      a: { name: "鉄欠乏性貧血", color: "tomato", traits: ["フェリチン低", "TIBC高", "鉄剤が効く"] },
      b: { name: "慢性炎症に伴う貧血", color: "cobalt", traits: ["フェリチン正常〜高", "TIBC低", "ヘプシジン"] },
      clues: [
        { text: "フェリチン 5 ng/mL", side: "a" },
        { text: "TIBC（総鉄結合能）が低い", side: "b" },
        { text: "関節リウマチや慢性感染症がある", side: "b" },
        { text: "氷を無性に食べたくなる（異食症）", side: "a" },
        { text: "ヘプシジンが増えて鉄が出てこない", side: "b" },
        { text: "スプーン状の爪", side: "a" },
      ] },
    { ...M, id: "itp-ttp", title: "ITP vs TTP",
      a: { name: "免疫性血小板減少症", color: "pink", traits: ["血小板だけ", "抗体", "元気"] },
      b: { name: "血栓性血小板減少性紫斑病", color: "sun", traits: ["破砕赤血球", "ADAMTS13", "精神神経症状"] },
      clues: [
        { text: "血小板が少ない以外はほぼ元気", side: "a" },
        { text: "破砕赤血球とLDH上昇", side: "b" },
        { text: "意識の変動、発熱、腎障害", side: "b" },
        { text: "ピロリ菌の除菌で血小板が増えることがある", side: "a" },
        { text: "血漿交換が第一選択", side: "b" },
        { text: "ステロイドやトロンボポエチン受容体作動薬", side: "a" },
      ] },
  ],
};
