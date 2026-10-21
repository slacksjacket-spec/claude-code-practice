// ほくろのABCDE（ホール専用 mole）。絵は模式。TODO(review) ABCDEの基準（D 6 mm）と各症例の対応
import type { MoleData } from "../exhibits/mole.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const ACT = ["経過観察でよい", "病変全体を切除して病理で確認", "凍結療法で焼く", "ステロイドを塗る"];

export const moleContent: MoleData = {
  stampAt: 4,
  cases: [
    { ...M, id: "nevus", story: "25歳 女性。腕のほくろ。昔から変わらない。", lesion: { asym: false, border: false, colors: 1, size: 4, evolving: false },
      question: "対応は？", options: ACT, answer: 0, explanation: "左右対称、境界くっきり、色は均一、小さく、変化なし。色素細胞母斑。" },
    { ...M, id: "mm", story: "55歳 男性。背中のしみが、この1年で大きくなり形が変わった。", lesion: { asym: true, border: true, colors: 3, size: 10, evolving: true },
      question: "対応は？", options: ACT, answer: 1, explanation: "ABCDEすべて陽性。メラノーマを疑う。部分生検ではなく全体を切除して病理（全切除生検）。凍結療法は病理が取れないので不可。" },
    { ...M, id: "alm", story: "72歳 女性。足の裏の黒いしみが、にじむように広がってきた。", lesion: { asym: true, border: true, colors: 2, size: 8, evolving: true },
      question: "考えるのは？", options: ["末端黒子型黒色腫", "足底のほくろ", "脂漏性角化症", "血豆"], answer: 0,
      explanation: "日本人のメラノーマは足の裏や爪に多い（末端黒子型）。ダーモスコピーで皮丘に沿った色素は要注意。" },
    { ...M, id: "sk", story: "80歳 男性。背中に、貼りつけたような、ざらざらした盛り上がり。昔からある。", lesion: { asym: false, border: false, colors: 1, size: 10, evolving: false },
      question: "考えるのは？", options: ["脂漏性角化症（老人性いぼ）", "メラノーマ", "基底細胞癌", "日光角化症"], answer: 0,
      explanation: "大きさ（D）だけでは悪性とは限らない。脂漏性角化症は高齢者にありふれた良性腫瘍。急に多発すればLeser-Trélat徴候。" },
    { ...M, id: "change", story: "40歳 女性。腕のほくろが、この3か月で大きくなり出血した。", lesion: { asym: false, border: false, colors: 1, size: 5, evolving: true },
      question: "対応は？", options: ACT, answer: 1, explanation: "形がふつうでも、変化（E）や出血は要注意。切除して確認する。" },
    { ...M, id: "bcc", story: "75歳 女性。鼻の横の黒い結節。ゆっくり大きくなり、中央がくぼんできた。", lesion: { asym: false, border: false, colors: 2, size: 7, evolving: true },
      question: "考えるのは？", options: ["基底細胞癌", "メラノーマ", "脂漏性角化症", "色素細胞母斑"], answer: 0,
      explanation: "顔の中心部に多い、日本人で最多の皮膚癌。黒く、縁が真珠のように光る。転移はまれで、切除で治る。" },
  ],
};
