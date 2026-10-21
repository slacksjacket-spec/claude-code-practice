// 原発疹の影絵当て（共通ゲーム reveal）。左が断面、右が表面の模式図。TODO(review) 各原発疹の定義と描き方
import type { RevealData } from "../../../engine/games/reveal.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const SKIN = "#F3D3B8", DERM = "#F7C6C0";
const frame = (cut: string, top: string) => `<svg viewBox="0 0 200 240" role="img" aria-label="模式図"><rect width="200" height="240" fill="#FFF8F0"/>
  <text x="10" y="18" font-size="11" font-weight="800" fill="#7A5A50">断面</text><text x="10" y="138" font-size="11" font-weight="800" fill="#7A5A50">表面</text>
  <rect x="10" y="70" width="180" height="12" fill="${SKIN}"/><rect x="10" y="82" width="180" height="40" fill="${DERM}"/>${cut}
  <rect x="10" y="146" width="180" height="84" rx="10" fill="${SKIN}"/>${top}</svg>`;

export const eruptionContent: RevealData = {
  levels: [14, 9, 5, 2, 0],
  roundSize: 6,
  stampAt: 4,
  distractors: ["鱗屑", "びらん"],
  items: [
    { ...M, id: "erythema", answer: "紅斑", caption: "平らで赤い。押すと色が消える",
      svg: frame(`<rect x="60" y="82" width="80" height="16" fill="#E8505A" opacity=".55"/>`, `<ellipse cx="100" cy="188" rx="50" ry="26" fill="#E8505A" opacity=".6"/>`),
      explanation: "真皮の血管が広がって赤い。ガラス板で押すと消える（硝子圧法）。" },
    { ...M, id: "purpura", answer: "紫斑", caption: "平らで紫。押しても消えない",
      svg: frame(`${[70, 90, 110, 130].map((x) => `<circle cx="${x}" cy="94" r="5" fill="#7A2A6A"/>`).join("")}`, `${[[70, 180], [95, 196], [120, 176], [140, 198], [110, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#7A2A6A" opacity=".8"/>`).join("")}`),
      explanation: "血管の外に出た赤血球。押しても消えない。血小板減少や血管炎。" },
    { ...M, id: "papule", answer: "丘疹", caption: "盛り上がり、直径1 cm未満",
      svg: frame(`<path d="M80 70 Q100 46 120 70Z" fill="${SKIN}" stroke="#C8907A" stroke-width="1.5"/>`, `<circle cx="100" cy="188" r="12" fill="#E8907A" stroke="#B8604A" stroke-width="2"/>`),
      explanation: "直径1 cm未満の盛り上がり。それより大きければ結節。" },
    { ...M, id: "nodule", answer: "結節", caption: "盛り上がり、直径1 cm以上で深い",
      svg: frame(`<path d="M50 70 Q100 20 150 70Z" fill="${SKIN}" stroke="#C8907A" stroke-width="1.5"/><ellipse cx="100" cy="96" rx="40" ry="18" fill="#D88878"/>`, `<circle cx="100" cy="188" r="30" fill="#E8907A" stroke="#B8604A" stroke-width="2"/>`),
      explanation: "直径1 cm以上。真皮や皮下に及ぶことが多い。" },
    { ...M, id: "vesicle", answer: "水疱", caption: "透明な液がたまって盛り上がる",
      svg: frame(`<path d="M70 72 Q100 36 130 72Z" fill="#DFF2FA" stroke="#5A8AA0" stroke-width="2"/>`, `<circle cx="100" cy="188" r="22" fill="#E6F6FC" stroke="#5A8AA0" stroke-width="2"/><circle cx="92" cy="180" r="5" fill="#fff"/>`),
      explanation: "表皮内か表皮下に液がたまる。どこで裂けるかで病気が分かれる。" },
    { ...M, id: "pustule", answer: "膿疱", caption: "黄色い液（白血球）がたまる",
      svg: frame(`<path d="M76 72 Q100 42 124 72Z" fill="#F7E07A" stroke="#B8A040" stroke-width="2"/>`, `${[[80, 184], [112, 192], [96, 206], [124, 174]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#F7E07A" stroke="#B8A040" stroke-width="2"/>`).join("")}`),
      explanation: "中身が膿。無菌性のこともある（膿疱性乾癬、掌蹠膿疱症）。" },
    { ...M, id: "wheal", answer: "膨疹", caption: "平たく盛り上がり、数時間で消える",
      svg: frame(`<path d="M40 70 C60 56 140 56 160 70Z" fill="#FBE4D8" stroke="#E8908A" stroke-width="2"/><rect x="40" y="82" width="120" height="14" fill="#F2A0A0" opacity=".5"/>`, `<path d="M60 180 C70 160 110 160 120 172 C140 160 150 190 136 200 C130 214 90 216 80 206 C60 210 50 194 60 180Z" fill="#FBE4D8" stroke="#E8505A" stroke-width="4"/>`),
      explanation: "真皮の一時的なむくみ。24時間以内に跡を残さず消える。じんましん。" },
    { ...M, id: "pigment", answer: "色素斑", caption: "平らで茶色〜黒",
      svg: frame(`<rect x="70" y="78" width="60" height="4" fill="#6B3E22"/>`, `<ellipse cx="100" cy="188" rx="30" ry="22" fill="#8A5A3A"/>`),
      explanation: "メラニンなどが増えた平らな斑。カフェオレ斑、雀卵斑など。" },
  ],
};
