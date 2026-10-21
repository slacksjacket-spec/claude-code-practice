// トキシドローム（ホール専用 toxidrome）。症例は架空。TODO(review) 各症例の所見と解毒薬
import type { ToxData } from "../exhibits/tox.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const toxContent: ToxData = {
  stampAt: 4,
  cases: [
    { ...M, id: "anticho", story: "20歳 女性。かぜ薬（抗ヒスタミン薬）を大量に飲んだ。", vitals: { HR: 132, BP: "150/90", RR: 20, T: 38.6 }, pupils: "mydriasis", skin: "dry", bowel: "down", mental: "興奮・幻覚", answer: "anticholinergic",
      followUp: { question: "この症候群でよく見るのは？", options: ["尿閉", "流涎", "下痢", "徐脈"], answer: 0 },
      explanation: "「ウサギのように熱く、骨のように乾き、ビーツのように赤く、帽子屋のように狂う」。三環系抗うつ薬、抗ヒスタミン薬、チョウセンアサガオ。" },
    { ...M, id: "op", story: "70歳 男性。畑で農薬を飲んで倒れていた。", vitals: { HR: 44, BP: "90/50", RR: 30, T: 36.2 }, pupils: "miosis", skin: "wet", bowel: "up", mental: "もうろう", answer: "cholinergic",
      followUp: { question: "治療は？", options: ["アトロピン（気道分泌が乾くまで）とプラリドキシム（PAM）", "ナロキソン", "フルマゼニル", "炭酸水素ナトリウムだけ"], answer: 0 },
      explanation: "有機リン中毒。コリンエステラーゼが阻害され、縮瞳・流涎・発汗・下痢・徐脈・気道分泌の増加。サリンも同じ。" },
    { ...M, id: "symp", story: "25歳 男性。クラブで何かを使ったあと、胸が痛く興奮している。", vitals: { HR: 150, BP: "200/110", RR: 24, T: 39.2 }, pupils: "mydriasis", skin: "wet", bowel: "normal", mental: "興奮", answer: "sympathomimetic",
      followUp: { question: "興奮・頻脈・高血圧に最初に使うのは？", options: ["ベンゾジアゼピン", "β遮断薬だけ", "ナロキソン", "アトロピン"], answer: 0 },
      explanation: "コカイン・覚醒剤。抗コリンと似るが汗をかいている。β遮断薬単独はα作用が残り血圧を上げるおそれ。" },
    { ...M, id: "opioid", story: "30歳 男性。注射の跡がたくさん。公園で倒れていた。", vitals: { HR: 58, BP: "100/60", RR: 6, T: 35.8 }, pupils: "miosis", skin: "normal", bowel: "down", mental: "昏睡", answer: "opioid",
      followUp: { question: "治療は？", options: ["換気を補助し、ナロキソンを投与", "アトロピン", "フルマゼニル", "活性炭だけ"], answer: 0 },
      explanation: "縮瞳・呼吸抑制・意識障害の三徴。ナロキソンは効いている時間が短いので、再び呼吸が止まらないか観察を続ける。" },
    { ...M, id: "bzd", story: "40歳 女性。睡眠薬を空のシートが20枚。", vitals: { HR: 76, BP: "110/70", RR: 14, T: 36.4 }, pupils: "normal", skin: "normal", bowel: "normal", mental: "傾眠", answer: "sedative",
      followUp: { question: "フルマゼニルを慎重に使う理由は？", options: ["けいれんを誘発しうる（ベンゾ常用者、三環系の同時服用）", "必ず効かない", "高価だから", "呼吸を止めるから"], answer: 0 },
      explanation: "ベンゾジアゼピン単独なら呼吸抑制は軽いことが多い。支持療法が基本。" },
    { ...M, id: "tca", story: "35歳 女性。うつ病の薬（三環系）を大量に飲んだ。", vitals: { HR: 128, BP: "84/50", RR: 18, T: 37.8 }, pupils: "mydriasis", skin: "dry", bowel: "down", mental: "けいれん・意識低下", answer: "anticholinergic",
      followUp: { question: "心電図でQRSが広がっている。治療は？", options: ["炭酸水素ナトリウム", "アトロピン", "β遮断薬", "フルマゼニル"], answer: 0 },
      explanation: "三環系は抗コリン作用とナトリウムチャネル遮断（QRS延長・不整脈）。炭酸水素ナトリウムで血液をアルカリにする。" },
  ],
};
