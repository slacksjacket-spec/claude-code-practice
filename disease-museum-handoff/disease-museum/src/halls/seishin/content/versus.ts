// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "delirium-dementia", title: "せん妄 vs 認知症",
      a: { name: "せん妄", color: "sun", traits: ["急に", "意識の障害", "変動する"] },
      b: { name: "認知症", color: "cobalt", traits: ["ゆっくり", "意識は清明", "持続する"] },
      clues: [
        { text: "数時間〜数日で急に始まった", side: "a" },
        { text: "数年かけて少しずつ進んだ", side: "b" },
        { text: "夜になると悪くなり、昼はうとうと", side: "a" },
        { text: "注意は保たれ、意識ははっきりしている", side: "b" },
        { text: "原因（感染・薬・脱水）を治すとよくなる", side: "a" },
        { text: "コリンエステラーゼ阻害薬を使う", side: "b" },
      ] },
    { ...M, id: "an-bn", title: "神経性やせ症 vs 神経性過食症",
      a: { name: "神経性やせ症", color: "pink", traits: ["低体重", "やせ願望", "無月経"] },
      b: { name: "神経性過食症", color: "mint", traits: ["正常体重", "むちゃ食い", "代償行動"] },
      clues: [
        { text: "BMI 14でも「太っている」と感じる", side: "a" },
        { text: "体重はほぼ正常", side: "b" },
        { text: "むちゃ食いのあとに自分で吐く（手の甲に吐きだこ）", side: "b" },
        { text: "徐脈・低体温・うぶ毛", side: "a" },
        { text: "栄養を急に入れると再栄養症候群", side: "a" },
        { text: "SSRIが効くことがある", side: "b" },
      ] },
  ],
};
