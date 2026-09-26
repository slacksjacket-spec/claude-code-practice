// 心不全の4分類（Nohria-Stevenson分類）。症例は架空。TODO(review) 治療の選び方（急性・慢性心不全診療ガイドライン）と照合
import type { HfProfileData } from "../exhibits/hfProfile.schema";

const M = { review: "draft" as const, sources: ["急性・慢性心不全診療ガイドライン"] };

export const hfProfileContent: HfProfileData = {
  quadrants: {
    A: { label: "warm & dry", sub: "うっ血も低灌流もない" },
    B: { label: "warm & wet", sub: "うっ血はあるが灌流はよい" },
    L: { label: "cold & dry", sub: "低灌流だがうっ血はない" },
    C: { label: "cold & wet", sub: "うっ血と低灌流の両方" },
  },
  treatments: [
    "内服薬（心不全の基本薬）の調整を続け、外来で経過をみる",
    "利尿薬と血管拡張薬でうっ血をとる",
    "強心薬で心拍出を支え（必要なら補助循環）、うっ血もとる",
    "輸液で前負荷を補う（様子をみながら慎重に）",
  ],
  stampAt: 4,
  cases: [
    { ...M, id: "b1", who: "72歳 女性", signs: ["起座呼吸", "両下腿の浮腫", "頸静脈怒張", "両肺に湿性ラ音", "手足は温かい", "血圧 168/92"], profile: "B", treatment: 1,
      explanation: "急性心不全で最も多い型。血圧が高ければ血管拡張薬、体液が多ければ利尿薬。" },
    { ...M, id: "c1", who: "66歳 男性", signs: ["起座呼吸", "頸静脈怒張", "手足が冷たい", "尿が少ない", "傾眠", "血圧 82/60"], profile: "C", treatment: 2,
      explanation: "うっ血に低灌流（低心拍出）が重なり、最も重い。強心薬で循環を支えながらうっ血をとる。反応がなければ補助循環。" },
    { ...M, id: "l1", who: "80歳 女性", signs: ["数日の嘔吐と下痢", "手足が冷たい", "頸静脈は虚脱", "肺音はきれい", "浮腫なし", "血圧 88/56"], profile: "L", treatment: 3,
      explanation: "うっ血がなく低灌流。脱水などで前負荷が足りない。慎重に輸液する（利尿薬は逆効果）。" },
    { ...M, id: "a1", who: "60歳 男性", signs: ["外来で定期受診", "息切れは坂道だけ", "浮腫なし", "肺音はきれい", "手足は温かい", "血圧 124/74"], profile: "A", treatment: 0,
      explanation: "代償されている状態。β遮断薬・ACE阻害薬（ARNI）・MRA・SGLT2阻害薬などの基本薬を続け、増悪を防ぐ。" },
    { ...M, id: "b2", who: "78歳 男性", signs: ["1週間で体重が3kg増えた", "夜間の息苦しさ", "下腿浮腫", "手足は温かい", "血圧 132/80"], profile: "B", treatment: 1,
      explanation: "体液量が増えて悪化した典型。利尿薬で体液を減らす。塩分・水分の管理と体重測定を指導。" },
    { ...M, id: "c2", who: "55歳 男性（広範前壁梗塞のあと）", signs: ["冷や汗", "手足が冷たく湿っている", "肺に湿性ラ音", "尿が出ない", "血圧 76/50"], profile: "C", treatment: 2,
      explanation: "心原性ショック。強心薬・昇圧薬で循環を支え、補助循環（IABP、Impellaなど）と原因の治療（再灌流）を急ぐ。" },
  ],
};
