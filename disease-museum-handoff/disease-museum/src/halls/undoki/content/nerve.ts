// 末梢神経麻痺の場所（共通ゲーム tapMap）。図は模式。TODO(review)
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const svg = `<rect width="340" height="260" fill="#FFF8F0"/>
  <path d="M40 30 C40 20 70 20 70 30 L66 120 L80 200 L70 236 L52 236 L48 200 L44 120Z" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <circle cx="55" cy="30" r="14" fill="#E8D0B0" stroke="#1C1537" stroke-width="2"/>
  <text x="55" y="254" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">右腕（前から）</text>
  <path d="M230 20 L262 20 L260 140 L264 230 L246 246 L236 230 L234 140Z" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <circle cx="232" cy="150" r="7" fill="#E8D0B0" stroke="#1C1537" stroke-width="2"/>
  <text x="246" y="254" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">右脚（外側から）</text>
  <text x="96" y="40" font-size="10" fill="#7A5A50" font-weight="800">肩</text><text x="96" y="124" font-size="10" fill="#7A5A50" font-weight="800">肘</text><text x="96" y="204" font-size="10" fill="#7A5A50" font-weight="800">手首</text>
  <text x="190" y="154" font-size="10" fill="#7A5A50" font-weight="800">腓骨頭</text>`;

export const nerveContent: TapMapData = {
  question: "どこで神経が傷んだ？",
  stampAt: 4,
  figures: {
    limbs: { viewBox: "0 0 340 260", ariaLabel: "右腕と右脚の模式図", svg,
      regions: [
        { id: "axillary", label: "肩（上腕骨外科頸・腋窩神経）", shape: `<circle cx="55" cy="44" r="13"/>` },
        { id: "spiral", label: "上腕の中ほど（橈骨神経溝）", shape: `<rect x="40" y="62" width="30" height="34" rx="8"/>` },
        { id: "elbow", label: "肘の内側（肘部管・尺骨神経）", shape: `<circle cx="72" cy="122" r="10"/>` },
        { id: "elbowFront", label: "肘の前（正中神経）", shape: `<circle cx="48" cy="122" r="10"/>` },
        { id: "carpal", label: "手首（手根管・正中神経）", shape: `<rect x="48" y="196" width="32" height="16" rx="6"/>` },
        { id: "fibular", label: "膝の外側（腓骨頭・総腓骨神経）", shape: `<circle cx="232" cy="150" r="13"/>` },
      ] },
  },
  cases: [
    { ...M, id: "radial", figure: "limbs", prompt: "上腕骨の骨幹部を骨折した。手首と指が反らせない（下垂手）。手の甲の親指側がしびれる。", answer: ["spiral"],
      followUp: { question: "この麻痺の名前は？", options: ["橈骨神経麻痺（下垂手）", "正中神経麻痺（猿手）", "尺骨神経麻痺（鷲手）", "腋窩神経麻痺"], answer: 0 },
      explanation: "橈骨神経は上腕骨の後ろの溝を回る。腕枕で寝たあと（Saturday night palsy）にも。" },
    { ...M, id: "cts", figure: "limbs", prompt: "50歳 女性。親指から薬指の親指側がしびれ、夜中や明け方に強い。手首を曲げ続けると悪化。", answer: ["carpal"],
      followUp: { question: "陽性になる検査は？", options: ["Phalenテスト・Tinel徴候", "Froment徴候", "Spurlingテスト", "Lasègue徴候"], answer: 0 },
      explanation: "手根管症候群。妊娠、透析（アミロイド）、甲状腺機能低下症、関節リウマチが背景に。進むと母指球がやせる（猿手）。" },
    { ...M, id: "cubital", figure: "limbs", prompt: "肘を曲げる仕事。小指と薬指の小指側がしびれ、紙を親指と人差し指でつまむと親指が曲がる。", answer: ["elbow"],
      followUp: { question: "紙つまみで親指が曲がる所見の名前は？", options: ["Froment徴候", "Phalenテスト", "Tinel徴候", "Trendelenburg徴候"], answer: 0 },
      explanation: "肘部管症候群（尺骨神経）。母指内転筋が弱く、長母指屈筋で代償する。進むと鷲手。" },
    { ...M, id: "axillary", figure: "limbs", prompt: "肩関節を脱臼した。肩の外側がしびれ、腕を横に上げにくい。", answer: ["axillary"],
      followUp: { question: "弱くなる筋肉は？", options: ["三角筋", "上腕二頭筋", "前脛骨筋", "母指対立筋"], answer: 0 },
      explanation: "腋窩神経は上腕骨の外科頸を回る。肩関節前方脱臼や外科頸骨折で傷む。" },
    { ...M, id: "fibular", figure: "limbs", prompt: "下腿にギプスを巻いた翌日、足首と足の指が反らせない（下垂足）。足の甲がしびれる。", answer: ["fibular"],
      followUp: { question: "予防のために気をつけることは？", options: ["ギプスや体位で腓骨頭を圧迫しない", "膝を伸ばしきる", "足を高く上げない", "足首を強く固定する"], answer: 0 },
      explanation: "総腓骨神経は腓骨頭の外側の浅いところを通る。ギプス、足を組む、長時間の側臥位で傷む。" },
    { ...M, id: "supracondylar", figure: "limbs", prompt: "6歳 男児。転んで手をつき、肘が腫れた（上腕骨顆上骨折）。親指と人差し指で丸（OK）が作れない。", answer: ["elbowFront"],
      followUp: { question: "傷んだ神経は？（前骨間神経麻痺）", options: ["正中神経の枝", "尺骨神経", "腋窩神経", "総腓骨神経"], answer: 0 },
      explanation: "小児の顆上骨折は肘のあたりで正中神経（前骨間神経）や上腕動脈を傷めやすい。Volkmann拘縮に注意。" },
  ],
};
