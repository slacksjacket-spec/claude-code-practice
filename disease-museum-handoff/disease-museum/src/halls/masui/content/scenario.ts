// 麻酔ER（共通ゲーム scenario）。症例は架空。TODO(review) 悪性高熱症のダントロレン、局所麻酔薬中毒の脂肪乳剤、CICOの対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "mh", title: "悪性高熱症", patient: "20歳 男性。全身麻酔（セボフルラン）で骨折の手術中。",
      steps: [
        { vitals: "EtCO₂ 75（上昇中）  HR 140  T 39.0（1時間で2℃上昇）  筋強剛", situation: "換気を増やしてもEtCO₂が下がらない。", answer: 0,
          options: ["揮発性麻酔薬を止め、100%酸素で過換気、ダントロレンを静注、人を呼ぶ", "セボフルランを増やす", "解熱薬を飲ませる", "手術を続ける"],
          explanation: "引き金を止めてダントロレン。静脈麻酔に切り替え、手術はできるだけ早く終える。" },
        { vitals: "K 6.8  尿が赤褐色", situation: "次に注意することは？", answer: 0,
          options: ["高K血症の治療、冷却、輸液で尿量を保つ（横紋筋融解）", "K製剤を入れる", "輸液を絞る", "経過観察"],
          explanation: "筋肉が壊れて高K血症と腎障害。家族にも遺伝の可能性を伝える。" },
      ] },
    { ...M, id: "last", title: "局所麻酔薬中毒", patient: "60歳 女性。大量の局所麻酔薬で神経ブロックをした直後。",
      steps: [
        { vitals: "口のまわりのしびれ、耳鳴り、そのあと全身けいれん", situation: "どうする？", answer: 0,
          options: ["注入を止め、気道確保と酸素、けいれんにはベンゾジアゼピン、20%脂肪乳剤を準備", "局所麻酔薬を追加", "様子を見る", "手術を始める"],
          explanation: "中毒は中枢神経の症状（しびれ・耳鳴り・けいれん）から心血管の症状（不整脈・心停止）へ進む。" },
        { vitals: "心室性不整脈、血圧低下", situation: "悪化した。", answer: 0,
          options: ["20%脂肪乳剤を静注し、蘇生を続ける", "リドカインで不整脈を治療", "β遮断薬", "何もしない"],
          explanation: "脂肪乳剤が局所麻酔薬を取り込む（lipid sink）。蘇生は長めに続ける。" },
      ] },
    { ...M, id: "cico", title: "挿管も換気もできない", patient: "45歳 男性。全身麻酔の導入直後。",
      steps: [
        { vitals: "SpO₂ 88%（低下中）", situation: "挿管できず、マスク換気も難しい。", answer: 0,
          options: ["助けを呼び、声門上器具（ラリンジアルマスク）を入れて換気を試みる", "挿管を何度もくり返す", "筋弛緩薬を追加して待つ", "諦める"],
          explanation: "挿管の試行は回数を決め、早めに声門上器具へ。" },
        { vitals: "SpO₂ 70%  声門上器具でも換気できない", situation: "挿管も換気もできない（CICO）。", answer: 0,
          options: ["すぐに輪状甲状膜を切開して気道を確保", "もう一度喉頭鏡で見る", "様子を見る", "手術を始める"],
          explanation: "CICOでは外科的気道確保（輪状甲状膜切開）をためらわない。" },
      ] },
  ],
};
