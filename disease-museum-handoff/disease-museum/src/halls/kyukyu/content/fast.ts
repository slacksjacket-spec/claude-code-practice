// FAST（共通ゲーム tapMap）。図は模式。TODO(review)
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const svg = `<rect width="300" height="320" fill="#FFF8F0"/>
  <path d="M90 20 C70 60 60 120 64 200 C66 260 100 300 150 304 C200 300 234 260 236 200 C240 120 230 60 210 20Z" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <path d="M100 40 C96 80 98 110 110 120 M200 40 C204 80 202 110 190 120" stroke="#C8A27A" stroke-width="2" fill="none"/>
  <ellipse cx="150" cy="100" rx="22" ry="18" fill="#F7C6C0" stroke="#C8453B" stroke-width="2"/>
  <text x="150" y="314" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">正面から見た模式図（左が患者の右）</text>`;

export const fastContent: TapMapData = {
  question: "どこにプローブを当てて見つかる？",
  stampAt: 4,
  figures: {
    torso: { viewBox: "0 0 300 320", ariaLabel: "胸腹部の正面の模式図。左が患者の右", svg,
      regions: [
        { id: "pericardium", label: "心嚢（心窩部から）", shape: `<circle cx="150" cy="130" r="16"/>` },
        { id: "rchest", label: "右胸腔", shape: `<ellipse cx="104" cy="90" rx="22" ry="30"/>` },
        { id: "lchest", label: "左胸腔", shape: `<ellipse cx="196" cy="90" rx="22" ry="30"/>` },
        { id: "morison", label: "モリソン窩（肝臓と右腎の間）", shape: `<circle cx="88" cy="168" r="18"/>` },
        { id: "spleen", label: "脾臓のまわり（脾腎境界）", shape: `<circle cx="212" cy="168" r="18"/>` },
        { id: "douglas", label: "膀胱の後ろ（ダグラス窩）", shape: `<ellipse cx="150" cy="268" rx="28" ry="16"/>` },
      ] },
  },
  cases: [
    { ...M, id: "morison", figure: "torso", prompt: "交通外傷。あおむけの成人で、腹腔内の出血が最初にたまりやすい場所は？", answer: ["morison"],
      explanation: "あおむけではモリソン窩がいちばん低い場所の1つ。FASTでまず見る。" },
    { ...M, id: "tamponade", figure: "torso", prompt: "胸の刺し傷。血圧が低く頸静脈が怒張。心臓のまわりの液体を見たい。", answer: ["pericardium"],
      followUp: { question: "見つかったら？", options: ["心嚢穿刺・開胸", "経過観察", "抗菌薬", "利尿薬"], answer: 0 },
      explanation: "心タンポナーデ。" },
    { ...M, id: "spleen", figure: "torso", prompt: "左の肋骨を折った。左上腹部の痛みと低血圧。", answer: ["spleen"],
      followUp: { question: "考える臓器損傷は？", options: ["脾損傷", "肝損傷", "膵損傷", "腎梗塞"], answer: 0 },
      explanation: "左下位肋骨骨折は脾損傷を疑う。状態が不安定なら手術、安定ならIVRも。" },
    { ...M, id: "pelvis", figure: "torso", prompt: "骨盤骨折。下腹部の出血を探す。", answer: ["douglas"],
      explanation: "骨盤の中の液体は膀胱の後ろにたまる。膀胱に尿がある方が見やすい。" },
    { ...M, id: "hemothorax", figure: "torso", prompt: "右胸を強打。右の呼吸音が弱く、打診で濁音。", answer: ["rchest"],
      followUp: { question: "大量なら？", options: ["胸腔ドレーン（大量なら開胸）", "経過観察", "利尿薬", "気管支鏡"], answer: 0 },
      explanation: "血胸。ドレーンから1,000 mL以上出れば開胸を考える。" },
  ],
};
