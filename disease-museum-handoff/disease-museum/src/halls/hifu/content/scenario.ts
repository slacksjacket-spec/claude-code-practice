// 皮膚ER（共通ゲーム scenario）。症例は架空。TODO(review) SJS/TENの対応、壊死性筋膜炎、熱傷の初期輸液（Parkland）
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "sjs", title: "Stevens-Johnson症候群", patient: "35歳 女性。かぜで市販薬を飲んで5日目。",
      steps: [
        { vitals: "T 39.0  目の充血  唇のただれ", situation: "体に赤い斑点が広がり、一部に水疱。", answer: 0,
          options: ["疑わしい薬をすべて中止し、入院させて眼科にも診てもらう", "抗ヒスタミン薬で帰宅", "同じ薬を続ける", "日光浴をすすめる"],
          explanation: "重症薬疹。原因薬の中止がいちばん大事。眼の後遺症を防ぐため眼科と連携。" },
        { vitals: "表皮剝離が広がる", situation: "皮膚がはがれる範囲が増えてきた。", answer: 0,
          options: ["ステロイドなどの全身治療と、熱傷に準じた皮膚・輸液・感染の管理", "様子を見る", "原因薬を再開", "外用だけ"],
          explanation: "10%未満がSJS、30%以上がTEN。免疫グロブリンや血漿交換も選択肢。" },
      ] },
    { ...M, id: "nf", title: "壊死性筋膜炎", patient: "60歳 男性。糖尿病。足をすりむいた2日後。",
      steps: [
        { vitals: "T 39.4  BP 88/50  HR 128", situation: "足が赤く腫れ、見た目よりずっと強く痛がる。紫色の水疱と、触るとプチプチした感じ。", answer: 0,
          options: ["広域抗菌薬を始め、すぐに外科で切開・デブリードマン", "蜂窩織炎として内服抗菌薬で帰宅", "冷やして様子を見る", "MRIを予約して1週間後"],
          explanation: "見た目に合わない強い痛み、水疱、握雪感、ショックは壊死性筋膜炎。手術が遅れると命にかかわる。" },
        { vitals: "術後", situation: "A群溶連菌が検出された。", answer: 0,
          options: ["ペニシリンにクリンダマイシンを加える（毒素産生を抑える）", "抗菌薬を中止", "バンコマイシン単剤", "抗真菌薬"],
          explanation: "クリンダマイシンは毒素の産生を抑える。何度もデブリードマンが必要なことが多い。" },
      ] },
    { ...M, id: "burn", title: "広範囲熱傷", patient: "40歳 男性、体重60 kg。火事で受傷。",
      steps: [
        { vitals: "顔のやけど、鼻毛が焦げ、煤まじりの痰、声がかすれる", situation: "まず確認すべきは？", answer: 0,
          options: ["気道熱傷を疑い、早めに気管挿管を考える", "やけどの面積を正確に測ってから考える", "冷たい水に全身をつける", "鎮痛薬だけ"],
          explanation: "上気道のむくみは時間とともに進む。早めに気道を確保。" },
        { vitals: "II〜III度 40%", situation: "最初の24時間の輸液量の目安は？（Parkland）", answer: 0,
          options: ["4 mL × 60 kg × 40 ＝ 9,600 mL、半分を最初の8時間で", "1,000 mLで十分", "4 mL × 60 kg ＝ 240 mL", "輸液しない"],
          explanation: "Parkland法：4 mL × 体重 × 熱傷面積（%）。最初の8時間に半分。尿量（0.5 mL/kg/時）を見て調整。" },
      ] },
  ],
};
