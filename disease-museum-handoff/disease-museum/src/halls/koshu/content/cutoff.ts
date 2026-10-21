// カットオフ（ホール専用 cutoff）。分布は模式。TODO(review) 解説
import type { CutoffData } from "../exhibits/cutoff.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const D = { mu1: 68, s1: 10, mu0: 42, s0: 10 };

export const cutoffContent: CutoffData = {
  stampAt: 4,
  cases: [
    { ...M, id: "screen", story: "がん検診の1次スクリーニング。見逃しをできるだけ減らしたい。", testName: "スクリーニング検査", dist: { ...D, prev: 0.05 }, need: "sens", min: 0.95, maximize: "spec",
      followUp: { question: "スクリーニングで重視するのは？", options: ["感度（陰性なら除外できる：SnNout）", "特異度", "陽性的中率", "有病率"], answer: 0 },
      explanation: "カットオフを下げると感度が上がり、そのぶん偽陽性が増えて特異度が下がる。" },
    { ...M, id: "confirm", story: "精密検査。陽性なら手術を決めるので、偽陽性を減らしたい。", testName: "確定のための検査", dist: { ...D, prev: 0.3 }, need: "spec", min: 0.95, maximize: "sens",
      followUp: { question: "陽性なら診断を確定に近づけるのは？", options: ["特異度の高い検査（SpPin）", "感度の高い検査", "陰性的中率の高い検査", "安い検査"], answer: 0 },
      explanation: "カットオフを上げると特異度が上がり、感度が下がる。" },
    { ...M, id: "lowprev", story: "まれな病気（有病率0.2%）を、健康な人全員に検査する。", testName: "集団検診", dist: { ...D, prev: 0.002 }, need: "sens", min: 0.9, maximize: "spec",
      followUp: { question: "このとき陽性的中率はどうなる？", options: ["とても低い（陽性の多くが偽陽性）", "とても高い", "感度と同じ", "有病率と関係ない"], answer: 0 },
      explanation: "感度・特異度が同じでも、有病率が低いと陽性的中率は下がる。表の偽陽性の数を見てみよう。" },
    { ...M, id: "ppv", story: "症状のある人が集まる専門外来（有病率30%）。陽性なら治療を始めたい。", testName: "外来の検査", dist: { ...D, prev: 0.3 }, need: "ppv", min: 0.85, maximize: "sens",
      followUp: { question: "同じ検査を有病率の高い集団に使うと、陽性的中率は？", options: ["上がる", "下がる", "変わらない", "感度が上がる"], answer: 0 },
      explanation: "的中率は有病率で変わるが、感度・特異度は（理屈の上では）変わらない。" },
    { ...M, id: "npv", story: "救急外来。陰性なら安心して帰せる検査にしたい（有病率10%）。", testName: "除外のための検査", dist: { ...D, prev: 0.1 }, need: "npv", min: 0.99, maximize: "spec",
      followUp: { question: "陰性的中率の高い検査が役立つのは？", options: ["病気の除外（陰性なら安心できる）", "病気の確定", "重症度の判定", "治療効果の判定"], answer: 0 },
      explanation: "D-ダイマーのように、陰性で除外するのに使う検査。" },
  ],
};
