// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "hernia-lss", title: "腰椎椎間板ヘルニア vs 腰部脊柱管狭窄症",
      a: { name: "腰椎椎間板ヘルニア", color: "sun", traits: ["若い", "前かがみで悪化", "SLR陽性"] },
      b: { name: "腰部脊柱管狭窄症", color: "cobalt", traits: ["高齢者", "間欠跛行", "前かがみで楽"] },
      clues: [
        { text: "20〜40代", side: "a" },
        { text: "前かがみで休むと楽になり、また歩ける", side: "b" },
        { text: "下肢伸展挙上テストが陽性", side: "a" },
        { text: "自転車ならいくらでもこげる", side: "b" },
        { text: "多くは数か月で自然に小さくなる", side: "a" },
        { text: "腰を反らすと症状が出る", side: "b" },
      ] },
    { ...M, id: "oa-ra-knee", title: "変形性膝関節症 vs 関節リウマチの膝",
      a: { name: "変形性膝関節症", color: "mint", traits: ["高齢女性", "O脚", "動き始めの痛み"] },
      b: { name: "関節リウマチ", color: "pink", traits: ["朝のこわばり", "多関節", "滑膜炎"] },
      clues: [
        { text: "内側の関節裂隙が狭く、骨棘", side: "a" },
        { text: "両手の指の付け根も腫れている", side: "b" },
        { text: "立ち上がりや歩き始めが痛い", side: "a" },
        { text: "朝のこわばりが1時間以上", side: "b" },
        { text: "体重を減らし、大腿四頭筋を鍛える", side: "a" },
        { text: "メトトレキサート", side: "b" },
      ] },
  ],
};
