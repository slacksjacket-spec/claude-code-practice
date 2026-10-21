// 手の関節（共通ゲーム tapMap）。図は模式。TODO(review) 各疾患の好発部位
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const finger = (x: number, top: number, w = 22) => `<rect x="${x}" y="${top}" width="${w}" height="${150 - top}" rx="11" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>`;
const svg = `<rect width="320" height="300" fill="#FFF8F0"/>
  <path d="M80 140 L240 140 L248 230 C250 270 220 296 160 296 C100 296 72 270 74 230Z" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  ${finger(92, 30)}${finger(126, 14)}${finger(160, 20)}${finger(194, 44)}
  <path d="M80 200 C50 180 34 150 30 120 C28 104 46 100 54 112 C62 130 74 148 92 160" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
  <text x="290" y="290" font-size="10" font-weight="800" fill="#7A5A50" text-anchor="end">右手の甲</text>`;
export const handContent: TapMapData = {
  question: "どの関節？",
  stampAt: 4,
  figures: {
    hand: { viewBox: "0 0 320 300", ariaLabel: "右手の甲の模式図", svg, note: "親指は簡略化。関節の帯をタップ",
      regions: [
        { id: "dip", label: "DIP関節（第1関節）", shape: `<rect x="88" y="52" width="132" height="14" rx="6"/>` },
        { id: "pip", label: "PIP関節（第2関節）", shape: `<rect x="88" y="94" width="132" height="14" rx="6"/>` },
        { id: "mcp", label: "MCP関節（指の付け根）", shape: `<rect x="86" y="138" width="136" height="14" rx="6"/>` },
        { id: "cmc", label: "親指のCM関節", shape: `<circle cx="74" cy="196" r="12"/>` },
        { id: "wrist", label: "手関節", shape: `<rect x="84" y="270" width="150" height="16" rx="7"/>` },
      ] },
  },
  cases: [
    { ...M, id: "ra", figure: "hand", prompt: "40歳 女性。朝のこわばりが1時間以上。両手が左右対称に腫れる。", signs: ["抗CCP抗体陽性"], answer: ["pip", "mcp", "wrist"],
      followUp: { question: "関節リウマチで普通は侵されにくい関節は？", options: ["DIP関節", "MCP関節", "手関節", "PIP関節"], answer: 0 },
      explanation: "関節リウマチはPIP・MCP・手関節の滑膜炎。DIPは侵されにくい。尺側偏位、スワンネック変形、ボタン穴変形。" },
    { ...M, id: "heberden", figure: "hand", prompt: "65歳 女性。指先の関節が硬く、こぶのように出っぱっている。朝のこわばりは短い。", answer: ["dip"],
      followUp: { question: "このこぶの名前は？", options: ["Heberden結節", "Bouchard結節", "痛風結節", "リウマトイド結節"], answer: 0 },
      explanation: "変形性関節症のDIPの骨棘。PIPならBouchard結節。" },
    { ...M, id: "bouchard", figure: "hand", prompt: "70歳 女性。真ん中の関節が硬くふくらんでいる。炎症反応は陰性。", answer: ["pip"],
      followUp: { question: "考えるのは？", options: ["変形性関節症（Bouchard結節）", "関節リウマチ", "痛風", "乾癬性関節炎"], answer: 0 },
      explanation: "PIPの変形性関節症。関節リウマチと違い、硬い骨性の腫れで血液検査は正常。" },
    { ...M, id: "cmc", figure: "hand", prompt: "60歳 女性。瓶のふたを開けるときに親指の付け根が痛い。", answer: ["cmc"],
      followUp: { question: "考えるのは？", options: ["母指CM関節症", "de Quervain病", "手根管症候群", "ばね指"], answer: 0 },
      explanation: "母指の付け根（CM関節）の変形性関節症。中年以降の女性に多い。" },
    { ...M, id: "psa", figure: "hand", prompt: "45歳 男性。肘と頭に銀白色のかさぶたのような皮疹。爪に点状のくぼみ。指の先の関節が腫れる。", answer: ["dip"],
      followUp: { question: "考えるのは？", options: ["乾癬性関節炎", "関節リウマチ", "痛風", "SLE"], answer: 0 },
      explanation: "乾癬性関節炎はDIPを侵しやすく、指全体が腫れる（指炎）。リウマトイド因子は陰性（血清反応陰性脊椎関節炎）。" },
    { ...M, id: "cppd", figure: "hand", prompt: "80歳 女性。急に手首が腫れて熱い。X線で三角線維軟骨に石灰化。", answer: ["wrist"],
      followUp: { question: "関節液の結晶は？", options: ["ピロリン酸カルシウム（偏光で弱い正の複屈折）", "尿酸ナトリウム（針状、負の複屈折）", "コレステロール", "シュウ酸カルシウム"], answer: 0 },
      explanation: "偽痛風（ピロリン酸カルシウム沈着症）。膝と手関節に多い。" },
  ],
};
