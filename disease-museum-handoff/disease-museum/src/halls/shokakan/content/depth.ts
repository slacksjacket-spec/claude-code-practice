// 深達度タップ。
// TODO(review) 胃癌の内視鏡的切除の適応（胃癌治療ガイドライン第6版の条件）と、大腸 T1 癌の SM 浸潤 1000μm の扱いは、記憶から書いたので原文と照合が必要
import type { DepthData } from "../exhibits/depth.schema";

const M = { review: "draft" as const, sources: ["胃癌治療ガイドライン 第6版（2021）", "大腸癌治療ガイドライン"] };
const LAYERS = [
  { id: "M", label: "粘膜（M）" },
  { id: "SM", label: "粘膜下層（SM）" },
  { id: "MP", label: "固有筋層（MP）" },
  { id: "SS", label: "漿膜下層（SS）" },
  { id: "SE", label: "漿膜（SE）" },
];

export const depthContent: DepthData = {
  organs: { stomach: { name: "胃", layers: LAYERS }, colon: { name: "大腸", layers: LAYERS } },
  treatments: ["内視鏡的切除（ESD/EMR）", "外科手術（リンパ節郭清つき）"],
  stampAt: 4,
  cases: [
    { ...M, id: "g1", organ: "stomach", card: { 組織型: "分化型", 大きさ: "20mm", 潰瘍: "なし" }, depth: "M", treatment: 0,
      explanation: "粘膜内（cT1a）の分化型で潰瘍なし。大きさにかかわらず内視鏡的切除（ESD）の適応。" },
    { ...M, id: "g2", organ: "stomach", card: { 組織型: "分化型", 大きさ: "40mm", 潰瘍: "あり" }, depth: "M", treatment: 1,
      explanation: "分化型でも潰瘍（瘢痕）があると、ESDの適応は3cm以下まで。40mmなので外科手術。" },
    { ...M, id: "g3", organ: "stomach", card: { 組織型: "未分化型", 大きさ: "15mm", 潰瘍: "なし" }, depth: "M", treatment: 0,
      explanation: "未分化型は、粘膜内・潰瘍なし・2cm以下ならESDの適応（第6版で絶対適応に）。" },
    { ...M, id: "g4", organ: "stomach", card: { 組織型: "未分化型", 大きさ: "30mm", 潰瘍: "なし" }, depth: "M", treatment: 1,
      explanation: "未分化型で2cmを超えると、リンパ節転移の危険が上がるので外科手術。" },
    { ...M, id: "g5", organ: "stomach", card: { 組織型: "分化型", 大きさ: "25mm", 潰瘍: "なし" }, depth: "SM", treatment: 1,
      explanation: "粘膜下層の深くまで入っている（cT1b）。リンパ節転移の可能性があり、郭清つきの外科手術。" },
    { ...M, id: "g6", organ: "stomach", card: { 組織型: "分化型", 大きさ: "45mm", 潰瘍: "周堤あり" }, depth: "MP", treatment: 1,
      explanation: "固有筋層まで達した進行胃癌。外科手術（進行度により術前・術後の化学療法も）。" },
    { ...M, id: "c1", organ: "colon", card: { 組織型: "腺腫内癌", 大きさ: "15mm", 所見: "表面構造は整" }, depth: "M", treatment: 0,
      explanation: "粘膜内癌（Tis）はリンパ節転移がないので、内視鏡的切除で治る。" },
    { ...M, id: "c2", organ: "colon", card: { 組織型: "高分化腺癌", 大きさ: "20mm", 所見: "SM浸潤1000μm以上を疑う" }, depth: "SM", treatment: 1,
      explanation: "SMへの浸潤が1000μm以上だとリンパ節転移の危険が約1割あり、郭清つきの外科手術を考える。" },
  ],
};
