// 胸部X線のシルエットサイン（共通ゲーム tapMap）。正面像の模式図で、どの肺葉の病変かを当てる。
// TODO(review) 正面像での肺葉の位置は重なりを無視した模式。シルエットサインと肺葉・区域の対応
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const bg = `<rect width="300" height="300" fill="#1B1E26"/>
  <path d="M30 40 C40 20 260 20 270 40 L285 290 L15 290Z" fill="#3A3D47"/>
  <path d="M42 70 C44 46 136 40 140 60 L142 250 C110 262 60 262 38 252Z" fill="#11131A"/>
  <path d="M258 70 C256 46 164 40 160 60 L158 250 C190 262 240 262 262 252Z" fill="#11131A"/>
  <path d="M146 30 L146 120 M154 30 L154 120" stroke="#8B8F99" stroke-width="5"/>
  <path d="M60 52 Q100 40 142 54 M240 52 Q200 40 158 54" stroke="#B9BCC5" stroke-width="6" fill="none"/>
  <path d="M134 120 C130 150 126 190 136 228 C170 246 222 238 230 206 C232 176 200 150 176 140 C178 120 168 104 160 100 C176 92 186 96 186 110" fill="#C9CBD1" stroke="#E4E5EA" stroke-width="2"/>
  <path d="M38 252 C70 236 120 236 142 250 M158 250 C190 240 230 236 262 252" stroke="#C9CBD1" stroke-width="4" fill="none"/>
  <text x="150" y="294" text-anchor="middle" font-size="9" fill="#8B8F99">見る人の左が患者の右</text>`;

export const cxrContent: TapMapData = {
  question: "病変のある場所は？",
  stampAt: 4,
  figures: {
    pa: {
      viewBox: "0 0 300 300", ariaLabel: "胸部X線正面像の模式図", svg: bg, note: "模式図です。実際は肺葉が前後に重なって写ります。",
      regions: [
        { id: "RUL", label: "右上葉", shape: `<path d="M44 72 C48 52 130 48 138 64 L138 128 L44 128Z"/>` },
        { id: "RML", label: "右中葉", shape: `<path d="M96 140 L132 140 C128 170 126 196 132 222 L96 222Z"/>` },
        { id: "RLL", label: "右下葉", shape: `<path d="M44 140 L92 140 L92 226 L130 230 C110 244 64 244 40 248Z"/>` },
        { id: "LUL", label: "左上葉（上区）", shape: `<path d="M256 72 C252 52 170 48 162 64 L162 128 L256 128Z"/>` },
        { id: "LING", label: "左上葉（舌区）", shape: `<path d="M190 146 L226 160 C232 178 230 200 224 214 L198 214Z"/>` },
        { id: "LLL", label: "左下葉", shape: `<path d="M232 140 L256 140 L260 248 C238 240 212 238 192 244 L230 220 C238 196 238 170 232 140Z"/>` },
      ],
    },
  },
  cases: [
    { ...M, id: "rml", figure: "pa", prompt: "発熱と咳。浸潤影で右の心臓の輪郭（右第2弓）がぼやけて見えない。",
      answer: ["RML"], explanation: "シルエットサイン陽性：病変が心臓と接している＝右中葉。右の心臓の輪郭は右中葉と接する。" },
    { ...M, id: "ling", figure: "pa", prompt: "浸潤影で左の心臓の輪郭（左第4弓）が消えている。",
      answer: ["LING"], explanation: "左室の輪郭と接するのは左上葉の舌区。" },
    { ...M, id: "rll", figure: "pa", prompt: "浸潤影で右の横隔膜の輪郭が消えているが、右の心臓の輪郭は見える。",
      answer: ["RLL"], explanation: "横隔膜と接するのは下葉。心臓の輪郭が保たれていれば中葉ではなく下葉。" },
    { ...M, id: "lll", figure: "pa", prompt: "心臓の影に重なる浸潤影。左の横隔膜の輪郭が消え、左の心臓の輪郭は見える。",
      answer: ["LLL"], explanation: "左下葉は心臓の後ろにあり、心陰影に隠れやすい。下行大動脈や左横隔膜のシルエットが消える。" },
    { ...M, id: "lul", figure: "pa", prompt: "大動脈弓（左第1弓）の輪郭が消える浸潤影。",
      answer: ["LUL"], explanation: "大動脈弓と接するのは左上葉の上区（S1+2）。" },
    { ...M, id: "rul", figure: "pa", prompt: "上縦隔の右縁（右第1弓）がぼやける浸潤影。水平裂は上に持ち上がっている。",
      answer: ["RUL"], explanation: "右上葉の病変。右上葉が縮むと水平裂（小葉間裂）が上へ引き上げられる。" },
    { ...M, id: "silhouette", figure: "pa", prompt: "浸潤影があるが、右の心臓の輪郭も右の横隔膜もはっきり見える。右の肺門より上にある。",
      answer: ["RUL"], followUp: { question: "シルエットサイン陽性が意味するのは？", options: ["病変が、その輪郭をつくる構造と接している", "病変が、その構造より後ろにある", "病変が石灰化している", "胸水がある"], answer: 0 },
      explanation: "同じくらいの濃さのものが接していると境界が消える（シルエットサイン陽性）。接していなければ輪郭は見える。" },
  ],
};
