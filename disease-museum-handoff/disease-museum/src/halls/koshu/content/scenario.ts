// 公衆衛生の現場（共通ゲーム scenario）。症例は架空。TODO(review) 届出の期限（食品衛生法、感染症法）、接触者健診
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "food", title: "食中毒の集団発生", patient: "診療所の医師。同じ弁当を食べた5人が、相次いで下痢と嘔吐で受診した。",
      steps: [
        { vitals: "5人とも同じ仕出し弁当", situation: "まずすることは？", answer: 0,
          options: ["食中毒を疑い、保健所に届け出る（24時間以内）", "様子を見る", "弁当屋に直接注意する", "報道機関に連絡する"],
          explanation: "医師は食中毒（疑いを含む）を診断したら、24時間以内に保健所長へ届け出る（食品衛生法）。" },
        { vitals: "保健所が調査を開始", situation: "原因を特定するために、保健所がまずすることは？", answer: 0,
          options: ["症例の定義を決め、食べたもの・発症時刻を調べて流行曲線を描く", "全員に抗菌薬を配る", "弁当屋を無期限に閉鎖", "何もしない"],
          explanation: "記述疫学（人・場所・時間）から仮説を立て、検便や残品の検査で確かめる。" },
      ] },
    { ...M, id: "tb", title: "結核患者の発生", patient: "病院の医師。喀痰の抗酸菌塗抹が陽性の肺結核と診断した。",
      steps: [
        { vitals: "2類感染症", situation: "届出は？", answer: 0,
          options: ["直ちに保健所に届け出る", "1週間以内に届け出る", "届出は不要", "患者の同意があれば届け出る"],
          explanation: "結核は感染症法の2類感染症で、診断したら直ちに届出。" },
        { vitals: "同居家族と職場の同僚がいる", situation: "周りの人への対応は？", answer: 0,
          options: ["保健所が接触者健診（IGRAや胸部X線）を行う", "全員に抗結核薬を飲ませる", "何もしない", "職場を閉鎖する"],
          explanation: "接触の濃さに応じて健診し、潜在性結核感染症なら治療する。" },
      ] },
    { ...M, id: "heat", title: "職場の熱中症", patient: "産業医。夏の建設現場で、作業員が熱中症で倒れた。",
      steps: [
        { vitals: "意識はあるが、ふらつき、汗が多い", situation: "まず現場ですることは？", answer: 0,
          options: ["涼しい場所へ移し、体を冷やして水分と塩分をとらせる（意識がおかしければ救急車）", "そのまま作業に戻す", "熱いお茶を飲ませる", "一人で帰宅させる"],
          explanation: "意識障害があったり、自分で飲めなければ医療機関へ。" },
        { vitals: "WBGT 31℃", situation: "再発を防ぐための対策は？", answer: 0,
          options: ["WBGTを測って作業時間・休憩を見直し、水分・塩分補給と暑さに慣らす期間を設ける", "我慢して作業を続けさせる", "倒れた人だけ休ませる", "対策は不要"],
          explanation: "作業環境管理（測定・日よけ）、作業管理（休憩・順化）、健康管理（体調確認）の3つで。" },
      ] },
  ],
};
