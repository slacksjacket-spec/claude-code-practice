// 血液ER（共通ゲーム scenario）。症例は架空。TODO(review) 発熱性好中球減少症の抗菌薬、輸血反応の対応、腫瘍崩壊症候群
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "fn", title: "発熱性好中球減少症", patient: "45歳 女性。乳癌の化学療法から10日目。",
      steps: [
        { vitals: "T 38.6  BP 112/70  HR 104  好中球 300/μL", situation: "寒気と発熱。どこにも痛みはない。", answer: 0,
          options: ["血液培養を2セットとり、すぐに緑膿菌もカバーする広域の抗菌薬", "熱の原因がわかるまで抗菌薬は待つ", "解熱薬だけで帰宅", "次の化学療法を予定どおり"],
          explanation: "好中球が少ないと症状が出にくく、急に悪くなる。培養のあと1時間以内を目標に、セフェピムなど抗緑膿菌作用のある薬。" },
        { vitals: "T 39.2  BP 84/50", situation: "3日たっても熱が続き、血圧が下がってきた。", answer: 0,
          options: ["MRSAや真菌も考えて抗菌薬を広げ、輸液と昇圧", "抗菌薬を中止", "様子を見る", "解熱薬を増やす"],
          explanation: "続く発熱や循環不全では、バンコマイシンや抗真菌薬を加える。" },
      ] },
    { ...M, id: "htr", title: "輸血中の急変", patient: "70歳 男性。赤血球輸血を始めて10分。",
      steps: [
        { vitals: "T 38.8  BP 80/48  HR 120", situation: "悪寒、腰の痛み、点滴の場所の痛み。尿が赤い。", answer: 0,
          options: ["すぐに輸血を止め、ルートは生理食塩水でつないで、バッグと患者の血液型を確認", "速度を落として続ける", "解熱薬を飲ませて続ける", "別のバッグに替えて続ける"],
          explanation: "ABO不適合輸血による急性溶血の疑い。まず中止。取り違え（患者確認）が最多の原因。" },
        { vitals: "尿量 10 mL/時", situation: "尿が少ない。DICの兆し。", answer: 0,
          options: ["十分な輸液で尿量を保ち、腎不全とDICを治療", "水分を制限する", "同じ血液をもう一度輸血", "経過観察"],
          explanation: "ヘモグロビンで腎臓が傷む。輸液と利尿で尿量を保つ。" },
      ] },
    { ...M, id: "tls", title: "腫瘍崩壊症候群", patient: "25歳 男性。Burkittリンパ腫。化学療法の初日。",
      steps: [
        { vitals: "K 6.5  P 9.0  Ca 6.8  尿酸 14  Cr 2.4", situation: "治療開始の翌日、尿が減ってきた。", answer: 0,
          options: ["大量の輸液、ラスブリカーゼで尿酸を下げ、高K血症を治療（必要なら透析）", "カルシウムをすぐ大量に静注", "輸液を絞る", "化学療法を倍にする"],
          explanation: "腫瘍細胞が一気に壊れ、K・P・尿酸が出て、Caが下がる。高K血症が最も危険。" },
        { vitals: "K 4.8  Cr 1.4", situation: "落ち着いた。次の化学療法で再び起こさないためには？", answer: 0,
          options: ["始める前から十分に輸液し、尿酸を下げる薬を使い、電解質を頻回にみる", "輸液を減らす", "尿酸の薬はやめる", "採血は週1回で十分"],
          explanation: "腫瘍量が多く増殖の速い腫瘍（Burkitt、急性白血病）はハイリスク。予防が大事。" },
      ] },
  ],
};
