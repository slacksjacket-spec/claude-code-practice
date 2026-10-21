// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "asthma-copd", title: "喘息 vs COPD",
      a: { name: "気管支喘息", color: "sun", traits: ["可逆性あり", "好酸球性の炎症", "夜間・早朝の発作"] },
      b: { name: "COPD", color: "#8FB2FF", traits: ["喫煙", "不可逆性", "肺気腫"] },
      clues: [
        { text: "気管支拡張薬の吸入で1秒量が大きく改善", side: "a" },
        { text: "呼気中一酸化窒素（FeNO）が高い", side: "a" },
        { text: "喫煙歴 40パック・年", side: "b" },
        { text: "胸部CTで肺の低吸収域", side: "b" },
        { text: "治療の中心は吸入ステロイド", side: "a" },
        { text: "肺拡散能（DLco）の低下", side: "b" },
      ] },
    { ...M, id: "tb-ntm", title: "肺結核 vs 肺MAC症",
      a: { name: "肺結核", color: "tomato", traits: ["空気感染", "上葉の空洞", "隔離が必要"] },
      b: { name: "肺MAC症", color: "mint", traits: ["中高年のやせ型女性", "中葉・舌区", "人にうつらない"] },
      clues: [
        { text: "陰圧個室に隔離する", side: "a" },
        { text: "中葉・舌区の気管支拡張と小結節", side: "b" },
        { text: "インターフェロンγ遊離試験が陽性", side: "a" },
        { text: "抗MAC抗体（抗GPL core IgA抗体）が陽性", side: "b" },
        { text: "治療はイソニアジド・リファンピシンなど4剤から", side: "a" },
        { text: "治療はクラリスロマイシンを含む3剤", side: "b" },
      ] },
  ],
};
