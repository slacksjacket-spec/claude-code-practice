// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "gout-pseudo", title: "痛風 vs 偽痛風",
      a: { name: "痛風", color: "tomato", traits: ["尿酸", "母趾の付け根", "中年男性"] },
      b: { name: "偽痛風", color: "cobalt", traits: ["ピロリン酸Ca", "膝・手首", "高齢者"] },
      clues: [
        { text: "足の親指の付け根が夜中に激痛", side: "a" },
        { text: "X線で半月板や軟骨の石灰化", side: "b" },
        { text: "針状の結晶、偏光で負の複屈折", side: "a" },
        { text: "菱形の結晶、偏光で弱い正の複屈折", side: "b" },
        { text: "発作中に尿酸を下げる薬を新しく始めない", side: "a" },
        { text: "副甲状腺機能亢進症や低Mg血症に合併", side: "b" },
      ] },
    { ...M, id: "takayasu-gca", title: "高安動脈炎 vs 巨細胞性動脈炎",
      a: { name: "高安動脈炎", color: "pink", traits: ["若い女性", "脈なし", "大動脈弓"] },
      b: { name: "巨細胞性動脈炎", color: "sun", traits: ["50歳以上", "側頭動脈", "失明"] },
      clues: [
        { text: "20代の女性", side: "a" },
        { text: "リウマチ性多発筋痛症を合併しやすい", side: "b" },
        { text: "左右の腕で血圧の差", side: "a" },
        { text: "あご跛行（噛むと痛い）", side: "b" },
        { text: "潰瘍性大腸炎を合併することがある", side: "a" },
        { text: "側頭動脈の生検で巨細胞", side: "b" },
      ] },
  ],
};
