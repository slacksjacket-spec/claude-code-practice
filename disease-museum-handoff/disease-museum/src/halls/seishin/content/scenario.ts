// 精神科ER（共通ゲーム scenario）。症例は架空。TODO(review) 振戦せん妄の治療、再栄養症候群の予防、自殺念慮の対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "dt", title: "振戦せん妄", patient: "55歳 男性。大酒家。骨折で入院して3日目。",
      steps: [
        { vitals: "HR 128  BP 168/100  T 38.2  大量の発汗", situation: "ふるえ、興奮、「虫が這っている」と言う。", answer: 0,
          options: ["ベンゾジアゼピンを投与し、ビタミンB₁を補う", "ハロペリドールだけで鎮静", "様子を見る", "お酒を飲ませる"],
          explanation: "アルコール離脱には交差耐性のあるベンゾジアゼピン。Wernicke脳症の予防にビタミンB₁。" },
        { vitals: "落ち着いてきた", situation: "退院に向けて。", answer: 0,
          options: ["断酒を支える（専門治療・自助グループ・断酒補助薬）", "節酒すれば大丈夫と伝える", "何もしない", "ベンゾジアゼピンをずっと続ける"],
          explanation: "アルコール使用障害の治療は断酒が基本。アカンプロサートなど。" },
      ] },
    { ...M, id: "an", title: "神経性やせ症の入院", patient: "16歳 女性。BMI 12。",
      steps: [
        { vitals: "HR 40  T 35.2  K 3.0  P 2.8", situation: "ふらついて倒れた。栄養は？", answer: 0,
          options: ["少ないカロリーから始め、P・K・Mgとビタミン B₁を補いながらゆっくり増やす", "一気に高カロリーを入れる", "食べたくなるまで待つ", "利尿薬で体重を調整"],
          explanation: "急な栄養で低P血症などの再栄養症候群（心不全・不整脈）。" },
        { vitals: "3日目  P 1.6", situation: "Pが下がってきた。", answer: 0,
          options: ["Pを補い、エネルギーの増量を緩める", "そのまま増やす", "Pは測らなくてよい", "絶食にする"],
          explanation: "電解質を頻回に測り、補いながら進める。" },
      ] },
    { ...M, id: "suicide", title: "自殺の危険", patient: "40歳 男性。うつ病。外来で。",
      steps: [
        { vitals: "表情が暗い", situation: "「消えてしまいたい」とつぶやいた。", answer: 0,
          options: ["死にたい気持ちや計画について、はっきりと尋ねる", "話題をそらす", "励まして帰す", "聞くと自殺を誘うので聞かない"],
          explanation: "自殺について尋ねても危険は増えない。気持ち、計画、手段、時期を確認する。" },
        { vitals: "具体的な計画と手段がある", situation: "今夜実行するつもりだと言う。", answer: 0,
          options: ["ひとりにせず、家族と連携し入院を含めて安全を確保する", "次回の外来まで様子を見る", "睡眠薬をまとめて処方して帰す", "本人の自由なので何もしない"],
          explanation: "差し迫った危険には安全の確保を最優先。大量の処方は避ける。" },
      ] },
  ],
};
