// 糖負荷曲線（ホール専用 ogtt）。値は架空。TODO(review) 判定と診断の手順
import type { OgttData } from "../exhibits/ogtt.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const ogttContent: OgttData = {
  stampAt: 4,
  cases: [
    { ...M, id: "normal", who: "45歳 男性", story: "健診で尿糖を指摘された。", glucose: [92, 150, 135, 115], answer: "normal",
      followUp: { question: "このあとは？", options: ["糖尿病ではない。生活習慣の話をして終わり", "インスリンを始める", "メトホルミンを始める", "1型糖尿病として抗体を調べる"], correct: 0 },
      explanation: "空腹時110未満かつ2時間値140未満で正常型。尿糖は腎性糖尿のこともある。" },
    { ...M, id: "border", who: "50歳 女性", story: "肥満。母が糖尿病。", glucose: [118, 190, 210, 175], hba1c: 6.0, answer: "border",
      followUp: { question: "この人について正しいのは？", options: ["糖尿病の予備群。食事と運動で発症を防ぐ", "糖尿病と確定", "正常なので何もしない", "1型糖尿病"], correct: 0 },
      explanation: "正常型でも糖尿病型でもないものが境界型。将来の糖尿病と動脈硬化の危険が高い。" },
    { ...M, id: "dm-sameday", who: "58歳 男性", story: "口が渇く、尿が多い。", glucose: [140, 240, 290, 260], hba1c: 7.2, answer: "dm",
      followUp: { question: "糖尿病と診断できる？", options: ["血糖とHbA1cが同じ日にともに糖尿病型なので診断できる", "別の日に再検してからでないと診断できない", "HbA1cが8%以上でないと診断できない", "尿糖が出ないと診断できない"], correct: 0 },
      explanation: "血糖値（空腹時126以上、2時間値200以上、随時200以上のいずれか）とHbA1c 6.5%以上が同時にそろえば1回で診断。" },
    { ...M, id: "dm-recheck", who: "52歳 男性", story: "症状はない。", glucose: [128, 205, 235, 210], hba1c: 6.1, answer: "dm",
      followUp: { question: "このあとは？", options: ["別の日に再検査し、また糖尿病型なら診断", "今日糖尿病と診断できる", "正常型として扱う", "1型糖尿病と診断"], correct: 0 },
      explanation: "血糖だけが糖尿病型で、典型的な症状や網膜症がなければ、別の日の再検が必要。" },
    { ...M, id: "resist", who: "47歳 男性", story: "腹部肥満、脂肪肝。インスリンも一緒に測った。", glucose: [120, 210, 230, 190], insulin: [20, 60, 110, 150], answer: "border",
      followUp: { question: "インスリンの出方は？", options: ["遅れて、たくさん出ている（インスリン抵抗性）", "ほとんど出ていない（インスリン欠乏）", "まったく正常", "最初だけたくさん出ている"], correct: 0 },
      explanation: "肥満の2型糖尿病の始まり。効きが悪いので、遅れて多く出る。運動と減量が効く。" },
    { ...M, id: "dumping", who: "65歳 男性", story: "胃を全部取る手術のあと。食後2〜3時間で冷や汗とふるえ。", glucose: [90, 250, 160, 60], insulin: [8, 140, 90, 20], answer: "normal",
      followUp: { question: "60分の高い山と120分の低血糖は？", options: ["後期ダンピング症候群（急な吸収でインスリンが出すぎる）", "1型糖尿病", "インスリノーマ", "早期ダンピング症候群"], correct: 0 },
      explanation: "糖が一気に吸収され（oxyhyperglycemia）、遅れて出たインスリンで低血糖。少量頻回の食事。判定区分は空腹時と2時間値で決まるので、この形でも正常型になる。" },
  ],
};
