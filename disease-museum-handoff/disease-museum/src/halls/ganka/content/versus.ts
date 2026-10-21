// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "aacg-uveitis", title: "急性緑内障発作 vs 急性前部ぶどう膜炎",
      a: { name: "急性緑内障発作", color: "tomato", traits: ["眼圧高い", "散瞳", "前房が浅い"] },
      b: { name: "急性前部ぶどう膜炎", color: "mint", traits: ["縮瞳", "前房の炎症", "HLA-B27"] },
      clues: [
        { text: "瞳孔が中等度に開いて動かない", side: "a" },
        { text: "瞳孔が小さく、虹彩が水晶体にくっつく", side: "b" },
        { text: "眼圧 60 mmHg", side: "a" },
        { text: "治療に散瞳薬を使う", side: "b" },
        { text: "治療に縮瞳薬（ピロカルピン）を使う", side: "a" },
        { text: "腰痛のある若い男性", side: "b" },
      ] },
    { ...M, id: "ekc-allergy", title: "流行性角結膜炎 vs アレルギー性結膜炎",
      a: { name: "流行性角結膜炎", color: "sun", traits: ["アデノウイルス", "うつる", "耳前リンパ節"] },
      b: { name: "アレルギー性結膜炎", color: "pink", traits: ["かゆみ", "季節性", "うつらない"] },
      clues: [
        { text: "片目から始まり、数日でもう片目へ", side: "a" },
        { text: "とにかくかゆい", side: "b" },
        { text: "耳の前のリンパ節が腫れて痛む", side: "a" },
        { text: "スギ花粉の季節に毎年", side: "b" },
        { text: "結膜に濾胞、角膜に点状の混濁", side: "a" },
        { text: "結膜の乳頭増殖、目やにに好酸球", side: "b" },
      ] },
  ],
};
