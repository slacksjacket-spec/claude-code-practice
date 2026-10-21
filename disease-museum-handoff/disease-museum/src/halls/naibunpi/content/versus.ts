// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "dka-hhs", title: "DKA vs HHS",
      a: { name: "糖尿病ケトアシドーシス", color: "tomato", traits: ["1型", "ケトン", "アシドーシス"] },
      b: { name: "高浸透圧高血糖状態", color: "cobalt", traits: ["高齢の2型", "高い血糖", "高い浸透圧"] },
      clues: [
        { text: "若い人がインスリンを自己中断", side: "a" },
        { text: "血糖 900 mg/dL、血漿浸透圧 350", side: "b" },
        { text: "Kussmaul呼吸、アセトン臭", side: "a" },
        { text: "高齢者が感染や利尿薬をきっかけに意識障害", side: "b" },
        { text: "pH 7.1、アニオンギャップ増加", side: "a" },
        { text: "ケトンはほとんどなく、高度の脱水", side: "b" },
      ] },
    { ...M, id: "pa-pheo", title: "原発性アルドステロン症 vs 褐色細胞腫",
      a: { name: "原発性アルドステロン症", color: "mint", traits: ["低K", "レニン低値", "副腎皮質"] },
      b: { name: "褐色細胞腫", color: "pink", traits: ["発作性", "カテコラミン", "副腎髄質"] },
      clues: [
        { text: "アルドステロン/レニン比が高い", side: "a" },
        { text: "頭痛・動悸・発汗の発作", side: "b" },
        { text: "低K血症で脱力", side: "a" },
        { text: "尿中メタネフリンが高い", side: "b" },
        { text: "手術の前にα遮断薬を十分に", side: "b" },
        { text: "副腎静脈サンプリングで左右を決める", side: "a" },
      ] },
  ],
};
