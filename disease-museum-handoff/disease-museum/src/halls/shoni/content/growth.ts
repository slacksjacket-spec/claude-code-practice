// 成長曲線（ホール専用 growth）。曲線は模式、値は架空。TODO(review)
import type { GrowthData } from "../exhibits/growth.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const OPTS = ["平均のあたりを平行に伸びている", "−2SD付近を平行に伸びている", "途中から曲線を横切って下がっている", "曲線を横切って急に上がっている"];

export const growthContent: GrowthData = {
  stampAt: 4,
  cases: [
    { ...M, id: "normal", who: "10歳 男児", story: "「背が低いのでは」と母が心配して受診。", height: [[4, 101], [6, 116], [8, 126], [10, 139]],
      question: "身長の伸び方は？", options: OPTS, answer: 0,
      followUp: { question: "対応は？", options: ["正常の範囲。経過を見る", "成長ホルモンを始める", "頭部MRI", "染色体検査"], answer: 0 },
      explanation: "平均に沿って伸びていれば正常。成長曲線に点を打つのがいちばんの検査。" },
    { ...M, id: "familial", who: "10歳 男児", story: "両親とも小柄。元気で、ほかに症状はない。", height: [[4, 95], [6, 106], [8, 117], [10, 127]],
      question: "身長の伸び方は？", options: OPTS, answer: 1,
      followUp: { question: "考えるのは？", options: ["家族性（体質性）低身長", "成長ホルモン分泌不全性低身長", "甲状腺機能低下症", "Cushing症候群"], answer: 0 },
      explanation: "低くても曲線と平行（成長率は正常）。骨年齢は年齢相応。" },
    { ...M, id: "ghd", who: "10歳 男児", story: "6歳ごろから急に背が伸びなくなった。最近、頭痛と視野が狭い。", height: [[4, 102], [6, 115], [8, 121], [10, 125]],
      question: "身長の伸び方は？", options: OPTS, answer: 2,
      followUp: { question: "まず考えて調べることは？", options: ["脳腫瘍（頭蓋咽頭腫）による成長ホルモン不足。頭部MRI", "家族性なので心配ない", "肥満の治療", "思春期早発症の治療"], answer: 0 },
      explanation: "成長率が落ちて曲線を横切るのは病気のサイン。視野障害があれば頭蓋咽頭腫。" },
    { ...M, id: "endocrine", who: "10歳 男児", story: "最近太ってきて、背は伸びない。成績も落ちた。", height: [[6, 115], [8, 122], [10, 126]], weight: [[6, 20], [8, 30], [10, 40]],
      question: "身長と体重の動きは？", options: ["身長の伸びが止まり、体重は増え続けている", "どちらも平行に伸びている", "身長も体重も増えない", "身長だけ急に伸びる"], answer: 0,
      followUp: { question: "考えるのは？", options: ["内分泌の病気（甲状腺機能低下症・Cushing症候群）", "単純性肥満", "家族性低身長", "思春期早発症"], answer: 0 },
      explanation: "単純性肥満では身長もよく伸びる。身長が止まって太るのは内分泌の病気を疑う。" },
    { ...M, id: "precocious", who: "7歳 女児", story: "6歳で乳房がふくらみ始めた。", height: [[4, 102], [6, 124], [7, 131], [8, 138]],
      question: "身長の伸び方は？", options: OPTS, answer: 3,
      followUp: { question: "このまま放っておくと？", options: ["骨年齢が進み、最終身長は低くなる", "最終身長は高くなる", "何も起こらない", "知能が下がる"], answer: 0 },
      explanation: "思春期早発症。いったん背が伸びるが、骨端線が早く閉じる。GnRHアナログで止める。女児は多くが特発性、男児は器質性が多い。" },
    { ...M, id: "turner", who: "10歳 女児", story: "首の横の皮膚がたるみ（翼状頸）、肘が外に反る。", height: [[4, 94], [6, 103], [8, 111], [10, 118]],
      question: "身長の伸び方は？", options: OPTS, answer: 2,
      followUp: { question: "調べるのは？", options: ["染色体検査（Turner症候群）", "頭部CT", "便潜血", "心電図だけ"], answer: 0 },
      explanation: "Turner症候群（45,X）。低身長、性腺機能不全、大動脈縮窄。成長ホルモン療法の対象。" },
  ],
};
