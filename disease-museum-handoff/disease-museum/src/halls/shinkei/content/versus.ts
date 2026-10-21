// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "migraine-cluster", title: "片頭痛 vs 群発頭痛",
      a: { name: "片頭痛", color: "pink", traits: ["女性", "拍動性", "寝込む"] },
      b: { name: "群発頭痛", color: "cobalt", traits: ["若い男性", "目の奥", "じっとしていられない"] },
      clues: [
        { text: "閃輝暗点が先に出ることがある", side: "a" },
        { text: "片目の奥がえぐられるように痛む", side: "b" },
        { text: "流涙・鼻水・眼瞼下垂を伴う", side: "b" },
        { text: "光や音がつらく、暗い部屋で横になる", side: "a" },
        { text: "100%酸素の吸入が効く", side: "b" },
        { text: "トリプタン、予防にCGRP関連抗体", side: "a" },
      ] },
    { ...M, id: "parkinson-psp", title: "Parkinson病 vs 進行性核上性麻痺",
      a: { name: "Parkinson病", color: "sun", traits: ["安静時振戦", "左右差", "L-ドパが効く"] },
      b: { name: "進行性核上性麻痺", color: "mint", traits: ["垂直方向の眼球運動障害", "早期の転倒", "体幹の固縮"] },
      clues: [
        { text: "片手の丸薬丸め様の安静時振戦から始まる", side: "a" },
        { text: "下を見ることができない", side: "b" },
        { text: "発症1年以内から後ろに転ぶ", side: "b" },
        { text: "MIBG心筋シンチで取り込み低下", side: "a" },
        { text: "MRIで中脳被蓋の萎縮（ハチドリ徴候）", side: "b" },
        { text: "L-ドパがよく効く", side: "a" },
      ] },
  ],
};
