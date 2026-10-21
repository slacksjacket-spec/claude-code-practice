// 感染症ER（共通ゲーム scenario）。症例は架空。TODO(review) 敗血症の初期対応（輸液量、目標MAP、時間）、針刺し後の予防内服、マラリアの対応
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "sepsis", title: "敗血症性ショック", patient: "70歳 女性。腎盂腎炎で来院。",
      steps: [
        { vitals: "BP 78/42  HR 124  RR 26  T 39.4  乳酸 4.8", situation: "意識がぼんやり。まずは？", answer: 0,
          options: ["血液培養を2セットとり、1時間以内に広域抗菌薬、晶質液を急速に", "抗菌薬は培養結果を待ってから", "解熱薬で熱を下げる", "CTを撮ってから考える"],
          explanation: "敗血症は時間との勝負。培養をとってすぐ抗菌薬、30 mL/kgを目安に輸液。" },
        { vitals: "BP 80/44  輸液 2 L後", situation: "輸液しても血圧が上がらない。", answer: 0,
          options: ["ノルアドレナリンで平均動脈圧65 mmHg以上を目指す", "さらに輸液だけを5 L", "ドパミンを第一選択に", "様子を見る"],
          explanation: "第一選択の昇圧薬はノルアドレナリン。足りなければバソプレシンを加える。" },
        { vitals: "BP 104/60  エコーで右水腎症", situation: "落ち着いてきた。感染源は？", answer: 0,
          options: ["閉塞があるので尿路のドレナージ（感染源のコントロール）", "抗菌薬だけで十分", "経過観察", "結石を今すぐ砕く"],
          explanation: "感染源のコントロールは抗菌薬と同じくらい大事。" },
      ] },
    { ...M, id: "needle", title: "針刺し事故", patient: "研修医。HIV陽性の患者の採血のあと、使った針を自分の指に刺した。",
      steps: [
        { vitals: "受傷直後", situation: "まずすることは？", answer: 0,
          options: ["すぐに流水と石けんで洗い、上司と感染対策の担当へ報告", "傷口を口で吸う", "何もせずに仕事を続ける", "消毒だけして黙っておく"],
          explanation: "流水でよく洗う。すぐに報告して手順に沿って対応。" },
        { vitals: "受傷から1時間", situation: "患者はHIV陽性でウイルスが検出されている。", answer: 0,
          options: ["できるだけ早く（理想は2時間以内）抗HIV薬の予防内服を始め、4週間続ける", "1週間たってから考える", "予防内服はない", "HBワクチンだけ打つ"],
          explanation: "曝露後予防はできるだけ早く。本人のHIV・HBV・HCVの抗体を調べて経過を追う。" },
      ] },
    { ...M, id: "malaria", title: "重症マラリア", patient: "40歳 男性。ナイジェリアから帰国して1週間。",
      steps: [
        { vitals: "T 40.1  意識障害  血糖 50  血小板 2万", situation: "けいれんして搬送された。", answer: 0,
          options: ["ブドウ糖を投与し、すぐ血液塗抹で寄生率を見る", "インフルエンザとして帰宅", "解熱薬のみ", "髄液検査だけ"],
          explanation: "流行地からの帰国後の意識障害は脳マラリアを考える。低血糖も多い。" },
        { vitals: "寄生率 12%", situation: "熱帯熱マラリア。治療は？", answer: 0,
          options: ["注射薬（アルテスネート）をすぐに始めICUで管理", "内服薬で外来治療", "抗菌薬", "様子を見る"],
          explanation: "重症熱帯熱マラリアは静注アルテスネート。" },
      ] },
  ],
};
