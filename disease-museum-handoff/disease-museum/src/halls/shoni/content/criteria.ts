// 診断基準チェック（共通ゲーム criteria）。TODO(review) 川崎病診断の手引き（改訂第6版）の主要症状と判定、熱性けいれんの複雑型の要素
import type { CriteriaData } from "../../../engine/games/criteria.schema";

const M = { review: "draft" as const, sources: ["川崎病診断の手引き 改訂第6版（日本川崎病学会）https://jskd.umin.jp/info/pdf/tebiki201906.pdf", "熱性けいれん（熱性発作）診療ガイドライン2023（複雑型の定義は二次資料で確認）"] };

export const criteriaContent: CriteriaData = {
  stampAt: 3,
  cases: [
    { ...M, id: "kd-full", who: "3歳 男児", criteria: "川崎病の主要症状",
      items: [
        { text: "発熱（5日目）", counts: true },
        { text: "両目の結膜が赤い（目やにはない）", counts: true },
        { text: "唇が赤く、いちご舌", counts: true },
        { text: "体にいろいろな形の発疹", counts: true },
        { text: "手足が硬くむくむ", counts: true },
        { text: "咳と鼻水", counts: false },
        { text: "AST・ALTの上昇", counts: false },
      ],
      question: "判断は？", options: ["川崎病（主要症状5つ以上）", "不全型川崎病として心エコーを急ぐ", "川崎病ではない"], answer: 0,
      explanation: "主要症状は6つ（発熱、両側眼球結膜充血、口唇・口腔所見、発疹、四肢末端の変化、非化膿性頸部リンパ節腫脹）。BCG接種痕の発赤は「発疹」に含めて数える（診断の手引き 改訂第6版）。肝機能異常などは参考条項。" },
    { ...M, id: "kd-incomplete", who: "8か月 女児", criteria: "川崎病の主要症状",
      items: [
        { text: "発熱（6日目）", counts: true },
        { text: "両目の結膜が赤い", counts: true },
        { text: "唇が赤い", counts: true },
        { text: "BCG接種部位が赤く腫れる", counts: true },
        { text: "下痢", counts: false },
        { text: "CRP 12 mg/dL", counts: false },
      ],
      question: "判断は？", options: ["主要症状は足りないが、不全型川崎病として心エコーで冠動脈を見る", "川崎病は否定できる", "抗菌薬で様子を見る"], answer: 0,
      explanation: "発熱・結膜充血・口唇の発赤に、BCG接種痕の発赤（主要症状の「発疹」に含める）で4つ。5つに届かないが、乳児は症状がそろいにくく冠動脈瘤ができやすいので、不全型を考えて心エコーを急ぐ。" },
    { ...M, id: "fs-complex", who: "1歳6か月 男児", criteria: "複雑型熱性けいれんの要素",
      items: [
        { text: "38.8℃の発熱", counts: false },
        { text: "けいれんは20分続いた", counts: true },
        { text: "左手足だけがけいれんした", counts: true },
        { text: "けいれん後すぐに泣いた", counts: false },
        { text: "家族にも熱性けいれんがある", counts: false },
      ],
      question: "分類は？", options: ["複雑型熱性けいれん", "単純型熱性けいれん", "てんかんと確定"], answer: 0,
      explanation: "焦点性の発作、15分以上続く、24時間以内にくり返す、のどれか1つで複雑型。" },
    { ...M, id: "fs-repeat", who: "2歳 女児", criteria: "複雑型熱性けいれんの要素",
      items: [
        { text: "39℃の発熱", counts: false },
        { text: "全身のけいれんが2分", counts: false },
        { text: "同じ日の夜にもう一度けいれん", counts: true },
        { text: "6か月〜5歳", counts: false },
      ],
      question: "分類は？", options: ["複雑型熱性けいれん", "単純型熱性けいれん", "憤怒けいれん"], answer: 0,
      explanation: "24時間以内の反復があるので複雑型。単純型は予後良好。" },
  ],
};
