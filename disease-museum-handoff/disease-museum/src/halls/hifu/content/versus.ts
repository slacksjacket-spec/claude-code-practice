// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "zoster-hsv", title: "帯状疱疹 vs 単純疱疹",
      a: { name: "帯状疱疹", color: "tomato", traits: ["片側の帯", "神経痛", "高齢者"] },
      b: { name: "単純疱疹", color: "cobalt", traits: ["唇や陰部", "くり返す", "小さな水疱の集まり"] },
      clues: [
        { text: "体の片側、1つの神経の範囲に帯状に並ぶ", side: "a" },
        { text: "疲れると同じ唇のところに出る", side: "b" },
        { text: "治ったあとも痛みが続くことがある", side: "a" },
        { text: "顔の片側の麻痺と耳の水疱（Ramsay Hunt症候群）", side: "a" },
        { text: "アトピー性皮膚炎に広がるとKaposi水痘様発疹症", side: "b" },
        { text: "ワクチンで予防できる（50歳以上）", side: "a" },
      ] },
    { ...M, id: "psoriasis-ad", title: "尋常性乾癬 vs アトピー性皮膚炎",
      a: { name: "尋常性乾癬", color: "sun", traits: ["銀白色の鱗屑", "肘・膝・頭", "Auspitz現象"] },
      b: { name: "アトピー性皮膚炎", color: "pink", traits: ["かゆい湿疹", "肘や膝の内側", "IgE"] },
      clues: [
        { text: "境界がくっきりした紅斑に厚い銀白色の鱗屑", side: "a" },
        { text: "肘や膝の内側（屈側）のかゆい湿疹", side: "b" },
        { text: "傷つけたところに新しい皮疹（Köbner現象）", side: "a" },
        { text: "乳児期に始まり、顔や頭から", side: "b" },
        { text: "爪の点状のくぼみと関節炎", side: "a" },
        { text: "TARCが重症度の目安", side: "b" },
      ] },
  ],
};
