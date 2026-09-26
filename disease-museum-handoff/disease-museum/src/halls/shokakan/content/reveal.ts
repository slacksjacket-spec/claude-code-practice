// 影絵当て：造影・X線の模式図。実際の画像ではなく、所見の形だけを誇張して描いたもの。
// TODO(review) 各所見の説明文は未レビュー
import type { RevealData } from "../exhibits/reveal.schema";

const BG = "#1B1E26", BA = "#EDE8DC"; // 背景とバリウム
const frame = (inner: string, bg = BG) =>
  `<svg viewBox="0 0 200 240" role="img" aria-label="模式図"><rect width="200" height="240" fill="${bg}"/>${inner}</svg>`;

/** 上下にのびる管。w(y) で太さ、cx(y) で中心を変える */
function tube(y0: number, y1: number, cx: (y: number) => number, w: (y: number) => number, fill = BA) {
  const L: string[] = [], R: string[] = [];
  for (let y = y0; y <= y1; y += 3) { L.push(`${(cx(y) - w(y) / 2).toFixed(1)} ${y}`); R.unshift(`${(cx(y) + w(y) / 2).toFixed(1)} ${y}`); }
  return `<path d="M${L.join(" L")} L${R.join(" L")}Z" fill="${fill}"/>`;
}
/** 左右にのびる管（大腸の一部など） */
function htube(x0: number, x1: number, cy: (x: number) => number, w: (x: number) => number, fill = BA) {
  const T: string[] = [], B: string[] = [];
  for (let x = x0; x <= x1; x += 3) { T.push(`${x} ${(cy(x) - w(x) / 2).toFixed(1)}`); B.unshift(`${x} ${(cy(x) + w(x) / 2).toFixed(1)}`); }
  return `<path d="M${T.join(" L")} L${B.join(" L")}Z" fill="${fill}"/>`;
}
const stomachSmall = `<path d="M96 222 C110 214 150 214 172 230 L172 240 L96 240Z" fill="${BA}" opacity=".9"/>`;

const achalasia = frame(
  tube(10, 212, () => 100, (y) => (y < 30 ? 26 : y < 180 ? 26 + Math.min(44, (y - 30) * 0.9) * (y < 150 ? 1 : (180 - y) / 30) : Math.max(3, 26 * (1 - (y - 180) / 32)))) +
  `<path d="M60 70 L140 70" stroke="${BG}" stroke-width="2" opacity=".5"/>` + stomachSmall,
);
const des = frame(tube(10, 222, (y) => 100 + Math.sin(y / 9) * 7, (y) => 24 - Math.abs(Math.sin(y / 9)) * 12) + stomachSmall);
const escCa = frame(
  tube(10, 222, () => 100, (y) => (y > 95 && y < 145 ? 8 + ((y * 7) % 5) + (y < 102 || y > 138 ? 6 : 0) : 26)) + stomachSmall,
);
const zenker = frame(`<ellipse cx="72" cy="78" rx="30" ry="34" fill="${BA}"/>` + tube(10, 222, () => 108, (y) => (y < 50 ? 30 : 22)) + stomachSmall);
const stomachPath = "M70 20 C60 60 58 110 70 150 C84 196 130 214 164 190 C180 178 178 160 164 156 C146 150 128 170 112 150 C96 128 102 70 104 20Z";
const ulcerNiche = frame(`<path d="${stomachPath}" fill="${BA}"/><path d="M160 158 C172 152 184 150 188 160 C186 170 172 170 162 168Z" fill="${BA}"/><circle cx="178" cy="160" r="3" fill="${BG}" opacity=".3"/>`);
const scirrhous = frame(`<path d="M84 20 C80 70 80 120 86 160 C92 188 118 196 140 186 L140 170 C122 176 106 170 104 150 C100 118 102 70 104 20Z" fill="${BA}"/>`);
const appleCore = frame(htube(10, 190, () => 120, (x) => (x > 80 && x < 120 ? 10 + ((x * 3) % 4) : x > 72 && x < 128 ? 34 : 46)));
const intussusception = frame(
  htube(10, 128, () => 120, () => 44) +
  `<path d="M128 98 C148 100 150 140 128 142 C140 132 140 108 128 98Z" fill="${BG}"/><path d="M128 98 L138 96 C160 104 160 136 138 144 L128 142 C150 136 150 104 128 98Z" fill="${BA}"/>`,
);
const volvulus = frame(
  `<path d="M100 26 C40 30 24 110 50 170 C70 214 130 214 150 170 C176 110 160 30 100 26Z" fill="#3A3D47" stroke="#8B8F99" stroke-width="5"/>
   <path d="M100 32 C92 90 92 150 100 204" stroke="#8B8F99" stroke-width="6" fill="none"/>
   <path d="M86 214 L86 236 M114 214 L114 236" stroke="#8B8F99" stroke-width="10"/>`,
  "#C9CBD1",
);

