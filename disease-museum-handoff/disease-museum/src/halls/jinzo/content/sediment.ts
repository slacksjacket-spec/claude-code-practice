// 尿沈渣（共通ゲーム microscope）。絵は模式。TODO(review) 各所見と疾患の対応
import type { MicroscopeData } from "../../../engine/games/microscope.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const cast = (inner: string, fill = "#EDE6F6", stroke = "#9B8FB5") => `<rect x="-17" y="-6" width="34" height="12" rx="6" fill="${fill}" fill-opacity=".85" stroke="${stroke}" stroke-width="1.2"/>${inner}`;
const dots = (n: number, color: string, r = 1.3) => Array.from({ length: n }, (_, i) => `<circle cx="${-13 + (i * 26) / (n - 1)}" cy="${((i * 37) % 7) - 3}" r="${r}" fill="${color}"/>`).join("");

export const sedimentContent: MicroscopeData = {
  title: "尿沈渣（強拡大）",
  background: "#F4EFE2",
  stampAt: 4,
  sprites: {
    rbc: { label: "赤血球", svg: `<circle r="5.5" fill="#F2B3A6" stroke="#C9726A" stroke-width="1"/><circle r="2.5" fill="#F8D3CB"/>` },
    dysRbc: { label: "変形赤血球", svg: `<path d="M0 -6 C3 -7 4 -3 6 -2 C8 1 4 3 4 5 C2 8 -2 6 -4 5 C-7 4 -5 0 -6 -2 C-6 -5 -3 -6 0 -6Z" fill="#F2B3A6" stroke="#C9726A" stroke-width="1"/><circle cx="4" cy="-5" r="1.6" fill="#F2B3A6" stroke="#C9726A" stroke-width=".8"/>` },
    wbc: { label: "白血球", svg: `<circle r="7.5" fill="#E8E4F0" stroke="#8A80A8" stroke-width="1"/>${[[-2, -2], [2, -1], [-1, 2], [3, 3], [-3, 1]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#7A6E9A"/>`).join("")}` },
    squam: { label: "扁平上皮細胞", svg: `<path d="M-12 -6 L-2 -11 L11 -6 L12 6 L1 11 L-11 7Z" fill="#F7F3EA" stroke="#B8B0A0" stroke-width="1"/><circle r="2" fill="#B8B0A0"/>` },
    hyaline: { label: "硝子円柱", svg: cast("", "#F7F5FB", "#C9C2D8") },
    rbcCast: { label: "赤血球円柱", svg: cast(`${[-11, -5, 1, 7, 12].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 2 : -2}" r="3.3" fill="#E58C7C" stroke="#B5584A" stroke-width=".6"/>`).join("")}`, "#F6DAD3", "#C9726A") },
    wbcCast: { label: "白血球円柱", svg: cast(`${[-10, -3, 4, 11].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 1.5 : -1.5}" r="3.8" fill="#D8D2E6" stroke="#7A6E9A" stroke-width=".7"/>`).join("")}${dots(6, "#7A6E9A", 0.9)}`) },
    muddy: { label: "泥のような茶色の顆粒円柱", svg: cast(dots(12, "#6B4A2A", 1.4), "#C9A27A", "#7A5530") },
    oval: { label: "卵円形脂肪体", svg: `<ellipse rx="9" ry="7" fill="#F5F0D8" stroke="#A89C60" stroke-width="1"/>${[[-3, -2], [2, -3], [3, 2], [-2, 3], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#FFF8C8" stroke="#C9B04A" stroke-width=".8"/>`).join("")}` },
    oxalate: { label: "シュウ酸カルシウム結晶（封筒形）", svg: `<rect x="-6" y="-6" width="12" height="12" fill="#F2F6FA" stroke="#5A6A7E" stroke-width="1.2"/><path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#5A6A7E" stroke-width="1"/>` },
    uric: { label: "尿酸結晶（菱形）", svg: `<path d="M0 -9 L6 0 L0 9 L-6 0Z" fill="#F2D27A" stroke="#B08A2A" stroke-width="1.2"/>` },
    cystine: { label: "シスチン結晶（六角形）", svg: `<path d="M-8 0 L-4 -7 L4 -7 L8 0 L4 7 L-4 7Z" fill="#EEF4F8" stroke="#5A7A8E" stroke-width="1.2"/>` },
  },
  cases: [
    { ...M, id: "rbcCast", story: "20歳 男性。かぜの数日後にコーラ色の尿。", crowd: [{ sprite: "dysRbc", n: 9 }, { sprite: "rbc", n: 3 }, { sprite: "squam", n: 1 }], target: { sprite: "rbcCast", n: 2 },
      question: "この所見から考える出血の場所は？", options: ["糸球体（糸球体腎炎）", "膀胱（膀胱炎・腫瘍）", "尿道", "腎盂の結石"], answer: 0,
      explanation: "赤血球円柱と変形赤血球は、糸球体から赤血球が漏れたしるし。上気道炎の数日後の肉眼的血尿はIgA腎症を考える。" },
    { ...M, id: "wbcCast", story: "30歳 女性。高熱、悪寒、右の背中の痛み。", crowd: [{ sprite: "wbc", n: 12 }, { sprite: "rbc", n: 3 }, { sprite: "squam", n: 1 }], target: { sprite: "wbcCast", n: 2 },
      question: "白血球円柱があるときに考えるのは？", options: ["腎実質の炎症（腎盂腎炎・間質性腎炎）", "膀胱炎だけ", "尿道炎だけ", "ネフローゼ症候群"], answer: 0,
      explanation: "円柱は尿細管の中で固まったもの。白血球円柱は、炎症が腎臓そのもの（腎盂腎炎、間質性腎炎）にあることを示す。" },
    { ...M, id: "muddy", story: "68歳 男性。大手術のあと血圧が下がり、尿が出なくなった。", crowd: [{ sprite: "hyaline", n: 2 }, { sprite: "rbc", n: 2 }, { sprite: "squam", n: 2 }], target: { sprite: "muddy", n: 3 },
      question: "考える急性腎障害の型は？", options: ["急性尿細管壊死（腎性）", "脱水（腎前性）", "尿路の閉塞（腎後性）", "急性糸球体腎炎"], answer: 0,
      explanation: "泥のような茶色の顆粒円柱は、壊れた尿細管上皮のしるしで急性尿細管壊死に典型的。腎前性では硝子円柱くらい。" },
    { ...M, id: "oval", story: "8歳 男児。まぶたと足のむくみ。尿が泡立つ。", crowd: [{ sprite: "hyaline", n: 3 }, { sprite: "squam", n: 2 }, { sprite: "rbc", n: 1 }], target: { sprite: "oval", n: 3 },
      question: "考える病態は？", options: ["ネフローゼ症候群", "膀胱炎", "尿路結石", "急性尿細管壊死"], answer: 0,
      explanation: "卵円形脂肪体（脂肪を含んだ尿細管上皮）や脂肪円柱は、高度の蛋白尿と脂質異常を伴うネフローゼ症候群のしるし。小児なら微小変化型が多い。" },
    { ...M, id: "oxalate", story: "35歳 男性。不凍液（エチレングリコール）を飲んだ。", crowd: [{ sprite: "rbc", n: 4 }, { sprite: "squam", n: 2 }, { sprite: "wbc", n: 2 }], target: { sprite: "oxalate", n: 4 },
      question: "この結晶は？", options: ["シュウ酸カルシウム", "尿酸", "シスチン", "リン酸マグネシウムアンモニウム"], answer: 0,
      explanation: "封筒形の結晶はシュウ酸カルシウム。エチレングリコールはシュウ酸になり、AG開大性代謝性アシドーシスと腎障害を起こす。" },
    { ...M, id: "cystine", story: "12歳 男児。くり返す尿路結石。家族にも結石。", crowd: [{ sprite: "rbc", n: 5 }, { sprite: "squam", n: 2 }], target: { sprite: "cystine", n: 3 },
      question: "考える病気は？", options: ["シスチン尿症", "痛風", "原発性副甲状腺機能亢進症", "尿路感染症"], answer: 0,
      explanation: "六角形の結晶はシスチン。シスチンなどの二塩基性アミノ酸の再吸収障害（常染色体潜性）。尿をアルカリ化して水をたくさん飲む。" },
    { ...M, id: "uric", story: "50歳 男性。痛風発作をくり返す。酸性の尿。", crowd: [{ sprite: "rbc", n: 4 }, { sprite: "squam", n: 2 }], target: { sprite: "uric", n: 4 },
      question: "この結晶ができやすい尿の条件は？", options: ["酸性の尿", "アルカリ性の尿", "尿量が多い", "尿糖が多い"], answer: 0,
      explanation: "菱形の尿酸結晶。尿酸は酸性尿で溶けにくい。尿酸結石はX線に写りにくい（陰性結石）。" },
  ],
};
