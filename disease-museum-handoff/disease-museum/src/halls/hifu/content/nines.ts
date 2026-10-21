// 9の法則（共通ゲーム tapMap）。成人。TODO(review)
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const person = (dx: number, back = false) => `<g transform="translate(${dx} 0)">
  <circle cx="70" cy="34" r="20" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <rect x="44" y="58" width="52" height="86" rx="12" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <rect x="20" y="60" width="20" height="84" rx="10" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/><rect x="100" y="60" width="20" height="84" rx="10" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <rect x="46" y="148" width="22" height="100" rx="10" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/><rect x="72" y="148" width="22" height="100" rx="10" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <text x="70" y="270" text-anchor="middle" font-size="12" font-weight="800" fill="#7A5A50">${back ? "背面" : "前面"}</text></g>`;
const svg = `<rect width="320" height="280" fill="#FFF8F0"/>${person(10)}${person(170, true)}`;

export const ninesContent: TapMapData = {
  question: "やけどした場所を全部選ぶ",
  stampAt: 4,
  figures: {
    body: { viewBox: "0 0 320 280", ariaLabel: "前面と背面の人の模式図", svg, note: "頭・腕・脚は前後を合わせた1つの領域。左右は患者から見て",
      regions: [
        { id: "head", label: "頭と首（9%）", shape: `<circle cx="80" cy="34" r="22"/>` },
        { id: "armR", label: "右腕（9%）", shape: `<rect x="28" y="58" width="24" height="88" rx="11"/>` },
        { id: "armL", label: "左腕（9%）", shape: `<rect x="108" y="58" width="24" height="88" rx="11"/>` },
        { id: "front", label: "体幹の前（18%）", shape: `<rect x="56" y="60" width="48" height="82" rx="10"/>` },
        { id: "back", label: "体幹の後ろ（18%）", shape: `<rect x="216" y="60" width="48" height="82" rx="10"/>` },
        { id: "legR", label: "右脚（18%）", shape: `<rect x="54" y="150" width="26" height="100" rx="11"/>` },
        { id: "legL", label: "左脚（18%）", shape: `<rect x="82" y="150" width="26" height="100" rx="11"/>` },
        { id: "peri", label: "陰部（1%）", shape: `<circle cx="80" cy="146" r="7"/>` },
      ] },
  },
  cases: [
    { ...M, id: "chest", figure: "body", prompt: "熱湯を胸からお腹にかぶった（II度）。", answer: ["front"],
      followUp: { question: "面積は？", options: ["18%", "9%", "27%", "36%"], answer: 0 }, explanation: "体幹の前面は18%。" },
    { ...M, id: "faceArms", figure: "body", prompt: "爆発で、顔と首、両腕全体をやけどした（II度）。", answer: ["head", "armR", "armL"],
      followUp: { question: "面積は？", options: ["27%", "18%", "36%", "45%"], answer: 0 }, explanation: "9＋9＋9＝27%。気道熱傷にも注意（煤、嗄声、鼻毛が焦げる）。" },
    { ...M, id: "backLeg", figure: "body", prompt: "火事で背中全体と右脚全体をやけどした（II〜III度）。", answer: ["back", "legR"],
      followUp: { question: "面積は？", options: ["36%", "27%", "45%", "18%"], answer: 0 }, explanation: "18＋18＝36%。成人で15%以上は輸液が必要な目安。" },
    { ...M, id: "armLeg", figure: "body", prompt: "左腕全体と左脚全体をやけどした（II度）。", answer: ["armL", "legL"],
      followUp: { question: "面積は？", options: ["27%", "18%", "36%", "9%"], answer: 0 }, explanation: "9＋18＝27%。" },
    { ...M, id: "lower", figure: "body", prompt: "熱い油の鍋が倒れ、陰部と両脚全体をやけどした（II度）。", answer: ["peri", "legR", "legL"],
      followUp: { question: "面積は？", options: ["37%", "36%", "19%", "45%"], answer: 0 }, explanation: "1＋18＋18＝37%。陰部の熱傷は専門施設へ。" },
  ],
};
