// 呼吸器ER（共通ゲーム scenario）。症例は架空。TODO(review) 喘息予防・管理ガイドライン、COPDの酸素目標、気胸の対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "asthma", title: "喘息の大発作", patient: "24歳 女性。気管支喘息。",
      steps: [
        { vitals: "SpO₂ 88%  呼吸数 32  HR 124  話すと途切れる", situation: "息苦しくて横になれない。呼気の喘鳴が強い。", answer: 0,
          options: ["酸素投与と、短時間作用性β₂刺激薬の吸入をくり返す", "鎮静薬で落ち着かせる", "β遮断薬で頻脈を抑える", "まず胸部CTを撮りに行く"],
          explanation: "発作の第一歩は酸素と短時間作用性β₂刺激薬（SABA）の吸入。鎮静薬は呼吸を抑えるので禁忌。" },
        { vitals: "SpO₂ 90%  呼吸数 28", situation: "吸入を3回くり返したが、まだ苦しい。", answer: 0,
          options: ["全身性ステロイドを点滴する", "吸入ステロイドだけを続ける", "抗菌薬を始める", "帰宅させて明日受診"],
          explanation: "中発作以上や、吸入で改善しなければ全身性ステロイド。効き始めるまで数時間かかるので早めに。" },
        { vitals: "SpO₂ 85%  PaCO₂ 58  意識 もうろう", situation: "喘鳴が聞こえなくなってきた（silent chest）。", answer: 0,
          options: ["気管挿管と人工呼吸の準備をしてICUへ", "落ち着いたので一般病棟へ", "吸入を止める", "利尿薬を投与する"],
          explanation: "喘鳴が消えるのは空気が動かないサイン。PaCO₂の上昇と意識障害は呼吸停止の手前。" },
      ] },
    { ...M, id: "copd", title: "COPDの増悪", patient: "72歳 男性。COPD。",
      steps: [
        { vitals: "SpO₂ 80%  PaO₂ 45  PaCO₂ 66  pH 7.30", situation: "かぜのあと、痰が増えて息苦しい。", answer: 0,
          options: ["SpO₂ 88〜92%を目標に、少量から酸素を調整する", "リザーバーマスクで最大量の酸素", "酸素は使わない", "鎮静して休ませる"],
          explanation: "高濃度の酸素で呼吸の刺激がなくなり、CO₂が貯まる（CO₂ナルコーシス）。目標を決めて少量から。" },
        { vitals: "SpO₂ 90%  PaCO₂ 80  pH 7.22  意識 傾眠", situation: "酸素を始めたが、だんだん眠そうになってきた。", answer: 0,
          options: ["非侵襲的陽圧換気（NPPV）を始める", "酸素をさらに増やす", "睡眠薬で休ませる", "様子を見る"],
          explanation: "高CO₂血症とアシデミアが進めば、NPPVで換気を助ける。改善しなければ挿管。" },
        { vitals: "SpO₂ 91%  PaCO₂ 60  pH 7.33", situation: "NPPVで落ち着いた。増悪の薬物治療は？", answer: 0,
          options: ["短時間作用性気管支拡張薬・全身性ステロイド・（細菌感染があれば）抗菌薬", "β遮断薬", "利尿薬だけ", "抗凝固薬"],
          explanation: "増悪の治療はABC（Antibiotics、Bronchodilators、Corticosteroids）と覚える。" },
      ] },
    { ...M, id: "ptx", title: "自然気胸", patient: "20歳 男性。背が高くやせ型。",
      steps: [
        { vitals: "SpO₂ 97%  呼吸数 18  HR 88", situation: "急な右胸痛。X線で右肺がわずかに縮んでいる（肺尖が鎖骨より上）。", answer: 0,
          options: ["安静にして経過観察", "すぐに胸腔ドレナージ", "緊急手術", "人工呼吸"],
          explanation: "軽度の気胸で症状が軽ければ、安静と経過観察で自然に治ることが多い。" },
        { vitals: "SpO₂ 92%  呼吸数 26", situation: "翌日、息苦しさが増え、X線で肺が半分ほど縮んだ。", answer: 0,
          options: ["胸腔ドレナージ", "経過観察を続ける", "抗菌薬", "利尿薬"],
          explanation: "中等度以上はドレーンを入れて空気を抜く。" },
        { vitals: "SpO₂ 98%", situation: "治ったが、同じ側で3回目の再発。", answer: 0,
          options: ["胸腔鏡下でブラを切除する手術を考える", "もう治療はない", "毎年胸部CTだけ", "ステロイド内服"],
          explanation: "再発をくり返す気胸や、空気漏れが続くものは手術（ブラ切除）の適応。" },
      ] },
  ],
};