export const revealContent: RevealData = {
  levels: [16, 10, 6, 3, 0],
  roundSize: 6,
  stampAt: 4,
  distractors: ["胃食道逆流症", "Mallory-Weiss症候群", "潰瘍性大腸炎"],
  items: [
    { review: "draft", sources: [], id: "achalasia", answer: "食道アカラシア", caption: "食道造影", svg: achalasia,
      explanation: "拡張した食道の下端が、なめらかに細くなる（鳥のくちばし状）。下部食道括約筋が弛緩しないため。確定は食道内圧検査。" },
    { review: "draft", sources: [], id: "des", answer: "びまん性食道痙攣", caption: "食道造影", svg: des,
      explanation: "食道がらせん状にくびれる（コルク栓抜き状、数珠状）。同期性の強い収縮が起こるため。胸痛とつかえ感。" },
    { review: "draft", sources: [], id: "escca", answer: "食道癌", caption: "食道造影", svg: escCa,
      explanation: "壁が不整でギザギザの狭窄、上下の境目が急（肩を張ったような形）。アカラシアのなめらかな先細りと区別する。" },
    { review: "draft", sources: [], id: "zenker", answer: "Zenker憩室", caption: "食道造影", svg: zenker,
      explanation: "咽頭と食道の境目の後ろ側から袋が突き出す（圧出性憩室）。高齢者の嚥下障害、口臭、食べた物の逆流。" },
    { review: "draft", sources: [], id: "niche", answer: "胃潰瘍", caption: "胃造影", svg: ulcerNiche,
      explanation: "胃の輪郭の外へバリウムが突き出す（ニッシェ）。潰瘍の穴にバリウムがたまった影。" },
    { review: "draft", sources: [], id: "scirrhous", answer: "スキルス胃癌", caption: "胃造影", svg: scirrhous,
      explanation: "胃全体が硬く小さくなり、ひだも伸びない（革袋状、linitis plastica）。粘膜の下を広がるので内視鏡では見逃しやすい。" },
    { review: "draft", sources: [], id: "applecore", answer: "大腸癌", caption: "注腸造影", svg: appleCore,
      explanation: "腸の一部が全周性に不整に細くなる（アップルコア像、かじったリンゴの芯）。進行した全周性の大腸癌。" },
    { review: "draft", sources: [], id: "intussusception", answer: "腸重積症", caption: "注腸造影", svg: intussusception,
      explanation: "バリウムの先端がカニのはさみのようにへこむ（カニ爪状）。乳幼児の間欠的な啼泣、いちごゼリー状の血便。注腸で整復もできる。" },
    { review: "draft", sources: [], id: "volvulus", answer: "S状結腸軸捻転症", caption: "腹部X線", svg: volvulus,
      explanation: "ガスで大きくふくらんだ腸が、中央に線のあるコーヒー豆のような形に見える。高齢者、便秘。内視鏡で整復を試みる。" },
  ],
};
