// 顔面神経の部位診断（共通ゲーム tapMap）。図は模式。TODO(review) 分枝の位置と症状の対応
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const svg = `<rect width="340" height="250" fill="#FFF8F0"/>
  <path d="M20 40 H80 L120 110 H170 L200 130 H250 V200 L300 230" stroke="#FFC933" stroke-width="10" fill="none" stroke-linejoin="round"/>
  <path d="M20 40 H80 L120 110 H170 L200 130 H250 V200 L300 230" stroke="#1C1537" stroke-width="2" fill="none" stroke-linejoin="round"/>
  <path d="M120 110 L110 70" stroke="#3D5AFE" stroke-width="3"/><text x="104" y="62" font-size="9" font-weight="800" fill="#3D5AFE">大錐体神経（涙）</text>
  <path d="M200 130 L210 100" stroke="#22C1A0" stroke-width="3"/><text x="180" y="92" font-size="9" font-weight="800" fill="#22C1A0">アブミ骨筋神経（音）</text>
  <path d="M250 180 L300 170" stroke="#FF5A36" stroke-width="3"/><text x="270" y="160" font-size="9" font-weight="800" fill="#FF5A36">鼓索神経（味）</text>
  <text x="14" y="28" font-size="10" font-weight="800" fill="#7A5A50">脳</text><text x="290" y="246" font-size="10" font-weight="800" fill="#7A5A50">顔の筋肉へ</text>`;

export const facialContent: TapMapData = {
  question: "障害の場所は？",
  stampAt: 4,
  figures: {
    facial: { viewBox: "0 0 340 250", ariaLabel: "顔面神経の走行の模式図", svg, note: "枝より中枢で傷むと、その枝の働きも落ちる",
      regions: [
        { id: "central", label: "大脳・皮質延髄路（中枢性）", shape: `<rect x="10" y="30" width="44" height="22" rx="8"/>` },
        { id: "iac", label: "内耳道", shape: `<rect x="56" y="30" width="36" height="22" rx="8"/>` },
        { id: "gg", label: "膝神経節", shape: `<circle cx="120" cy="110" r="13"/>` },
        { id: "tympanic", label: "鼓室部（アブミ骨筋神経より前）", shape: `<rect x="136" y="100" width="56" height="22" rx="8"/>` },
        { id: "mastoid", label: "乳突部（鼓索神経より前）", shape: `<rect x="240" y="138" width="22" height="36" rx="8"/>` },
        { id: "distal", label: "茎乳突孔より末梢", shape: `<rect x="252" y="196" width="50" height="30" rx="8" transform="rotate(30 277 211)"/>` },
      ] },
  },
  cases: [
    { ...M, id: "central", figure: "facial", prompt: "70歳 男性。右の口元が下がる。額のしわは両側とも寄せられる。右手も動かしにくい。", answer: ["central"],
      followUp: { question: "額が保たれる理由は？", options: ["額の筋肉は左右両方の大脳から支配されるから", "額は三叉神経の支配だから", "額は動眼神経の支配だから", "偶然"], answer: 0 },
      explanation: "中枢性顔面麻痺は額が保たれる。脳梗塞などを考える。" },
    { ...M, id: "parotid", figure: "facial", prompt: "60歳 男性。耳下腺の手術のあと、片側の顔全体が動かない。涙・聴覚・味覚は正常。", answer: ["distal"],
      followUp: { question: "術前に顔面神経麻痺があった耳下腺腫瘍で考えるのは？", options: ["悪性腫瘍", "多形腺腫（良性）", "Warthin腫瘍", "唾石"], answer: 0 },
      explanation: "顔面神経は耳下腺の中を通る。麻痺を伴う耳下腺腫瘍は悪性を疑う。" },
    { ...M, id: "mastoid", figure: "facial", prompt: "顔面麻痺と、舌の前のほうの味覚障害。涙と音の響きは正常。", answer: ["mastoid"],
      followUp: { question: "味覚を運ぶ枝は？", options: ["鼓索神経", "大錐体神経", "アブミ骨筋神経", "舌下神経"], answer: 0 },
      explanation: "鼓索神経より中枢、アブミ骨筋神経より末梢。" },
    { ...M, id: "bell", figure: "facial", prompt: "35歳 女性。朝起きたら左の顔全体（額も）が動かない。味覚障害と、音が響いてうるさい。涙は出る。耳に水疱はない。", answer: ["tympanic"],
      followUp: { question: "最も多い原因と治療は？", options: ["Bell麻痺。ステロイド（＋抗ウイルス薬）", "脳梗塞。血栓溶解", "聴神経腫瘍。手術", "中耳炎。抗菌薬"], answer: 0 },
      explanation: "Bell麻痺（単純ヘルペスウイルスの再活性化と考えられている）。多くは回復する。" },
    { ...M, id: "hunt", figure: "facial", prompt: "60歳 男性。右の耳の痛みと耳介に水疱。右の顔面麻痺、めまい、難聴。涙も減った。", answer: ["gg"],
      followUp: { question: "原因ウイルスは？", options: ["水痘・帯状疱疹ウイルス", "単純ヘルペスウイルス1型", "EBウイルス", "アデノウイルス"], answer: 0 },
      explanation: "Ramsay Hunt症候群。膝神経節の帯状疱疹。Bell麻痺より回復が悪い。" },
    { ...M, id: "vs", figure: "facial", prompt: "50歳 女性。ゆっくり進む左の難聴と耳鳴り、ふらつき。最近、左の顔が少し動きにくい。", answer: ["iac"],
      followUp: { question: "考えるのは？", options: ["聴神経腫瘍（前庭神経鞘腫）", "Bell麻痺", "メニエール病", "中耳炎"], answer: 0 },
      explanation: "内耳道〜小脳橋角部の腫瘍。片側の感音難聴を見たらMRI。両側なら神経線維腫症2型。" },
  ],
};
