// 免疫ER（共通ゲーム scenario）。症例は架空。TODO(review) アドレナリンの量と部位、強皮症腎クリーゼ、巨細胞性動脈炎の対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "anaphylaxis", title: "アナフィラキシー", patient: "30歳 女性。造影CTの直後。",
      steps: [
        { vitals: "BP 70/40  HR 130  SpO₂ 90%  喘鳴", situation: "全身にじんましんが出て、息苦しい。", answer: 0,
          options: ["アドレナリン0.5 mgを大腿の外側に筋注", "抗ヒスタミン薬だけを内服", "ステロイドの点滴だけ", "様子を見る"],
          explanation: "最初の一手はアドレナリン筋注（成人0.3〜0.5 mg）。抗ヒスタミン薬・ステロイドは補助。" },
        { vitals: "BP 78/46", situation: "5分たっても血圧が戻らない。", answer: 0,
          options: ["アドレナリンをくり返し、足を上げて大量に輸液", "アドレナリンは1回だけなので待つ", "利尿薬", "座らせる"],
          explanation: "効かなければ5〜15分ごとにくり返す。仰臥位で下肢挙上、細胞外液を急速に。" },
        { vitals: "BP 110/70", situation: "落ち着いた。帰宅させてよい？", answer: 0,
          options: ["数時間〜一晩は観察（遅れて再燃する二相性反応がある）", "すぐに帰宅", "明日また造影CT", "何も記録しない"],
          explanation: "二相性反応に備えて観察。アレルギーを記録し、必要ならアドレナリン自己注射薬を処方。" },
      ] },
    { ...M, id: "src", title: "強皮症腎クリーゼ", patient: "50歳 女性。全身性強皮症。",
      steps: [
        { vitals: "BP 210/120  Cr 2.8  破砕赤血球あり", situation: "頭痛と視力低下。", answer: 0,
          options: ["ACE阻害薬で血圧を下げる", "大量ステロイドを始める", "血漿交換だけ", "経過観察"],
          explanation: "強皮症腎クリーゼはACE阻害薬。大量のステロイドは引き金になる。" },
        { vitals: "BP 150/90", situation: "血圧は下がってきた。", answer: 0,
          options: ["ACE阻害薬を続け、腎機能が悪ければ透析も考える", "ACE阻害薬をやめる", "ステロイドを追加", "手術"],
          explanation: "ACE阻害薬で予後が大きく改善した。" },
      ] },
    { ...M, id: "gca", title: "巨細胞性動脈炎", patient: "78歳 女性。2週間前からこめかみが痛い。",
      steps: [
        { vitals: "赤沈 95 mm/時", situation: "今朝から右目がかすんで見えにくい。", answer: 0,
          options: ["生検を待たずに、すぐに高用量ステロイド", "生検の結果が出るまで待つ", "眼鏡を作り直す", "鎮痛薬だけ"],
          explanation: "失明は戻らない。疑えばすぐステロイド。生検は治療後でも数日は所見が残る。" },
        { vitals: "視力 改善", situation: "治療が始まった。長くステロイドを使う。", answer: 0,
          options: ["骨粗鬆症の予防（ビスホスホネートなど）も始める", "すぐに中止する", "ステロイドを毎日変える", "何もしなくてよい"],
          explanation: "長期のステロイドでは骨粗鬆症、感染、糖尿病に注意。" },
      ] },
  ],
};
