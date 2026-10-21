// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "hps-intus", title: "肥厚性幽門狭窄症 vs 腸重積症",
      a: { name: "肥厚性幽門狭窄症", color: "sun", traits: ["生後2〜8週", "噴水状嘔吐", "オリーブ様腫瘤"] },
      b: { name: "腸重積症", color: "pink", traits: ["6か月〜2歳", "いちごゼリー状便", "間欠的な啼泣"] },
      clues: [
        { text: "胆汁を含まない噴水のような嘔吐", side: "a" },
        { text: "急に泣いては静かになるをくり返す", side: "b" },
        { text: "低Cl性代謝性アルカローシス", side: "a" },
        { text: "エコーで標的のような像（target sign）", side: "b" },
        { text: "治療は粘膜外幽門筋切開術", side: "a" },
        { text: "高圧浣腸で戻す", side: "b" },
      ] },
    { ...M, id: "croup-epiglottitis", title: "クループ vs 急性喉頭蓋炎",
      a: { name: "クループ", color: "mint", traits: ["犬吠様咳嗽", "ウイルス", "steeple sign"] },
      b: { name: "急性喉頭蓋炎", color: "tomato", traits: ["流涎", "細菌", "thumb sign"] },
      clues: [
        { text: "オットセイが鳴くような咳", side: "a" },
        { text: "よだれを垂らし、前かがみに座る", side: "b" },
        { text: "パラインフルエンザウイルス", side: "a" },
        { text: "診察でのどを無理に見てはいけない", side: "b" },
        { text: "アドレナリン吸入とデキサメタゾン", side: "a" },
        { text: "Hibワクチンで激減した", side: "b" },
      ] },
  ],
};
