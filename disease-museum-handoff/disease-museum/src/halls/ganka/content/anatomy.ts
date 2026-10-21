// 眼球のどこ？（共通ゲーム tapMap）。模式図。TODO(review)
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const svg = `<rect width="320" height="240" fill="#FFF8F0"/>
  <circle cx="170" cy="120" r="96" fill="#fff" stroke="#1C1537" stroke-width="3"/>
  <circle cx="170" cy="120" r="88" fill="#FDF0E6"/>
  <path d="M80 120 A90 90 0 0 1 260 120 A90 90 0 0 1 80 120" fill="none" stroke="#D9622B" stroke-width="6" stroke-dasharray="0" opacity=".7" transform="rotate(0)"/>
  <path d="M86 80 Q66 120 86 160" fill="none" stroke="#9EC8FF" stroke-width="10"/>
  <ellipse cx="112" cy="120" rx="14" ry="30" fill="#F0E8C0" stroke="#B8A040" stroke-width="2"/>
  <path d="M96 84 L104 92 M96 156 L104 148" stroke="#6A8AC8" stroke-width="6"/>
  <path d="M262 112 L310 104 L310 136 L262 128Z" fill="#F7D08A" stroke="#1C1537" stroke-width="2"/>
  <text x="300" y="98" text-anchor="end" font-size="9" font-weight="800" fill="#7A5A50">視神経</text>
  <text x="40" y="226" font-size="10" font-weight="800" fill="#7A5A50">← 前（光が入る）</text>`;

export const anatomyContent: TapMapData = {
  question: "どこの病気？",
  stampAt: 4,
  figures: {
    eye: { viewBox: "0 0 320 240", ariaLabel: "眼球を横から切った模式図。左が前", svg, note: "左が前（角膜側）、右が後ろ（視神経側）",
      regions: [
        { id: "cornea", label: "角膜", shape: `<path d="M90 76 Q60 120 90 164 L80 164 Q50 120 80 76Z"/>` },
        { id: "angle", label: "隅角", shape: `<circle cx="96" cy="84" r="9"/>` },
        { id: "lens", label: "水晶体", shape: `<ellipse cx="112" cy="120" rx="16" ry="32"/>` },
        { id: "vitreous", label: "硝子体", shape: `<circle cx="180" cy="120" r="44"/>` },
        { id: "macula", label: "黄斑", shape: `<circle cx="256" cy="140" r="10"/>` },
        { id: "disc", label: "視神経乳頭", shape: `<circle cx="258" cy="120" r="9"/>` },
      ] },
  },
  cases: [
    { ...M, id: "cataract", figure: "eye", prompt: "75歳 女性。ゆっくり全体がかすみ、まぶしい。", answer: ["lens"],
      followUp: { question: "治療は？", options: ["濁った水晶体を取り、眼内レンズを入れる", "点眼だけで治る", "レーザーで網膜を焼く", "眼鏡で治る"], answer: 0 },
      explanation: "白内障。加齢のほか、糖尿病・ステロイド・アトピー性皮膚炎・外傷でも。" },
    { ...M, id: "aacg", figure: "eye", prompt: "65歳 女性。遠視。夜、急に目が痛み、頭痛と吐き気。光の周りに虹が見える。", answer: ["angle"],
      followUp: { question: "使ってはいけない薬は？", options: ["散瞳薬（抗コリン薬）", "縮瞳薬（ピロカルピン）", "高浸透圧薬（マンニトール）", "炭酸脱水酵素阻害薬"], answer: 0 },
      explanation: "急性閉塞隅角緑内障。隅角がふさがり眼圧が急上昇。散瞳で悪化。レーザー虹彩切開術。" },
    { ...M, id: "amd", figure: "eye", prompt: "78歳 男性。喫煙者。まっすぐの線がゆがんで見え、真ん中が見えにくい。", answer: ["macula"],
      followUp: { question: "滲出型の治療は？", options: ["抗VEGF薬の硝子体注射", "白内障手術", "眼鏡", "抗菌薬の点眼"], answer: 0 },
      explanation: "加齢黄斑変性。Amslerチャートでゆがみを調べる。" },
    { ...M, id: "keratoconus", figure: "eye", prompt: "18歳 男性。アトピー。乱視が強くなり、眼鏡で合わない。角膜が円錐状に出っぱる。", answer: ["cornea"],
      followUp: { question: "考えるのは？", options: ["円錐角膜", "白内障", "緑内障", "網膜剝離"], answer: 0 },
      explanation: "角膜が薄くなって前に出る。ハードコンタクトレンズ、角膜クロスリンキング。" },
    { ...M, id: "vh", figure: "eye", prompt: "60歳 男性。糖尿病。急に墨を流したように見えなくなった。眼底が見えない。", answer: ["vitreous"],
      followUp: { question: "原因は？", options: ["増殖網膜症の新生血管からの硝子体出血", "白内障", "結膜炎", "ドライアイ"], answer: 0 },
      explanation: "硝子体出血。吸収されなければ硝子体手術。" },
    { ...M, id: "glaucoma", figure: "eye", prompt: "55歳 女性。健診で、眼圧は正常だが視野が少し欠けていると言われた。", answer: ["disc"],
      followUp: { question: "日本人に最も多い緑内障は？", options: ["正常眼圧緑内障", "急性閉塞隅角緑内障", "先天緑内障", "ステロイド緑内障"], answer: 0 },
      explanation: "視神経乳頭の陥凹拡大と視野欠損。眼圧が正常でも眼圧を下げる点眼で進行を遅らせる。" },
  ],
};
