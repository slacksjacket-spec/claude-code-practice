// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "tension-tamponade", title: "緊張性気胸 vs 心タンポナーデ",
      a: { name: "緊張性気胸", color: "cobalt", traits: ["呼吸音消失", "気管偏位", "脱気"] },
      b: { name: "心タンポナーデ", color: "tomato", traits: ["心音減弱", "奇脈", "心嚢穿刺"] },
      clues: [
        { text: "片側の呼吸音が聞こえない", side: "a" },
        { text: "心音が遠く、低血圧と頸静脈怒張（Beckの三徴）", side: "b" },
        { text: "打診で鼓音", side: "a" },
        { text: "吸気で収縮期血圧が10 mmHg以上下がる", side: "b" },
        { text: "第2肋間鎖骨中線に針を刺す", side: "a" },
        { text: "心電図で電気的交互脈", side: "b" },
      ] },
    { ...M, id: "co-heat", title: "一酸化炭素中毒 vs 熱中症",
      a: { name: "一酸化炭素中毒", color: "pink", traits: ["火事・練炭", "頭痛", "SpO₂は正常に見える"] },
      b: { name: "熱中症", color: "sun", traits: ["暑い環境", "高体温", "冷却"] },
      clues: [
        { text: "冬に閉め切った部屋でストーブ", side: "a" },
        { text: "真夏の屋外作業", side: "b" },
        { text: "パルスオキシメータでは正常なのに低酸素", side: "a" },
        { text: "深部体温 41℃、意識障害", side: "b" },
        { text: "治療は100%酸素", side: "a" },
        { text: "水をかけて扇ぐなど、すぐ冷やす", side: "b" },
      ] },
  ],
};
