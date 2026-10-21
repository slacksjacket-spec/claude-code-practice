// 眼科ER（共通ゲーム scenario）。症例は架空。TODO(review) 急性緑内障発作の治療、網膜中心動脈閉塞、化学外傷
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "chem", title: "アルカリの化学外傷", patient: "35歳 男性。工場でセメントの粉が目に入った。",
      steps: [
        { vitals: "強い痛み  開けられない", situation: "到着した。まずすることは？", answer: 0,
          options: ["ただちに大量の生理食塩水（または水道水）で洗い続ける", "視力検査をしてから洗う", "眼帯をして眼科の予約", "中和するために酸をさす"],
          explanation: "化学外傷は時間との勝負。洗眼が最優先。アルカリは酸より深く入り込み重症になる。" },
        { vitals: "30分洗眼", situation: "洗い終わったか確かめるには？", answer: 0,
          options: ["結膜のpHを測り、中性になるまで洗う", "痛みが消えたら終わり", "5分でやめる", "確かめなくてよい"],
          explanation: "pH試験紙で中性を確認。まぶたの裏の異物も取り除く。" },
      ] },
    { ...M, id: "aacg", title: "急性緑内障発作", patient: "70歳 女性。夜から右目の激痛と頭痛、嘔吐。",
      steps: [
        { vitals: "眼圧 58 mmHg  角膜混濁  瞳孔 中等度散大", situation: "急性閉塞隅角緑内障と診断。まずは？", answer: 0,
          options: ["高浸透圧薬の点滴、炭酸脱水酵素阻害薬、縮瞳薬で眼圧を下げる", "散瞳薬をさす", "鎮痛薬だけで帰宅", "頭部CTで経過を見る"],
          explanation: "薬で眼圧を下げ、角膜が澄んだらレーザー虹彩切開術。" },
        { vitals: "眼圧 18 mmHg", situation: "下がった。反対の目は？", answer: 0,
          options: ["同じく隅角が狭いので、予防的にレーザー虹彩切開術", "何もしない", "散瞳薬で検査し続ける", "白内障はないので放置"],
          explanation: "反対眼も発作を起こしやすい。水晶体再建術も選択肢。" },
      ] },
    { ...M, id: "crao", title: "網膜中心動脈閉塞症", patient: "72歳 男性。30分前に右目が突然見えなくなった。",
      steps: [
        { vitals: "光覚あり  痛みなし  cherry-red spot", situation: "眼科ではまず？", answer: 0,
          options: ["眼球マッサージや前房穿刺で眼圧を下げ、血流の回復を試みる", "翌日まで待つ", "抗菌薬の点眼", "眼帯をして帰宅"],
          explanation: "網膜は数時間で不可逆的になる。効果は限られるが急いで処置。" },
        { vitals: "視力の改善は乏しい", situation: "原因の検索は？", answer: 0,
          options: ["脳梗塞と同じように塞栓源（頸動脈・心臓）を調べ、巨細胞性動脈炎も考える", "目だけの病気なので検査不要", "眼鏡を作る", "白内障手術"],
          explanation: "眼の脳梗塞。頸動脈エコー、心電図、心エコー。高齢者では赤沈も。" },
      ] },
  ],
};
