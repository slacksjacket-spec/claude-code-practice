// 対決の間（VersusQuiz）
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "ibd", title: "潰瘍性大腸炎 vs Crohn病",
      a: { name: "潰瘍性大腸炎", color: "pink", traits: ["直腸から連続", "粘膜の病変", "血便"] },
      b: { name: "Crohn病", color: "#8FB2FF", traits: ["口から肛門まで飛び飛び", "全層性", "痔瘻"] },
      clues: [
        { text: "直腸から口側へ連続して広がる", side: "a" },
        { text: "縦走潰瘍と敷石像", side: "b" },
        { text: "非乾酪性類上皮細胞肉芽腫", side: "b" },
        { text: "ハウストラが消えた鉛管状の大腸", side: "a" },
        { text: "喫煙で悪化しやすい", side: "b" },
        { text: "中毒性巨大結腸症", side: "a" },
      ] },
    { ...M, id: "pud", title: "胃潰瘍 vs 十二指腸潰瘍",
      a: { name: "胃潰瘍", color: "sun", traits: ["中高年", "食後に痛む", "胃角部に多い"] },
      b: { name: "十二指腸潰瘍", color: "mint", traits: ["若い人", "空腹時に痛む", "球部に多い"] },
      clues: [
        { text: "食べると痛みが出る", side: "a" },
        { text: "夜中や空腹時に痛み、食べると楽になる", side: "b" },
        { text: "胃酸の分泌が多い", side: "b" },
        { text: "癌との区別のため、生検が欠かせない", side: "a" },
        { text: "20〜40代に多い", side: "b" },
        { text: "胃角部の小弯に多い", side: "a" },
      ] },
  ],
};
