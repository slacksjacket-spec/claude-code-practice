// 産婦人科ER（共通ゲーム scenario）。症例は架空。TODO(review) 弛緩出血の対応、子癇の治療、異所性妊娠破裂の対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "pph", title: "弛緩出血", patient: "32歳 経産婦。4,000 gの児を経腟分娩。胎盤娩出後。",
      steps: [
        { vitals: "出血 1,200 mL  HR 118  BP 92/58", situation: "子宮がやわらかく、出血が止まらない。", answer: 0,
          options: ["子宮を両手でマッサージ（双手圧迫）し、子宮収縮薬（オキシトシン）", "様子を見る", "子宮収縮を抑える薬", "すぐに退院"],
          explanation: "分娩後異常出血の最多は子宮のゆるみ（弛緩出血）。マッサージと子宮収縮薬。" },
        { vitals: "出血 2,000 mL  SI 1.5", situation: "まだ止まらない。ショックインデックスが上昇。", answer: 0,
          options: ["人を集め、輸血（赤血球と新鮮凍結血漿）、子宮内バルーン、動脈塞栓や手術も準備", "収縮薬を同じ量で続けるだけ", "輸液だけで待つ", "鎮痛薬を増やす"],
          explanation: "産科危機的出血。SI 1.5以上は輸血を急ぐ。フィブリノゲンが下がりやすい。" },
      ] },
    { ...M, id: "eclampsia", title: "子癇", patient: "26歳 初産婦。34週。妊娠高血圧腎症で入院中。",
      steps: [
        { vitals: "BP 176/112  全身けいれん", situation: "突然けいれんした。", answer: 0,
          options: ["気道確保と酸素、硫酸マグネシウムを静注", "ジアゼパムだけ", "すぐに帝王切開を始める（けいれん中）", "利尿薬"],
          explanation: "けいれんの治療と再発予防は硫酸マグネシウム。母体を安定させてから娩出。" },
        { vitals: "BP 168/108  けいれん停止", situation: "落ち着いた。次は？", answer: 0,
          options: ["降圧（ニカルジピンなど）して、母体が安定したら娩出", "妊娠を続けて40週まで待つ", "マグネシウムを中止", "ACE阻害薬で降圧"],
          explanation: "根本治療は妊娠の終了。ACE阻害薬は妊娠中は禁忌。マグネシウム中毒（反射消失・呼吸抑制）にはカルシウム。" },
      ] },
    { ...M, id: "ectopic", title: "異所性妊娠の破裂", patient: "30歳 女性。最終月経から7週。",
      steps: [
        { vitals: "BP 80/50  HR 130  腹部全体の圧痛", situation: "急な下腹部痛で倒れた。妊娠反応陽性。エコーで腹腔内に大量の液体。", answer: 0,
          options: ["輸液・輸血をしながら緊急手術（腹腔鏡か開腹）", "メトトレキサートで経過を見る", "1週間後に再検", "鎮痛薬で帰宅"],
          explanation: "破裂してショックなら手術。メトトレキサートは状態が安定し、hCGが低く破裂していないときの選択肢。" },
        { vitals: "BP 112/70", situation: "術後。Rh陰性だった。", answer: 0,
          options: ["抗Dヒト免疫グロブリンを投与する", "何もしない", "次の妊娠は禁止", "ワクチンを打つ"],
          explanation: "流産や異所性妊娠でも、Rh陰性なら次の妊娠のために抗D免疫グロブリン。" },
      ] },
  ],
};
