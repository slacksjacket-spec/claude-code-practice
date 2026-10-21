// VS対決。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const versusContent: ExhibitOf<"VersusQuiz">["data"] = {
  passScore: 5,
  matches: [
    { ...M, id: "bph-ca", title: "前立腺肥大症 vs 前立腺癌",
      a: { name: "前立腺肥大症", color: "sun", traits: ["移行域", "排尿症状", "良性"] },
      b: { name: "前立腺癌", color: "tomato", traits: ["辺縁域", "PSA高値", "骨転移"] },
      clues: [
        { text: "移行域から大きくなる", side: "a" },
        { text: "辺縁域にできやすく、直腸診で硬い結節", side: "b" },
        { text: "造骨性の骨転移", side: "b" },
        { text: "α₁遮断薬や5α還元酵素阻害薬で治療", side: "a" },
        { text: "Gleasonスコアで悪性度を評価", side: "b" },
        { text: "残尿が増えて尿閉になることがある", side: "a" },
      ] },
    { ...M, id: "pyelo-cystitis", title: "腎盂腎炎 vs 膀胱炎",
      a: { name: "急性腎盂腎炎", color: "pink", traits: ["高熱", "肋骨脊柱角の叩打痛", "白血球円柱"] },
      b: { name: "急性膀胱炎", color: "mint", traits: ["発熱なし", "頻尿・排尿痛", "若い女性"] },
      clues: [
        { text: "38℃以上の発熱と悪寒", side: "a" },
        { text: "排尿の終わりの痛みと残尿感、熱はない", side: "b" },
        { text: "肋骨脊柱角（CVA）の叩打痛", side: "a" },
        { text: "尿沈渣で白血球円柱", side: "a" },
        { text: "短期間の抗菌薬内服で治る", side: "b" },
        { text: "閉塞があれば緊急でドレナージ", side: "a" },
      ] },
  ],
};
