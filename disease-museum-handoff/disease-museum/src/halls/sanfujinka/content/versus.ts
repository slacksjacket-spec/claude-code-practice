// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "previa-abruption", title: "前置胎盤 vs 常位胎盤早期剝離",
      a: { name: "前置胎盤", color: "pink", traits: ["痛くない出血", "警告出血", "内診禁止"] },
      b: { name: "常位胎盤早期剝離", color: "tomato", traits: ["激しい腹痛", "板のように硬い子宮", "DIC"] },
      clues: [
        { text: "妊娠後期に、痛みのない鮮やかな出血", side: "a" },
        { text: "突然の腹痛と、外の出血のわりにショック", side: "b" },
        { text: "妊娠高血圧症候群が危険因子", side: "b" },
        { text: "内診は大出血を招くので禁止", side: "a" },
        { text: "CTGで遅発一過性徐脈、細変動の減少", side: "b" },
        { text: "経腟エコーで胎盤が子宮口をおおう", side: "a" },
      ] },
    { ...M, id: "hdp-hellp", title: "子癇 vs HELLP症候群",
      a: { name: "子癇", color: "cobalt", traits: ["けいれん", "マグネシウム", "頭痛"] },
      b: { name: "HELLP症候群", color: "sun", traits: ["溶血", "肝酵素上昇", "血小板減少"] },
      clues: [
        { text: "妊娠高血圧症候群の妊婦が突然全身けいれん", side: "a" },
        { text: "みぞおちや右上腹部の痛み", side: "b" },
        { text: "LDH高値、AST上昇、血小板 7万", side: "b" },
        { text: "硫酸マグネシウムで予防と治療", side: "a" },
        { text: "前ぶれに強い頭痛や目のチカチカ", side: "a" },
        { text: "破砕赤血球を伴う溶血", side: "b" },
      ] },
  ],
};
