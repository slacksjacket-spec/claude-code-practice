// 運動器ER（共通ゲーム scenario）。症例は架空。TODO(review) コンパートメント症候群、開放骨折、化膿性股関節炎
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "compartment", title: "コンパートメント症候群", patient: "25歳 男性。バイク事故で脛骨骨折。ギプスを巻いた。",
      steps: [
        { vitals: "足の脈は触れる", situation: "夜、鎮痛薬が効かないほど痛がる。足の指を伸ばすと激痛。", answer: 0,
          options: ["ギプスをすぐに外して、筋区画内圧を測る", "鎮痛薬を増やす", "足を高く上げて朝まで待つ", "ギプスをさらにきつく巻く"],
          explanation: "脈が触れても否定できない。他動的に伸ばしたときの激痛が早いサイン。" },
        { vitals: "区画内圧 50 mmHg", situation: "圧が高い。", answer: 0,
          options: ["緊急で筋膜切開", "冷やして様子を見る", "利尿薬", "翌日手術"],
          explanation: "数時間で筋肉が壊死する（Volkmann拘縮）。すぐに減圧。" },
      ] },
    { ...M, id: "open", title: "開放骨折", patient: "40歳 男性。高所から転落。下腿から骨が飛び出している。",
      steps: [
        { vitals: "BP 120/70", situation: "まずは？", answer: 0,
          options: ["傷を覆い、抗菌薬と破傷風の予防を早く、緊急で洗浄・デブリードマン", "骨を押し込んで包帯", "翌週手術", "抗菌薬は不要"],
          explanation: "開放骨折は感染との戦い。早期の抗菌薬と、できるだけ早い洗浄・デブリードマン。" },
        { vitals: "洗浄後", situation: "骨はどう固定する？", answer: 0,
          options: ["汚染が強ければ創外固定から始める", "すぐに大きな金属を埋め込む", "固定しない", "湿布"],
          explanation: "汚れた傷に内固定を入れると感染しやすい。状態で選ぶ。" },
      ] },
    { ...M, id: "septic", title: "化膿性股関節炎", patient: "1歳 男児。おむつを替えるときに泣く。",
      steps: [
        { vitals: "T 39.0  CRP 12", situation: "右の股関節を動かすと強く泣き、足を曲げて外に開いた姿勢。", answer: 0,
          options: ["関節穿刺で膿を確認し、緊急で切開排膿", "単純性股関節炎として様子を見る", "解熱薬だけ", "1週間後に再診"],
          explanation: "関節の中の膿は軟骨や骨頭を短時間で壊す。高熱・CRP高値なら単純性股関節炎ではなく化膿性を疑う。" },
        { vitals: "黄色ブドウ球菌", situation: "術後。", answer: 0,
          options: ["感受性に合わせた抗菌薬を十分な期間", "抗菌薬はすぐ中止", "ステロイド", "何もしない"],
          explanation: "骨頭壊死や成長障害の後遺症がないか経過を見る。" },
      ] },
  ],
};
