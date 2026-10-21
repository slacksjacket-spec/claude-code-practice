// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "bppv-meniere", title: "BPPV vs メニエール病",
      a: { name: "良性発作性頭位めまい症", color: "sun", traits: ["頭を動かすと", "数十秒", "難聴なし"] },
      b: { name: "メニエール病", color: "cobalt", traits: ["数時間", "難聴・耳鳴り", "くり返す"] },
      clues: [
        { text: "寝返りや上を向いたときだけ", side: "a" },
        { text: "耳の詰まった感じと耳鳴りを伴う", side: "b" },
        { text: "1分以内におさまる", side: "a" },
        { text: "低い音から落ちる感音難聴", side: "b" },
        { text: "Epley法で治る", side: "a" },
        { text: "内リンパ水腫", side: "b" },
      ] },
    { ...M, id: "pta-epi", title: "扁桃周囲膿瘍 vs 急性喉頭蓋炎",
      a: { name: "扁桃周囲膿瘍", color: "pink", traits: ["口蓋垂の偏位", "開口障害", "含み声"] },
      b: { name: "急性喉頭蓋炎", color: "tomato", traits: ["のどは見た目きれい", "流涎", "気道閉塞"] },
      clues: [
        { text: "片側の軟口蓋が腫れ、口蓋垂が反対側へ押される", side: "a" },
        { text: "強いのどの痛みなのに、口の中を見ても大きな異常がない", side: "b" },
        { text: "口が開けにくい", side: "a" },
        { text: "首のX線側面像で喉頭蓋が親指のように腫れる", side: "b" },
        { text: "穿刺や切開で膿を出す", side: "a" },
        { text: "いつでも気道確保できる準備をして観察", side: "b" },
      ] },
  ],
};
