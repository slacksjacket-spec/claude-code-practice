// 耳鼻咽喉ER（共通ゲーム scenario）。症例は架空。TODO(review) 鼻出血の対応、急性喉頭蓋炎の気道管理、異物
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "epistaxis", title: "鼻出血", patient: "70歳 男性。高血圧。抗凝固薬を内服中。",
      steps: [
        { vitals: "BP 170/96  HR 92", situation: "30分前から右の鼻血が止まらない。", answer: 0,
          options: ["座って少し前かがみにし、鼻翼を指でしっかり10分以上つまむ", "上を向いて首の後ろをたたく", "あおむけに寝かせる", "鼻にティッシュを詰めて帰宅"],
          explanation: "鼻出血の多くは前方のKiesselbach部位。前かがみ（血を飲み込まない）で圧迫。" },
        { vitals: "まだ止まらない  後ろからのどに流れ込む", situation: "前からの圧迫で止まらない。", answer: 0,
          options: ["出血点を探して焼灼、だめならガーゼやバルーンで後鼻孔まで詰める", "様子を見る", "抗凝固薬を倍にする", "うがいをさせる"],
          explanation: "後方からの出血（蝶口蓋動脈）はタンポンや手術・塞栓が必要なことも。" },
      ] },
    { ...M, id: "epiglottitis", title: "急性喉頭蓋炎", patient: "45歳 男性。半日で悪化するのどの激痛。",
      steps: [
        { vitals: "T 39.0  SpO₂ 95%  吸気性喘鳴  よだれ", situation: "飲み込めず、前かがみに座っている。", answer: 0,
          options: ["座ったまま楽な姿勢で、気道確保（挿管・外科的気道）の準備をして喉頭ファイバーで確認", "あおむけに寝かせて舌圧子でのどを見る", "解熱薬で帰宅", "鎮静して様子を見る"],
          explanation: "仰臥位や舌圧子は気道閉塞を招く。挿管困難を想定して準備。" },
        { vitals: "喉頭蓋が高度に腫れている", situation: "治療は？", answer: 0,
          options: ["気道を確保しながら、抗菌薬（セフトリアキソンなど）とステロイド", "抗ウイルス薬だけ", "うがい薬だけ", "抗菌薬の内服で帰宅"],
          explanation: "原因はインフルエンザ菌など。入院して気道を監視。" },
      ] },
    { ...M, id: "fb", title: "魚の骨", patient: "40歳 女性。鯛を食べたあとからのどがチクチク。",
      steps: [
        { vitals: "発熱なし", situation: "飲み込むと左ののどが痛い。", answer: 0,
          options: ["口の中と扁桃を見て、なければ喉頭ファイバーで探して摘出", "ご飯を丸のみさせる", "様子を見る", "吐かせる"],
          explanation: "口蓋扁桃や舌根に刺さることが多い。ご飯の丸のみは深く刺さるので勧めない。" },
        { vitals: "見つからない  首の痛みと発熱が出てきた", situation: "翌日。", answer: 0,
          options: ["CTで食道や頸部の異物・膿瘍を探す", "抗菌薬だけで帰宅", "もう一度ご飯を飲み込む", "何もしない"],
          explanation: "食道に刺さると縦隔炎や深頸部膿瘍の危険。" },
      ] },
  ],
};
