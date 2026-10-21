// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "measles-rubella", title: "麻疹 vs 風疹",
      a: { name: "麻疹", color: "tomato", traits: ["高熱が二峰性", "Koplik斑", "空気感染"] },
      b: { name: "風疹", color: "pink", traits: ["軽い", "耳の後ろのリンパ節", "先天性風疹症候群"] },
      clues: [
        { text: "頬の粘膜に白い斑点", side: "a" },
        { text: "耳の後ろや首のリンパ節が腫れる", side: "b" },
        { text: "妊娠初期の感染で白内障・難聴・心奇形", side: "b" },
        { text: "回復後数年して亜急性硬化性全脳炎", side: "a" },
        { text: "発疹のあと色素沈着が残る", side: "a" },
        { text: "発疹は3日ほどで消え、色素沈着は残らない", side: "b" },
      ] },
    { ...M, id: "tsutsuga-jsf", title: "つつが虫病 vs 日本紅斑熱",
      a: { name: "つつが虫病", color: "sun", traits: ["ツツガムシ", "秋〜冬", "全国"] },
      b: { name: "日本紅斑熱", color: "mint", traits: ["マダニ", "春〜秋", "西日本"] },
      clues: [
        { text: "秋から初冬に、東北などで多い", side: "a" },
        { text: "西日本の太平洋側、春から秋", side: "b" },
        { text: "Orientia tsutsugamushi", side: "a" },
        { text: "Rickettsia japonica", side: "b" },
        { text: "発疹が手のひらや足の裏にも出やすい", side: "b" },
        { text: "刺し口が大きく黒いかさぶたになる（1 cm前後）", side: "a" },
      ] },
  ],
};
